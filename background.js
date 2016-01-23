chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
  // Tab opened.
});

chrome.browserAction.onClicked.addListener(function() {
   chrome.tabs.create({'url': 'popup.html'}, function(window) {
   });
});

SC.initialize({
  client_id: 'b0a091a24c88bbd1f400dcac693b86a5',
  redirect_uri: 'http://klevingluo.me/callback'
});

playNextSong()
var playing = true;
var player;
var track = 0;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
          if(message.from && message.from === "popup") {
            switch(message.action){
              case "next":
                playNextSong();
              break;
              case "play":
                if (playing) {
                  player.pause();
                  playing = false;
                } else {
                  player.play();
                  playing = true;
	        }
              break;
            }
          }
});

// functions
function playNextSong() {
  playing = false;
  SC.get('/tracks', {
    genres: 'dubstep', 
    bpm: { from: 120 }
    }).then(function(tracks) {
    playTrack(tracks[track++].id)
  });
}

function NextSong() {
  playNextSong();
  consol.log("playing next song");
}

function playTrack(id) {
  SC.stream('/tracks/' + id).then(function(newPlayer){
    player = {};
    newPlayer.on('finish', NextSong);
    newPlayer.on('no_streams', NextSong);
    newPlayer.on('no_protocol', NextSong);
    newPlayer.on('no_connection', NextSong);
    newPlayer.on('audio_error', NextSong);
    newPlayer.on('geo_blocked', NextSong);
    player = newPlayer;
    player.play();
    console.log(track.title);
    console.log(track.id);
    playing = true;
  });
}



function getNewSong(mood) {
	jQuery.get( "url", function(response) { 
		var apiResponse = JSON.parse(response);
		return apiResponse; //parse to get URL
	});
}

function getMoodResponse(data) {
  $.post(
    'https://apiv2.indico.io/fer?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': data.split(',')[1]
    })
  ).then(function(res) {
    console.log(res);
    return res;
  });
}

function getMood(data) {
  response = getMoodResponse(data);
  var max = 0;
  var mood = "";
  for (var emotion in response) {
    if(response[emotion] > max) {
      max = response[emotion];
      mood = emotion;
    }
  }
  return emotion;
}

// listeners
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.directive) {
      case "play-pause":
        if (!audio.paused) {
          audio.pause();
        } else {
          audio.play();
        }
        audio.paused = !audio.paused;
      break;
    }});

chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  if(message.from && message.from === "popup") {
    switch(message.action){
      case "getMood":
        getMood(message.content)
        break;
    }
  }
});
