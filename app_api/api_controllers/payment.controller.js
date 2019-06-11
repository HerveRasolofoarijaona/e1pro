var mongoose = require('mongoose');
var User = require('../models/user.schema');
var Cart = require('../models/cart.schema');
var Commande = require('../models/commande.schema');
//var User = ...
var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});
var request = require('request');
var urlDirectkit = "https://sandbox-api.lemonway.fr/mb/demo/dev/directkitjson2/Service.asmx/";

function sendRequest(methodName, postData, callback) {
    // Configure
    var options = {
        url: urlDirectkit + methodName,
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        json: postData
    };

    request(options, callback);
}
// Callback function
function GetWalletDetailsResult(error, response, body) {
    if (error) {
        // Handle request error
        console.log(error);
    } else if (response.statusCode != 200) {
        // Handle HTTP error
        console.log("Error " + response.statusCode + ": " + body.Message);
    } else {
        if (body.d.E) {
            // Handle API error
            console.log(body.d.E);
        } else
            console.log(body.d.WALLET.CARDS);
        //sendJsonResponse(res, 200, body.d.WALLET.CARDS);
    }
}

module.exports.GetCard = (function(req, res) { // afficher les cartes qui existent
    //console.log("GETCARD: " + req.params.id_user);
    if (req.params && req.params.id_user) {
        // Method name
        var methodName = "GetWalletDetails";
        // Parameters
        var postData = {
            "p": {
                "wlLogin": "society",
                "wlPass": "123456",
                "language": "en",
                "version": "1.9",
                "walletIp": "1.1.1.1",
                "walletUa": "Node.js Tutorial",
                "wallet": "101825062018"
            }
        };
        sendRequest(methodName, postData, function(error, response, body) {
            if (error) {
                // Handle request error
                console.log(error);
            } else if (response.statusCode != 200) {
                // Handle HTTP error
                console.log("Error " + response.statusCode + ": " + body.Message);
                /*sendJsonResponse(res, 404, {
                    "message": "Operation refused"
                });*/
            } else {
                if (body.d.E) {
                    // Handle API error
                    console.log(body.d.E);
                } else {
                    var results = body.d.WALLET.CARDS; // data depuis bdd lemonway
                    User
                        .findById(req.params.id_user)
                        //.populate('dmd_field dmd_author dmd_required_skills')
                        .exec(function(err, user) {
                            if (!user) {
                                sendJsonResponse(res, 404, {
                                    "message": "id_user not found"
                                });
                                return;
                            } else if (err) {
                                sendJsonResponse(res, 404, err);
                                return;
                            } else {
                                var select = [];
                                var cards = user.payment; // data depuis bdd mongo
                                for (var j = 0; j < cards.length; j++) {
                                    for (var i = 0; i < results.length; i++) {
                                        if (cards[j].card == results[i].ID) {
                                            select.push(results[i]); // 
                                            select.push(cards[j]);
                                        }
                                    }
                                }
                                console.log(select);
                                sendJsonResponse(res, 200, select);
                            }
                            //
                            //sendJsonResponse(res, 200, body.d.WALLET.CARDS);
                        });

                }
            }
        });
        /*User
            .findById(req.params.id_user)
            //.populate('dmd_field dmd_author dmd_required_skills')
            .exec(function (err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                var cards = user.payment
                sendJsonResponse(res, 200, cards);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_user in request"
        });*/
    }

});

//Enregistrer une carte
module.exports.RegisterCard = (function(req, res) { // afficher les cartes qui existent
    if (req.params && req.params.id_user) {
        // Method name
        var methodName = "RegisterCard";
        // Parameters
        var postData = {
            "p": {
                "wlLogin": "society",
                "wlPass": "123456",
                "language": "en",
                "version": "1.9",
                "walletIp": "1.1.1.1",
                "walletUa": "Node.js Tutorial",
                "wallet": "101825062018",
                "cardType": "0",
                "cardNumber": req.body.num_card,
                "cardCode": req.body.cvc,
                "cardDate": req.body.exp_date,
                //"specialConfig": "string",
            }
        };
        sendRequest(methodName, postData, function(error, response, body) {
            if (error) {
                // Handle request error
                console.log(error);
            } else if (response.statusCode != 200) {
                // Handle HTTP error
                console.log("Error " + response.statusCode + ": " + body.Message);
            } else {
                if (body.d.E) {
                    // Handle API error
                    console.log(body.d.E);
                } else {
                    console.log("RegisterCARD: " + req.params.id_user);
                    User.findOne({ "_id": req.params.id_user }, function(err, user) {
                        if (err) {
                            console.log(err);
                        } else if (!user) {
                            console.log("user vide");
                        }
                        user.payment.push({
                            card: body.d.CARD.ID,
                            titulaire: req.body.titulaire,
                        });
                        user.save(function(err) {
                            if (err) return err;
                            console.log("user.save");
                            //console.log(body.d.WALLET.CARDS);
                            sendJsonResponse(res, 200, body.d.CARD);
                        });
                    });
                }



            }
        });
    }

});

