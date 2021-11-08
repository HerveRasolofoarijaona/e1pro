const path = require('path');
const util = require('util');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session); // store session on server storage
const passport = require('passport');
const flash = require('express-flash');
const expressValidator = ('express-validator');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

mongoose.Promise = global.Promise;

require('./app_api/models/dbconfig');
const db = require('./app_api/models/dbconfig'); //18/04
const apiRoutes = require('./app_api/routes/index');
const routes = require('./app_server/routes/index');
const users = require('./app_server/routes/users');
const dashboard = require('./app_server/routes/dashboard');
const Field = require('./app_api/models/field.schema');
const Skill = require('./app_api/models/skill.schema');
const Role = require('./app_api/models/role.schema');
const User = require('./app_api/models/user.schema');

const cartLength = require('./app_server/middlewares/cart.lenght');
const offerApprovedReviews = require('./app_server/middlewares/offer.reviews.approved');
const cmcic = require('cmcic');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const http = require('http');
const socket = require("socket.io");
const PORT = process.env.PORT || 3000;

// const tpe = new cmcic.tpe({
//     CMCIC_TPE: 'tpeid',
//     CMCIC_CODESOCIETE: 'societykey',
//     CMCIC_CLE: '1234567890abcdef',
//     CMCIC_BANK: 'CIC',
//     CMCIC_LNG: 'FR',
//     CMCIC_CURRENCY: 'EUR',
//     CMCIC_URL_RETOUR: '/url/return',
//     CMCIC_URLOK: '/url/ok',
//     CMCIC_URLKO: '/url/ko'
// });



// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

//app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));   v     
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'production') { //Quand le projet est déployé
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: "2ZviIunej4MnmsiVGJOBwNQSx8oOTWpg05nQo1nqK6DsAYJAn27bpJ1klk6QE0NSktrDByCTX8eBUHu4N4MbVuqBWx46HVW9p7ZEy12JOY1AHAGpSrx8Mv54mMMqDYMb",
        store: new MongoStore({ url: "mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb", auto_reconnect: true })
    }));
} else if (app.get('env') === 'development') { //Quand le projet est en local
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: "2ZviIunej4MnmsiVGJOBwNQSx8oOTWpg05nQo1nqK6DsAYJAn27bpJ1klk6QE0NSktrDByCTX8eBUHu4N4MbVuqBWx46HVW9p7ZEy12JOY1AHAGpSrx8Mv54mMMqDYMb",
        store: new MongoStore({ url: 'mongodb://localhost/user' })
    }));
}

app.use(flash());    

n         
 

app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');

// function to call user data on multiple pages
//test 07/06

const server = http.createServer(app);
const serverS = server.listen(PORT);
const listener = socket.listen(server, { log: false });
const io = socket(serverS);


// test 08/06
//à modifier 06/06 
//pour les notifications

function start(socket) {
    //if(user){
    socket.broadcast.emit('notification', 'Test is connected');
    socket.on('called', function() {
        console.log("Request received");
        io.sockets.emit('notification', 'broadcast notification');
    });
    //}
}



app.use(function(req, res, next) {
    res.locals.user = req.user;
    console.log(req.sessionID); //pour afficher l'id de la session
    console.log(req.user);
    if (req.user) {
        console.log(req.user.name + " is connected");
    } else {
        console.log("No one is connected");
    }
    next();
});

app.use(cartLength);
app.use(offerApprovedReviews);


// function to call fields data on multiple page
app.use(function(req, res, next) {
    Field.find({}, function(err, fields) {
        if (err) return next(err);
        res.locals.fields = fields;
        next();
    });
});

// function to call skills data on multiple page
app.use(function(req, res, next) {
    Skill.find({}, function(err, skills) {
        if (err) return next(err);
        res.locals.skills = skills;
        next();
    });
});

// function to call roles data on multiple page
app.use(function(req, res, next) {
    Role.find({}, function(err, roles) {
        if (err) return next(err);
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
    const err = new Error('Not Found');
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
io.on('connection', function(socket) {
    //console.log('Nouvelle connexion anonyme');
    socket.on('login', function(data) {
        console.log(data);
        io.sockets.emit('notification', data);
        //Si le visiteur possede bien un compte avec ce login et ce password
        //utilisateur authentifié
        console.log("Connexion authentifiée : " + user.login);
        socket.broadcast.emit('notification', 'Test is connected');
        socket.on('called', function() {
            console.log("Request received");
            io.sockets.emit('notification', 'broadcast notification');
            //On met a jour la liste des connectés
            //connected.push({ id: user.id, login: user.login, avatar: user.avatar });
            //On lie l'utilisateur connecté au socket de manière a pouvoir le récuperer partout
            socket.set('user', user, function() {
                //On avrtis tous le monde (sauf l'utilisateur) que l'utilisateur est connecté et on leur retournes quelques infos sur lui
                //socket.broadcast.emit('new_user', { id: user.id, login: user.login, avatar: user.avatar });
                //On avertis l'utilisateur qu'il est bien connecté et on lui retourne toutes ses infos de compte
                //socket.emit('connected', { connected: connected, user: user });
            });
        });
    });
});


module.exports = app;