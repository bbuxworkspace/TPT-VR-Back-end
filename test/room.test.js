const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if necessary
const Room = require('../models/Room');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');
const path = require('path');
const mime = require('mime-types');

const { expect } = chai;

chai.use(chaiHttp);

describe('Room Controller', function() {
  let token;
  let userId;
  let roomId;
  const modelFilePath = path.join(__dirname, '../uploads/rooms/test.jpg'); // Path to test model file

  before(async function() {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
        await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    await Room.deleteMany({});
    await User.deleteMany({});

    // Create a test user and get a token
    const user = await User.create({
      username: 'testuser',
      password: 'testpassword', // Ensure this is hashed in your actual code
      role: 'user'
    });

    userId = user._id;
    token = generateToken(userId); // Implement generateToken in your utils

    // Create a test room
    const room = await Room.create({
      name: 'Test Room',
      description: 'Test Room Description',
      imageUrl: 'http://example.com/roomimage.jpg' // Optional field
    });

    roomId = room._id;
  });

  after(async function() {
    // Clear the database and disconnect
    await Room.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should get all rooms', function(done) {
    chai.request(app)
      .get('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a room by ID', function(done) {
    chai.request(app)
      .get(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', roomId.toString());
        done();
      });
  });

  it('should add a new room', function(done) {
    chai.request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Room',
        description: 'New Room Description',
        imageUrl: 'http://example.com/newroomimage.jpg' // Optional field
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'New Room');
        expect(res.body).to.have.property('imageUrl', 'http://example.com/newroomimage.jpg');
        done();
      });
  });

  it('should navigate a room', function(done) {
    chai.request(app)
      .post(`/api/v1/rooms/${roomId}/navigate`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        direction: 'left'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Navigated left');
        done();
      });
  });

  
  // Test for uploading a room model
  it('should upload a room model file', function(done) {


    chai.request(app)

      .post(`/api/v1/rooms/${roomId}/upload-model`)
      .set('Authorization', `Bearer ${token}`)
      .attach('model', modelFilePath) // Attach the model file
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Model file uploaded');
        done();
      });
  });

  // Test for downloading a room model
  it('should download a room model file', function(done) {
    chai.request(app)
      .get(`/api/v1/rooms/${roomId}/download-model`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const contentType = res.headers['content-type'];
        expect(contentType).to.exist;
        expect(mime.extension(contentType)).to.not.be.false;
        done();
      });
  });

  // Test for deleting a room model
  it('should delete a room model file', function(done) {
    chai.request(app)
      .delete(`/api/v1/rooms/${roomId}/delete-model`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Model file deleted');
        done();
      });
  });

  it('should update a room', function(done) {
    chai.request(app)
      .put(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Room',
        description: 'Updated Room Description',
        imageUrl: 'http://example.com/updatedroomimage.jpg' // Optional field
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', 'Updated Room');
        expect(res.body).to.have.property('imageUrl', 'http://example.com/updatedroomimage.jpg');
        done();
      });
  });

  it('should delete a room', function(done) {
    chai.request(app)
      .delete(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Room removed');
        done();
      });
  });


});
