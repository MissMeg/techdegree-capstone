'use strict';

// load modules
const express   = require('express');
const mongoose  = require('mongoose');
const routes    = require('./js/routes.js');
const keys      = require('./config.js');

const app = express();

//Database Connection
mongoose.connect(`mongodb://${keys.mlabUser}:${keys.mlabPass}@ds129821.mlab.com:29821/wedding-website`, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', console.log.bind(console, 'DB connection established.'));

app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use('/', routes);

// set our port
app.set('port', process.env.PORT || 3000);

// setup our static route to serve files from the "public" folder
app.use('/static', express.static('public'));

//404 error
app.use((req, res, next) => {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

//error page
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start listening on our port
const server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
