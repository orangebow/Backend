//Build first a normal server.
import http from "node:http";
import fs from 'node:fs/promises'; //To read the html file, we have fs module.
import path from 'path';
import { WebSocketServer } from "ws";

const PORT = process.env.PORT ?? 9000;

const httpServer = http.createServer(async function (req,res){
    const indexFile = await fs.readFile(path.resolve('./index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.end(indexFile);
});
const wsServer = new WebSocketServer({server: httpServer}); //http request is upgraded to webSocket request.

//handler functions:
wsServer.on('connection', (websocket)=>{
    console.log('WebSocket Connection.....');
    websocket.on('message', (data)=>{    // Here "data" send by our frontend is recieved and used by our server 
        console.log('Websocket Message Recieved', data.toString());// frontend se message mila aur maine print kiya.
    });
})


httpServer.listen(PORT, ()=>{
console.log("Server is listening at the localhost://9000"); 
});
