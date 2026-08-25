const mongoose = require('mongoose');


const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
}, {
    timestamps: true
})

// One save per user per food — see the matching note in likes.model.js.
saveSchema.index({ user: 1, food: 1 }, { unique: true })


const saveModel = mongoose.model('save', saveSchema);

module.exports = saveModel;