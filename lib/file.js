'use strict';

const request = require('request');

/**
 * New Formide File
 * @param config
 * @constructor
 */
function FormideFile(config, utils) {

    /**
     * Upload one or multiple files as write streams
     * @param writeStreams
     * @returns {Promise}
     */
    function upload(writeStreams) {
        return new Promise(function (resolve, reject) {
            const formData = {
                files: writeStreams
            }

            request.post({
                url: config.rootURL + '/files/upload',
                formData: formData,
                auth: {
                    bearer: config.accessToken
                },
                json: true
            }, function uploadResponse(err, response, body) {
                if (err) return reject(err);
                if (response.statusCode !== 200) return reject(response); // TODO: make this better
                return resolve(body);
            });
        });
    }

    /**
     * Download a file by ID
     * @param id
     * @param hash
     * @returns {Promise}
     */
    function download(id, encoding) {
        return request
            .get({
                url: config.rootURL + '/files/download',
                qs: {
                    id: id,
                    encoding: encoding
                },
                auth: {
                    bearer: config.accessToken
                }
            });
    }

    return {
        upload,
        download
    }
}

module.exports = FormideFile;