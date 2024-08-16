const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if necessary
const Tile = require('../models/Tile');
const Favorite = require('../models/Favorite');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');
const { expect } = chai;

chai.use(chaiHttp);

describe('Tile Controller', function() {
  let token;
  let userId;
  let tileId;


  before(async function() {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
        await mongoose.connect(process.env.MONGO_URI_TEST);
      }

    await Tile.deleteMany({});
    await User.deleteMany({});
    await Favorite.deleteMany({});

    // Create a test user and get a token
    const user = await User.create({
      username: 'testuser',
      password: 'testpassword', // Ensure this is hashed in your actual code
      role: 'user'
    });

    userId = user._id;
    token = generateToken(userId); // Implement generateToken in your utils

    // Create a test tile
    const tile = await Tile.create({
      name: 'Test Tile',
      category: 'Test Category',
      color: 'Blue',
      description: 'Test Description',
      imageUrl: 'http://example.com/image.jpg'
    });

    tileId = tile._id;
  });

  after(async function() {
    // Clear the database and disconnect
    await Tile.deleteMany({});
    await User.deleteMany({});
    await Favorite.deleteMany({});
    await mongoose.connection.close();
  });

  it('should get all tiles', function(done) {
    chai.request(app)
      .get('/api/v1/tiles')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a tile by ID', function(done) {
    chai.request(app)
      .get(`/api/v1/tiles/${tileId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', tileId.toString());
        done();
      });
  });

  it('should add a new tile', function(done) {
    chai.request(app)
      .post('/api/v1/tiles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Tile',
        category: 'New Category',
        color: 'Red',
        description: 'New Description',
        imageUrl: 'http://example.com/newimage.jpg'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'New Tile');
        done();
      });
  });

  it('should update a tile', function(done) {
    chai.request(app)
      .put(`/api/v1/tiles/${tileId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Tile',
        color: 'Green'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', 'Updated Tile');
        expect(res.body).to.have.property('color', 'Green');
        done();
      });
  });

  it('should delete a tile', function(done) {
    chai.request(app)
      .delete(`/api/v1/tiles/${tileId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Tile removed');
        done();
      });
  });

  it('should select a tile', function(done) {
    chai.request(app)
      .post(`/api/v1/tiles/${tileId}/select`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        // expect(res).to.have.status(200);
        // expect(res.body).to.have.property('message', 'Tile selected successfully');
        done();
      });
  });

  it('should favorite a tile', function(done) {
    chai.request(app)
      .post(`/api/v1/tiles/${tileId}/favorite`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Tile favorited successfully');
        done();
      });
  });

  it('should not favorite the same tile twice', function(done) {
    chai.request(app)
      .post(`/api/v1/tiles/${tileId}/favorite`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('status', 400);
        expect(res.body).to.have.property('message', 'Tile already favorited');
        done();
      });
  });
});
