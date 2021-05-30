const app = require('./app');
const http = require('http');

const port = process.env.PORT || '6000';

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`listening on port on ${port} ` + new Date())
})
