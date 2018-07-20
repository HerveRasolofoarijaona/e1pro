/**
 * Created by nokamojd on 11/07/2016.
 */
var request = require('request');
var methodOverride = require('method-override');
var async = require('async');
var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

var apiOptions = {
    server : "http://localhost:3000"
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


// Offers list page renderer
var renderOffersPage = function (req, res, responseBody) {
    return res.render('offers-list', {
        title: 'Offres| Emploi1pro',
        offers: responseBody
    })
};

// All offers request
module.exports.offers = (function (req, res) {
    var requestOptions, path;
    path = '/api/offers';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderOffersPage(req, res, body);
        }
    );
});


// Demands list page renderer
var renderDemandsPage = function (req, res, responseBody) {
    return res.render('demands-list', {
        title: 'Demandes | Emploi1pro',
        demands: responseBody
    })
};

// All demands request
module.exports.demands = (function (req, res) {
    var requestOptions, path;
    path = '/api/demands';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderDemandsPage(req, res, body);
        }
    );
});




// Consultant list page renderer
var renderConsultantsPage = function (req, res, responseBody) {
    return res.render('consultants-list', {
        title: 'Consultants | Emploi1pro',
        consultants: responseBody
    })
};

// All offers request
module.exports.consultants = (function (req, res) {
    var requestOptions, path;
    path = '/api/consultants';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderConsultantsPage(req, res, body);
        }
    );
});


/*module.exports.consultants = (function (req, res) {
    res.render('consultants-list', {title:'Consultants | Emploi1pro',
        consultants:[
            {
                first_name: "Patrick",
                last_name: "Leihman",
                user_skills: [],
                resume: {
                    title: 'Expert ITIL',
                    //about: String,
                    skills: ['ITIL Fondamentaux', 'MOA', 'Systèmes d\'information', 'Infrastructure', 'Cloud',
                    'Amazon EC3', 'SIRH Intégration', 'CRM Intégration'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: true,
                last_seen: '13/07/2016',
                consultant_location: 'Maisons-Alfort, Ile-de-france',
                profile_pic_path: '/images/avatars/avatar.png',
                rating: 4
            },
            {
                first_name: "François",
                last_name: "Cipher",
                user_skills: [],
                resume: {
                    title: 'Expert Technologies Microsoft',
                    //about: String,
                    skills: ['Powerpoint Ninja', 'Word Sensei', 'Sharepoint Developer', 'Excel Jinja', 'Access Expert',
                        'SQL Server Pro'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: false,
                last_seen: '12/07/2016',
                consultant_location: 'Levallois-Perret, Ile-de-france',
                profile_pic_path: '/images/avatars/man.png',
                rating: 2
            },
            {
                first_name: "Sophie",
                last_name: "Pong",
                user_skills: [],
                resume: {
                    title: 'Développeur Web PHP',
                    //about: String,
                    skills: ['PHP', 'Simphony', 'Zend Framework', 'Laravel', 'MySQL',
                        'PostgreSQL', 'Wordpress', 'CMS'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: true,
                last_seen: '11/07/2016',
                consultant_location: 'Rueil-Malmaison, Ile-de-france',
                profile_pic_path: '/images/avatars/girl.png',
                rating: 3
            },
            {
                first_name: "Mike",
                last_name: "Dallas",
                user_skills: [],
                resume: {
                    title: 'Expert ITIL',
                    //about: String,
                    skills: ['ITIL Fondamentaux', 'MOA', 'Systèmes d\'information', 'Infrastructure', 'Cloud',
                        'Amazon EC3', 'SIRH Intégration', 'CRM Intégration'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: true,
                last_seen: '13/07/2016',
                consultant_location: 'Maisons-Alfort, Ile-de-france',
                profile_pic_path: '/images/avatars/people-1.png',
                rating: 5
            },
            {
                first_name: "Simon",
                last_name: "Alberry",
                user_skills: [],
                resume: {
                    title: 'Développeur Web PHP',
                    //about: String,
                    skills: ['PHP', 'Simphony', 'Zend Framework', 'Laravel', 'MySQL',
                        'PostgreSQL', 'Wordpress', 'CMS'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: true,
                last_seen: '11/07/2016',
                consultant_location: 'Rueil-Malmaison, Ile-de-france',
                profile_pic_path: '/images/avatars/people-4.png',
                rating: 4.5
            },
            {
                first_name: "Jean-Claude",
                last_name: "Harper",
                user_skills: [],
                resume: {
                    title: 'Expert Technologies Microsoft',
                    //about: String,
                    skills: ['Powerpoint Ninja', 'Word Sensei', 'Sharepoint Developer', 'Excel Jinja', 'Access Expert',
                        'SQL Server Pro'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: false,
                last_seen: '12/07/2016',
                consultant_location: 'Levallois-Perret, Ile-de-france',
                profile_pic_path: '/images/avatars/people-2.png',
                rating: 3
            },
            {
                first_name: "Mohamed",
                last_name: "Lamine",
                user_skills: [],
                resume: {
                    title: 'Expert ITIL',
                    //about: String,
                    skills: ['ITIL Fondamentaux', 'MOA', 'Systèmes d\'information', 'Infrastructure', 'Cloud',
                        'Amazon EC3', 'SIRH Intégration', 'CRM Intégration'],
                },
                personal_details: {
                    home_phone_number: "",
                    mobile_phone_number: "",
                    address: {
                        location: "",
                        line2: "",
                        line1: ""
                    },
                },
                is_certified: true,
                last_seen: '13/07/2016',
                consultant_location: 'Maisons-Alfort, Ile-de-france',
                profile_pic_path: '/images/avatars/people-3.png',
                rating: 0
            },
        ],

        fields:[
            {
                first_name: "Comptabilité",
                innerFields:['Comptabilité','Préparation de l\'impôt', 'Comptabilité',
                    'Certified Public Accountant ( CPA)', 'Conseiller financier',
                    'Courtier hypothécaire', 'Impôts des petites entreprises', 'Impôts personnels']
            },
            {
                first_name: "Markerting",
                innerFields:['Préparation de l\'impôt', 'Comptabilité',
                    'Certified Public Accountant ( CPA)', 'Conseiller financier',
                    'Courtier hypothécaire', 'Impôts des petites entreprises', 'Impôts personnels']
            }
        ],
    });
});*/


