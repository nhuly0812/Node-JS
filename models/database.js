const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs_lab3",
  });
db.connect(()=> console.log('Đã kết nối database!'));
module.exports = db;  