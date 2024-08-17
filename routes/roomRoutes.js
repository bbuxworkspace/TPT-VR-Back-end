const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  addRoom,
  updateRoom,
  deleteRoom,
  navigateRoom,
  uploadRoomModel,
  downloadRoomModel,
  deleteRoomModel
} = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is in place

// Get all rooms
router.get('/', getAllRooms);

// Get a room by ID
router.get('/:id', getRoomById);

// Add a new room
router.post('/', authMiddleware, addRoom); // Assuming only admins can add rooms

// Update a room
router.put('/:id', authMiddleware, updateRoom); // Assuming only admins can update rooms

// Delete a room
router.delete('/:id', authMiddleware, deleteRoom); // Assuming only admins can delete rooms

// Navigate a room
router.post('/:id/navigate', authMiddleware, navigateRoom);

// Upload a room model
router.post('/:id/upload-model', authMiddleware, uploadRoomModel); // Assuming only admins can upload models

// Download a room model
router.get('/:id/download-model', authMiddleware, downloadRoomModel); // Assuming only admins can download models

// Delete a room model
router.delete('/:id/delete-model', authMiddleware, deleteRoomModel); // Assuming only admins can delete models

module.exports = router;
