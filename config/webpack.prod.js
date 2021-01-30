const webpack = require('webpack');
const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base.js');
const { cssLoaders } = require('./util');

// configure File Loader
const configureFileLoader = () => ({
  test: /\.(jpe?g|png|gif|svg)$/i,
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]',
    outputPath: (url, resourcePath, context) => {
      if (/src/.test(url)) {
        return url.replace('src', '../..');
      }
    },
  },
});

// configure Optimization
const configureOptimization = () => ({
  minimize: true,
  minimizer: [new TerserPlugin()],
});

// configure MiniCssExtract
const configureMiniCssExtract = () => ({
  filename: 'vendor/css/[name].[fullhash].css',
  chunkFilename: 'vendor/css/[name].[fullhash].css',
});

// configure SW
const configureSW = () => ({
  clientsClaim: true,
  skipWaiting: true,
  directoryIndex: 'index.html',
  offlineGoogleAnalytics: true,
});

// configure Copy
const configureCopy = () => ({
  patterns: [
    { from: 'src/assets/', to: 'assets/' },
    { from: 'src/images/', to: 'images/' },
  ],
});

module.exports = merge(baseConfig, {
  mode: 'production',
  target: 'browserslist',
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          ...cssLoaders,
        ],
      },
      configureFileLoader(),
    ],
  },
  optimization: configureOptimization(),
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
    }),
    new MiniCssExtractPlugin(
      configureMiniCssExtract(),
    ),
    new WorkboxPlugin.GenerateSW(
      configureSW(),
    ),
    new CopyWebpackPlugin(
      configureCopy(),
    ),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
    }),
  ],
});
