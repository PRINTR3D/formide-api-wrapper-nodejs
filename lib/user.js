'use strict';

/**
 * New Formide Auth
 * @param config
 * @constructor
 */
function FormideUser(config, utils) {

    /**
     * Get the OAuth2 login URL
     * @returns {string}
     */
    function account() {
        return utils.call('GET', '/me')
    }

    return {
        account
    }
}

module.exports = FormideUser;