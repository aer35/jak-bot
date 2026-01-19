import sqlite3 from "sqlite3";

export const dbSetup = async () => {
  const db: sqlite3.Database = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database("database.db", (err) => {
      if (err) {
        console.error("Error opening database " + err.message);
        reject(err);
      } else {
        console.log("Connected to the database.");
        resolve(database);
      }
    });
  });

  console.log("Creating posts table if it does not exist...");
  await runPromisifyDB(
    db,
    `CREATE TABLE IF NOT EXISTS posts
     (
         ID         TEXT UNIQUE PRIMARY KEY,
         link       TEXT,
         user       TEXT,
         title      TEXT,
         score      INTEGER,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )`,
  );
  console.log("Accessed posts table.");
  return db;
};

// db is always going to be a Database instance
// query is always going to be a string or string template
// params, where used, are an array of varying objects
const runPromisifyDB = (
  db: sqlite3.Database,
  query: string,
  params?: any[],
) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err: { message: string }, result: any) => {
      if (err) {
        console.error(`Error running query: ${err.message}`);
        reject(err);
      } else {
        console.log(`Query (${query}) executed successfully.`);
        resolve(result);
      }
    });
  });
};

const fetchAll = (db: sqlite3.Database, query: string) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err: { message: string }, rows: any) => {
      if (err) {
        console.error("Error fetching data: " + err.message);
        reject(err);
      } else {
        console.log("Data fetched successfully.");
        resolve(rows);
      }
    });
  });
};

export { runPromisifyDB, fetchAll };
