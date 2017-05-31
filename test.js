var restify = require('restify');
var microdash = require('microdash');


var server = restify.createServer({
     name: 'testapp',
     version: '1.0.0'
     });

microdash.setup(server);

