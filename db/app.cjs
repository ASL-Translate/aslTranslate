const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'asl',
  database: 'asl'
}).promise();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/', async (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM engwords WHERE 1=1';
  const params = [];
  if (search) {
    query += ' AND word LIKE ?';
    params.push(`%${search}%`);
  }
  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving database entries:', error);
    res.status(500).send('Error retrieving database entries');
  }
});
