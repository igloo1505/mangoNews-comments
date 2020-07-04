// Dependencie
var mongoose = require("mongoose");

var ArticleSchema = new mongoose.Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true,
  },
  teaser: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
});

// This creates our model from the above schema, using mongoose's model method
module.exports = mongoose.model("Article", ArticleSchema);
