const http = require('http');
const { handleRequest } = require('./routes');
const { connectDB} = require('./models/db');

// JL: load the database address to the environment
const path = require('path');
const dotEnvPath = path.resolve(__dirname, '.env'); //some modification of the .env path (different from that in db.js)
require('dotenv').config({ path: dotEnvPath });


//JL: connect to the database
connectDB();



const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

server.on('error', err => {
  console.error(err);
  server.close();
});

server.on('close', () => console.log('Server closed.'));

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
