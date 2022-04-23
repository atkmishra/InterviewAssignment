const { Sequelize, Model, DataTypes } =require('sequelize');
const fs = require('fs');
const mysql = require('mysql2');

// let sequelize;
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port:3306,
    password: "admin"
  });

    //   console.log(connection);
    connection.query('CREATE DATABASE IF NOT EXISTS loginapp', function(err,result,fields){
        console.log(result); 
    });
  

  const sequelize = new Sequelize('loginapp', 'root', 'admin', {
    host: 'localhost',
    dialect:'mysql',
    port:3306,
    logging:console.log
});
 


module.exports=sequelize;