//get cammandPageRender
module.exports.commandePageRender = (function(req, res) {
    Commande
        .find({ 'owner': req.params.id_user }, function(err, command) {
            if (!command) {
                sendJsonResponse(res, 404, {
                    "message": "id_command not found"
                });
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            } else {
                sendJsonResponse(res, 200, command);
            }
        }).populate('items.item');
});
//Toutes les commandes
module.exports.allCommand = (function(req, res) {
    Commande
        .find({}, function(err, command) {
            if (!command) {
                sendJsonResponse(res, 404, {
                    "message": "id_command not found"
                });
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            } else {
                sendJsonResponse(res, 200, command);
            }
        }).populate('items.item');
});

//Les commandes en fonction  des utilisateurs
module.exports.allCommandByUser = (function(req, res) {
    //17/07 � compl�ter
});

module.exports.MoneyInWithCardId = (function(req, res) {
    var postData = {
        "p": {
            "wlLogin": "society",
            "wlPass": "123456",
            "language": "en",
            "version": "1.9",
            "walletIp": "1.1.1.1",
            "walletUa": "Node.js Tutorial",
            "wallet": "101825062018",
            "amountTot": req.body.price,
            "amountCom": "0.00",
            //"comment": "string",
            "cardId": req.body.id_card,
            "autoCommission": "0",
            "isPreAuth": "0",
            "specialConfig": "",
            "wkToken": "",
        }
    };
    var methodName = "MoneyInWithCardId";
    sendRequest(methodName, postData, function(error, response, body) {
        if (error) {
            // Handle request error
            console.log(error);
        } else if (response.statusCode != 200) {
            // Handle HTTP error
            console.log("Error " + response.statusCode + ": " + body.Message);
        } else {
            if (body.d.E) {
                // Handle API error
                console.log(body.d.E);
            } else {
                //console.log(body.d.WALLET.CARDS);
                //console.log(body.d.CARD);
                sendJsonResponse(res, 200, body.d.TRANS.HPAY);
                Cart
                    .find({ 'owner': req.params.id_user })
                    .exec(
                        function(err, cart) {
                            if (!cart) {
                                sendJsonResponse(res, 404, {
                                    "message": "id_cart not found"
                                });
                                return;
                            } else if (err) {
                                console.log('api controller erreur');
                                sendJsonResponse(res, 400, err);
                                return;
                            }
                            var id_panier = cart[0]._id;
                            var commande = new Commande();
                            commande.owner = cart[0].owner;
                            commande.card_used = cart[0].card_used;
                            commande.total_price = cart[0].total_price;
                            commande.paid = "true";
                            var length = cart[0].items.length;
                            for (var i = 0; i < length; i++) {
                                commande.items.push({
                                    item: cart[0].items[i].item,
                                    price: cart[0].items[i].price,
                                    //quantity: parseInt(req.body.quantity)
                                });
                            }
                            Cart.findByIdAndRemove({ "_id": id_panier })
                                .exec(
                                    function(err, cart) {
                                        if (err) {
                                            //sendJsonResponse(res, 404, err);
                                            console.log(err);
                                            return;
                                        }
                                        //sendJsonResponse(res, 204, null);
                                        console.log("Panier r�initialis�");
                                    }); //supprimer le panier 
                            commande.save(function(err, command) {
                                if (err) return next(err);
                                //console.log(cart._id);

                                var panier = new Cart(); // recr�er le panier
                                panier.owner = command.owner;
                                panier.save(function(err) {
                                    if (err) return next(err);

                                });
                            });
                            console.log("Paiement ACCEPTE");
                        });
                //console.log("id a supprimer: " + id_panier);


            }
        }
    });
});
//supprimer carte enregistr�e
module.exports.UnRegisterCard = (function(req, res) {
    if (req.params && req.params.id_user) {
        // Method name
        var methodName = "UnregisterCard";
        // Parameters
        var postData = {
            "p": {
                "wlLogin": "society",
                "wlPass": "123456",
                "language": "en",
                "version": "1.9",
                "walletIp": "1.1.1.1",
                "walletUa": "Node.js Tutorial",
                "wallet": "101825062018",
                "cardId": req.body.id_card,
            }
        };
        sendRequest(methodName, postData, function(error, response, body) {
            if (error) {
                // Handle request error
                console.log(error);
            } else if (response.statusCode != 200) {
                // Handle HTTP error
                console.log("Error " + response.statusCode + ": " + body.Message);
            } else {
                if (body.d.E) {
                    // Handle API error
                    console.log(body.d.E);
                } else {
                    //console.log(body.d.WALLET.CARDS);
                    //console.log(body.d.CARD);
                    sendJsonResponse(res, 200, body.d.CARD);
                }
            }
        });
    }

});
module.exports.ValidCommand = (function(req, res) {
    //if(!req.user) return res.redirect('/login');
    Cart
        .find({ 'owner': req.params.id_user }, function(err, cart) {
            if (!cart) {
                sendJsonResponse(res, 404, {
                    "message": "id_cart not found"
                });
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            sendJsonResponse(res, 200, cart);
        }).populate('items.item');
});

module.exports.ValidCommandCard = (function(req, res) {
    //if (!req.user) return res.redirect('/login');
    Cart
        .update({ 'owner': req.params.id_user }, {
            $set: {
                'card_used': req.body.card_id,
            }
        })
        .exec(
            function(err, modif) {
                if (!modif) {
                    sendJsonResponse(res, 404, {
                        "message": "id_cart not found"
                    });
                    return;
                } else if (err) {
                    console.log('api controller erreur');
                    sendJsonResponse(res, 400, err);
                    return;
                }
                sendJsonResponse(res, 200, modif);
            });
});

//RIB IBAN 16/07/2018
module.exports.GetIBAN = (function(req, res) { // afficher les cartes qui existent
    console.log("GETIBAN: " + req.params.id_user);
    if (req.params.id_user) {
        // Method name
        var methodName = "GetWalletDetails";
        // Parameters
        var postData = {
            "p": {
                "wlLogin": "society",
                "wlPass": "123456",
                "language": "en",
                "version": "1.9",
                "walletIp": "1.1.1.1",
                "walletUa": "Node.js Tutorial",
                "wallet": "101825062018"
            }
        };
        sendRequest(methodName, postData, function(error, response, body) {
            if (error) {
                // Handle request error
                console.log(error);
            } else if (response.statusCode != 200) {
                // Handle HTTP error
                console.log("Error " + response.statusCode + ": " + body.Message);
                /*sendJsonResponse(res, 404, {
                    "message": "Operation refused"
                });*/
            } else {
                if (body.d.E) {
                    // Handle API error
                    console.log(body.d.E);
                } else {
                    //console.log("GetIBAN : " + JSON.stringify(body.d.WALLET));
                    sendJsonResponse(res, 200, body.d.WALLET.IBANS);
                }
            }
        });
    }

});

module.exports.RegisterRib = (function(req, res) { // afficher les cartes qui existent
    var id_user = req.body.id_user;
    if (!id_user) { return res.redirect('login'); } else if (id_user) {
        // Method name
        var methodName = "RegisterIBAN";
        // Parameters
        var postData = {
            "p": {
                "wlLogin": "society",
                "wlPass": "123456",
                "language": "en",
                "version": "1.9",
                "walletIp": "1.1.1.1",
                "walletUa": "Node.js Tutorial",
                "wallet": "101825062018",
                "holder": req.body.titulaire,
                "bic": req.body.bic,
                "iban": req.body.iban,
                //"dom1": "",
                //"dom2": "",
                //"comment": "",
                //"ignoreIbanFormat": "string",
            }
        };
        sendRequest(methodName, postData, function(error, response, body) {
            if (error) {
                // Handle request error
                console.log(error);
            } else if (response.statusCode != 200) {
                // Handle HTTP error
                console.log("Error " + response.statusCode + ": " + body.Message);
            } else {
                if (body.d.E) {
                    // Handle API error
                    console.log(body.d.E);
                    if (body.d.E.Code == 242) {
                        sendJsonResponse(res, 242, {
                            "message": "Mauvais Format, 11 charact�res requis",
                        });
                    } else if (body.d.E.Code == 221) {
                        sendJsonResponse(res, 221, {
                            "message": "Mauvais Format, Verifier votre IBAN",
                        });
                    }

                } else {
                    //console.log('id_user : ' + id_user);
                    //console.log("id-iban : " + body.d.IBAN_REGISTER.ID);
                    User /*.update({ "_id": id_user }, { $push : { rib : body.d.IBAN_REGISTER.ID } });*/
                    //sendJsonResponse(res, 200, body.d.IBAN);
                        .findById(id_user)
                        .exec(function(err, user) {
                            if (!user) {
                                console.log("message : id_user not found");
                                return;
                            } else if (err) {
                                sendJsonResponse(res, 400, err);
                                return;
                            }
                            User.update({ "_id": id_user }, { $set: { "rib": null } });
                            user.rib.push({
                                id_iban: body.d.IBAN_REGISTER.ID,
                            });
                            user.save(function(err, user) {
                                if (err) {
                                    console.log(err);
                                    sendJsonResponse(res, 404, err);
                                } else {
                                    sendJsonResponse(res, 200, body.d.IBAN_REGISTER.ID);
                                }
                            });
                        });
                }
            }
        });
    }

});