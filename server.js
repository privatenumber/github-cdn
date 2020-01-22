import 'dotenv/config';
import express from 'express';
import assert from 'assert';
import Debug from 'debug';
import routes from './routes';

const debug = Debug('github-cdn');
const { PORT } = process.env;
assert(PORT, 'process.env.PORT not defined');

const app = express();
app.disable('x-powered-by');
app.use(routes);
app.listen(PORT, () => debug(`Github CDN listening on ${PORT}!`));
