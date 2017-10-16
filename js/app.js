let lettersInPlay = [];
let submittedWord;
let countdown = 30;
let score = 0;
let counter = 0;
let currentLevel = 1;
let randomClass;
let ranPosTop;
let ranPosLeft;
let ranColor;
let letterToAdd;
let deleter;
let colorDeleter;
let wordIsValid;
let wordIsRepeat;
let splitAnswer;
let invalidLetters;
let totalScore = 0;
let timeoutArray = [];
const playedWords = [];

let $startGame;
let $playLevel;
let $answerBox;
let $clock;
let $letterSpace;
let $wordLog;
let $scoreboard;
let $scoreCount;
let $replayButton;
let $nextLevel;
let $restartButton;
let $endRoundScore;
let $finalScore;
let $scoreInfo;
let $levelHeader;
let $snow;
let $snowman;

const levelBlurb = ['', '', 'Things aren\'t so easy in level 2. Better wrap up!', 'It\'s getting dark... are you ready?'];

const level2Colors = ['rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(229, 118, 20, 1)', 'rgba(191, 38, 79, 1)'];
const level3Colors = ['rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(229, 118, 20, 1)', 'rgba(66, 86, 244, 1)'];

const alphabetUpper = ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'E', 'F', 'G', 'H', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'N', 'O', 'O', 'P', 'Q', 'R', 'R', 'S', 'S', 'T', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'];

$(init);

function init() {

  $startGame = $('#startGame');
  $answerBox = $('#answerBox');
  $clock = $('#countdown');
  $letterSpace = $('#letterSpace');
  $wordLog = $('#loggedWords');
  $scoreboard = $('#scoreboard');
  $scoreCount = $('#scoreCount');
  $replayButton = $('#replay');
  $nextLevel = $('#nextLevel');
  $playLevel = $('.playLevel');
  $restartButton = $('#restartGame');
  $endRoundScore = $('#score');
  $finalScore = $('#finalScore');
  $scoreInfo = $('#scoreInfo');
  $levelHeader = $('#levelHeader');
  $snow = $('.snow1, .snow2');
  $snowman = $('.snowman');

  // Adding event listeners:
  $startGame.on('click', startGameClick);
  $playLevel.on('click', playLevelClick);
  $answerBox.on('keypress', submitAnswer);
  $replayButton.on('click', replayClick);
  $nextLevel.on('click', nextLevelClick);
  $restartButton.on('click', restartClick);
}

function startGameClick() {
  $('.intro').hide();
  $('.level1Info').show();
}

function playLevelClick() {
  prepareGameScreen();
  resetGame();
  startTimer();
  generateLetters();
  $answerBox.focus();
}

function submitAnswer(e) {
  if (e.which === 13) {
    e.preventDefault();
    checkAnswer();
    $answerBox.val('');
  }
}

function replayClick() {
  prepareGameScreen();
  resetGame();
  startTimer();
  generateLetters();
  $answerBox.focus();
  $scoreCount.html(score);
}

function nextLevelClick() {
  showNewLevelInfo();
  showClock();
}

function restartClick() {
  resetGame();
  restartGame();
}

// 30 second timer function.
function startTimer() {
  showClock();
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
      clearGame();
      disableAnswerBox();
      displayResults();
    }
  }
}

// letter generation function for all levels
function generateLetters() {
  const timer = setInterval(() => {
    if ($clock.html() === '0') {
      clearInterval(timer);
      lettersInPlay = [];
      $('p.letters').remove();
      for (var i = 0; i < timeoutArray.length; i++) {
        clearTimeout(timeoutArray[i]);
      }
      return timeoutArray = [];
    }
    getRandomLetter();
    getRandomPosition();
    if (currentLevel === 1) {
      addLetter();
      level1Deleter();
    } else {
      addColorLetter();
      level2Deleter();
    }
  }, 800);
}

function checkAnswer() {
  wordIsValid = false;
  wordIsRepeat = false;
  isWordValid();
  areLettersValid();
  isWordRepeat();
  returnResult();
  // adds submittedWord to played words list to be checked on next answer...
  playedWords.push(submittedWord);
}

