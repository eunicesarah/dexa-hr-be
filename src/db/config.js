const db = require('mysql2');
require('dotenv').config();  

const connection = db.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

function getConnection() {
  return new Promise((resolve, reject) => {
    connection.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
}

module.exports = {connection, getConnection};