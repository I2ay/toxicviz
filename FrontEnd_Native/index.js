let http = require('http');
let fileSystem = require('fs');

let server = http.createServer(function(req, resp){
	fileSystem.readFile('./index.html', function(error, fileContent){
		if(error){
			resp.writeHead(500, {'Content-Type': 'text/plain'});
			resp.end('Error');
		}else{
			// Website you wish to allow to connect
			resp.setHeader('Access-Control-Allow-Origin', '*');

			// Request methods you wish to allow
			resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

			// Request headers you wish to allow
			resp.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			resp.setHeader('Access-Control-Allow-Credentials', true);
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.write(fileContent);
			resp.end();
		}
	});
});

server.listen(8080);

console.log('Listening at: localhost:8080');