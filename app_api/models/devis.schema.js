var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devisSchema = new Schema(
    {
        mission_title: String,
        reference: {
            type: Schema.ObjectId,
            ref: 'Demand'
        },
        author_dmd: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        motif: String,
        commentaire: String,
        date_debut: { type: String, default: "à définir" },
        date_fin: { type: String, default: "à définir" },
        quantity: String,
        tarif_unit: String,
        unit: String,
        //total_price: { type: String, default: "à calculer" },
        devis_author: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        status_devis: {
            is_accepted: { type: Boolean, default: false },
            negocier: { type: Boolean, default: false },
            en_attente: { type: Boolean, default: true },
            approuved: { type: Boolean, default: false },
            lu: { type: Boolean, default: false },
        },
        negociation: {
            motif_prix: { type: Boolean, default: false },
            motif_datedb: { type: Boolean, default: false },
            motif_duree: { type: Boolean, default: false },
            new_date_db: { type: String, default: "non-défini" },
            new_date_fn: { type: String, default: "non-défini" },
            new_price: String
        },
        approuved: {type: Boolean , default: false},
        
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('Devis', devisSchema);