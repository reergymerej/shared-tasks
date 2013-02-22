//	load modules
var http = require('http'),
	url = require('url'),
	util = require('util'),
	querystring = require('querystring'),
	fs = require('fs'),
	path = require('path');

//	testing vars
var PORT = 1887;
var Tasks = [];
var Task = function(attributes){
	this.id = Tasks.length;

	attributes = JSON.parse(attributes);

	for(var i in attributes){
		if(attributes.hasOwnProperty(i) && i !== 'id'){
			this[i] = attributes[i];
		};
	};
};

var server = http.createServer(function(req, resp){
	
	console.log('...........................');

	var data = '',
		verb = req.method,
		noun = getNoun(req),
		id = getID(req);

	if(verb === 'GET' && noun !== 'Tasks'){
		serveFile(req, resp);
		return;
	};

	console.log('verb: ', verb);
	console.log('noun: ', noun);
	console.log('id: ', id);

	req.on('data', function(chunk){
		data += chunk;
	});

	req.on('end', function(){

		var task,
			responseString,
			responseCode;


		console.log('data received', data);


		//	What are we doing?
		switch(verb){
			case 'POST':
				//	create
				task = new Task(data);
				Tasks.push(task);
				responseCode = 200;
				responseString = JSON.stringify(task);
			break;

			case 'GET':
				//	read
				responseCode = 200;
				responseString = JSON.stringify(Tasks);
				console.log(Tasks);
			break;

			case 'DELETE':
				console.log('delete me: ', id);
				console.log('delete me', data);

				responseCode = 204;
				for(var i = 0; i < Tasks.length; i++){
					if(Tasks[i].id === id){
						Tasks.splice(i, 1);
						break;
					};
				};
			break;
		};
		

		resp.writeHead(responseCode, {
			'content-type': 'text/plain'
		});
		resp.end(responseString);
	});

	function getNoun(req){
		var pathname = url.parse(req.url).pathname,
			parts,
			noun;

		parts = pathname.split('/');
		noun = parts[1];

		return noun;
	};

	function getID(req){
		var parts = url.parse(req.url).pathname.split('/');
		return parts[parts.length - 1];
	};
});

function serveFile(req, resp){
	var filePath = '.' + req.url;

	if(filePath === './'){
		filePath = './index.html';
	};

	req.on('data', function(chunk){
		data += chunk;
	});

	req.on('end', function(){

		fs.exists(filePath, function(exists){
			if(exists){

				fs.readFile(filePath, function(error, content){
					
					resp.writeHead(200, {
						'content-type': 'text/html'
					});
					resp.end(content);
				});	
			} else {
				fs.readFile('./404.html', function(err, content){
					resp.writeHead(404, {
						'content-type': 'text/html'
					});
					resp.end(content);
				});
			};
		});
	});


};

server.listen(PORT);


console.log('server ready on port ' + PORT);


// curl localhost:1887
// curl -X POST -d 'a=1&b=2' localhost:1887
// curl -X PUT -d 'a=1&b=2' localhost:1887
// curl -X DELETE -d 'a=1&b=2' localhost:1887