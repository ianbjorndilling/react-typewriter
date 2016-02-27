module.exports = {
  entry: './src',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    react: {
      root: 'React',
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react'
    }
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
      loader: 'babel?presets[]=react,presets[]=es2015,plugins[]=transform-object-rest-spread'
    }]
  }
};
