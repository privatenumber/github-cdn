require('dotenv').config();
const express = require('express');
const assert = require('assert');
const routes = require('./routes');

const { PORT } = process.env;
assert(PORT, 'process.env.PORT not defined');

const app = express();
app.disable('x-powered-by');
app.use(routes);
app.listen(PORT, () => console.log(`Git CDN listening on ${PORT}!`));
