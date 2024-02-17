const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const booksRouter = require ('./router/booksRouter');
const Books = require('./models/productModel');

dotenv.config();

app.use(express.static("public"));
app.use(express.urlencoded ({extended: true}))
app.set('view engine', 'ejs');

// connect MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/abdoDB';
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use(booksRouter);

app.get('/books', async (req, res) => {
  const result = await Books.find();
  res.send(result);
} )

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
