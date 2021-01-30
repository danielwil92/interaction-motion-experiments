const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const { cssLoaders } = require('./util');

// Configure Dev Server
const configureDevServer = () => ({
  contentBase: './src',
  open: true,
  port: 3000,
  inline: true,
  stats: 'errors-only',
  hot: true,
});

// configure File Loader
const configureFileLoader = () => ({
  test: /\.(jpe?g|png|gif|svg)$/i,
  loader: 'file-loader',
});

module.exports = merge(baseConfig, {
  mode: 'development',
  target: 'web',
  devServer: configureDevServer(),
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          'style-loader',
          ...cssLoaders,
        ],
      },
      configureFileLoader(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
  ],
});
