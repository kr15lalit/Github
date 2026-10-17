/**
 * FreshCart front-end scripts (no jQuery needed).
 */
( function () {
	'use strict';

	var body = document.body;

	/* Mobile menu */
	var nav = document.getElementById( 'fc-mobile-nav' );
	var toggle = document.querySelector( '.fc-menu-toggle' );
	var closeBtn = document.querySelector( '.fc-menu-close' );

	function setNav( open ) {
		if ( ! nav || ! toggle ) {
			return;
		}
		nav.hidden = ! open;
		toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		body.classList.toggle( 'fc-nav-open', open );
		if ( open && closeBtn ) {
			closeBtn.focus();
		}
	}
	if ( toggle ) {
		toggle.addEventListener( 'click', function () {
			setNav( nav.hidden );
		} );
	}
	if ( closeBtn ) {
		closeBtn.addEventListener( 'click', function () {
			setNav( false );
			toggle.focus();
		} );
	}
	document.addEventListener( 'click', function ( e ) {
		if ( body.classList.contains( 'fc-nav-open' ) && ! nav.contains( e.target ) && ! toggle.contains( e.target ) ) {
			setNav( false );
		}
	} );
	document.addEventListener( 'keydown', function ( e ) {
		if ( 'Escape' === e.key && body.classList.contains( 'fc-nav-open' ) ) {
			setNav( false );
			toggle.focus();
		}
	} );

	/* Browse categories dropdown (click for touch screens) */
	var browse = document.querySelector( '.fc-browse' );
	if ( browse ) {
		var browseBtn = browse.querySelector( '.fc-browse-toggle' );
		browseBtn.addEventListener( 'click', function () {
			var open = browse.classList.toggle( 'is-open' );
			browseBtn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		} );
		document.addEventListener( 'click', function ( e ) {
			if ( ! browse.contains( e.target ) ) {
				browse.classList.remove( 'is-open' );
				browseBtn.setAttribute( 'aria-expanded', 'false' );
			}
		} );
	}

	/* Sticky navigation bar */
	var header = document.querySelector( '.fc-header' );
	var navBar = document.querySelector( '.fc-header-nav' );
	if ( header && navBar ) {
		var threshold = 0;
		var placeholder = document.createElement( 'div' );
		var measure = function () {
			threshold = header.offsetTop + header.offsetHeight + 100;
		};
		measure();
		window.addEventListener( 'resize', measure );
		window.addEventListener( 'scroll', function () {
			var sticky = window.scrollY > threshold && window.innerWidth > 991;
			if ( sticky === header.classList.contains( 'is-sticky' ) ) {
				return;
			}
			if ( sticky ) {
				placeholder.style.height = navBar.offsetHeight + 'px';
				navBar.parentNode.insertBefore( placeholder, navBar );
			} else if ( placeholder.parentNode ) {
				placeholder.parentNode.removeChild( placeholder );
			}
			header.classList.toggle( 'is-sticky', sticky );
		}, { passive: true } );
	}

	/* Carousels: arrows in a section scroll that section's track */
	document.querySelectorAll( '.fc-section' ).forEach( function ( section ) {
		var track = section.querySelector( '.fc-carousel-track' );
		var arrows = section.querySelectorAll( '.fc-arrow' );
		if ( ! track || ! arrows.length ) {
			return;
		}
		var update = function () {
			var max = track.scrollWidth - track.clientWidth - 2;
			arrows.forEach( function ( a ) {
				a.disabled = '-1' === a.dataset.dir ? track.scrollLeft <= 2 : track.scrollLeft >= max;
			} );
		};
		arrows.forEach( function ( a ) {
			a.addEventListener( 'click', function () {
				var item = track.firstElementChild;
				var gap = parseFloat( getComputedStyle( track ).columnGap ) || 0;
				var step = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
				track.scrollBy( { left: step * parseInt( a.dataset.dir, 10 ), behavior: 'smooth' } );
			} );
		} );
		track.addEventListener( 'scroll', update, { passive: true } );
		window.addEventListener( 'resize', update );
		update();
	} );

	/* Countdown */
	document.querySelectorAll( '.fc-countdown' ).forEach( function ( el ) {
		var end = parseInt( el.dataset.end, 10 ) * 1000;
		var parts = {};
		el.querySelectorAll( '[data-unit]' ).forEach( function ( b ) {
			parts[ b.dataset.unit ] = b;
		} );
		var pad = function ( n ) {
			return ( n < 10 ? '0' : '' ) + n;
		};
		var tick = function () {
			var left = Math.max( 0, Math.floor( ( end - Date.now() ) / 1000 ) );
			parts.days.textContent = pad( Math.floor( left / 86400 ) );
			parts.hours.textContent = pad( Math.floor( ( left % 86400 ) / 3600 ) );
			parts.mins.textContent = pad( Math.floor( ( left % 3600 ) / 60 ) );
			parts.secs.textContent = pad( left % 60 );
			if ( left > 0 ) {
				setTimeout( tick, 1000 );
			}
		};
		tick();
	} );
}() );
