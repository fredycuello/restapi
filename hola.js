const math = require("./math.js");
const http = require('http');
const colors = require('colors');

console.log('hola');
console.log(math.add(1,2));

const handleServer = function(request, response) {
    response.writeHeader(200, { 'Content-type':'text/html'});
    response.write('<h1>texto</h1>');
    response.end();
}

const server = http.createServer( handleServer );
server.listen(3000, function() {
    console.log('servidor conectado');
});


