"use strict";

/**
 *  student controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const bcrypt = require("bcryptjs");

module.exports = createCoreController("api::student.student", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const entity = await strapi.service("api::student.student").findOne({});
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async findByStudentCode(ctx) {
    const { student_code } = ctx.params;
    const entry = await strapi.db.query("api::student.student").findOne({
      select: ["*"],
      where: { student_code },
      populate: {
        candidate_vote: true,
        users_permissions_user: true,
        campus: true,
      },
    });
    return entry;
  },

  async findStudentByUserPermission(ctx) {
    const { id } = ctx.params;
    const entry = await strapi.db.query("api::student.student").findOne({
      select: ["*"],
      where: { users_permissions_user: id },
      populate: {
        candidate_vote: true,
        users_permissions_user: {
          select: [
            "id",
            "username",
            "email",
            "confirmed",
            "blocked",
            "first_time",
          ],
        },
        campus: true,
      },
    });
    return entry;
  },

  async findByUserCodePermission(ctx) {
    const { id } = ctx.params;

    // Get User based on id
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        select: [
          "id",
          "username",
          "email",
          "confirmed",
          "blocked",
          "first_time",
        ],
        where: { id },
        populate: {
          role: true,
        },
      });
    return entry;
  },

  async createMany(ctx) {
    {
      if (Array.isArray(ctx.request.body)) {
        return await strapi.db.query("api::student.student").createMany({
          data: ctx.request.body,
        });
      } else {
        return await strapi.db.query("api::student.student").createMany({
          data: [ctx.request.body],
        });
      }
    }
  },

  async createManyUsers(ctx) {
    {
      if (Array.isArray(ctx.request.body)) {
        // wait until all promises are resolved
        const body = ctx.request.body;

        return await Promise.all(
          body.map(async (itm) => {
            return await strapi
              .service("plugin::users-permissions.user")
              .add({ ...itm });
          })
        );
      } else {
        return await strapi
          .service("plugin::users-permissions.user")
          .add({ ...ctx.request.body });
      }
    }
  },
}));
