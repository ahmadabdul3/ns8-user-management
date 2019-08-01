var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  mode: 'development',
  devtool: '#eval-source-map',
  target: 'node',
  entry: './www.ts',
  externals: getNodeModules(),
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      src: path.resolve(__dirname),
    },
  },
  output: {
    filename: 'server',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-typescript' ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      {
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      }
    ),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ],
  node: {
    __dirname: true
  },
};

function getNodeModules() {
  var nodeModules = {};

  fs.readdirSync('node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  }).forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

  return nodeModules;
}
