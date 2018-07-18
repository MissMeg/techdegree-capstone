'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const keys        = require('../config.js');
const router      = express.Router();

//Get routes for each page
router.get('/', (req, res) => {
  res.render('index', {title: 'RoberDola Wedding 2019'});
});

router.get('/photos', (req, res) => {
  res.render('photos', {title: 'Photos | RoberDola Wedding 2019'});
});

router.get('/events', (req, res) => {
  res.render('events', {title: 'Events | RoberDola Wedding 2019', key: keys.google_maps_api_key});
});

router.get('/party', (req, res) => {
  res.render('weddingparty', {title: 'Wedding Party | RoberDola Wedding 2019'});
});

router.get('/gifts', (req, res) => {
  res.render('gifts', {title: 'Gifts | RoberDola Wedding 2019'});
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login | RoberDola Wedding 2019'});
});

module.exports = router;
