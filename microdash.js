restify = require('restify');


function handle_testdata(req,res,next)
{
testdata = 
`[{id: 1, name: "Glenn West"},
  {id: 2, name: "John Smith"}]
`

	res.contentType = 'application/json'
        res.header('Content-Type','text/html');
        return res.send(testdata);
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
	res.header('Content-Type','text/html');
        return res.send(indexhtml);
}

function setup(server,name,baseurl))
{
	server.get('/index.html', handle_indexhtml);
        server.get('/api/microdash/testdata', handle_testdata);

}
