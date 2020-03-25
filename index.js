const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const users = new Map();
let queue = [];
let allowedSlots = 2;
const currentBreaks = new Map();
const timestamps = new Map();
let ADMToken = 'ADMToken';

app.get("/", (req,res)=>{
    res.sendFile(__dirname + '/src/index.html');
});

app.use(express.static(__dirname + "/src"));
// functions

function getCurrTimeStamp(){
    const currDate = new Date();
    return currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
};

function getQueIndex(id){
    let index = queue.findIndex(e=>{
        return e === id;
    });
    return index;
};
function cancelUserStatus(id){
    let index = getQueIndex(id);
    if (index > -1){
        queue.splice(index, 1)
        io.emit('del-user-f-q', queue);
    }
    timestamps.delete(id);
    if(Array.from(timestamps).length > 0){
        io.emit('u-status-timestamp', Array.from(timestamps));
     };
     if(typeof currentBreaks.get(id)!=='undefined'){
         currentBreaks.delete(id);
     }
     io.emit('update-breaks', Array.from(currentBreaks.values()));
};
function reserveBreak(id){
    const checker = currentBreaks.get(id);
    if (typeof checker === 'undefined'){
        queue.push(id);
        timestamps.set(id, getCurrTimeStamp());
        io.emit('add-user-queue', queue);
        io.emit('u-status-timestamp', Array.from(timestamps));
    };
};
function takeBreak(id){
        const checker = currentBreaks.get(id);
        if (typeof checker === 'undefined'){
            timestamps.set(id, getCurrTimeStamp());
            currentBreaks.set(id,getQueIndex(id));
            io.emit('update-breaks', Array.from(currentBreaks.values()));
            io.emit('u-status-timestamp', Array.from(timestamps));
        };
};


//io
io.on("connection", (socket)=>{
// ADM FUNCTION needs to be here to access socket details
function ADMAssertAndExecute(queryDetails){
    const command = queryDetails[0];
    const flags = queryDetails[1];
    if(command === '/slots'){
        if(!isNaN(parseInt(flags))){
            allowedSlots = parseInt(flags);
            io.emit('slot-ui-update', allowedSlots);
        }else{
            socket.emit('adm-entry-not-recognized', queryDetails);
        }
    }else if(command === '/kick'){
        queue.forEach(e=>{
            if (users.get(e) === flags){
                cancelUserStatus(e);
            }
        });
    }else{
        socket.emit('adm-entry-not-recognized', queryDetails);
    }
};
// --------------------------------------------------------------


    console.log(`New user connected under socket ID: ${socket.id}, timestamp below:`);
    console.log(socket.handshake.time);
    socket.on("auth-user", (username)=>{
        const validatorArr = Array.from(users.values());
        const validatorArrChecker = validatorArr.filter(e=>{
            return e.toLowerCase() === username.toLowerCase();
        });
        const regex = /^[a-zA-Z]+$/;
        if (validatorArrChecker.length >=1 || !regex.test(username)){
            socket.emit('name-taken-auth-again', username);
        }else{
            console.log(`${socket.id} authenticated as ${username}`);
            users.set(socket.id, username);
            io.emit('u-users-list', Array.from(users));
            socket.emit('set-user-controller', {queue: queue, allowedSlots: allowedSlots, name: username, id: socket.id});
            if(Array.from(timestamps).length > 0){
            socket.emit('u-status-timestamp', Array.from(timestamps));
            };
            socket.emit('update-breaks', Array.from(currentBreaks.values()));
        }

    });
    socket.on('u-res-break', ()=>{
        const index = getQueIndex(socket.id);
        if (index === -1){
            reserveBreak(socket.id);
        };
    });
    socket.on('disconnect', ()=>{
        cancelUserStatus(socket.id);
        users.delete(socket.id);
        io.emit('u-users-list', Array.from(users));
    });
    socket.on('cancel-user-status', ()=>{
        cancelUserStatus(socket.id);
    });
    socket.on('u-takes-break', ()=>{
        const index = getQueIndex(socket.id);
        if (index < allowedSlots && index > -1){
            takeBreak(socket.id);
        }
    });
    socket.on('adm-auth-attempt',admPass => {
        if(admPass === ADMToken){
            socket.emit('adm-authenticated');
        };
    });
    socket.on('adm-query', ADMQuery => {
        ADMAssertAndExecute(ADMQuery);
    });
});
const server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


http.listen(server_port, server_ip_address, ()=>{
    console.log('Listening on '+server_ip_address +'. Server up and running on '+server_port);
});
