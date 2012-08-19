var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    https = require("https"),
    querystring = require('querystring');

var app = express(),
	http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    port = (process.env.PORT || 8080);

// connect to Redis client
// redis://nodejitsu:ad567e1e425c194175c024d19f71989f@cod.redistogo.com:10217/

var redis = require("redis");
	var client = redis.createClient(10217, 'cod.redistogo.com');

	client.auth('ad567e1e425c194175c024d19f71989f', function (err) {
	  if (err) {
	    throw err;
	  }
	});

	client.on('ready', function () {

	  // Set!
	  client.set('foo', 'bar', function (err, res) {
	    if (err) {
	      throw err;
	    }

	    // Get!
	    client.get('foo', function (err, foo) {
	      if (err) {
	        throw err;
	      }

	      console.log('foo = %s;', foo);

	      client.quit();
	    });
	  });
	});
	//end redis test 


// Remove debug messages from socket.io
io.set('log level', 1);

// Allow to parse the body of the POST requests
app.use(express.bodyParser());

//INSTAGRAM CLIENT ID
var instagram_client_id = 'eec7fe0344b44e37a84f83e4a07d3e6a';

// GET /style.css
//   Render public/stylesheets/style.css
app.get('/style.css', function(request, response){
	response.writeHead(200, {'Content-Type': 'text/css'});
	response.write(fs.readFileSync(__dirname + '/public/stylesheets/style.css', 'utf8'));
	response.end();
});

app.get('/isotope.min.js', function(request, response){
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(fs.readFileSync(__dirname + '/public/javascripts/isotope.min.js', 'utf8'));
    response.end();
});

app.get('/functions.js', function(request, response){
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(fs.readFileSync(__dirname + '/public/javascripts/functions.js', 'utf8'));
    response.end();
});

// GET /
//   Render index.html
app.get('/', function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(fs.readFileSync('./index.html', 'utf8'));
  response.end();
});

// GET /callback
//   If param hub.callenge is present, renders its value
//   This URL is used by suscription system of Instagram
//   to check if the callback URL provided when creating the suscription
//   is valid and works fine
app.get('/callback', function(request, response){
	console.log("Something accessed /callback");
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log("ERROR on suscription request: %s");
	// , util.inspect(request)
  }
});

// POST /callback
//   Receives POST nofications with the geometries updated
//   Each notification contains a geography_id, which is
//   the identifier of the geography that has a new photo.
//   It's necessary to perform another API call to get the last
//   photo from that geography
app.post('/callback', function(request, response){
	//console.log('response ' + request.body);
  // request.body is a JSON already parsed
	console.log('Recieved photo notification');
	
	 // io.sockets.emit('connection', 'New Photo!' );
	
  request.body.forEach(function(notificationOjb){
    // Every notification object contains the id of the geography
    // that has been updated, and the photo can be obtained from
    // that geography
	// https://api.instagram.com/v1/geographies/{geo-id}/media/recent?client_id=YOUR-CLIENT_IDs
	console.log('Object ID: ' + notificationOjb.object_id);
	console.log('Object: ' + notificationOjb.object);
    https.get({
      host: 'api.instagram.com',
      path: '/v1/geographies/' + notificationOjb.object_id + '/media/recent' +
      '?' + querystring.stringify({client_id: instagram_client_id,count: 1}),
    }, function(res){
      var raw = "";

      res.on('data', function(chunk) {
		//console.log('BODY: ' + chunk);
        raw += chunk;
      });

      // When the whole body has arrived, it has to be a valid JSON, with data,
      // and the first photo of the date must to have a location attribute.
      // If so, the photo is emitted through the websocket
      res.on('end', function() {
        var response = JSON.parse(raw);
        if(response['data'].length > 0 && response['data'][0]['location'] != null) {
			//either send JSON here or an <img> tag??
          io.sockets.emit('photo', raw);
			console.log('Sent photo JSON to client');
        } else {
          console.log("ERROR: %s", util.inspect(response['meta']));
        }
      });

    });
  });

  response.writeHead(200);
});

io.sockets.on('connection', function (socket) {
  //io.sockets.emit('connection', 'user connected' );
	console.log("connected");
});

// Run the app
server.listen(8080, function(){
  console.log("Listening in port %d", port);
});