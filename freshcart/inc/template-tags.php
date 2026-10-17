<?php
/**
 * Template helpers.
 *
 * @package FreshCart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Inline SVG icon.
 *
 * @param string $name Icon name.
 * @return string
 */
function freshcart_icon( $name ) {
	$paths = array(
		'search'    => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
		'user'      => '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
		'heart'     => '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
		'cart'      => '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6.2"/>',
		'phone'     => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
		'mail'      => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
		'pin'       => '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
		'menu'      => '<path d="M3 6h18M3 12h18M3 18h18"/>',
		'close'     => '<path d="M6 6l12 12M18 6 6 18"/>',
		'grid'      => '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
		'arrow-l'   => '<path d="M15 18l-6-6 6-6"/>',
		'arrow-r'   => '<path d="M9 18l6-6-6-6"/>',
		'truck'     => '<path d="M1 4h14v12H1zM15 9h4l4 4v3h-8z"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="18.5" r="2"/>',
		'wallet'    => '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 15h2"/>',
		'refresh'   => '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
		'tag'       => '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
		'headset'   => '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
		'calendar'  => '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
		'facebook'  => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
		'instagram' => '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/>',
		'x'         => '<path d="M4 4l16 16M20 4 4 20"/>',
		'youtube'   => '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
		'apple'     => '<path d="M16 3c0 2-1.5 3.5-3.5 3.5C12.5 4.5 14 3 16 3zM12 7c-1.5 0-2.5-.8-4-.8C5.5 6.2 3.5 8.5 3.5 12c0 4.5 3 9 5 9 1.3 0 1.8-.8 3.5-.8s2.2.8 3.5.8c1.5 0 3.5-3 4.3-5.5-2-.8-3.3-2.6-3.3-4.7 0-1.8 1-3.3 2.4-4.1C18 5.6 16.5 6 15.5 6.5 14.5 7 13.3 7 12 7z"/>',
		'play'      => '<path d="M4 3v18l16-9z"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg class="fc-icon fc-icon-' . esc_attr( $name ) . '" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $paths[ $name ] . '</svg>';
}

/**
 * Escape text and turn new lines into <br>.
 *
 * @param string $text Text.
 * @return string
 */
function freshcart_multiline( $text ) {
	return nl2br( esc_html( $text ), false );
}

/**
 * A link URL, falling back to the shop page (or home).
 *
 * @param string $url URL from the Customizer.
 * @return string
 */
function freshcart_link( $url ) {
	if ( $url ) {
		return $url;
	}
	if ( function_exists( 'wc_get_page_permalink' ) ) {
		return wc_get_page_permalink( 'shop' );
	}
	return home_url( '/' );
}

/**
 * Section heading with optional carousel arrows / "see more" link.
 *
 * @param string $title  Title.
 * @param array  $args   arrows (bool), more_text, more_url.
 */
function freshcart_section_head( $title, $args = array() ) {
	$args = wp_parse_args(
		$args,
		array(
			'arrows'    => false,
			'more_text' => '',
			'more_url'  => '',
		)
	);
	?>
	<div class="fc-section-head">
		<h2 class="fc-section-title"><?php echo esc_html( $title ); ?></h2>
		<div class="fc-section-tools">
			<?php if ( $args['more_text'] ) : ?>
				<a class="fc-more" href="<?php echo esc_url( freshcart_link( $args['more_url'] ) ); ?>"><?php echo esc_html( $args['more_text'] ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></a>
			<?php endif; ?>
			<?php if ( $args['arrows'] ) : ?>
				<button type="button" class="fc-arrow" data-dir="-1" aria-label="<?php esc_attr_e( 'Previous', 'freshcart' ); ?>"><?php echo freshcart_icon( 'arrow-l' ); // phpcs:ignore ?></button>
				<button type="button" class="fc-arrow" data-dir="1" aria-label="<?php esc_attr_e( 'Next', 'freshcart' ); ?>"><?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></button>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

/**
 * Background-image style attribute (or nothing).
 *
 * @param string $url Image URL.
 * @return string
 */
function freshcart_bg( $url ) {
	return $url ? ' style="background-image:url(' . esc_url( $url ) . ')"' : '';
}

/**
 * Post meta line: date and author.
 */
function freshcart_posted_on() {
	printf(
		'<div class="fc-post-meta"><span>%1$s %2$s</span><span>%3$s %4$s</span></div>',
		freshcart_icon( 'calendar' ), // phpcs:ignore
		esc_html( get_the_date() ),
		freshcart_icon( 'user' ), // phpcs:ignore
		esc_html( get_the_author() )
	);
}

/**
 * Numbered pagination for archives.
 */
function freshcart_pagination() {
	the_posts_pagination(
		array(
			'mid_size'  => 2,
			'prev_text' => freshcart_icon( 'arrow-l' ),
			'next_text' => freshcart_icon( 'arrow-r' ),
		)
	);
}

/**
 * Fallback for menus that have not been assigned yet.
 *
 * @param array $args wp_nav_menu args.
 */
function freshcart_menu_fallback( $args ) {
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}
	printf(
		'<ul class="%1$s"><li><a href="%2$s">%3$s</a></li></ul>',
		esc_attr( $args['menu_class'] ),
		esc_url( admin_url( 'nav-menus.php' ) ),
		esc_html__( 'Add a menu', 'freshcart' )
	);
}
