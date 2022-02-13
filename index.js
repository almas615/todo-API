const express = require('express');
const cors = require('cors');
// eslint-disable-next-line import/extensions
const router = require('./routes');
// const db = require('./models');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3030;

// cek if database not exist then create it
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// db.sequelize.sync();

app.use('/', router);

app.listen(port, () => {
  console.log(`this app listening at http://localhost:${port}/`);
});
