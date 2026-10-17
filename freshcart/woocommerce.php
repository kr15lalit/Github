<?php
/**
 * Wrapper for all WooCommerce pages (shop, category, single product).
 *
 * @package FreshCart
 */

get_header();

$freshcart_sidebar = ! is_product() && is_active_sidebar( 'sidebar-shop' );

// On single products the product title is shown in the summary, so the banner shows the shop name.
$freshcart_title = is_product() ? get_the_title( wc_get_page_id( 'shop' ) ) : woocommerce_page_title( false );
get_template_part( 'template-parts/page-header', null, array( 'title' => $freshcart_title ) );
?>
<div class="fc-container fc-layout fc-shop<?php echo $freshcart_sidebar ? ' has-sidebar sidebar-left' : ''; ?>">
	<div class="fc-content">
		<?php woocommerce_content(); ?>
	</div>
	<?php if ( $freshcart_sidebar ) : ?>
		<aside class="fc-sidebar" aria-label="<?php esc_attr_e( 'Shop filters', 'freshcart' ); ?>">
			<?php dynamic_sidebar( 'sidebar-shop' ); ?>
		</aside>
	<?php endif; ?>
</div>
<?php
get_footer();
