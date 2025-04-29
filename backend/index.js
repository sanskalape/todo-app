require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

sql.connect(dbConfig).then(pool => {
  return pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
    CREATE TABLE tasks (
      id INT IDENTITY(1,1) PRIMARY KEY,
      title NVARCHAR(255),
      done BIT DEFAULT 0
    )
  `);
    
}).catch(err => console.error('Database connection failed:', err));

app.get('/tasks', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM tasks');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .query('INSERT INTO tasks (title, done) OUTPUT INSERTED.id VALUES (@title, 0)');
    res.json({ id: result.recordset[0].id, title, done: 0 });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
