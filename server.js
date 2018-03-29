// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()                 // define our app using express
const MongoClient = require('mongodb').MongoClient
var account=false;
var profile
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
//   if(account==true){
    db.collection('contacts').find().toArray((err, result) => {
      if (err) return console.log(err)
    // renders index.ejs
      console.log(result)
      res.render('index.ejs', {contacts: result, profileVar: profile})
    })
//   }else{console.log("not logged in")}
});

app.get('/search/api', function(req, res) {
  db.collection('contacts').find().toArray((err, result) => {
	 res.render('search.ejs', {contacts: result, foundDogs: ""});
  })
});

app.get('/feed/api', function(req, res) {
  if(account==true){
    db.collection('contacts').find().toArray((err, result) => {
	   res.render('feed.ejs', {contacts: result});
    })
  }else{console.log("not logged in")}
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

app.get('/logout/api', function(req, res) {
  account=false;
  profile="";
  db.collection('users').find().toArray((err, result) => {
    res.render('login.ejs', {users: result});
  })
});

// more routes for our API will happen here

app.post('/login', (req, res) => {

  var userName = req.body.user
  var passWord = req.body.password

  db.collection('users').find({user:userName, password:passWord}).toArray((err, result) => {
    if(err) {console.log(err)}
    if(!result.length){
      console.log("User not found")
    }else{
      account=true
      profile=userName
      res.redirect('/api')
      console.log("User found")
    }
  })
})

app.post('/searchDog', (req, res) => {

  var dog = req.body.name

  db.collection('contacts').find({name:dog}).toArray((err, result) => {
    if(err) {console.log(err)}
    if(!result.length){
      console.log("Dog not found")
    }else{
      res.render('search.ejs', {foundDogs: result})
    }
  })
})

app.post('/feed', function (req, res) {

  var Name = req.body.name
  db.collection('contacts').update({name:Name},{$push: {comments: {post:profile+': '+ req.body.comment+'   '+req.body.rating+'/10'}}})
  res.redirect('/feed/api')
})

app.post('/contacts', function (req, res) {
  var dogName = req.body.name
  var uRl = req.body.url
  var capt = req.body.caption

  db.collection('contacts').save({poster:profile, url:uRl, name:dogName, caption:capt})
  res.redirect('/api')
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
