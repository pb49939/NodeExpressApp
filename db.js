const Joi = require('joi'); //Joi is a class and for JS we use capital first letters for every class 

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});