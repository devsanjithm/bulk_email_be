import { Server } from 'socket.io';

let connection = null;

class SocketIO {
  webSocket:any;
  constructor() {
    this.webSocket = null;
  }

  connect(httpServer: any) {
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });
    io.on('connection', (socket) => {
      console.log('id', socket.id);
      io.emit('user-connection', socket.data);
      this.webSocket = io;
    });
  }

  emitEvent(event: any, data: any) {
    this.webSocket.emit(event, data);
  }

  broadCastEvent(event: any, data: any) {
    console.log(this.webSocket.emit(event, data), 'broadcast testing');
    this.webSocket.broadcast.emit(event, data);
  }

  onEvent(event: any, handler: any) {
    this.webSocket.on(event, handler);
  }

  static init(server: any) {
    if (!connection) {
      connection = new SocketIO();
      connection.connect(server);
    }
  }
  static getSocketConnection() {
    if (connection) {
      return connection;
    }
  }
}

export default {
  connectSocket: SocketIO.init,
  socketConnection: SocketIO.getSocketConnection,
};
