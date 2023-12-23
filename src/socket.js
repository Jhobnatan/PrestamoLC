const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');

let io;
const clients = {};

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  io.on('connection', (socket) => {
    console.log(`Cliente conectado con ID ${socket.id}`);

    // Asignar ID al cliente y guardarlo en la lista de clientes
    const clientId = uuidv4();
    clients[clientId] = socket;
    socket.clientId = clientId;

    // Enviar el ID al cliente
    socket.emit('clientId', clientId);

    // Escuchar la señal de "offer" enviada por el cliente que quiere iniciar la llamada
    socket.on('offer', (offer, callerClientId, calleeClientId) => {
      // Enviar la oferta al destinatario
      clients[calleeClientId].emit('offer', offer, callerClientId);
    });

    // Escuchar la señal de "answer" enviada por el cliente que recibe la llamada
    socket.on('answer', (answer, callerClientId, calleeClientId) => {
      // Enviar la respuesta al llamante
      clients[callerClientId].emit('answer', answer, calleeClientId);
    });

    // Escuchar la señal de "iceCandidate" enviada por el cliente
    socket.on('iceCandidate', (candidate, callerClientId, calleeClientId) => {
      // Enviar el candidato al destinatario
      clients[calleeClientId].emit('iceCandidate', candidate, callerClientId);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado con ID ${socket.id}`);

      // Eliminar al cliente de la lista de clientes
      delete clients[socket.clientId];
    });
  });
};

module.exports = {
  initSocket,
  io,
};
