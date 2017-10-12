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

const levelBlurb = ['', '', 'Things aren\'t so easy in level 2. Better wrap up!', 'It\'s getting dark... are you ready?'];

const level2Colors = ['rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(66, 86, 244, 1)', 'rgba(229, 118, 20, 1)', 'rgba(191, 38, 79, 1)'];
const level3Colors = ['rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(191, 38, 79, 1)', 'rgba(229, 118, 20, 1)', 'rgba(66, 86, 244, 1)'];

const alphabetUpper = ['A', 'A', 'B', 'C', 'D', 'E', 'E', 'E', 'F', 'G', 'H', 'H', 'I', 'I', 'J', 'K', 'L', 'M', 'N', 'N', 'O', 'O', 'P', 'Q', 'R', 'R', 'S', 'S', 'T', 'T', 'U', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
  const $lev3Button = $('#lev3Button');
  const $restartButton = $('#restartGame');
  const $endRoundScore = $('#score');
  const $finalScore = $('#finalScore');
  const $scoreInfo = $('#scoreInfo');
  const $levelHeader = $('#levelHeader');
  const $snow = $('.snow1, .snow2');
  const $snowman = $('.snowman');


  // Adding event listeners:
  $playGame.on('click', function() {
    prepareGameScreen();
    resetGame();
    startTimer();
    generateLetters();
    $answerBox.focus();
  });

  $answerBox.on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      checkAnswer();
      $answerBox.val('');
    }
  });

  $replayButton.on('click', function() {
    prepareGameScreen();
    resetGame();
    startTimer();
    generateLetters();
    $answerBox.focus();
    score = 0;
    $scoreCount.html(score);
  });

  $nextLevel.on('click', function() {
    showNewLevelInfo();
    showClock();
  });

  $lev2Button.on('click', function() {
    prepareGameScreen();
    resetGame();
    generateLetters();
    startTimer();
    $answerBox.focus();
  });

  $lev3Button.on('click', function() {
    prepareGameScreen();
    resetGame();
    generateLetters();
    startTimer();
    $answerBox.focus();
  });

  $restartButton.on('click', function() {
    resetGame();
    restartGame();
  });

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
        totalScore = totalScore + score;
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
    $lev2Button.css({'margin': '60px auto 30px auto'});
    $snow.show();
    $snowman.show();
    $('.level2Info').show();
    $levelHeader.html('Level 2');
    $('.cloud1, .cloud2, .cloud3, .cloud4, body, footer').addClass('snowy');
  }

  function level3Settings() {
    $('.timeUp').css({'background': 'rgba(255, 255, 255, .4)'});
    $lev3Button.css({'margin': '28px auto 30px auto'});
    $snow.hide();
    $snowman.hide();
    $('footer').css({'background': 'rgba(32, 76, 43, 1)'});
    $('.stars').show();
    $('.sun').addClass('moon');
    $('.level3Info').show();
    $levelHeader.html('Level 3');
    $('.cloud1, .cloud2, .cloud3, .cloud4, body, footer').removeClass('snowy');
    $('body').css({'background': 'rgba(0, 0, 0, 1)'});
  }

  // sets up game screen and focuses on word input.
  function prepareGameScreen() {
    $('#rules, .intro, .timeUp, .level2Info, .level3Info, .cloudLeft, .cloudRight').hide();
    $letterSpace.show();
    $scoreboard.show();
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
    $('.intro').show();
    $('footer').css({'background': 'rgba(108, 209, 125, 1)'});
    $('body').css({'background': 'rgba(109, 228, 242, .8)'});
    $('.stars').hide();
    $('.endGame').hide();
    $('h1').css({'font-size': '100px', 'position': 'static'});
    $('#rules').show();
    $('.sun').removeClass('moon');
    $clock.hide();
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
    counter++;
    randomClass = counter.toString();
    lettersInPlay.push(letterToAdd);
    $letterSpace.append($('<p></p>').addClass(randomClass).addClass('letters'));
    $('p.' + randomClass).html(letterToAdd).css({
      'top': ranPosTop + 'px',
      'left': ranPosLeft + 'px'
    });
  }

  function addColorLetter() {
    counter++;
    randomClass = counter.toString();
    $letterSpace.append($('<p></p>').addClass(randomClass).addClass('letters'));
    ranColor = Math.floor(Math.random() * 7);
    $('p.' + randomClass).html(letterToAdd).css({
      'top': ranPosTop + 'px',
      'left': ranPosLeft + 'px'
    });
    if (currentLevel === 2) {
      $('p.' + randomClass).html(letterToAdd).css({'color': level2Colors[ranColor]});
    } else if (currentLevel === 3) {
      $('p.' + randomClass).html(letterToAdd).css({'color': level3Colors[ranColor]});
    }
    if (ranColor === 0 || ranColor === 1 || ranColor === 2 || ranColor === 3 || ranColor === 4) {
      lettersInPlay.push(letterToAdd);
    }
  }

  function level1Deleter() {
    deleter = setTimeout(() => {
      $('p.letters')[0].remove();
      lettersInPlay.splice(0, 1);
    }, 8900);
    timeoutArray.push(deleter);
  }

  function level2Deleter() {
    colorDeleter = setTimeout(() => {
      $('p.letters')[0].remove();
      if (ranColor === 0 || ranColor === 1 || ranColor === 2 || ranColor === 3 || ranColor === 4) {
        lettersInPlay.splice(0, 1);
      }
    }, 8900);
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
    $replayButton.show().css({'margin': '70px auto 30px auto'});
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
