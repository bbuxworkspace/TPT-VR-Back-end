const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path as needed
const { expect } = chai;

chai.use(chaiHttp);

describe('VR Routes', function() {
  it('should get VR data', function(done) {
    chai.request(app)
      .get('/api/v1/vr') // Adjust path if necessary
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'VR data is not yet implemented');
        done();
      });
  });
});
