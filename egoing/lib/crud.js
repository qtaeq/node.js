module.exports = {
    main : function(){
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
    }, 
    
}