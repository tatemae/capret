jQuery(document).ready(function(){
  var tracking_url = 'http://stats.oerglue.com:8000/tracking.gif';
  var env = {};
	env.u = document.location.href;
  env.bw = window.innerWidth;
  env.bh = window.innerHeight;
  if(document.referrer && document.referrer != "") {
    env.ref = document.referrer;
  }
  var track = '<img src="' + tracking_url + '&' + jQuery.param(env) + '"/>';
  var license = '<br />';
  jQuery('body').clipboard(
  {
      prepend: track,
      append: license,
      oncopy: function(e){
          console.log(e);
      }
  });		
});

var licenses = ["http://www.w3.org/1999/xhtml/vocab#license",
	      				"http://creativecommons.org/ns#license",
	      				"http://purl.org/dc/terms/license"];
function get_license(){
	
}