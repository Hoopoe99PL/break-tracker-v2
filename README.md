# break-tracker
Simple real time Break Tracker to maintain break queue in the workflow

# What is the purpose? 
My Service Desk required a tool that would handle the break queue and help with maintaing a workflow. I have decided to create this application in order to help my team. 

# How to run?
#### In case you are only a client please go to Step 3 and instead of 'localhost' provide an IP Address / DNS name of the server the app is running on. If you are not sure about the address please ask the administrator.
### Step 1
In order to run the application you require [Node](https://nodejs.org/en/) to be installed on your machine. by installing node you also install [npm](https://www.npmjs.com/) which is package manager making possible to download all required packages. 
### Step 2
After node is installed and added to path please open command prompt or PowerShell, navigate to the location you are storing the project and use
```
npm install
node index.js
```
in order to  install required packages run the local HTTP server. 

### Step 3
Open your web browser and navigate to localhost:3000. 

You are all done. The application is now running in your browser. 

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
