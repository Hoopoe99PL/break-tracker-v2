const ConfigPanel = require("./Classes/ConfigPanel.js");
const IOController = require("socket.io-client");
const ListItem = require("./Classes/ListItem.js");
const Queue = require("./Classes/Queue");

const socket = IOController.connect('https://askit-break-scheduler.herokuapp.com/');

