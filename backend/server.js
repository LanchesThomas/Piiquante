const http = require('http');
const app = require('./app');
const server = http.createServer(app);

app.set('port', 3000);

// server on port 3000
server.on('listening', () => {
    console.log('serveur prêt sur le port 3000');
});

// handling error
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
server.on('error', errorHandler);

// server listen port 3000
server.listen(process.env.PORT || 3000);
