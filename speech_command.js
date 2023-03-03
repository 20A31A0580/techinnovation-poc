let recognizer;
let words;
let wordList;
let modelLoaded = false;
var speech = true;
function speak (message) {
    var msg = new SpeechSynthesisUtterance(message)
    var voices = window.speechSynthesis.getVoices()
    msg.voice = voices[4]
    
    window.speechSynthesis.speak(msg)
  }

$( document ).ready(function() {
    wordList = ["zero","one","two","three","four","five","six","seven","eight","nine", "yes", "no", "up", "down", "left", "right", "stop", "go"];
    $.each(wordList, function( index, word ) {
        if (!word.startsWith('_')){
            $("#candidate-words").append(`<span class='candidate-word col-md-2 col-sm-3 col-3' id='word-${word}'>${word}</span>`);
        }
    });
});

$("#audio-switch").change(function() {
    if(this.checked ){
        speak("welcome to drishti ,say one for business ,say two for engineering ,say three for accounting, say four for stenography say five for cosmetic and hairstyle ,  say go for playing the audio, say stop for pausing the video, say left for moving to previous page ,say right for moving to next page ,say eight to repeat the menu instructions")
        
        if(!modelLoaded){
            loadModel();
        }else{
            startListening();
        }
    }
    else {
        stopListening();
    }   
});

function loadModel(){
    $(".progress-bar").removeClass('d-none'); 
    // When calling `create()`, you must provide the type of the audio input.
    // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
    // - BROWSER_FFT uses the browser's native Fourier transform.
    // - SOFT_FFT uses JavaScript implementations of Fourier transform (not implemented yet).
    recognizer = speechCommands.create('BROWSER_FFT');  
    Promise.all([
        // Make sure that the underlying model and metadata are loaded via HTTPS requests.
        recognizer.ensureModelLoaded()
      ]).then(function(){
        $(".progress-bar").addClass('d-none');
        words = recognizer.wordLabels();
        $.each(words, function( index, word ) {
            if (!word.startsWith('_') && !wordList.includes(word)){
                $("#candidate-words").append(`<span class='candidate-word' id='word-${word}'>${word}</span>`);
            }
        });
        modelLoaded = true;
        startListening();
      })
}
function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
 }  
function startListening(){
    // `listen()` takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields such a
    //    - includeSpectrogram
    //    - probabilityThreshold
    //    - includeEmbedding
    recognizer.listen(({scores}) => {
        // scores contains the probability scores that correspond to recognizer.wordLabels().
        // Turn scores into a list of (score,word) pairs.
        scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
        // Find the most probable word.
        scores.sort((s1, s2) => s2.score - s1.score);
        
        
        switch(scores[0].word){

            case "one" :  window.location.href = "audfile.html";
                            speak("navigated to next webpage , say go to play the audio , say stop to pause the  audio");
                            break;

           
            case "left" : window.history.back();
                            break;
            case "right" : window.history.forward();
                            break;
            case "nine":  speak("closing drishti ");
                          window.close();
                          
                               break;
            
        }
       
    }, 
    {
        probabilityThreshold: 0.70
    });
}

function stopListening(){
    recognizer.stopListening();
} 
