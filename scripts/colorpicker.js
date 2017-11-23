(function(Speech) {

	const results = document.querySelector('.result');	
	const colors = ['blue', 'orange', 'red', 'green', 'pink', 'purple', 'brown', 'black', 'yellow', 'magenta'];
	const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
	const speechButton = document.querySelector('.microphone__btn');

	var recognition = new Speech.SpeechRecognition();
	var speechRecognitionList = new Speech.SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	//recognition.continuous = false;
	recognition.lang = 'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	var diagnostic = document.querySelector('.output');
	var bg = document.querySelector('body');
	var hints = document.querySelector('.choices');
	console.log('speech btn: ', speechButton.classList);

	var colorHTML= '';
	colors.forEach(function(v, i, a){
	  console.log(v, i);
	  colorHTML += '<div class="color" style="background-color:' + v + ';"> ' + v + ' </div>';
	});
	hints.innerHTML = colorHTML;

	speechButton.onclick = function() {
	  recognition.start();
	  console.log('Ready to receive a color command.');
	  speechButton.classList.add('microphone__btn--listening');
	}

	recognition.onresult = function(event) {
	  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
	  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
	  // It has a getter so it can be accessed like an array
	  // The [last] returns the SpeechRecognitionResult at the last position.
	  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
	  // These also have getters so they can be accessed like arrays.
	  // The [0] returns the SpeechRecognitionAlternative at position 0.
	  // We then return the transcript property of the SpeechRecognitionAlternative object

	  var last = event.results.length - 1;
	  var color = event.results[last][0].transcript;

	  diagnostic.textContent = 'Result received: ' + color + '.';
	  bg.style.backgroundColor = color;
	  console.log('Event: ', event);
	  console.info('Result received: ' + color + '.');
	  console.log('Confidence: ' + event.results[0][0].confidence);
	  clearSpeechBtnClasslist(speechButton);
	  speechButton.classList.add('microphone__btn--gotresult');
	}

	recognition.onspeechend = function() {
	  recognition.stop();
	  clearSpeechBtnClasslist(speechButton);
	  speechButton.classList.add('microphone__btn--stopped');
	}

	recognition.onnomatch = function(event) {
	  diagnostic.textContent = "I didn't recognise that color.";
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


})(Speech);