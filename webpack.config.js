require('dotenv').config({ path: __dirname + '/.env' })

const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CloudflareWorkerPlugin = require('cloudflare-worker-webpack-plugin')

const {
  CLOUDFLARE_AUTH_EMAIL,
  CLOUDFLARE_AUTH_KEY,
  CLOUDFLARE_ZONE_ID,
} = validateCredentials()

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

    new CloudflareWorkerPlugin(CLOUDFLARE_AUTH_EMAIL, CLOUDFLARE_AUTH_KEY, {
      enabled: process.env.WORKER_ACTION === 'deploy',
      zone: CLOUDFLARE_ZONE_ID,
      pattern: process.env.ROUTE_PATTERN,
      verbose: true,
    }),
  ],
}

function validateCredentials() {
  let {
    CLOUDFLARE_AUTH_EMAIL: email,
    CLOUDFLARE_AUTH_KEY: api,
    CLOUDFLARE_ZONE_ID: zone,
  } = process.env

  if (!email || !api || !zone) {
    throw new Error(`Invalid configuration`)
  }

  const areStrings = [email, api, zone].every(val => typeof val === 'string')

  if (!areStrings) throw new Error(`Invalid configuration`)

  return {
    CLOUDFLARE_AUTH_EMAIL,
    CLOUDFLARE_AUTH_KEY,
    CLOUDFLARE_ZONE_ID,
  }
}
