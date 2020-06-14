var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs= require('ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extendend:true
}));

app.use("/css",express.static("./css"))
app.use("/js",express.static("./js"))
app.use("/images",express.static("./images"))

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running on port 4000');
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

// connection configurations
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});
// connect to database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
  });

//API Calls
//GET	/users	fetch all users
//GET   user/1	fetch user with id ==1
//POST	user	add new user
//PUT	    user	update user by id == 1
//DELETE	user	delete user by id == 1

// Retrieve all users 
app.get('/users', function (req, res) {
    con.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
       
        res.send({ error: false, data: results, message: 'users list.' });
        //console.log(results[1].id);
        //console.log(fields[0]);
    });
});

// Retrieve user with id 
app.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
     return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    con.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
     if (error) throw error;
      return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

// Add a new user  
app.post('/user', function (req, res) {
    let user = req.body.user;
    if (!user) {
      return res.status(400).send({ error:true, message: 'Please provide user' });
    }
   dbConn.query("INSERT INTO users SET ? ", { user: user }, function (error, results, fields) {
  if (error) throw error;
    return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//  Update user with id
app.put('/user', function (req, res) {
    let user_id = req.body.user_id;
    let user = req.body.user;
    if (!user_id || !user) {
      return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
     });
    });

    //  Delete user
 app.delete('/user', function (req, res) {
    let user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
    });


module.exports=app;