// Offer details renderer function sur /offer/id_offer
var renderOfferDetail = function (req, res, offer) {
    if (!req.user) {
        req.flash('errors', 'Connectez-vous pour pouvoir consulter');
        return res.redirect('/login')
    }; // acceder à la requête seulement si la personne a un compte
    res.render('offer-details', {
        title: 'Offre | Emploi1pro',
        offer: offer,
        //users: users
    });
};

module.exports.offerDetails = (function (req, res) {
   var requestOptions, path;
    path = '/api/offers/'+ req.params.id_offer;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderOfferDetail(req, res, body);
        }
    );
});

module.exports.postReview = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/reviews';
    postData = {
        reviewAuthor: req.body.reviewAuthor,
        reviewedOffer: req.body.reviewedOffer,
        reviewBody: req.body.reviewBody,
        reviewRating: req.body.reviewRating
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('/offers/'+req.params.id_offer);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});

var mongoose = require('mongoose');
require('../../app_api/models/cart.schema');
var Cart = mongoose.model('Cart');

module.exports.addToCart = (function (req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, cart){
        cart.items.push({
            item: req.body.offerItem,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity)
        });
        cart.total_price = (cart.total_price + parseFloat(req.body.price)).toFixed(2);

        cart.save(function (err) {
            if(err) return next(err);
            return res.redirect('/cart');
        })
    })
});

module.exports.removeItemFromCart = (function (req, res, next) {
   Cart.findOne({owner: req.user._id}, function (err, cartContent) {
       cartContent.items.pull(String(req.body.offerItem));
       cartContent.total_price = (cartContent.total_price - parseFloat(req.body.price)).toFixed(2);
       cartContent.save(function (err, cartRest) {
           if(err) return next(err);
           req.flash('remove', 'Article retiré du panier');
           res.redirect('/cart')
       })
   })
});

/*
// Offer reviews details renderer function
var renderOfferReviewsDetail = function (req, res, offerReviews) {
    if(!req.user) return res.redirect('/login');
    res.render('offer-details', {
        title: 'Offre | Emploi1pro',
        offerReviews: offerReviews
    });
};

// Offer details with reviews
module.exports.offerDetailsWithReviewsApproved = (function (req, res) {
    var requestOptions, path;
    path = '/api/reviews/approved/'+ req.params.id_offer;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderOfferReviewsDetail(req, res, body);
        }
    );
});*/



// Demand details renderer function
var renderDemandDetail = function (req, res, demand) {
    if (!req.user) {
        req.flash('errors', 'Connectez-vous pour pouvoir consulter');
        return res.redirect('/login')
    }; // acceder à la requête seulement si la personne a un compte
    res.render('demand-details', {
        title: 'Demandes | Emploi1pro',
        demand: demand,
        success: req.flash("success")
    });
};


module.exports.demandDetails = (function (req, res) {
    var requestOptions, path;
    path = '/api/demands/'+ req.params.id_demand;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderDemandDetail(req, res, body);
        }
    );
});





module.exports.consultantDetails = (function (req, res) {
    if (!req.user) {
        req.flash('errors', 'Connectez-vous pour pouvoir consulter'); 
        return res.redirect('/login')
    }; // acceder à la requête seulement si la personne a un compte
    res.render('consultant-details', {title: 'consultant firstname | Emploi1Pro'});
});


module.exports.createOffer = (function (req, res) {
    res.render('dashboard/offer-form', {title: 'Emploi1Pro | Nouvelle offre'});
});

module.exports.createDemand = (function (req, res) {
    res.render('demand-form', {title: 'Emploi1Pro | Nouvelle demande'});
});