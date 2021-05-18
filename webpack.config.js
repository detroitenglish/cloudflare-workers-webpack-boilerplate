/* eslint-env node */
const webpack = require(`webpack`)
const CleanWebpackPlugin = require(`clean-webpack-plugin`)
const CloudflareWorkerPlugin = require(`cloudflare-workers-webpack-plugin`)
const ESLintPlugin = require(`eslint-webpack-plugin`)
const { bootstrap, resolve } = require(`./lib`)

function createWebpackConfig(env) {
  let params = bootstrap(env)
  let {
    disabledPatterns,
    enabledPatterns,
    exampleGreeting,
    filename,
    metadataPath,
    minify,
    printOutput: verbose,
    useColors: colors,
    useEmoji: emoji,
    workerSrc: entry,
    deploy,
    reset,
    debug,
    site,
    zone,
    cfEmail,
    cfApiKey,
    scriptName,
  } = params

  return {
    entry,

    output: {
      path: resolve(`dist`),
      filename,
    },
    bail: true,
    cache: false,
    // Let Webpack know we mean business
    mode: `production`,

    // Let Webpack know the context in which our script will run
    target: `webworker`,

    module: {
      rules: [
        /*
        This runs all JS through Babel to ensure compatibility with the
          Cloudflare Worker (i.e. latest Chrome) runtime.
       */
        {
          test: /\.m?js$/,
          loader: `babel-loader`,
          exclude: /\/node_modules\//,
          options: {
            // requireConfigFile: false,
            presets: [
              [
                `@babel/preset-env`,
                {
                  modules: false,
                  loose: true,
                  useBuiltIns: `usage`,
                  debug,
                  corejs: 3,
                  targets: {
                    browsers: `last 1 Chrome versions`,
                  },
                  exclude: [
                    /web\.dom/, // We ain't got no DOM...
                    /generator|runtime/,
                  ],
                },
              ],
            ],
            plugins: [],
          },
        },
      ],
    },

    // Prevent Webpack from getting angry if we bundle a large script
    performance: {
      hints: false,
    },

    // Prevent Webpack from shimming Node features and bloating our Worker
    // scripts
    node: false,

    optimization: {
      // Minify the final script if we're deploying and our config allows it
      minimize: minify,
      noEmitOnErrors: true,
    },

    // Only spit out errors if we have them...
    stats: `errors-only`,

    plugins: [
      new ESLintPlugin({
        failOnError: true,
        failOnWarning: false,
        emitError: true,
        cache: false,
      }),
      // Remove any previous builds in the dist folder
      new CleanWebpackPlugin({
        dry: false,
        verbose: debug,
        cleanOnceBeforeBuildPatterns: [`*.js`],
        cleanAfterEveryBuildPatterns: [`tmp`],
      }),

      /*
      Injected variables are parsed as strings BEFORE injecting that means
        strings must be double-quoted, so use JSON.stringify on the value of any
        variables you wish to inject
    */
      new webpack.DefinePlugin({
        INJECTED_VARIABLE: JSON.stringify(exampleGreeting),
      }),

      /*
      This deploys our worker script to Cloudflare and manages route patterns
    */
      new CloudflareWorkerPlugin(cfEmail, cfApiKey, {
        scriptName,
        colors,
        disabledPatterns,
        emoji,
        enabled: deploy,
        enabledPatterns,
        metadataPath,
        reset,
        site,
        verbose,
        zone,
      }),
    ],
  }
}

module.exports =
  process.env.NODE_ENV === `testing`
    ? createWebpackConfig
    : createWebpackConfig()
