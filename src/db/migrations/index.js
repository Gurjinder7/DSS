import * as createDatabase from "./001_create_database.js";
import * as createTables from "./002_create_tables.js";

const migrations = [createDatabase, createTables];

export const migrate = async () => {
  console.log("Starting migrations...");

  for (const migration of migrations) {
    try {
      await migration.up();
    } catch (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }
  }

  console.log("All migrations completed successfully!");
};

migrate();
