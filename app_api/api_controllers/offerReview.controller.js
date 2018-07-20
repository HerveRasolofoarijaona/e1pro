/**
 * Created by nokamojd on 09/09/2016.
 */
var mongoose = require('mongoose');
var offerReview = require('../models/offerReview.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});


module.exports.offerReviewsImport = (function (req, res) {
    offerReview.create(
        //{"offer_title":"my offer", "offer_description":"Lorem ipsum dolor sit"},
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
    });
});


module.exports.offerReviewsList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    offerReview.find({},function(err, offers_review) {
        if (!offers_review) {
            sendJsonResponse(res, 404, {
                "message": "No reviews found"
            });
        }
        else {
            sendJsonResponse(res, 200, offers_review);
        }
    }).populate('review_author').populate('reviewed_offer', 'offer_title')
    ;
});


// Get one review details
module.exports.offerReviewsGetOne = (function (req, res) {
    if (req.params && req.params.id_offer_review) {
        offerReview
            .findById(req.params.id_offer_review)
            .populate('review_author reviewed_offer', 'offer_title')
            .exec(function(err, offerReview) {
                if (!offerReview) {
                    sendJsonResponse(res, 404, {
                        "message": "id_offer_review not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, offerReview);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_offer_review in request"
        });
    }
});

// Get reviews by offer
module.exports.reviewsByOffer = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    if(req.params && req.params.id_offer){
        offerReview
            .find({'reviewed_offer': {$in : req.params.id_offer}})
            .exec(function (err, reviews_all) {
                if(!reviews_all){
                    sendJsonResponse(res, 404, {
                        "message": "No reviews found"
                    })
                }
                else{
                    sendJsonResponse(res, 200, reviews_all);
                }
            });
    } else{
        sendJsonResponse(res, 404, {
            "message": "No id_offer in request"
        })
    }
});


// Get reviews that are approved by offer
module.exports.reviewsApprovedByOffer = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    if(req.params && req.params.id_offer){
        offerReview
            .find({reviewed_offer: {$in : req.params.id_offer}})
            .where('review_approved').equals(true)
            .populate('review_author reviewed_offer')
            /*.populate({path: 'reviewed_offer',
                populate:{path: 'offer_author offer_field'}
            })*/
            .exec(function (err, reviews_all) {
                if(!reviews_all){
                    sendJsonResponse(res, 404, {
                        "message": "No reviews found"
                    })
                }
                else{
                    sendJsonResponse(res, 200, reviews_all);
                }
            });
    } else{
        sendJsonResponse(res, 404, {
            "message": "No id_offer in request"
        })
    }
});



module.exports.offerReviewsByAuthor = (function (req, res) {
    if (req.params && req.params.id_user) {
        offerReview
            .find({'review_author': {$in :req.params.id_user}})
            .exec(function(err, reviews_all) {
                if (!reviews_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No reviews found"
                    });
                }
                else {
                    sendJsonResponse(res, 200, reviews_all);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_author in request"
        });
    }
});


module.exports.offerReviewsCreate = (function (req, res) {
    offerReview.create({
        review_author: req.body.reviewAuthor,
        reviewed_offer: req.body.reviewedOffer,
        review: req.body.reviewBody,
        review_rating: req.body.reviewRating
    }, function(err, offerReview) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, offerReview);
        }
    });
});


module.exports.offerReviewsUpdateOne = (function (req, res) {
    if (!req.params.id_offer_review) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_offer is required"
        });
        return;
    }
    offerReview
        .findById(req.params.id_offer_review)
        .exec(
            function(err, offerReview) {
                if (!offerReview) {
                    sendJsonResponse(res, 404, {
                        "message": "id_offer not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                offerReview.review= req.body.reviewBody;
                offerReview.review_rating= req.body.reviewRating;
                offerReview.review_approved= req.body.reviewState;
                offerReview.save(function(err, offerReview) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, offerReview);
                    }
                });
            }
        );
});


module.exports.offerReviewsDeleteOne = (function (req, res) {
    var id_offer = req.params.id_offer_review;
    if (id_offer) {
        offerReview
            .findByIdAndRemove(id_offer)
            .exec(
                function(err, offerReview) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_offer_review"
        });
    }
});