function scoreUpdate() {
  score = score + submittedWord.length;
  $scoreCount.html(score);
}

function displayResults() {
  if (currentLevel === 3) {
    if (score >= 15) {
      showFinalScore();
    } else if (score < 15) {
      showTimeUp();
      showReplay();
    }
  } else {
    if (score >= 15) {
      showTimeUp();
      showNextLevel();
    } else if (score < 15) {
      showTimeUp();
      showReplay();
    }
  }
  if (currentLevel === 1 && score >= 15) {
    currentLevel = 2;
  } else if (currentLevel === 2 && score >= 15) {
    currentLevel = 3;
  }
  $wordLog.html('');
}

function showNewLevelInfo() {
  totalScore = totalScore + score;
  score = 0;
  $scoreCount.html(score);
  $('.timeUp').hide();
  $levelHeader.html(`Level ${currentLevel}`);
  if (currentLevel === 2) {
    level2Settings();
  } else if (currentLevel === 3) {
    level3Settings();
  }
}

function level2Settings() {
  $snow.show();
  $snowman.show();
  $('.level2Info').show();
  $levelHeader.html('Level 2');
  $('.cloud1, .cloud2, .cloud3, .cloud4, body, footer').addClass('snowy');
}

function level3Settings() {
  $('.stars, .level3Info').show();
  $snow.hide();
  $snowman.hide();
  $('.sun').addClass('moon');
  $('.cloud1, .cloud2, .cloud3, .cloud4, body, footer').removeClass('snowy');
  $levelHeader.html('Level 3');
  $('.timeUp').css({'background': 'rgba(255, 255, 255, .4)'});
  $('footer').css({'background': 'rgba(32, 76, 43, 1)'});
  $('body').css({'background': 'rgba(0, 0, 0, 1)'});
}

function prepareGameScreen() {
  $letterSpace.show();
  $scoreboard.show();
  $('#rules, .level1Info, .timeUp, .level2Info, .level3Info, .cloudLeft, .cloudRight').hide();
  $('h1').css({'font-size': '16px', 'position': 'fixed', 'left': '10px', 'top': '10px'});
}

function resetGame() {
  score = 0;
  playedWords.length = 0;
  lettersInPlay = [];
  $answerBox.prop('disabled', false);
}

function clearGame() {
  submittedWord = '';
  $('p.letters').remove();
  $letterSpace.html('');
}

function restartGame() {
  $('.intro, #rules').show();
  $('.stars, .endGame').hide();
  $clock.hide();
  $('footer').css({'background': 'rgba(108, 209, 125, 1)'});
  $('body').css({'background': 'rgba(109, 228, 242, .8)'});
  $('h1').css({'font-size': '100px', 'position': 'static'});
  $('.sun').removeClass('moon');
  $scoreCount.html(score);
  currentLevel = 1;
  $levelHeader.html(`Level ${currentLevel}`);
}

function disableAnswerBox() {
  $answerBox.val('');
  $answerBox.prop('disabled', true);
}

function showClock() {
  countdown = 30;
  $clock.html(countdown).css({'color': 'rgba(255, 255, 255, 1)'});
  $clock.show();
}

function getRandomLetter() {
  const ranNum = Math.floor(Math.random() * 37);
  letterToAdd = alphabetUpper[ranNum];
}

function getRandomPosition() {
  ranPosTop = (Math.floor(Math.random() * 426) + 35).toString();
  ranPosLeft = (Math.floor(Math.random() * 861) + 1).toString();
  if (parseInt(ranPosLeft) > 800) {
    ranPosTop = (Math.floor(Math.random() * 186) + 240).toString();
  }
}

function addLetter() {
  appendRanClassP();
  lettersInPlay.push(letterToAdd);
}

function addColorLetter() {
  appendRanClassP();
  ranColor = Math.floor(Math.random() * 7);
  if (currentLevel === 2) {
    $('p.' + randomClass).html(letterToAdd).css({'color': level2Colors[ranColor]});
  } else if (currentLevel === 3) {
    $('p.' + randomClass).html(letterToAdd).css({'color': level3Colors[ranColor]});
  }
  if (ranColor === 0 || ranColor === 1 || ranColor === 2 || ranColor === 3 || ranColor === 4) {
    lettersInPlay.push(letterToAdd);
  }
}

