const express = require('express');
const router = express.Router();
const {
  getAllTiles,
  getTileById,
  addTile,
  updateTile,
  deleteTile,
  selectTile,
  favoriteTile,
  uploadTileModel,
  downloadTileModel,
  deleteTileModel
} = require('../controllers/tileController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is in place

// Get all tiles
router.get('/', getAllTiles);

// Get a tile by ID
router.get('/:id', getTileById);

// Add a new tile
router.post('/', authMiddleware, addTile); // Assuming only admins can add tiles

// Update a tile
router.put('/:id', authMiddleware, updateTile); // Assuming only admins can update tiles

// Delete a tile
router.delete('/:id', authMiddleware, deleteTile); // Assuming only admins can delete tiles

// Route to select a tile
router.post('/:id/select', authMiddleware, selectTile);

// Route to favorite a tile
router.post('/:id/favorite', authMiddleware, favoriteTile);

// Upload a tile model file
router.post('/:id/upload-model', authMiddleware, uploadTileModel);

// Download a tile model file
router.get('/:id/download-model', authMiddleware, downloadTileModel);

// Delete a tile model file
router.delete('/:id/delete-model', authMiddleware, deleteTileModel);

module.exports = router;