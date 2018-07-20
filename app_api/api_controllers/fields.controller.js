/**
 * Created by nokamojd on 02/08/2016.
 */
var mongoose = require('mongoose');
var Field = require('../models/field.schema');

var sendJsonResponse = (function (res, status, content) {
    res.status(status);
    res.send(content);
});

// SAVE SOME DUMMY DATA TO THE DB
module.exports.import = (function(req, res){
    Field.create(
        { "field_name": "Ben", "field_slug": "DJ Code Red", "inner_fields":[{ "inner_field_name":"test"},{ "inner_field_name":"testou"}]},
        { "field_name": "Mike D.", "field_slug": "Kingston Kats", "inner_fields":[{ "inner_field_name":"test"},{ "inner_field_name":"testi"}] },
        { "field_name": "Eric", "field_slug": "Eric", "inner_fields":[{ "inner_field_name":"test"},{ "inner_field_name":"testa"}] },
        { "field_name": "Paul", "field_slug": "The Eyeliner", "inner_fields":[{ "inner_field_name":"test"}, { "inner_field_name":"teste"}] },
        function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
});


// GET FIELDS LIST
module.exports.fieldsList = (function (req, res) {
    //sendJsonResponse(res, 200, {"status": "success"});
    Field.find({},function(err, allfields) {
        if (err) {
            sendJsonResponse(res, 400, err);
        }
        else {
            sendJsonResponse(res, 200, allfields);
        }
    });
});


// GET ONE FIELD BY ID
module.exports.fieldsGetOne = (function (req, res) {
    if (req.params && req.params.idfield) {
        Field
            .findById(req.params.idfield)
            .exec(function(err, field) {
                if (!field) {
                    sendJsonResponse(res, 404, {
                        "message": "idfield not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, field);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No idfield in request"
        });
    }
    // Second method
    /* var id = req.params.id;
    Field.findOne({'_id':id},function(err, field) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, field);
        }
    });*/
});


// CREATE A NEW FIELD
module.exports.fieldsCreate = (function (req, res) {
    Field.create({
        field_name: req.body.fieldname,
        field_slug: req.body.fieldslug
        /*inner_fields: [
            {
                inner_field_name: req.body.innerfield1
            },
            {
                inner_field_name: req.body.innerfield2
            }
        ]*/
    }, function(err, field) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, field);
        }
    });
    // Second method
    /*var field = new Field({
        field_name: req.body.fieldname,
        field_slug: req.body.fieldslug,
        inner_fields: [
            {
            inner_field_name: req.body.innerfield1
            },
            {
                inner_field_name: req.body.innerfield2
            }
        ]
    });
    field.save(function(err, field) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, field);
        }
    });*/
});


// UPDATE A FIELD
module.exports.fieldsUpdateOne = (function (req, res) {
    if (!req.params.idfield) {
        sendJsonResponse(res, 404, {
            "message": "Not found, idfield is required"
        });
        return;
    }
    Field
        .findById(req.params.idfield)
        .exec(
            function(err, field) {
                if (!field) {
                    sendJsonResponse(res, 404, {
                        "message": "idfield not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                field.field_name = req.body.fieldname;
                field.field_slug =req.body.fieldslug;
                /*field.inner_fields = [
                    {
                        inner_field_name: req.body.innerfield1
                    },
                    {
                        inner_field_name: req.body.innerfield2
                    }
                ];*/
                field.save(function(err, field) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, field);
                    }
                });
            }
        );
});


// DELETE A FIELD
module.exports.fieldsDeleteOne = (function (req, res) {
    var idfield = req.params.idfield;
    if (idfield) {
        Field
            .findByIdAndRemove(idfield)
            .exec(
                function(err, field) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No idfield"
        });
    }
});

/*
// CREATE INNER FIELD
module.exports.innerFieldsCreate = (function (req, res) {
    var idfield= req.params.idfield;
    if (idfield) {
        Field
            .findById(idfield)
            .select('inner_fields')
            .exec(
                function(err, field) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddInnerField(req, res, field);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, idfield required"
        });
    }

    // add new inner field method
    var doAddInnerField = function(req, res, field) {
        if (!field) {
            sendJsonResponse(res, 404, {
                "message": "idfield not found"
            });
        } else {
            field.inner_fields.push({
                inner_field_name: req.body.innerfieldname,
            });
            field.save(function(err, field) {
                var thisInnerField;
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    thisInnerField = field.inner_fields[field.inner_fields.length - 1];
                    sendJsonResponse(res, 201, thisInnerField);
                }
            });
        }
    };
});


// GET A SINGLE INNER FIELD
module.exports.innerFieldsGetOne = (function (req, res) {
    if (req.params && req.params.idfield && req.params.idinnerfield) {
        Field
            .findById(req.params.idfield)
            .select('field_name inner_fields')
            .exec(
                function(err, field) {
                    var response, innerfield;
                    if (!field) {
                        sendJsonResponse(res, 404, {
                            "message": "idfield not found"
                        });
                        return;
                    } else if (err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                    if (field.inner_fields && field.inner_fields.length > 0) {
                        innerfield = field.inner_fields.id(req.params.idinnerfield);
                        if (!innerfield) {
                            sendJsonResponse(res, 404, {
                                "message": "idinnerfield not found"
                            });
                        } else {
                            response = {
                                field : {
                                    field_name : field.field_name,
                                    id : req.params.idfield
                                },
                                innerfield : innerfield
                            };
                            sendJsonResponse(res, 200, response);
                        }
                    } else {
                        sendJsonResponse(res, 404, {
                            "message": "No innerfields found"
                        });
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, idfield and idinnerfield are both required"
        });
    }
});


// UPDATE AN INNER FIELD
module.exports.innerFieldsUpdateOne = (function (req, res) {
    if (!req.params.idfield || !req.params.idinnerfield) {
        sendJsonResponse(res, 404, {
            "message": "Not found, idfield and idinnerfield are both required"
        });
        return;
    }
    Field
        .findById(req.params.idfield)
        .select('inner_fields')
        .exec(
            function(err, field) {
                var thisInnerField;
                if (!field) {
                    sendJsonResponse(res, 404, {
                        "message": "idfield not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (field.inner_fields && field.inner_fields.length > 0) {
                    thisInnerField = field.inner_fields.id(req.params.idinnerfield);
                    if (!thisInnerField) {
                        sendJsonResponse(res, 404, {
                            "message": "idinnerfield not found"
                        });
                    } else {
                        thisInnerField.inner_field_name = req.body.innerfieldname;
                        field.save(function(err, field) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 200, thisInnerField);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No inner field to update"
                    });
                }
            }
        );
});


// DELETE AN INNER FIELD
module.exports.innerFieldsDeleteOne = (function (req, res) {
    if (!req.params.idfield || !req.params.idinnerfield) {
        sendJsonResponse(res, 404, {
            "message": "Not found, idfield and idinnerfield are both required"
        });
        return;
    }
    Field
        .findById(req.params.idfield)
        .select('inner_fields')
        .exec(
            function(err, field) {
                if (!field) {
                    sendJsonResponse(res, 404, {
                        "message": "idfield not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (field.inner_fields && field.inner_fields.length > 0) {
                    if (!field.inner_fields.id(req.params.idinnerfield)) {
                        sendJsonResponse(res, 404, {
                            "message": "idinnerfield not found"
                        });
                    } else {
                        field.inner_fields.id(req.params.idinnerfield).remove();
                        field.save(function(err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No inner field to delete"
                    });
                }
            }
        );
});

    */