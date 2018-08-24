require('dotenv').config({ path: __dirname + '/.env' })
require('colors')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CloudflareWorkerPlugin = require('cloudflare-worker-webpack-plugin')

const isExample = !!process.env.EXAMPLE_WORKER

console.info(
  `Building ${isExample ? `Example` : `Cloudflare Worker`} script...`.green
)

module.exports = {
  entry: __dirname + `/src/${isExample ? `example.worker` : `worker`}.js`,
  output: {
    path: __dirname + '/dist',
    filename: `bundled-${isExample ? `example-worker` : `worker`}.js`,
  },
  target: 'webworker',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },

  performance: {
    hints: false,
  },

  optimization: {
    minimize:
      process.env.WORKER_ACTION === 'deploy' && !process.env.DO_NOT_MINIFY,
  },

  plugins: [
    // First, remove any previous builds in the dist folder
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
      INJECTED_VARIABLE: isExample
        ? JSON.stringify(process.env.EXAMPLE_GREETING || 'Aloha')
        : undefined,
    }),

    // Deploys worker script to Cloudflare and manages route matching patterns
    new CloudflareWorkerPlugin(
      process.env.CLOUDFLARE_AUTH_EMAIL,
      process.env.CLOUDFLARE_AUTH_KEY,
      {
        zone: process.env.CLOUDFLARE_ZONE_ID,
        pattern: process.env.ROUTE_PATTERN,
        verbose: true,
        enabled: process.env.WORKER_ACTION === 'deploy',
        clearRoutes: !!process.env.RESET_ROUTE_PATTERNS,
        skipWorkerUpload: !!process.env.DO_NOT_UPLOAD,
      }
    ),
  ],
}
