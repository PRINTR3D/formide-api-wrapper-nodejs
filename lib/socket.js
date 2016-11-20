'use strict';

const io           = require('socket.io-client');
const WSTokenError = require('./errors').WebSocketTokenNotFoundError;

/**
 * New Formide Devices
 * @param config
 * @constructor
 */
function FormideWebSocket(config, utils) {

    var socket = null;

    /**
     * Initialize websocket usage
     * @returns {*}
     */
    function getSocket() {
        if (!config.webSocketToken)
            throw new WSTokenError();

        if (socket)
            socket.disconnect();

        socket = io.connect(config.rootURL, { reconnect: true });

        socket.emit('authenticate', {
            type: 'user',
            accessToken: config.webSocketToken
        }, function (response) {
            if (!response.success)
                console.error('Failed to authenticate to Formide real-time socket', response.message);
            else
                console.info('Authenticated to Formide real-time socket', response.message);
        });

        const wildcard = require('socketio-wildcard')(io.Manager);
        wildcard(socket);

        return socket;
    }

    return {
        getSocket
    }
}

module.exports = FormideWebSocket;