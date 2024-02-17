const express = require('express');
const router = express.Router();
const {saveBooks, getProduct} = require('../controller/booksControl');

router.get("/books", getProduct);
router.post("/", saveBooks);


module.exports = router;