import sqlite3 from "sqlite3";

export const dbSetup = async () => {
  const db = await new Promise((resolve, reject) => {
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

const runPromisifyDB = (db, query, params?) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err, result) => {
      if (err) {
        console.error("Error running query: " + err.message);
        reject(err);
      } else {
        console.log("Query executed successfully.");
        resolve(result);
      }
    });
  });
};

const fetchAll = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
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