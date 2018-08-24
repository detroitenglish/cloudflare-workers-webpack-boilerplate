/* eslint-env worker, browser */
/* globals INJECTED_VARIABLE */

// `require()`ed modules and our Worker script are bundled into a single script at build time
const sample = require(`lodash.sample`)
// Alternatively, Babel is configured to support import statements, e.g.:
//    import sample from 'lodash.sample'

// This is our worker's listener function
addEventListener(`fetch`, event => {
  event.respondWith(requestHandler(event.request))
})

// Our main function which handles requests
async function requestHandler(request) {
  // First, fetch the original request data
  const response = await fetch(request)

  // A random 'hello' from out helper function
  const hello = utilityFunction()
  const greeting = `${hello}, world!`

  // Create a new Headers object for our modified response
  const modifiedHeaders = new Headers(response.headers)

  // Set our greeting header in the modified response
  modifiedHeaders.set(`x-worker-greeting`, greeting)

  // Complete configuration for our modified response
  const modifiedResponseOptions = {
    status: response.status,
    statusText: response.statusText,
    headers: modifiedHeaders,
  }

  // return the original content with our modified response options
  return new Response(response.body, modifiedResponseOptions)
}

// This is a simple helper function for our requestHandler
function utilityFunction() {
  const hellos = [
    'Hello',
    'Konnichi wa',
    'Goedendag',
    'Bonjour',
    'Shalom',
    'Buonguiorno',
    'Dzien dobry',
    'Moin moin',
    'Alo',
    'Gauden Dag',
    'Privet',
    'Hola',
    'God dag',
    'Xin chao',
    // Below is EXAMPLE_GREETING found in the .env config file (default: 'Guten Tag')
    // It's passed via webpack.config.js to Webpack, which then injects the greeting upon build
    INJECTED_VARIABLE,
  ]

  // Here, we use the lodash.sample module that we 'required' above
  return sample(hellos)
}
