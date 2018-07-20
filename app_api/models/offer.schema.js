/**
 * Created by nokamojd on 08/07/2016.
 */

var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var offerLocationSchema = new Schema({
    city: {type:String},
    country: {type: String},
    region: String
});


var offerSchema = new Schema(
    {
        _id_offer: Schema.Types.ObjectId,
        offer_title: {type:String, required:true},
        offer_description: {type:String, required:true},
        bundle_price: Number,
        daily_price: Number,
        half_day_price: Number,
        hourly_price: Number,
        price_currency:{type: String, default:'€'},
        conditions: String,
        offer_location: [String],
        keywords: [String],
        offer_field: {
            type: Schema.ObjectId,//11/05
            ref:'Field'
        },
        is_offer_available: {type: Boolean, default:true},
        offer_author:{
            type: Schema.ObjectId,//11/05
            ref: 'User',
            //required: true
        },
        /*offer_reviews:[{
            review_author: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            review: String,
            review_rating: {type:Number, default: 0, min: 0, max: 5},
            review_approved: {type: Boolean, default:false}
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
            }
        ],*/
        total_bought: Number,
        published: {type:Boolean, default: true}
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

offerSchema.plugin(mongoosastic, {
   hosts:[
       '127.0.0.1:9200'
   ]
});

module.exports = mongoose.model('Offer', offerSchema);