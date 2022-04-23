const sequelize = require('../db');
const User = require('../entity/user.entity');

async function createUser(username, email, password)
{
    const newUser = User.build({ username: username, email_id:email, password:password, error_count:0, isLocked:false });
    newUser.save();
}

async function updateUser(userId, password)
{
    var user =await User.findByPk(userId);
    user.password=password;
    user.save();
}

async function deleteUser(userId)
{
    var user =await User.findByPk(userId);
    user.destroy();
}

async function getUser(userId)
{
    var user=await User.findByPk(userId);
    return user;
}

async function getAllUsers()
{   
    // var arr=[];
    var list=await User.findAll();
    console.log(list);
    return list;
};

async function verifyUser(email, password)
{
    var user = await User.findOne({where:{
        email_id:email,
        password:password
    }});
    console.log(user);
    if(!user)
    {
        var user = await User.findOne({where:{
            email_id:email
        }});
        user.error_count=user.error_count+1;
        user.save();
    }
    return user;
}

async function getLockedUsers()
{
    var user = await User.findAll({where:{
        isLocked:true
    }});
    console.log(user);
    return user;
}

async function checkForLockedUser(userId)
{
    let user =await User.findByPk(userId);
    if(!user.isLocked && user.error_count===3)
    {
        const existingUser = User.build({ user_id:userId,isLocked:true });
        existingUser.update();
    }
}
async function unlockUser(userId)
{
    let user =await User.findByPk(userId);
    user.isLocked=false;
    user.error_count=0;
}


module.exports={createUser,checkForLockedUser,deleteUser,updateUser,getUser,verifyUser,getAllUsers,getLockedUsers,unlockUser};