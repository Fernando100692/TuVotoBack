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

    async update(ctx) {
      const { body } = ctx.request;
      const { id } = ctx.params;
      return strapi.query("api::election-status.election-status").update({
        where: { id },
        data: body,
        populate: true,
      });
    },
  })
);
