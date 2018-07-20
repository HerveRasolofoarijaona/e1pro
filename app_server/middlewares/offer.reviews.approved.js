/**
 * Created by nokamojd on 20/09/2016.
 */


var offerReview  = require('../../app_api/models/offerReview.schema');
//= mongoose.model('OfferReview');
//function to get an offer approved reviews
module.exports = function (req, res, next) {
    //var id_offer = request.params.id_offer;
    //if(id_offer){
         offerReview
             //.find({'reviewed_offer': {$in : id_offer}})
             //.find({})
             .where('review_approved').equals(true)
             .populate('review_author reviewed_offer')
             .exec(function (err, reviews_all) {
                 if(!reviews_all){
                    return next(err);
                 }
                 else{
                    res.locals.reviews_all = reviews_all;
                 }
                 next();
        });
   // }
 };