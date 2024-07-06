const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const { detokn } = require('../auth/utils.js');

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/api/dataset-versions', (req, res) => {
  console.log(req.query);
  const { toVerify } = req.query;
  let query = "SELECT * FROM Files";
  if (toVerify) {
    query = query + " WHERE verification=\"unverified\"";
  }
  execSql(query).then(result => {
    res.json({
      error: false,
      data: result
    });
  }).catch(err => {
    res.status(500).json({
      error: true,
      message: "SQL ERROR",
      data: err
    });
  });
})

router.get('/api/dataset-versions-my', (req, res) => {
  console.log("DATASET USERS MY");
  console.log("inside versions id");
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    console.log("user version =  = ", user);
    const { toVerify } = req.query;
    let query = "SELECT * FROM Files";
    if (toVerify) {
      query = query + " WHERE author_id=\"" + user.user_email + "\"";
    }
    execSql(query).then(result => {
      res.json({
        error: false,
        data: result
      });
    }).catch(err => {
      res.status(500).json({
        error: true,
        message: "SQL ERROR",
        data: err
      });
    });
  } else {
    console.log("USER DOESNT EXIST");
    res.status(401).json({ error: true });
  }
})

router.get('/api/datasets-my', (req, res) => {
  console.log("DATASET-MY");
  if (req.headers.authorization) {
    // console.log("inside my");
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    // console.log("user1 = ",user);
    const { toVerify } = req.query;
    let query = "SELECT * FROM Dataset";
    if (toVerify) {
      query = query + " WHERE author_id=\"" + user.user_email + "\"";
    }
    console.log("EXECUTING QUERY", query);
    execSql(query).then(result => {
      res.json({
        error: false,
        data: result
      });
    }).catch(err => {
      res.status(500).json({
        error: true,
        message: "SQL ERROR",
        data: err
      });
    });
  } else {
    console.log("USER DOESNT EXIST");
    res.status(401).json({ error: true });
  }
})

router.get('/api/dataset-versions-datasetid', (req, res) => {
  console.log(req.query);
  console.log("inside version part");
  const { database_id } = req.query;
  let query = "SELECT * FROM Files";
  if (database_id) {
    query = query + " WHERE database_id=\"" + database_id + "\" AND verification=\"" + "verified" + "\"";
    execSql(query).then(result => {
      res.json({
        error: false,
        data: result
      });
    }).catch(err => {
      res.status(500).json({
        error: true,
        message: "SQL ERROR",
        data: err
      });
    });
  } else {
    res.status(400).json({ error: true, message: 'invalid params' });
  }
})

router.get('/api/dataset-version-details', (req, res) => {
  if (req.query) {
    const query = `SELECT * FROM Files WHERE upfilename="${req.query.id}"`;
    execSql(query).then(result => {
      res.json({
        error: false,
        data: result
      });
    }).catch(err => {
      res.status(500).json({
        error: true,
        message: "SQL ERROR",
        data: err
      });
    });
  }
})

router.delete('/api/delete-file', (req, res) => {
  if (req.query) {
    if (req.headers.authorization) {
      const user = detokn(req.headers.authorization.split('Bearer ')[1])
      if (user) {
        const QUERY_DELETE_FILE = user.user_role === 'admin' ?
          `DELETE FROM Files WHERE upfilename="${req.query.id}"` :
          `DELETE FROM Files WHERE upfilename="${req.query.id}" AND author_id="${user.user_email}"`;

        execSql(QUERY_DELETE_FILE).then(result => {
          res.json({
            error: false,
            data: result
          });
        }).catch(err => {
          res.status(500).json({
            error: true,
            message: "SQL ERROR",
            data: err
          });
        });
      } else {
        res.status(401).json({ error: true, message: 'user not found' });
      }
    } else {
      res.status(401).json({ error: true, message: 'unauthorized' });
    }
  } else {
    res.status(400).json({ error: true, message: 'invalid params' });
  }
})

module.exports = router
