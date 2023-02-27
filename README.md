# COMMON INTEREST

## Tools versions
<h4>NodeJS: v18.12.1</h3>
<h4>NPM: v8.19.2</h3>
  
## Launch

Those command lines allow the prototype of the application to run on a computer (port 3000) and connected to a local server (port 4000)
  
* If not already cloned:
```
$ git clone git@github.com:polito-hci-2022/Common-Interest.git
$ cd common-interest
$ npm install
$ npm run start-demo
```

* If already cloned:
```
$ git pull
$ cd common-interest
$ npm install
$ npm run start-demo
```

## Switch connection to deployed server

This action is usefull in order to let people connect the prototype using ngrok (next paragraph). If the user connect by ngrok link but the server is still on local computer, the data from the server will not be fetched by the ngrok connected remote device.

* To switch from local server to deployed server: (from Common-Interest/common-interest/ folder)
```
$ npm run connect-deployed-demo
```

* To switch from deployed server to local server: (from Common-Interest/common-interest/ folder)
```
$ npm run connect-local-demo
```

After each of those switch you can run the application by the commande line:
```
$ npm run start-demo
```

## Remote demo with ngrok

On the local computer from which you will launch the pipe:
* Switch to deployed server 
```
$ npm run connect-deployed-demo:
```
* Launch the prototype on a first terminal:
```
$ npm run start-demo
```
* Launch ngrok on an other terminal:
```
$ngrok http 3000
```

On the termial you will see a line untitled "Forwarding". The link written is the http address for your localhost pipeline. The remote user can follow this link to see the prototype from everywhere.