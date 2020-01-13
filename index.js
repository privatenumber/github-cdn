import 'dotenv/config';
import express from 'express';
import assert from 'assert';
import routes from './routes';

const { PORT } = process.env;
assert(PORT, 'process.env.PORT not defined');

const app = express();
app.disable('x-powered-by');
app.use(routes);
app.listen(PORT, () => console.log(`Git CDN listening on ${PORT}!`));
