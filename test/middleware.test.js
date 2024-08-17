const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path if necessary
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Setup Chai to use Chai HTTP
chai.use(chaiHttp);
const { expect } = chai;


describe('Error Middleware', () => {

  before(async function() {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
      await mongoose.connect(process.env.MONGO_URI_TEST);
    }

  });

  after(async function() {
    // Clear the database and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should handle errors and return a 401 status with a JSON message', (done) => {
    chai.request(app)
        .get('/error')
        .end((err, res) => {
           expect(res).to.have.status(401); // Expecting a 401 Unauthorized
           expect(res.body).to.have.property('message', 'Error');
           done();
        });
  });

});


describe('Auth Middleware', function() {
  let token;
  let userId;

  before(async function() {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
      await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    // Clear the database and create a test user
    await User.deleteMany({});

    const user = await User.create({
      username: 'testuser',
      password: 'testpassword', // Ensure this is hashed in your actual code
      role: 'user'
    });

    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a token for testing
  });

  after(async function() {
    // Clear the database and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should return 401 if no token is provided', function(done) {
    chai.request(app)
      .get('/api/v1/some-protected-route') // Use a route that requires authentication
      .end((err, res) => {

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('status', 401);
        expect(res.body).to.have.property('message', 'No token provided');
        done();
      });
  });

  it('should return 401 if the token is invalid', function(done) {
    chai.request(app)
      .get('/api/v1/some-protected-route') // Use a route that requires authentication
      .set('Authorization', 'Bearer invalidtoken')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('status', 401);
        expect(res.body).to.have.property('message', 'Invalid token');
        done();
      });
  });

  it('should pass with a valid token', function(done) {
    chai.request(app)
      .get('/api/v1/some-protected-route') // Use a route that requires authentication
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200); // Assuming the protected route returns 200 OK on success
        done();
      });
  });

  it('should return 401 if user is not found', function(done) {
    // Generate a token for a non-existing user
    const invalidToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, { expiresIn: '1h' });

    chai.request(app)
      .get('/api/v1/some-protected-route') // Use a route that requires authentication
      .set('Authorization', `Bearer ${invalidToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('status', 401);
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });
});