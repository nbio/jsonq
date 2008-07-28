/* 
JSONQ
Copyright 2008 nb.io - http://nb.io/
Licensed under Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function(){
    var j = window.JSONQ = {};
    j.counter = 0;
    window.JSONQ.requests = {};
    
    j.eh = function(s) {
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
    
    j.get = function(url, callback) {
        var id = (++j.counter);
        var i = document.createElement( "iframe" );
        i.style.display = "none";
        document.documentElement.appendChild( i );
        
        url = j.eh(url);
        
        var d = i.contentDocument || i.contentWindow.dument;
        d.open("text/html", false);
        d.write("<html><head></head><body>");
        d.write("<script type='text/javascript'>");
        d.write("(function(){var w = window; var p = w.parent; w.cookie = w.parent = w.top = undefined; window.callback = function(obj){p.JSONQ.callback(obj, '" + id + "');};})();");
        d.write("</script>");
        d.write("<script type='text/javascript' src='" + url + "'></script>");
        d.write("</body></html>");
        d.close();
        
        j.requests[id] = { iframe: i, callback: callback };
    };
    
    j.callback = function(obj, id) {
        //console.log("Request ID: " + id + " Response: " + obj);
        var r = window.JSONQ.requests[id];
        delete window.JSONQ.requests[id];
        r.callback(obj);
        window.setTimeout(function(){r.iframe.parentElement.removeChild(r.iframe);},0);
    };
})();
