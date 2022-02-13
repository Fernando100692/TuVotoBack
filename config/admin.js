module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ad60429c225d10d1076fa520e5cb37c6'),
  },
});
