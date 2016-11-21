'use strict';

/**
 * Thrown when no websocket access token was found
 * @param message
 * @constructor
 */
function WebSocketTokenNotFoundError(message) {
    this.name = 'WebSocketTokenNotFoundError';
    this.message = message || 'Could not find access token to connect to Formide websocket';
}
WebSocketTokenNotFoundError.prototype = Error.prototype;

module.exports = {
    WebSocketTokenNotFoundError
}