/* eslint-env worker, browser */
/* globals INJECTED_VARIABLE */

// Use 'require' to import e.g. npm modules
// These will be injected by Webpack upon build
const sample = require(`lodash.sample`)

// This is our worker's listener function
addEventListener(`fetch`, event => {
  event.respondWith(handlerFunction(event.request))
})

// This function handles incoming requests
async function handlerFunction(request) {
  // First, fetch the original request data
  const response = await fetch(request)

  // A random 'hello' from out helper function
  const hello = utilityFunction()
  const greeting = `${hello}, world!`

  // Create a new Headers object for our modified response
  const modifiedHeaders = new Headers(response.headers)

  // Set our greeting header in the modified response
  modifiedHeaders.set(`x-worker-greeting`, greeting)

  // The response data for our modified response
  const modifiedResponse = {
    status: response.status,
    statusText: response.statusText,
    headers: modifiedHeaders,
  }

  // return the original request content with our newly-modified response data
  return new Response(response.body, modifiedResponse)

}

// This is a simple helper function for the request handler
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
    INJECTED_VARIABLE,
  ]

  // Here, we use the lodash.sample module that we 'required' above
  return sample(hellos)
}
