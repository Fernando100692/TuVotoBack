module.exports = {
  routes: [
    {
      method: "POST",
      path: "/representative-histories/createMany",
      handler: "representative-history.createMany",
    },
    {
      method: "POST",
      path: "/representative-histories/updateAll",
      handler: "representative-history.updateAll",
    },
  ],
};
