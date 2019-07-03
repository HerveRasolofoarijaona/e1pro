/**
 * Created by nokamojd on 16/08/2016.
 */

var mongoose = require('mongoose');
var Offer = require('../models/offer.schema');

var sendJsonResponse = (function(res, status, content) {
    res.status(status);
    res.send(content);
});

// Mapping offers to elastic search
// Offer.createMapping(function(err, mapping) {
//     if (err) {
//         console.log("error creating mapping on offers");
//         console.log(err);
//     } else {
//         console.log("Mapping created on offers");
//         console.log(mapping);
//     }
// });

var stream = Offer.synchronize();
var count = 0;

stream.on('data', function() {
    count++;
});

stream.on('close', function() {
    console.log("Indexed " + count + " offers document(s)");
});

stream.on('error', function(err) {
    console.log(err);
});


module.exports.offersImport = (function(req, res) {
    Offer.create(
        //  {"offer_title":"my offer", "offer_description":"Lorem ipsum dolor sit"},
        function(err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});


module.exports.offersList = (function(req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Offer.find(function(err, offers_all) {
        if (!offers_all) {
            sendJsonResponse(res, 404, {
                "message": "No offers found"
            });
        } else {
            sendJsonResponse(res, 200, offers_all);
        }
    }).populate('offer_field offer_author');
});


module.exports.offersGetOne = (function(req, res) {
    if (req.params && req.params.id_offer) {
        Offer
            .findById(req.params.id_offer)
            .populate('offer_field offer_author')
            .exec(function(err, offer) {
                if (!offer) {
                    sendJsonResponse(res, 404, {
                        "message": "id_offer not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, offer);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_offer in request"
        });
    }
});

module.exports.offersByAuthor = (function(req, res) {
    if (req.params && req.params.id_user) {
        Offer
            .find({ 'offer_author': { $in: req.params.id_user } })
            .populate('offer_field offer_author')
            .exec(function(err, offers_all) {
                if (!offers_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No offers found"
                    });
                } else {
                    sendJsonResponse(res, 200, offers_all);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_author in request"
        });
    }
});

module.exports.offersCreate = (function(req, res) {
    Offer.create({
        offer_title: req.body.offerTitle,
        offer_description: req.body.offerDescription,
        bundle_price: req.body.bundlePrice,
        daily_price: req.body.dailyPrice,
        half_day_price: req.body.hdPrice,
        hourly_price: req.body.hourPrice,
        conditions: req.body.conds,
        offer_location: req.body.offerLocation,
        keywords: req.body.keywords,
        offer_field: req.body.offerField,
        offer_author: req.body.offerAuthor
    }, function(err, offer) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, offer);
        }
    });
});


module.exports.offersUpdateOne = (function(req, res) {
    if (!req.params.id_offer) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_offer is required"
        });
        return;
    }
    Offer
        .findById(req.params.id_offer)
        .exec(
            function(err, offer) {
                if (!offer) {
                    sendJsonResponse(res, 404, {
                        "message": "id_offer not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                offer.offer_title = req.body.offerTitle;
                offer.offer_description = req.body.offerDescription;
                offer.bundle_price = req.body.bundlePrice;
                offer.daily_price = req.body.dailyPrice;
                offer.half_day_price = req.body.hdPrice;
                offer.hourly_price = req.body.hourPrice;
                offer.conditions = req.body.conds;
                offer.offer_location = req.body.offerLocation;
                offer.is_offer_available = req.body.offerAvailability;
                offer.keywords = req.body.keywords;
                offer.offer_field = req.body.offerField;
                offer.published = req.body.offerState;
                offer.save(function(err, offer) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, offer);
                    }
                });
            }
        );
});


module.exports.offersDeleteOne = (function(req, res) {
    var id_offer = req.params.id_offer;
    if (id_offer) {
        Offer
            .findByIdAndRemove(id_offer)
            .exec(
                function(err, offer) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_offer"
        });
    }
});


module.exports.offerAddReview = (function(req, res) {
    var id_offer = req.params.id_offer;
    if (id_offer) {
        Offer
            .findById(id_offer)
            .select('offer_reviews')
            .exec(
                function(err, offer) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddOfferReview(req, res, offer);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_offer required"
        });
    }

    /*
        // add new inner field method
        var doAddInnerSkill = function(req, res, skill) {
            if (!skill) {
                sendJsonResponse(res, 404, {
                    "message": "id_skill not found"
                });
            } else {
                skill.inner_skills.push({
                    inner_skill: req.body.inner_skill_lab,
                });
                skill.save(function(err, skill) {
                    var thisInnerSkill;
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        thisInnerSkill = skill.inner_skills[skill.inner_skills.length - 1];
                        sendJsonResponse(res, 201, thisInnerSkill);
                    }
                });
            }
        };
        
        // add new review to a offer
        var doAddOfferReview = function (req, res, offer) {
            if(!offer){
                sendJsonResponse(res, 404, {
                    "message": "id_offer not found"
                });
            }else{
                offer.offer_reviews.push({
                    review_author: req.body.reviewAuthor,
                    reviewed_offer: req.body.reviewedOffer,
                    review: req.body.reviewBody,
                    review_rating: req.body.reviewRating
                })
            }
        }*/
});