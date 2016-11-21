# formide-api-wrapper-nodejs
Node.JS language wrapper for Formide API. Supports HTTP and WebSocket APIs.

## Get started
Using the Formide API wrapper for Node.js is really simple.
Given that you already have a Node.js project with NPM setup just follow these steps:

Install the dependency
```
npm install --save formide-api
```

Require it in your project
``` js
const Formide = require('formide-api');
```

Initialize a new API client
``` js
const formide = new Formide.client({
    clientId:       process.env.FORMIDE_CLIENT_ID,
    clientSecret:   process.env.FORMIDE_CLIENT_SECRET,
    redirectURI:    process.env.FORMIDE_REDIRECT_URI
});
```

Now you're ready to use the wrapper function and interact with with the Formide HTTP and real-time APIs!

## Examples
You can find code samples of how to setup and use the wrapper functions in the `examples/` directory.
There's elaborate examples for both the HTTP API as well as the real-time event based functions.

## Contributing
You can contribute to `formide-api-wrapper-nodejs` by closing issues (via fork -> pull request to development), adding features or just using it and report bugs!
Please check the issue list of this repo before adding new ones to see if we're already aware of the issue that you're having.

## Licence
Please check LICENSE.md for licensing information.