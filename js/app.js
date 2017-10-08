let lettersInPlay = ['d', 'o', 'g', 'c', 'a', 't'];
let submittedWord;
let score = 0;

$(() => {

  const $playGame = $('#playGame');
  const $answerBox = $('#answerBox');

  $playGame.on('click', function() {
    prepareGame();
    startTimer();
    generateLetters();
    $answerBox.focus();
  });

  function prepareGame() {
    $('.intro, .cloudLeft, .cloudRight').css({'display': 'none'});
    $('h1').css({'font-size': '16px', 'position': 'fixed', 'left': '10px', 'top': '10px'});
    $answerBox.on('keypress', function(e) {
      if (e.which === 13) {
        e.preventDefault();
        checkAnswer();
        $answerBox.val('');
      }
    });
  }

  function startTimer() {

  }

  function generateLetters() {

  }

  function checkAnswer() {
    let wordIsValid = false;
    let correctLetters = 0;
    submittedWord = $answerBox.val();
    console.log(submittedWord);
    const splitAnswer = submittedWord.split('');
    console.log(splitAnswer);
    for (let i = 0; i < wordList.length; i++) {
      if (submittedWord === wordList[i]) {
        console.log('valid word');
        wordIsValid = true;
      }
    }
    // word check above works! Don't change!
    for (let i = 0; i < submittedWord.length; i++) {
      for (let j = 0; j < lettersInPlay.length; j++) {
        if (splitAnswer[i] === lettersInPlay[j]) {
          correctLetters++;
        }
      }
    }
    // letter validity check above works!
    if (wordIsValid === true && correctLetters === submittedWord.length) {
      console.log('ANSWER PASSES TEST');
    }
    // if both check conditions are met, as above
  }

  function displayResults() {

  }

});


/*

---WordGame--- (name TBC)

The basic logic of this game is that the user can enter (valid) words into an input
text area using ONLY the letters that they can see on the screen. The letters on
screen will fade in and fade out at random/defined intervals for random/defined
periods of time. The game will feature timed levels of increasing difficulty with
each introducing new functionality / game logic. The aim of the game is to progress
through the levels and record the highest score possible.

If progress is quick, add mini game / bonus rounds which feature something different
e.g. collision logic.

Plan of Action

1. Begin by cracking the key functions of the game:
    - check an entered word vs a list of English words to return a value of true or false
    - check an entered word vs the lettersInPlay array
    - create method for adding and removing letters from the array

2. Create the first level, the MVP.
    - design layout of game screen
    - add timer and score features
    - implement game logic defined above

3. Work on subsequent levels and extra functionality.

    Level structure v1 (20secs per level)
    Increase speed of letter disappearance each level, change weather.
    - Level 1 - Score more than X points (basic game)
    - Level 2 - Score more than X points using only green letters
    - Level 3 - Score more than X points using only capital letters (introduce lower case)
    - Level 4 - Score more than X points, words under 4 letters long not allowed
    - Level 5 - Score more than X points using only green, capital letters, no words under
                5 letters long allowed.


Basic Game Logic:
  - Instructions dictate level rules and win conditions.
  - On play, start timer.
  - On start timer, remove instructions, move title to top left (small), generate letters.
  - Letters appear in random screen location and fade out (6 secs), random letter is added to
  lettersInPlay array.
  - User enters word and presses enter.
  - Submitted word is checked against valid word list (array? txt file?).
  - Letters of submitted word are checked to make sure they are present in lettersInPlay array.
  - If both of the above return true, score is updated.
  - A green shadow/border is added to letters on screen.
  - This cycle repeats until timer runs out.
  - If score === win conditions, player passes the level and can move on to the next.
  - If score !== win conditions, player is asked to repeat level.

XMLHttpRequest cannot load file:///Users/georgewilman/Development/WDI_PROJECT_1/words.txt. Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.

*/
