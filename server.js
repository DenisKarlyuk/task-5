import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import getAll from './routers/getAll';
import movieDb from './routers/movieDb';
import mlabDb from './routers/mlabDb';

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));
app.use(logger)
app.use('/api/moviedb', movieDb);
app.use('/api/mlabdb', mlabDb);
app.get('/*', getAll);

function logger(req, res, next) {
  console.log(`--start--\n Method: ${req.method}
  Url: ${req.originalUrl}\n Body: ${JSON.stringify(req.body)}\n--end--\n`);

  next();
}

export default app;
