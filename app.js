
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , dust = require('dustjs-linkedin')
  , cons = require('consolidate') 
  ,path = require('path')
  ,util = require('util');

var app = express();
/*
var mongo = require('mongodb')
  Db = mongo.Db;   


*/

/**
* Mongo DB setup
*
*/

/*

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"bahikhata"
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);

console.log(mongourl);  */


/**

  Mongo DB setup for Jistu


  */

  var mongodb = require('mongodb'),
    db = new mongodb.Db('nodejitsudb4316283727',
      new mongodb.Server('dharma.mongohq.com', 10059, {})
    );





app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'dust');
app.engine('dust', cons.dust);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  //app.use(express.cookieSession());
  app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 9000000 }}));

  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var preProcess = function(req, res, next){

  if(typeof req.session.data == 'undefined'){
    req.session.data = {};
  }
  req.model = {};

  req.model.data= req.session.data || {};
  
  next();
};


app.get('/', function(req, res, next){ 
  res.render('login', req.model);
});

var validateLogin = function(req, res, next){
    if(!req.session.data.loggedIn){
        req.session.sessionTimeout = "Please provide valid user id and password";
        res.redirect('/');
    }
    else if(req.session.data.currentSession != req.sessionID){
        req.session.data.sessionTimeout = "You current session has been expired. Kindly login again";
        res.redirect('/');
      }
    else{
      req.session.touch()
      next();
    }
}



app.get('/transaction',preProcess, validateLogin, function(req, res, next){
  var date = new Date();
   res.render('landing', { month: date.getMonth() ==2 ? "March":'', year: date.getFullYear() });
});


app.get('/home',preProcess, validateLogin, function(req, res, next){
  res.render('welcome', { name: req.session.user });
});

app.post('/home', preProcess ,function(req, res, next){
 var details = null;
 if(req.session.data.loggedIn === 'true'){
           res.render('welcome', req.model);
  }
  else if(req.body.username){
    
      db.open(function open(err, client) {
          if (err) {
            throw err;
          }

          db.authenticate('nodejitsu', 'b8352371d860968e0c19d3f96ed77003', function authenticate(err, replies) {
            if (err) {
              throw err;
            }
          var users = new mongodb.Collection(client, 'users'),
       //     tranasctions = new mongo.Collection(client, 'history'),
       //     profile = new mongo.Collection(client, 'profile'),
            balance;
      /*       tranasctions.find().toArray(function(err, results){
               req.session.data.tranasctions = results;
            });

             profile.find({user: req.body.username}).toArray(function(err, result) {
                req.session.data.balance  = result[0].balance; 
            
            }); */
             
        users.find({user_id: req.body.username}, {limit:10}).toArray(function(err, docs) {
          details = docs;
          if(docs.length > 0 && details[0].user_id === req.body.username && details[0].password === req.body.password){
            req.session.data.currentSession = req.sessionID;
            var balance;
            req.session.data.loggedIn = 'true';
            req.session.data.user = details[0].name ;
            req.model.data = req.session.data;
            console.log(req.session.data);
            res.render('welcome', req.model); 
          }
         else{
          res.render('error', {error: details[0].user_id});
        }
        
      });
    });
  });
  }
} );



app.post('/savemodel', function(req, res, next){
    console.log(req.body);
   res.json({ save: 'Express' });
});

app.get('/logout', preProcess,  function(req, res, next){
  //  req.session = {};
    req.session.data.loggedIn = 'false';
     res.render('login', { title: 'Express' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


app.get('/addfunds', validateLogin, function(req, res, next){
   res.render('addfunds', req.model);
});

/**




app.get('/addfunds', validateLogin, function(req, res, next){
   res.render('addfunds', req.model);
});
app.get('/addfundingsource', validateLogin, function(req, res, next){
   res.render('addfundingsource', req.model);
});

app.get('/addsavings', function(req, res, next){
    console.log(req.session);
   res.render('addsavings', req.model);
});




*/