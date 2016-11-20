const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './index.js',
    vendor: [ 'react', 'react-dom' ],
  },
  output: {
    filename: '[name].js?[hash]',
    path: 'dist',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules=true'
      }
    ],
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].js?[hash]',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
};
