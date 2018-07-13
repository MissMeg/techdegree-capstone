'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const router      = express.Router();

router.get('/', (req, res) => {
  res.render('index', {title: 'RoberDola Wedding 2019'});
});

router.get('/photos', (req, res) => {
  res.render('photos', {title: 'Photos | RoberDola Wedding 2019'});
});

module.exports = router;
