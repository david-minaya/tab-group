const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    background: './src/background.ts',
    'content-script': './src/content-script.tsx',
    'popup-root': './src/popup-root.tsx',
    'index-root': './src/index-root.tsx',
    'tab-bar-page': './src/tab-bar-page.tsx'
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([
      './src/manifest.json'
    ]),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup-root']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index-root'],
      title: 'Index'
    }),
    new HtmlWebpackPlugin({
      filename: 'tab-bar-page.html',
      chunks: ['tab-bar-page']
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader'
          }
        ]
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
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
