# Webpack Boilerplate for Cloudflare Workers

`require()` to your ❤'s desire, and launch your freshly-bundled Cloudflare Worker to the edge! 🚀

---

## Quick Start

1. Rename `example.env` to `.env`, and edit the configuration as required.
2. Install dependencies with `npm install`
3. Write your worker script in `src/worker.js`
   - Add any dependencies for your worker with: `npm install -P <some-required-package>`
   - See a preview of your bundled worker script (in `dist/bundled-worker.js`) by running: `npm run build`
4. Build your worker, and launch it! 🚀 : `npm run deploy`

## Configuration

### Credentials and Zone ID

The following are **required** in your `.env` file:

- `CLOUDFLARE_AUTH_EMAIL`: Your Cloudflare account email address

- `CLOUDFLARE_AUTH_KEY`: Your Cloudflare API-Key

- `CLOUDFLARE_ZONE_ID`: The Zone ID to which your worker will be deployed.

## Good to Know

### The Webpack Config File

WIP

### Using Custom Variables

WIP

### Route Patterns

WIP

### Included Example

WIP

### Additional Resources

WIP

## Software Stuff

### Cool Little Badges

WIP

### Disclaimer
I am not affiliated with Cloudflare in any way. But I'll gladly give any Cloudflarian I meet a big ol' high-five.

Assume in good faith I have no idea what I'm doing. **REVIEW THE SOURCE**, and use at your own risk 🙈

### License
MIT
