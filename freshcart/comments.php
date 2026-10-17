<?php
/**
 * Comments.
 *
 * @package FreshCart
 */

if ( post_password_required() ) {
	return;
}
?>
<div id="comments" class="fc-comments">
	<?php if ( have_comments() ) : ?>
		<h2 class="fc-comments-title">
			<?php
			/* translators: %d: number of comments */
			echo esc_html( sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'freshcart' ), get_comments_number() ) );
			?>
		</h2>
		<ol class="comment-list">
			<?php
			wp_list_comments(
				array(
					'style'       => 'ol',
					'short_ping'  => true,
					'avatar_size' => 56,
				)
			);
			?>
		</ol>
		<?php the_comments_navigation(); ?>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() ) : ?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'freshcart' ); ?></p>
	<?php endif; ?>

	<?php comment_form(); ?>
</div>
