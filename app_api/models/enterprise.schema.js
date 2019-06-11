/**
 * Created by nokamojd on 21/09/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = new Schema({
    linked_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    b_legal_details: {
        legalStatus: {
            type: Schema.Types.ObjectId,
            ref: 'LegalStatus'
        },
        siretNumber: Number,
        ape_naf: Number
    },

    b_details: {
        b_turn_over: Number,
        b_employees_total: Number,
        b_dateCreated: { type: Date },
        b_pic_path: String,
        b_address: {
            line1: { type: String },
            line2: { type: String },
            location: { type: String }
        },
        b_phone_number: [{
            number_type: String, // home or mobile
            number: Number
        }],
        b_field: {
            type: Schema.Types.ObjectId,
            ref: 'Field'
        }
    },
    b_purchase_history: [{
        date: Date,
        bought: { type: Number, default: '0' },
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Offer'
        }
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


module.exports = mongoose.model('Enterprise', enterpriseSchema);