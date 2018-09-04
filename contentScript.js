var url = [
"https://dev.chess.wisc.edu/mcc/discussions/thought-of-the-day/",
 "Doe",
 46
];




window.setTimeout(function(){
	//reset speechSynthesis each time the page is refreshed
	window.speechSynthesis.cancel();
	//css stylesheet for speaker icons
	document.getElementsByTagName('head')[0].append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
	
	//speaker icon for post
	var elmt1 = document.querySelector(".post .message .card-body .ml-auto.p-2") || document.querySelector(".col-lg-7.mb-3");
	if(elmt1 !== null){
		var speaker = createSpeakerButton(1000);
		elmt1.appendChild(speaker);
		var message = document.querySelector(".container .card-text.render-shortcodes.content") || document.querySelector(".pt-3.render-shortcodes._28font");
		message = message.innerHTML;
		voiceOutput(message, 1000);
	}
	
	//speaker icon for bulletin board
	var elmt2 = document.getElementById('message-data');
	if(elmt2 != null) elmt2 = elmt2.querySelector(".card-body");
	if(elmt2 !== null){
		var speaker = createSpeakerButton(1001);
		elmt2.insertBefore(speaker, elmt2.childNodes[3]);
		//message might be problematic
		var message = elmt2.childNodes[elmt2.children.length+1].querySelector(".render-shortcodes._28font").innerHTML;
		voiceOutput(message, 1001);
	}
	
	//speaker icon for comments
	var comments_node = document.querySelector(".comments") || document.getElementById("comments");
	if (comments_node != null) {
		var list = comments_node.childNodes;
		for (i = 0; i < list.length; ++i) {
			if(list[i].className == "message mb-4"){
				var subitem = list[i].querySelector(".flex-column");
				var id = i;
				var speaker = createSpeakerButton(id);
				subitem.insertBefore(speaker, subitem.childNodes[1]);
				var message = (subitem.querySelector(".pt-3.render-shortcodes._28font") || subitem.querySelector(".render-shortcodes"));
				message = message.innerHTML;
				voiceOutput(message,i);
			}	
		}
	}
	
	//speaker icon for private messages
	var private_messages_node = document.querySelector(".messages-list.list-group");
	if (private_messages_node != null) {
		var list = private_messages_node.childNodes;
		for (i = 0; i < list.length; ++i) {
			if(list[i].className == "message mb-4"){
				var subitem = list[i].querySelector(".d-flex.flex-row.align-items-start");
				var id = i;
				var speaker = createSpeakerButton(id);
				subitem.insertBefore(speaker, subitem.childNodes[2]);
				var message = subitem.querySelector(".render-shortcodes").innerHTML;
				voiceOutput(message,i);
			}	
		}
	}

	//microphone icon content
	var message_content = null;
									//write a new message in just chatting/humor/books, music, and movies/religion and spirituality/health matters
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/just-chatting/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/humor/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/books-music-and-movies/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/religion-and-spirituality/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/health-matters/start_thread") {
		if (document.querySelector(".page.clearfix .container.page-default.mb-3 .form")) {
			message_content = document.querySelector(".page.clearfix .container.page-default.mb-3 .form").getElementsByClassName('pt-3 _28font')[1];
		}
	}
									//bulletin board/lifestyle/daily reflection
	if (window.location.href.includes("https://dev.chess.wisc.edu/mcc/bulletin-board/message/view/")
		|| window.location.href.includes("https://dev.chess.wisc.edu/mcc/blog/view/")
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/gratitude-journal") {
		message_content = findNthDescendant("file_upload_form", "div", 1);
	}
									//write a new bulletin board message
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/bulletin-board/message/edit/") {
		message_content = findNthDescendant("file_upload_form", "div", 9);
		console.log(message_content);
	}
									//daily fun
	if (window.location.href.includes("https://dev.chess.wisc.edu/mcc/daily-fun/view/")) {
		message_content = findNthDescendant("comment-file_upload_form", "div", 1);
	}
									//my health ask us
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/ask-us-anything") {
		message_content = document.querySelector(".clearfix.mt-3 .form-group");
	}
									//write a new message in private messages
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/private-messages/conversation/start-new") {
		message_content = document.querySelector(".container.page-default.mb-3 .clearfix.my-3 .form-group");
	}
	console.log(message_content);
										//weekly poll
	if (window.location.href.includes("https://dev.chess.wisc.edu/mcc/weekly-poll/")) {
		message_content = findNthDescendant("weekly-poll-data", "div", 7);
	}
										//discussion group and private messages	
	if (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/thought-of-the-day/")
		|| (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/just-chatting/") && message_content == null)
		|| (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/humor/") && message_content == null)
		|| (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/books-music-and-movies/") && message_content == null)
		|| (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/religion-and-spirituality/") && message_content == null)
		|| (window.location.href.includes("https://dev.chess.wisc.edu/mcc/discussions/health-matters/") && message_content == null)
		|| window.location.href.includes("https://dev.chess.wisc.edu/mcc/private-messages/conversation/view/")) {
		message_content = findNthDescendant("comment-form", "div", 1);
	}
	
	if(message_content == undefined) message_content = null;
	console.log("input for content: ");
	console.log(message_content);
	if(message_content !== null){
		var microphone = createMicrophoneButton();
		message_content.insertBefore(microphone, message_content.childNodes[2]);
		//microphone click event
		document.getElementById('microphone').addEventListener('click', function(event) {
		event.preventDefault();
				//discussion group/private messages				//daily fun/bulletin board						//daily reflection			//write a message bulletin board			
		voiceInput(document.getElementById("content") || document.getElementById("comment") || document.getElementById("txt-user-answer") || document.getElementById("message_description"));
		});
	}	
	
	//microphone icon title
	var message_title = null;
									//Write a new Bulletin Board Message
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/bulletin-board/message/edit/") {
			message_title = document.getElementById("file_upload_form").getElementsByClassName('form-group')[2];
		}							//my health ask us
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/ask-us-anything") {
			message_title = document.querySelector(".card.bg-light.mb-3 .card-body");
		}							//private message write a new message
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/private-messages/conversation/start-new") {
			message_title = document.querySelector(".container .clearfix .mb-3");
		}							//write a new message in just chatting/humor/books, music, and movies/religion and spirituality/health matters
	if (window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/just-chatting/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/humor/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/books-music-and-movies/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/religion-and-spirituality/start_thread"
		|| window.location.href == "https://dev.chess.wisc.edu/mcc/discussions/health-matters/start_thread") {
		if (document.querySelector(".page.clearfix .container.page-default.mb-3 .form")) {
			message_title = document.querySelector(".page.clearfix .container.page-default.mb-3 .form").getElementsByClassName('pt-3 _28font')[0];
		}
	}
	
	console.log("input for title: ");
	console.log(message_title);
	
	if(message_title !== null){
		var microphone = createMicrophoneButton();
		message_title.insertBefore(microphone, message_title.childNodes[2]);
		//microphone click event
		document.getElementById('microphone').addEventListener('click', function(event) {
		event.preventDefault();
		if (window.location.href == "https://dev.chess.wisc.edu/mcc/bulletin-board/message/edit/") {
			voiceInput(message_title.getElementsByClassName("form-control")[0]);
		}
		else {
		//my health ask us/private message write a new message/just chatting write a new messages
		voiceInput(document.getElementById("title"));
		}
		});
	}
	
}, 1200);

