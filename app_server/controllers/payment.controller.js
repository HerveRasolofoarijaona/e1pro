var request = require('request');
//var methodOverride = require('method-override');
//var async = require('async');
var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});

var apiOptions = {
    server: "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
}

// error handling function
var _showError = function(req, res, status) {
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
        errTitle: errTitle,
        content: content
    });
};

//render PAIEMENT
var renderCardsPage = function(req, res, responseBody) {
    return res.render('paiement', {
        title: 'Paiement | Emploi1pro',
        cards: responseBody,
    });
};

module.exports.pay = (function(req, res) {
    if (!req.user && !req.params.id_user) return res.redirect('/login');
    var requestOptions, path;
    console.log("pay" + req.params.id_user);
    path = '/api/pay/cardRegistered/' + req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            //console.log(body[0].ID);
            res.render('paiement', {
                title: 'Paiement | Emploi1pro',
                cards: body,
            });

        }
    );
});

/*module.exports.RegisterCard = (function (req, res) {
    if (!req.user) return res.redirect('/login');
    var requestOptions, path, postData;
    path = '/api/pay/cardRegistered/' + req.params.id_user;
    var postData = {
        'titulaire': req.body.card_owner,
        'num_card': req.body.card_num,
        'exp_date': req.body.month_exp + '/' + req.body.year_exp,
        'cvc': req.body.cvc,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData,
        //qs : {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            //console.log(body[0].ID);
            renderCardsPage(req, res, body);
        }
    );
});*/

//validation commande Page
var renderValidationPage = function(req, res, responseBody) {
    return res.render('paiement', {
        title: 'Validation Commande | Emploi1pro',
        cards: responseBody,
    });
};
module.exports.validationPage = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    var requestOptions, path;
    path = '/api/pay/validation/' + req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            console.log('app_server :' + req.params.id_user);
            renderValidationPage(req, res, body);
        }
    );
});

//Page render Confirm paiment
var renderConfirmPage = function(req, res, responseBody) {
    //console.log(responseBody);
    return res.render('validation-pay', {
        title: 'Validation Commande | Emploi1pro',
        cards: responseBody,
    });
};

module.exports.validationCommande = (function(req, res) {
    //if (!req.user) return res.redirect('/login');
    var requestOptions, path, postData;
    path = '/api/pay/validation/' + req.params.id_user;
    postData = {
        card_id: req.body.id_card,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    //console.log(postData);
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                console.log('server paycontroller: ' + JSON.stringify(req.params.id_user));
                res.redirect('/cart/pay/confirm/' + req.params.id_user);
                //console.log(body);
                //renderConfirmPage(err, res, body);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});


module.exports.confirm = (function(req, res) {
    /*res.render('validation-pay', {
        title: 'Validation Commande | Emploi1pro',
        //cards: responseBody,
    });*/
    if (!req.user) return res.redirect('/login');
    var requestOptions, path;
    path = '/api/pay/confirm/' + req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            //console.log("confirm: "+ body);
            renderConfirmPage(req, res, body);
        }
    );
});
//page render apr�s validation du paiement
/*var renderCommandPage = function (req, res, responseBody) {
    //console.log(responseBody);
    return res.render('dashboard/command', {
        title: 'Mes Commandes | Emploi1pro',
        mescom: req.flash('mescom'),
        command: responseBody,
        
    });
};*/

// Mes commandes
module.exports.commandePageRender = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    var requestOptions, path;
    path = '/api/command/' + req.params.id_user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            //renderCommandPage(req, res, body);
            return res.render('dashboard/command', {
                title: 'Mes Commandes | Emploi1pro',
                mescom: 'mescom',
                command: body,
            });
        }
    );
});

//toutes les commandes
module.exports.allCommand = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    else if (req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    var requestOptions, path;
    path = '/api/command';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                //renderCommandPage(req, res, body);
                return res.render('dashboard/command', {
                    title: 'Les Commandes | Emploi1pro',
                    mescom: '',
                    command: body,
                });
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
});

module.exports.MoneyInWithCardId = (function(req, res) {
    if (!req.user) return res.redirect('/login');
    var requestOptions, path, postData;
    postData = {
        'id_card': req.body.id_card,
        'price': req.body.price + ".00",
        'id_user': req.body.user,
    };
    console.log(postData);
    path = '/api/pay/valider/' + req.body.user;
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
            //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            res.redirect("/dashboard/command/" + req.body.user);
        }
    );
});

//RIB, cartes enregistr�es 16/07/2018
var renderBankInfo = function(req, res, responseBody) {
    //console.log(responseBody);
    return res.render('dashboard/rib', {
        title: 'Mon RIB | Emploi1pro',
        rib: responseBody,
        success: '',
        error1: '',
        error2: '',
        //command: responseBody,
    });
};

//afficher les rib
module.exports.GetRib = (function(req, res) { // 
    if (!req.user) return res.redirect('/login');
    var requestOptions, path;
    path = '/api/rib/' + req.user._id;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                renderBankInfo(req, res, body);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
    //renderBankInfo(req, res);
});

//enregistrer les rib
module.exports.RegisterRib = (function(req, res) {
    var requestOptions, path, postData;
    path = '/api/rib/registerRib';
    postData = {
        id_user: req.body.user,
        iban: req.body.iban,
        bic: req.body.bic,
        titulaire: req.body.titulaire,
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    //console.log(postData);
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 200) {
                return res.render('dashboard/rib', {
                    title: 'Mon RIB | Emploi1pro',
                    success: 'RIB bien ajout�',
                    error1: '',
                    error2: '',
                    rib: body,
                });
            } else if (response.statusCode === 242) {
                req.flash('error2', body.message);
                return res.redirect('/dashboard/rib');
            } else if (response.statusCode === 221) {
                req.flash('error1', body.message);
                return res.redirect('/dashboard/rib');
            }
        }
    );
});