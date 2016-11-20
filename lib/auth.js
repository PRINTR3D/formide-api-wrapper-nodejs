'use strict';

/**
 * New Formide Auth
 * @param config
 * @constructor
 */
function FormideAuth(config, utils) {

    /**
     * Get the OAuth2 login URL
     * @returns {string}
     */
    function getLoginURL() {
        return `${config.rootURL}/auth/authorise?client_id=${config.clientId}&redirect_uri=${config.redirectURI}&response_type=code`;
    }

    /**
     * Swap auth code for an access token
     * @param code
     * @returns {*}
     */
    function getAccessToken(code) {
        return utils.call('POST', '/auth/token', {
            grant_type: 'authorization_code',
            code,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: config.redirectURI
        }, false);
    }

    /**
     * Set access token in config
     * @param accessToken
     * @returns {*}
     */
    function setAccessToken(accessToken) {
        return config.accessToken = accessToken;
    }

    return {
        getLoginURL,
        getAccessToken,
        setAccessToken
    }
}

module.exports = FormideAuth;