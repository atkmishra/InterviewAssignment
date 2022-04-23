const express = require('express');
const sequelize=require("./server/db");
const User = require("./server/entity/user.entity");
const UserUtil = require("./server/util/UserUtil");
const LoginUtil = require("./server/security/LoginUtil");
var cron = require('node-cron');
var bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

let secret = generateRandomUUID();
app.use(session({
    genid:generateRandomUUID,
    secret:secret,
       // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true,
    cookie:{
        maxAge: 1800000
    }
}));
 
function generateRandomUUID()
{
    return crypto.randomUUID({disableEntropyCache : true});
}

cron.schedule('*/10 * * * *', () => {
//   console.log('running a task every hour');
  //fetch and check eatch user on when it was locked
  //if its been more than 24 hours, update to unlock the user
  var users = UserUtil.getLockedUsers();
  var now = Date.now();
    users.forEach((user)=>{
        if(Date.parse(user.updatedAt) + (86400*1000) < Date.now())
        {
            UserUtil.unlockUser(user.userId);
        }
    });
});
const port = 5000; 

sequelize.sync().then((result)=>{
    console.log(result)
});

app.get('/', (req, res) => {  
    res.sendFile('index.html', {root: __dirname}); 
});

app.all('/**',(req,res,next)=>{

    console.log(req.session);
    if(req.session.isAuthenticated || req.url.endsWith('/register/user')||req.url.endsWith('/login')||req.url.endsWith('/')||req.url.indexOf('.')>0)
    {
        next.apply(req,res,next);
    }
    else{
        res.redirect('/');
    }
});
app.post('/login', (req, res) => { 
    console.log(req.body); 
    if(!req.body.email || !req.body.password)
    {
        res.status(500).send({"error":"please provide values"});
        res.end();
        return;
    }
    var user = LoginUtil.checkUser(req.body.email, req.body.password)
    // .then(()=>{
    if(!user || user.error)
    {
        console.log(user.error);
        // res.status(401).send(JSON.stringify(user.error));
        res.redirect('/',401).send(JSON.stringify(user.error));
        res.end();
    }
    else{
        console.log(user);
        req.session.isAuthenticated= true;
        user.password="****"
        res.status(200).cookie( ).send(user);
        res.end();
    }
// },
// (err)=>{res.status(500).send(err);
//     res.end();});

    // res.send({status});
    // res.redirect('/list');
    
});
app.get('/users/list', (req, res) => { 
    console.log(req); 
    let response = UserUtil.getAllUsers();
    response.then((result)=>{res.status(200).send(JSON.stringify(result));
        res.end();},(err)=>{console.log(err);res.end();});
});

app.post('/user/create',(req,res)=>{
    var body = req.body;
    UserUtil.createUser(body.username,body.email, body.password).then(
        (result)=>{console.log(result);
            res.status(200).write("{msg:\"User successfully created\"}");
            res.end();
        },
        (err)=>{
            console.log(err);
            res.status(500).write("{error:unable to process user create.}");
            res.end();
        }
        );
});

app.get('/users/:userId',(req,res)=>{
    let response = UserUtil.getUser(req.params.userId);
    response.then((result)=>{res.status(200).send(JSON.stringify(result));
        res.end();},(err)=>{console.log(err);res.end();});
    
});

app.post('/delete/:userId',(req,res)=>{
    console.log(req+" "+req.params);
    UserUtil.deleteUser(req.params.userId).then(
        (result)=>{console.log(result);
            res.status(200).write("{msg:\"User successfully deleted\"}");
            res.end();
        },
        (err)=>{
            console.log(err);
            res.status(500).write("{error:unable to process user delete.}");
            res.end();
        }
        );
});

app.post('/update/:userId',(req,res)=>{
    var body = req.body;
    var param = req.params;
    UserUtil.updateUser(param.userId, body.password).then(
        (result)=>{console.log(result);
            res.status(200).write("{msg:\"User successfully updated\"}");
            res.end();
        },
        (err)=>{
            console.log(err);
            res.status(500).write("{error:unable to process user update.}");
            res.end();
        }
        );
});

app.post('/register/user',(req,res)=>{
    var body = req.body;
    console.log(body);
    UserUtil.createUser(body.username,body.email_id, body.password).then(
        (result)=>{console.log(result);
            res.status(200).write("{msg:\"User successfully created\"}");
            res.end();
        },
        (err)=>{
            console.log(err);
            res.status(500).write("{error:unable to process user create.}");
            res.end();
        }
        );
});

app.get('**/*\.*', (req, res) => {      
    let index=req.url.indexOf('/');
    let fileName = req.url.substring(index);
   res.sendFile("./"+fileName, {root: __dirname});
});

app.listen(port, () => { 
    console.log(`Now listening on port ${port}`); 
});