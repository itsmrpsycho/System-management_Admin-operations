const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const { detokn } = require('../auth/utils.js');

// const { detok } = require('../auth/utils').default;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/api/datasets', (req, res) => {
  const { domain } = req.query;

  const role = req.query.role;
  console.log("jaho");
  console.log(role);
  var QUERY_GET_FILTERED_DATASETS = ``;

  if (role != "admin"){

    // QUERY_GET_FILTERED_DATASETS = `select * from (select Dataset.public as public, Dataset.domain as domain, Dataset.dataset_id as dataset_id, Dataset.dataset_name as dataset_name, Dataset.dataset_description as dataset_description, Dataset.source as source, count(Files.upfilename) as filecount from Dataset  LEFT JOIN (select * from Files WHERE verification='verified') as Files ON Dataset.dataset_id=Files.database_id GROUP BY Dataset.dataset_id, Dataset.dataset_name, Dataset.domain, Dataset.public) as filteredTable where  filteredTable.filecount > 0 AND filteredTable.public${domain ? ' AND filteredTable.domain=' + '"' + domain + '"': ''}`;
    QUERY_GET_FILTERED_DATASETS = `
  SELECT *
  FROM (
    SELECT
      Dataset.public AS public,
      Dataset.domain AS domain,
      Dataset.dataset_id AS dataset_id,
      Dataset.dataset_name AS dataset_name,
      Dataset.dataset_description AS dataset_description,
      Dataset.source AS source,
      Dataset.visibility AS visibility,
      COUNT(Files.upfilename) AS filecount
    FROM Dataset
    LEFT JOIN (
      SELECT *
      FROM Files
      WHERE verification = 'verified'
    ) AS Files ON Dataset.dataset_id = Files.database_id
    GROUP BY
      Dataset.dataset_id,
      Dataset.dataset_name,
      Dataset.domain,
      Dataset.public
  ) AS filteredTable
  WHERE
    filteredTable.filecount > 0
    AND filteredTable.visibility = 1
    AND filteredTable.public
    
    ${domain ? 'AND filteredTable.domain = ' + '"' + domain + '"' : ''}
`;

  }
  else{
    QUERY_GET_FILTERED_DATASETS = `
    SELECT *
    FROM (
      SELECT
        Dataset.public AS public,
        Dataset.domain AS domain,
        Dataset.dataset_id AS dataset_id,
        Dataset.dataset_name AS dataset_name,
        Dataset.dataset_description AS dataset_description,
        Dataset.source AS source,
        Dataset.visibility AS visibility,
        COUNT(Files.upfilename) AS filecount
      FROM Dataset
      LEFT JOIN (
        SELECT *
        FROM Files
        WHERE verification = 'verified'
      ) AS Files ON Dataset.dataset_id = Files.database_id
      GROUP BY
        Dataset.dataset_id,
        Dataset.dataset_name,
        Dataset.domain,
        Dataset.public
    ) AS filteredTable
    WHERE
      filteredTable.filecount > 0
      AND filteredTable.public
      
      ${domain ? 'AND filteredTable.domain = ' + '"' + domain + '"' : ''}
  `;

  }


  execSql(QUERY_GET_FILTERED_DATASETS).then(sqlres => {
    res.json({
      error: false,
      data: sqlres
    });
  }).catch(err => {
    res.status(400).json({
      error: true,
      message: "SQL Error",
      data: err
    });
  });
});


router.post('/api/add-dataset', (req, res) => {
  if(req.headers.authorization){
    console.log(req.headers.authorization.split('Bearer ')[1]);
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    if(user.user_email && user.user_email && user.user_email == req.body.authorId){
      let query = `INSERT INTO Dataset VALUES (
        '${req.body.datasetId}',
        '${req.body.authorId}',
        '${req.body.referenceList}',
        '${req.body.datasetName}',
        '${req.body.piSepDescStr.replaceAll("'", "''")}', 1,
        '${req.body.source}', null,
        '${req.body.datasetFormat}', 0, 'APPROVED',
        '${req.body.domain}',1
      )`;
      console.log(query);
      execSql(query)
      .then(sqlres => {
        res.json({
          error: false,
          data: sqlres
        });
      }).catch(err => {
        console.log(err.code);
        if(err.code == 'ER_DUP_ENTRY'){
          res.json({
            error: true,
            message: err.code
          });
        } else {
          console.log("400 error", err);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data:err
          });
        }
      });
    } else res.status(401).json({error: true, message: 'Invalid token'});
  } else {
    res.status(401).json({error: true, message: 'Invalid token'});
  }
})

router.post('/api/data-delete/:id', (req, res) => {

  console.log(req.params.id);
  const id_to_delete = req.params.id;
   console.log("funnk");
  console.log(id_to_delete);

  
  if(id_to_delete){
    const query = `Delete FROM Dataset WHERE dataset_id = "${id_to_delete}"`;
    console.log(query);
    execSql(query)
    .then(sqlres => {
      // console.log('GOT ', sqlres, 'FOR', id);
      res.json({
        error: false,
        data: sqlres
      });
    }).catch(err => {
      console.log(err.code);
      if(err.code == 'ER_DUP_ENTRY'){
        res.json({
          error: true,
          message: err.code
        });
      } else {
        console.log("400 error", err);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data:err
        });
      }
    });
  } 
  else{
    res.status(400).json({error: true, message: 'Invalid params'});
  }
})


