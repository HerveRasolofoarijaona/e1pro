/**
 * Created by nokamojd on 05/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var offerReviewSchema = new Schema({
    review_author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    reviewed_offer:{
        type: Schema.ObjectId,
        ref: 'Offer'
    },
    review: String,
    review_rating: {type:Number, default: 0, min: 0, max: 5},
    review_approved: {type: Boolean, default:false}
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('OfferReview', offerReviewSchema);