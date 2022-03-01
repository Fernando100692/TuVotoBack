"use strict";

/**
 *  election-status controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::election-status.election-status",
  ({ strapi }) => ({
    async find() {
      const entries = await strapi.db
        .query("api::election-status.election-status")
        .findMany({
          select: ["*"],
          populate: true,
        });
      return entries;
    },
  })
);
