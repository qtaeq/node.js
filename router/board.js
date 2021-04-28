const maria = require('../maria');

// Index - List
exports.index = (req, res, next) => {
    var sql = `select * from board`;
    maria.query(sql, function(err, rows, fields){
        if(err){
            console.log('err : ' + err);
            res.render(err);
        } 
        else res.render('home/board', {posts : rows});
    });
}

exports.create = (req, res) => {
    res.render('board/create');
}

exports.new = (req, res, next) => {
    maria.query('SELECT _id FROM board ORDER BY _id desc', function(err, rows, fields){
        if(err){
            console.log('err : ' + err);
            res.render(err);
        } 
        else{
            var lastno = 0;
            if(rows[0]._id != null) lastno = rows[0]._id + 1;
            
            
            var title = req.body.title;
            var body = req.body.body;
            var sql = `insert into board values(${lastno},'${title}','${body}',now())`;
            maria.query(sql, function (err, rows, fields) {
                console.log(sql);
                if (!err) {
                    console.log(`Create '${title}' is Success`);
                    res.redirect('/');

                } else {
                    res.send('err : ' + err);
                }
            });
        }
    })

    
}