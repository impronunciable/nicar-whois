
/*
 * Module dependencies
 */

var request = require('superagent');

var base_url = 'http://api.nicalert.me/v1'
  , cache = {}
  , half_day = 1000 * 60 * 60 * 12;

/*
 * get info for a given .com.ar domain name
 */

exports.domainInfo = function(name, fn) {
  if(cache[name] && cache[name].expires_at > Date.now())  {
    fn(null, cache[name]);
  } else {
    fetchData(name, fn);
  }
};

/*
 * Fetch data from nicalert server
 */

var fetchData = function(name, fn) {
  request(base_url + '/whois/' + name + '.com.ar')
  .end(function(res){
    if(!res.ok && res.statusCode != 404) { 
      fn(res.text, null);
    } else { 
      if(res.statusCode == 404) {
        cache[name] = {"available": true, name: name, domain: '.com.ar'};
      } else {
        cache[name] = res.body;
      }

      cache[name].expires_at = Date.now() + half_day;
      fn(null, cache[name]);
    }
  });
};
