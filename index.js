const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{cookie: false});
const fs = require('fs');
const Users = new Map();

app.get("/", (req,res)=>{

    fs.readFile(__dirname + '/src/index.html',
  function (err, data) {

    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);

  });
});

app.use(express.static(__dirname + "/src"));

http.listen(process.env.PORT, ()=>{

    console.log('Listening.');

});


io.on("connection", (socket)=>{


});
