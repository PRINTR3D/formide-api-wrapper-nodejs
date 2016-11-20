'use strict';

// modules
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Formide = require('../lib');
const PORT    = 4000;

// Load .env file
require('dotenv').config({
    path: 'example/.env'
});

// Initialize new Formide API instance using client ID and secret from environment
const formide = new Formide.client({
    clientId:       process.env.FORMIDE_CLIENT_ID,
    clientSecret:   process.env.FORMIDE_CLIENT_SECRET,
    redirectURI:    process.env.FORMIDE_REDIRECT_URI,
    webSocketToken: process.env.FORMIDE_SOCKET_TOKEN
});

const app = express();

app.use(session({
    key: 'formide-nodejs-example',
    store: new RedisStore({ host: 'localhost', port: 6379 }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

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
    else {
        return this.res.status(500).send({ message: error.message });
    }
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

        if (req.session.originalUrl && req.session.originalUrl !== undefined) {
            delete req.session.originalUrl;
            const originalUrl = req.session.originalUrl;
            res.redirect(originalUrl);
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

app.get('/login/redirect', function (req, res) {
    formide.auth
        .getAccessToken(req.query.code)
        .then(function (response) {
            return handleLogin(response, req, res);
        })
        .catch(function (err) {
            console.log(err);
        });
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
        });
});

app.get('/devices', checkAccessToken, function (req, res) {
    formide.devices
        .list()
        .then(function (devices) {
            return res.json(devices);
        })
        .catch(respondWithError.bind({ req, res }));
});

app.get('/last_status', function (req, res) {
    var formideWebSocket = null;

    // we wrap this in a try-catch to prevent a crash when connecting without access token
    try { formideWebSocket = formide.socket.getSocket(); }
    catch (e) { return res.status(500).send(); }

    formideWebSocket.once('printer.status', function (data) {
        return res.json(data);
    });
});

app.get('/', function (req, res) {
    return res.send('OK');
});

app.listen(PORT);