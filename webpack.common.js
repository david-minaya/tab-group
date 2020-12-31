const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { transformManifest } = require('./src/utils/transform-manifest');

module.exports = {
  entry: {
    'background': './src/background.ts',
    'tab-bar': './src/content-scripts/tab-bar',
    'popup': './src/scripts/popup.tsx',
    'tab-bar-page': './src/scripts/tab-bar-page.tsx',
    'dev': './src/scripts/dev'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: './dist/dev.html'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'tab-bar-page.html',
      title: 'Tab bar',
      chunks: ['tab-bar-page']
    }),
    new HtmlWebpackPlugin({
      filename: 'dev.html',
      title: 'dev',
      chunks: ['dev']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json', transform: transformManifest },
        { from: './src/res' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]'
              } 
            }
          }
        ]
      }
    ]
  }
};
