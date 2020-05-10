const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cookie: false });
const fs = require('fs');
const mysql = require("mysql");
let passcode = "AskIT2020";
const usernameRegEx = /^[a-zA-Z]{5,15}$/;
const passwordRegEx = /^[a-zA-Z0-9]{8,15}$/;
let breakMode = "reservations";
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
      dateStrings: "date",
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
      connSocket.query(`SELECT * FROM users WHERE status IN ("break", "reserve", "requested") ORDER BY status ASC, UNIX_TIMESTAMP(statusTimestamp) ASC`, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("queue-delivery", { queue: result, mode: breakMode });
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
      socket.emit("update-user-config", { slots: allowedSlots, mode: breakMode, username: user, status: status })
      connSocket.query(sql, callback);
      connSocket.end();
    });
  }
  function breakIfAvailable(allowedSlots, user, timestamp, sendQueueToUser, changeStatus) {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      connSocket.query(`SELECT * FROM users WHERE status="break"`, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        if (res.length < allowedSlots) {
          changeStatus(user, sendQueueToUser, "break", timestamp);
        }
      });
      connSocket.end();
    });
  }
  function insertNewUser(loginDetails) {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      const sql = "INSERT INTO users (username, status, usersType) VALUES (?)";
      const values = [loginDetails.username, "idle", "user"];
      connSocket.query(sql, [values], (err, result) => {
        if (err) {
          console.log(err)
          return;
        } else {
          console.log(loginDetails.username + " registered correctly!");
          connSocket.end();
          socket.emit("verify", { type: true, message: "Seems like it you are new, we have created new space for you, log in again to confirm your username and prove you know the passcode." })
        }
      });
    });
  }
  function changeStatusOfAll(newStatus, oldStatus) {
    const connSocket = getDbConnectionSocket();
    connSocket.connect(err => {
      if (err) {
        return;
      }
      const sql = `UPDATE users SET status="${newStatus}" WHERE status="${oldStatus}"`;
      connSocket.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      connSocket.end();
    });
  }
  socket.emit("verify", { type: false, message: "" });
  socket.on("login-attempt", loginDetails => {
    if (!usernameRegEx.test(loginDetails.username) || !passwordRegEx.test(loginDetails.password) || loginDetails.password !== passcode) {
      socket.emit("verify", { type: true, message: "Username does not meet the criteria or wrong passcode, mate!" });
    } else {
      getUserDetails(loginDetails, (err, result) => {
        if (err) {
          return;
        }
        if (result.length < 1) {
          insertNewUser(loginDetails);

        } else {
          if (err) {
            console.log(err);
            return;
          }

          loggedInUsers.set(loginDetails.username, socket.id);
          socket.emit(`logged-m-${breakMode}`, { userData: result[0], slots: allowedSlots });
          sendQueueToUser();
          if (result[0].usersType === "adm") {
            socket.emit("logged-as-adm")
          }
        }
      })
    }
  });
  socket.on("reserve-break", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    getUserDetails({ username: user }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      if (res[0].status !== "reserve") {
        changeStatus(user, sendQueueToUser, "reserve", timestamp);
      }
    })
  });
  socket.on("request-break", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    getUserDetails({ username: user }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      if (res[0].status !== "requested") {
        changeStatus(user, sendQueueToUser, "requested", timestamp);
      }
    })
  });
  socket.on("take-break", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    getUserDetails({ username: user }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      if (res[0].status === "reserve") {
        breakIfAvailable(allowedSlots, user, timestamp, sendQueueToUser, changeStatus);
      }
    })
  });
  socket.on("cancel-status", (timestamp) => {
    const user = getUserWithSocket(socket.id);
    changeStatus(user, sendQueueToUser, "idle", timestamp);
  });
  socket.on("adm-change-m-req", () => {
    breakMode = "requests";
    io.emit("verify", { type: true, message: "Break Tool mode changed to requests. Log in to see the changes." });
    changeStatusOfAll("requested", "reserve");
  })
  socket.on("adm-change-m-res", () => {
    breakMode = "reservations";
    io.emit("verify", { type: true, message: "Break Tool mode changed to reservations. Log in to see the changes." });
    changeStatusOfAll("reserve", "requested");
  })
  socket.on("adm-change-slots", (slots) => {
    console.log(parseInt(slots));
    console.log(isNaN(parseInt(slots)))
    if (isNaN(parseInt(slots))) {
      socket.emit("inform-user", "Provided value seems to be incorrect. Re check and try again.");
    } else {
      allowedSlots = parseInt(slots);
      io.emit("verify", { type: true, message: "Max allowed breaks changed to: " + allowedSlots });
    }
  })
  socket.on("reject-break-request", data => {
    if (usernameRegEx.test(data[0]) && typeof loggedInUsers.get(data[0]) !== "undefined") {
      getUserDetails(data[0], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        if (res[0].status === "requested") {
          changeStatus(data[0], sendQueueToUser, "idle", data[1]);
          io.to(loggedInUsers.get(data[0])).emit("inform-user", "Your break request has been rejected. Your status has been changed to IDLE.");
        } else {
          socket.emit("inform-user", "Could not find such request")
        }
      })
    } else {
      socket.emit("inform-user", "User not found within logged in users or else username is incorrect.");
    }
  });
});
