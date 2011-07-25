//https://github.com/patlockley/openattribute-chrome

var oer_license_parser = {
	
	attr_names: ['license cc:license', 'about', 'src', 'resource', 'href', 'instanceof', 'typeof', 'rel', 'rev', 'property', 'content', 'datatype'],
	license_found: false,
	root_node: document,
	current_license: {	'title' : document.title,
										  'url' : document.location.href,
										  'author' : "",
										  'license' : "",
										  'license_link' : "",
										  'type' : "",
										  'attribution_url' : "",
										  'license_shorthand' : ""},
	
	get_license: function(){
		var _self = this;
		if(_self.parse_triples()){
			var license_html = "";
			var title = _self.current_license["title"];
			var url = _self.current_license["url"];
			var license = _self.current_license["license"];
			var license_link = _self.current_license["license_link"];
			var license_shorthand = _self.current_license["license_shorthand"];
			var author = _self.current_license["author"];
			
	    if(author==""){ author = _self.current_license["attributionName"]; }
			attribution_url = _self.current_license["attribution_url"];
			non_html_attrib_string = "";

	    license_html = "<p style=\"font-weight:bold\">" + title + "</p>";
	    attrib_string = '<span property="dct:title">' + title + '</span>';
	    non_html_attrib_string = title + " taken from " + url + "\n";
	    license_html += "<p style=\"font-size:80%\"> Source : " + url + "</p>";
	    license_html += "<p style=\"font-size:80%\"> License: <a target=\"_blank\" href=\"" + license_link + "\">" + license + "</a></p>";
	    attrib_string_light = title + " : taken from - " + url;
	    if(author!=""){
	      if(attribution_url!=""){
	        license_html += "<p style=\"font-size:80%\"> Author: <a target=\"_blank\" href=\"" + attribution_url + "\">" + author + "</a></p>";
	        attrib_string += '<a rel="cc:attributionName" ' + 'href="' + attribution_url + '" target=\"_blank\">' + author + '</a>';
	      }else{
	        license_html += "<p style=\"font-size:80%\" property=\"cc:attributionName\"> Author: " + author + "</p>";
	        attrib_string += '<span property="cc:attributionUrl">' + attribution_url + '</span><span property=\"cc:attributionName\">' + author + '</span>';
	      }
	      attrib_string_light += "\nAuthor: " + author + " ";
	    }
	    license_html += "<form><input type=\"button\" value=\"More Information\" onclick=\"javascript:toggle(document.getElementById('extrainfodiv'));\" /></form>";
	    attrib_string_light += "\n" + license_link;
	    l_s = license_shorthand.split("  ").join(" ");
	    l_s = l_s.split("  ")
	    cc_l_s = l_s[1];
	    l_s = l_s.join(" ");
	    attrib_string +='<a rel="license" target=\"_blank\" href="' + license_link + '">' + license + " / " + l_s + '</a>';
	    attrib_string = "<div xmlns:dc=\"http://purl.org/dc/terms/\" xmlns:cc\"http://creativecommons.org/#ns\" about=\"" + url + "\">" + attrib_string + "</div>";
	    non_html_attrib_string += license.split("\n").join("") + " / " + l_s + "\n";
	    
	    var basic_attribution = "<p style=\"font-size:80%\">Basic Attribution</p><textarea rows=\"7\" id=\"attribtext\" cols=\"70\">" + attrib_string_light + "</textarea>";
	    var rdf_attribution = "<p style=\"font-size:80%\">RDFa Attribution</p><textarea rows=\"7\" id=\"attribtextRDFA\" cols=\"70\">" + attrib_string + "</textarea>";
	
			return { 'attribution_string': attrib_string,
							 'non_html_attribution_string': non_html_attrib_string,
							 'basic_attribution': basic_attribution,
							 'rdf_attribution': rdf_attribution,
							 'license_color': _self.license_color()
						 };
		} else {
			return '';
		}		
	},
	
	license_color: function(){
		var _self = this;
		l_s = _self.current_license["license_shorthand"].split("  ").join(" ");
    l_s = l_s.split("  ");
    cc_l_s = l_s[1];
		if(!cc_l_s){ return 'red'; }
		switch (cc_l_s.toLowerCase()) {
      case "by":
      case "by-sa":
      case "mark":
      case "zero":
      case "publicdomain":
      license_color = "green";
      break;

      case "by-nc":
      case "by-nd":
      case "by-nc-nd":
      case "by-nc-sa":
      case "sampling+":
      case "nc-sampling+":
      license_color = "yellow";
      break;

      case "sampling":
      case "devnations":
      license_color = "red";
      break;
    }

    return license_color;
	},
	
	parse_triples: function(){
		var _self = this;
		var n = _self.root_node;
	  while(n) {
	    if (_self.is_parseable_node(n)){
        rdfa_found = 0;
      	_self.parse_attributes(n);
	    }
			n = _self.get_next_node(n);
			if(!n){ break; }	    
	  }

		_self.do_triple_hacks();
	  return _self.license_found;
	},
	
	get_next_node: function(n){
		var _self = this;
		if (n.v) {
      n.v = false;
      if (n == _self.root_node) {
        return null;
      }
      if (n.nextSibling) {
        n = n.nextSibling;
      } else {
        n = n.parentNode;
      }
    }
    else {
      if (n.firstChild) {
        n.v = true;
        n = n.firstChild;
      } else {
	      if (n.nextSibling) {
	        n = n.nextSibling;
	      } else {
	        n = n.parentNode;
	      }
			}
    }
		return n;
	},
	
	is_parseable_node: function(n){
		if(n.nodeName != "LINK" && 
			 n.hasAttributes() &&
			 n.attributes.length != 1){
			return true;
		} else {
			return false;
		}
	},
	
	parse_attributes: function(n){
		var _self = this;
		for (var i = 0; i < _self.attr_names.length; i++){
			if(!_self.parse_attribute(n, _self.attr_names[i])){
				break;
			}
    }	
	},
	
	parse_attribute: function(n, attr_name){
		var _self = this;
		if (n.getAttribute(attr_name) == null) { return true; }
    if (n.getAttribute(attr_name) == "nofollow") { return true; }
	
    asset = "";
    attribute = "";
    value = "";
    if (n.getAttribute(attr_name).indexOf(":") == 2) {
      attribute = n.getAttribute(attr_name).substring(3);
    }
    if (attr_name == "property") {
      value = n.innerHTML;
    }
    if (n.getAttribute(attr_name) == "dc:type") {
      return false;
    }
    if (attr_name == "rel" && n.getAttribute(attr_name).indexOf("license") != -1) {
      value = n.getAttribute("href");
      attribute = "license";
    }
    if (attr_name == "href" && n.getAttribute(attr_name).indexOf("http://") != -1) {
      value = n.getAttribute("href");
    }
    if (asset == "") {
      asset = document.location.href;
      if (attribute == "") {
        if (n.getAttribute("property") == "cc:attributionName" && n.getAttribute("rel") == "cc:attributionURL") {
          attribute = n.getAttribute(attr_name);
          triple_array = Array(asset, "cc:attributionName", n.innerHTML);
          _self.extract_details(triple_array);
          attribute = "attributionURL";
        } else {
          attribute = n.getAttribute(attr_name);
        }
      }
    }
    if (attribute == "type") {
      value = n.getAttribute("href")
    }
    if (attribute == "attributionURL") {
      value = n.getAttribute("href")
    }
    if (attribute == "attributionName") {
      value = n.innerHTML;
    }

    if (value != attribute) {
      if (asset != null && attribute != null && value != null) {
        if (asset.length != 0 && attribute.length != 0 && value.length != 0) {
          base = document.location.href.split("/")[2];
          if (value.indexOf("http://") == 0) {
            if (base != value.split("/")[2]) {
              triple_array = Array(asset, attribute, value);
              _self.extract_details(triple_array)
              triple_array = Array();
            }
          }
          else {
            triple_array = Array(asset, attribute, value);
            _self.extract_details(triple_array)
            triple_array = Array();
          }
        }
      }
    }

		return true;
	},
										
	extract_details: function(data_triple){
		var _self = this;
		switch (data_triple[1]){
		case "title":
		  _self.current_license["title"] = data_triple[2];
		  break;
		case "license":
			_self.license_found = true;
		  _self.current_license["license"] = data_triple[2];		
			_self.get_cc(data_triple[2], data_triple[0]);
		  break;
		case "attributionName":
		  _self.current_license["attributionName"] = data_triple[2];
		  break;
		case "attributionURL":
		  _self.current_license["attributionURL"] = data_triple[2];
		  break;
		case "author":
		  _self.current_license["author"] = data_triple[2];
		  break;
		}
	},
	
	get_cc: function(url, site){
		var _self = this;
	  _self.current_license["license_link"] = url;
	  var req = new XMLHttpRequest();
	  req.open("GET", url, true);
	  req.onload = function(){
	    if (req.readyState == 4) {
	      var data = req.responseText;
	      data = data.split("</title>");
	      data = data[0].split("<title>");
	      data = data[1].split("&mdash;");
	      _self.current_license["license"] = data[1];
	      _self.current_license["license_shorthand"] = data[2].split("\n").join("");
	    }
	  }
	},
	
	do_triple_hacks: function(){
		var _self = this;
		switch (window.location.toString().split(".")[1]) {
	  case "flickr":
	    var loggedin = document.body.innerHTML.split('data-ywa-name="Account name">');
	    logged_in_user = loggedin[1].split('</a>')[0];
	    var photo_by = document.body.innerHTML.split('<strong class="username">By <a href="/photos/');
	    photo_by_user = photo_by[1].split('>')[1];
	    photo_by_author = photo_by_user.split('<');
	    if (logged_in_user == photo_by_author[0]) {
	      triple_array = Array(window.location.toString(), "author", logged_in_user);
	      extract_details(triple_array)
	      triple_array = Array();
	    }
	    break;
	  default:
	    break;
	  }
	}
	
};