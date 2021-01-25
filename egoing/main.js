var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    console.log(queryData);

    if(_url == '/'){
        _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);



    // readfilesync가 파일을 읽어오는 역할을 수행한다.
    response.end(fs.readFileSync(__dirname + _url));
});

// 3000 port로 Listen 상태 유지
app.listen(3000);