const Tile = require('../models/Tile');
const Favorite = require('../models/Favorite');
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define storage for tile model files
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/tiles'); // Directory where tile files will be stored
    },
    filename: function (req, file, cb) {
        const tileId = req.params.id; // Get the tile ID from the request parameters
        const extension = path.extname(file.originalname); // Get the file extension
        const filename = `${tileId}${extension}`; // Create a unique filename using tileId
        cb(null, filename);
    }
});

const upload = multer({ 
    // dest: 'uploads/tiles/',
    storage: storage, 
    limits: {
    fileSize: 30000000
} });

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
  


// Upload a tile model file
exports.uploadTileModel = [
    upload.single('model'),
    async (req, res) => {
      try {
        const tileId = req.params.id;
        const tile = await Tile.findById(tileId);
  
        if (!tile) {
          return res.status(404).json({ status: 404, message: 'Tile not found' });
        }
  
        // Assign the uploaded file path to the modelFile field
        tile.modelFile = req.file.path;
        await tile.save();
  
        res.status(200).json({ message: 'Model file uploaded', modelFile: tile.modelFile });
      } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
      }
    }
  ];
  
  // Download a tile model file
  exports.downloadTileModel = async (req, res) => {
    try {
      const tileId = req.params.id;
      const tile = await Tile.findById(tileId);
  
      if (!tile || !tile.modelFile) {
        return res.status(404).json({ status: 404, message: 'Tile or model file not found' });
      }
  
      res.download(tile.modelFile);
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
  };
  
  // Delete a tile model file
  exports.deleteTileModel = async (req, res) => {
    try {
      const tileId = req.params.id;
      const tile = await Tile.findById(tileId);
  
      if (!tile || !tile.modelFile) {
        return res.status(404).json({ status: 404, message: 'Tile or model file not found' });
      }
  
      fs.unlinkSync(tile.modelFile); // Delete the file from the filesystem
      tile.modelFile = null; // Remove the file path from the database
      await tile.save();
  
      res.status(200).json({ message: 'Model file deleted' });
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
  };