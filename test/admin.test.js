// test/admin.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if necessary
const User = require('../models/User'); // Adjust path if necessary
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken'); // Import generateToken utility

const { expect } = chai;
chai.use(chaiHttp);

describe('Admin Controller', () => {

    let adminToken;
    let adminId;

    before(async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
        await mongoose.connect(process.env.MONGO_URI_TEST);
      }


        await User.deleteMany({});

         // Create an admin user for testing login
         const admin = await User.create({
            username: 'adminUser',
            password: 'adminPassword', // Ensure this is hashed in your actual code
            role: 'admin'
        });

        adminId = admin._id;
        adminToken = generateToken(admin._id);
    });

    after(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
    });

//   beforeAll(async () => {
    
//     await User.deleteMany({});
//   });

//   afterAll(async () => {
//     // Close the database connection after all tests
//     await mongoose.connection.close();
//   });

  it('should create a new admin', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create-admin')
      .send({
        username: 'adminuser',
        password: 'adminpassword',
        role: 'admin'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('username', 'adminuser');
        expect(res.body).to.have.property('role', 'admin');
        done();
      });
  });

  it('should not create an admin if the username already exists', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create-admin')
      .send({
        username: 'adminuser', // Same as the one created in the first test
        password: 'adminpassword',
        role: 'admin'
      })
      .end((err, res) => {
        expect(res).to.have.status(400); // Expecting a 400 Bad Request
        expect(res.body).to.have.property('message', 'User already exists');
        done();
      });
  });

  it('should not create an admin if role is not "admin"', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create-admin')
      .send({
        username: 'regularuser',
        password: 'userpassword',
        role: 'user' // Role is not 'admin'
      })
      .end((err, res) => {
        expect(res).to.have.status(400); // Expecting a 400 Bad Request
        expect(res.body).to.have.property('message', 'Role must be "admin"');
        done();
      });
  });

  it('should return an error if required fields are missing', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create-admin')
      .send({
        username: '', // Missing username
        password: '',
        role: ''
      })
      .end((err, res) => {
        expect(res).to.have.status(400); // Expecting a 400 Bad Request
        expect(res.body).to.have.property('message', 'Username, password, and role are required');
        done();
      });
  });

  it('should login an admin and return a token', function(done) {
    chai.request(app)
        .post('/api/v1/admin/login')
        .send({
            username: 'adminUser',
            password: 'adminPassword'
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            adminToken = res.body.token;
            done();
        });
});

it('should fail to login with incorrect password', function(done) {
    chai.request(app)
        .post('/api/v1/admin/login')
        .send({
            username: 'adminUser',
            password: 'wrongPassword'
        })
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message', 'Invalid username or password');
            done();
        });
});

it('should logout an admin', function(done) {
    chai.request(app)
        .post('/api/v1/admin/logout')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Admin logged out successfully');
            done();
        });
});

it('should not allow logout without a token', function(done) {
    chai.request(app)
        .post('/api/v1/admin/logout')
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message', 'No token provided');
            done();
        });
});


});
