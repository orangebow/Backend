//Build first a normal server:

import http from "node:http";
const PORT = process.env.PORT || 9000;

const httpServer = http.createServer(async function (req,res){});

httpServer.listen(PORT, ()=>{
console.log("Server is listening at the localhost://9000"); 
});

//Add the functionality of the webSocket:
import {WebSocketserver} from ws;
And further code is added in the server.js

//Add the script in the index.html:
<script>
    const {port} = window.location();
    const connection = new WebSocket(`ws://localhost:${port}`);
</script>
