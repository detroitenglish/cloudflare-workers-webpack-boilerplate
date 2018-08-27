# Webpack Boilerplate for Cloudflare Workers

A superbly simple minimal-config template for building, bundling and deploying Cloudflare Workers with Webpack 🚀

![Running npm run deploy in a terminal](.github/cf-worker-webpack-boilerplate-deploy.gif?raw=true "npm run deploy")

Webpack can seem like voodoo to the unfamiliar, so the goal here is to provide a reusable boilerplate with sane default configuration that allows anyone to bundle up a worker script with any NPM dependencies, and upload directly to Cloudflare.

### What you configure:
- Your Cloudflare credentials
- Your site name (FQDN) or Cloudflare Zone-Id
- (Optional) One or more route matching patterns for your Worker

### What you get:
- Transparent, optimized and ready-to-rock Webpack configuration file
- Babel configuration ensuring development-setup build compatibility for Node 6 and up
- Babel-assured compatibility for Worker's JavaScript in the latest CF-Worker (i.e. Chrome) runtime
- Dynamic polyfilling, applied only when needed (which is anyways very unlikely!)
- Baked-in **management of route matching patterns**, if and when routes are provided
- Minification of deployed Worker scripts to help keep them under the 1MB limit
- A ready-to-deploy example Worker in worker.js using `require()`, with comments to help make sense of it all

### Requirements:
- Min. Node version 6

## Quick Start

1. Clone this repository:
    ````bash
    git clone git@github.com:detroitenglish/cloudflare-worker-webpack-boilerplate.git

    cd cloudflare-worker-webpack-boilerplate
    ````
2. Rename `example.env` to `.env` , and add your required Cloudflare credentials, and either your site name or zone-id.
3. Install dependencies with `npm install`
4. Write your worker script in `src/worker.js`
   - Add any dependencies for your worker with: `npm install -P <some-required-package>`
   - Build a preview of your bundled worker script (found in `dist/bundled-worker.js`) by running: `npm run build`
5. Build, bundle and launch your Worker to the Cloudflare edge 🚀 using: `npm run deploy`


### Example Cloudflare Worker

An deployment-ready example Worker script can be found in `src/example.worker.js`.

The example Worker `require()`s [lodash.sample](https://www.npmjs.com/package/lodash.sample),
and uses it to randomly choose a translation of the word 'hello'. It then adds a response header in the form of:

  ````
  x-worker-greeting: <random-hello>, world!
  ````

#### Using the Example Worker

After completing steps 1-3 above, you can build the example script with `npm run build:example`,
or even deploy it to production with `npm run deploy:example`


## Configuration

### Required Config

The following are **required** in your `.env` file:

- `CLOUDFLARE_AUTH_EMAIL`: Your Cloudflare account email address

- `CLOUDFLARE_AUTH_KEY`: Your Cloudflare API-Key

#### Site Identifier

You **must** provide a means of identifying your Cloudflare site deployment target by including either:

- `CLOUDFLARE_ZONE_ID`: The Zone ID to which your worker will be deployed

or

- `CLOUDFLARE_SITE_NAME`: The fully qualified domain name (FQDN) of your site

### Optional Config

Additional, optional configuration variables are defined and described in [`example.env`](./example.env)


## Default Settings & Behaviors

### Minification
Webpack is configured to minify scripts before deployment in order to help keep your bundled Worker under the 1MB limit.

Building previews with `npm run build` will **not** minify scripts in order to make debugging easier.

### CloudflareWorkerPlugin
Worker script uploading and route pattern management are handled by the this same author's [`cloudflare-worker-webpack-plugin`](https://www.npmjs.com/package/cloudflare-worker-webpack-plugin). You can review the plugin's source code and documentation [here](https://github.com/detroitenglish/cloudflare-worker-webpack-plugin).

### Babel Configuration

Babel is configured to let you use JavaScript syntaxes and features that are supported in the latest version of Chrome, but **not natively supported by NodeJS**, e.g. `import "statements"` or `{ ...objectSpreadSyntax }`.

On build, Babel will only add polyfills to your bundled script if, after evaluating your code, it determines a polyfill is necessary for compatibility with the latest version of Chrome (a _very_ unlikely scenario).

### Custom .env Variables

See [`example.env`](./example.env) for details and examples on adding and injecting custom variables.

### Route Patterns

See [`example.env`](./example.env) for details and examples on how route patterns are parsed and deployed.

## Relevant Resources

- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)

- [Clouflare-Worker-Webpack-Plugin documentation](https://github.com/detroitenglish/cloudflare-worker-webpack-plugin)

- [Webpack Config documentation](https://webpack.js.org/configuration/)

- [Babel's `preset-env` documentation](https://babeljs.io/docs/en/next/babel-preset-env.html)

- [`dotenv` documentation](https://github.com/motdotla/dotenv)

## Development

### Testing and Issue Reporting

I am not a Cloudflare employee, so as a peasant my testing is limited to my own Workers,
in my own zones for my own application in production.

So by all means, try to break stuff! And if something goes kaputt, please let me know by
[creating an issue](https://github.com/detroitenglish/cloudflare-worker-webpack-boilerplate/issues).

### Contributing

PRs are very much welcome 👍

Linting is enforced pre-commit. Fork away!

### Roadmap

Some ideas going forward:

- [x] Replace zone-id requirement with automatic zone-lookup of FQDN (_added in 0.0.1-beta.5_)
- [ ] Support single-shot deployment to multiple zones
- [ ] Add argument parsing (or actual binary?) for deployment via pure CLI

But I'm very open to suggests - please share your ideas by [creating an issue](https://github.com/detroitenglish/cloudflare-worker-webpack-boilerplate/issues).

## Software Stuff

### Disclaimer
Other than a happy customer, I am not affiliated with Cloudflare in any way.

Assume in good faith that I have no idea what I'm doing; **REVIEW THE SOURCE**, and use at your own risk 🙈

### License
[MIT](./LICENSE)
