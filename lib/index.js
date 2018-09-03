/* eslint-env node, commonjs */
const dotenv = require('dotenv')
const fs = require('fs')

let isExample, useColors, useEmoji

exports.testConfig = function(configFun) {
  return fixture => {
    const envPath = `${process.cwd()}/test/fixtures/env/${fixture}.test.env`
    const conf = configFun(envPath, fixture)
    let workerFile = `${process.cwd()}/test/fixtures/js/${fixture}.test.js`
    let exists = fs.existsSync(workerFile)
    const entry = exists
      ? workerFile
      : `${process.cwd()}/test/fixtures/example.test.js`
    Object.assign(conf, { entry })
    conf.module.rules.forEach(rule => {
      if (rule.include) rule.include = entry
    })
    return conf
  }
}

exports.bootstrap = function(envPath = `${process.cwd()}/.env`, fixture) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (let k in envConfig) {
    process.env[k] = envConfig[k]
  }

  isExample = !!process.env.EXAMPLE_WORKER
  useColors = !process.env.NO_COLORS
  useEmoji = !process.env.NO_EMOJI
  const printOutput = !process.env.NO_VERBOSE

  let entry
  if (!fixture) {
    entry = `${process.cwd()}/src/${isExample ? `example.worker` : `worker`}.js`
  } else {
    const workerFile = `${process.cwd()}/test/fixtures/${fixture}.test.js`
    let exists = fs.existsSync(workerFile)
    entry = exists
      ? workerFile
      : `${process.cwd()}/test/fixtures/example.test.js`
  }

  const filename = `bundled-${isExample ? `example-worker` : `worker`}.js`

  let exampleGreeting
  if (isExample) exampleGreeting = process.env.EXAMPLE_GREETING || 'Aloha'

  startupText()

  return { entry, isExample, useColors, printOutput, filename, exampleGreeting }
}

function startupText() {
  if (process.env.NODE_ENV === 'testing') return
  let content = `Bundling ${isExample ? `Example` : `Cloudflare Worker`} script`

  content = useColors ? String(content).green : content

  let text = useEmoji ? `🚧  | ` : ``
  text += content

  console.info(text)
}
