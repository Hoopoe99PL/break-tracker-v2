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
Application is a break tracker refreshing in real time. First you need to provide your username which can only be made of letters in range a-zA-z. After you authenticate yourself you will be able to see your username and number of available slots for break in the queue.
##### Buttons

Reserve - lets you reserve a break in the queue, your status gets changed to "RESERVE" and everyone can see that you are waiting for a break. You cannot reserve a break while being in a BREAK status.

Break - your status gets changed to break if you are able to take one. There needs to be a free slot and you need to be in a position to take a break (no people in RESERVE status being there longer than you). 

Cancel - lets you cancel current status. You get removed from the queue no matter what status you are in. 

# Admin features

##### If you only know the admin password set in the code by any other Admin you can press C while being connected to breaktool and use one of two available commands:

/slots - this command lets you set the new break slots limit. You need to provide a command /slot, then you will be prompted for a flag which needs to be an Integer. 

/kick - this command lets you delete anyone from the queue no matter the status. You need to provide a command /kick, then you will be prompted for a flag which needs to be a Username of the person you want to delete from the queue. 

# Stack

[JavaScript ES6+](https://www.ecma-international.org/default.htm), [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), [socket.io](https://socket.io/), [npm](https://www.npmjs.com/);

Created with [git](https://git-scm.com/) workflow.
Author: Łukasz Dzierżawski
