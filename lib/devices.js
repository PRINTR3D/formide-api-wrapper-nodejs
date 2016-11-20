'use strict';

/**
 * New Formide Devices
 * @param config
 * @constructor
 */
function FormideDevices(config, utils) {

    /**
     * List all devices connected to user account
     * @returns {*}
     */
    function list() {
        return utils.call('GET', '/devices')
    }

    return {
        list
    }
}

module.exports = FormideDevices;