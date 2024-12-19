import { Socket } from 'dgram';
import express, { Request, Response } from 'express';
import http from 'http';
import { DefaultEventsMap, Server } from 'socket.io';
import lobbyController from './controller/lobby';
import { brotliCompress } from 'zlib';

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server);
const sockets: Array<any> = [];

io.on('connection', (socket) => {
  socket.on('connectToSession', (data) => {
    const lobbyData = data.lobby
    const userData = data.user
    lobbyController.connectUser(socket,lobbyData,userData)
  })

  socket.on('disconnectFromLobby', (data) => {
    lobbyController.disconnectUser(socket)
  })

  socket.on('message',(message)=> {
    if(message[0] == "/") {
      const params = message.replace("/","").split(" ")
      const user = lobbyController.getUserFromSocket(socket)
      switch(params[0]){
        case "challange":

          lobbyController.createChallangeInvite(socket, params[1])
          break
        case "accept":
          lobbyController.acceptChallangeInvite(socket,params[1])
          break
        case "decline":
          lobbyController.declineChallangeInvite(socket,params[1])
          break
        case "restart":
          if(!user?.currentGame) return
            lobbyController.restartGame(socket,user.currentGame.id)
            break
        case "leave":
            if(!user?.currentGame) return
            lobbyController.endGame(socket,user?.currentGame?.id)
            break
      }
    
    }else {
      lobbyController.message(socket,message)
    }
  })

  socket.on('userMove', (data) => {
    lobbyController.gameInput(socket,data.position,0,data.id)
  })

  socket.on('disconnect', () => {
    lobbyController.disconnectUser(socket)
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});