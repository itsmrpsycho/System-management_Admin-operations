# BACKEND INTEGRATION

---

1. we have changed the schema of table dataset and added a column ‘visibility’ to it. this change was made to `dfsdata_dum.sql`

```cpp
CREATE TABLE `Dataset` (
  `dataset_id` varchar(255) NOT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `reference_list` mediumtext,
  `dataset_name` varchar(255) DEFAULT NULL,
  `dataset_description` text,
  `public` tinyint(1) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `dataset_data` longblob,
  `dataset_format` varchar(255) DEFAULT NULL,
  `temporary` tinyint(1) DEFAULT NULL,
  `dataset_status` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

1. Added 2 queries to delete or hide the dataset . the following changes were made to `datasets.js` file

```cpp
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
```

```cpp
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
```

1. changed the structure of  `/api/datsets` query for admin  and user 

```cpp
const role = req.query.role;
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
```

4.