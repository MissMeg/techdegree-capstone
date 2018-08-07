'use strict';


// load modules
const express           = require('express');
const mongoose          = require('mongoose');
const routes            = require('./js');
// const keys              = require('./config.js');
const giphy             = require( 'giphy' )( process.env.giphy_api_key );
const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);

const app = express();


//Database Connection
mongoose.connect(`mongodb://${process.env.mlabUser}:${process.env.mlabPass}@ds129821.mlab.com:29821/wedding-website?authSource=wedding-website&w=1`, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', console.log.bind(console, 'DB connection established.'));

// use sessions
app.use(session({
  secret: process.env.secret_key,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  expires: new Date(Date.now() + (8.64e+7))
}));

//make userID available in templates
app.use( (req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

//settings
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use('/', routes.basics);
app.use('/', routes.travel);
app.use('/', routes.login);
app.use('/', routes.guest);
app.use('/', routes.newpassword);
app.use('/', routes.editDelete);

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
  //connection to the giphy api to get the error gif
  giphy.gif( { id : [ 'qiiEJt7U7UCmA' ]}, (error, result) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        gif: result.data.embed_url
    });
  });
});

// start listening on our port
const server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
