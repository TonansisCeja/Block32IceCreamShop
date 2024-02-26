
const pg = require('pg')

const path = require("pg")
//create instance pg and connects to db
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_flavors_db')

const express = require('express')
const app = express()

app.use(express.json());
app.use(require('morgan')('dev'));

//  Create Flavors 
app.post('/api/flavors', async (req, res, next) => {
  
    try {
        //console.log("*** request body:", req.body); 
      const SQL = `
        INSERT INTO flavors(name, is_favorite)
        VALUES($1, $2)
        RETURNING *
      `;
      const response = await client.query(SQL, [reg.body.name, req.body. is_favorite]);
     // console.log("*** request response from db:", response); 
      res.send(response.rows[0]);
    } catch (ex) {
      next(ex);
    }
  })

// Read Flavors
app.get('/api/flavors', async (req, res, next) => {
    try {
      const SQL = `
        SELECT * from flavors ORDER BY created_at DESC
      `;
      const response = await client.query(SQL);
      res.send(response.rows);
    } catch (ex) {
      next(ex);
    }
  })


 //Update Flavors 
app.put('/api/flavors/:id', async (req, res, next) => {
    try{
      const SQL = `
      UPDATE flavors
      SET name=$1, is_favorite=$2 updated_at=now()
      WHERE id=$3 RETURNING*
    `;
    const response = await client.query(SQL, [req,body.name, req.body.is_favorite, req.params.id]);

    }catch(ex) {
      next(ex)
    }
  })

//Delete a  Flavor 
app.delete('/api/flavors/:id', async (req, res, next) => {
  try{
    const SQL = `
    DELETE from flavors
    WHERE id=$1
  `
  const response = await client.query(SQL, [req, params.id])
  res.sendStatus(204)

  }catch(ex) {
    next(ex);
  }

})

const init=async()=>{
    
    await client.connect();
    console.log('connected to database');
    let SQL = `
                 DROP TABLE IF EXISTS flavors;
                 CREATE TABLE flavors(
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL;
                        is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
                        created_at TIMESTAMP DEFAULT now(),
                        updated_at TIMESTAMP DEFAULT now() 
                        );
              `
    await client.query(SQL)
    console.log('tables created');
    SQL = `INSERT INTO flavors(name, is_favorite) VALUES('vallina', true);
           INSERT INTO flavors(name, is_favorite) VALUES('strawberry', true);
           INSERT INTO flavors(name, is_favorite) VALUES('chocalate', true);
           `;

    await client.query(SQL)
    console.log('data seeded')
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
  }   

init();


