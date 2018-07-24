/**
 * Created by nokamojd on 15/07/2016.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb");//qd c'est en ligne
mongoose.connect("mongodb://localhost/user"); //en local


/*
var gracefulShutdown;
var dbURI = 'mongodb://root:37tcMuuuq@127.0.0.1:28018/admin/eappDB';
var dbURI = "mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb";
mongoose.Promise = global.Promise;
var db = mongoose.connect(dbURI);
db.once('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

db.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

db.close('',function () {
    console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
    db.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

require('./field.schema');
*/
