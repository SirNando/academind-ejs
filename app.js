const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const express = require("express");

const restaurantData = require("./utilities/restaurant-data")

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/restaurants", function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();
  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", function (req, res) {
  const restaurantID = req.params.id;

  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantID) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }
  res.status(404).render("404");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  
  const storedRestaurants = resData.getStoredRestaurants();
  storedRestaurants.push(restaurant);
  resData.storeRestaurants(storedRestaurants);

  res.redirect("/confirm");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

//If the link inserted is nonexistant, we render the 404 page
app.use(function(req, res) {
  res.status(404).render("404");
})

//Render 500 if a server-side error is found. Receiving 4 parameters informs EJS that this is an error middleware
app.use(function(error, req, res, next) {
  res.status(500).render("500");
})

app.listen(3000);
