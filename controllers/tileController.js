const Tile = require('../models/Tile');

exports.getAllTiles = async (req, res) => {
  const tiles = await Tile.find();
  res.json(tiles);
};

exports.getTileById = async (req, res) => {
  const tile = await Tile.findById(req.params.id);

  if (tile) {
    res.json(tile);
  } else {
    res.status(404);
    throw new Error('Tile not found');
  }
};

exports.addTile = async (req, res) => {
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
};

exports.updateTile = async (req, res) => {
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
    res.status(404);
    throw new Error('Tile not found');
  }
};

exports.deleteTile = async (req, res) => {
  const tile = await Tile.findById(req.params.id);

  if (tile) {
    await tile.remove();
    res.json({ message: 'Tile removed' });
  } else {
    res.status(404);
    throw new Error('Tile not found');
  }
};
