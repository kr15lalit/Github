<?php
/**
 * Customizer options. Every homepage section is configured here
 * (Appearance → Customize → FreshCart …).
 *
 * @package FreshCart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Default value of every theme option, shared by the Customizer and the templates.
 *
 * @return array
 */
function freshcart_defaults() {
	return array(
		// Header.
		'topbar_enable'        => true,
		'topbar_address'       => '23/A Market Street Road, New York City',
		'topbar_email'         => 'info@yourstore.com',
		'topbar_text'          => 'Free delivery on orders over $50',
		'header_phone_label'   => 'Hotline Number',
		'header_phone'         => '+1 800 256 666',

		// Hero.
		'hero_enable'          => true,
		'hero_banner'          => '',
		'hero_banner_url'      => '',
		'hero_banner_alt'      => '',
		'hero_tagline'         => '100% Organic',
		'hero_title'           => "Providing Fresh Healthy\n& Organic Food",
		'hero_text'            => 'Save up to 30% — this offer is only for this week',
		'hero_btn_text'        => 'Shop Now',
		'hero_btn_url'         => '',
		'hero_image'           => '',
		'hero_price_label'     => 'Save',
		'hero_price'           => '$49',
		'hero_price_old'       => '$59',
		'hero_b1_title'        => "Creamy Fruits\nBaby Jem",
		'hero_b1_text'         => 'Only $12.99',
		'hero_b1_image'        => '',
		'hero_b1_url'          => '',
		'hero_b2_title'        => 'Organic Fruits',
		'hero_b2_text'         => 'Up to 25% off',
		'hero_b2_image'        => '',
		'hero_b2_url'          => '',
		'hero_b3_title'        => 'Kids Car Toys',
		'hero_b3_text'         => 'New arrivals',
		'hero_b3_image'        => '',
		'hero_b3_url'          => '',

		// Categories.
		'cats_enable'          => true,
		'cats_title'           => 'Popular Categories',
		'cats_number'          => 8,
		'cats_include'         => '',

		// Discounts.
		'sale_enable'          => true,
		'sale_title'           => 'Products With Discounts',
		'sale_number'          => 12,

		// Wide promo banner.
		'promo_enable'         => true,
		'promo_tagline'        => 'Healthy Life',
		'promo_title'          => "100% Organic Feed\nYour Family",
		'promo_text'           => 'Fresh produce delivered from local farms to your door.',
		'promo_btn_text'       => 'Shop Now',
		'promo_btn_url'        => '',
		'promo_image'          => '',

		// Trending.
		'trend_enable'         => true,
		'trend_title'          => 'Trending Products',
		'trend_number'         => 10,

		// Deal of the week.
		'deal_enable'          => true,
		'deal_title'           => 'Deal Of The Week',
		'deal_end'             => '',
		'deal_number'          => 8,
		'deal_more_text'       => 'See More',

		// Two banners.
		'dual_enable'          => true,
		'dual1_tagline'        => 'Weekend Offer',
		'dual1_title'          => 'Premium Mixed',
		'dual1_text'           => 'Nuts & dried fruits — up to 20% off',
		'dual1_image'          => '',
		'dual1_url'            => '',
		'dual2_tagline'        => 'Baby Care',
		'dual2_title'          => 'Baby Diaper',
		'dual2_text'           => 'Soft, safe and comfortable',
		'dual2_image'          => '',
		'dual2_url'            => '',

		// Blog.
		'blog_enable'          => true,
		'blog_title'           => 'Latest News & Blog',
		'blog_number'          => 4,

		// Features bar.
		'features_enable'      => true,
		'feat1_title'          => 'Free Shipping',
		'feat1_text'           => 'Orders $50 or more',
		'feat2_title'          => 'Save Money',
		'feat2_text'           => 'At lowest price',
		'feat3_title'          => '100% Return Policy',
		'feat3_text'           => 'Any time return product',
		'feat4_title'          => 'Best Deal Offer',
		'feat4_text'           => 'Grab your gear and go',
		'feat5_title'          => 'Support 24/7',
		'feat5_text'           => 'Contact us 24 hours a day',

		// Footer.
		'footer_about'         => 'Your neighbourhood store for fresh, healthy and organic groceries.',
		'footer_address'       => '23/A Market Street Road, New York City',
		'footer_phone'         => '+1 800 256 666',
		'footer_email'         => 'info@yourstore.com',
		'news_title'           => 'Sign Up Newsletter',
		'news_text'            => 'Get the latest deals and offers straight to your inbox.',
		'news_shortcode'       => '',
		'app_title'            => 'Download App on Mobile:',
		'app_text'             => '15% discount on your first purchase',
		'app_ios_url'          => '',
		'app_android_url'      => '',
		'social_facebook'      => '',
		'social_instagram'     => '',
		'social_x'             => '',
		'social_youtube'       => '',
		'copyright'            => '© {year} {site}. All Rights Reserved.',
	);
}

