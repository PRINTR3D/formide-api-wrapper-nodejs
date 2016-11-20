'use strict';

/**
 * New Formide Resource
 * @param config
 * @constructor
 */
function FormideResource(resourceName, config, utils) {

    /**
     * List all items of resource
     * @returns {*}
     */
    function list() {
        return utils.call('GET', `/db/${resourceName}`);
    }

    /**
     * Find a single resource by ID
     * @param id
     */
    function find(id) {
        return utils.call('GET', `/db/${resourceName}/${id}`);
    }

    /**
     * Create a new resource
     * @param properties
     */
    function create(properties) {
        return utils.call('POST', `/db/${resourceName}`, properties);
    }

    /**
     * Update resource by ID
     * @param id
     * @param properties
     */
    function update(id, properties) {
        return utils.call('PUT', `/db/${resourceName}/${id}`, properties);
    }

    /**
     * Destroy resource by ID
     * @param id
     */
    function destroy(id) {
        return utils.call('DELETE', `/db/${resourceName}/${id}`);
    }

    return {
        list,
        find,
        create,
        update,
        destroy
    }
}

module.exports = FormideResource;