// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello!");
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {

  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.npr.org/sections/news/").then(function (response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $(".title").each(function (i, element) {
      var result = {}; //empty result object

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // For each element with a "teaser" class
      $(".teaser").each(function (i, element) {
        //Add the text and href of every link, and save them as properties of the result object
        result.teaser = $(this).children("a").text();


        // For each element with a "img.respArchListImg" class
        $("img.respArchListImg").each(function (i, element) {
          // Save the text and href of each link enclosed in the current element
          result.imgage = $(this).attr("src");


          $("span.date").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            result.date = $(this).text();


            db.Article.create(result)
              .then(function (dbArticle) {
                console.log(dbArticle)
              })
              .catch(function (err) {
                console.log(err)
              })
          });
        }
        )
      })
    });
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  })
});



// Listen on port 3000
app.listen(8080, function () {
  console.log("App running on port 8080!");
});