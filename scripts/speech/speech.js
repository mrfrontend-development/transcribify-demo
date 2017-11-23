var Speech = (function() {
	var speechModule = {};

	speechModule.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	speechModule.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
	speechModule.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
	speechModule.SpeechSynthesis = window.speechSynthesis;
	speechModule.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

	return speechModule;

})();