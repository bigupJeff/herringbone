<?php

/**
 * Herringbone Theme Template - Footer.
 *
 * @package herringbone
 * @author Jefferson Real <me@jeffersonreal.com>
 * @copyright Copyright (c) 2021, Jefferson Real
 */
?>

<footer class="footer">
	<div class="footer_inner sauce">

		<div class="footerNav">

			<?php wp_nav_menu(
				array(
					'theme_location'  => 'global-footer-menu',
					'items_wrap'	  => '%3$s',
					'menu_class'	  => 'nav',
					'container'	   => 'div',
					'container_class' => 'nav',
				)
			); ?>

		</div>

		<div class="footer_copyright">

			<?php wp_nav_menu(
				array(
					'theme_location'  => 'legal_link',
					'items_wrap'	  => '%3$s',
					'menu_class'	  => 'footer_label',
					'container'	   => false,
				)
			); ?>

			<?php echo "<p class=\"footer_label\">&copy; " . date("Y") . " Hello, my name is Jeff</p>";?>
		</div>

	</div>
</footer>

<?php get_template_part( 'template-parts/nav', 'mobile' );?>
<?php echo do_shortcode('[wallomatic]'); ?>

<?php wp_footer(); ?>

</body>
</html>
<script> console.log( 'wp-template: footer.php' );</script>