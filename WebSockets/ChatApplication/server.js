//Build first a normal server.
import http from "node:http";
import fs from 'node:fs/promises'; //To read the html file, we have fs module.
import path from 'path';
import { WebSocketServer } from "ws";
import { redisPublish, redisSubscribe } from "./connection";

const PORT = process.env.PORT ?? 9000;
const REDIS_CHANNEL = 'ws-messages';
const httpServer = http.createServer(async function (req,res){
    const indexFile = await fs.readFile(path.resolve('./index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.end(indexFile);
});
const wsServer = new WebSocketServer({server: httpServer}); //http request is upgraded to webSocket request.

//handler functions:
wsServer.on('connection', (websocket)=>{
    console.log('WebSocket Connection.....');
    //This is working well before scaling. Perfect for 800-1000 users.
    websocket.on('message', (data)=>{    // Here "data" send by our frontend is recieved and used by our server 
        console.log('Websocket Message Recieved', data.toString());// frontend se message mila aur maine print kiya.
        
        //This would send the the message to the client that has send the message. It would not broadcast the message.
       // websocket.send(data.toString()); // Whatever data a server recieved from index.html input field, it send it back as it is.
        
        //To send message to all the clients(broadcasting), I would use wsServer:
        wsServer.clients.forEach((client)=>{
            client.send(data.toString()); 
        })
    });
    //Horizontal scaling the things:
    //Use this to Relay the message to REDIS(broker). 
   websocket.on('message', async (data)=>{     
        console.log('Websocket Message Recieved', data.toString());
        await redisPublish.publish(REDIS_CHANNEL, data.toString); // whenever we have to publish, 
        // we publish it over a channel. Our channel name is : ws-messages.
    });

});

//
redisSubscribe.subscribe(REDIS_CHANNEL);

redisSubscribe.on('message', (channel, message) => {
    if (channel === REDIS_CHANNEL) {
        // Broadcast message to all of your connected clients
        wsServer.clients.forEach((client) => {
            client.send(message.toString());
        });
    }
});


httpServer.listen(PORT, ()=>{
console.log(`Server is listening at http://localhost:${PORT}`);
});
