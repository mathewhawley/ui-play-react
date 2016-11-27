/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const ora = require('ora');
const projects = require('./lib/projects');
const config = require('../webpack.config');

let spinner;
let server = null;
const port = 8080;
const host = 'localhost';

if (!process.argv[2]) {
  console.log(chalk.red('✖ No argument provided'));
  process.exit(1);
} else if (!projects.has(process.argv[2])) {
  console.log(chalk.red(`✖ '${process.argv[2]}' is not an existing project`));
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), process.argv[2]);

config.context = filePath;
config.entry.bundle = [
  `webpack-dev-server/client?http://${host}:${port}/`,
  'webpack/hot/dev-server',
  ...config.entry.bundle,
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
config.resolve.root = filePath;

const compiler = webpack(config);

compiler.plugin('compile', () => {
  console.log();
  spinner = ora('Bundling...').start();
});

compiler.plugin('failed', () => {
  spinner.text = chalk.red('Bundle failed!');
  spinner.fail();
  console.log();
});

compiler.plugin('done', () => {
  spinner.text = chalk.green('Bundle complete!');
  spinner.succeed();
  console.log();

  if (server) {
    server.listen(port, host, () => {
      console.log();
      console.log(`Server is listening at http://${host}:${port}...`);
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
