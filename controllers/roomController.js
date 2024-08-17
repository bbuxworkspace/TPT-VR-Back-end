const Room = require('../models/Room');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// For STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/rooms')
    },
    filename: (req, file, cb) => {
        const roomId = req.params.id; // Get the room ID from the request parameters
        const extension = path.extname(file.originalname); // Get the file extension
        const filename = `${roomId}${extension}`; // Create a unique filename using roomId
        cb(null, filename);
    }
    
});
const upload = multer({
    // dest: 'uploads/rooms/',
    storage: storage,
    limits: {
        fileSize: 30000000
    }
});

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a new room
exports.addRoom = async (req, res) => {
    try {
        const { name, description, tile, imageUrl } = req.body;  // Handle 'imageUrl'

        // Create a new room instance
        const room = new Room({
            name,
            description,
            tile,  // Optional 'tile'
            imageUrl  // Optional 'imageUrl'
        });

        // Save the room to the database
        const createdRoom = await room.save();
        
        // Respond with the created room
        res.status(201).json(createdRoom);
    } catch (error) {
        // Handle errors
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

// Upload a room model
exports.uploadRoomModel = [
    upload.single('model'),  // Apply the middleware for file upload
    async (req, res) => {
        try {
            // Access the file from req.file
            const file = req.file;

            // Check if the file was uploaded
            if (!file) {
                return res.status(400).json({ message: 'Please choose a file to upload' });
            }

            // Find the room by ID
            const roomId = req.params.id;
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Assign the uploaded file path to the modelFile field
            room.modelFile = req.file.path;
            await room.save();

            // Return a success response
            res.json({ message: 'Model file uploaded', modelFile: file.filename });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
];

// Download a room model
exports.downloadRoomModel = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        if (!room || !room.modelFile) {
            return res.status(404).json({ message: 'Room or model file not found' });
        }

        res.download(room.modelFile); // Send the file to the client
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete a room model
exports.deleteRoomModel = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        if (!room || !room.modelFile) {
            return res.status(404).json({ message: 'Room or model file not found' });
        }

        fs.unlinkSync(room.modelFile); // Delete the file from the filesystem
        room.modelFile = null; // Remove the file path from the database
        await room.save();
        
        res.json({ message: 'Model file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Navigate a room (Room Navigation)
exports.navigateRoom = async (req, res) => {
    try {
        const { direction } = req.body;  // direction could be 'left', 'right', etc.
        const roomId = req.params.id;  // Room ID from request parameters

        // Find the room and update its direction
        const room = await Room.findByIdAndUpdate(
            roomId,
            { direction },  // Update the direction field
            { new: true }
        );
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.json({ message: `Navigated ${direction}`, room });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// Update a room
exports.updateRoom = async (req, res) => {
    try {
        const { name, description, tile, imageUrl, direction } = req.body;  // Handle 'imageUrl'

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { name, description, tile, imageUrl, direction },  // Update fields
            { new: true }
        );
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// Delete a room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        // Optionally delete the model file from the filesystem
        if (room.modelFile) {
            fs.unlinkSync(path.join('uploads', path.basename(room.modelFile)));
        }
        res.json({ message: 'Room removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
