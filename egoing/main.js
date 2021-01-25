var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathName = url.parse(_url, true).pathname;

    if(pathName == '/'){
        var title = queryData.id;
        var list = '<ul>';
        fs.readdir('./data', function(error, filelist){
            console.log(filelist);
            var i=0;
            while(i<filelist.length){
                list = list + `<li><a href="?id=${filelist[i]}">${filelist[i++]}</a></li>`
            }
        });
        list += '</ul>';

        fs.readFile(`data/${queryData.id}`, `utf8`, function(err, description){
            if(!description){
                title = "Welcome";
                description = "Hello, node.js";
            }
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
    
            </body>
            </html>`;
            response.writeHead(200);
            response.end(template);
        });
    } else{
        response.writeHead(404);
        response.end(`${pathName} is Not our Page`);
    }
    
});
// 3000 port로 Listen 상태 유지
app.listen(3000);