var testing = true;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var curl = require('curl');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var request = require('request');
// Authentication
var present = require('present');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var id = 0;

var currentPlaylist = null;
currentPlaylist = "spotify:user:johankul:playlist:6kIaKvJA5nCwgOILPSWt7m";


var access_token = -1;

var clientId = 'e5f79e80b796455581300e8ad50e7c66';
var clientSecret = '56bcde383ce54c0cad1a4221bd118d81';
var payload = clientId + ":" + clientSecret;
var encodedPayload = new Buffer(payload).toString("base64");

var users = new Array();

function user(sock_id, host, ip) {
  this.ip = ip;
  this.sockid = sock_id;
  this.host = user;
}

function findUser(array, user) {
  for(var i = 0; i < array.length; i++)
    var u = array[i];
    if((u.sockid = user.sockid) || (u.io = user.ip)) {
      return u;
    } else {
      return null;
    }
  }

function getToken(callback) {
	var opts = {
	url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + encodedPayload
    },
    body: "grant_type=client_credentials&scope=playlist-modify-public playlist-modify-private"
	};


	request(opts, function(err, res, body) {
		console.log(err);
		//console.log(res.statusCode);
		//console.log(body);
		var token = JSON.parse(body).access_token;
		callback(token);
		//console.log(parsed_body["access_token"]);	// can also use dot notation
	});
}



function runTests() {
		var track = createTrack("spotify:track:0WZQjseE1CmFECeoVCmlku");
		queue.queue.push(track);
		queue.queue.push(new Track("spotify:track:3tFh3yvI5jXtn9JDg0xUAs"));
		queue.queue.push(new Track("spotify:track:3QEF6vHCQjLA0drpmU4LUP"));
		queue.queue.push(new Track("spotify:track:0WZQjseE1CmFECeoVCmlku"));
		queue.queue.push(new Track("spotify:track:6XmrfU6jqZfcFddgU9pwqf"));
		queue.queue.push(new Track("spotify:track:7huTOWrOZrcTgdz9ph2pmC"));

}



//  Implementation works serverside
function startPlayback(access_token, uri) {
    xhr.open("PUT", 'https://api.spotify.com/v1/me/player/play', true);
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.send(JSON.stringify({
          'context_uri': "spotify:user:johankul:playlist:6kIaKvJA5nCwgOILPSWt7m",
          'offset': {
              'position' :'0'
          }
          }));

   /* $.ajax({
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: { 'Authorization': 'Bearer ' + access_token },
        method: 'PUT',
       //   Works fine
        data: JSON.stringify({
            "context_uri": uri,
            "offset": {
                "position": 0
            }
            }),
        json: true,
        success: result => {
            console.log(result);
        }
    });
    console.log(uri);
    */
}

function getTrackInfo(callback, uri) {
	if(access_token == -1) {
		getToken(function(data) {
			//console.log(data);
			var id = uri.split(":")[2];
			//var encodedPayload = new Buffer(token).toString("base64");
			//console.log("tkn: " + data);
			var opts = {
				url: "https://api.spotify.com/v1/tracks/"+id,
				method: "GET",
				headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Bearer " + data}
				};

			request(opts, function(err, res, body) {
				//console.log(res.statusCode);
				// console.log(body);
				//console.log(body);
				callback(body);
			});
		});
	} else {
		var id = uri.split(":")[2];
		var opts = {
			url: "https://api.spotify.com/v1/tracks/"+id,
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Bearer " + data}
			};


		request(opts, function(err, res, body) {
			// console.log(err);
			// console.log(res.statusCode);
			// console.log(body);
			callback(body);
		});
	}


}


function sendQueue(io, queue) {
	io.emit('queue update',queue);

}

function Client(id) {
  this.id = id;

}

var queue = {
   queue : new Array()
};

function createTrack(callback, URI) {
	getTrackInfo(function(info) {
		parsed_info = JSON.parse(info);
		var artist = parsed_info.artists[0].name;
		var song_name = parsed_info.name;
		var album_art = parsed_info.album.images[2].url;
		//console.log(album_art);
		var track = new Track(URI, song_name ,artist,album_art, "placeholder");
		callback(track);
	},URI);



}

function Track(URI, title, artist, icon_src, url) {
	this.URI = URI;
	this.icon_src = icon_src; // change at some point
	this.artist = artist;
	this.title = title;
	this.URL = url;
	this.upvotes = 1;
	this.date = present();
  this.upvoters = new Array();
}

function upvote(track_object) {
	track_object.upvotes += 1;
}

function reset(URI) {

}

