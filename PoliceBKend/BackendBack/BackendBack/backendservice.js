
  var mysql      = require('mysql');
   var connection = mysql.createConnection({
    host     : '18.140.117.33',
    user: 'gantner',
    password: 'password',
     database : 'crimereport'
   });
   connection.connect(function(err){
   if(!err) {
       console.log("Database is connected ... nn");
   } else {
       console.log("Error connecting database ... nn"+err);
   }
   });

   //
   //



exports.submitCrime = function(req,res){
   console.log("req",JSON.stringify(req.body));
  var date=new Date()
console.log("Location >"+JSON.stringify(req.fields.longitude));
//console.log("Details >"+req.fields);

var fileID=date.getTime().toString().substring(0,10);

var fs = require('fs');
var stream = fs.createWriteStream("./imageLibrary/"+fileID);
stream.once('open', function(fd) {
  stream.write(req.fields.file);
   stream.end();
});


   var sql = "INSERT INTO crimeevent (id,name,comment,lon,lat,timestamp,imagePath) VALUES ?";
  var values = [
    [(date.getTime()+"").substr(10,4),'Nilushika R',req.fields.comment,req.fields.longitude,req.fields.latitude,parseInt(date.getTime().toString().substring(0,10)),fileID]

  ];
  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);

  });




}


exports.getcrime = function(req,res){
  // console.log("req",req.body);

  // var fs = require('fs');
  // var data='';
  //    var readableStream = fs.createReadStream("my_file.txt");
  //    readableStream.on('data', function(chunk) {
  //   data+=chunk;
  //   //console.log(">>>>"+data)
  //
  //
  //
  //
  //
  //
  // });


  // setTimeout(function () {
    connection.query("SELECT * FROM crimeevent", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
        //result[0].image=data;
    console.log("Data >"+JSON.stringify(result))
        res.json(result);
    });


  // }, 1500);





}

exports.viewImage = function(req,res){
  console.log("view image",req.body);

  var fs = require('fs');
  var data='';
     var readableStream = fs.createReadStream("./imageLibrary/"+req.fields.imageid);
     readableStream.on('data', function(chunk) {
    data+=chunk;
    console.log(">>>>"+data)
  });

  var job={}

   setTimeout(function () {

        job.image=data;
        //result[0].image=data;
         res.json(job);



   }, 1500);





}


exports
