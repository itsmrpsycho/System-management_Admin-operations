// test/routes.test.js

import { strictEqual } from 'assert';
import { use, request } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import { describe, it } from 'mocha';

use(chaiHttp);

describe('Routes', () => {
  it('should return user details with params, headers, and queries', (done) => {
    const userId = '123';
    const authToken = 'Bearer YourAuthToken';
    const queryParam = 'someValue';

    request(app)
      .get(`/user/${userId}`)
      .set('Authorization', authToken)
      .query({ someQueryParam: queryParam })
      .end((err, res) => {
        strictEqual(res.status, 200);

        // Adjust these assertions based on your actual route logic
        strictEqual(res.body.userId, userId);
        strictEqual(res.body.authToken, authToken);
        strictEqual(res.body.queryParam, queryParam);

        done();
      });
  });

  // Add more test cases for other routes
});
