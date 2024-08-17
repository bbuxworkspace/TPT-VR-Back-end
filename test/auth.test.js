// test/authController.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if necessary
const User = require('../models/User'); // Adjust path if necessary
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken'); // Import generateToken utility

const { expect } = chai;
chai.use(chaiHttp);


describe('Auth Controller', () => {

  before(async () => {

    // Check if already connected
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
      await mongoose.connect(process.env.MONGO_URI_TEST);
    }

    // Clear the database or set up a test database
    await User.deleteMany({});

     // Create a user for testing logout
     const user = await User.create({
      username: 'testUser',
      password: 'testPassword', // Ensure this is hashed in your actual code
      role: 'user'
  });

  userId = user._id;
  userToken = generateToken(user._id); // Use generateToken utility to create a token

  });

  after(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
    });



  // beforeAll(async () => {
  //   // Clear the database or set up a test database
  //   await User.deleteMany({});
  // });

  
  // afterEach(async () => {
  //   // Clear the database after each test
  //   await User.deleteMany({});
  // });
  
  // afterAll(async () => {
  //   // Disconnect from the test database
  //   await mongoose.connection.close();
  // });


  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        role: 'user'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('username', 'testuser');
        expect(res.body).to.have.property('role', 'user');
        done();
      });

  });


  it('should not register a user if username already exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser', // Same as the one registered in the first test
        password: 'testpassword',
        role: 'user'
      })
      .end((err, res) => {
        expect(res).to.have.status(400); // Expecting a 400 Bad Request
        expect(res.body).to.have.property('message', 'User already exists');
        done();
      });
  });
  
  
  // login a user
  it('should login an existing user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('username', 'testuser');
        expect(res.body).to.have.property('role', 'user');
        done();
      })
    
    
  });

  it('should return an error if login credentials are incorrect', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser', 
        password: 'wrongpassword' // Incorrect password
      })
      .end((err, res) => {
        expect(res).to.have.status(401); // Expecting a 401 Unauthorized
        expect(res.body).to.have.property('message', 'Invalid username or password');
        done();
      });
  });

  it('should logout a user', function(done) {
    chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Logged out successfully');
            done();
        });
});

it('should not allow logout without a token', function(done) {
    chai.request(app)
        .post('/api/v1/auth/logout')
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message', 'No token provided');
            done();
        });
});
});
