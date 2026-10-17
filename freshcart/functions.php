<?php
/**
 * FreshCart theme functions.
 *
 * @package FreshCart
 */

defined( 'ABSPATH' ) || exit;

define( 'FRESHCART_VERSION', '1.0.0' );
define( 'FRESHCART_DIR', get_template_directory() );
define( 'FRESHCART_URI', get_template_directory_uri() );

/**
 * Theme setup.
 */
function freshcart_setup() {
	load_theme_textdomain( 'freshcart', FRESHCART_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 60,
			'width'       => 200,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	// WooCommerce.
	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 400,
			'single_image_width'    => 700,
		)
	);
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	add_image_size( 'freshcart-blog', 600, 400, true );

	register_nav_menus(
		array(
			'primary'  => __( 'Primary Menu', 'freshcart' ),
			'footer-1' => __( 'Footer: Quick Links', 'freshcart' ),
			'footer-2' => __( 'Footer: Accounts', 'freshcart' ),
			'footer-3' => __( 'Footer: Policies', 'freshcart' ),
		)
	);

	$GLOBALS['content_width'] = 1320;
}
add_action( 'after_setup_theme', 'freshcart_setup' );

/**
 * Styles and scripts.
 */
function freshcart_assets() {
	wp_enqueue_style( 'freshcart-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', array(), null );
	wp_enqueue_style( 'freshcart-main', FRESHCART_URI . '/assets/css/main.css', array(), FRESHCART_VERSION );
	wp_enqueue_style( 'freshcart-style', get_stylesheet_uri(), array( 'freshcart-main' ), FRESHCART_VERSION );
	wp_add_inline_style( 'freshcart-main', freshcart_custom_colors_css() );

	wp_enqueue_script( 'freshcart-main', FRESHCART_URI . '/assets/js/main.js', array(), FRESHCART_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'freshcart_assets' );

/**
 * Output Customizer colours as CSS variables.
 *
 * @return string
 */
function freshcart_custom_colors_css() {
	$vars = array(
		'--fc-primary'   => get_theme_mod( 'freshcart_color_primary', '#1b8057' ),
		'--fc-secondary' => get_theme_mod( 'freshcart_color_secondary', '#1e6046' ),
		'--fc-dark'      => get_theme_mod( 'freshcart_color_dark', '#161925' ),
		'--fc-accent'    => get_theme_mod( 'freshcart_color_accent', '#eb5757' ),
		'--fc-highlight' => get_theme_mod( 'freshcart_color_highlight', '#1b8057' ),
	);
	$css = ':root{';
	foreach ( $vars as $name => $value ) {
		$css .= $name . ':' . sanitize_hex_color( $value ) . ';';
	}
	return $css . '}';
}

/**
 * Widget areas.
 */
function freshcart_widgets_init() {
	$defaults = array(
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	);
	register_sidebar(
		array_merge(
			$defaults,
			array(
				'name' => __( 'Blog Sidebar', 'freshcart' ),
				'id'   => 'sidebar-1',
			)
		)
	);
	register_sidebar(
		array_merge(
			$defaults,
			array(
				'name'        => __( 'Shop Sidebar', 'freshcart' ),
				'id'          => 'sidebar-shop',
				'description' => __( 'Filters shown on shop and category pages.', 'freshcart' ),
			)
		)
	);
}
add_action( 'widgets_init', 'freshcart_widgets_init' );

require FRESHCART_DIR . '/inc/template-tags.php';
require FRESHCART_DIR . '/inc/customizer.php';

if ( class_exists( 'WooCommerce' ) ) {
	require FRESHCART_DIR . '/inc/woocommerce.php';
}
