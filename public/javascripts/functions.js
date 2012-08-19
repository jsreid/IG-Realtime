// Jquery
(function($) {
	
	//Load typekit
	var config = {
		kitId: 'wka6ghl',
		scriptTimeout: 3000
	};
	var h=document.getElementsByTagName("html")[0];h.className+=" wf-loading";var t=setTimeout(function(){h.className=h.className.replace(/(\s|^)wf-loading(\s|$)/g," ");h.className+=" wf-inactive"},config.scriptTimeout);var tk=document.createElement("script"),d=false;tk.src='//use.typekit.net/'+config.kitId+'.js';tk.type="text/javascript";tk.async="true";tk.onload=tk.onreadystatechange=function(){var a=this.readyState;if(d||a&&a!="complete"&&a!="loaded")return;d=true;clearTimeout(t);try{Typekit.load(config)}catch(b){}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(tk,s)
	
	
	// Initialize some variables
	var $container = $('#container'),
		$thumb = $('.thumb'),
		$body = $('body'),
		colW = 175,
		gutterW = 50,
		columns = null,
		objString;
	
	
	/*// Initialize Socket.io
	var socket = io.connect('http://localhost');
	socket.on('photo', function (raw) {
		var obj = JSON.parse(raw)['data'][0];
		var photo = obj.images.low_resolution.url;
		console.log('new photo');
		//$('.photo').prepend('<img src="' + photo + '">&nbsp;');
	}); */
	
	
	// modified Isotope methods for gutters in masonry
	$.Isotope.prototype._getMasonryGutterColumns = function() {
		var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
		containerWidth = this.element.width();
		
		this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
		// or use the size of the first item
		this.$filteredAtoms.outerWidth(true) ||
		// if there's no items, use size of container
		containerWidth;
		
		this.masonry.columnWidth += gutter;
		
		this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
		this.masonry.cols = Math.max(this.masonry.cols, 1);
	};

	$.Isotope.prototype._masonryReset = function() {
		// layout-specific props
		this.masonry = {};
		// FIXME shouldn't have to call this again
		this._getMasonryGutterColumns();
		var i = this.masonry.cols;
		this.masonry.colYs = [];
		while (i--) {
			this.masonry.colYs.push(0);
		}
	};

	$.Isotope.prototype._masonryResizeChanged = function() {
		var prevSegments = this.masonry.cols;
		// update cols/rows
		this._getMasonryGutterColumns();
		// return if updated cols/rows is not equal to previous
		return (this.masonry.cols !== prevSegments);
	};
	
	
	// Initialize isotope
	$container.isotope({
		sortBy: 'original-order',
		masonry: {
			columnWidth: colW,
			gutterWidth: gutterW
			
		}
	});
	
	
	// Preload a couple photos for the initial pageload
	$.ajax({
		type: "GET",
		dataType: "jsonp",
		cache: false,
		//url: "https://api.instagram.com/v1/geographies/1369637/media/recent?client_id=eec7fe0344b44e37a84f83e4a07d3e6a",
		url: "https://api.instagram.com/v1/tags/nyc/media/recent?client_id=eec7fe0344b44e37a84f83e4a07d3e6a",
		success: function(response) {
			console.log(response);
			
			// Get the amount of images in the recent images Instagram feed
			var amount = response.data.length;
			
			// Subtract 1 from the length because the array starts at 0
			amount = amount - 1;
			
			// Loop through the available images and print to screen
			for (var i = amount; i >= 0; i--) {
				var low_src = response.data[i].images.low_resolution.url;
				var hi_src = response.data[i].images.standard_resolution.url;
				objString += '<img class="thumb" data-lowres="' + low_src + '" data-hires="' + hi_src + '" width="175" height"175" src="' + low_src + '">';
			}
			
			// Convert the string of images into jquery objects
			objString = $(objString);
			
			$container.isotope( 'insert', objString );
			
		}
	});
	
	
	// When a user clicks on a thumbnail
	$container.on( 'click', '.thumb', function(){
		
		// Remove the class large from all images
		$('img').removeClass('large');
		
		// Get the url of the hi-res photo
		var big = $(this).data('hires');
		
		// Replace the current src with the new hi-res photo
		$(this).attr('src', big);
		
		// Add the class large to the clicked thumbnail
		$(this).addClass('large');
		
		// After the image increaes in size run the reLayout method
		$container.isotope('reLayout');
		
	});
	
	
})(jQuery);