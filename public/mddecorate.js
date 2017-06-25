gsw = {};
gsw2 = {};

function mddecorate(element,schema)
{
    name = element.tagName;
    switch(name){
        case "INPUT":
             gsw =  element;
             fieldname = element.placeholder.toLowerCase();
             // element.id = BrutusinForms#0_0
             if ('format' in schema){
                switch(schema.format){
                      case "date":
                            console.log(schema);
                            console.log(schema.$id);
                            console.log(element.id);
                            var theid;
                            // "input[id$=txtDatepicker]"
                            theid = '#' + element.id;
                            console.log(theid);
                            $(theid).datepicker({dateFormat: 'yy-mm-dd'});
                            break;
                      }
                }
             break;
        }
}

