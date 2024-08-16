const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path if necessary

chai.use(chaiHttp);
const { expect } = chai;

describe('Error Middleware', () => {
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
