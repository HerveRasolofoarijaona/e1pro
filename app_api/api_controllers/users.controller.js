/**
 * Created by nokamojd on 18/08/2016.
 */
var mongoose = require('mongoose');
require('../models/user.schema');
var User = mongoose.model('User');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

module.exports.usersImport = (function (req, res) {
    User.create(
        //{"first_name":"Mike", "last_name":"Byby", "email":"mike@byby.com", "password":"weTest", "user_role":"57b2e3f36a0c14cc080d2f62"},
        {"first_name":"Priscilla", "last_name":"Donovan", "email":"donovan@yahoo.com", "password":"tryThis", "user_role":"57b2e3f36a0c14cc080d2f63"},
        function (err) {
            if (err) return console.log(err);
            return res.sendStatus(202);
        });
});

module.exports.usersCreate = (function (req, res) {
    User.create({
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        email : req.body.email,
        password: req.body.password,
        user_role: req.body.role

        /*personal_details:{
            birth_date: req.body.uBirthday,
            gender: req.body.uGender,
            address:{
                line1: req.body.uLine1,
                line2: req.body.uLine2,
                city: req.body.uCity,
                country: req.body.uCountry,
                region: req.body.uRegion,
                department: req.body.uDepartment,
                postal_code: req.body.uPostalCode
            }
        }*/
    },
    /*User.findOne({email: req.body.email}, function (err, existingUser) {
        if(existingUser){
            console.log(req.body.email + " already exists");
        }
    }),*/
    User.findOne({email: req.body.email} ,function(err, existingUser, user) {
        if (err) {
            sendJsonResponse(res, 400, err);
        }else if(existingUser) {
            sendJsonResponse(res, 400, err);
            console.log(req.body.email + " already exists");
        } else {
            sendJsonResponse(res, 201, user);
        }
        }));
});


module.exports.usersList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    User.find(function(err, users_all) {
        if (!users_all) {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        }
        else {
            sendJsonResponse(res, 200, users_all);
        }
    }).populate('user_role');
});

//ajout 19/04
/*module.exports.usersShow = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    User.find(function (err, users_tout) {
        if (!users_tout) {
            sendJsonResponse(res, 404, {
                "message": "No users found"
            });
        }
        else {
            sendJsonResponse(res, 200, users_tout);
        }
    }).populate('_id first_name last_name');
});*/

module.exports.usersGetOne = (function (req, res) {
    if (req.params && req.params.id_user) {
        User
            .findById(req.params.id_user)
            .populate('user_role')
            /*.populate({path: 'user_skills',
             populate:{path: 'user_skill', model:'Skill.inner_skills'}
             })*/
            //.populate('user_skills[user_skill]')
            .exec(function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, user);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_user in request"
        });
    }
});


module.exports.usersUpdateOne = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    User
        .findById(req.params.id_user)
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.first_name = req.body.firstName;
                user.last_name = req.body.lastName;
                user.email = req.body.email;
                //user.password = req.body.password;
                user.user_role = req.body.role;
                user.is_certified = req.body.certified;
                user.is_active = req.body.active;
                user.save(function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
});


module.exports.usersUpdatePersoDetails = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    User
        .findById(req.params.id_user)
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.personal_details.birth_date = req.body.birthDate;
                user.personal_details.gender = req.body.gender;
                user.personal_details.address.line1 = req.body.addressLine1;
                user.personal_details.address.line2 = req.body.addressLine2;
                user.personal_details.address.location = req.body.userLocation;
                user.personal_details.mobile_phone_number = req.body.mPhoneNumber;
                user.personal_details.home_phone_number = req.body.hPhoneNumber;
                user.save(function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
});


module.exports.usersUpdateOneBio = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    User
        .findById(req.params.id_user)
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.company_name = req.body.companyName;
                user.about = req.body.bio;
                user.qualification = req.body.uPosition;
                user.save(function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
});


module.exports.usersAddOneSkill = (function (req, res) {
    if (!req.params.id_user) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user is required"
        });
        return;
    }
    User
        .findById(req.params.id_user)
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                user.user_skills.push({
                        user_skill : req.body.userSkill
                });
                user.save(function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, user);
                    }
                });
            }
        );
});


module.exports.usersDeleteOneSkill = (function (req, res) {
    if (!req.params.id_user || !req.params.id_user_skill) {
        sendJsonResponse(res, 404, {
            "message": "Not found, id_user and id_user_skill are both required"
        });
        return;
    }
    User
        .findById(req.params.id_user)
        .select('user_skills')
        .exec(
            function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "id_user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (user.user_skills && user.user_skills.length > 0) {
                    if (!user.user_skills.id(req.params.id_user_skill)) {
                        sendJsonResponse(res, 404, {
                            "message": "id_user_skill not found"
                        });
                    } else {
                        user.user_skills.id(req.params.id_user_skill).remove();
                        user.save(function(err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No user skill to delete"
                    });
                }
            }
        );
});


module.exports.usersDeleteOne = (function (req, res) {
    var id_user = req.params.id_user;
    if (id_user) {
        User
            .findByIdAndRemove(id_user)
            .exec(
                function(err, user) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No id_user"
        });
    }
});