router.post('/api/data-hide/:id', (req, res) => {

  console.log(req.params.id);
  const id_to_hide = req.params.id;
  //  console.log("funnk");
  // console.log(id_to_hide);

  
  if(id_to_hide){
    const query = `select visibility from dataset where dataset_id = "${id_to_hide}"`;
    // console.log(query);
    execSql(query)
    .then(sqlres => {
      console.log("hihihihi");
      console.log(sqlres);
      
      if(sqlres[0].visibility == 1){
        const query = `UPDATE dataset SET visibility = 0 WHERE dataset_id= "${id_to_hide}"`;
        console.log(query);
        execSql(query)
        .then(sqlres => {
          // console.log('GOT ', sqlres, 'FOR', id);
          res.json({
            error: false,
            data: sqlres,
            message: "Dataset is now hidden"
          });
        }).catch(err => {
          console.log(err.code);
          if(err.code == 'ER_DUP_ENTRY'){
            res.json({
              error: true,
              message: err.code
            });
          } else {
            console.log("400 error", err);
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data:err
            });
          }
        });

      }
      else{
        const query = `UPDATE dataset SET visibility = 1 WHERE dataset_id= "${id_to_hide}"`;
        console.log(query);
        execSql(query)
        .then(sqlres => {
          // console.log('GOT ', sqlres, 'FOR', id);
          res.json({
            error: false,
            data: sqlres,
            message: "Dataset is now unhidden"
          });
        }).catch(err => {
          console.log(err.code);
          if(err.code == 'ER_DUP_ENTRY'){
            res.json({
              error: true,
              message: err.code
            });
          } else {
            console.log("400 error", err);
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data:err
            });
          }
        });
      }
    }).catch(err => {
      console.log(err.code);
      if(err.code == 'ER_DUP_ENTRY'){
        res.json({
          error: true,
          message: err.code
        });
      } else {
        console.log("400 error", err);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data:err
        });
      }
    });
  } 
  else{
    res.status(400).json({error: true, message: 'Invalid params'});
  }
})
router.get('/api/get-dataset-id', (req, res) => {

  const { id } = req.query;
  if(id){
    const query = `SELECT * FROM Dataset WHERE dataset_id = "${id}"`;
    execSql(query)
    .then(sqlres => {
      console.log('GOT ', sqlres, 'FOR', id);
      res.json({
        error: false,
        data: sqlres
      });
    }).catch(err => {
      console.log(err.code);
      if(err.code == 'ER_DUP_ENTRY'){
        res.json({
          error: true,
          message: err.code
        });
      } else {
        console.log("400 error", err);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data:err
        });
      }
    });
  } 
  else{
    res.status(400).json({error: true, message: 'Invalid params'});
  }
})

router.post("/api/update-dataset-visibility", (req, res) => {
  if (req.body.headers.Authorization) {
    const user = detokn(req.body.headers.Authorization.split("Bearer ")[1]);
    if (req.body && user &&req.body.params) {
      const QUERY_UPDATE_DATASET_VISIBLITY = `UPDATE Dataset
        SET public = '${req.body.selectedVisiblity === 'Listed' ? 1 : 0}'
        WHERE dataset_id = '${req.body.params.datasetId}' and author_id = '${user.user_email}'`;
      execSql(QUERY_UPDATE_DATASET_VISIBLITY)
        .then((sqlres) => {
          res.json({
            currentVisiblity : req.body.selectedVisiblity,
            error: false,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            message: "Invalid props",
          });
        });
    }
    else 
    {
      res.status(400).json({
        error: true,
        message: "Authentication error",
      });
    }
  }
});

router.post('/api/contact', (req, res) => {
  const query = `INSERT INTO ContactUs (NAME, EMAIL, MESSAGE) VALUES ('${req.body.name}','${req.body.email}','${req.body.message}')`;
  execSql(query)
  .then(sqlres => {
    res.json({
      error: false,
      data: sqlres
    });
  }).catch(err => {
    if(err.code == 'ER_DUP_ENTRY'){
      res.json({
        error: true,
        message: err.code
      });
    } else {
      res.status(400).json({
        error: true,
        message: "SQL Error",
        data:err
      });
    }
  });
})
router.get('/api/view-contact-us-queries', (req, res) => {
  const query = `SELECT * FROM ContactUs`;
  execSql(query)
  .then(sqlres => {
    res.json({
      error: false,
      data: sqlres
    });
  })
})
router.post('/api/contactDelete', (req, res) => {
  const query = `DELETE FROM ContactUs WHERE EMAIL in ('${req.body.email}')`;
  execSql(query)
  .then(sqlres => {
    res.json({
      error: false,
      data: sqlres
    });
  })
})
router.get('/api/count-contact-us-queries', (req, res) => {
  const query = `SELECT COUNT(EMAIL) FROM ContactUs`;
  execSql(query)
  .then(sqlres => {
    res.json({
      error: false,
      data: sqlres
    });
  })
})
module.exports = router
