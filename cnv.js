var diskdb = require('diskdb');

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

/*
var testdata =
       {current: 1,
        rowCount: 10,
        rows: [{id: 1, name: "Glenn West"},
               {id: 2, name: "John Smith"}]};
*/

/*
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>Start date</th>
                <th>Salary</th>
*/

	var fs = require('fs');
        var obj = JSON.parse(fs.readFileSync('public/arrays.txt', 'utf8'));
        var arr = obj.data;
        var out = {};
        
        var data_path = "./";
        db = diskdb.connect(data_path, ['office']);
        db.loadCollections(['office']);

        arr.forEach(function  (element){
              e = {};
              e.name = element[0];
              e.position = element[1];
              e.office = element[2];
              e.extn = element[3];
              e.start_date = element[4];
              e.salary = element[5];
              db.office.save(e);
              });
