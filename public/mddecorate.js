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
                            $(element).datepicker();
                            break;
                      }
                }
             break;
        }
}

