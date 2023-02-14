const fs = require('fs');
const path = require('path');

const express = require("express");
const { resolveSoa } = require('dns');
const app = express();

//Templating features for JS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//==========================

//Enabling static files like CSS or JS. Usually in the 'public' folder
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

app.get('/', function(req,res) {
    res.render('index');
})

app.get("/", function (req, res) {
    const htmlFilePath = path.join(__dirname, 'views','index.html');
    res.sendFile(htmlFilePath);
});

app.get("/restaurants", function (req, res) {
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const restaurantList = JSON.parse(fileData);

    res.render('restaurants', {numberOfRestaurants: restaurantList.length, restaurants: restaurantList})
});

app.get('/about', function(req,res) {
    res.render('about')
})

app.get('/confirm',function(req,res) {
    res.render('confirm')
})

app.get('/recommend',function(req,res) {
    res.render('recommend')
})

app.post('/recommend', function(req,res) {
    const restaurant = req.body;
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath);
    const restaurantList = JSON.parse(fileData);
    
    restaurantList.push(restaurant);

    fs.writeFileSync(filePath, JSON.stringify(restaurantList));

    res.redirect('/confirm');
});













app.listen(3000);
