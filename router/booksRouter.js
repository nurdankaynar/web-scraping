const express = require('express');
const router = express.Router();
const {takeBooks, saveBooks} = require('../controller/booksControl');

router.get("/", takeBooks);
router.post("/", saveBooks);

module.exports = router;