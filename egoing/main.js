var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var template = require('./lib/template.js');


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathName = url.parse(_url, true).pathname;


    if(pathName == '/'){
        if(queryData.id == undefined){
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.List(filelist);
                var temp = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(temp);
            });
        } else{
            fs.readdir('./data',function(error, filelist){
                var fileteredId = path.parse(queryData.id).base;// 입력정보에 대한 보안
                fs.readFile(`data/${fileteredId}`, `utf8`, function(err, description){
                    var title = queryData.id;
                    var list = template.List(filelist);
                    var temp = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${title}">update</a>
                         <form action="/process_delete" id="delForm" method="post" onsubmit="javascript:del()">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>
                         <script> 
                            function del(){
                                if(confirm("Ture ?") == true){
                                    document.getElementById('delForm').submit();
                                }
                            }
                        </script>`)
                    response.writeHead(200);
                    response.end(temp);
                });
            });
            
        }
    } else if(pathName == '/create'){
        fs.readdir('./data', function(error, filelist){
                var title = 'Write';
                var list = template.List(filelist);
                var description = template.Form("create");
                var temp = template.HTML(title, list,`<h2>${title}</h2>${description}`,'');
                response.writeHead(200);
                response.end(temp);
        });
    } else if(pathName == '/process_create'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                if(err) throw err;
                
                response.writeHead(302, {Location : `/?id=${title}`});
                response.end();
            });
        });

    } else if(pathName == '/update'){
        fs.readdir('./data',function(error, filelist){
            var fileteredId = path.parse(queryData.id).base; // 입력정보에 대한 보안
            fs.readFile(`data/${fileteredId}`, `utf8`, function(err, text){
                var title = `Update ${queryData.id}`;
                var list = template.List(filelist);
                var description = template.Form("update", queryData.id, text);
                var temp = template.HTML(title, list,`<h2>${title}</h2>${description}`,'');
                response.writeHead(200);
                response.end(temp);
            });
            
        });
    } else if(pathName == '/process_update'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`,description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            });
        });
    } else if(pathName == '/process_delete'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var fileteredId = path.parse(id).base;  // 입력정보에 대한 보안
            fs.unlink(`data/${fileteredId}`, function(err){
                response.writeHead(302, {Location : `/`});
                response.end();
            });
        });
    } else{
        response.writeHead(404);
        response.end(`${pathName} is Not our Page`);
    }
    
});
// 3000 port로 Listen 상태 유지
app.listen(3000);