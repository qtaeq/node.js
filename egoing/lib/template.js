var template = {
    HTML : function(title, list, body, control){
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
    },
    List : function(filelist){
        var list = '<ul>';
        var i=0;
        while(i<filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i++]}</a></li>`
        }
        list += '</ul>';
        return list;
    },
    Form : function(process, title, text){
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
}

module.exports = template;