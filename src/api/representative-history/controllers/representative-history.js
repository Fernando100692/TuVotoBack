"use strict";

/**
 *  representative-history controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::representative-history.representative-history",
  ({ strapi }) => ({
    async find() {
      const entries = await strapi.db
        .query("api::representative-history.representative-history")
        .findMany({
          select: ["*"],
          populate: true,
        });
      return entries;
    },

    async update(ctx) {
      const { body } = ctx.request;
      const { id } = ctx.params;
      return strapi
        .query("api::representative-history.representative-history")
        .update({
          where: { id },
          data: body,
          populate: true,
        });
    },

    async updateAll() {
      const entries = await strapi.db
        .query("api::representative-history.representative-history")
        .findMany({
          select: ["*"],
          where: { isActive: true },
          populate: true,
        });

      if (entries.length > 0) {
        return await Promise.all(
          entries.map(async (itm) => {
            return strapi
              .query("api::representative-history.representative-history")
              .update({
                where: { id: itm.id },
                data: { isActive: false },
                populate: true,
              });
          })
        );
      } else {
        return entries;
      }
    },

    async createMany(ctx) {
      {
        if (Array.isArray(ctx.request.body)) {
          // wait until all promises are resolved
          const body = ctx.request.body;

          return await Promise.all(
            body.map(async (itm) => {
              return await strapi.entityService.create(
                "api::representative-history.representative-history",
                {
                  data: itm,
                  populate: ["campusRelation", "studentRelation "],
                }
              );
            })
          );
        } else {
          return await strapi.entityService.create(
            "api::representative-history.representative-history",
            {
              // return await strapi.db.query("api::student.student").create({
              data: ctx.request.body,
              populate: ["campusRelation", "studentRelation "],
            }
          );
        }
      }
    },
  })
);
