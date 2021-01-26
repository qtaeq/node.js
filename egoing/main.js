var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}

    </body>
    </html>`;
}

function templateList(filelist){
    var list = '<ul>';
    var i=0;
    while(i<filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i++]}</a></li>`
    }
    list += '</ul>';
    return list;
}

function templateForm(process, title, text){
    if(title == undefined) title = '';
    if(text == undefined) text = '';

    var description = `
    <form action="/process_${process}" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="Tittle" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="Description">${text}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>`;
    return description;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathName = url.parse(_url, true).pathname;


    if(pathName == '/'){
        if(queryData.id == undefined){
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(filelist);
                var template = templateHTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
            });
        } else{
            fs.readdir('./data',function(error, filelist){
                fs.readFile(`data/${queryData.id}`, `utf8`, function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${title}">update</a>
                         <form action="/process_delete" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>`)
                    response.writeHead(200);
                    response.end(template);
                });
            });
            
        }
    } else if(pathName == '/create'){
        fs.readdir('./data', function(error, filelist){
                var title = 'Write';
                var list = templateList(filelist);
                var description = templateForm("update");
                var template = templateHTML(title, list,`<h2>${title}</h2>${description}`,'');
                response.writeHead(200);
                response.end(template);
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
            fs.readFile(`data/${queryData.id}`, `utf8`, function(err, text){
                var title = `Update ${queryData.id}`;
                var list = templateList(filelist);
                var description = templateForm("update", queryData.id, text);
                var template = templateHTML(title, list,`<h2>${title}</h2>${description}`,'');
                response.writeHead(200);
                response.end(template);
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
            fs.unlink(`data/${id}`, function(err){
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