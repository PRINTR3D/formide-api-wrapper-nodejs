'use strict';

const request = require('request');

/**
 * New Formide Auth
 * @param config
 * @constructor
 */
function FormideUtils(config) {

    /**
     * Do an API call
     * @param method
     * @param url
     * @param data
     * @returns {Promise}
     */
    function call(method, url, data, useAuth) {

        useAuth = useAuth || true;

        return new Promise(function (resolve, reject) {
            var options = {
                method: method,
                url: config.rootURL + url,
                json: true
            };

            // add request data
            if (method === 'GET' && data)
                options.qs = data;
            else if (data)
                options.form = data;

            // add bearer auth header
            if (useAuth && config.accessToken)
                options.auth = { bearer: config.accessToken };

            // do request
            request(options, function (err, response, body) {
                if (err) return reject(err);
                if (response.statusCode !== 200) return reject(response); // TODO: make this better
                return resolve(body);
            });
        });
    }

    return {
        call
    }
}

module.exports = FormideUtils;