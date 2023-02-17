const path = require("path");

const express = require("express");

const defaultRoutes = require("./routes/default");
const restaurantRoutes = require("./routes/restaurants");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/", defaultRoutes);
app.use("/", restaurantRoutes); /* We ommit writing "/restaurants" because this would make the function skip execution until the other checks are made */

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

//If the link inserted is nonexistant, we render the 404 page
app.use(function (req, res) {
  res.status(404).render("404");
});

//Render 500 if a server-side error is found. Receiving 4 parameters informs EJS that this is an error middleware
app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3000);