function appendRanClassP() {
  counter++;
  randomClass = counter.toString();
  $letterSpace.append($('<p></p>').addClass(randomClass).addClass('letters'));
  $('p.' + randomClass).html(letterToAdd).css({
    'top': ranPosTop + 'px',
    'left': ranPosLeft + 'px'
  });
}

function level1Deleter() {
  deleter = setTimeout(() => {
    $('p.letters')[0].remove();
    lettersInPlay.splice(0, 1);
  }, 8950);
  timeoutArray.push(deleter);
}

function level2Deleter() {
  colorDeleter = setTimeout(() => {
    $('p.letters')[0].remove();
    if (ranColor === 0 || ranColor === 1 || ranColor === 2 || ranColor === 3 || ranColor === 4) {
      lettersInPlay.splice(0, 1);
    }
  }, 8950);
  timeoutArray.push(colorDeleter);
}

// checks if word has a match in word list...
// <4-letter words not allowed in level 3.
function isWordValid() {
  submittedWord = $answerBox.val().toUpperCase();
  splitAnswer = submittedWord.split('');
  for (let i = 0; i < wordList.length; i++) {
    if (submittedWord === wordList[i]) {
      wordIsValid = true;
    }
  }
  if (currentLevel === 3) {
    if (submittedWord.length < 4) {
      wordIsValid = false;
    }
  }
}

// checks if letters used are valid letters in play (by returning any extras)...
function areLettersValid() {
  invalidLetters = splitAnswer.filter(val => !lettersInPlay.includes(val));
}

// checks if word has already been played in level...
function isWordRepeat() {
  for (let i = 0; i < playedWords.length; i++) {
    if (submittedWord === playedWords[i]) {
      wordIsRepeat = true;
    }
  }
}

// checks if answer passes the above three tests. Adds results to word log...
function returnResult() {
  if (wordIsValid === true && invalidLetters.length === 0 && wordIsRepeat === false) {
    $wordLog.append($(`<span>${submittedWord}</span>`).addClass('green'));
    scoreUpdate();
  } else {
    $wordLog.append($(`<span>${submittedWord}</span>`).addClass('red'));
  }
}

function showTimeUp() {
  $('.timeUp, .cloudLeft, .cloudRight').show();
  $letterSpace.hide();
  $endRoundScore.html(score);
}

function showReplay() {
  $replayButton.show();
  $nextLevel.hide();
  $scoreInfo.html('<br>Unlucky, you didn\'t quite make it! Have another go...');
}

function showNextLevel() {
  $nextLevel.show();
  $replayButton.hide();
  $scoreInfo.html(`<br>Congratulations, you beat level ${currentLevel}! ${levelBlurb[currentLevel + 1]}`);
}

function showFinalScore() {
  $('.endGame, .cloudLeft, .cloudRight').show();
  $letterSpace.hide();
  $finalScore.html(totalScore);
}


/*

---WeeWords---

The basic logic of this game is that the user can enter (valid) words into an input
text area using ONLY the letters that they can see on the screen. The letters on
screen will fade in and fade out at random/defined intervals for random/defined
periods of time. The game will feature timed levels of increasing difficulty with
each introducing new functionality / game logic. The aim of the game is to progress
through the levels and record the highest score possible.

Key functions of the game:
- check an entered word vs a list of English words to return a value of true or false
- check an entered word vs the lettersInPlay array
- create method for adding and removing letters from the array

Level structure (30secs per level)
Change weather each level.
- Level 1 - Score more than X points (basic game)
- Level 2 - Score more than X points using only blue letters
- Level 3 - Score more than X points using only red letters, words under 4 letters long not allowed

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
- This cycle repeats until timer runs out.
- If score === win conditions, player passes the level and can move on to the next.
- If score !== win conditions, player is asked to repeat level.

*/
