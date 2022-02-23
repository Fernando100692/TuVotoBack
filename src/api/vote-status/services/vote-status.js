'use strict';

/**
 * vote-status service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vote-status.vote-status');
