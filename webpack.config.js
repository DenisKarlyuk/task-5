var path = require('path')
var webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  devtool: NODE_ENV=='development'
    ? 'cheap-module-eval-source-map'
    : null,
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint'],
        include: [path.resolve(__dirname, 'src'),],
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel-loader'],
        include: [path.resolve(__dirname, 'src'),],
        plugins: ['transform-runtime'],
      },{
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}
