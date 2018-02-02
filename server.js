// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()                 // define our app using express
const MongoClient = require('mongodb').MongoClient

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    db.collection('contacts').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    console.log(result)
    res.render('index.ejs', {contacts: result})
  })
});

app.get('/feed/api', function(req, res) {
    db.collection('contacts').find().toArray((err, result) => {
	  res.render('feed.ejs', {contacts: result});
  })
});

app.get('/signup/api', function(req, res) {
    db.collection('users').find().toArray((err, result) => {
	  res.render('signup.ejs', {users: result});
  })
});

app.get('/login/api', function(req, res) {
    db.collection('users').find().toArray((err, result) => {
	  res.render('login.ejs', {users: result});
  })
});

// more routes for our API will happen here


// app.post('/users', (req, res) => {
//   db.collection('users').save(req.body, (err, result) => {
//     if (err) return console.log(err)
//     for(var i=0; i<users.length; i++){
//       if(user==users[i].user && password==users[i].password){
//         res.redirect('/feed/api')
//       }
//     }
//     console.log('saved to database')
//     res.redirect('/api')
//   })
// })



app.post('/contacts', (req, res) => {
  db.collection('contacts').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/api')
  })
})

app.post('/users', (req, res) => {
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

//try router instead of app
//try in login/signup.ejs instead of server.js
