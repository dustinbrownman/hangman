var wordLists = { 
  "coding" : ["computer", "array", "epicodus", "string", "boolean", "function", "object", "method", "callback", "property", "prototype", "javascript", "jquery", "language", "programming", "primatives", "syntax"],
  "beer": ["pilsner", "hops", "malt", "stout", "lager", "imperial", "amber", "bitter", "brewpub", "draft", "yeast", "alcohol", "barley", "body", "fermentation", "cider", "keg", "tap", "microbrewery"],
  "portland": ["beer", "hawthorne", "burnside", "tattoo", "powells", "willamette", "coffee", "max", "waterfront", "bicycle", "bridges", "weird", "startups"]
};

var Hangman = {
  bodyParts: 0,
  addBodyPart: function() {
    this.bodyParts++;
  },
  isComplete: function() {
    return this.bodyParts >= 7;
  }
};

var WordToGuess = {

  initialize: function(listOfWords) {
    this.listOfWords = (listOfWords);
    this.generateKey(this.selectWord());
    this.generateRevealedLetters();
  },

  selectWord: function() {
    return this.listOfWords[Math.floor(Math.random() * this.listOfWords.length)];
  },

  setCustomWord: function(customWord) {
    this.generateKey(customWord);
    this.generateRevealedLetters();
  },

  generateKey: function(word) {
    this.key = word.split("");
  },

  generateRevealedLetters: function() {
    this.revealedLetters = [];
    for (var i = this.key.length; i > 0; i--) {
      this.revealedLetters.push("");
    }
  },

  hasGuessedLetter: function(guessedLetter) {
    return this.key.some(function(unguessedLetter) {
      return unguessedLetter === guessedLetter;
    });
  },

  revealLetters: function(guessedLetter) {
    var key = this.key;
    this.revealedLetters = this.revealedLetters.map(function(revealedLetter, index) {
      if (guessedLetter === key[index]) {
        return guessedLetter;
      } else {
        return revealedLetter;
      }
    });
  },

  isRevealed: function() {
    return !this.revealedLetters.some(function(letter) {
      return letter === '';
    });
  }
};

var Game = {

  listOfLetters: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],

  initialize: function(listOfWords) {
    this.guessedLetters = [];
    this.incorrectGuessedLetters = [];
    var hangman = Object.create(Hangman);
    this.setHangman(hangman);

    var wordToGuess = Object.create(WordToGuess);
    wordToGuess.initialize(listOfWords);
    this.setWordToGuess(wordToGuess);
  },

  setWordToGuess: function(word) {
    this.wordToGuess = word;
  },

  setHangman: function(hangman) {
    this.hangman = hangman;
  },

  makeGuess: function(letter) {
    this.markLetterAsGuessed(letter);
    if (this.wordToGuess.hasGuessedLetter(letter)) {
      this.wordToGuess.revealLetters(letter);
    } else {
      this.markLetterAsIncorrectGuess(letter);
      this.hangman.addBodyPart();
    }
  },

  markLetterAsGuessed: function(letter) {
    this.guessedLetters.push(letter);
  },

  hasBeenGuessed: function(letter) {
    return this.guessedLetters.some(function(guessedLetter) {
      return guessedLetter === letter;
    });
  },

  markLetterAsIncorrectGuess: function(letter) {
    this.incorrectGuessedLetters.push(letter);
  },

  isOver: function(hangman, wordToGuess) {
    return hangman.isComplete() || wordToGuess.isRevealed();
  }
};

$(function() {
  var game;
  
  function newGame(listOfWords) {
    game = Object.create(Game);
    game.initialize(listOfWords);

    $('#incorrect-guesses h3').empty().append("Incorrect Guesses: ");

    $('#word-container').empty();
    game.wordToGuess.revealedLetters.forEach(function(letter) {
      $('#word-container').append("<p class='letter'>" + letter + "</p>");
    });

    $('#unguessed-letters').empty();
    game.listOfLetters.forEach(function(letter) {
      $("#unguessed-letters").append("<span class='letter-choice'>" + letter + "</span>");
    });   

    $(".letter-choice").click(function() {
      console.log("click");
      $(this).addClass("muted");
      var guessedLetter = $(this).text();

      if (game.hasBeenGuessed(guessedLetter)) {
        console.info("if this has been guessed");
        console.log("guessedLetter: " + guessedLetter);
        alert("That letter has already been guessed. Please select another letter.");
      } else {
        game.makeGuess(guessedLetter);
        console.info("The guessed letters");
        console.log(game.guessedLetters);

        $('#word-container').empty();
        game.wordToGuess.revealedLetters.forEach(function(letter) {
          $('#word-container').append("<p class='letter'>" + letter + "</p>");
        });

        $('div#hangman-sprite').removeClass().addClass('hangman-sprite' + game.hangman.bodyParts);

        $('#incorrect-guesses h3').empty().append("Incorrect Guesses: ");
        game.incorrectGuessedLetters.forEach(function(letter) {
          $('#incorrect-guesses h3').append(letter + " ");
        });

        if (game.isOver) {
          winningCondition(game);
        }
      }
    }); 
  }

  function winningCondition(gameObject) {
    if (gameObject.hangman.isComplete()) {
      $('#word-container').empty();
      gameObject.wordToGuess.key.forEach(function(letter) {
        $('#word-container').append("<p class='letter red'>" + letter + "</p>");
      });
      alert("You lose!");
      $("button#play-again").fadeIn();
      game.guessedLetters = [];
    } else if (gameObject.wordToGuess.isRevealed()) {
      $('#word-container').empty();
      gameObject.wordToGuess.key.forEach(function(letter) {
        $('#word-container').append("<p class='letter green'>" + letter + "</p>");
      });
      alert("You win!");
      $("button#play-again").fadeIn();
      game.guessedLetters = [];
    }
  }

  $("#choose-category ul li").click(function() {
    var categoryChoice = $(this).attr("id");
    $(".game-setup").fadeOut();
    $(".initially-hidden").delay(400).fadeIn();
    newGame(wordLists[categoryChoice]);
  });

  $("#play-again").click(function() {
    $(this).fadeOut();
    $(".initially-hidden").fadeOut();
    $(".game-setup").delay(400).fadeIn();
    $("#hangman-sprite").delay(400).removeClass().addClass("hangman-sprite0");
  });
});
