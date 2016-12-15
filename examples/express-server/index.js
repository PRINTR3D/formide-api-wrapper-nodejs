'use strict';

// modules
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const Formide = require('../../lib');
const PORT    = 4000;

// Load .env file
require('dotenv').config({
    path: '.env'
});

// Initialize new Formide API instance using client ID and secret from environment
const formide = new Formide.client({
    clientId:       process.env.FORMIDE_CLIENT_ID,
    clientSecret:   process.env.FORMIDE_CLIENT_SECRET,
    redirectURI:    process.env.FORMIDE_REDIRECT_URI,
    rootURL:        'https://api-dev.formide.com'
});

const app = express();

app.use(session({
    key: 'formide-nodejs-example',
    store: new RedisStore({ host: 'localhost', port: 6379 }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// Use body parsers
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

/**
 * Middleware that checks authentication
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function checkAccessToken(req, res, next) {
    if (!req.session.accessToken) {
        req.session.originalUrl = req.originalUrl;
        return res.redirect('/login');
    }

    // set access token and refresh token in Formide library
    formide.auth.setAccessToken(req.session.accessToken, req.session.refreshToken);

    return next();
}

/**
 * Generic error handling function
 * @param error
 * @returns {Socket|*}
 */
function respondWithError(error) {
    if (error.body) // error produced by Formide API
        return this.res.status(error.body.statusCode).send(error.body);
    else
        return this.res.status(500).send({ message: error.message, name: error.name, code: error.code });
}

/**
 * Generic login handler function
 * @param response
 * @param req
 * @param res
 * @returns {*}
 */
function handleLogin(response, req, res) {
    if (response.access_token && response.refresh_token) {
        req.session.accessToken = response.access_token;
        req.session.refreshToken = response.refresh_token;

        if (req.session.originalUrl && req.session.originalUrl !== 'undefined') {
            res.redirect(req.session.originalUrl);
            delete req.session.originalUrl;
        }
        else {
            return res.redirect('/');
        }
    }
    else {
        return res.json({
            success: false,
            message: 'Login failed',
            reason: response.message
        });
    }
}

app.get('/login', function (req, res) {
    const loginURL = formide.auth.getLoginURL();
    return res.redirect(loginURL);
});

app.get('/redirect', function (req, res) {
    formide.auth
        .getAccessToken(req.query.code)
        .then(function (response) {
            return handleLogin(response, req, res);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/session', function (req, res) {
    return res.json({
        accessToken: req.session.accessToken,
        id: req.session.id
    });
});

app.get('/refresh', function (req, res) {
    if (!req.session.refreshToken)
        return res.status(401).send('Refresh token not found in session, please log in again');

    formide.auth
        .refreshAccessToken(req.session.refreshToken)
        .then(function (response) {
            return handleLogin(response, req, res);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/logout', function (req, res) {
    delete req.session.accessToken;
    return res.redirect('/');
});

app.get('/me', checkAccessToken, function (req, res) {
    formide.user
        .account()
        .then(function (accountInfo) {
            return res.json(accountInfo);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/devices', checkAccessToken, function (req, res) {
    formide.devices
        .list()
        .then(function (devices) {
            return res.json(devices);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/printers', checkAccessToken, function (req, res) {
    formide.printers
        .list()
        .then(function (printers) {
            return res.json(printers);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/printers/create', checkAccessToken, function (req, res) {
    formide.printers
        .create({
            name: 'New API Printer',
            axis: Formide.statics.PRINTER.AXIS.NORMAL,
            bed: { x: 200, y: 200, z: 200, heated: true, printerType: Formide.statics.PRINTER.TYPES.XYZ },
            extruders: [{ id: 0, name: 'Extruder 1', filamentDiameter: Formide.statics.PRINTER.FILAMENT_SIZES.SMALL, nozzleSize: 400 }]
        })
        .then(function (createdPrinter) {
            return res.json(createdPrinter);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/materials', checkAccessToken, function (req, res) {
    formide.materials
        .list()
        .then(function (materials) {
            return res.json(materials);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/upload', checkAccessToken, function (req, res) {
    formide.files
        .upload([
            fs.createReadStream('./assets/benchy.stl'),   // upload an STL file
            fs.createReadStream('./assets/benchy.gcode'), // upload a G-code file
            fs.createReadStream('./assets/files.zip')     // upload a zip containing multiple STL and G-code files
        ])
        .then(function (uploadResponse) {
            return res.json(uploadResponse);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/download', checkAccessToken, function (req, res) {
    const downloadStream = formide.files.download('583f5e707508400005b3dbbc')
    downloadStream.on('error', respondWithError.bind({ req, res }))
    downloadStream.pipe(res);
});

app.post('/webhook', function (req, res) {
    console.log(req.body);
    return res.json('OK, thanks');
});

app.get('/', function (req, res) {
    return res.send('OK');
});

app.listen(PORT, function () {
    console.info(`Example app running on port ${PORT}...`)
});
