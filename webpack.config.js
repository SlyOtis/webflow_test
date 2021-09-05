const path = require('path');

module.exports = {
  context: __dirname,
  mode: "production",
  entry: './src/player.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'player'),
    filename: '[name].js',
  },
};
