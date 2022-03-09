module.exports = [
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      header: "*",
      origin: ["http://localhost:3000", "https://tu-voto-web-jeac.vercel.app"],
    },
  },
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
