(function( jQuery ){
	jQuery = jQuery.noConflict(true);
	jQuery(function() {
	  var tracking_url = 'http://capret.mitoeit.org:8000/tracking.gif';
	  var env = {};
	  env.u = document.location.href;
	  env.bw = window.innerWidth;
	  env.bh = window.innerHeight;
	  if (document.referrer && document.referrer != "") {
	    env.ref = document.referrer;
	  }
		env.t = new Date().getTime();
		env.id = make_id();
		var license = oer_license_parser.get_license();
		jQuery('body').clipboard({
	    append: '<img src="' + tracking_url + '&' + jQuery.param(final_params(env)) + '"/>' + license.license_html,
	    oncopy: function(e) {
				env.copy = true;
				jQuery('body').append(tracking_url+ '&' + jQuery.param(env));
				console.log(e); 
			}
	  });
		function final_params(env){
			var s = document.selection;
			var r = s.createRange();
			var t = r.htmlText;
			env.l = t.length; // total length
			env.txt = truncate(t, 100);
			return env;
		}
		function make_id(){
			var result, i, j;
			result = '';
			for(j=0; j<32; j++)
			{
				if( j == 8 || j == 12|| j == 16|| j == 20)
				result = result + '-';
				i = Math.floor(Math.random()*16).toString(16).toUpperCase();
				result = result + i;
			}
			return result
		}
		function truncate(str, length){
			if(str.length > length){
				str = str.substring(0, length);
				str = str.replace(/w+$/, '');
				str += '...';
				return str;
			} else {
				return str;
			}
		}		
	});
})(jQuery);
