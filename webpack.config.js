const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
  entry: {
    bundle: ['./index.js'],
    vendor: Object.keys(pkg.dependencies).filter((dep) => {
      return !['babel-runtime', 'lodash'].includes(dep);
    }),
  },
  output: {
    filename: '[name].[hash].js',
    path: 'dist',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            modules: true,
            sourceMap: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
          })}`,
          'sass-loader?sourceMap',
        ],
      },
    ],
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new StyleLintPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.scss'],
  },
};
