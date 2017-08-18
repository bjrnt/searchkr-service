const slsw = require('serverless-webpack')
const { resolve, join } = require('path')

module.exports = {
  target: 'node',
  entry: './handler.ts',
  output: {
    libraryTarget: 'commonjs',
    path: resolve('.webpack'),
    filename: 'handler.js',
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      hiredis: join(__dirname, './src/aliases/hiredis.js'),
    },
  },
}
