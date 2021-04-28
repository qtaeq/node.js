
const maria = require('../maria');

// Load /views/home.ejs
exports.home = (req, res) => {
    res.render('home/home');
}

exports.about = (req, res) => {
    res.render('home/about');
}

