const express = require("express");
const uuid = require("uuid");

const router = express.Router();
const restaurantData = require("../utilities/restaurant-data");

router.get("/restaurants", function (req, res) {
  let order = req.query.order;
  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }
  if (order === "desc") {
    nextOrder = "asc";
  } else if (order === "asc") {
    nextOrder = "desc";
  }

  const storedRestaurants = restaurantData.getStoredRestaurants();

  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    currentOrder: nextOrder,
  });
});

router.get("/restaurants/:id", function (req, res) {
  const restaurantID = req.params.id;

  const storedRestaurants = restaurantData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantID) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }
  res.status(404).render("404");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();

  const storedRestaurants = restaurantData.getStoredRestaurants();
  storedRestaurants.push(restaurant);
  restaurantData.storeRestaurants(storedRestaurants);

  res.redirect("/confirm");
});

module.exports = router;
