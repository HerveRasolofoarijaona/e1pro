var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commandeSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        total_price: { type: Number, default: 0 },
        card_used: String,
        items: [{
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Offer'
            },
            quantity: { type: Number, default: 1 },
            price: { type: Number, default: 0 },
        }],
        paid: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    },
    { usePushEach: true }
);

module.exports = mongoose.model('Commande', commandeSchema);