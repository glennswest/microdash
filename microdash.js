var fs = require('fs');
var diskdb = require('diskdb');
var gschema = require('generate-schema');
var restify = require('restify');
var util = require('util');
var assert = require('assert');
var cc = require('change-case');
var eval = require('eval');


function inspect(obj)
{
	console.log(util.inspect(obj, false, null));
}

function build_schema_from_json(thename,theobj)
{
    xs = gschema.json(thename,theobj);
    x = {};
    x.name = thename;
    x.schema = xs;
    props = xs.properties;
    for (var id in props){
        xs.properties[id].description = 
              cc.pascalCase(id);
        };
    db.schema.save(x);
}

function build_schema(thename,thepath)
{
        console.log("Getting data from " + thepath);
        dbs = [];
        dbs.push(thename);
        thedb = diskdb.connect(thepath, dbs);
        thedb.loadCollections(dbs);
        obj = thedb[thename].findOne();
        build_schema_from_json(thename,obj);
}

function check_schema(thename,thepath)
{
         console.log("Check schema");
         x = db.schema.findOne({name : thename});
         if (x === undefined){
            console.log("Calling buildschema");
            build_schema(thename,thepath);
            }
}

function add_endpoint(thename,thepath)
{
	console.log("Add endpoint - " + thename);
        x = db.tables.findOne({name : thename});
        if (x === undefined){
           x = {};
           x.name = thename;
           x.path = thepath;
           db.tables.save(x);
           check_schema(thename,thepath);
           }
}





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
        <link rel="stylesheet" type="text/css" href="/brutusin-json-forms.min.css"/>
        <link rel="stylesheet" type="text/css" href="/jQueryUI-1.11.4/jquery-ui.css"/>
        <link rel="stylesheet" type="text/css" href="/jQueryUI-1.11.4/jquery-ui.theme.css"/>
        <link rel="stylesheet" type="text/css" href="/jQueryUI-1.11.4/jquery-ui.structure.css"/>
        <link rel="stylesheet" type="text/css" href="/DataTables-1.10.15/css/jquery.dataTables.css"/>
        <link rel="stylesheet" type="text/css" href="/DataTables-1.10.15/css/dataTables.jqueryui.css"/>
    </head>
    <body>
`

	return(indexhtml);

}

function dashboard_table(thename)
{
tabletop =
`<table id="example" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
`;
tablemid =
`            </tr>
        </thead>
        <tfoot>
            <tr>
`;
tableend = 
`
            </tr>
        </tfoot>
    </table>
`;
         x = db.schema.findOne({name : thename});
         props = x.schema.properties;
        tablehtml = tabletop;
        for (var param in props) {
            tablehtml = tablehtml + "                <th>";
            tablehtml = tablehtml + props[param].description;
            tablehtml = tablehtml + "</th>\n";
            };
        tablehtml = tablehtml + tablemid;
        for (var param in props) {
            tablehtml = tablehtml + "                <th>";
            tablehtml = tablehtml + props[param].description;
            tablehtml = tablehtml + "</th>\n";
            };
        tablehtml = tablehtml + tableend;
        
	return(tablehtml);
}

function dashboard_base_scripts()
{
var htmlscripts = 
`
        <!-- Scripts -->
        <script type="text/javascript" src="/jQuery-2.2.4/jquery-2.2.4.js"></script>
        <script type="text/javascript" src="/jQueryUI-1.11.4/jquery-ui.js"></script>
        <script type="text/javascript" src="/datatables.min.js"></script>
        <script type="text/javascript" src="/brutusin-json-forms.min.js"></script>
`
	return(htmlscripts);
}

function handle_indexhtml(req,res,next)
{
console.log("handle_indexhtml");
inspect(req.params.name);
if (req.params.name === undefined)
   thename = "office";
  else thename = req.params.name;

indexhtml = dashboard_head() + dashboard_table(thename) + dashboard_base_scripts() +
`
        <script type="text/javascript">
        $(document).ready(function() {
             $('#example').DataTable( {
             dom: 'Bfrtip',
             buttons: ['copyHtml5','excel','csv','pdfHtml5'],
`;

indexhtml = indexhtml + '       "ajax": ' + "'/api/ddb/" + thename + "'\n";
indexhtml = indexhtml + 
`
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


function handle_new(req,res,next)
{
console.log("handle_new");
inspect(req.params.name);
if (req.params.name === undefined)
   thename = "office";
  else thename = req.params.name;

indexhtml = dashboard_head() +  dashboard_base_scripts() +
`
        <script type="text/javascript">
        $(document).ready(function() {
`;
        indexhtml = indexhtml +
        "             $.get('/api/ddb/schema?name="+ thename + "&count=1', function(data){"
indexhtml = indexhtml + 
`
                    console.log(data);
                    var schema = data.schema;
                    var BrutusinForms = brutusin["json-forms"];
                    var bf = BrutusinForms.create(schema);
                    var container = document.getElementById('container');
                    var data = {};
                    bf.render(container, data);
                    });
`
	indexhtml = indexhtml + 
`
         	} )
        </script>
        <div id="container">
        </div>
    </body>
</html>
`

	res.contentType = 'text/html';
	res.setHeader('Content-Type','text/html');
        res.end(indexhtml);
        return(next);
}

/*
{
  "data": [
    [
      "Tiger Nixon",
      "System Architect",
      "Edinburgh",
      "5421",
      "2011/04/25",
      "$320,800"
    ],
    [
      "Garrett Winters",
      "Accountant",
      "Tokyo",
      "8422",
      "2011/07/25",
      "$170,750"
    ],
*/
function handle_multireturn(obj)
{
        r = {};
        r.data = [];
        obj.forEach(function(element){
               var l = [];
               for (var param in element) {
                   l.push(element[param]);
                   }
               r.data.push(l);
               });
        return(r);
}

function handle_ddbdata(req,res,next)
{
        console.log("handle_ddbdata");
        thename = req.params.name;
        thecnt = req.params.count;
        console.log("Query = ");
        inspect(req.query);
        if ("_" in req.query){
           restid = req.query['_'];
           delete req.query['_'];
           }
        if (Object.keys(req.query).length == 0){
          console.log("Full process");
          obj = thedb[thename].find();
          r = handle_multireturn(obj);
          } else {
          if (thecnt === undefined){
             obj = thedb[thename].find(req.query);
             }
          if (thecnt == 1){
             obj = thedb[thename].findOne(req.query);
             }
          r = obj;
          }
        inspect(r);
        return res.json(r);

}

function setup(serv,name,baseurl)
{
        server = serv;
        console.log("microdash - setting up");
	server.get('index.html', handle_indexhtml);
	server.get('/view/:name', handle_indexhtml);
        server.get('/view/:name/new', handle_new);
        server.get ('/api/microdash/testdata', handle_testdata);
        server.post('/api/ddb/:name', handle_ddbdata);
        server.get('/api/ddb/:name', handle_ddbdata);
        server.post('/api/microdash/testdata', handle_testdata);
        server.post('/api/microdash/testdata.json', handle_testdata);
        server.get('/.*/', restify.serveStatic({ directory: 'public' }));


}

function add_endpoints()
{
        add_endpoint('office','./');
        add_endpoint('devices','./');
        add_endpoint('schema','./');
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

if (fs.existsSync("/data/tables.json")){
   data_path = "/data";
  } else {
   data_path = ".";
  }


db = diskdb.connect(data_path, ['schema','tables','devices']);
db.loadCollections(['schema','tables']);
add_endpoints();
