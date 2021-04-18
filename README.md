# pass-through-server

Example showing how a nodejs middleware can propagate all REST calls to another
downstream service.

## Why?

I had a scenario where I would like to detect whenever a specific REST endpoint from a COTS is used.

The idea was to see how easy it would be to create a facade that would be (mostly) transparent, but allow me to capture the specific call(s) I care about and do some additional processing.

## Usage

Clone the repo and then run:

```
npm install
npm start
```

This will start the pass through server running on port 3001, and expects something to be running on `http://localhost:3000` (for example an [echo-server](https://github.com/rpmiskin/echo-server) ).

## How does it work?

`server.js` contains a middleware called `passthroughMiddleware` that does the magic - it takes apart the incoming request and makes the same call to another server (currently hardcoded to `http://localhost:3000`). The code in `passThroughMiddleware` demonstrates how to add in extra headers - in this case a dummy `Authorization` header.

`server.js` also shows how you can have some special case processing for certain paths, and then use something like the following to catch all remaining paths.

```
// Catch all handler to pass calls downstream.
app.all('*', passthroughMiddleware);
```

## Limitations

This is very much at the proof of concept stage, it passes through the following things:

1. method
2. url
3. headers
4. The request body **if** it is `application/json`.

The is currently no configuration of the axios that will be used by the middleware.

If this is fleshed out any further the middleware will be made available as an export.
