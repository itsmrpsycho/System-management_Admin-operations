const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Replace with the actual path to your Express app file
const { execSql } = require('../db'); // Replace with the actual path to your database utility functions

chai.use(chaiHttp);
const expect = chai.expect;

describe('DELETE /api/data-delete/:id', () => {
  it('should delete data when a valid id is provided', (done) => {
    const validId = '3a0842c4-8f31-4f5c-8545-b7'; // Replace with a valid dataset_id

    chai.request(app)
      .post(`/api/data-delete/${validId}`)
      .end(async (err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.error).to.be.false;

        // Check if the data with validId is deleted from the database
        try {
          const result = await execSql(`SELECT * FROM Dataset WHERE dataset_id = "${validId}"`);
          expect(result.length).to.equal(0); // Ensure that no rows match the ID
        } catch (error) {
          // Handle database query error, if any
          done(error);
        }

        done();
      });
  });

  it('should return an error when an invalid id is provided', (done) => {
    const invalidId = ' 3a0842c4-8f31-4f5c-8545-b71bc9805d44'; // Replace with an invalid dataset_id

    chai.request(app)
      .post(`/api/data-delete/${invalidId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.error).to.be.false;
        // expect(res.body.message).to.equal('SQL Error'); // Adjust the message as needed
        done();
      });
  });

  it('should return an err_dup when double id  is present', (done) => {
    const invalidId = ' 3a0842c4-8f31-4f5c-8545-b71bc9805d44'; // Replace with an invalid dataset_id

    chai.request(app)
      .post(`/api/data-delete/${invalidId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.error).to.be.false;
        // expect(res.body.message).to.equal('SQL Error'); // Adjust the message as needed
        done();
      });
  });


  it('should return an error when an invalid id is provided', (done) => {
    const invalidId = ' 3a0842c4-8f31-4f5c-8545-b71bc9805d44'; // Replace with an invalid dataset_id

    chai.request(app)
      .post(`/api/data-delete/${invalidId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.error).to.be.false;
        // expect(res.body.message).to.equal('SQL Error'); // Adjust the message as needed
        done();
      });
  });
});
