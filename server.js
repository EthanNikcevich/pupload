// load the things we need
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
const MongoClient = require('mongodb').MongoClient

// set the view engine to ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var router = express.Router();
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    var dogs = [
        { name: 'Woofles', rating: 13 },
        { name: 'Teddy', rating: 13 },
        { name: 'Bolt', rating: 11 }
    ];
    var tagline = "Not sure what to put here. Probably just delete.";

    res.render('pages/index', {
        dogs: dogs,
        tagline: tagline
    });
});

// about page
app.get('/about', function(req, res) {
	res.render('pages/about');
});

app.get('/login', function(req, res) {
	res.render('pages/login');
});

router.get('/', function(req, res) {
    db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    console.log(result)
    res.render('pages/login', {users: result})
  })
});

app.post('/login', (req, res) => {
  db.collection('users').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/api')
  })
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
var db
MongoClient.connect('mongodb://malbinson:berkeley@ds119436.mlab.com:19436/tester', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
