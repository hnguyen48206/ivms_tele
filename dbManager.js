const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./lite.db";

function createDbConnection() {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}


module.exports = createDbConnection();