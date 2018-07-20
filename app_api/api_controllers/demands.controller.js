/**
 * Created by nokamojd on 17/08/2016.
 */
var mongoose = require('mongoose');
var Demand = require('../models/demand.schema');
var User = require('../models/user.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

// Mapping demands to elastic search
Demand.createMapping(function(err, mapping){
    if(err){
        console.log("error creating mapping on Demands");
        console.log(err);
    } else{
        console.log("Mapping created on demands");
        console.log(mapping);
    }
});

var stream = Demand.synchronize();
var count = 0;

stream.on('data', function () {
    count++;
});

stream.on('close', function () {
    console.log("Indexed " + count + " Demands document(s)");
});

stream.on('error', function (err) {
    console.log(err);
});


module.exports.demandsImport = (function (req, res) {
    Demand.create(
        //  {"offer_title":"my offer", "offer_description":"Lorem ipsum dolor sit"},
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});

// test 18/04 sortir tous les users
/*module.exports.usersList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    User.find(function (err, users_all) {
        if (!users_all) {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        }
        else {
            sendJsonResponse(res, 200, users_all);
        }
    }).populate('_id fisrt_name last_name');
});*/


module.exports.demandsList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Demand.find({"dmd_approved" : "true"},function(err, demands_all) {
        if (!demands_all) {
            sendJsonResponse(res, 404, {
                "message": "No demands found"
            });
        }
        else {
            sendJsonResponse(res, 200, demands_all);
        }
    }).populate('dmd_field dmd_author');
});


module.exports.demandsGetOne = (function (req, res) {
    if (req.params && req.params.id_demand) {
        Demand
            .findById(req.params.id_demand)
            .populate('dmd_field dmd_author dmd_required_skills')
            .exec(function(err, demand) {
                if (!demand) {
                    sendJsonResponse(res, 404, {
                        "message": "id_demand not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, demand);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_demand in request"
        });
    }
});


module.exports.demandsByAuthor = (function (req, res) {
    if (req.params && req.params.id_user) {
        Demand
            .find({'dmd_author': {$in :req.params.id_user}}) // $in av modif
            .populate('dmd_field dmd_author dmd_required_skills')
            .exec(function(err, demands_all) {
                if (!demands_all) {
                    sendJsonResponse(res, 404, {
                        "message": "No demands found"
                    });
                }
                else {
                    sendJsonResponse(res, 200, demands_all);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_author in request"
        });
    }
});


module.exports.demandsCreate = (function (req, res) {
    Demand.create({
        dmd_title: req.body.dmdTitle,
        dmd_description: req.body.dmdDescription,
        dmd_desired_start_date: req.body.dmdDStartDate,
        dmd_supposed_end_date: req.body.dmdSEndDate,
        dmd_conditions: req.body.dmdConditions,
        dmd_estimated_budget: parseFloat(req.body.dmdEstimatedBudget).toFixed(2),
        dmd_location: req.body.dmdLocation,
        dmd_field: req.body.dmdField,
        dmd_required_skills: req.body.dmdRequiredSkills,
        dmd_author: req.body.dmdAuthor,
        dmd_duree: req.body.dmdDuree,
    }, function(err, demand) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, demand);
        }
    });
});


module.exports.demandsUpdateOne = (function (req, res) {
    if (!req.params.id_demand) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_demand is required"
        });
        return;
    }
    Demand
        .findById(req.params.id_demand)
        .exec(
            function(err, demand) {
                if (!demand) {
                    sendJsonResponse(res, 404, {
                        "message": "id_demand not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                demand.dmd_title= req.body.dmdTitle;
                demand.dmd_description= req.body.dmdDescription;
                demand.dmd_desired_start_date= req.body.dmdDStartDate;
                demand.dmd_supposed_end_date= req.body.dmdSEndDate;
                demand.dmd_conditions= req.body.dmdConditions;
                demand.dmd_estimated_budget= req.body.dmdEstimatedBudget;
                demand.dmd_location= req.body.dmdLocation;
                demand.dmd_field= req.body.dmdField;
                demand.dmd_required_skills= req.body.dmdRequiredSkills;
                demand.dmd_author= req.body.dmdAuthor;
                demand.is_dmd_available = req.body.dmdAvailability;
                demand.is_dmd_completed = req.body.dmdState;
                demand.dmd_duree = req.body.dmdDuree;
                demand.save(function(err, demand) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, demand);
                    }
                });
            }
        );
});

//Approuver une demande
module.exports.demandApprouve = (function (req, res) {
    if (!req.params.id_demand) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_demand is required"
        });
        return;
    }
    Demand
        .findById(req.params.id_demand)
        .exec(
        function (err, demand) {
            if (!demand) {
                sendJsonResponse(res, 404, {
                    "message": "id_demand not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            demand.dmd_approved = "true" ;
            demand.save(function (err, demand) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, demand);
                }
            });
        }
        );
});


module.exports.demandsDeleteOne = (function (req, res) {
    var id_demand = req.params.id_demand;
    if (id_demand) {
        Demand
            .findByIdAndRemove(id_demand)
            .exec(
                function(err, demand) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_demand"
        });
    }
});