const { Pool } = require('pg');
const express = require('express');
const config = require('./config');

const pool = new Pool(config);
module.exports = {
  query: (text, params) => pool.query(text, params),
};

const router = require('./db');

const app = express();
const port = 3000;

app.use(express.json());
router(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
