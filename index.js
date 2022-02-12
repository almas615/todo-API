const express = require('express');
// eslint-disable-next-line import/extensions
const router = require('./routes');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`this app listening at http://localhost:${port}/`);
});
