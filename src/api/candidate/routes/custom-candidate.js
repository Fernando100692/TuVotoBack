module.exports = {
  routes: [
    {
      method: "POST",
      path: "/candidates/deleteMany",
      handler: "candidate.deleteMany",
    },
  ],
};
