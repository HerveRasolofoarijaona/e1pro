/**
 * Created by nokamojd on 19/09/2016.
 */
var mongoose = require('mongoose');
var Cart = require('../models/cart.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});


