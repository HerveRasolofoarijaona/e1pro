/**
 * Created by nokamojd on 16/09/2016.
 */
/**
 * Created by nokamojd on 02/09/2016.
 */
var request = require('request');
var methodOverride = require('method-override');


var apiOptions = {
    server: "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
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
var renderOffersReviewsPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2eab1601665dc05e659af') return res.redirect('/denied');
    return res.render('dashboard/offers-reviews-table', {
        title: 'Dashboard - Avis Offres | Emploi1pro',
        offersReviewsList: responseBody
    })
};

// All offers reviews request
module.exports.allOffersReviews = (function (req, res) {
    var requestOptions, path;
    path = '/api/reviews';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderOffersReviewsPage(req, res, body);
        }
    );
});

/*

// Reviews by offer list page renderer
var renderReviewsByOffer = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user._id != req.params.id_user) return res.redirect('/denied');
    return res.render('dashboard/offers-reviews-table', {
        title: 'Dashboard - Avis Offres | Emploi1pro',
        offersReviews: responseBody
    })
};

// All offers request
module.exports.allReviewsByOffer = (function (req, res) {
    var requestOptions, path;
    path = '/api/offers/author/' + req.params.id_user;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderReviewsByOffer(req, res, body);
        }
    );
});


// Offer details renderer function
var renderReviewDetail = function (req, res, offer) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2eab1601665dc05e659af') return res.redirect('/denied');
    res.render('dashboard/offers-reviews-edit', {
        title: 'Dashboard - Offres | Emploi1pro',
        offer: offer
    });
};

module.exports.getOneReview = (function (req, res) {
    var requestOptions, path;
    path = '/api/offers/'+ req.params.id_offer;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions,
        function(err, response, body){
            renderReviewDetail(req, res, body);
        }
    );
});


module.exports.getReviewForm = (function (req, res) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64' && req.user.user_role!='57b2eab1601665dc05e659af') return res.redirect('/denied');
    res.render('dashboard/offers-form', {
        title: 'Créer offre | Emploi1pro'
    });
});

module.exports.addReview = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/offers';
    postData = {
        offerTitle: req.body.offer_t,
        offerDescription: req.body.offer_desc,
        bundlePrice: req.body.bdl_price,
        dailyPrice: req.body.dl_price,
        hdPrice: req.body.h_d_price,
        hourPrice: req.body.h_price,
        conds: req.body.conditions,
        offerLocation: req.body.offer_loc,
        keywords: req.body.tags,
        offerField: req.body.offer_fld,
        offerAuthor: req.body.offer_authr

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
                res.redirect('/dashboard/offers/u/'+ req.params.id_user);
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});
*/

module.exports.updateReview = (function (req, res) {
    var requestOptions, path, putData;
    path='/api/reviews/'+ req.params.id_offer_review;
    putData = {
        reviewBody: req.body.review,
        reviewRating: req.body.reviewRate,
        reviewState: req.body.reviewState
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"PUT",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 200) {
                res.redirect('/dashboard/o/reviews');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});

module.exports.deleteReview = (function (req, res) {
    var requestOptions, path;
    path='/api/reviews/'+ req.params.id_offer_review;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                return res.redirect('/dashboard/o/reviews')
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});