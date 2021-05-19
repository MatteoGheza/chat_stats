const path = require('path');
const webpack = require('webpack');

const config = {
    mode: 'development',
    entry: './src/index.ts',
    plugins: [
      new webpack.ProgressPlugin()
    ],
    target: "node",
    output: {
      library: 'ChatStats',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /.(ts|tsx)$/,
          loader: 'ts-loader',
          include: [
            path.resolve(__dirname, 'src')
          ],
          exclude: [
            /node_modules/
          ]
        }
      ]
    },
    externals: {
      "node-emoji": "node-emoji",
      "date-and-time": "date-and-time",
      "date-and-time/plugin/two-digit-year": "date-and-time/plugin/two-digit-year"
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ]
    }
}

module.exports = config;