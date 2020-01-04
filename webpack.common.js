const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const INPUT_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  context: INPUT_DIR,
  entry: {
    main: './app/main.js'
  },
  output: {
    path: OUTPUT_DIR,
    filename: 'js/[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin([
      'favicon.ico',
      'manifest.json',
      'service-worker.js',
      { from: 'css', to: 'css' },
      { from: 'images', to: 'images' }
    ])
  ]
}
