module.exports = {
  entry: './src',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    react: 'React'
  },
  output: {
    path: './build',
    filename: 'react-typewriter.js',
    library: 'TypeWriter',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel?stage=1'
    }]
  }
};
