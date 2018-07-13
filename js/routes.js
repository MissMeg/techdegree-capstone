'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const router      = express.Router();

router.get('/', (req, res) => {
  res.render('index', {title: 'RobertDola Wedding 2019'});
});

module.exports = router;
