/* eslint-env node */
require('colors')
const { bootstrap, testConfig } = require('./lib')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CloudflareWorkerPlugin = require('cloudflare-worker-webpack-plugin')

function createWebpackConfig(envPath, fixture) {
  let {
    entry,
    useColors,
    printOutput,
    filename,
    exampleGreeting,
    useEmoji,
  } = bootstrap(envPath, fixture)

  return {
    entry,

    output: {
      path: __dirname + '/dist',
      filename,
    },

    // Let Webpack know we mean business
    mode: 'production',

    // Let Webpack know the context in which our script will run
    target: 'webworker',

    module: {
      rules: [
        /*
        This causes scripts attempting to use Node's built-in APIs or global objects
          to fail, e.g. `Buffer` and `require('crypto')`. Install and require() shim
          modules manually if you wish to use these features.
       */
        {
          // include: entry,
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            failOnError: true,
            pre: true,
          },
        },
        /*
        This runs all JS through Babel to ensure compatibility with the
          Cloudflare Worker (i.e. latest Chrome) runtime.
       */
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },

    // Prevent Webpack from getting angry if we bundle a large script
    performance: {
      hints: false,
    },

    // Prevent Webpack from shimming Node features and bloating our Worker scripts
    node: false,

    optimization: {
      // Minify the final script if we're deploying and our config allows it
      minimize:
        process.env.WORKER_ACTION === 'deploy' && !process.env.DO_NOT_MINIFY,
      noEmitOnErrors: true,
    },

    plugins: [
      // Remove any previous builds in the dist folder
      new CleanWebpackPlugin(`dist/*`, {
        root: __dirname,
        verbose: false,
      }),

      /*
      Injected variables are parsed as strings BEFORE injecting
        that means strings must be double-quoted, so use JSON.stringify
        on the value of any variables you wish to inject
    */
      new webpack.DefinePlugin({
        INJECTED_VARIABLE: JSON.stringify(exampleGreeting),
      }),

      /*
      This deploys our worker script to Cloudflare and manages route patterns
    */
      new CloudflareWorkerPlugin(
        process.env.CLOUDFLARE_AUTH_EMAIL,
        process.env.CLOUDFLARE_AUTH_KEY,
        {
          zone: process.env.CLOUDFLARE_ZONE_ID,
          site: process.env.CLOUDFLARE_SITE_NAME,
          pattern: process.env.ROUTE_PATTERN,
          verbose: printOutput,
          colors: useColors,
          emoji: useEmoji,
          enabled: process.env.WORKER_ACTION === 'deploy',
          reset: !!process.env.RESET_EVERYTHING,
          clearRoutes: !!process.env.RESET_ROUTE_PATTERNS,
          skipWorkerUpload: !!process.env.DO_NOT_UPLOAD,
        }
      ),
    ],
  }
}

const test = process.env.NODE_ENV === 'testing'

module.exports = test ? testConfig(createWebpackConfig) : createWebpackConfig()