// First votes, second date.
function reorder() {
	q = queue.queue;
	console.log("Reordering");
	insertionSortDescending(q,0, q.length)
}
// TODO: FIKS SORTERINGEN!
//	Inclusive, exclusvie
var q = [1, 2, 4, 5, 7, 8, 9, 10,11,23,1,2,4,5,6,7];
function insertionSortAscending(q,start,end) {
	if (q == null) return;

	var i = start;
	while (i < end) {
		console.log("pre looop");
		var j = i;
		console.log(q[j-1]);
		while (i < end) {
		var j = i;
		while (j > 0 && q[j-1].upvotes > q[j].upvotes) {
			var temp = q[j];
			q[j] = q[j-1];
			q[j-1] = temp;
			j--;
		}
		i++;

		}
	}
	//console.log(q);


	// var i = start;
	// while (i < end) {
		// var j = i;
		// while (q[j] > 0 && q[j-1] < q[j]) {
			// var temp = q[j];
			// q[j] = q[j-1];
			// q[j-1] = temp;
			// j--;
		// }
		// i++;
	// }
	// console.log(q);
}

function insertionSortDescending(q) {
	var i = 0;
	console.log("pre looop");
	while( i < q.length) {
		console.log("pre looop");
		var j = i;
		while(j > 0 && q[j-1].upvotes < q[j].upvotes) {
		var temp = q[j];
			q[j] = q[j-1];
			q[j-1] = temp;
			j--;
		}
		i++;
	}
	//console.log(q);
}
insertionSortAscending(q,0,q.length);
// var track = {
//   URI : "",
//   title: "",
//   artist: "",
//   album: "",
//   track_length: "",
//   setInfo : function(URI) {
//     this.URI = URI;}
// };
var counter = 0;
var users = {};

function checkQueueForURI(URI) {
  var contains = false;
  queue.queue.forEach( function(item, index) {
    //console.log(item.URI)
    if(item.URI == URI) contains = true;
      return;
  });

  return contains;
}

function getTrack(URI) {

	for(var i = 0; i < queue.queue.length; i++) {
		var list_item = queue.queue[i];
		if(list_item.URI == URI) {
			return list_item;
		}
	}
	return null;
}

function addNewUser(id) {
  users.add(counter, id);
}


function sendMessageTo(io, id, tag, message) {
  if(io.sockets.connected[id]) {
    io.to(id).emit(tag, message);
  }
}

function validLink(URI) {
	var str_uri = "" + URI;
	var list = str_uri.split(":");
	var splt = list[1];
	console.log("str_URI:"+ str_uri);
	if(splt == "track") {
		return 1;
	} else {
		if(str_uri.includes("open.spotify") == true) {
			return 2;
		}
		else {
			return 0;
		}
	}
}



io.on('connection', function(socket){
    //console.log(socket.id);
    var client_id = socket.id;
    last = socket.id;

    console.log("A user connected");
    //  Private message on login

	if(queue.queue.length == 0) {
		io.sockets.connected[client_id].emit('queue update', -1);
	} else {
		io.sockets.connected[client_id].emit('queue update', JSON.stringify(queue));
	}

	//io.sockets.connected[client_id].emit('chat message', "Welcome, only you should see this");

    socket.on('sync', function(msg, token) {
        startPlayback(token, currentPlaylist);
        //seek(token, time);
        console.log(socket.id);
        console.log(msg);
        console.log(token);
    });
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
       // io.emit('chat message', getTime() + msg);

    });
    socket.on('chat ping', function(date){
        console.log(date);
        var ping = Date.now() - date;
        console.log("The ping is: " + ping + " ms.");
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('add song', function(URI) {
		console.log('Adding song URI ' + URI);
		var bool = validLink(URI);
		var substrs;
		if(bool == 1) {

		} else if(bool == 2){
			substrs = URI.match(/track\/([^?]*)/);
			console.log("asd");
			console.log(substrs[1]);
		} else {
			io.sockets.connected[client_id].emit('alert', "The song format is invalid, please use a spotify link or URI");

			return;
		}
		if(bool == 2) {
			var temp = "spotify:track:";
			URI = temp + substrs[1];
		}

		var temp2 = temp;
		if(bool != 0) {
			var track_test = getTrack(URI);
			console.log("Track present." + track_test);
			if(track_test != null) {
				console.log("The song has already been added.");
				upvote(track_test);
				reorder();
				io.emit("queue update", JSON.stringify(queue));
			} else {

				createTrack( function(track) {

				queue.queue.push(track);
				reorder();
				io.emit("queue update", JSON.stringify(queue));
				},URI);
			}
		}

    });






});


http.listen(3000, function() {
  console.log('listening on *:3000');
});

//  Returns a string of the current time in HH:MM::SS
function getTime() {
  var time = new Date();
  var s = time.getSeconds();
  var a = '0';
  if(s>10) {
    a='';
  }
  return(time.getHours() + ":" + time.getMinutes() + ":" + a + time.getSeconds() +"\n");
}
