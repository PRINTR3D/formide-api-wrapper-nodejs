'use strict';

/**
 * Thrown when no websocket token was found
 * @param message
 * @constructor
 */
function WebSocketTokenNotFoundError(message) {
    this.name = 'WebSocketTokenNotFoundError';
    this.message = message || 'Could not find websocket access token to connect to Formide';
}
WebSocketTokenNotFoundError.prototype = Error.prototype;

module.exports = {
    WebSocketTokenNotFoundError
}