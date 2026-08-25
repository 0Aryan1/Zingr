const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
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

// One like per user per food. Without this, two rapid taps (or a retried
// request) created a second like document while likeCount was incremented
// again, permanently inflating the count with no way to undo it.
likeSchema.index({ user: 1, food: 1 }, { unique: true })

const Like = mongoose.model('like', likeSchema);
module.exports = Like;