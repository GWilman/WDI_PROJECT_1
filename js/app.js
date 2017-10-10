let lettersInPlay = [];
let submittedWord;
let playedWords = [];
let score = 0;
let counter = 0;
let currentLevel = 1;
const level2Colors = ['rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(229, 118, 20, 1)', 'rgba(191, 38, 79, 1)'];

// const alphabetLower = ['a', 'a', 'b', 'c', 'd', 'e', 'e', 'f', 'g', 'h', 'i', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'o', 'p', 'q', 'r', 's', 't', 'u', 'u', 'v', 'w', 'x', 'y', 'z'];
const alphabetUpper = ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'F', 'G', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'];

$(() => {

  const $playGame = $('#playGame');
  const $answerBox = $('#answerBox');
  const $clock = $('#countdown');
  const $letterSpace = $('#letterSpace');
  const $wordLog = $('#loggedWords');
  const $scoreboard = $('#scoreboard');
  const $scoreCount = $('#scoreCount');
  const $replayButton = $('#replay');
  const $nextLevel = $('#nextLevel');
  const $lev2Button = $('#lev2Button');
  const $endRoundScore = $('#score');
  const $scoreInfo = $('#scoreInfo');
  const $levelHeader = $('#levelHeader');

  $playGame.on('click', function() {
    prepareGame();
    startTimer();
    generateLetters();
    $answerBox.focus();
  });

  $replayButton.on('click', function() {
    prepareGame();
    generateLetters();
    startTimer();
    $answerBox.focus();
  });

  $nextLevel.on('click', function() {
    if (currentLevel === 2) {
      $('.level2Info').css({'display': 'block'});
      $('.timeUp').css({'display': 'none'});
      $lev2Button.css({'margin': '70px auto 30px auto'});
    }
  });

  $lev2Button.on('click', function() {
    prepareGame();
    $levelHeader.html('Level 2');
    score = 0;
    $scoreCount.html(score);
    generateLettersLevel2();
    startTimer();
    $answerBox.focus();
  });

  function prepareGame() {
    $('.intro, .timeUp, .level2Info, .cloudLeft, .cloudRight').css({'display': 'none'});
    $letterSpace.css({'display': 'block'});
    $scoreboard.css({'display': 'block'});
    score = 0;
    playedWords = [];
    $('h1').css({'font-size': '16px', 'position': 'fixed', 'left': '10px', 'top': '10px'});
    $answerBox.prop('disabled', false);
    $answerBox.on('keypress', function(e) {
      if (e.which === 13) {
        e.preventDefault();
        checkAnswer();
        $answerBox.val('');
      }
    });
  }

  function startTimer() {
    let countdown = 30;
    $clock.html(countdown);
    $clock.css({'display': 'block'});
    const timer = setInterval(() => {
      countdown--;
      $clock.html(countdown);
      checkValue();
    }, 1000);
    function checkValue() {
      if (countdown <= 3) {
        $($clock.css({'color': 'rgba(219, 37, 37, 1)'}));
      }
      if (countdown === 0) {
        clearInterval(timer);
        $answerBox.val('');
        $answerBox.prop('disabled', true);
        $letterSpace.html('');
        submittedWord = '';
        lettersInPlay = [];
        displayResults();
      }
    }
  }

  // generate random position min (top: min 55px max 600px) (left: min 0px max 1000px)
  // if left > 800px... min top =  240px;

  function generateLetters() {
    const timer = setInterval(() => {
      counter++;
      const randomClass = counter.toString();
      const ranNum = Math.floor(Math.random() * 26);
      const letterToAdd = alphabetUpper[ranNum];
      lettersInPlay.push(letterToAdd);
      let ranPosTop = (Math.floor(Math.random() * 426) + 35).toString();
      const ranPosLeft = (Math.floor(Math.random() * 861) + 1).toString();
      if (parseInt(ranPosLeft) > 800) {
        ranPosTop = (Math.floor(Math.random() * 186) + 240).toString();
      }
      $letterSpace.append($('<p></p>').addClass(randomClass).addClass('letters'));
      $('p.' + randomClass).html(letterToAdd).css({
        'top': ranPosTop + 'px',
        'left': ranPosLeft + 'px'
      });
      setTimeout(() => {
        $('p.' + randomClass).remove();
        delete lettersInPlay[randomClass];
      }, 8900);
      checkValue();
    }, 800);
    function checkValue() {
      if ($clock.html() === '0') {
        clearInterval(timer);
      }
    }
  }

  function generateLettersLevel2() {
    const timer = setInterval(() => {
      counter++;
      const randomClass = counter.toString();
      const ranNum = Math.floor(Math.random() * 26);
      const letterToAdd = alphabetUpper[ranNum];
      const ranColor = Math.floor(Math.random() * 6);
      if (ranColor === 0 || ranColor === 1 || ranColor === 2 || ranColor === 3) {
        lettersInPlay.push(letterToAdd);
        setTimeout(() => {
          lettersInPlay.shift();
        }, 8900);
      }
      let ranPosTop = (Math.floor(Math.random() * 426) + 35).toString();
      const ranPosLeft = (Math.floor(Math.random() * 861) + 1).toString();
      if (parseInt(ranPosLeft) > 800) {
        ranPosTop = (Math.floor(Math.random() * 186) + 240).toString();
      }
      $letterSpace.append($('<p></p>').addClass(randomClass).addClass('letters'));
      $('p.' + randomClass).html(letterToAdd).css({
        'top': ranPosTop + 'px',
        'left': ranPosLeft + 'px',
        'color': level2Colors[ranColor]
      });
      setTimeout(() => {
        $('p.' + randomClass).remove();
      }, 8900);
      checkValue();
    }, 800);
    function checkValue() {
      if ($clock.html() === '0') {
        clearInterval(timer);
      }
    }
  }

  function checkAnswer() {
    let wordIsValid = false;
    let wordIsRepeat = false;
    // checks if word has a match in word list...
    submittedWord = $answerBox.val().toUpperCase();
    console.log(submittedWord);
    const splitAnswer = submittedWord.split('');
    console.log(splitAnswer);
    for (let i = 0; i < wordList.length; i++) {
      if (submittedWord === wordList[i]) {
        console.log('valid word');
        wordIsValid = true;
      }
    }
    // checks if letters used are valid letters in play (by returning any extras)...
    const invalidLetters = splitAnswer.filter(val => !lettersInPlay.includes(val));
    // checks if word has already been played in level...
    for (let i = 0; i < playedWords.length; i++) {
      if (submittedWord === playedWords[i]) {
        wordIsRepeat = true;
      }
    }
    // checks if answer passes the above three tests. Adds results to word log...
    if (wordIsValid === true && invalidLetters.length === 0 && wordIsRepeat === false) {
      console.log('ANSWER PASSES TEST');
      $wordLog.append($(`<span>${submittedWord}</span>`).addClass('green'));
      scoreUpdate();
    } else {
      console.log('FAIL');
      $wordLog.append($(`<span>${submittedWord}</span>`).addClass('red'));
    }
    // adds submittedWord to played words list to be checked on next answer...
    playedWords.push(submittedWord);
  }

  function scoreUpdate() {
    score = score + submittedWord.length;
    $scoreCount.html(score);
    if (currentLevel === 1 && score >= 15) {
      currentLevel = 2;
    }
  }

  function displayResults() {
    $('.timeUp, .cloudLeft, .cloudRight').css({'display': 'block'});
    $letterSpace.css({'display': 'none'});
    $endRoundScore.html(score);
    if (currentLevel === 2) {
      $nextLevel.css({'display': 'block'});
      $replayButton.css({'display': 'none'});
      $scoreInfo.html('<br>Congratulations, you beat level one! Things get a little more tricky in level two...');
    } else if (currentLevel === 1) {
      $replayButton.css({
        'display': 'block',
        'margin': '70px auto 30px auto'
      });
      $nextLevel.css({'display': 'none'});
      $scoreInfo.html('<br>Unlucky, you didn\'t quite make it! Have another go...');
    }
    $wordLog.html('');
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
