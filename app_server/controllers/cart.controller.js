/**
 * Created by nokamojd on 26/09/2016.
 */
var request = require('request');
var methodOverride = require('method-override');



var apiOptions = {
    server : ""
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "";
}

// error handling function
var _showError = function (req, res, status) {
    var errTitle, content;
    if (status === 404) {
        errTitle = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        errTitle = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('index', {
        errTitle : errTitle,
        content : content
    });
};

var mongoose = require('mongoose');
var Cart = require('../../app_api/models/cart.schema');

module.exports.getCart = (function (req, res, next) {
    if(!req.user) return res.redirect('/login');
    Cart
        .findOne({owner: req.user._id})
        .populate('items.item')
        .exec(function (err, foundCart) {
            if(err) return next(err);
            res.render('cart', {
                title: 'Panier | Emploi1pro',
                cartContent: foundCart,
                errors: req.flash('remove')
            })
        });
});


