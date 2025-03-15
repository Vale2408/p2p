const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const {v4: uuidv4} = require('uuid')

// Crea un'app Express
const app = express();

// Crea un server HTTP usando l'app Express
const server = http.createServer(app);

// Inizializza Socket.IO sul server
const io = socketIo(server);

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configura la route principale per la pagina del client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestisci la connessione di un nuovo socket
io.on('connection', (socket) => {
  console.log('Un nuovo peer si è connesso:', socket.id);

  // Gestisci l'invio del file
  socket.on('send-file', (data) => {
    console.log('File ricevuto, invio a tutti gli altri peer...');
    // Invia il file a tutti i peer connessi
    socket.broadcast.emit('receive-file', data);
  });

  socket.on('generate-id', function() {
    const id = uuidv4()
    socket.emit('peer-id', id)
  })

  // Disconnessione
  socket.on('disconnect', () => {
    console.log('Un peer si è disconnesso:', socket.id);
  });
});

// Avvia il server sulla porta 3000
server.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
