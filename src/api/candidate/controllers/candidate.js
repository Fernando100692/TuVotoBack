"use strict";

/**
 *  candidate controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::candidate.candidate",
  ({ strapi }) => ({
    async find() {
      const entries = await strapi.db
        .query("api::candidate.candidate")
        .findMany({
          select: ["*"],
          populate: true,
        });
      return entries;
    },

    async create(ctx) {
      {
        return await strapi.entityService.create("api::candidate.candidate", {
          // return await strapi.db.query("api::student.student").create({
          data: ctx.request.body,
          populate: ["campus", "student", "avatar"],
        });
      }
    },
  })
);
