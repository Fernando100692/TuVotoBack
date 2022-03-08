const path = require("path");

module.exports = ({ env }) => ({
  connection: {
    client: "sqlite",
    pool: {
      min: 0,
      max: 97,
      idleTimeoutMillis: 30000000,
      createTimeoutMillis: 30000000,
      acquireTimeoutMillis: 30000000,
      propagateCreateError: false,
    },
    connection: {
      filename: path.join(
        __dirname,
        "..",
        env("DATABASE_FILENAME", ".tmp/data.db")
      ),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    useNullAsDefault: true,
  },
});
