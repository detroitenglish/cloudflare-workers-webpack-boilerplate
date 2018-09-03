/* eslint-env module, node, commonjs */
process.env.NODE_ENV = 'testing'
process.env.WORKER_ACTION = 'deploy'
const test = require('ava')
const rimraf = require('rimraf')
const { promisify } = require('util')
const webpack = promisify(require('webpack'))
const testConfig = require(process.cwd() + `/webpack.config.js`)

test.beforeEach(() => rimraf.sync(process.cwd() + `/dist/*`))

test('should throw if Cloudflare credentials not found', t => {
  const msg = `\\'CF-Account-.*\\' is undefined`
  return t.throws(() => testConfig(`credentials`), RegExp(msg))
})

test('should throw if Cloudflare site or zone-id not found', t => {
  const msg = `You must provide either a zone-id or site name`
  return t.throws(() => testConfig(`zone`), msg)
})

test('should error when using unshimmed Node builtins', async t => {
  const expectation = `Module failed because of a eslint error.`
  const config = testConfig(`eslint`)
  let stats = await webpack(config).then(result => result.toJson())
  return t.true(stats.errors.some(e => e.includes(expectation)))
})

function print(stuff) { // eslint-disable-line
  return typeof stuff === 'string'
    ? console.info(stuff)
    : console.info(JSON.stringify(stuff, null, 1))
}
