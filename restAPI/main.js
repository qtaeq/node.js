    const express = require('express');
    const app = express();

    
    app.get('/' ,(req, res) => {
        res.send('Hello World !\n');
    });
    app.post();
    app.put();
    app.delete();

    app.listen(3001, ()=> {
        console.log("start 3001");
    });



