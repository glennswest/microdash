
function handle_testdata(req,res,next)
{
var testdata = 
       {current: 1,
	rowCount: 10,
	rows: [{id: 1, name: "Glenn West"},
       	       {id: 2, name: "John Smith"}]};

        return res.json(testdata);
}

function jsontoheader(tablename)
{


}

function handle_dashboard(req,res,next)
{

}

function dashboard_head()
{
indexhtml =
`<!DOCTYPE html>
<html>
    <head>
        <title>Demo</title>
        <meta charset="utf-8">
        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="jQueryUI-1.11.4/jquery-ui.css"/>
        <link rel="stylesheet" type="text/css" href="jQueryUI-1.11.4/jquery-ui.theme.css"/>
        <link rel="stylesheet" type="text/css" href="jQueryUI-1.11.4/jquery-ui.structure.css"/>
        <link rel="stylesheet" type="text/css" href="DataTables-1.10.15/css/jquery.dataTables.css"/>
        <link rel="stylesheet" type="text/css" href="DataTables-1.10.15/css/dataTables.jqueryui.css"/>
    </head>
    <body>
`

	return(indexhtml);

}
function dashboard_table(tablename)
{
tablehtml =
`<table id="example" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </tfoot>
    </table>
span {
    font-size 3em;
    {
span b {
    font-size 60%;
    }
<span><b>$</b>63</span>
`

	return(tablehtml);
}

function dashboard_base_scripts()
{
var htmlscripts = 
`
        <!-- Scripts -->
        <script type="text/javascript" src="jQuery-2.2.4/jquery-2.2.4.js"></script>
        <script type="text/javascript" src="jQueryUI-1.11.4/jquery-ui.js"></script>
        <script type="text/javascript" src="datatables.min.js"></script>
`
	return(htmlscripts);
}

function handle_indexhtml(req,res,next)
{
indexhtml = dashboard_head() + dashboard_table("example") + dashboard_base_scripts() +
`
        <script type="text/javascript">
        $(document).ready(function() {
             $('#example').DataTable( {
             dom: 'Bfrtip',
             buttons: ['copyHtml5','excel','csv','pdfHtml5'],
             "ajax": 'arrays.txt'
              } );
         } );
        </script>
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
        server.get('/dashboard/:name', handle_dashboard);
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
