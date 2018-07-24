'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const weather     = require('weather-js');
const router      = express.Router();

//travel page
router.get('/travel', (req, res, next) => {
  //weather api Connection
  weather.find({search: 'Kansas City, MO', degreeType: 'F'}, function(err, result) {
    if(err) next(err);
    let currentTemp = result[0].current.temperature;
    let currentSkyText = result[0].current.skytext;
    let currentSky = currentSkyText.split(' ');
    let currentHumidity = result[0].current.humidity;
    let currentWind = result[0].current.winddisplay;
    if ( currentSky.length > 1 ) {
      currentSky = currentSky[1];
    } else {
      currentSky = currentSky[0];
    }
    console.log(currentSky);
    res.render('travel', {title: 'Travel | RoberDola Wedding 2019', temp: currentTemp, sky: currentSky, humidity: currentHumidity, wind: currentWind});
  });
});


module.exports = router;
