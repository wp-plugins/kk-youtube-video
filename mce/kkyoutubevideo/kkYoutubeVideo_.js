// JavaScript Document


function onYouTubePlayerReady(playerId) 
{
	kkyoutubevideo.ytplayer = document.getElementById("myytplayer");
}

var kkyoutubevideo = {

	playerLoaded : false,
	ytplayer : false,
	perPage : 4,
	page : 1,
	total : 0,
	video : false,
	width : false,
	height : false,
	
    // INITIALIZE
    init : function()
    {
		this.search_behavior();
		this.pagination();
    },
    //END
    
    // Youtube init
    youtube : function(video_id)
    {
		var params = { allowScriptAccess: "always" };
		var atts = { id: "myytplayer" };
		swfobject.embedSWF("http://www.youtube.com/e/"+video_id+"?version=3&enablejsapi=1", "ytapiplayer", '260', '150', "8", null, null, params, atts);
		this.playerLoaded = true;
		$('.insertVideo').slideDown('slow');
    },
	//END
	
	// When player is ready
	onYouTubePlayerReady : function (playerId) 
	{
		this.ytplayer = document.getElementById("myytplayer");
	},
	//END

    // Load new video
	loadNewVideo: function(id, startSeconds)
	{
		if (this.ytplayer)
		  this.ytplayer.loadVideoById(id, startSeconds);
	},
    //END
	
	// Fetch Video
	fetch_video: function(keyword, i)
	{
		$('a[href="#left"]').hide();
		$('a[href="#right"]').hide();
		$.ajax({
			url: 'http://gdata.youtube.com/feeds/api/videos',
			data: 'v=2&orderby=viewCount&alt=json&max-results='+1+'&start-index='+((kkyoutubevideo.page*kkyoutubevideo.perPage)-kkyoutubevideo.perPage+i)+'&q='+keyword,
			type: 'get',
			dataType: 'json',
			beforeSend: function(){
				if(!$("#keyword").hasClass('_busy'))
					$("#keyword").addClass('_busy');
				$('.credits').hide();
				$('.total').html('');
			},
			success: function(msg){
				var feed = msg.feed;
				var entries = feed.entry || [];
				kkyoutubevideo.total = feed.openSearch$totalResults.$t;
				for (var j = 0; j < entries.length; j++) 
				{
				  var entry = entries[j];
				  if(entry.yt$accessControl[4].action=='embed' && entry.yt$accessControl[4].permission!='allowed')
				  {
					  
				  }
				  var id = entry.media$group.yt$videoid.$t;
				  var title = entry.title.$t;
				  var thumb = entry.media$group.media$thumbnail[1].url;
				  var duration = entry.media$group.yt$duration.seconds;
				  var durationObj = kkyoutubevideo.seconds_to_time(duration);
				  var rating = entry.gd$rating.average;
				  var html = $('#resultSample').html();
				  html = html.replace('%id%', id);
				  html = html.replace(/%ftitle%/g, title);
				  html = html.replace(/%title%/g, title.substr(0,45));
				  html = html.replace('%img%', thumb);
				  html = html.replace('%length%', '['+durationObj.m+':'+durationObj.s+']');
				  html = html.replace('%tsec%', duration);
				  
				  $('ul.list').append(html);
				  //$('li', $('ul.list')).last().fadeIn(1000);
				}
				$('a', $('li', $('ul.list')).last()).click( function(){
					var idT = $(this).attr('href');
					idT = idT.split('#');
					var id = idT[1];
					kkyoutubevideo.video = id;
					if(!kkyoutubevideo.playerLoaded)
					{
						$("#ytapiplayer").show();
						kkyoutubevideo.youtube(id);
					}
					else
					{
						kkyoutubevideo.loadNewVideo(id, 0);
					}
					return false;
				});
			},
			complete: function(){
				
				$('.total').html('Videos Found: <strong>'+kkyoutubevideo.total+'</strong>');
				
				if(i < kkyoutubevideo.perPage)
					kkyoutubevideo.fetch_video($("#keyword").val(), ++i);
				else
				{
					if($("#keyword").hasClass('_busy'))
					$("#keyword").removeClass('_busy');
					if(kkyoutubevideo.page<kkyoutubevideo.total)    
						$('a[href="#right"]').show();
					else
						$('a[href="#right"]').hide();
					if(kkyoutubevideo.page>1)
						$('a[href="#left"]').show();
					else
						$('a[href="#left"]').hide();	
				}
			}
	   });
	},
	//END
	
	// Seconds To Time
	seconds_to_time: function(secs)
	{
		var hours = Math.floor(secs / (60 * 60));
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		var obj = {
			"h": kkyoutubevideo.pad2(hours),
			"m": kkyoutubevideo.pad2(minutes),
			"s": kkyoutubevideo.pad2(seconds)
		};
		return obj;
	},
	//END
	
	// Padding number
	pad2 : function(number) 
	{   
		return (number < 10 ? '0' : '') + number  ;
	},
	//END
	
	// Search Behaviour
	search_behavior : function()
	{
	    $("#keyword").click( function(){
			if($(this).val()=='search...')
				$(this).val('');
		});
		$("#keyword").blur( function(){
			if($(this).val()=='')
				$(this).val('search...');
		});
		$("#keyword").keypress( function(e){
			if(e.which == 13)
			{
				e.preventDefault();
			   if($("#keyword").val()!='search...' && $("#keyword").val()!='')
			   {
				    kkyoutubevideo.page = 1;
				    kkyoutubevideo.total = 0;
					
				    $('ul.list').html('');
				    kkyoutubevideo.fetch_video($("#keyword").val(), 1);	
			   }
			}
		});
		$("#width").click( function(){
			if($(this).val()=='width')
				$(this).val('');
		});
		$("#width").blur( function(){
			if($(this).val()=='')
				$(this).val('width');
		});
		$("#width").change( function(){
			kkyoutubevideo.width = $("#width").val();
		});
		$("#height").click( function(){
			if($(this).val()=='height')
				$(this).val('');
		});
		$("#height").blur( function(){
			if($(this).val()=='')
				$(this).val('height');
		});
		$("#height").change( function(){
			kkyoutubevideo.height = $("#height").val();
		});
			
	},
	
	// PAGINATION
	pagination: function()
	{
	    $('.navigation a[rel="more"]').click( function(){
			kkyoutubevideo.page++;
			$('ul.list').html('');
			kkyoutubevideo.fetch_video($("#keyword").val(), 1);	 		 	
			return false;
		});	
		$('.navigation a[rel="back"]').click( function(){
			kkyoutubevideo.page--;
			$('ul.list').html('');
			kkyoutubevideo.fetch_video($("#keyword").val(), 1);	 		 	
			return false;
		});
	},
	//END
	
	// INSERT THE VIDEO
	insert : function()
	{
		if(kkyoutubevideo.video)
	    {
			var shortcode = '[kkytv id="'+kkyoutubevideo.video+'"';
			if(kkyoutubevideo.width)
			    shortcode += ' width="'+kkyoutubevideo.width+'"';
			if(kkyoutubevideo.height)
			    shortcode += ' height="'+kkyoutubevideo.height+'"';
			shortcode += ']';
	        tinyMCEPopup.execCommand('mceReplaceContent', false, shortcode);
		    tinyMCEPopup.close();
		}
		else
		    alert('No video selected!');
	}
	//END
}
jQuery(document).ready( function($){
	kkyoutubevideo.init();
});