const path = require("path");

module.exports = ({ env }) => ({
  connection: {
    client: "sqlite",
    pool: {
      acquireTimeoutMillis: env.int(
        "DATABASE_POOL_ACQUIRE_TIMEOUT_MILLIS",
        600000
      ),
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
