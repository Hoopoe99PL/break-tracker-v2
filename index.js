const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{cookie: false});
const fs = require('fs');
const mysql = require("mysql");
const usernameRegEx = /^[a-zA-Z]{5,15}$/;
const passwordRegEx = /^[a-zA-Z0-9]{8,15}$/;

app.get("/", (req,res)=>{

    fs.readFile(__dirname + '/public/index.html',
  function (err, data) {

    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);

  });
});

app.use(express.static(__dirname + "/public"));

http.listen(3000, ()=>{

    console.log('Listening.');

});




io.on("connection", (socket)=>{
  function getDbConnectionSocket() {
    const dbCfg = {
      host: "eu-cdbr-west-03.cleardb.net",
      user: "b0113bbe0415f7",
      password: "123cac7b",
      database: "heroku_b239941e19f397d",
    };
    clientConn = mysql.createConnection(dbCfg);
    return clientConn;
}
function getUserDetails(loginDetails, callback){
  const connSocket = getDbConnectionSocket();
  connSocket.connect(err=>{
    if (err){
      return;
    }
    connSocket.query(`SELECT * FROM users WHERE username="${loginDetails.username}"`, callback);
    connSocket.end();
  });
}
  socket.emit("verify", {type: false, message: ""});
  socket.on("login-attempt", loginDetails=>{
    if(!usernameRegEx.test(loginDetails.username) || !passwordRegEx.test(loginDetails.password)){
      socket.emit("verify", {type: true, message: "Incorrect username or password"});
    }else{
      getUserDetails(loginDetails, (err, result)=>{
        if(err){
          return;
        }
        if(result.length < 1){
          socket.emit("verify", {type: true, message: "No such user."});
          return;
        }
      })
    }
  });

  socket.on("register-attempt", registerDetails=>{
    if(!usernameRegEx.test(registerDetails.username) || !passwordRegEx.test(registerDetails.password) || registerDetails.password !== registerDetails.passwordConfirmation){
      socket.emit("verify", {type: true, message: "Incorrect username or password"});
    }else{
      getUserDetails(registerDetails, (err, result)=>{
        if(err){
          return;
        }
        if(result.length > 0){
          socket.emit("verify", {type: true, message: "Username taken"});
        }else{
          const connSocket = getDbConnectionSocket();
          connSocket.connect(err=>{
            if (err){
              return;
            }
            const sql="INSERT INTO users (username, password, status) VALUES (?)";
            const values = [registerDetails.username,registerDetails.password, "idle"];
            connSocket.query(sql, [values], (err, result)=>{
              if(err){
                console.log(err)
              }
              console.log(registerDetails.username + " registered correctly!");
            });
            connSocket.end();
          });
        }
      })
    }
  });
});
