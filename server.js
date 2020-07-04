// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");
let Article = require("./models/article");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
mongoose.connect("mongodb://localhost/unit18Populater", {
  useNewUrlParser: true,
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello!");
});

app.get("/scrape", async (req, res) => {
  try {
    const response = await axios.get("https://www.npr.org/sections/news/");
    var $ = cheerio.load(response.data);
    $("article").each(async (i, element) => {
      let result = {};
      result.title = $(element)
        .children(".item-info-wrap")
        .children(".item-info")
        .children(".title")
        .text();
      result.link = $(element)
        .children(".item-info-wrap")
        .children(".item-info")
        .children(".teaser")
        .children("a")
        .attr("href");
      result.date = $(element)
        .children(".item-info-wrap")
        .children(".item-info")
        .children(".teaser")
        .children("a")
        .children("time")
        .attr("datetime");
      result.teaser = $(element)
        .children(".item-info-wrap")
        .children(".item-info")
        .children(".teaser")
        .text();
      result.image = $(element)
        .children(".item-image")
        .children(".imagewrap")
        .children("a")
        .children("img")
        .attr("src");
      let newArticle = new Article(result);
      console.log(newArticle);
      // !! Uncomment out this line below once your database is connected
      // await newArticle.save();
    });
    // res.send("some other shit");
    res.send("some random shit");
  } catch (error) {
    res.status(500).send("Ah shit");
  }
});

// Listen on port 3000
app.listen(8080, function () {
  console.log("App running on port 8080!");
});
