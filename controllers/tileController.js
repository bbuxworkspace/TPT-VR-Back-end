const Tile = require('../models/Tile');
const Favorite = require('../models/Favorite');
const User = require('../models/User');

exports.getAllTiles = async (req, res) => {
  try {
    const tiles = await Tile.find();
    res.json(tiles);
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.getTileById = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (tile) {
      res.json(tile);
    } else {
      res.status(404).json({ status: 404, message: 'Tile not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.addTile = async (req, res) => {
  try {
    const { name, category, color, description, imageUrl } = req.body;

    const tile = new Tile({
      name,
      category,
      color,
      description,
      imageUrl
    });

    const createdTile = await tile.save();
    res.status(201).json(createdTile);
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.updateTile = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (tile) {
      tile.name = req.body.name || tile.name;
      tile.category = req.body.category || tile.category;
      tile.color = req.body.color || tile.color;
      tile.description = req.body.description || tile.description;
      tile.imageUrl = req.body.imageUrl || tile.imageUrl;

      const updatedTile = await tile.save();
      res.json(updatedTile);
    } else {
      res.status(404).json({ status: 404, message: 'Tile not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.deleteTile = async (req, res) => {
  try {
    const tile = await Tile.findByIdAndDelete(req.params.id);

    if (tile) {
      res.json({ message: 'Tile removed' });
    } else {
      res.status(404).json({ status: 404, message: 'Tile not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

// New functionalities
exports.selectTile = async (req, res) => {
    try {
      const tileId = req.params.id; // Ensure the parameter name matches
      const userId = req.user._id; // Ensure user ID is attached to the request object
  
      const tile = await Tile.findById(tileId);
      if (!tile) {
        return res.status(404).json({ status: 404, message: 'Tile not found' });
      }
  
      // Update or add tile selection functionality if needed
      // For now, we're just returning the tile data
  
      res.status(200).json({ message: 'Tile selected successfully', tile });
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
  };
  

  exports.favoriteTile = async (req, res) => {
    try {
      const { id: tileId } = req.params;
      const userId = req.user && req.user._id; // Check if req.user exists
  
      if (!userId) {
        return res.status(401).json({ status: 401, message: 'User not authenticated' });
      }
  
      // Check if the favorite already exists
      const existingFavorite = await Favorite.findOne({ userId, tileId });
      if (existingFavorite) {
        return res.status(400).json({ status: 400, message: 'Tile already favorited' });
      }
  
      // Create a new favorite entry
      const favorite = await Favorite.create({ userId, tileId });
  
      res.status(200).json({ message: 'Tile favorited successfully', favorite });
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
  };
  