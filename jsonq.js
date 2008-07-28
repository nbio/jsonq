/* 
JSONQ
Copyright 2008 nb.io - http://nb.io/
Licensed under Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function(){
    var j = window.JSONQ = {};
    j.counter = 0;
    j.requests = {};
    
    j.escapeHTML = function(s) {
        return s.replace( /([<>&""''])/g,
            function(m, c) {
                switch( c ) {
                    case "<": return "&lt;";
                    case ">": return "&gt;";
                    case "&": return "&amp;";
                    case '"': return "&quot;";
                    case "'": return "&apos;";
                }
                return c;
            } );
    };
    
    j.sandbox = function(w) {
        try {
            w.parent = null;
        } catch(e) {}
    };
   
    j.get = function(url, callback) {
        var id = (++j.counter);
        var i = document.createElement( "iframe" );
        i.style.display = "none";
        document.documentElement.appendChild( i );
                
        var d = i.contentDocument || i.contentWindow.document;
        d.open("text/html", false);
        d.write("<html><body>");
        d.write("<script type='text/javascript'>");
        d.write("(function(){var w = window; var p = w.parent; p.JSONQ.sandbox(w); w.callback = function(obj){p.JSONQ.callback(obj, '" + id + "');};})();");
        d.write("</script>");
        d.write("</body></html>");
        d.close();
        
        var b = d.getElementsByTagName("body")[0];
        var s = d.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.setAttribute("src", url);
        b.appendChild(s);

        return j.requests[id] = { iframe: i, callback: callback };
    };
    
    j.callback = function(obj, id) {
        var r = window.JSONQ.requests[id];
        delete window.JSONQ.requests[id];
        r.callback(obj);
        window.setTimeout(function(){r.iframe.parentElement.removeChild(r.iframe);},0);
    };
})();
