# break-tracker
Simple real time Break Tracker to maintain break queue in the workflow

# What is the purpose? 
My Service Desk required a tool that would handle the break queue and help with maintaing a workflow. I have decided to create this application in order to help my team. 

# How to run?
#### App is ready to be hosted on hosting service providing support for Node enviroment. 

Recommended, tested hosting service: [Heroku](https://dashboard.heroku.com/). 
Please see a guide on how to host a project on Heroku: [click here](https://devcenter.heroku.com/start)
# How to use? 

#### Description of the app


Sign in/up using new or currently registered username, confirm passcode set up on the server by administrator - get some fun using one of two available modes, requests or reservations. 

RESERVATIONS - let you to reserve a break, take a break if there is a free slot, cancel status any time.
REQUESTS - let you send a break request and once administrator accept it your status changes to BREAK.


# Admin features

1) Changing mode to RESERVATIONS / REQUESTS
2) Changing number of available slots
3) Rejecting break request / removing someone from the queue
4) Accepting break request / adding someone to break queue
5) Setting someone's account to Admin
6) Removing someone's account

# Stack

[JavaScript ES6+](https://www.ecma-international.org/default.htm), [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), [socket.io](https://socket.io/), [npm](https://www.npmjs.com/);

Database recommended (tested): ClearDB, MySQL server. 

Created with [git](https://git-scm.com/) workflow.
Author: Łukasz Dzierżawski

