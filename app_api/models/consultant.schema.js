/**
 * Created by nokamojd on 21/09/2016.
 */
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;


var experienceSchema = new Schema({
    experience:{
        exp_title: {type:String},
        exp_company:{type:String},
        exp_description: {type:String},
        exp_startDate: {type:Date},
        exp_end_date: {type:Date}
    }
});


var educationSchema = new Schema({
    education: {
        diplomas_title: {type: String},
        year_started: {type: Date},
        year_gotten: {type: Date},
        school_name: {type: String},
        speciality: {type: String}
    }
});


var certifSchema = new Schema({
    certification:{
        certif_title: {type:String},
        certif_year_gotten: {type:Date},
        certif_o_name: {type:String}
    }
});

var languageSchema = new Schema({
    language:{
        type: Schema.ObjectId,
        ref: 'Language'
    }
});

var consultantSchema = new Schema({
    related_user:{
       type: Schema.ObjectId,
       ref:'User'
    },
    resume:{
       experiences:[experienceSchema],
       educations:[educationSchema],
       certifications:[certifSchema],
       languages: [languageSchema]
    },
    legalDetails:{
       legalStatus:{
           type: Schema.ObjectId,
           ref:'LegalStatus'
       },
       siretNumber: Number,
       ape_naf: Number
    },
    cs_history:[{
        date: Date,
        sold: {type:Number, default:'0'},
        item: {
            type: Schema.ObjectId,
            ref:'Offer'
        }
    }],
    cs_field: {
        type: Schema.ObjectId,
        ref: 'Field'
    },
    conditions:{
        availability: {type:String, default:'Temps plein'},	// full time, halftime
        move: {type: Boolean, default: true}
    }
},
    {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

consultantSchema.plugin(mongoosastic, {
    hosts:[
        '127.0.0.1:9200'
    ]
});


module.exports = mongoose.model('Consultant', consultantSchema);