var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/financialNews";

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));


if (process.env.MONGODB_URI) {
  mongoose.connect(MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost:27017/financialNews", { useNewUrlParser: true});
}

mongoose.connection.on("error", function(error) {
  console.log("Mongoose error: ", error);
});

mongoose.connection.once("open", function() {
  console.log("Mongoose connection sucessful.");
});

app.get("/scrape", (req, res) => {
  axios.get("https://www.reuters.com/finance/markets").then((response) => {
    var $ = cheerio.load(response.data);
    const articleArray= [];

    $("div.story-content").each(function(i, element) {
      var result= {};

      result.title = $(this).children().children("h3.story-title").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).find("p").text();
      console.log(response)
      articleArray.push(result);
    });
    console.log(articleArray);
    db.Article.create(articleArray)
        .then(() => res.send("Article scape has been completed!"))
        .catch(error => {
          console.log(error);
          res.json(error);
        })

  });
});

// route for getting articles
app.get("/articles", (req, res) => {
  db.Article.find({})
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((error) => {
      res.json(error);
    });
});

// route for getting all notes in article area
app.get("/populated", (req, res) => {
  db.Article.find({})
    .populate("note")
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((error) => {
      res.json(error);
    });
});

// get aritcles by id! and populating with note!
app.get("/articles/:id", (req, res) => {
  db.Article.findOne({_id: req.params.id }) 
  .populate("note")
  .then((dbArticle) => {
    res.json(dbArticle);
  })
  .catch((error) => {
    res.json(error);
  });
});



// route to saving a note for article
app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
    .then((dbNote) => {
      return db.Article.findOneAndUpdate({ _id: req.params.id}, { $push: {note: dbNote._id }}, {new: true});
    })
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((error) => {
      res.json(error);
    });
});

app.listen(PORT, () => console.log(`Server connected sucessfully!`));