/**
 * Get a theme option with its default.
 *
 * @param string $key Option key without the freshcart_ prefix.
 * @return mixed
 */
function freshcart_mod( $key ) {
	$defaults = freshcart_defaults();
	return get_theme_mod( 'freshcart_' . $key, isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );
}

/**
 * Sanitize a checkbox.
 *
 * @param mixed $value Value.
 * @return bool
 */
function freshcart_sanitize_checkbox( $value ) {
	return (bool) $value;
}

/**
 * Sanitize a Y-m-d date.
 *
 * @param string $value Value.
 * @return string
 */
function freshcart_sanitize_date( $value ) {
	return preg_match( '/^\d{4}-\d{2}-\d{2}$/', $value ) ? $value : '';
}

/**
 * Register Customizer panels, sections and controls.
 *
 * @param WP_Customize_Manager $wp_customize Manager.
 */
function freshcart_customize_register( $wp_customize ) {
	$defaults = freshcart_defaults();

	// Colours go into the core "Colors" section.
	$colors = array(
		'primary'   => array( __( 'Primary Colour', 'freshcart' ), '#1b8057' ),
		'secondary' => array( __( 'Secondary (hover) Colour', 'freshcart' ), '#1e6046' ),
		'dark'      => array( __( 'Heading / Dark Colour', 'freshcart' ), '#161925' ),
		'accent'    => array( __( 'Sale Badge & Countdown Colour', 'freshcart' ), '#eb5757' ),
		'highlight' => array( __( 'Small Heading (Tagline) Colour', 'freshcart' ), '#1b8057' ),
	);
	foreach ( $colors as $key => $color ) {
		$wp_customize->add_setting(
			'freshcart_color_' . $key,
			array(
				'default'           => $color[1],
				'sanitize_callback' => 'sanitize_hex_color',
			)
		);
		$wp_customize->add_control(
			new WP_Customize_Color_Control(
				$wp_customize,
				'freshcart_color_' . $key,
				array(
					'label'   => $color[0],
					'section' => 'colors',
				)
			)
		);
	}

	$wp_customize->add_panel(
		'freshcart_panel',
		array(
			'title'    => __( 'FreshCart Theme Options', 'freshcart' ),
			'priority' => 30,
		)
	);

	/*
	 * Field types: text, textarea, url, image, checkbox, number, date.
	 */
	$sections = array(
		'header'   => array(
			__( 'Header', 'freshcart' ),
			array(
				'topbar_enable'      => array( 'checkbox', __( 'Show top bar', 'freshcart' ) ),
				'topbar_address'     => array( 'text', __( 'Top bar address', 'freshcart' ) ),
				'topbar_email'       => array( 'text', __( 'Top bar email', 'freshcart' ) ),
				'topbar_text'        => array( 'text', __( 'Top bar right text', 'freshcart' ) ),
				'header_phone_label' => array( 'text', __( 'Phone label', 'freshcart' ) ),
				'header_phone'       => array( 'text', __( 'Phone number', 'freshcart' ) ),
			),
		),
		'hero'     => array(
			__( 'Home: Hero', 'freshcart' ),
			array(
				'hero_enable'      => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'hero_banner'      => array( 'image', __( 'Ready-made banner image (optional). Replaces the text, button and image below. Best size: 1500 × 1000.', 'freshcart' ) ),
				'hero_banner_url'  => array( 'url', __( 'Ready-made banner link (empty = shop page)', 'freshcart' ) ),
				'hero_banner_alt'  => array( 'text', __( 'Ready-made banner description, for screen readers and Google', 'freshcart' ) ),
				'hero_tagline'     => array( 'text', __( 'Tagline', 'freshcart' ) ),
				'hero_title'       => array( 'textarea', __( 'Title (new line = line break)', 'freshcart' ) ),
				'hero_text'        => array( 'text', __( 'Text', 'freshcart' ) ),
				'hero_btn_text'    => array( 'text', __( 'Button text', 'freshcart' ) ),
				'hero_btn_url'     => array( 'url', __( 'Button link (empty = shop page)', 'freshcart' ) ),
				'hero_image'       => array( 'image', __( 'Main image', 'freshcart' ) ),
				'hero_price_label' => array( 'text', __( 'Price badge label', 'freshcart' ) ),
				'hero_price'       => array( 'text', __( 'Price badge price', 'freshcart' ) ),
				'hero_price_old'   => array( 'text', __( 'Price badge old price', 'freshcart' ) ),
				'hero_b1_title'    => array( 'textarea', __( 'Banner 1 title', 'freshcart' ) ),
				'hero_b1_text'     => array( 'text', __( 'Banner 1 text', 'freshcart' ) ),
				'hero_b1_image'    => array( 'image', __( 'Banner 1 image', 'freshcart' ) ),
				'hero_b1_url'      => array( 'url', __( 'Banner 1 link', 'freshcart' ) ),
				'hero_b2_title'    => array( 'textarea', __( 'Banner 2 title', 'freshcart' ) ),
				'hero_b2_text'     => array( 'text', __( 'Banner 2 text', 'freshcart' ) ),
				'hero_b2_image'    => array( 'image', __( 'Banner 2 image', 'freshcart' ) ),
				'hero_b2_url'      => array( 'url', __( 'Banner 2 link', 'freshcart' ) ),
				'hero_b3_title'    => array( 'textarea', __( 'Banner 3 title', 'freshcart' ) ),
				'hero_b3_text'     => array( 'text', __( 'Banner 3 text', 'freshcart' ) ),
				'hero_b3_image'    => array( 'image', __( 'Banner 3 image', 'freshcart' ) ),
				'hero_b3_url'      => array( 'url', __( 'Banner 3 link', 'freshcart' ) ),
			),
		),
		'cats'     => array(
			__( 'Home: Popular Categories', 'freshcart' ),
			array(
				'cats_enable'  => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'cats_title'   => array( 'text', __( 'Title', 'freshcart' ) ),
				'cats_number'  => array( 'number', __( 'Number of categories', 'freshcart' ) ),
				'cats_include' => array( 'text', __( 'Only these category slugs, comma separated (empty = most popular)', 'freshcart' ) ),
			),
		),
		'sale'     => array(
			__( 'Home: Products With Discounts', 'freshcart' ),
			array(
				'sale_enable' => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'sale_title'  => array( 'text', __( 'Title', 'freshcart' ) ),
				'sale_number' => array( 'number', __( 'Number of products', 'freshcart' ) ),
			),
		),
		'promo'    => array(
			__( 'Home: Wide Promo Banner', 'freshcart' ),
			array(
				'promo_enable'   => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'promo_tagline'  => array( 'text', __( 'Tagline', 'freshcart' ) ),
				'promo_title'    => array( 'textarea', __( 'Title', 'freshcart' ) ),
				'promo_text'     => array( 'text', __( 'Text', 'freshcart' ) ),
				'promo_btn_text' => array( 'text', __( 'Button text', 'freshcart' ) ),
				'promo_btn_url'  => array( 'url', __( 'Button link', 'freshcart' ) ),
				'promo_image'    => array( 'image', __( 'Image', 'freshcart' ) ),
			),
		),
		'trend'    => array(
			__( 'Home: Trending Products', 'freshcart' ),
			array(
				'trend_enable' => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'trend_title'  => array( 'text', __( 'Title', 'freshcart' ) ),
				'trend_number' => array( 'number', __( 'Number of products', 'freshcart' ) ),
			),
		),
		'deal'     => array(
			__( 'Home: Deal Of The Week', 'freshcart' ),
			array(
				'deal_enable'    => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'deal_title'     => array( 'text', __( 'Title', 'freshcart' ) ),
				'deal_end'       => array( 'date', __( 'Countdown end date (empty = end of this week)', 'freshcart' ) ),
				'deal_number'    => array( 'number', __( 'Number of products', 'freshcart' ) ),
				'deal_more_text' => array( 'text', __( '"See more" link text', 'freshcart' ) ),
			),
		),
		'dual'     => array(
			__( 'Home: Two Banners', 'freshcart' ),
			array(
				'dual_enable'   => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'dual1_tagline' => array( 'text', __( 'Left banner tagline', 'freshcart' ) ),
				'dual1_title'   => array( 'text', __( 'Left banner title', 'freshcart' ) ),
				'dual1_text'    => array( 'text', __( 'Left banner text', 'freshcart' ) ),
				'dual1_image'   => array( 'image', __( 'Left banner image', 'freshcart' ) ),
				'dual1_url'     => array( 'url', __( 'Left banner link', 'freshcart' ) ),
				'dual2_tagline' => array( 'text', __( 'Right banner tagline', 'freshcart' ) ),
				'dual2_title'   => array( 'text', __( 'Right banner title', 'freshcart' ) ),
				'dual2_text'    => array( 'text', __( 'Right banner text', 'freshcart' ) ),
				'dual2_image'   => array( 'image', __( 'Right banner image', 'freshcart' ) ),
				'dual2_url'     => array( 'url', __( 'Right banner link', 'freshcart' ) ),
			),
		),
		'blog'     => array(
			__( 'Home: Latest News & Blog', 'freshcart' ),
			array(
				'blog_enable' => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'blog_title'  => array( 'text', __( 'Title', 'freshcart' ) ),
				'blog_number' => array( 'number', __( 'Number of posts', 'freshcart' ) ),
			),
		),
		'features' => array(
			__( 'Home: Features Bar', 'freshcart' ),
			array(
				'features_enable' => array( 'checkbox', __( 'Show section', 'freshcart' ) ),
				'feat1_title'     => array( 'text', __( 'Feature 1 title', 'freshcart' ) ),
				'feat1_text'      => array( 'text', __( 'Feature 1 text', 'freshcart' ) ),
				'feat2_title'     => array( 'text', __( 'Feature 2 title', 'freshcart' ) ),
				'feat2_text'      => array( 'text', __( 'Feature 2 text', 'freshcart' ) ),
				'feat3_title'     => array( 'text', __( 'Feature 3 title', 'freshcart' ) ),
				'feat3_text'      => array( 'text', __( 'Feature 3 text', 'freshcart' ) ),
				'feat4_title'     => array( 'text', __( 'Feature 4 title', 'freshcart' ) ),
				'feat4_text'      => array( 'text', __( 'Feature 4 text', 'freshcart' ) ),
				'feat5_title'     => array( 'text', __( 'Feature 5 title', 'freshcart' ) ),
				'feat5_text'      => array( 'text', __( 'Feature 5 text', 'freshcart' ) ),
			),
		),
		'footer'   => array(
			__( 'Footer', 'freshcart' ),
			array(
				'footer_about'     => array( 'textarea', __( 'About text', 'freshcart' ) ),
				'footer_address'   => array( 'text', __( 'Address', 'freshcart' ) ),
				'footer_phone'     => array( 'text', __( 'Phone', 'freshcart' ) ),
				'footer_email'     => array( 'text', __( 'Email', 'freshcart' ) ),
				'news_title'       => array( 'text', __( 'Newsletter title', 'freshcart' ) ),
				'news_text'        => array( 'text', __( 'Newsletter text', 'freshcart' ) ),
				'news_shortcode'   => array( 'text', __( 'Newsletter form shortcode (e.g. from Fluent Forms, Mailchimp)', 'freshcart' ) ),
				'app_title'        => array( 'text', __( 'App title', 'freshcart' ) ),
				'app_text'         => array( 'text', __( 'App text', 'freshcart' ) ),
				'app_ios_url'      => array( 'url', __( 'App Store link', 'freshcart' ) ),
				'app_android_url'  => array( 'url', __( 'Google Play link', 'freshcart' ) ),
				'social_facebook'  => array( 'url', __( 'Facebook URL', 'freshcart' ) ),
				'social_instagram' => array( 'url', __( 'Instagram URL', 'freshcart' ) ),
				'social_x'         => array( 'url', __( 'X / Twitter URL', 'freshcart' ) ),
				'social_youtube'   => array( 'url', __( 'YouTube URL', 'freshcart' ) ),
				'copyright'        => array( 'text', __( 'Copyright ({year} and {site} are replaced)', 'freshcart' ) ),
			),
		),
	);

	$priority = 10;
	foreach ( $sections as $section_id => $section ) {
		$wp_customize->add_section(
			'freshcart_' . $section_id,
			array(
				'title'    => $section[0],
				'panel'    => 'freshcart_panel',
				'priority' => $priority += 10,
			)
		);

		foreach ( $section[1] as $key => $field ) {
			list( $type, $label ) = $field;
			$id = 'freshcart_' . $key;

			switch ( $type ) {
				case 'checkbox':
					$sanitize = 'freshcart_sanitize_checkbox';
					break;
				case 'url':
				case 'image':
					$sanitize = 'esc_url_raw';
					break;
				case 'number':
					$sanitize = 'absint';
					break;
				case 'date':
					$sanitize = 'freshcart_sanitize_date';
					break;
				case 'textarea':
					$sanitize = 'sanitize_textarea_field';
					break;
				default:
					$sanitize = 'sanitize_text_field';
			}

			$wp_customize->add_setting(
				$id,
				array(
					'default'           => $defaults[ $key ],
					'sanitize_callback' => $sanitize,
				)
			);

			$args = array(
				'label'   => $label,
				'section' => 'freshcart_' . $section_id,
			);

			if ( 'image' === $type ) {
				$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $id, $args ) );
			} else {
				$args['type'] = $type;
				if ( 'number' === $type ) {
					$args['input_attrs'] = array(
						'min' => 1,
						'max' => 40,
					);
				}
				$wp_customize->add_control( $id, $args );
			}
		}
	}
}
add_action( 'customize_register', 'freshcart_customize_register' );
