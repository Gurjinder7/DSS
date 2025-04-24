import pkg from "pg";
import { config } from "../../config/index.js";

console.log(config);

const { Client } = pkg;
const DB_NAME = config.db.database;

const user = config.db.user;
const host = config.db.host;
const password = config.db.password;
const port = config.db.port;

const connectionStringPre = `postgres://${user}:${password}@${host}:${port}`;

const firstTimeClient = new Client({
  connectionString: connectionStringPre,
});

export const up = async () => {
  try {
    await firstTimeClient.connect();

    const res = await firstTimeClient.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      console.log(`${DB_NAME} database not found, creating it.`);
      await firstTimeClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Created database ${DB_NAME}`);
    } else {
      console.log(`${DB_NAME} database already exists.`);
    }
  } catch (error) {
    console.error("Error in database creation migration:", error);
    throw error;
  } finally {
    await firstTimeClient.end();
  }
};
