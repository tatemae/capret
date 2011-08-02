(function( jQuery ){
	jQuery = jQuery.noConflict(true);
	jQuery(function() {
	  var tracking_url = 'http://stats.oerglue.com:8000/tracking.gif';
	  var env = {};
	  env.u = document.location.href;
	  env.bw = window.innerWidth;
	  env.bh = window.innerHeight;
	  if (document.referrer && document.referrer != "") {
	    env.ref = document.referrer;
	  }
	  var track = '<img src="' + tracking_url + '&' + jQuery.param(env) + '"/>';
		var license = oer_license_parser.get_license();
		jQuery('body').clipboard({
	    append: license.license_html + track,
	    oncopy: function(e) { console.log(e); }
	  });	
	});
})(jQuery);