const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema ({

        title: String,
        url: String,
        interest_level: String,
        reading_level: String,
        bisacs: String,
        genre: String,
        subject: String,
        copyright: String,
        division: String,
        imprint: String,
        language: String,
        number_of_pages: String,
        season: String
    },

    { timestamps: true } 
)

module.exports = mongoose.model('Books', BookSchema);
