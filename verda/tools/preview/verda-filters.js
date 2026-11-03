/*
 * Verda preview: shop filters (category, product, pack size, flavour, price) with
 * cascading counts, plus sorting, all in the browser. Uses window.VERDA_CATALOG.
 * Within one filter the choices are OR; across filters they are AND. Each filter's
 * counts are worked out from the other filters, so choices that would give no results
 * are disabled.
 */
(function () {
	'use strict';
	var CAT = window.VERDA_CATALOG;
	var list = document.querySelector('ul.products[data-vp-filter]');
	var panel = document.getElementById('vp-filters');
	if (!CAT || !list || !panel) { return; }

	function rupees(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

	/* ---------- product data ---------- */
	function typeOf(p) {
		var s = p.slug;
		if (/ghee/.test(s)) { return 'Ghee'; }
		if (/oil/.test(s)) { return 'Oils'; }
		if (/puffs/.test(s)) { return 'Millet Puffs'; }
		if (/makhana/.test(s)) { return 'Makhana'; }
		if (/besan/.test(s)) { return 'Besan'; }
		if (/atta/.test(s)) { return 'Atta'; }
		return 'Dals & Pulses';
	}
	function sizeOf(p, v) {
		var m = String(v.size || v.label).match(/^[\d.]+\s*(ml|L|g|kg)/i);
		return m ? m[0].replace(/\s+/, ' ') : '';
	}
	function sizeKey(s) {
		var m = s.match(/([\d.]+)\s*(ml|L|g|kg)/i); if (!m) { return 1e9; }
		var n = parseFloat(m[1]), u = m[2].toLowerCase();
		// Volumes (ml, L) first, then weights (g, kg), each smallest first.
		return (u === 'g' || u === 'kg' ? 1e7 : 0) + (u === 'kg' || u === 'l' ? n * 1000 : n);
	}
	var PRICES = [
		{ id: 'u200', label: 'Under ₹200', test: function (x) { return x < 200; } },
		{ id: '200-499', label: '₹200 – ₹499', test: function (x) { return x >= 200 && x < 500; } },
		{ id: '500-999', label: '₹500 – ₹999', test: function (x) { return x >= 500 && x < 1000; } },
		{ id: '1000', label: '₹1,000 & above', test: function (x) { return x >= 1000; } }
	];
	var items = CAT.products.map(function (p) {
		var li = list.querySelector('li[data-slug="' + p.slug + '"]');
		return {
			p: p, li: li, cat: p.cat, type: typeOf(p),
			variants: p.variants.map(function (v) {
				return { size: sizeOf(p, v), flavour: p.attr === 'Flavour' ? v.label : '', price: v.price };
			})
		};
	}).filter(function (it) { return it.li; });

	var FACETS = [
		{ key: 'cat', title: 'Category', level: 'product' },
		{ key: 'type', title: 'Product', level: 'product' },
		{ key: 'size', title: 'Pack size', level: 'variant' },
		{ key: 'flavour', title: 'Flavour', level: 'variant' },
		{ key: 'price', title: 'Price', level: 'variant' }
	];
	function values(key) {
		var seen = {}, out = [];
		items.forEach(function (it) {
			var vals = key === 'cat' || key === 'type' ? [it[key]] : it.variants.map(function (v) { return v[key]; });
			vals.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
		});
		if (key === 'size') { out.sort(function (a, b) { return sizeKey(a) - sizeKey(b) || a.localeCompare(b); }); }
		if (key === 'price') { return PRICES.map(function (r) { return r.id; }); }
		return out;
	}
	FACETS.forEach(function (f) { f.values = values(f.key); });

	/* ---------- state (kept in the address so Back works and links can be shared) ---------- */
	var state = {}, sort = 'menu_order';
	function slug(s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
	function readHash() {
		state = {}; sort = 'menu_order';
		location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
			var a = kv.split('='); if (!a[1]) { return; }
			var vals = decodeURIComponent(a[1]).split(',');
			if (a[0] === 'sort') { sort = vals[0]; return; }
			var f = FACETS.filter(function (x) { return x.key === a[0]; })[0]; if (!f) { return; }
			state[f.key] = f.values.filter(function (v) { return vals.indexOf(slug(v)) !== -1; });
		});
	}
	function writeHash() {
		var parts = [];
		FACETS.forEach(function (f) { if (state[f.key] && state[f.key].length) { parts.push(f.key + '=' + state[f.key].map(slug).join(',')); } });
		if (sort !== 'menu_order') { parts.push('sort=' + sort); }
		var h = parts.length ? '#' + parts.join('&') : ' ';
		history.replaceState(null, '', h === ' ' ? location.pathname + location.search : h);
	}

	/* ---------- matching ---------- */
	function sel(key, except) { return key === except ? [] : (state[key] || []); }
	function variantOk(v, except) {
		var s = sel('size', except), fl = sel('flavour', except), pr = sel('price', except);
		if (s.length && s.indexOf(v.size) === -1) { return false; }
		if (fl.length && fl.indexOf(v.flavour) === -1) { return false; }
		if (pr.length && !pr.some(function (id) { return PRICES.filter(function (r) { return r.id === id; })[0].test(v.price); })) { return false; }
		return true;
	}
	function matches(it, except) {
		var c = sel('cat', except), t = sel('type', except);
		if (c.length && c.indexOf(it.cat) === -1) { return false; }
		if (t.length && t.indexOf(it.type) === -1) { return false; }
		return it.variants.some(function (v) { return variantOk(v, except); });
	}
	function count(f, value) {
		var saved = state[f.key]; state[f.key] = [value];
		var n = items.filter(function (it) { return matches(it, null); }).length;
		state[f.key] = saved; return n;
	}

	/* ---------- panel ---------- */
	function label(f, v) { return f.key === 'price' ? PRICES.filter(function (r) { return r.id === v; })[0].label : v; }
	function render() {
		var active = 0;
		var html = '<div class="vp-f-head"><strong>Filters</strong><button type="button" class="vp-f-clear">Clear all</button></div>';
		FACETS.forEach(function (f) {
			var rows = f.values.map(function (v) {
				var on = (state[f.key] || []).indexOf(v) !== -1, n = count(f, v);
				if (on) { active++; }
				if (!n && !on && f.key === 'flavour') { return ''; }
				return '<label class="vp-f-opt' + (!n && !on ? ' is-off' : '') + '"><input type="checkbox" data-k="' + f.key + '" value="' + esc(v) + '"' + (on ? ' checked' : '') + (!n && !on ? ' disabled' : '') + '><span>' + esc(label(f, v)) + '</span><small>' + n + '</small></label>';
			}).join('');
			if (!rows) { return; }
			html += '<fieldset class="vp-f-group"><legend>' + f.title + '</legend>' + rows + '</fieldset>';
		});
		panel.querySelector('.vp-f-body').innerHTML = html;
		var btn = document.querySelector('.vp-f-toggle');
		if (btn) { btn.querySelector('span').textContent = active ? 'Filters (' + active + ')' : 'Filters'; }
		panel.querySelector('.vp-f-clear').hidden = !active;
	}

	/* ---------- results ---------- */
	function minPrice(it) {
		var ps = it.variants.filter(function (v) { return variantOk(v, null); }).map(function (v) { return v.price; });
		return ps.length ? Math.min.apply(null, ps) : 1e9;
	}
	function apply() {
		var shown = items.filter(function (it) { return matches(it, null); });
		var order = shown.slice();
		if (sort === 'price' || sort === 'price-desc') {
			order.sort(function (a, b) { return (minPrice(a) - minPrice(b)) * (sort === 'price' ? 1 : -1); });
		} else {
			var key = 'data-o-' + sort;
			order.sort(function (a, b) { return (+a.li.getAttribute(key) || 0) - (+b.li.getAttribute(key) || 0); });
		}
		items.forEach(function (it) { it.li.hidden = true; });
		order.forEach(function (it) { it.li.hidden = false; list.appendChild(it.li); });
		var rc = document.querySelector('.woocommerce-result-count');
		if (rc) { rc.textContent = shown.length === items.length ? 'Showing all ' + items.length + ' products' : 'Showing ' + shown.length + ' of ' + items.length + ' products'; }
		var empty = document.getElementById('vp-f-empty');
		empty.hidden = shown.length > 0;
		var so = document.querySelector('select.orderby'); if (so) { so.value = sort; }
		renderChips();
		render();
	}
	function renderChips() {
		var box = document.getElementById('vp-f-chips'), html = '';
		FACETS.forEach(function (f) {
			(state[f.key] || []).forEach(function (v) {
				html += '<button type="button" class="vp-chip" data-k="' + f.key + '" data-v="' + esc(v) + '">' + esc(label(f, v)) + ' <span aria-hidden="true">×</span><span class="screen-reader-text">Remove filter</span></button>';
			});
		});
		box.innerHTML = html; box.hidden = !html;
	}

	/* ---------- events ---------- */
	panel.addEventListener('change', function (e) {
		var cb = e.target; if (!cb.matches('input[type=checkbox]')) { return; }
		var k = cb.getAttribute('data-k'), cur = state[k] || [];
		state[k] = cb.checked ? cur.concat(cb.value) : cur.filter(function (x) { return x !== cb.value; });
		writeHash(); apply();
	});
	document.addEventListener('click', function (e) {
		var b = e.target.closest('.vp-f-clear, .vp-chip, .vp-f-toggle, .vp-f-done');
		if (!b) { return; }
		if (b.matches('.vp-f-clear')) { state = {}; writeHash(); apply(); }
		if (b.matches('.vp-chip')) { var k = b.getAttribute('data-k'); state[k] = (state[k] || []).filter(function (x) { return x !== b.getAttribute('data-v'); }); writeHash(); apply(); }
		if (b.matches('.vp-f-toggle')) { panel.classList.toggle('is-open'); b.setAttribute('aria-expanded', panel.classList.contains('is-open')); }
		if (b.matches('.vp-f-done')) { panel.classList.remove('is-open'); }
	});
	// Sorting keeps the filters (capture phase, before the page's own "Sort by" handler).
	document.addEventListener('change', function (e) {
		if (!e.target.matches('select.orderby')) { return; }
		e.stopImmediatePropagation(); sort = e.target.value; writeHash(); apply();
	}, true);
	window.addEventListener('hashchange', function () { readHash(); apply(); });

	readHash(); apply();
}());
