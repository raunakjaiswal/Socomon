const mysql = require("mysql");
var mysqlconnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "socomon@0987762845211",  //plz provide your mysql  password 
  database: "socomon2",
  multipleStatements: true,
});

mysqlconnection.connect((err) => {
  if (!err) {
    console.log("connection successful");
  } else {
    console.log("connection denied");
  }
});
module.exports = mysqlconnection;
