require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const Debug = require('debug');
const routes = require('..');

const debug = Debug('github-cdn');
const { PORT = 3005 } = process.env;

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());
app.use(routes);
const listener = app.listen(PORT, () => debug(`Github CDN listening on http://localhost:${listener.address().port}`));
