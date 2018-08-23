# Webpack Boilerplate for Cloudflare Workers

It's a dead-simple template for deploying Cloudflare Workers with Webpack.

![Running npm run deploy in a terminal](.github/cf-worker-webpack-boilerplate-deploy.gif?raw=true "npm run deploy")

Webpack can seem like voodoo to the unfamiliar, so the goal here is to provide a reusable boilerplate with sane default configuration that allows anyone to bundle up a worker script with any NPM dependencies, and upload directly to Cloudflare.

### What you configure:
- Your Cloudflare credentials
- Your Cloudflare Zone ID
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
2. Rename `example.env` to `.env` , and add your required credentials and zone-id.
3. Install dependencies with `npm install`
4. Write your worker script in `src/worker.js`
   - Add any dependencies for your worker with: `npm install -P <some-required-package>`
   - Build a preview of your bundled worker script (found in `dist/bundled-worker.js`) by running: `npm run build`
5. Bundle up your worker and launch 🚀 with: `npm run deploy`

## Configuration

### Credentials and Zone ID

The following are **required** in your `.env` file:

- `CLOUDFLARE_AUTH_EMAIL`: Your Cloudflare account email address

- `CLOUDFLARE_AUTH_KEY`: Your Cloudflare API-Key

- `CLOUDFLARE_ZONE_ID`: The Zone ID to which your worker will be deployed

## Configuration Defaults

### Minification
Webpack is configured to minify your script before deployment to help keep your script under the 1MB limit. Building a preview with `npm run build` will not minify the bundles script to make debugging easier.

### Cloudflare Worker Webpack Plugin
Script uploading and route pattern management are handled by the same author's `cloudflare-worker-webpack-plugin`.

You can review how it works and find additional configuration options in the [plugin's documentation](https://github.com/detroitenglish/cloudflare-worker-webpack-plugin).

### Babel

Babel is included so that you can write JavaScript using the same syntaxes and features found in the latest version of Chrome **without** running to incompatibilities with your version of NodeJS.

This particular Babel configuration will only add polyfills to your bundle if it determines that they are necessary for Chrome compatibility (highly unlikely).

### Custom Variables

See `example.env` for details and examples on adding and injecting custom variables.

### Route Patterns

See `example.env` for details and examples on how route patterns are parsed and deployed.

## Relevant Resources

- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)

- [Clouflare-Worker-Webpack-Plugin documentation](https://github.com/detroitenglish/cloudflare-worker-webpack-plugin)

- [Webpack Config documentation](https://webpack.js.org/configuration/)

- [Babel's `preset-env` documentation](https://babeljs.io/docs/en/next/babel-preset-env.html)

## Contributing

WIP

## Software Stuff

### Disclaimer
I am not affiliated with Cloudflare in any way. But I'll gladly high-five any Cloudflarian I meet.

Assume in good faith I have no idea what I'm doing so **REVIEW THE SOURCE** and use at your own risk 🙈

### License
[MIT](./LICENSE)
