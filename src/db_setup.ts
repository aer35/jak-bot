import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the database.");
  }
});
const dbSetup = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS posts
         (
             ID         TEXT UNIQUE PRIMARY KEY,
             link       TEXT,
             user       TEXT,
             title      TEXT,
             score      INTEGER,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )`,
    (err) => {
      if (err) {
        console.error("Error creating table: " + err.message);
      } else {
        console.log("Posts table is ready.");
      }
    },
  );
};

export { db };
