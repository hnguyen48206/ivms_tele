const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./lite.db";

function createDbConnection() {
  if (fs.existsSync(filepath)) {
    console.log("Connection with Database has been established");
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        console.error(error.message)
        return null;
      }
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}


module.exports = createDbConnection();