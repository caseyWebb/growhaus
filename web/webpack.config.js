/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const os = require('os')
const path = require('path')
const url = require('url')
const { mapValues } = require('lodash/fp')
const dotenv = require('dotenv')
// @ts-ignore
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// @ts-ignore
const HtmlWebpackPlugin = require('html-webpack-plugin')
// @ts-ignore
const ScriptExtPlugin = require('script-ext-html-webpack-plugin')

const { DefinePlugin, NamedModulesPlugin } = require('webpack')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { NODE_ENV, SERVER_URL, WEB_UI_DEV_SERVER_PORT, WEB_UI_URL } = process.env
const PRODUCTION = NODE_ENV === 'production'
const AVAILABLE_CPUS = Math.max(os.cpus().length - 2, 2) // leave 2 CPUS free

console.log('FOOBAR', process.env.FOOBAR)

console.log(
  '\nBuild config:\n\n',
  JSON.stringify({
    NODE_ENV,
    SERVER_URL,
    WEB_UI_URL,
    PRODUCTION
  })
)

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
  context: __dirname,
  entry: path.join(__dirname, 'src/index.ts'),
  devtool: 'source-map',
  output: {
    chunkFilename: '[name].[chunkhash].js',
    publicPath: WEB_UI_URL ? url.parse(WEB_UI_URL).pathname : '/'
  },
  devServer: {
    port: WEB_UI_DEV_SERVER_PORT
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  recordsPath: path.join(__dirname, '.cache/records.json'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, '.cache/ts')
            }
          },
          {
            loader: 'thread-loader',
            options: {
              workers: Math.min(Math.floor(AVAILABLE_CPUS / 2), 4)
            }
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
        options: {
          minimize: PRODUCTION,
          ignoreCustomComments: [/^\s*\/?ko/]
        }
      }
    ]
  },
  resolve: {
    alias: {
      src: path.join(__dirname, 'src/'),
      knockout$: require
        .resolve('knockout')
        .replace(
          'knockout-latest',
          PRODUCTION ? 'knockout-latest' : 'knockout-latest.debug'
        )
    },
    extensions: ['.ts', '.js']
  },
  plugins: [
    // provide DEBUG constant to app, will be statically analyzable so `if (DEBUG)` statements
    // will be stripped out by the minifier in production builds
    new DefinePlugin(
      mapValues(JSON.stringify, {
        DEBUG: !PRODUCTION,
        SERVER_URL,
        WEB_UI_URL
      })
    ),

    new ForkTsCheckerWebpackPlugin({
      async: false,
      // workers: Math.min(Math.floor(AVAILABLE_CPUS / 2), 4),
      workers: 1,
      checkSyntacticErrors: true
    }),

    // generate dist/index.html, injecting entry bundles into `src/index.html`
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    ...(PRODUCTION
      ? [
          new ScriptExtPlugin({
            defaultAttribute: 'defer',
            prefetch: {
              test: /\.js$/,
              chunks: 'async'
            },
            inline: {
              test: [/runtime/]
            }
          })
        ]
      : [
          // readable HMR output
          new NamedModulesPlugin()
        ])
  ]
}
