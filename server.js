var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs');
app.set('views, ','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// Maria DB Connection
var maria = require('./maria');
maria.connect();

// 서버 Open
var port = 3005;
var server = app.listen(port, function(){
  console.log(`localhost:${port} is ready`);
});


// Router
var routes = require('./router');

// Routes Connection
app.use('/', routes);
