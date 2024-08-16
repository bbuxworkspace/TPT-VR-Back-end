// test/admin.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust path if necessary
const User = require('../models/User'); // Adjust path if necessary
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

describe('Admin Controller', () => {

    before(async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
        await mongoose.connect(process.env.MONGO_URI_TEST);
      }


        await User.deleteMany({});
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
});
