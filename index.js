const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cookie: false });
const fs = require('fs');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const usernameRegEx = /^[a-zA-Z]{5,15}$/;
const passwordRegEx = /^[a-zA-Z0-9]{8,15}$/;
const breakMode = "reservations";
let allowedSlots = 2;
const loggedInUsers = new Map();

app.get("/", (req, res) => {

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

http.listen(3000, () => {

  console.log('Listening.');

});




io.on("connection", (socket) => {
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
  function getUserDetails(loginDetails, callback) {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      connSocket.query(`SELECT * FROM users WHERE username="${loginDetails.username}"`, callback);
      connSocket.end();
    });
  }
  function sendQueueToUser() {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      connSocket.query(`SELECT * FROM users WHERE status IN ("break", "reserve", "requested") ORDER BY UNIX_TIMESTAMP(statusTimestamp) ASC, status DESC`, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        socket.emit("queue-delivery", result);
      });
      connSocket.end();
    });
  };
  function getUserWithSocket(id) {
    const users = Array.from(loggedInUsers.entries());
    let username;
    users.forEach(e => {
      if (e[1] === id) {
        username = e[0];
      }
    });
    return username;
  }
  function changeStatus(user, callback, status, timestamp) {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      const sql = `UPDATE users SET status="${status}", statusTimestamp="${timestamp}" WHERE username="${user}"`;
      connSocket.query(sql, callback);
      connSocket.end();
    });
  }
  socket.emit("verify", { type: false, message: "" });
  socket.on("login-attempt", loginDetails => {
    if (!usernameRegEx.test(loginDetails.username) || !passwordRegEx.test(loginDetails.password)) {
      socket.emit("verify", { type: true, message: "Incorrect username or password" });
    } else {
      getUserDetails(loginDetails, (err, result) => {
        if (err) {
          return;
        }
        if (result.length < 1) {
          socket.emit("verify", { type: true, message: "No such user." });
          return;
        }

        bcrypt.compare(loginDetails.password, result[0].password, function (err, boolean) {
          if (err) {
            console.log(err);
            return;
          }
          if (boolean) {
            loggedInUsers.set(loginDetails.username, socket.id);
            socket.emit(`logged-as-${result[0].usersType}-m-${breakMode}`, { userData: result[0], slots: allowedSlots });
            sendQueueToUser();

          } else {
            socket.emit("verify", { type: true, message: "Incorrect username or password" });
          }
        });
      })
    }
  });

  socket.on("register-attempt", registerDetails => {
    if (!usernameRegEx.test(registerDetails.username) || !passwordRegEx.test(registerDetails.password) || registerDetails.password !== registerDetails.passwordConfirmation) {
      socket.emit("verify", { type: true, message: "Incorrect username or password" });
    } else {
      getUserDetails(registerDetails, (err, result) => {
        if (err) {
          return;
        }
        if (result.length > 0) {
          socket.emit("verify", { type: true, message: "Username taken" });
        } else {
          const connSocket = getDbConnectionSocket();
          connSocket.connect(err => {
            if (err) {
              return;
            }
            const sql = "INSERT INTO users (username, password, status, usersType) VALUES (?)";
            const passwordPlain = registerDetails.password;
            bcrypt.hash(passwordPlain, 10).then(function (hash) {
              const values = [registerDetails.username, hash, "idle", "user"];
              connSocket.query(sql, [values], (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log(registerDetails.username + " registered correctly!");
                  socket.emit("registered");
                  connSocket.end();
                }
              });
            });
          });
        }
      })
    }
  });
  socket.on("reserve-break", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    changeStatus(user, sendQueueToUser, "reserve", timestamp);
  });
  socket.on("take-break", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    changeStatus(user, sendQueueToUser, "break", timestamp);
  });
  socket.on("cancel-status", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    changeStatus(user, sendQueueToUser, "idle", timestamp);
  });
});
