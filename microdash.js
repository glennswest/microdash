var fs = require('fs');
var diskdb = require('diskdb');
var gschema = require('generate-schema');
var restify = require('restify');
var util = require('util');
var assert = require('assert');
var cc = require('change-case');
var eval = require('eval');
var ms = require('ms');

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


function tab_head()
{
indexhtml =
`<!DOCTYPE html>
<html>
    <head>
`;
        indexhtml = indexhtml + "          <title>" + settings("title") + "</title>";
indexhtml = indexhtml +
`
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Styles -->
        <link rel="stylesheet" href="jquery-ui-1.12.1/jquery-ui.css">
        <link rel="stylesheet" href="style.css">
        <script src="jQuery-2.2.4/jquery-2.2.4.min.js"></script>
        <script src="jquery-ui-1.12.1/jquery-ui.js"></script>
    </head>
    <body>
`

	return(indexhtml);

}

function grid_head()
{
indexhtml =
`<!DOCTYPE html>
<html>
    <head>
`;
        indexhtml = indexhtml + "          <title>" + settings("title") + "</title>";
indexhtml = indexhtml +
`
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Styles -->
        <link rel="stylesheet" href="jquery-ui-1.12.1/jquery-ui.css">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" type="text/css" href="/jquery-ui-1.12.1/jquery-ui.theme.css"/>
        <link rel="stylesheet" type="text/css" href="/jquery-ui-1.12.1/jquery-ui.structure.css"/>
        <script src="jQuery-2.2.4/jquery-2.2.4.min.js"></script>
        <script src="jquery-ui-1.12.1/jquery-ui.js"></script>
        <link rel="stylesheet" type="text/css" href="/brutusin-json-forms.min.css"/>
        <link rel="stylesheet" type="text/css" href="/DataTables-1.10.15/css/jquery.dataTables.css"/>
        <link rel="stylesheet" type="text/css" href="/DataTables-1.10.15/css/dataTables.jqueryui.css"/>
    </head>
    <body>
`

	return(indexhtml);

}

function dashboard_tabs()
{
var h = "";

	h = h + '<div id="tabs">\n';
        h = h + ' <ul>\n';
        x = db.schema.find();
        x.forEach(function(element){
            h = h + '<li><a href="view/' + element.name + '" title="' + element.name + '">' + element.name + '</a></li>' + "\n";
            });
        h = h + " <ul>\n";
        h = h + "</div>\n";
        return(h);
}

function dashboard_table(thename)
{
tabletop = '<table id="' + thename + '" class="display" cellspacing="0" width="100%">'
tabletop = tabletop +
`
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
        <script type="text/javascript" src="/jQuery-2.2.4/jquery-2.2.4.min.js"></script>
        <script type="text/javascript" src="/jQueryUI-1.11.4/jquery-ui.js"></script>
        <script type="text/javascript" src="/datatables.min.js"></script>
        <script type="text/javascript" src="/brutusin-json-forms.min.js"></script>
`
	return(htmlscripts);
}

function handle_indexhtml(req,res,next)
{
//indexhtml = tab_head() + dashboard_tabs() + dashboard_base_scripts() +
indexhtml = tab_head() + dashboard_tabs() + 
`
        <script type="text/javascript">
        $.ajaxSetup({
            cache: true
            });
        $(document).ready(function() {
             $('#tabs').tabs();
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

function handle_grid_ready(thename)
{
gr = 
`
        <script type="text/javascript">
        $(document).ready(function() {
        $.ajaxSetup({
            cache: true
            });
`;

             gr = gr + "             $('#" + thename + "').DataTable( {";
gr = gr +
`
             dom: 'Bfrtip',
             buttons: ['copyHtml5','excel','csv','pdfHtml5'],
`;

return gr;


}

function handle_grid(req,res,next)
{
console.log("handle_indexhtml");
if (req.params.name === undefined)
   thename = "office";
  else thename = req.params.name;

indexhtml = grid_head() + dashboard_table(thename) + dashboard_base_scripts() + handle_grid_ready(thename);
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
if (req.params.name === undefined)
   thename = "office";
  else thename = req.params.name;

indexhtml = grid_head() +  dashboard_base_scripts() +
`
        <script type="text/javascript">
        $.ajaxSetup({
            cache: true
            });
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
        console.log(util.inspect(req.params));
        thename = req.params.name;
        thecnt = req.params.count;
        console.log("Query = ");
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
        return res.json(r);

}

function setup(serv,name,baseurl)
{
        server = serv;
        console.log("microdash - setting up");
	server.get('index.html', handle_indexhtml);
	server.get('/view/:name', handle_grid);
        server.get('/view/:name/new', handle_new);
        server.post('/api/ddb/:name', handle_ddbdata);
        server.get('/api/ddb/:name', handle_ddbdata);
        server.get('/.*/', restify.serveStatic({ directory: 'public', maxAge: ms('1d') }));


}

function add_endpoints()
{
        add_endpoint('office','./');
        add_endpoint('devices','./');
        add_endpoint('schema','./');
}

var base_settings = [{name: "title",value: "Minidash"},
                     {name: "version", value: "1.0"}];
function check_settings()
{
   ti = settings("title");
   if (ti == undefined){
       db.settings.save(base_settings);
       }

}

function settings(thename)
{
   search = {};
   search.name = thename;
   s = db.settings.findOne(search);
   if (s === undefined)
      return(undefined);
   return(s.value);
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


db = diskdb.connect(data_path, ['schema','tables','devices','settings']);
db.loadCollections(['schema','tables','devices','settings']);
check_settings();
add_endpoints();
