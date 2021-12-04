const express = require('express');
const port = process.env.PORT || 3001;
const axios = require('axios');
const {SERVICE_UNAVAILABLE} = require('http-status-codes');
const app = express();

app.disable('x-powered-by');
app.use(express.json());

const TARGET_FQDN = process.env.TARGET_FQDN || 'localhost';
const TARGET_PORT = process.env.TARGET_PORT || '3000';

// Set up a defaults axios instance with any common settings
// e.g. client certs
const instance = axios.create({
  baseURL: 'http://${TARGET_FQDN}:${TARGET_PORT}'
});

// Maps from a request axios config, also demonstrates adding
// modifying the headers
function defaultRequestMapper(req){
  const { url, method, headers, body:data } = req;
  headers.Authorization = 'Bearer a-valid-token';
  return {url, method, headers, data};
}

// middleware that propogates a call via the axios instance
// adds additional config.
// NB: This calls res.send() so not processing on the response can be done by the caller.
async function passthroughMiddleware(req, res, next, requestMapper = defaultRequestMapper) {
  try {
    const response = await instance.request(requestMapper(req));
    const { status, data, headers } = response;
    res.status(status).set(headers).send(data);
  } catch (e) {
    // If the downstream call threw an error, return a SERVICE_UNAVAILABLE and the error message.
    res.status(SERVICE_UNAVAILABLE).send(e.message);
  }
};

// Add special processing for a specific case...
app.put('/core/:knowledgebase/:entity', async (req, res, next) => {
  const {body, method, url, params} = req;
  console.log(JSON.stringify({method, body, url, params}, null, 2));
  await passthroughMiddleware(req,res,next);
});


// Catch all handler to pass calls downstream.
app.all('*', passthroughMiddleware);

app.listen(port, () => {
  console.log(`Passthrough listening at http://localhost:${port}`)
})



