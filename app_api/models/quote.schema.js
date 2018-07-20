/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quotationSchema = new Schema(
    {
        _id_quote: Schema.Types.ObjectId,
        quote_ref: String,
        expires: Date,
        for_this_demand:{
            type: Schema.ObjectId,
            ref:'Demand'
        },
        vat:{type: Number, default:20.00},
        quote_items:[{
            title: {type:String, required: true},
            quantity: Number,
            unit_price: Number,
            total_price: Number
        }],
        quote_total_price_ht: Number,
        quote_total_price_ttc: Number,
        conditions: String,
        quote_accepted: {type: Boolean, default:false},
        quote_author:{
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('Quotation', quotationSchema);