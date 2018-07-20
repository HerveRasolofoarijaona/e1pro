/**
 * Created by nokamojd on 05/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var csReviewSchema = new Schema({
    review_author_and_reviewed: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    review: String,
    review_rating: {type:Number, default: 0, min: 0, max: 5}
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('ConsultantReview', csReviewSchema);