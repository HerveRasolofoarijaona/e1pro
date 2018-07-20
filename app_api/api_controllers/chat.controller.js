var mongoose = require('mongoose');
var Conversation = require('../models/conversation.schema');
/* var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});*/

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.saveConv = (function (req, res) {
    console.log('Post a Conversation: ' + JSON.stringify(req.body));

    // Create a Customer
    const conv = new Conversation({
        author: req.body.user_id,
        devis_id: req.body.devis_id,
        message: req.body.message
    });

    // Save a Customer in the MongoDB
    conv.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

/*module.exports.saveConv = (function (req, res) {
    var conv = new Conversation();
    conv.author = req.body.user_id;
    conv.devis_id = req.body.devis_id;
    conv.message = req.body.message;
    console.log(conv);
    conv.save(function (err, convers) {
        if (err) return next(err)

    })
});*/
/*module.exports.saveConv = (function (req, res) {
    Conversation.create({
        author: req.body.user_id,
        id_devis: req.body.devis_id,
        message: req.body.message
    }, function (err, conv) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, conv);
        }
        });
    console.log("resultat : " + req.body.user_id);
    //console.log(req.body.devis_id);
    //console.log(req.body.message);

});*/