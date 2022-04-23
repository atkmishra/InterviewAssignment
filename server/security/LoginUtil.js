const sequelize = require('../db');
const User = require("../entity/user.entity");
const UserUtil = require('../util/UserUtil');


async function checkUser(email, password)
{
    let user = await UserUtil.verifyUser(email,password);
    if(user)
    {
        if(user.isLocked)
        {
            return {error:"Your account has been locked, please wait for 24 hours"};
        }
        return user;
    }
    else if(!user){
        return {error:"No such user exists"};
    }
}

module.exports={checkUser};