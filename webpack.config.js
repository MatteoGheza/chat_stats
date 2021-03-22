const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    mode: 'development',
    entry: './src/index.ts',
    plugins: [
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({ filename:'main.[contenthash].css' })
    ],
    target: "node",
    output: {
      library: 'ChatStats',
      libraryTarget: 'umd',
      globalObject: 'this',
      umdNamedDefine: true
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
        },
        {
          test: /.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ],
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/")
      }
    }
}

module.exports = config;