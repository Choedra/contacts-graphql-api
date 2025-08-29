// drizzle.config.js
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "ballast.proxy.rlwy.net",
    port: 37095,
    database: "railway",
    user: "postgres",
    password: "FtaZLnMBdbvmLYwExUTDJlIRfPBFXnFG",
  },
};
