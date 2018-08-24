/* eslint-env worker, browser */
/* globals */ // list injected variables after 'globals'

addEventListener(`fetch`, event => {
  event.respondWith(requestHandler(event.request))
})

async function requestHandler(request) {
  // Do awesome stuff here
  return await fetch(request)
}
