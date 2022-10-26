
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const mode = process.env.NODE_ENV;
const devMode = mode === "development";
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    open: true
  },
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'main.js')],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
    clean: true
  },

  plugins: [
    //HTML
    new HtmlWebpackPlugin({
      title: 'webpack HTML',
      template: './src/index.html', // tenplate
      filename: 'index.html', // name of output file
    }),
    // css
    new MiniCssExtractPlugin({
      linkType: "text/css",
      filename: '[name].[contenthash].css',
    })
  ],
  module: {
    rules: [
      //loaders HTML
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      //style loader
      {
        test: /\.(s*)css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [postcssPresetEnv],
                ],
              },
            },
          },
          "sass-loader",
        ]
      },
      //   js
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      //fonts
      {
        test: /\.woff2?$/i,

        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      },
      //img
      {
        test: /\.(png|svg|jpg|jpeg|gif|txt)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              },
            }
          }
        ],
        type: "asset/resource",
      },


    ],
  },
}
