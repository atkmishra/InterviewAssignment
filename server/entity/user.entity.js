const sequelize = require("../db");
const {DataTypes}=require('sequelize');

const User = sequelize.define('user', {
    user_id:  {   
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
  username: DataTypes.STRING,
  email_id:{
    type:DataTypes.STRING,
    unique:true
  },
  password: DataTypes.STRING,
  error_count:DataTypes.INTEGER,
  isLocked: DataTypes.BOOLEAN
});

module.exports=User;