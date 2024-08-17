const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path as needed
const { expect } = chai;

chai.use(chaiHttp);

describe('Software Routes', function() {
  it('should get software data', function(done) {
    chai.request(app)
      .get('/api/v1/software') // Adjust path if necessary
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Software data is not yet implemented');
        done();
      });
  });
});
