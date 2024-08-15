const mongoose = require('mongoose');

const tileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true
  }
});

const Tile = mongoose.model('Tile', tileSchema);

module.exports = Tile;
