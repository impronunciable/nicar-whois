
;(function(){

  /*
   * Module dependencies
   */

  var request = require('visionmedia-superagent')
    , escape = require('component-escape-html');

  /*
   * client-side cache
   */

  var cache = {};
 
  /*
   * DOM nodes
   */

  var search = document.getElementById('search')
    , results = document.getElementById('results'); 

  /*
   * Handle search input
   */

  _addEvent(search, 'keyup', function(e){
    if(!search.value.length)
      return render(results, '');
    if(!/^[\da-z-]+$/.test(search.value)) 
      return render(results, escape(search.value) + ' no es un dominio válido.');
    setTimeout(waitForInput(search.value), 300);
  });

  /*
   * Check if user want to check this domain name
   * and render it if its client-side cached
   */

  var waitForInput = function(old_value) {
    return function() {
      if(search.value === old_value) {
        if(cache[search.value]) { 
          render(results, cache[search.value]);
        } else {
          requestInfo(old_value);
        }
      }
    };
  };

  /*
   * Perform the http request and
   * render the response
   */

  var requestInfo = function(name) {
    request('/api/' + name, function(res) {
      if(res.ok) {
        render(results, res.text);
        cache[name] = res.text;
      } else {
        render(results, res.text);  
      }
    });
  };

  /*
   * add event listener cross-browser helper
   */

  function _addEvent(object, type, callback) {
    if (object.addEventListener) {
      return object.addEventListener(type, callback, false);
    }
    object.attachEvent('on' + type, callback);
  }

  /*
   * Render html into a div
   */

  var render = function(obj, html) {
    obj.innerHTML = html;
  };

})();
