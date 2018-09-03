/* eslint-env module, node, commonjs */
process.env.NODE_ENV = 'testing'
const test = require('ava')
const rimraf = require('rimraf')
const { promisify } = require('util')
const webpack = promisify(require('webpack'))
const testConfig = require(process.cwd() + `/webpack.config.js`)

test.beforeEach(() => rimraf.sync(process.cwd() + `/dist/*`))

test('should throw if Cloudflare credentials not found', t => {
  return t.throws(() => testConfig(`example`), Error)
})

test('should throw if Cloudflare site or zone-id not found', t => {
  return t.throws(() => testConfig(`zone`), Error)
})

test('should throw with unshimmed Node builtins', async t => {
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
