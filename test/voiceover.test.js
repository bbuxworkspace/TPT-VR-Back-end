const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path as needed
const { expect } = chai;

chai.use(chaiHttp);

describe('Voiceover Routes', function() {
  it('should get voiceover data', function(done) {
    chai.request(app)
      .get('/api/v1/voiceover') // Adjust path if necessary
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Voiceover data is not yet implemented');
        done();
      });
  });
});
