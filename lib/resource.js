'use strict';

/**
 * New Formide Resource
 * @param config
 * @constructor
 */
function FormideResource(resourceName, config, utils) {

    /**
     * List all devices connected to user account
     * @returns {*}
     */
    function list() {
        return utils.call('GET', `/db/${resourceName}`)
    }

    return {
        list
    }
}

module.exports = FormideResource;