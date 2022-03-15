"use strict";

/**
 *  campus controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::campus.campus", ({ strapi }) => ({
  async find() {
    const entries = await strapi.db.query("api::campus.campus").findMany({
      select: ["*"],
      populate: true,
    });
    return entries;
  },

  async update(ctx) {
    const { body } = ctx.request;
    const { id } = ctx.params;
    return strapi.query("api::campus.campus").update({
      where: { id },
      data: body,
      populate: true,
    });
  },
}));
