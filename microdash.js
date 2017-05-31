
function handle_testdata(req,res,next)
{
var testdata = 
       {current: 1,
	rowCount: 10,
	rows: [{id: 1, name: "Glenn West"},
       	       {id: 2, name: "John Smith"}]};

        return res.json(testdata);
}

function handle_indexhtml(req,res,next)
{
indexhtml = 
`<!DOCTYPE html>
<html>
    <head>
        <title>Demo</title>
        <meta charset="utf-8">
        <!-- Styles -->
        <link href="bootstrap.css" rel="stylesheet">
        <link href="jquery.bootgrid.css" rel="stylesheet">
    </head>
    <body>
        <table id="grid" data-toggle="bootgrid" data-ajax="true" data-url="/api/microdash/testdata" class="table table-condensed table-hover table-striped">
            <thead>
                <tr>
                    <th data-column-id="id">ID</th>
                    <th data-column-id="name">Sender</th>
                </tr>
            </thead>
        </table>
        <!-- Scripts -->
        <script src="jquery.js"></script> 
        <script src="jquery.bootgrid.js"></script>
    </body>
</html>
`

	res.contentType = 'text/html';
	res.setHeader('Content-Type','text/html');
        res.end(indexhtml);
        return(next);
}

function setup(serv,name,baseurl)
{
        server = serv;
        console.log("microdash - setting up");
	server.get('/index.html', handle_indexhtml);
        server.post('/api/microdash/testdata', handle_testdata);
        server.post('/api/microdash/testdata.json', handle_testdata);
        server.get('/.*/', restify.serveStatic({ directory: 'public' }));


}

var restify = require('restify');


var serv = restify.createServer({
     name: 'testapp',
     version: '1.0.0'
     });

serv.use(restify.acceptParser(serv.acceptable));
serv.use(restify.queryParser());
serv.use(restify.bodyParser());

setup(serv,"microdash","ctl.ncc9.com");

server.listen(9093, function(){
    console.log('%s listening at %s', server.name, server.url);
});
