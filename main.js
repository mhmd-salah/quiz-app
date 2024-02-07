

let countSpan = document.querySelector( ".quiz-info .count span" );
let bulletsSpanContainer = document.querySelector( ".bullets .spans" )
let quizArea = document.querySelector( ".quiz-area" )
let answersArea = document.querySelector( ".answers-area" )
let submitButton = document.querySelector( ".submit-button" )
let bullets = document.querySelector( ".bullets" )
let resultsContainer = document.querySelector( ".results" )
let countdownElement = document.querySelector( ".countdown " )
// set option 
let currentIndex = 0;
let rightAnswer = 0;
let coundowninterval;

function getQuestion () {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function() {
    if ( this.readyState === 4 && this.status === 200 ) {
      let questionsObject = JSON.parse( this.response )

      let qCount = questionsObject.length;
      createbullets( qCount )
      addQuestionData( questionsObject[ currentIndex ], qCount );
      countdown( 3, qCount )
      submitButton.onclick = function() {
        let theRightAnswer = questionsObject[ currentIndex ].right_answer;
        currentIndex++
        checkAnswer( theRightAnswer, qCount );
        // remove previous 
        quizArea.innerHTML = ""
        answersArea.innerHTML = ""
        addQuestionData( questionsObject[ currentIndex ], qCount );
        // handle bullets class
        handleBullets();
        clearInterval( coundowninterval )
        countdown( 3, qCount )
        showResult( qCount );
      }
    }
  }

  myRequest.open( "GET", "html_questions.json", true )
  myRequest.send()
}
getQuestion``

function createbullets ( num ) {
  countSpan.innerHTML = num
  // create spans 
  for ( let i = 0; i < num; i++ ) {
    let theBullet = document.createElement( "span" )
    if ( i === 0 ) {
      theBullet.className = "on"
    }
    bulletsSpanContainer.appendChild( theBullet )
  }
}
function addQuestionData ( obj, count ) {
  if ( currentIndex < count ) {

    let questionTitle = document.createElement( "h2" )
    let questionText = document.createTextNode( obj.title )
    questionTitle.appendChild( questionText )
    quizArea.appendChild( questionTitle )
    // create answers 
    for ( let i = 1; i <= 4; i++ ) {
      let mainDiv = document.createElement( "div" )
      mainDiv.className = "answer";
      let radioInput = document.createElement( "input" )
      radioInput.name = "question"
      radioInput.type = "radio"
      radioInput.id = `answer_${ i }`
      radioInput.dataset.answer = obj[ `answer_${ i }` ]
      if ( i === 1 ) {
        radioInput.checked = true
      }
      // create lable 
      let theLable = document.createElement( "label" )
      theLable.htmlFor = `answer_${ i }`;
      // create text lable 
      let theLableText = document.createTextNode( obj[ `answer_${ i }` ] )
      theLable.appendChild( theLableText );
      mainDiv.appendChild( radioInput )
      mainDiv.appendChild( theLable )
      answersArea.appendChild( mainDiv )

    }

  }
}

function checkAnswer ( rAnswer, count ) {
  let answers = document.getElementsByName( "question" );
  let theChoosenAnswer;

  for ( let i = 0; i < answers.length; i++ ) {
    if ( answers[ i ].checked ) {
      theChoosenAnswer = answers[ i ].dataset.answer;
    }
  }
  if ( rAnswer === theChoosenAnswer ) {
    rightAnswer++
    console.log( "good answer" )
  }

}
function handleBullets () {
  let bulletsSpans = document.querySelectorAll( ".bullets .spans span" )
  let arrayOfSpans = Array.from( bulletsSpans )
  arrayOfSpans.forEach( ( span, index ) => {
    if ( currentIndex === index ) {
      span.className = "on"
    }
  } );
}
function showResult ( count ) {
  let theResults;
  if ( currentIndex === count ) {
    quizArea.remove()
    answersArea.remove()
    submitButton.remove()
    bullets.remove()
    if ( rightAnswer > ( count / 2 ) && rightAnswer < count ) {
      theResults = `<span class="Good">good</span>, ${ rightAnswer } from ${ count } is Good`
    } else if ( rightAnswer === count ) {
      theResults = `<span class="prefect">Perfect</span>, ${ rightAnswer } from ${ count } is Perfect`
    } else {
      theResults = `<span class="bad">Bad</span>, ${ rightAnswer } from ${ count } is Bad`
    }
    resultsContainer.innerHTML = theResults;
  }
}

function countdown ( duration, count ) {
  if ( currentIndex < count ) {
    let minutes, seconds;
    coundowninterval = setInterval( function() {
      minutes = parseInt( duration / 60 );
      seconds = parseInt( duration % 60 );

      minutes = minutes < 10 ? `0${ minutes }` : minutes;
      seconds = seconds < 10 ? `0${ seconds }` : seconds;

      countdownElement.innerHTML = `${ minutes }:${ seconds }`;

      if ( --duration < 0 ) {
        clearInterval( coundowninterval );
        submitButton.click();
      }
    }, 1000 );
  }
}
if ( location.port === "" ) {
  document.body.remove()
}