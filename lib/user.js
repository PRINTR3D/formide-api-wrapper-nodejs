'use strict';

/**
 * New Formide Auth
 * @param config
 * @constructor
 */
function FormideUser(config, utils) {

    /**
     * Get basic user account info
     * @returns {*}
     */
    function account() {
        return utils.call('GET', '/me')
    }

    return {
        account
    }
}

module.exports = FormideUser;