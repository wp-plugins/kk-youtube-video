// JavaScript Document
(function() {
	tinymce.create('tinymce.plugins.kkYouTubeVideo', {
		init : function(ed, url) {
			
			// Register commands
			ed.addCommand('mceKKYouTubeVideo', function() {
				ed.windowManager.open({
					file : url + '/kkYoutubeVideo.htm',
					width : 300 + parseInt(ed.getLang('kkyoutubevideo.delta_width', 0)),
					height : 550 + parseInt(ed.getLang('kkyoutubevideo.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('kkyoutubevideo', {title : 'kk Youtube Video', cmd : 'mceKKYouTubeVideo', image: url + '/youtube.gif' });
			
			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
					cm.setActive('kkyoutubevideo', n.nodeName == 'IMG');
			});
		},

		getInfo : function() {
			return {
				longname : 'kk Youtube Video',
				author : 'Kamal Khan',
				authorurl : 'http://bhittani.com',
				infourl : 'http://wakeusup.com/2011/10/kk-youtube-video',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('kkyoutubevideo', tinymce.plugins.kkYouTubeVideo);
})();