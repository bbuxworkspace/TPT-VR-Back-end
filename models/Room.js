const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    tile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tile'
    },
    imageUrl: {
        type: String,
    },
    modelFile: {
        type: String,
    },
    direction: {
        type: String,
    }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
