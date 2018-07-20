/**
 * Created by nokamojd on 16/08/2016.
 */

/**
 * Created by nokamojd on 02/08/2016.
 */
var mongoose = require('mongoose');
var Skill = require('../models/skill.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

// SAVE SOME DUMMY DATA TO THE DB
module.exports.skillsImport = (function(req, res){
    Skill.create(
        { "skill_field": "Assurance", "inner_skills":[{ "inner_skill":"Assurance habitation"},{ "inner_skill":"Assurance vie"}]},
        { "skill_field": "Comptabilité", "inner_skills":[{ "inner_skill":"Comptabilité génarale"},{ "inner_skill":"Tenue de compte"}]},
        { "skill_field": "Design", "inner_skills":[{ "inner_skill":"Conception 3D"},{ "inner_skill":"Design publicitaire"}]},
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});

/*
*Design
 -----------------------
 Conception 3D
 Design publicitaire
 Brand design
 Conception graphique
 Design d'interaction
 Création de logo
 Print design
 UX design
 Aspect visuel

 Assurance
 ------------------------
 Assurance
 Assurance habitation
 Assurance-vie
 Assurance Small Business
 Assurance santé
 Assurance automobile
 assurance des entreprises

 Comptabilité
 -------------------------
 Comptabilité génarale
 Préparation taxes
 Tenue de compte
 Expertise-comptable
 Conseiller financier
 Courtier hypothécaire
 Taxes petites entreprise
 Impôts personnels
* */


// GET SKILLS LIST
module.exports.skillsList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Skill.find({},function(err, all_skills) {
        if (err) {
            sendJsonResponse(res, 400, err);
        }
        else {
            sendJsonResponse(res, 200, all_skills);
        }
    });
});


// GET ONE SKILL BY ID
module.exports.skillsGetOne = (function (req, res) {
    if (req.params && req.params.id_skill) {
        Skill
            .findById(req.params.id_skill)
            .exec(function(err, skill) {
                if (!skill) {
                    sendJsonResponse(res, 404, {
                        "message": "id_skill not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, skill);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_skill in request"
        });
    }

});


// CREATE A NEW SKILL
module.exports.skillsCreate = (function (req, res) {
    Skill.create({
        skill_field: req.body.skill_field_lab,
        inner_skills: [
            {
                inner_skill: req.body.inner_skill_lab
            }
        ]
    }, function(err, skill) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, skill);
        }
    });
});


// UPDATE A SKILL
module.exports.skillsUpdateOne = (function (req, res) {
    if (!req.params.id_skill) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_skill is required"
        });
        return;
    }
    Skill
        .findById(req.params.id_skill)
        .exec(
            function(err, skill) {
                if (!skill) {
                    sendJsonResponse(res, 404, {
                        "message": "id_skill not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                skill.skill_field = req.body.skill_field_lab;
                    skill.inner_skills = [
                        {
                            inner_skill: req.body.inner_skill_lab
                        }
                    ];
                skill.save(function(err, skill) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, skill);
                    }
                });
            }
        );
});


// DELETE A SKILL
module.exports.skillsDeleteOne = (function (req, res) {
    var id_skill = req.params.id_skill;
    if (id_skill) {
        Skill
            .findByIdAndRemove(id_skill)
            .exec(
                function(err, skill) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_skill"
        });
    }
});


// CREATE INNER FIELD
module.exports.innerSkillsCreate = (function (req, res) {
    var id_skill = req.params.id_skill;
    if (id_skill) {
        Skill
            .findById(id_skill)
            .select('inner_skills')
            .exec(
                function(err, skill) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddInnerSkill(req, res, skill);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_skill required"
        });
    }

    // add new inner field method
    var doAddInnerSkill = function(req, res, skill) {
        if (!skill) {
            sendJsonResponse(res, 404, {
                "message": "id_skill not found"
            });
        } else {
            skill.inner_skills.push({
                inner_skill: req.body.inner_skill_lab
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
});


// GET A SINGLE INNER FIELD
module.exports.innerSkillsGetOne = (function (req, res) {
    if (req.params && req.params.id_skill && req.params.id_inner_skill) {
        Skill
            .findById(req.params.id_skill)
            .select('skill_field inner_skills')
            .exec(
                function(err, skill) {
                    var response, inner_skill;
                    if (!skill) {
                        sendJsonResponse(res, 404, {
                            "message": "id_skill not found"
                        });
                        return;
                    } else if (err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                    if (skill.inner_skills && skill.inner_skills.length > 0) {
                        inner_skill = skill.inner_skills.id(req.params.id_inner_skill);
                        if (!inner_skill) {
                            sendJsonResponse(res, 404, {
                                "message": "id_inner_skill not found"
                            });
                        } else {
                            response = {
                                skill : {
                                    skill_field : skill.skill_field,
                                    id : req.params.id_skill
                                },
                                inner_skill : inner_skill
                            };
                            sendJsonResponse(res, 200, response);
                        }
                    } else {
                        sendJsonResponse(res, 404, {
                            "message": "No inner_skills found"
                        });
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_skill and id_inner_skill are both required"
        });
    }
});


// UPDATE AN INNER FIELD
module.exports.innerSkillsUpdateOne = (function (req, res) {
    if (!req.params.id_skill || !req.params.id_inner_skill) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_skill and id_inner_skill are both required"
        });
        return;
    }
    Skill
        .findById(req.params.id_skill)
        .select('inner_skills')
        .exec(
            function(err, skill) {
                var thisInnerSkill;
                if (!skill) {
                    sendJsonResponse(res, 404, {
                        "message": "id_skill not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (skill.inner_skills && skill.inner_skills.length > 0) {
                    thisInnerSkill = skill.inner_skills.id(req.params.id_inner_skill);
                    if (!thisInnerSkill) {
                        sendJsonResponse(res, 404, {
                            "message": "id_inner_skill not found"
                        });
                    } else {
                        thisInnerSkill.inner_skill = req.body.inner_skill_lab;
                        skill.save(function(err, skill) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 200, thisInnerSkill);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No inner skill to update"
                    });
                }
            }
        );
});


// DELETE AN INNER FIELD
module.exports.innerSkillsDeleteOne = (function (req, res) {
    if (!req.params.id_skill || !req.params.id_inner_skill) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_skill and id_inner_skill are both required"
        });
        return;
    }
    Skill
        .findById(req.params.id_skill)
        .select('inner_skills')
        .exec(
            function(err, skill) {
                if (!skill) {
                    sendJsonResponse(res, 404, {
                        "message": "id_skill not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (skill.inner_skills && skill.inner_skills.length > 0) {
                    if (!skill.inner_skills.id(req.params.id_inner_skill)) {
                        sendJsonResponse(res, 404, {
                            "message": "id_inner_skill not found"
                        });
                    } else {
                        skill.inner_skills.id(req.params.id_inner_skill).remove();
                        skill.save(function(err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No inner skill to delete"
                    });
                }
            }
        );
});
