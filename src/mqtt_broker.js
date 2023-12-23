const mosca = require('mosca');

const settings = {
  port: 1983, // Puerto en el que escucha el broker MQTT
 
};

const server = new mosca.Server(settings);

server.on('ready', () => {
  console.log('Broker MQTT está listo y escuchando en el puerto 1983');
});

server.on('clientConnected', (client) => {
  console.log('Cliente MQTT conectado', client.id);
});

server.on('published', (packet, client) => {
  console.log('========================> Mensaje MQTT publicado', packet.payload.toString());
});

module.exports = server;
