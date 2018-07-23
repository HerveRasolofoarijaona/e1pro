var path = require('path');
var util = require('util');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session); // store session on server storage
var passport = require('passport');
var flash = require('express-flash');
var expressValidator = ('express-validator');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
mongoose.Promise = global.Promise;
//require('./app_api/models/dbconfig');
var db = require('./app_api/models/dbconfig'); //18/04
var apiRoutes = require('./app_api/routes/index');
var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
var dashboard = require('./app_server/routes/dashboard');
var Field = require('./app_api/models/field.schema');
var Skill = require('./app_api/models/skill.schema');
var Role = require('./app_api/models/role.schema');
var User = require('./app_api/models/user.schema');
var cartLength = require('./app_server/middlewares/cart.lenght');
var offerApprovedReviews = require('./app_server/middlewares/offer.reviews.approved');
var cmcic = require('cmcic');
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var http = require('http');
var socket = require("socket.io");

 
/*var tpe = new cmcic.tpe({
  CMCIC_TPE: 'tpeid',
  CMCIC_CODESOCIETE: 'societykey',
  CMCIC_CLE: '1234567890abcdef',
  CMCIC_BANK: 'CIC',
  CMCIC_LNG: 'FR',
  CMCIC_CURRENCY: 'EUR',
  CMCIC_URL_RETOUR: '/url/return',
  CMCIC_URLOK: '/url/ok',
  CMCIC_URLKO: '/url/ko'
});*/



// connection to the database through mongoose
/*var db = mongoose.createConnection("mongodb://localhost/user");
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("we are connected to the db");
});*/


// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

//app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "2ZviIunej4MnmsiVGJOBwNQSx8oOTWpg05nQo1nqK6DsAYJAn27bpJ1klk6QE0NSktrDByCTX8eBUHu4N4MbVuqBWx46HVW9p7ZEy12JOY1AHAGpSrx8Mv54mMMqDYMb",
  store: new MongoStore({url:"mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb", auto_reconnect:true})
}));
//pour local bdd
/*app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "2ZviIunej4MnmsiVGJOBwNQSx8oOTWpg05nQo1nqK6DsAYJAn27bpJ1klk6QE0NSktrDByCTX8eBUHu4N4MbVuqBWx46HVW9p7ZEy12JOY1AHAGpSrx8Mv54mMMqDYMb",
    store: new MongoStore({ url: 'mongodb://localhost/user' })
}));*/
app.use(flash());

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');

// function to call user data on multiple pages
//test 07/06

//var server = http.createServer(app);
//var serverS = server.listen(3000);
//var listener = socket.listen(server, { log: false });
//var io = socket(serverS);
// test 08/06
//à modifier 06/06 
//pour les notifications
/*function start(socket) {
    //if(user){
      socket.broadcast.emit('notification','Test is connected');
      socket.on('called', function () {
          console.log("Request received");
          io.sockets.emit('notification', 'broadcast notification');
      });
    //}
}*/



app.use(function (req, res, next) {
  res.locals.user = req.user;
  //console.log(req.sessionID); pour afficher l'id de la session
  //console.log(req.user);
  /*if(req.user){
    console.log(req.user.name + " is connected");
  }
  else{
    console.log("No one is connected");
  }*/
  next();
});

app.use(cartLength);
app.use(offerApprovedReviews);


// function to call fields data on multiple page
app.use(function (req, res, next) {
  Field.find({}, function (err, fields) {
    if(err) return next(err);
    res.locals.fields = fields;
    next();
  });
});

// function to call skills data on multiple page
app.use(function (req, res, next) {
  Skill.find({}, function (err, skills) {
    if(err) return next(err);
    res.locals.skills = skills;
    next();
  })
});

// function to call roles data on multiple page
app.use(function (req, res, next) {
  Role.find({}, function (err, roles) {
    if(err) return next(err);
    res.locals.roles = roles;
    next();
  });
});
 


app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/api', apiRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //res.address(err.address || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.address(err.address || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
/*io.on('connection', function (socket) {
    //console.log('Nouvelle connexion anonyme');
   

    socket.on('login', function (data) {
        console.log(data);
        io.sockets.emit('notification', data);
        //Si le visiteur possede bien un compte avec ce login et ce password
            //utilisateur authentifié
        /*console.log("Connexion authentifiée : " + user.login);
        socket.broadcast.emit('notification', 'Test is connected');
        socket.on('called', function () {
            console.log("Request received");
            io.sockets.emit('notification', 'broadcast notification');
                //On met a jour la liste des connectés
                //connected.push({ id: user.id, login: user.login, avatar: user.avatar });
                //On lie l'utilisateur connecté au socket de manière a pouvoir le récuperer partout
            socket.set('user', user, function () {
                    //On avrtis tous le monde (sauf l'utilisateur) que l'utilisateur est connecté et on leur retournes quelques infos sur lui
                    //socket.broadcast.emit('new_user', { id: user.id, login: user.login, avatar: user.avatar });
                    //On avertis l'utilisateur qu'il est bien connecté et on lui retourne toutes ses infos de compte
                    //socket.emit('connected', { connected: connected, user: user });
            });
        });
    });
});*/
//parametre de base
/*var httpS = require('http');
  //var serverS = httpS.createServer(app).listen(3000);
var serverS = httpS.createServer(app).listen(3000);
var socket = require("socket.io");
var io = socket.listen(serverS); //io = listener*/


/*var pseudoArray = ['admin'];
var users = 0; //count the users
//serverS.listen(16558);
io.sockets.on('connection', function (socket) { // First connection
  users += 1; // Add 1 to the count
  reloadUsers(); // Send the count to all the users
  socket.on('message', function (data) { // Broadcast the message to all
    if(pseudoSet(socket))
    {
      var transmit = {date : new Date().toISOString(), pseudo : socket.nickname, message : data};
      socket.broadcast.emit('message', transmit);
      console.log("user "+ transmit['pseudo'] +" said \""+data+"\"");
    }
  });
  socket.on('setPseudo', function (data) { // Assign a name to the user
    if (pseudoArray.indexOf(data) == -1) // Test if the name is already taken
    {
      pseudoArray.push(data);
      socket.nickname = data;
      socket.emit('pseudoStatus', 'ok');
      console.log("user " + data + " connected");
    }
    else
    {
      socket.emit('pseudoStatus', 'error') // Send the error
    }
  });
  socket.on('disconnect', function () { // Disconnection of the client
    users -= 1;
    reloadUsers();
    if (pseudoSet(socket))
    {
      console.log("disconnect...");
      var pseudo;
      pseudo = socket.nickname;
      var index = pseudoArray.indexOf(pseudo);
      pseudo.slice(index - 1, 1);
    }
  });
});

function reloadUsers() { // Send the count of the users to all
  io.sockets.emit('nbUsers', {"nb": users});
}
function pseudoSet(socket) { // Test if the user has a name
  var test;
  if (socket.nickname == null ) test = false;
  else test = true;
  return test;
}*/




module.exports = app;
