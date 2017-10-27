/**
 * Author: zhin
 * Date: 2017/10/27 21:5
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin 参数的方法
var getHtmlConfig = function (name) {
  return {
    template: './src/view/' + name + '.html',
    filename: 'view/' + name + '.html',
    inject: true,
    hash: true,
    chunks: ['common', name]
  }
};

var config = {
  entry: {
    'common': ['./src/page/common/index.js'],
    'index': './src/page/index/index.js',
    'user-login': './src/page/user-login/index.js'
  },
  output: {
    path: './dist',
    publicPath : '/dist',
    filename: 'js/[name].js'
  },
  externals: {
    'jquery': 'window.jQuery'
  },
  module: {
    loader: [
      {test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=1000&name=resource/[name].[ext]' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/base.js'
    }),
    // 打包css单独打包到文件里
    new ExtractTextPlugin('css/[name].css'),
    // HTML模板的处理
    new HtmlWebpackPlugin(getHtmlConfig('index')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login'))
  ]


};

if ('dev' === WEBPACK_ENV) {
  config.entry.common.push('webpack-dev-server/client?http://localhost:8086/');
}

module.exports = config;
