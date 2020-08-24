const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: 'flv-live-player.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 8000,
    disableHostCheck: true,
  },
};
