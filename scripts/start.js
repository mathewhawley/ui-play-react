/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const wpConfig = require('../webpack.config');
const config = require('./config');
const chalk = require('chalk');
const ora = require('ora');

let spinner;
let server = null;
const { port, host, projects } = config;

if (!process.argv[2]) {
  throw new Error('No argument provided')
} else if (!projects.has(process.argv[2])) {
  throw new Error(`'${process.argv[2]}' is not an existing project`)
}

const filePath = path.resolve(process.cwd(), process.argv[2]);

wpConfig.context = filePath;
wpConfig.entry.bundle = [
  `webpack-dev-server/client?http://${host}:${port}/`,
  'webpack/hot/only-dev-server',
  ...wpConfig.entry.bundle,
];
wpConfig.output.path = filePath;
wpConfig.plugins = [
  ...wpConfig.plugins,
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(filePath, 'index.html'),
    inject: 'body',
  }),
];
wpConfig.resolve.root = filePath;

const compiler = webpack(wpConfig);

compiler.plugin('compile', () => {
  spinner = ora('Bundling...').start();
});

compiler.plugin('failed', () => {
  spinner.text = chalk.red('Bundle failed!');
  spinner.fail();
});

compiler.plugin('done', () => {
  spinner.text = chalk.green('Bundle complete!\n');
  spinner.succeed();

  if (server) {
    server.listen(port, host, () => {
      const URL = chalk.green(`http://${host}:${port}`);
      console.log(`\nServer is listening at ${URL} ...`);
    });
  }
});

server = new WebpackDevServer(compiler, {
  contentBase: filePath,
  hot: true,
  inline: true,
  quiet: false,
  noInfo: false,
  stats: {
    colors: true,
    chunks: false,
  },
});
