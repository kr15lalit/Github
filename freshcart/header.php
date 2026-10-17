<?php
/**
 * Header.
 *
 * @package FreshCart
 */

$freshcart_wc = class_exists( 'WooCommerce' );
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'freshcart' ); ?></a>

<header class="fc-header" id="masthead">

	<?php if ( freshcart_mod( 'topbar_enable' ) ) : ?>
		<div class="fc-topbar">
			<div class="fc-container fc-topbar-inner">
				<div class="fc-topbar-left">
					<?php if ( freshcart_mod( 'topbar_address' ) ) : ?>
						<span><?php echo freshcart_icon( 'pin' ); // phpcs:ignore ?> <?php echo esc_html( freshcart_mod( 'topbar_address' ) ); ?></span>
					<?php endif; ?>
					<?php if ( freshcart_mod( 'topbar_email' ) ) : ?>
						<a href="mailto:<?php echo esc_attr( antispambot( freshcart_mod( 'topbar_email' ) ) ); ?>"><?php echo freshcart_icon( 'mail' ); // phpcs:ignore ?> <?php echo esc_html( antispambot( freshcart_mod( 'topbar_email' ) ) ); ?></a>
					<?php endif; ?>
				</div>
				<?php if ( freshcart_mod( 'topbar_text' ) ) : ?>
					<div class="fc-topbar-right"><?php echo esc_html( freshcart_mod( 'topbar_text' ) ); ?></div>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>

	<div class="fc-header-main">
		<div class="fc-container fc-header-main-inner">
			<button type="button" class="fc-menu-toggle" aria-controls="fc-mobile-nav" aria-expanded="false">
				<?php echo freshcart_icon( 'menu' ); // phpcs:ignore ?>
				<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'freshcart' ); ?></span>
			</button>

			<div class="fc-logo">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a class="fc-site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
				<?php endif; ?>
			</div>

			<form role="search" method="get" class="fc-header-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php if ( $freshcart_wc ) : ?>
					<input type="hidden" name="post_type" value="product">
					<?php
					$freshcart_cats = get_terms(
						array(
							'taxonomy'   => 'product_cat',
							'hide_empty' => true,
							'parent'     => 0,
						)
					);
					if ( $freshcart_cats && ! is_wp_error( $freshcart_cats ) ) :
						?>
						<label class="screen-reader-text" for="fc-search-cat"><?php esc_html_e( 'Category', 'freshcart' ); ?></label>
						<select name="product_cat" id="fc-search-cat">
							<option value=""><?php esc_html_e( 'All Categories', 'freshcart' ); ?></option>
							<?php foreach ( $freshcart_cats as $freshcart_cat ) : ?>
								<option value="<?php echo esc_attr( $freshcart_cat->slug ); ?>" <?php selected( get_query_var( 'product_cat' ), $freshcart_cat->slug ); ?>><?php echo esc_html( $freshcart_cat->name ); ?></option>
							<?php endforeach; ?>
						</select>
					<?php endif; ?>
				<?php endif; ?>
				<label class="screen-reader-text" for="fc-search-input"><?php esc_html_e( 'Search for:', 'freshcart' ); ?></label>
				<input type="search" id="fc-search-input" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search for products…', 'freshcart' ); ?>">
				<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'freshcart' ); ?>"><?php echo freshcart_icon( 'search' ); // phpcs:ignore ?></button>
			</form>

			<div class="fc-header-actions">
				<?php if ( freshcart_mod( 'header_phone' ) ) : ?>
					<a class="fc-hotline" href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', freshcart_mod( 'header_phone' ) ) ); ?>">
						<span class="fc-hotline-icon"><?php echo freshcart_icon( 'headset' ); // phpcs:ignore ?></span>
						<span class="fc-hotline-text">
							<small><?php echo esc_html( freshcart_mod( 'header_phone_label' ) ); ?></small>
							<strong><?php echo esc_html( freshcart_mod( 'header_phone' ) ); ?></strong>
						</span>
					</a>
				<?php endif; ?>

				<?php if ( $freshcart_wc ) : ?>
					<a class="fc-action" href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>" aria-label="<?php esc_attr_e( 'My account', 'freshcart' ); ?>"><?php echo freshcart_icon( 'user' ); // phpcs:ignore ?></a>
					<a class="fc-action fc-action-cart" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="<?php esc_attr_e( 'Cart', 'freshcart' ); ?>">
						<?php echo freshcart_icon( 'cart' ); // phpcs:ignore ?>
						<span class="fc-cart-count"><?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<div class="fc-header-nav">
		<div class="fc-container fc-header-nav-inner">
			<?php if ( $freshcart_wc ) : ?>
				<div class="fc-browse">
					<button type="button" class="fc-browse-toggle" aria-expanded="false"><?php echo freshcart_icon( 'grid' ); // phpcs:ignore ?> <?php esc_html_e( 'Browse Categories', 'freshcart' ); ?></button>
					<ul class="fc-browse-list">
						<?php
						wp_list_categories(
							array(
								'taxonomy' => 'product_cat',
								'title_li' => '',
								'depth'    => 2,
								'orderby'  => 'name',
							)
						);
						?>
					</ul>
				</div>
			<?php endif; ?>

			<nav class="fc-primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'freshcart' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'menu_class'     => 'fc-menu',
						'container'      => false,
						'fallback_cb'    => 'freshcart_menu_fallback',
					)
				);
				?>
			</nav>
		</div>
	</div>

	<div class="fc-mobile-nav" id="fc-mobile-nav" hidden>
		<div class="fc-mobile-nav-head">
			<span class="fc-site-title"><?php bloginfo( 'name' ); ?></span>
			<button type="button" class="fc-menu-close" aria-label="<?php esc_attr_e( 'Close menu', 'freshcart' ); ?>"><?php echo freshcart_icon( 'close' ); // phpcs:ignore ?></button>
		</div>
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'menu_class'     => 'fc-mobile-menu',
				'container'      => false,
				'fallback_cb'    => 'freshcart_menu_fallback',
			)
		);
		?>
	</div>
</header>

<main id="primary" class="fc-main">
