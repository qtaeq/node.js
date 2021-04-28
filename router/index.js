const express = require('express');
const router = express.Router();

const main = require('./main');
const board = require('./board');

// Main Page
router.get('/', main.home);
router.get('/about', main.about);
router.get('/board', board.index);

router.get('/board/create', board.create);
router.post('/board/created', board.new);

// Board


module.exports = router;