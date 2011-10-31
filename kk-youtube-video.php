<?php

/*
Plugin Name: kk Youtube Video
Plugin URI: http://wakeusup.com/2011/10/kk-youtube-video/
Description: Easily embed youtube videos in your post or page. This plugin will allow you to search for any video within wordpress, choose a video, play it and insert the video anywhere in your post or page. Now you dont need to go to youtube.com and search for your favourite videos.
Version: 0.2
Author: Kamal Khan
Author URI: http://bhittani.com
*/



if(!class_exists('BhittaniPlugin_KKYOUTUBEVIDEO')) : 
    // Declare and define the class.
	class BhittaniPlugin_KKYOUTUBEVIDEO
	{	
		
		static public function tinymce_add_button()
		{
			if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
				return;

			if ( get_user_option('rich_editing') == 'true') 
			{
				add_filter("mce_external_plugins", array("BhittaniPlugin_KKYOUTUBEVIDEO","tinymce_custom_plugin"));
				add_filter('mce_buttons', array("BhittaniPlugin_KKYOUTUBEVIDEO",'tinymce_register_button'));
			}
		}
			 
		static public function tinymce_register_button($buttons) 
		{
			array_push($buttons, "|", "kkyoutubevideo");
			return $buttons;
		}
			 
		static public function tinymce_custom_plugin($plugin_array) 
		{
			$plugin_array['kkyoutubevideo'] = WP_PLUGIN_URL.'/kk-youtube-video/mce/kkyoutubevideo/editor_plugin.js';
			return $plugin_array;
		}
		
		static public function kkytv($atts)
		{
			if($atts['id'])
			{
			    $id = $atts['id'];
				$width = $atts['width']?$atts['width']:640;
				$height = $atts['height']?$atts['height']:385;
				return '<iframe class="youtube-player" type="text/html" width="'.$width.'" height="'.$height.'" src="http://www.youtube.com/embed/'.$id.'" frameborder="0"></iframe>';
			}
			else
			{
				return "You did not provide a youtube video id";
			}
		}
		
	}
	
	add_action('init', array('BhittaniPlugin_KKYOUTUBEVIDEO','tinymce_add_button'));
	add_shortcode('kkytv', array('BhittaniPlugin_KKYOUTUBEVIDEO','kkytv'));

endif;
?>