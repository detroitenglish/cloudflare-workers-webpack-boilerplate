require('dotenv').config({ path: __dirname + '/.env' })

const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CloudflareWorkerPlugin = require('cloudflare-worker-webpack-plugin')

module.exports = {
  entry: __dirname + '/src/worker.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundled-worker.js',
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
    minimize: process.env.WORKER_ACTION === 'deploy',
  },

  plugins: [
    new CleanWebpackPlugin(`dist/*`, {
      root: __dirname,
      verbose: true,
    }),

    new webpack.DefinePlugin({
      INJECTED_VARIABLE: JSON.stringify(
        process.env.EXAMPLE_GREETING || 'Aloha'
      ),
    }),

    new CloudflareWorkerPlugin(
      process.env.CLOUDFLARE_AUTH_EMAIL,
      process.env.CLOUDFLARE_AUTH_KEY,
      {
        enabled: process.env.WORKER_ACTION === 'deploy',
        zone: process.env.CLOUDFLARE_ZONE_ID,
        pattern: process.env.ROUTE_PATTERN,
        verbose: true,
      }
    ),
  ],
}
