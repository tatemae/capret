jQuery(document).ready(function() {
  var tracking_url = 'http://stats.oerglue.com:8000/tracking.gif';
  var env = {};
  env.u = document.location.href;
  env.bw = window.innerWidth;
  env.bh = window.innerHeight;
  if (document.referrer && document.referrer != "") {
    env.ref = document.referrer;
  }
  var track = '<img src="' + tracking_url + '&' + jQuery.param(env) + '"/>';
  var license = '<p>An example License</p>';
  jQuery('body').clipboard(
  {
    prepend: track,
    append: license,
    oncopy: function(e) {
      console.log(e);
    }
  });

	var license = oer_license_parser.get_license();
	console.log(license)
	jQuery('#test').append(license.attribution_string);

});
