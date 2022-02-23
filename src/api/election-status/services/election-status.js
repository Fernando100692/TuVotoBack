'use strict';

/**
 * election-status service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::election-status.election-status');
