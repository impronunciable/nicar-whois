
var api = require('../api');

/*
 * GET /
 */

exports.index = function(req, res) {
  res.render('index');
};

/*
 * GET /:domain
 * Check if the domain name param is a valid TLD
 */

exports.validDomain = function(req, res, next) {
  if(!/^[\da-z\.-]+$/.test(req.params.domain)) {
    res.send(404, req.params.domain + ' no es un dominio válido.');
  } else {
    next();
  }
};

/*
 * Send info about a domain name
 */

exports.whois = function(req, res) {
  api.domainInfo(req.params.domain, function(err, info){
    if(err || !info) res.send(500, 'Hay un error con el pedido');
    else res.render('whois', {info: info});
  });
};
