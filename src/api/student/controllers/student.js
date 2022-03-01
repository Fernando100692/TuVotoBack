"use strict";

/**
 *  student controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const bcrypt = require("bcryptjs");

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

const isHashed = (password) => {
  if (typeof password !== "string" || !password) {
    return false;
  }

  return password.split("$").length === 4;
};

const hashPassword = (user = {}) => {
  return new Promise((resolve, reject) => {
    if (!user.password || isHashed(user.password)) {
      resolve(null);
    } else {
      bcrypt.hash(`${user.password}`, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    }
  });
};

module.exports = createCoreController("api::student.student", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const entity = await strapi.service("api::student.student").findOne({});
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async find() {
    const entries = await strapi.db.query("api::student.student").findMany({
      select: ["*"],
      populate: true,
    });
    return entries;
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
        // wait until all promises are resolved
        const body = ctx.request.body;

        return await Promise.all(
          body.map(async (itm) => {
            return await strapi.entityService.create("api::student.student", {
              data: itm,
              populate: ["users_permissions_user", "campus", "candidate_vote"],
            });
          })
        );
      } else {
        return await strapi.entityService.create("api::student.student", {
          // return await strapi.db.query("api::student.student").create({
          data: ctx.request.body,
          populate: ["users_permissions_user", "campus", "candidate_vote"],
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

  async deleteAll() {
    {
      const allUsersStudent = await strapi.db
        .query("plugin::users-permissions.user")
        .findMany({
          select: ["*"],
          where: { role: 3 },
          populate: true,
        });

      // Delete All Students
      await strapi.db.query("api::student.student").deleteMany();

      //Delete All Users
      await Promise.all(
        allUsersStudent.map((itm) =>
          strapi
            .query("plugin::users-permissions.user")
            .delete({ where: { id: itm.id } })
        )
      );

      //Delete All Candidates
      return await strapi.db.query("api::candidate.candidate").deleteMany();
    }
  },

  changePassword: async (ctx) => {
    // const params = JSON.parse(ctx.request.body);
    const params = ctx.request.body;

    // The identifier is required.
    if (!params.identifier) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.provide",
          message: "Please provide your username or your e-mail.",
        })
      );
    }

    // The password is required.
    if (!params.password) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your password.",
        })
      );
    }

    // The new password is required.
    if (!params.newPassword) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your new password.",
        })
      );
    }

    // The new password confirmation is required.
    if (!params.confirmPassword) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your new password confirmation.",
        })
      );
    }

    if (
      params.newPassword &&
      params.confirmPassword &&
      params.newPassword !== params.confirmPassword
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.matching",
          message: "New Passwords do not match.",
        })
      );
    } else if (
      params.newPassword &&
      params.confirmPassword &&
      params.newPassword === params.confirmPassword
    ) {
      // Get User based on identifier
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: params.identifier },
        });

      // Validate given password against user query result password
      const validPassword = user
        ? await strapi
            .service("plugin::users-permissions.user")
            .validatePassword(params.password, user.password)
        : false;

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid.",
          })
        );
      } else {
        // Generate new hash password
        const password = await hashPassword({
          password: params.newPassword,
        });

        // Update user password
        await strapi.service("plugin::users-permissions.user").edit(user.id, {
          resetPasswordToken: null,
          password: params.newPassword,
        });

        // Return new jwt token
        return {
          jwt: strapi.service("plugin::users-permissions.jwt").issue({
            id: user.id,
          }),
          user: user.toJSON ? user.toJSON() : user,
        };
      }
    }
  },

  // ======================= PASSWORD FEATURES ==========================

  adminChangePassword: async (ctx) => {
    // const params = JSON.parse(ctx.request.body);
    const params = ctx.request.body;

    // The identifier is required.
    if (!params.identifier) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.provide",
          message: "Please provide your username or your e-mail.",
        })
      );
    }

    // The new password is required.
    if (!params.newPassword) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your new password.",
        })
      );
    }

    // The new password confirmation is required.
    if (!params.confirmPassword) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your new password confirmation.",
        })
      );
    }

    if (
      params.newPassword &&
      params.confirmPassword &&
      params.newPassword !== params.confirmPassword
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.matching",
          message: "New Passwords do not match.",
        })
      );
    } else if (
      params.newPassword &&
      params.confirmPassword &&
      params.newPassword === params.confirmPassword
    ) {
      // Get User based on identifier
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: params.identifier },
        });

      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier invalid.",
          })
        );
      } else {
        // Update user password
        await strapi.service("plugin::users-permissions.user").edit(user.id, {
          resetPasswordToken: null,
          password: params.newPassword,
        });
        // Return new jwt token
        return {
          jwt: strapi.service("plugin::users-permissions.jwt").issue({
            id: user.id,
          }),
          user: user.toJSON ? user.toJSON() : user,
        };
      }
    }
  },
}));
