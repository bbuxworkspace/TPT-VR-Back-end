const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tile',
    required: true
  }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
