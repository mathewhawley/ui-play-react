const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('../webpack.config');

const fileName = process.argv[2];
const filePath = path.resolve(__dirname, `../${fileName}`);
const port = 8080;
const host = 'localhost';

config.context = filePath;
config.entry.bundle = [
  `webpack-dev-server/client?http://${host}:${port}/`,
  'webpack/hot/dev-server',
  `./${fileName}.js`
];
config.output.path = filePath;
config.plugins = [
  ...config.plugins,
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(filePath, 'index.html'),
    inject: 'body',
  }),
];

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: filePath,
  hot: true,
  quiet: false,
  noInfo: false,
  stats: {
    colors: true,
    chunks: false,
  },
});

server.listen(port, host);
