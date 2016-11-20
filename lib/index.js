'use strict';

/**
 * New Formide
 * @param config
 * @constructor
 */
function Formide(config) {

    // config defaults
    config.rootURL        = config.rootURL || 'https://api.formide.com';
    config.accessToken    = config.accessToken || false;
    config.webSocketToken = config.webSocketToken || false;

    // utils
    const utils = new require('./utils')(config);

    // endpoints
    const auth          = new require('./auth')(config, utils);
    const socket        = new require('./socket')(config, utils);
    const user          = new require('./user')(config, utils);
    const devices       = new require('./devices')(config, utils);
    const printers      = new require('./resource')('printers', config, utils);
    const materials     = new require('./resource')('materials', config, utils);
    const sliceProfiles = new require('./resource')('sliceprofiles', config, utils);
    const printJobs     = new require('./resource')('printjobs', config, utils);

    return {
        auth,
        socket,
        user,
        devices,
        printers,
        materials,
        sliceProfiles,
        printJobs
    }
}

module.exports.client = Formide;