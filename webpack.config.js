require('dotenv').config({ path: __dirname + '/.env' })
require('colors')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CloudflareWorkerPlugin = require('cloudflare-worker-webpack-plugin')

const isExample = !!process.env.EXAMPLE_WORKER
const useColors = !process.env.NO_COLORS
const useEmoji = !process.env.NO_EMOJI
const stfu = !process.env.NO_VERBOSE

let exampleGreeting
if (isExample) exampleGreeting = process.env.EXAMPLE_GREETING || 'Aloha'

startupText()

module.exports = {
  entry: __dirname + `/src/${isExample ? `example.worker` : `worker`}.js`,
  output: {
    path: __dirname + '/dist',
    filename: `bundled-${isExample ? `example-worker` : `worker`}.js`,
  },
  // This lets Webpack know the context in which our script will run
  target: 'webworker',
  // This lets Webpack know that we mean business
  mode: 'production',
  // This runs all JS through Babel to ensure compatibility with the Cloudflare Worker (i.e. Chrome) runtime
  module: {
    rules: [
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

  // This prevents Webpack from trying to shim any Node.js APIs
  node: false,

  optimization: {
    // Minify the final script if we're deploying and our config allows it
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
      INJECTED_VARIABLE: JSON.stringify(exampleGreeting),
    }),

    // This plugin deploys our worker script to Cloudflare,
    //  and manages route matching patterns
    new CloudflareWorkerPlugin(
      process.env.CLOUDFLARE_AUTH_EMAIL,
      process.env.CLOUDFLARE_AUTH_KEY,
      {
        zone: process.env.CLOUDFLARE_ZONE_ID,
        site: process.env.CLOUDFLARE_SITE_NAME,
        pattern: process.env.ROUTE_PATTERN,
        verbose: stfu,
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

function startupText() {
  let content = `Bundling ${isExample ? `Example` : `Cloudflare Worker`} script`

  content = useColors ? String(content).green : content

  let text = useEmoji ? `🚧  | ` : ``
  text += content

  console.info(text)
}
