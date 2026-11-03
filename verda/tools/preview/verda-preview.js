/*
 * Verda store preview: cart, checkout and search running in the browser,
 * so the static preview behaves like the real WooCommerce store.
 * Nothing is sent anywhere; the cart lives in this browser only.
 * window.VERDA_CATALOG is defined in verda-catalog.js.
 */
(function () {
	'use strict';

	var CAT = window.VERDA_CATALOG || { products: [], freeFrom: 499, shipping: 49 };
	var KEY = 'verda-preview-cart';
	var memory = [];

	/* ---------- helpers ---------- */
	function rupees(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
	function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
	function bySlug(slug) { for (var i = 0; i < CAT.products.length; i++) { if (CAT.products[i].slug === slug) { return CAT.products[i]; } } return null; }
	function bySku(sku) {
		for (var i = 0; i < CAT.products.length; i++) {
			var p = CAT.products[i];
			for (var j = 0; j < p.variants.length; j++) { if (p.variants[j].sku === sku) { return { p: p, v: p.variants[j] }; } }
		}
		return null;
	}
	function variant(p, label) { for (var j = 0; j < p.variants.length; j++) { if (p.variants[j].label === label) { return p.variants[j]; } } return null; }
	function pageFile() { return (location.pathname.split('/').pop() || 'index.html'); }

	function load() {
		try { var raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return memory; }
	}
	function save(cart) {
		memory = cart;
		try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* private mode: keep in memory */ }
		updateCount();
	}
	function lines() {
		return load().map(function (it) {
			var p = bySlug(it.slug), v = p && variant(p, it.label);
			return p && v ? { p: p, v: v, qty: it.qty } : null;
		}).filter(Boolean);
	}
	function totals(ls) {
		var sub = ls.reduce(function (s, l) { return s + l.v.price * l.qty; }, 0);
		var ship = sub === 0 || sub >= CAT.freeFrom ? 0 : CAT.shipping;
		return { sub: sub, ship: ship, total: sub + ship, count: ls.reduce(function (s, l) { return s + l.qty; }, 0) };
	}
	function add(slug, label, qty) {
		var cart = load(), found = false;
		cart.forEach(function (it) { if (it.slug === slug && it.label === label) { it.qty += qty; found = true; } });
		if (!found) { cart.push({ slug: slug, label: label, qty: qty }); }
		save(cart);
	}
	function updateCount() {
		var n = totals(lines()).count;
		document.querySelectorAll('.fc-cart-count').forEach(function (el) { el.textContent = n; });
	}

	var toastTimer;
	function toast(html) {
		var el = document.querySelector('.vp-toast');
		if (!el) { el = document.createElement('div'); el.className = 'vp-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
		el.innerHTML = html; el.hidden = false;
		clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 3500);
	}

	/* ---------- links: cart and account ---------- */
	function wireLinks() {
		document.querySelectorAll('.fc-action-cart').forEach(function (a) { a.setAttribute('href', 'cart.html'); });
		document.querySelectorAll('a[href="#vp-off"]').forEach(function (a) {
			var t = a.textContent.trim().toLowerCase();
			if (t === 'cart') { a.setAttribute('href', 'cart.html'); }
			if (t === 'checkout') { a.setAttribute('href', 'checkout.html'); }
		});
	}

	/* ---------- add to cart ---------- */
	document.addEventListener('click', function (e) {
		var a = e.target.closest('a,button');
		if (!a) { return; }
		var href = a.getAttribute('href') || '';

		// Product cards: simple products add straight away; "Select options" opens the product page.
		if (a.matches('.add_to_cart_button') && !a.matches('.product_type_variable')) {
			var hit = bySku(a.getAttribute('data-product_sku') || '');
			if (hit) {
				e.preventDefault(); e.stopImmediatePropagation();
				add(hit.p.slug, hit.v.label, 1);
				toast('Added <strong>' + esc(hit.p.name) + '</strong> to your cart. <a href="cart.html">View cart</a>');
				return;
			}
		}

		// Product page button.
		if (a.matches('.single_add_to_cart_button')) {
			e.preventDefault(); e.stopImmediatePropagation();
			var slug = pageFile().replace(/^product-/, '').replace(/\.html$/, '');
			var p = bySlug(slug);
			if (!p) { return; }
			var form = a.closest('form');
			var qty = Math.max(1, parseInt((form && form.querySelector('input.qty') || {}).value, 10) || 1);
			var label = p.variants[0].label;
			if (p.variants.length > 1) {
				var sel = form && form.querySelector('select[name^="attribute_"]');
				label = sel ? sel.value : '';
				if (!label) { toast('Please choose a ' + esc(p.attr.toLowerCase()) + ' first.'); return; }
			}
			add(p.slug, label, qty);
			toast('Added <strong>' + esc(p.name) + (p.variants.length > 1 ? ' – ' + esc(label) : '') + '</strong> to your cart. <a href="cart.html">View cart</a>');
			return;
		}

		if (href === '#vp-off') {
			e.preventDefault();
			toast('Customer accounts will work on the live website.');
		}
	}, true);

	/* ---------- other forms ---------- */
	document.addEventListener('submit', function (e) {
		var f = e.target;
		e.preventDefault();
		if (f.matches('.woocommerce-ordering')) { return; }
		if (f.matches('form.cart')) { var b = f.querySelector('.single_add_to_cart_button'); if (b) { b.click(); } return; }
		toast('Thanks! This is a preview, so nothing was sent. On the live website this form will work.');
	});

	/* ---------- search ---------- */
	function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
	function wireSearch() {
		document.querySelectorAll('form.fc-header-search').forEach(function (form) {
			var input = form.querySelector('input[type=search]');
			var cat = form.querySelector('select');
			var panel = document.createElement('div');
			panel.className = 'vp-search'; panel.hidden = true;
			document.body.appendChild(panel);
			function place() {
				var r = form.getBoundingClientRect();
				panel.style.left = (r.left + window.scrollX) + 'px';
				panel.style.top = (r.bottom + window.scrollY + 6) + 'px';
				panel.style.width = r.width + 'px';
			}
			window.addEventListener('resize', function () { if (!panel.hidden) { place(); } });
			function run() {
				var q = input.value.trim().toLowerCase();
				var c = cat ? cat.value : '';
				if (!q && !c) { panel.hidden = true; return; }
				var words = q.split(/\s+/).filter(Boolean);
				var res = CAT.products.filter(function (p) {
					var hay = (p.name + ' ' + p.cat + ' ' + p.variants.map(function (v) { return v.label; }).join(' ')).toLowerCase();
					return (!c || slugify(p.cat) === c) && words.every(function (w) { return hay.indexOf(w) !== -1; });
				});
				// Products whose own name matches come before those matching only by category.
				function score(p) { var n = p.name.toLowerCase(); return words.filter(function (w) { return n.indexOf(w) !== -1; }).length; }
				res = res.map(function (p, i) { return { p: p, s: score(p), i: i }; })
					.sort(function (a, b) { return b.s - a.s || a.i - b.i; }).map(function (x) { return x.p; });
				panel.innerHTML = res.length ? res.slice(0, 8).map(function (p) {
					var v = p.variants[0];
					return '<a class="vp-search-item" href="' + p.url + '"><img src="' + v.image + '" alt=""><span><strong>' + esc(p.name) + '</strong><small>' + esc(p.cat) + ' · from ' + rupees(Math.min.apply(null, p.variants.map(function (x) { return x.price; }))) + '</small></span></a>';
				}).join('') + (res.length > 8 ? '<div class="vp-search-more">' + (res.length - 8) + ' more — keep typing to narrow down</div>' : '')
					: '<div class="vp-search-more">No products found for “' + esc(input.value) + '”.</div>';
				place(); panel.hidden = false;
			}
			input.addEventListener('input', run);
			if (cat) { cat.addEventListener('change', run); }
			input.addEventListener('focus', function () { if (input.value) { run(); } });
			document.addEventListener('click', function (e) { if (!form.contains(e.target) && !panel.contains(e.target)) { panel.hidden = true; } });
			form.addEventListener('submit', function (e) { e.preventDefault(); e.stopImmediatePropagation(); run(); }, true);
		});
	}

	/* ---------- cart page ---------- */
	function renderCart(root) {
		var ls = lines(), t = totals(ls);
		if (!ls.length) {
			root.innerHTML = '<div class="vp-empty"><p>Your cart is empty.</p><a class="fc-btn" href="shop.html">Continue shopping</a></div>';
			return;
		}
		root.innerHTML = '<div class="vp-cart"><div class="vp-lines">' + ls.map(function (l, i) {
			return '<div class="vp-line" data-i="' + i + '">' +
				'<a href="' + l.p.url + '"><img src="' + l.v.image + '" alt=""></a>' +
				'<div class="vp-line-info"><a href="' + l.p.url + '"><strong>' + esc(l.p.name) + '</strong></a>' +
				(l.p.variants.length > 1 ? '<small>' + esc(l.p.attr) + ': ' + esc(l.v.label) + '</small>' : '<small>' + esc(l.v.label) + '</small>') +
				'<span class="vp-price">' + (l.v.mrp > l.v.price ? '<del>' + rupees(l.v.mrp) + '</del> ' : '') + rupees(l.v.price) + '</span></div>' +
				'<div class="vp-qty"><button type="button" data-d="-1" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button type="button" data-d="1" aria-label="Increase quantity">+</button></div>' +
				'<div class="vp-line-total">' + rupees(l.v.price * l.qty) + '<button type="button" class="vp-remove">Remove</button></div></div>';
		}).join('') + '</div>' + summary(t, '<a class="fc-btn vp-wide" href="checkout.html">Proceed to checkout</a>') + '</div>';

		root.querySelectorAll('.vp-line').forEach(function (row) {
			var i = +row.getAttribute('data-i');
			row.addEventListener('click', function (e) {
				var cart = load(), b = e.target.closest('button');
				if (!b) { return; }
				if (b.classList.contains('vp-remove')) { cart.splice(i, 1); }
				else { cart[i].qty = Math.max(1, cart[i].qty + (+b.getAttribute('data-d'))); }
				save(cart); renderCart(root);
			});
		});
	}

	function summary(t, action) {
		var gap = CAT.freeFrom - t.sub;
		return '<aside class="vp-summary"><h2>Order summary</h2>' +
			'<div><span>Subtotal</span><span>' + rupees(t.sub) + '</span></div>' +
			'<div><span>Delivery</span><span>' + (t.ship ? rupees(t.ship) : 'Free') + '</span></div>' +
			(t.ship ? '<p class="vp-note">Add ' + rupees(gap) + ' more for free delivery.</p>' : '') +
			'<div class="vp-total"><span>Total</span><span>' + rupees(t.total) + '</span></div>' + action + '</aside>';
	}

	/* ---------- checkout ---------- */
	var STATES = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

	function field(id, label, type, extra) {
		return '<p class="vp-field"><label for="vp-' + id + '">' + label + '</label><input id="vp-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || '') + '><span class="vp-err" hidden></span></p>';
	}

	function renderCheckout(root) {
		var ls = lines(), t = totals(ls);
		if (!ls.length) { renderCart(root); return; }
		root.innerHTML = '<form class="vp-cart vp-checkout" novalidate><div class="vp-form">' +
			'<h2>Contact</h2>' + field('email', 'Email address', 'email', 'autocomplete="email" required') + field('phone', 'Mobile number', 'tel', 'autocomplete="tel" inputmode="numeric" required') +
			'<h2>Delivery address</h2><div class="vp-row">' + field('first', 'First name', 'text', 'autocomplete="given-name" required') + field('last', 'Last name', 'text', 'autocomplete="family-name" required') + '</div>' +
			field('address', 'Address', 'text', 'autocomplete="address-line1" required') +
			'<div class="vp-row">' + field('city', 'City', 'text', 'autocomplete="address-level2" required') +
			'<p class="vp-field"><label for="vp-state">State</label><select id="vp-state" name="state" required><option value="">Choose…</option>' + STATES.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select><span class="vp-err" hidden></span></p></div>' +
			field('pin', 'PIN code', 'text', 'autocomplete="postal-code" inputmode="numeric" maxlength="6" required') +
			'<h2>Payment</h2><label class="vp-pay"><input type="radio" checked> <span><strong>Cash on Delivery</strong><small>Pay with cash or UPI when your order is delivered.</small></span></label>' +
			'<p class="vp-note">This is a preview — no order is placed and nothing you type here is sent anywhere.</p></div>' +
			summary(t, '<button type="submit" class="fc-btn vp-wide">Place order · ' + rupees(t.total) + '</button>') + '</form>';

		var form = root.querySelector('form');
		form.addEventListener('input', function (e) {
			var err = e.target.parentNode.querySelector('.vp-err');
			if (err && !err.hidden) { err.hidden = true; e.target.setAttribute('aria-invalid', 'false'); }
		});
		form.addEventListener('change', function (e) {
			var err = e.target.parentNode.querySelector('.vp-err');
			if (err && !err.hidden && e.target.value) { err.hidden = true; e.target.setAttribute('aria-invalid', 'false'); }
		});
		form.addEventListener('submit', function (e) {
			e.preventDefault(); e.stopImmediatePropagation();
			var ok = true;
			function check(id, test, msg) {
				var el = form.querySelector('#vp-' + id), err = el.parentNode.querySelector('.vp-err');
				var bad = !test(el.value.trim());
				err.textContent = bad ? msg : ''; err.hidden = !bad; el.setAttribute('aria-invalid', bad ? 'true' : 'false');
				if (bad && ok) { el.focus(); ok = false; }
			}
			check('email', function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }, 'Enter a valid email address.');
			check('phone', function (v) { return /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')); }, 'Enter a 10-digit mobile number.');
			check('first', function (v) { return v.length > 0; }, 'Enter your first name.');
			check('last', function (v) { return v.length > 0; }, 'Enter your last name.');
			check('address', function (v) { return v.length > 3; }, 'Enter your address.');
			check('city', function (v) { return v.length > 1; }, 'Enter your city.');
			check('state', function (v) { return v.length > 0; }, 'Choose your state.');
			check('pin', function (v) { return /^[1-9]\d{5}$/.test(v); }, 'Enter a 6-digit PIN code.');
			if (!ok) { return; }
			var order = { no: 'VRD' + Math.floor(10000 + Math.random() * 90000), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), lines: ls.map(function (l) { return { name: l.p.name + (l.p.variants.length > 1 ? ' – ' + l.v.label : ''), qty: l.qty, total: l.v.price * l.qty }; }), t: t, name: form.querySelector('#vp-first').value.trim() };
			save([]);
			renderThanks(root, order);
			window.scrollTo(0, 0);
		}, true);
	}

	function renderThanks(root, o) {
		var title = document.querySelector('.fc-page-title');
		if (title) { title.textContent = 'Order received'; }
		root.innerHTML = '<div class="vp-thanks"><p class="vp-big">Thank you, ' + esc(o.name) + '. Your order has been received.</p>' +
			'<ul class="vp-meta"><li><small>Order number</small><strong>' + o.no + '</strong></li><li><small>Date</small><strong>' + o.date + '</strong></li><li><small>Total</small><strong>' + rupees(o.t.total) + '</strong></li><li><small>Payment</small><strong>Cash on Delivery</strong></li></ul>' +
			'<p>Pay with cash or UPI upon delivery.</p><table class="vp-table"><thead><tr><th>Product</th><th>Total</th></tr></thead><tbody>' +
			o.lines.map(function (l) { return '<tr><td>' + esc(l.name) + ' × ' + l.qty + '</td><td>' + rupees(l.total) + '</td></tr>'; }).join('') +
			'</tbody><tfoot><tr><th>Subtotal</th><td>' + rupees(o.t.sub) + '</td></tr><tr><th>Delivery</th><td>' + (o.t.ship ? rupees(o.t.ship) : 'Free') + '</td></tr><tr><th>Total</th><td>' + rupees(o.t.total) + '</td></tr></tfoot></table>' +
			'<p class="vp-note">Preview only — on the live website this order would appear in your WordPress admin and you would get an email.</p>' +
			'<a class="fc-btn" href="shop.html">Continue shopping</a></div>';
	}

	/* ---------- start ---------- */
	function start() {
		wireLinks();
		wireSearch();
		updateCount();
		var app = document.getElementById('vp-app');
		if (app) { (app.getAttribute('data-view') === 'checkout' ? renderCheckout : renderCart)(app); }
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
	window.addEventListener('storage', updateCount);
}());
