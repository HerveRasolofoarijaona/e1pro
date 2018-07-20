var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema(
    {
        sender: { //celui qui cause la notif
            type: Schema.ObjectId,
            ref: 'User',
        },
        offer: { //offre concernée
            offer_id: {
                type: Schema.ObjectId,
                ref: 'Offer'
            },
            offer_review: {
                type: Schema.ObjectId,
                ref: 'OfferReview'
            }
        },
        demand: { //Demande concernée pour le devis
            type: Schema.ObjectId,
            ref: 'Demand',
        },
        devis: { //Devis pour la négociation
            type: Schema.ObjectId,
            ref: 'Devis',
        },
        lu: { type: Boolean, default: false },
        modif: {
            avis: { type: Boolean, default: false },
            new_devis: { type: Boolean, default: false },
            devis_nego: { type: Boolean, default: false },
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('Notification', notificationSchema);