const axios = require('axios');
const cheerio = require('cheerio');
const Books = require('../models/productModel');
const mongoose = require('mongoose');


exports.takeBooks = async (req, res) => {
    const url = 'https://abdobooks.com/products/tag/marvel';
    let product = [];
    let productDet = [];
    try {
        // request
        const response = await axios(url)
        const html = response.data
        const $ = cheerio.load(html)

        //take product titles and urls
        $('.products > li', html).each((index, element) => {
            const title = $(element).find('a > h3').text();
            const url = `https://abdobooks.com` + $(element).find('a').attr('href');
            product.push({ 
            title,
            url
            });
        })

        console.log(product);

        //take info of each book
        for(const book of product){
            let detObj = {};
            let infoUrl = book.url;
            const response = await axios(infoUrl)
            const bookInfo = response.data
            const $detail = cheerio.load(bookInfo)
            $detail('#tabs-details .first tr', bookInfo).each((index,element) => {
                const key = $detail(element).find('th').text().trim().replace(/\s/g,'_').toLowerCase();
                const value = $detail(element).find('td').text().trim().toLowerCase();
                detObj[key] = value;
            })
            productDet.push(detObj);
        }     

    } catch (error) {
        console.log(error);
    }

    const bookDetail = product.map((book, index) => ({
        ...book,
        ...productDet[index]
    }));
    
    return bookDetail;
} 


exports.saveBooks = async (req, res) => {
    //save books info to database
    try{
      book_list = await this.takeBooks();
      res.json(book_list);
      Books.insertMany(book_list);  
      console.log('Data inserted successfully');  
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while fetching or saving books.');
    }
      
  }

exports.getProduct = async (req, res) => {
    const result = await Books.find();
    res.render("index.ejs", {product: result});
}

exports.deleteBooks = async (req, res) => {

    try {
        // Delete all documents from the Books collection
        await Books.deleteMany({});
        console.log('Data deleted successfully.');
    } catch (error) {
        console.error('Error deleting data:', error.message);
    } 

}

