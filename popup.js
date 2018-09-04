'use strict';	

// Submit the form
document.getElementById('form1').addEventListener('submit', function(event) {
	event.preventDefault();
	submitForm(document.getElementById("query").value);
});

//voiceInput();

document.getElementById('btn').addEventListener('click', function(event) {
	event.preventDefault();
	voiceInput();
});

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
var keyCode = e.keyCode;
	if(keyCode==144) {
		voiceInput();
  } 
}
document.getElementById('enablemicrophone').addEventListener('click', function(event) {
	event.preventDefault();
	chrome.tabs.create({url: "index.html"});
});


function voiceInput() {
	speechRecognition = new webkitSpeechRecognition();
	speechRecognition.start();

	// Set up
	/*speechRecognition.onstart = function(event) {
		console.log("onstart", event);
	}*/

	// Process parsed result
	speechRecognition.onresult = function(event) {
		console.log("onresult", event);
		console.log(event.results[0]);
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				document.getElementById('voice_input').value = event.results[i][0].transcript;
					submitForm(document.getElementById('voice_input').value);
				//insertAtCaret('voice_input', event.results[i][0].transcript);
				//console.log(event.results[i][0].transcript);
			}
		}
	}

	// Handle error
	speechRecognition.onerror = function(event) {
		console.log(event);
		if(event.error == "not-allowed"){
			document.getElementById("enablemicrophone").style.display = "block";
		}
		if(event.error == "no-speech"){
			console.log("no speech detected, trying again");
			voiceInput();
		}
	}

	// Housekeeping after success or failed parsing
	/*speechRecognition.onend = function() {
		console.log("onend");
	}*/

	return;
}
function voiceOutput(results){
	var msg = new SpeechSynthesisUtterance(results);
	console.log(results);
	window.speechSynthesis.speak(msg);
	msg.onstart = function(event) {
    console.log('We have started uttering this speech: ' + event.utterance.text);
  }
	console.log(msg + " worked");
}

function intentHandler(intent){
	if(intent == "take me to elder tree"){
		goToPage("https://dev.chess.wisc.edu/mcc/home");
	}
	if(intent == "take me to discussion group"){
		goToPage("https://dev.chess.wisc.edu/mcc/discussions");
	}
	if(intent == "take me to bulletin board"){
		goToPage("https://dev.chess.wisc.edu/mcc/bulletin-board/");
	}
	if(intent == "take me to private messages"){
		goToPage("https://dev.chess.wisc.edu/mcc/private-messages");
	}

}

/**
 * Code for getting microphone data
 *
 * @var object
 */
var speechRecognition;

/**
 * Access token to pass to DialogFlow
 *
 * @var string
 */
var access_token = "";

/**
 * Code for getting microphone permission
 *
 * @var object
 */
/*navigator.mediaDevices.getUserMedia({
	audio: true
})
.then(function(stream) {
	console.log(stream);
})
.catch(function(err) {
	console.log(err);
});*/

function goToPage(URL){
	console.log("goToPage called");
	chrome.tabs.update({
     url: URL
});
}

/**
 * Encode an object into a URL string
 *
 * @param object data		Data to encode
 *
 * @return string
 */
function urlencode(data) {
	var out = [];

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			out.push(key + '=' + encodeURIComponent(data[key]));
		}
	}

	return out.join('&');
}

/**
 * Retrieve the access token
 *
 * @param function	success_callback		Function to execute after getting a response
 *
 * @return null
 */
function getAccessToken(success_callback) {
	var data = {
		refresh_token: "1/LOSpGIplLSqs58Dsmum8GQqna1f1uaKZWcSyoZ4Koz4",
		client_id: "2609319236-f628fcn7auv5gp3i2o43miloqgg94175.apps.googleusercontent.com",
		client_secret: "ndb1VPeCz4dpK9bcnlRPKXAT",
		grant_type: "refresh_token"
	};

	var http = new XMLHttpRequest();
	http.open('POST', 'https://www.googleapis.com/oauth2/v4/token', true);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			var data = JSON.parse(http.responseText);

			if (success_callback) {
				success_callback(data);
			}
		}
	}

	http.send(urlencode(data));
}

/**
 * Send a request to dialog flow
 *
 * @param string	sessionId				Session identifier
 * @param object 	data					Data to send
 * @param function	success_callback		Function to execute after getting a response
 *
 * @return null
 */
function sendRequestToDialogFlow(sessionId, data, success_callback) {
	var url = 'https://dialogflow.googleapis.com/v2/projects/newagent-83875/agent/sessions/' + sessionId + ':detectIntent';

	var http = new XMLHttpRequest();
	http.open('POST', url, true);

	http.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	http.setRequestHeader('Authorization', 'Bearer ' + access_token);

	http.onreadystatechange = function() {
		if (http.status == 200) {
			if (http.readyState == 4) {
				var data = JSON.parse(http.responseText);
				console.log(data);

				if (success_callback) {
					success_callback(data);
				}
			}
		} else {
			console.log(http);
			alert("There was a problem");
			document.getElementById("results").innerHTML = "";
		}
	}

	http.send(JSON.stringify(data));
	document.getElementById("results").innerHTML = "Loading...";
}

/**
 * Submit the form
 *
 * @return null
 */
function submitForm(queryText) {
	var sessionId = (function () {
  return Math.random().toString(36).substr(2, 16);
});
	console.log(sessionId());
	var queryText = queryText;

	getAccessToken(function(data) {
		access_token = data.access_token;

		sendRequestToDialogFlow(
			sessionId,
			{
				"queryInput": {
					"text": {
						"text": queryText,
						"languageCode": "en-US"
					}
				}
			},
			function(data) {
				// Print the response to the console
				console.log(data);

				// This function executes after we get a response back
				document.getElementById("results").innerHTML = data.queryResult.fulfillmentText;
				intentHandler(data.queryResult.intent.displayName);
				voiceOutput(document.getElementById("results").innerHTML);
				//voiceInput();
			}
		);
	});
};