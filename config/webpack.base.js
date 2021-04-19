const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const OUTPUT_DIR = 'docs';

// only form HtmlWebPackPlugin
const config = [
  { site: 'index'},
  { site: 'eyes-on-the-price'},
  { site: 'zooom'},
];

// configure Resolve
const configureResolveAlias = () => ({
  alias: {
    assets: path.resolve(__dirname, '../src/images'),
  },
});

// configure Babel Loader
const configureBabelLoader = () => ({
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
});

// configure Pug Loader
const configurePugLoader = () => ({
  test: /\.pug$/,
  loader: 'pug-loader',
  options: {
    pretty: true,
    self: true,
  },
});

// configure Output
const configureOutput = () => ({
  path: path.resolve(__dirname, `../${OUTPUT_DIR}`),
  filename: 'vendor/js/[name].[fullhash].js',
  chunkFilename: 'vendor/js/[name].[fullhash].js',
});

// configure HtmlWebPackPlugin
const entryHtmlPlugins = config.map(({ site, share }) => new HtmlWebPackPlugin({
  filename: `${site}.html`,
  template: `./src/templates/${site}.pug`,
  DATA: require(`../src/data/${site}.json`),
  chunks: [site, share],
}));

module.exports = {
  entry: {
    index: {
      import: './src/js/index.js',
    },
    'eyes-on-the-price': {
      import: './src/js/eyes-on-the-price.js',
    },
    'zooom': {
      import: './src/js/zooom.js',
    },
  },
  output: configureOutput(),
  resolve: configureResolveAlias(),
  module: {
    rules: [
      configureBabelLoader(),
      configurePugLoader(),
    ],
  },
  plugins: [
    ...entryHtmlPlugins,
  ],
};
