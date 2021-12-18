var express = require('express');
var app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// set the port of our application
var port = process.env.PORT || 8081;

const bodyParser = require('body-parser');

// Reference the posts file
const postsRoute = require('./posts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});


// Set our router in posts.js to <url>
app.use('/', [cors(corsOptionsDelegate)], postsRoute)

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// allow cross-origin resource sharing
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  corsOptions = { origin: true, credentials: true }; // disable CORS for this request
  callback(null, corsOptions); // callback expects two parameters: error and options
};
const corsOptions = {
  origin: true,
  methods: 'GET,POST,DELETE', // 'GET,HEAD,PUT,PATCH,POST,DELETE'
  credentials: true,
  preflightContinue: false,
  maxAge: 600,
};
app.options('*', cors(corsOptions));

// Connect to private MongoDB Database
mongoose.connect( 'mongodb+srv://admin:Batman123456@cluster0.umpxy.mongodb.net/users?retryWrites=true&w=majority' , { useUnifiedTopology: true, useNewUrlParser: true }, () => {
  console.log('connected to DB!')
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});