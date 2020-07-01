// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

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
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // For each element with a "teaser" class
      $(".teaser").each(function (i, element) {
        var teaser = $(element).children("a").text();


        // For each element with a "title" class
        $("img.respArchListImg").each(function (i, element) {
          // Save the text and href of each link enclosed in the current element
          var imgage = $(element).attr("src");

          // If this found element had both a title and a link
          if (title && link) {
            // Insert the data in the scrapedData db
            db.scrapedData.insert({
              title,
              link,
              teaser,
              imgage
            },
              function (err, inserted) {
                if (err) {
                  // Log the error if one is encountered during the query
                  console.log(err);
                }
                else {
                  // Otherwise, log the inserted data
                  console.log(inserted);
                }
              });
          }

        })
      });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });

});

// Listen on port 3000
app.listen(8080, function () {
  console.log("App running on port 8080!");
});