var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/'));

app.get('/hello', function(req, res){
  res.render("test",{});
});

app.get('/hello/:nameParam', function(req,res){
  res.render("test",{num : req.params.name});
})


app.listen('8888', function() {
  console.log("start socket_chat server with 8888");
});