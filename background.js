// globals
var audio = new Audio('http://datashat.net/music_for_programming_1-datassette.mp3');
audio.play();
audio.addEventListener("ended", function() { 
	  playNextSong();
	});

// functions
function playNextSong() {
	audio = new Audio(getNewSong(getMood()));
	audio.load()
}

function getNewSong(mood) {
	jQuery.get( "url", function(response) { 
		var apiResponse = JSON.parse(response);
		return apiResponse; //parse to get URL
	});
}

//function getMood() {
	// single example
//	$.post(
//	  'https://apiv2.indico.io/fer',
//	  JSON.stringify({
//	    'data': "<IMAGE>" //Need the image
//	  })
//	).then(function(res) { 
//		console.log(res); 
//		return res;
//	});

	// batch example
	// $.post(
	//   'https://apiv2.indico.io/fer/batch',
	//   JSON.stringify({
	//     'data': [
	//       "<IMAGE>",
	//       "<IMAGE>"
	//     ]
	//   })
	// ).then(function(res) { console.log(res) });
//}

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

function imageCapture() {
	chrome.storage.local.set({'value': theValue}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

function getMood(data) {
  alert("test5");
  $.post(
    'https://apiv2.indico.io/fer?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': data
    })
  ).then(function(res) {
    console.log(res);
    alert("test6");
    alert(res);
    alert("test7");
    return res;
  });
}
function test() {
  window.alert("test");
}

chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  alert("test2");
  if(message.from && message.from === "popup") {
    alert("test3");
    switch(message.action){
      case "getMood":
        alert("test4");
        getMood(message.content)
        break;
    }
  }
});
