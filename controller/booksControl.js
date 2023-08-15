const axios = require('axios');
const cheerio = require('cheerio');
const Books = require('../models/productModel');


exports.takeBooks = async (req, res) => {
    const url = 'https://abdobooks.com/products/tag/marvel';
    let product = [];
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

        let productDet = [];

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
    
    return product;
} 


exports.saveBooks = async (req, res) => {
    //save books info to database
    try{
      book_list = await this.takeBooks();

      console.log('book list: ', book_list);
      res.json(book_list);
      Books.insertMany(book_list);  
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
  
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while fetching or saving books.');
    }
      
  }