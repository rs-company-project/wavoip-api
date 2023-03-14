const path = require('path')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'rs-voip-api.js',
    libraryTarget: 'umd',
    library: 'RSVoip'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'example'), path.join(__dirname, 'lib')],
  },
}