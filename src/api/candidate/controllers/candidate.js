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

    async update(ctx) {
      const { body } = ctx.request;
      const { id } = ctx.params;
      return strapi.query("api::candidate.candidate").update({
        where: { id },
        data: body,
        populate: true,
      });
    },

    async delete(ctx) {
      const { id } = ctx.params;
      return strapi.query("api::candidate.candidate").delete({
        select: ["*"],
        where: { id },
        populate: true,
      });
    },

    async deleteMany(ctx) {
      const { body } = ctx.request;

      await Promise.all(
        body.map(async (itm) => {
          return strapi.query("api::student.student").update({
            where: { id: itm.student.id },
            data: { isCandidate: false },
            populate: true,
          });
        })
      );

      return await Promise.all(
        body.map(async (itm) => {
          return strapi.query("api::candidate.candidate").delete({
            select: ["*"],
            where: { id: itm.id },
            populate: true,
          });
        })
      );
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