function findNthDescendant(parent, tagname, index) {
	parent = document.getElementById(parent);
	if(parent != null){
		var descendants = parent.getElementsByTagName(tagname);
		if (descendants.length) {
			return descendants[index-1];
			}
   }
   return null;
}

function voiceInput(textArea) {
	final_transcript = '';
	recognition = new webkitSpeechRecognition();
	recognition.start();
	recognition.continuous = true;
	recognition.interimResults = true;
	// Set up
	/*recognition.onstart = function(event) {
		console.log("onstart", event);
	}*/

	// Process parsed result
	recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
			final_transcript += event.results[i][0].transcript;
		} 
    }
	if(final_transcript == "comma") 
		final_transcript = ",";
	
	var punctuation = ".,/?!`~{}[]:\";\'\\<>";
	if (punctuation.includes(final_transcript)){
		textArea.value = textArea.value.substring(0,textArea.value.length-1) + final_transcript + " ";
	}	
	else {
		final_transcript = capitalize(final_transcript) + " ";
		textArea.value += final_transcript;
	}
	};


	// Handle error
	recognition.onerror = function(event) {
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
	/*recognition.onend = function() {
		console.log("onend");
	}*/
	return;
}
function createSpeakerButton(id){
	var speaker = document.createElement("button");
		speaker.id = "speaker" + id;
		var item = document.createElement("i");
		item.setAttribute("class", "fas fa-volume-up");
		speaker.appendChild(item);
		speaker.style.cssFloat = "right";
		return speaker;
}
function createMicrophoneButton(){
	var microphone = document.createElement("button");
		microphone.id = "microphone";
		var item = document.createElement("i");
		item.setAttribute("class", "fa fa-microphone");
		microphone.appendChild(item);
		microphone.style.cssFloat = "right";
		return microphone;
}

var first_char = /\S/;
function capitalize(s) {
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function voiceOutput(results, index){
	var msg = new SpeechSynthesisUtterance(results);
	//0: paused 1:not started/ended 2:playing
	var flag = 1;

	//speaker click event
	document.getElementById('speaker' + index).addEventListener('click', function(event) {
	event.preventDefault();
	switch (flag) {
		case 0:
			window.speechSynthesis.resume();
			break;
		case 1:
			window.speechSynthesis.speak(msg);
			break;
		case 2:
			window.speechSynthesis.pause();
			break;
		}
	
	});
	msg.onstart = function(event) {
		var i = document.getElementById('speaker' + index).querySelector(".fas.fa-volume-up");
		if(i != null) i.setAttribute("class", "fas fa-pause");
		flag = 2;
	}
	
	msg.onpause = function(event) {
		var i = document.getElementById('speaker' + index).querySelector(".fas.fa-pause");
		if(i != null) i.setAttribute("class", "fas fa-volume-up");
		flag = 0;
	}
	
	msg.onresume = function(event) {
		var i = document.getElementById('speaker' + index).querySelector(".fas.fa-volume-up");
		if(i != null) i.setAttribute("class", "fas fa-pause");
		flag = 2;
	}
	msg.onend = function(event) {
		var i = document.getElementById('speaker' + index).querySelector(".fas.fa-pause");
		if(i != null) i.setAttribute("class", "fas fa-volume-up");
		flag = 1;
		window.speechSynthesis.cancel();
	}
}



