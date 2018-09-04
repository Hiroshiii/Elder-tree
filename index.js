document.getElementById('btn').addEventListener('click', function(event) {
	event.preventDefault();
	voiceInput();
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
			console.log("this code run");
			voiceInput();
		}
	}

	// Housekeeping after success or failed parsing
	/*speechRecognition.onend = function() {
		console.log("onend");
	}*/

	return;
}