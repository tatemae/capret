/*!
* capret-piwik.js : Based on capret.js
* N.D.Freear, 2012-08-21.
* See, http://piwik.org/docs/tracking-api/reference
*/
(function( jQuery ){
	jQuery = jQuery.noConflict(true);
	var
	  //piwik_url_0 = 'http://track.olnet.org/piwik/',
	  piwik_url = get_data('url', 'http://track.olnet.org/piwik/')
	, idsite = get_data('idsite', 1)
	, rec = get_data('rec', 1)
	, debug = get_data('debug', false)
	// Aliases
	, M = Math
	, J = JSON  //3rd party?
	, doc = document
	, win = window
	, license_parser = oer_license_parser  //3rd party library.
	;
	function get_data(key, _default) {
	  var val = jQuery('script[src*=capret-piwik]').data('piwik-'+ key);
	  return val ? val : _default;
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
	function final_params_pi(copy_text, env){
		var tx = truncate(copy_text, 100);
		env._cvar['2'] = ['length', copy_text.length]; //'len'
		env._cvar['3'] = ['text', tx]; //'txt' 50 //escape()
		env._cvar['4'] = ['modified', doc.lastModified]; //'lmod'

		// Piwik..
		env.idsite = idsite;
		env.rec = rec;
		env.rand = M.floor(M.random()*100);
		env.action_name = 'CaPReT/ '+ document.title +'/ "'+ tx +'"';
		env._cvar = J.stringify(env._cvar);
		return jQuery.param(env);
	}
	function image_tag_piwik(copy_text, env){
		img = '<img src="'+ piwik_url +'piwik.php?' + final_params_pi(copy_text, env) + '"/>';
		if (debug) {
			console.log(img, env, piwik_url);
			console.log(J.stringify({a:1}));
		}
		return img;
	}
	jQuery(function() {
	  var env = {};
	  env._cvar = {
	    '1':['via', 'capret']
	    //, '2':[]
	  };
	  env.url = doc.location.href;
	  env.res = win.innerWidth +'x'+ win.innerHeight;
	  //env.bw = window.innerWidth;
	  //env.bh = window.innerHeight;
		env.ct = new Date().getTime();
		//env.id = make_id();
		var license = license_parser.get_license();
		jQuery('body').clipboard({
	    append: function(e){
				// A side effect of adding the image tag to the clipboard is that the browser will make a request out to the stats server.
				// That notifies us that text was copied
				if (jQuery.browser.msie) {
					// A fix for MSIE 8.. seems to work!
					$('body').append( image_tag_piwik(e, env) );

					return license.license_html;
				}
				return image_tag_piwik(e, env) + license.license_html;
			}
	  });				
	});
})(jQuery);
