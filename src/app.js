const express = require('express');
const path = require('path')
const app = express();
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');

const myConnection = require('express-myconnection');
var session = require('client-sessions');
// const mosca = require('mosca');
// const broker = require('./mqtt_broker');
// const mqtt = require('mqtt');


//importando ruotes
const indexRoutes = require('./routes/index');

// const http = require('http');
// const { initSocket,io } = require('./socket');
// const server = http.createServer(app);
// initSocket(server);

const { urlencoded } = require('express');
const checkSesion = require('./middleware/sesion');
const login = require('./routes/login');
const { allowedNodeEnvironmentFlags } = require('process');
// settings
app.set('port', process.env.PORT || 5000)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', 'script-src; style-src; self;');
//   next();
// });
// static files
app.use(express.static('public'));
// Middlewares
app.use(morgan('dev'));

app.use(session({
    cookieName: 'jhobrosoftsession', // cookie name dictates the key name added to the request object
    secret: 'blargadeeblargblarg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  }));
//app.use(express.urlencoded({extends:false}));// para recibir los campos de un formulario
app.use(express.json()); // estas 2 lineas son para recibir en formato JSON
app.use(express.urlencoded({extended:true}));

// app.use((req, res, next) => {
//   req.broker = broker; // Agrega el broker MQTT a la solicitud
//   next();
// });
// // Configuración del broker MQTT
// const mqttSettings = {
//   port: 1883
// };
// const mqttBroker = new mosca.Server(mqttSettings);

// mqttBroker.on('ready', () => {
//   console.log('Broker MQTT iniciado en el puerto 1883');
// });

// mqttBroker.on('published', (packet) => {
//   console.log(`Mensaje recibido: ${packet.payload.toString()}`);
//   messages.push(packet.payload.toString());
// });

// Manejar la conexión del cliente MQTT con el broker



// routes 
app.use('/', indexRoutes);

app.get('*',(req,res)=>{
  res.redirect('/');
});

app.post('*',(req,res)=>{
  res.redirect('/');
});

app.put('*',(req,res)=>{
  res.redirect('/');
});

// https.createServer({
//   cert: fs.readFileSync('url del certificado'),
//   key: fs.readFileSync('url del key')
// }, app).listen(app.get('port'), () => {
//   console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
// });
// starting the server
app.listen(app.get('port'),() => {
    console.log('El servidor esta escuchando en el puerto 5000...');
});


// Crea un cliente MQTT
// const client  = mqtt.connect('localhost:1983');

// // Cuando se conecta al servidor MQTT
// client.on('connect', function () {
//   console.log('Conectado al servidor MQTT');

//   // Publica un mensaje en el topic "test"
//   // Publica un mensaje cada 3 segundos
//   setInterval(function() {
//     const message = 'Este es un mensaje de prueba';
//     client.publish('chat', message);
//     console.log('Mensaje enviado al topic "test": ' + message);
//   }, 30000);

//   // Se suscribe al topic "test"
//   client.subscribe('chat');
// });

// Cuando se recibe un mensaje en el topic "test"
// client.on('message', function (topic, message) {
//   console.log('Mensaje recibido en el topic \'' + topic + '\': ' + message.toString());
// });



// // Configurar broker MQTT
// const mqttClient = mqtt.connect('mqtt://localhost:1983');

// mqttClient.on('connect', () => {
//   console.log('Conectado al broker MQTT');
//   io.on('connect', (data) => {
//     // código para manejar el evento
    
//   });
// });
// setInterval(function() {
//   const message = 'Este es un mensaje de prueba';
//   mqttClient.publish('message', message);
//   console.log('Mensaje enviado al topic "message": ' + message);
// }, 3000);
// // Configurar Socket.IO
// io.on('dato', (socket) => {
//   console.log('Cliente conectado');

//   // Suscribirse a un topic de MQTT
//   mqttClient.subscribe('chat');

//   // Escuchar mensajes de MQTT
//   mqttClient.on('published', (topic, message) => {
//     console.log(`Mensaje recibido en el topic ${topic}: ${message.toString()}`);

//     // Emitir mensaje a todos los clientes conectados a través de Socket.IO
//     // io.emit('mensaje', message.toString());
//   });

//   // Escuchar mensajes del cliente a través de Socket.IO y publicarlos en MQTT
//   socket.on('mensaje', (mensaje) => {
//     console.log(`Mensaje recibido del cliente: ${mensaje}`);

//     // Publicar mensaje en MQTT
//     mqttClient.publish('chat', mensaje);
    
//   });
// });

// mqttClient.on('message', function (topic, message) {
//     console.log('Mensaje recibido en el topic \'' + topic + '\': ' + message.toString());
//   });