/*
 * Verda store preview: cart, checkout and search running in the browser,
 * so the static preview behaves like the real WooCommerce store.
 * Nothing is sent anywhere; the cart lives in this browser only.
 * window.VERDA_CATALOG is defined in verda-catalog.js.
 */
(function () {
	'use strict';

	var CAT = window.VERDA_CATALOG || { products: [], freeFrom: 1599, shipping: 49 };
	var KEY = 'verda-preview-cart';
	var memory = [];

	/* ---------- helpers ---------- */
	function rupees(n) { return '\u20b9' + Number(n).toLocaleString('en-IN'); }
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
			if (t === 'my account' || a.getAttribute('aria-label') === 'My account') { a.setAttribute('href', 'account.html'); }
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
			toast('Added <strong>' + esc(p.name) + (p.variants.length > 1 ? ' \u2013 ' + esc(label) : '') + '</strong> to your cart. <a href="cart.html">View cart</a>');
			return;
		}

		if (href === '#vp-off') {
			e.preventDefault();
			toast('This will work on the live website.');
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
					return '<a class="vp-search-item" href="' + p.url + '"><img src="' + v.image + '" alt=""><span><strong>' + esc(p.name) + '</strong><small>' + esc(p.cat) + ' \u00b7 from ' + rupees(Math.min.apply(null, p.variants.map(function (x) { return x.price; }))) + '</small></span></a>';
				}).join('') + (res.length > 8 ? '<div class="vp-search-more">' + (res.length - 8) + ' more \u2014 keep typing to narrow down</div>' : '')
					: '<div class="vp-search-more">No products found for \u201c' + esc(input.value) + '\u201d.</div>';
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
				'<div class="vp-qty"><button type="button" data-d="-1" aria-label="Decrease quantity">\u2212</button><span>' + l.qty + '</span><button type="button" data-d="1" aria-label="Increase quantity">+</button></div>' +
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

	/* ---------- accounts (kept in this browser only) ---------- */
	var UKEY = 'verda-preview-users', SKEY = 'verda-preview-session', OKEY = 'verda-preview-orders';
	var mem = {};
	function get(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (e) { return mem[k] || d; } }
	function put(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* memory only */ } }
	function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; } return 'h' + (h >>> 0).toString(36); }
	function users() { return get(UKEY, {}); }
	function me() { var e = get(SKEY, null), u = users(); return e && u[e] ? u[e] : null; }
	function saveUser(u) { var all = users(); all[u.email] = u; put(UKEY, all); }
	function login(email) { put(SKEY, email); }
	function logout() { put(SKEY, null); }
	var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
	function strong(p) { return p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p); }
	var PASS_HINT = 'Use at least 8 characters, with letters and numbers.';

	/* ---------- form helpers ---------- */
	var STATES = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
	function field(id, label, type, extra, value) {
		return '<p class="vp-field"><label for="vp-' + id + '">' + label + '</label><input id="vp-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || '') + (value ? ' value="' + esc(value) + '"' : '') + '><span class="vp-err" hidden></span></p>';
	}
	function stateField(value) {
		return '<p class="vp-field"><label for="vp-state">State</label><select id="vp-state" name="state" required><option value="">Choose\u2026</option>' + STATES.map(function (s) { return '<option' + (s === value ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><span class="vp-err" hidden></span></p>';
	}
	function addressFields(a) {
		a = a || {};
		return '<div class="vp-row">' + field('first', 'First name', 'text', 'autocomplete="given-name" required', a.first) + field('last', 'Last name', 'text', 'autocomplete="family-name" required', a.last) + '</div>' +
			field('address', 'Address', 'text', 'autocomplete="address-line1" required', a.address) +
			'<div class="vp-row">' + field('city', 'City', 'text', 'autocomplete="address-level2" required', a.city) + stateField(a.state) + '</div>' +
			field('pin', 'PIN code', 'text', 'autocomplete="postal-code" inputmode="numeric" maxlength="6" required', a.pin);
	}
	function checker(form) {
		var api = { ok: true };
		api.check = function (id, test, msg) {
			var el = form.querySelector('#vp-' + id); if (!el) { return; }
			var err = el.parentNode.querySelector('.vp-err'), bad = !test(el.value.trim(), el.value);
			err.textContent = bad ? msg : ''; err.hidden = !bad; el.setAttribute('aria-invalid', bad ? 'true' : 'false');
			if (bad && api.ok) { el.focus(); api.ok = false; }
		};
		api.fail = function (id, msg) { api.check(id, function () { return false; }, msg); };
		return api;
	}
	function clearErrorsOnInput(form) {
		['input', 'change'].forEach(function (ev) {
			form.addEventListener(ev, function (e) {
				var err = e.target.parentNode && e.target.parentNode.querySelector('.vp-err');
				if (err && !err.hidden && e.target.value) { err.hidden = true; e.target.setAttribute('aria-invalid', 'false'); }
			});
		});
	}
	function checkAddress(c) {
		c.check('first', function (v) { return v.length > 0; }, 'Enter your first name.');
		c.check('last', function (v) { return v.length > 0; }, 'Enter your last name.');
		c.check('address', function (v) { return v.length > 3; }, 'Enter your address.');
		c.check('city', function (v) { return v.length > 1; }, 'Enter your city.');
		c.check('state', function (v) { return v.length > 0; }, 'Choose your state.');
		c.check('pin', function (v) { return /^[1-9]\d{5}$/.test(v); }, 'Enter a 6-digit PIN code.');
	}
	function readAddress(form) {
		var a = {}; ['first', 'last', 'address', 'city', 'state', 'pin'].forEach(function (k) { a[k] = form.querySelector('#vp-' + k).value.trim(); }); return a;
	}
	function validPhone(v) { return /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')); }

	/* ---------- checkout ---------- */
	function renderCheckout(root) {
		var ls = lines(), t = totals(ls), u = me();
		if (!ls.length) { renderCart(root); return; }
		root.innerHTML = '<form class="vp-cart vp-checkout" novalidate><div class="vp-form">' +
			(u ? '<p class="vp-note vp-ok">Logged in as <strong>' + esc(u.first || u.email) + '</strong> \u00b7 <a href="account.html">My account</a></p>'
				: '<p class="vp-login-hint">Returning customer? <a href="account.html?next=checkout">Log in</a> for faster checkout.</p>') +
			'<h2>Contact</h2>' + field('email', 'Email address', 'email', 'autocomplete="email" required', u && u.email) + field('phone', 'Mobile number', 'tel', 'autocomplete="tel" inputmode="numeric" required', u && u.phone) +
			'<h2>Delivery address</h2>' + addressFields(u && u.addr) +
			(u ? '' : '<label class="vp-check"><input type="checkbox" id="vp-create"> <span>Create an account for faster checkout and order tracking</span></label>' +
				'<div id="vp-create-box" hidden>' + field('newpass', 'Choose a password', 'password', 'autocomplete="new-password"') + '<p class="vp-hint">' + PASS_HINT + '</p></div>') +
			'<h2>Payment</h2><label class="vp-pay"><input type="radio" checked> <span><strong>Cash on Delivery</strong><small>Pay with cash or UPI when your order is delivered.</small></span></label>' +
			'<p class="vp-note">This is a preview \u2014 no order is placed and nothing you type here is sent anywhere.</p></div>' +
			summary(t, '<button type="submit" class="fc-btn vp-wide">Place order \u00b7 ' + rupees(t.total) + '</button>') + '</form>';

		var form = root.querySelector('form');
		clearErrorsOnInput(form);
		var cb = form.querySelector('#vp-create');
		if (cb) { cb.addEventListener('change', function () { form.querySelector('#vp-create-box').hidden = !cb.checked; }); }
		form.addEventListener('submit', function (e) {
			e.preventDefault(); e.stopImmediatePropagation();
			var c = checker(form), email = form.querySelector('#vp-email').value.trim().toLowerCase();
			c.check('email', function (v) { return EMAIL.test(v); }, 'Enter a valid email address.');
			c.check('phone', validPhone, 'Enter a 10-digit mobile number.');
			checkAddress(c);
			var creating = cb && cb.checked;
			if (creating) {
				if (users()[email]) { c.fail('email', 'An account with this email already exists. Please log in.'); }
				c.check('newpass', function (v, raw) { return strong(raw); }, PASS_HINT);
			}
			if (!c.ok) { return; }
			var addr = readAddress(form), phone = form.querySelector('#vp-phone').value.trim();
			if (creating) {
				u = { email: email, first: addr.first, last: addr.last, phone: phone, pass: hash(form.querySelector('#vp-newpass').value), addr: addr };
				saveUser(u); login(email);
			} else if (u) {
				u.phone = u.phone || phone; u.addr = addr; saveUser(u);
			}
			var order = { no: 'VRD' + Math.floor(10000 + Math.random() * 90000), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), lines: ls.map(function (l) { return { name: l.p.name + (l.p.variants.length > 1 ? ' \u2013 ' + l.v.label : ''), qty: l.qty, total: l.v.price * l.qty }; }), t: t, name: addr.first, email: email, addr: addr, status: 'Processing' };
			if (u) { var all = get(OKEY, []); all.unshift(order); put(OKEY, all); }
			save([]);
			renderThanks(root, order, creating);
			window.scrollTo(0, 0);
		}, true);
	}

	function orderTable(o) {
		return '<table class="vp-table"><thead><tr><th>Product</th><th>Total</th></tr></thead><tbody>' +
			o.lines.map(function (l) { return '<tr><td>' + esc(l.name) + ' \u00d7 ' + l.qty + '</td><td>' + rupees(l.total) + '</td></tr>'; }).join('') +
			'</tbody><tfoot><tr><th>Subtotal</th><td>' + rupees(o.t.sub) + '</td></tr><tr><th>Delivery</th><td>' + (o.t.ship ? rupees(o.t.ship) : 'Free') + '</td></tr><tr><th>Total</th><td>' + rupees(o.t.total) + '</td></tr></tfoot></table>';
	}
	function addrText(a) { return a ? esc(a.first + ' ' + a.last) + '<br>' + esc(a.address) + '<br>' + esc(a.city) + ', ' + esc(a.state) + ' \u2013 ' + esc(a.pin) : ''; }

	function renderThanks(root, o, created) {
		var title = document.querySelector('.fc-page-title');
		if (title) { title.textContent = 'Order received'; }
		root.innerHTML = '<div class="vp-thanks"><p class="vp-big">Thank you, ' + esc(o.name) + '. Your order has been received.</p>' +
			(created ? '<p class="vp-note vp-ok">Your account has been created and you are logged in. You can track this order in <a href="account.html#orders">My account</a>.</p>' : (me() ? '<p>You can track this order in <a href="account.html#orders">My account</a>.</p>' : '')) +
			'<ul class="vp-meta"><li><small>Order number</small><strong>' + o.no + '</strong></li><li><small>Date</small><strong>' + o.date + '</strong></li><li><small>Total</small><strong>' + rupees(o.t.total) + '</strong></li><li><small>Payment</small><strong>Cash on Delivery</strong></li></ul>' +
			'<p>Pay with cash or UPI upon delivery.</p>' + orderTable(o) +
			'<p class="vp-note">Preview only \u2014 on the live website this order would appear in your WordPress admin and you would get an email.</p>' +
			'<a class="fc-btn" href="shop.html">Continue shopping</a></div>';
	}

	/* ---------- My account ---------- */
	function setTitle(t) { var el = document.querySelector('.fc-page-title'); if (el) { el.textContent = t; } }
	function nextPage() { return /next=checkout/.test(location.search) ? 'checkout.html' : null; }

	function renderAuth(root, mode) {
		setTitle(mode === 'forgot' ? 'Lost password' : 'My account');
		if (mode === 'forgot') {
			root.innerHTML = '<div class="vp-auth vp-auth--one"><form class="vp-form" id="vp-forgot" novalidate><h2>Lost your password?</h2><p>Enter your email address and we will send you a link to set a new password.</p>' +
				field('femail', 'Email address', 'email', 'autocomplete="email"') + '<button type="submit" class="fc-btn">Send reset link</button><p class="vp-back"><a href="#" data-go="login">\u2190 Back to log in</a></p></form></div>';
			var f = root.querySelector('form'); clearErrorsOnInput(f);
			f.addEventListener('submit', function (e) {
				e.preventDefault(); e.stopImmediatePropagation();
				var c = checker(f); c.check('femail', function (v) { return EMAIL.test(v); }, 'Enter a valid email address.'); if (!c.ok) { return; }
				f.innerHTML = '<h2>Check your email</h2><p>If an account exists for <strong>' + esc(f.querySelector('#vp-femail').value.trim()) + '</strong>, a password reset link has been sent.</p><p class="vp-note">Preview only \u2014 on the live website the email really arrives.</p><a class="fc-btn" href="#" data-go="login">Back to log in</a>';
			}, true);
			return;
		}
		root.innerHTML = '<div class="vp-auth">' +
			'<form class="vp-form vp-card" id="vp-login" novalidate><h2>Log in</h2>' + field('lemail', 'Email address', 'email', 'autocomplete="email"') + field('lpass', 'Password', 'password', 'autocomplete="current-password"') +
			'<label class="vp-check"><input type="checkbox" checked> <span>Remember me</span></label><button type="submit" class="fc-btn vp-wide">Log in</button><p class="vp-back"><a href="#" data-go="forgot">Lost your password?</a></p></form>' +
			'<form class="vp-form vp-card" id="vp-register" novalidate><h2>Create an account</h2>' +
			'<div class="vp-row">' + field('rfirst', 'First name', 'text', 'autocomplete="given-name"') + field('rlast', 'Last name', 'text', 'autocomplete="family-name"') + '</div>' +
			field('remail', 'Email address', 'email', 'autocomplete="email"') + field('rphone', 'Mobile number', 'tel', 'autocomplete="tel" inputmode="numeric"') + field('rpass', 'Password', 'password', 'autocomplete="new-password"') +
			'<p class="vp-hint">' + PASS_HINT + '</p><button type="submit" class="fc-btn vp-wide">Create account</button>' +
			'<p class="vp-hint">Your details are used to process your orders and manage your account, as described in our <a href="privacy-policy-2.html">privacy policy</a>.</p></form></div>' +
			'<p class="vp-note">Preview only \u2014 accounts here are saved in this browser, nothing is sent anywhere.</p>';
		var lf = root.querySelector('#vp-login'), rf = root.querySelector('#vp-register');
		clearErrorsOnInput(lf); clearErrorsOnInput(rf);
		lf.addEventListener('submit', function (e) {
			e.preventDefault(); e.stopImmediatePropagation();
			var c = checker(lf), email = lf.querySelector('#vp-lemail').value.trim().toLowerCase(), u = users()[email];
			c.check('lemail', function (v) { return EMAIL.test(v); }, 'Enter a valid email address.');
			c.check('lpass', function (v, raw) { return raw.length > 0; }, 'Enter your password.');
			if (c.ok && !u) { c.fail('lemail', 'No account found with this email. Create an account instead.'); }
			if (c.ok && u.pass !== hash(lf.querySelector('#vp-lpass').value)) { c.fail('lpass', 'The password is incorrect. Try again or reset it.'); }
			if (!c.ok) { return; }
			login(email); if (nextPage()) { location.href = nextPage(); } else { renderAccount(root); }
		}, true);
		rf.addEventListener('submit', function (e) {
			e.preventDefault(); e.stopImmediatePropagation();
			var c = checker(rf), email = rf.querySelector('#vp-remail').value.trim().toLowerCase();
			c.check('rfirst', function (v) { return v.length > 0; }, 'Enter your first name.');
			c.check('rlast', function (v) { return v.length > 0; }, 'Enter your last name.');
			c.check('remail', function (v) { return EMAIL.test(v); }, 'Enter a valid email address.');
			if (c.ok && users()[email]) { c.fail('remail', 'An account with this email already exists. Please log in.'); }
			c.check('rphone', validPhone, 'Enter a 10-digit mobile number.');
			c.check('rpass', function (v, raw) { return strong(raw); }, PASS_HINT);
			if (!c.ok) { return; }
			saveUser({ email: email, first: rf.querySelector('#vp-rfirst').value.trim(), last: rf.querySelector('#vp-rlast').value.trim(), phone: rf.querySelector('#vp-rphone').value.trim(), pass: hash(rf.querySelector('#vp-rpass').value), addr: null });
			login(email); if (nextPage()) { location.href = nextPage(); } else { renderAccount(root, 'dashboard', 'Your account has been created. Welcome to Verda!'); }
		}, true);
	}

	function renderAccount(root, tab, flash) {
		var u = me();
		if (!u) { renderAuth(root, 'login'); return; }
		tab = tab || (location.hash.replace('#', '') || 'dashboard');
		var orders = get(OKEY, []).filter(function (o) { return o.email === u.email; });
		setTitle('My account');
		var TABS = [['dashboard', 'Dashboard'], ['orders', 'Orders'], ['address', 'Address'], ['details', 'Account details']];
		var body = '';
		if (tab === 'orders') {
			body = '<h2>Orders</h2>' + (orders.length ? '<div class="vp-orders">' + orders.map(function (o, i) {
				return '<details class="vp-order"' + (i === 0 ? ' open' : '') + '><summary><span><strong>' + o.no + '</strong><small>' + o.date + '</small></span><span class="vp-status">' + o.status + '</span><span>' + rupees(o.t.total) + ' \u00b7 ' + o.lines.reduce(function (s, l) { return s + l.qty; }, 0) + ' items</span></summary>' +
					orderTable(o) + '<p><strong>Delivery address</strong><br>' + addrText(o.addr) + '</p><p><strong>Payment</strong>: Cash on Delivery</p></details>';
			}).join('') + '</div>' : '<div class="vp-empty"><p>No orders yet.</p><a class="fc-btn" href="shop.html">Browse products</a></div>');
		} else if (tab === 'address') {
			body = '<h2>Delivery address</h2><p>This address is filled in for you at checkout.</p><form class="vp-form" id="vp-addr" novalidate>' + field('phone', 'Mobile number', 'tel', 'inputmode="numeric"', u.phone) + addressFields(u.addr || { first: u.first, last: u.last }) + '<button type="submit" class="fc-btn">Save address</button></form>';
		} else if (tab === 'details') {
			body = '<h2>Account details</h2><form class="vp-form" id="vp-details" novalidate><div class="vp-row">' + field('dfirst', 'First name', 'text', '', u.first) + field('dlast', 'Last name', 'text', '', u.last) + '</div>' +
				field('demail', 'Email address', 'email', 'readonly', u.email) +
				'<fieldset class="vp-fs"><legend>Change password</legend>' + field('cur', 'Current password (leave blank to keep it)', 'password', 'autocomplete="current-password"') + field('np', 'New password', 'password', 'autocomplete="new-password"') + '<p class="vp-hint">' + PASS_HINT + '</p></fieldset>' +
				'<button type="submit" class="fc-btn">Save changes</button></form>';
		} else {
			body = '<p>Hello <strong>' + esc(u.first || u.email) + '</strong> (not ' + esc(u.first || u.email) + '? <a href="#" data-logout>Log out</a>)</p>' +
				'<p>From your account you can see your <a href="#orders">recent orders</a>, manage your <a href="#address">delivery address</a>, and edit your <a href="#details">password and account details</a>.</p>' +
				'<div class="vp-tiles"><a href="#orders"><strong>' + orders.length + '</strong><span>Orders</span></a><a href="#address"><strong>' + (u.addr ? '\u2713' : '\u2014') + '</strong><span>Saved address</span></a><a href="shop.html"><strong>27</strong><span>Products to explore</span></a></div>';
		}
		root.innerHTML = (flash ? '<p class="vp-note vp-ok">' + esc(flash) + '</p>' : '') +
			'<div class="vp-account"><nav class="vp-acc-nav" aria-label="My account">' + TABS.map(function (t) { return '<a href="#' + t[0] + '"' + (t[0] === tab ? ' aria-current="page"' : '') + '>' + t[1] + '</a>'; }).join('') + '<a href="#" data-logout>Log out</a></nav><div class="vp-acc-body">' + body + '</div></div>';
		var af = root.querySelector('#vp-addr');
		if (af) {
			clearErrorsOnInput(af);
			af.addEventListener('submit', function (e) {
				e.preventDefault(); e.stopImmediatePropagation();
				var c = checker(af); c.check('phone', validPhone, 'Enter a 10-digit mobile number.'); checkAddress(c); if (!c.ok) { return; }
				u.addr = readAddress(af); u.phone = af.querySelector('#vp-phone').value.trim(); saveUser(u);
				renderAccount(root, 'address', 'Address saved.');
			}, true);
		}
		var df = root.querySelector('#vp-details');
		if (df) {
			clearErrorsOnInput(df);
			df.addEventListener('submit', function (e) {
				e.preventDefault(); e.stopImmediatePropagation();
				var c = checker(df), cur = df.querySelector('#vp-cur').value, np = df.querySelector('#vp-np').value;
				c.check('dfirst', function (v) { return v.length > 0; }, 'Enter your first name.');
				c.check('dlast', function (v) { return v.length > 0; }, 'Enter your last name.');
				if (cur || np) {
					if (hash(cur) !== u.pass) { c.fail('cur', 'Your current password is incorrect.'); }
					c.check('np', function (v, raw) { return strong(raw); }, PASS_HINT);
				}
				if (!c.ok) { return; }
				u.first = df.querySelector('#vp-dfirst').value.trim(); u.last = df.querySelector('#vp-dlast').value.trim();
				if (np) { u.pass = hash(np); }
				saveUser(u); renderAccount(root, 'details', 'Account details saved.');
			}, true);
		}
	}

	function renderAccountPage(root) {
		function draw() { if (me()) { renderAccount(root); } else { renderAuth(root, 'login'); } }
		root.addEventListener('click', function (e) {
			var a = e.target.closest('[data-logout], [data-go]'); if (!a) { return; }
			e.preventDefault();
			if (a.hasAttribute('data-logout')) { logout(); history.replaceState(null, '', location.pathname); renderAuth(root, 'login'); window.scrollTo(0, 0); return; }
			renderAuth(root, a.getAttribute('data-go'));
		});
		window.addEventListener('hashchange', function () { if (me()) { renderAccount(root); window.scrollTo(0, 0); } });
		draw();
	}

	/* ---------- start ---------- */
	function start() {
		wireLinks();
		wireSearch();
		updateCount();
		var app = document.getElementById('vp-app');
		if (app) {
			var v = app.getAttribute('data-view');
			(v === 'checkout' ? renderCheckout : v === 'account' ? renderAccountPage : renderCart)(app);
		}
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
	window.addEventListener('storage', updateCount);
}());
