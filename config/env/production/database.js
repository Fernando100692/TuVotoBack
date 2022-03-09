const parse = require("pg-connection-string").parse;
const config = parse(process.env.DATABASE_URL);
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    /* pool: {
      min: 0,
      max: 97,
      idleTimeoutMillis: 30000000,
      createTimeoutMillis: 30000000,
      acquireTimeoutMillis: 30000000,
      propagateCreateError: false,
    }, */
    acquireConnectionTimeout: 50000,
    pool: {
      min: 0,
      max: 10,
      createTimeoutMillis: 80000,
      acquireTimeoutMillis: 80000,
      idleTimeoutMillis: 80000,
      reapIntervalMillis: 10000,
      createRetryIntervalMillis: 100,
    },
    connection: {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false), // For self-signed certificates
      },
    },
    debug: false,
  },
});
