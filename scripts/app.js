(function(Speech) {
	/* DOM elements */
	const speechButton = document.querySelector('.microphone__btn')
	const diagnostic = document.querySelector('.result--yousaid');
	const botDiagnostic = document.querySelector('.result--botsaid');
	const bg = document.querySelector('body');
	const hints = document.querySelector('.choices');
	const results = document.querySelector('.result');	

	const client = new ApiAi.ApiAiClient({accessToken: '6020f6e3b5394abeb57836aec66f5989'});
	const greetingArray = ['hello', 'hi', 'hallo'];
	const grammar = '#JSGF V1.0; grammar greeting; public <greeting> = ' + greetingArray.join(' | ') + ' ;'

	const recognition = new Speech.SpeechRecognition();
	const speechRecognitionList = new Speech.SpeechGrammarList();
	const speechSynthesis = Speech.SpeechSynthesis;

	recognition.lang = 'en-US';
	recognition.interimResults = false;
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;

console.log('voices: ', window.speechSynthesis.getVoices())

	speechButton.onclick = function() {
	  recognition.start();
	  console.log('Ready to receive a greeting command.');
	  speechButton.classList.add('microphone__btn--listening');
	}

	recognition.onresult = function(event) {
	  var last = event.results.length - 1;
	  var greeting = event.results[last][0].transcript;

	  sendSpeech(greeting, botDiagnostic);

	  diagnostic.textContent = greeting + '.';
	  
	  // if(greetingArray.includes(greeting)) {
	  // 	botDiagnostic.textContent = 'Welcome, cool to talk to you!';
	  // } else {
	  // 	botDiagnostic.textContent = 'Sorry I think that is no greeting 🤔!';
	  // }
	  console.log('Event: ', event);
	  console.info('Result received: ' + greeting + '.');
	  console.log('Confidence: ', event.results[0][0].confidence);
	  // console.log('responsAi: ', responsAi);
	  clearSpeechBtnClasslist(speechButton);
	  speechButton.classList.add('microphone__btn--gotresult');
	}

	recognition.onspeechend = function() {
	  recognition.stop();
	  clearSpeechBtnClasslist(speechButton);
	  speechButton.classList.add('microphone__btn--stopped');
	}

	recognition.onnomatch = function(event) {
	  diagnostic.textContent = "I didn't recognise that greeting.";
	}

	recognition.onerror = function(event) {
	  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
	  clearSpeechBtnClasslist(speechButton);
	  speechButton.classList.add('microphone__btn--error');
	}

	function clearSpeechBtnClasslist(buttonNode) {
		var classListArray = ['microphone__btn--error', 'microphone__btn--stopped', 'microphone__btn--gotresult', 'microphone__btn--listening'];

		classListArray.forEach(classListItem => {
			if(buttonNode.classList.contains(classListItem)) {
				buttonNode.classList.remove(classListItem);
			}
		})
	}

	function sendSpeech(inputText, botElement) {
		const promise = client.textRequest(inputText);

		promise
		    .then(returnValue => {
		    	console.log('returnValue', returnValue);
		    	botElement.textContent = returnValue.result.fulfillment.speech;
		    	setTimeout(() => {
		    		var message = new Speech.SpeechSynthesisUtterance(returnValue.result.fulfillment.speech);
		    		// message.lang = 'en-US';
		    		speechSynthesis.speak(message);
		    	}, 1000);
		    	// return returnValue.result.fulfillment.speech;
		    })
		    .catch(handleError);

	}


	function handleResponse(serverResponse) {
	        console.log(serverResponse);
	}
	function handleError(serverError) {
	        console.log(serverError);
	}



})(Speech);