const http = require('http');
const app = require('./app');
const dotenv = require('dotenv')

dotenv.config()

const NormalizePort = value => {
    const port = parseInt(value,10);

    if(isNaN(port)) {
        return value
    }
    if (port >= 0) {
        return port
    }
    return false;
};

const port = NormalizePort(process.env.PORT);

app.set('port', port);

const handleError = error => {
    if(error.syscall !== 'listen') {
        throw error
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;

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

const server = http.createServer(app);

server.on('error', handleError);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;

    console.log('listening on ' + bind);
});

server.listen(port);
