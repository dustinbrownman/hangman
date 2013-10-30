describe('Hangman', function() {
  it('starts with no body parts drawn', function() {
    var hangman = Object.create(Hangman);
    hangman.bodyParts.should.equal(0);
  });

  it('can add a body part', function() {
    var hangman = Object.create(Hangman);
    hangman.addBodyPart();
    hangman.bodyParts.should.equal(1);
  });

  it('is complete when it has six body parts', function() {
    var hangman = Object.create(Hangman);
    for (var i = 0; i < 7; i++) {
      hangman.addBodyPart();
    }
    hangman.isComplete().should.be.true;
  });

  it('is not complete if it has less than six body parts', function() {
    var hangman = Object.create(Hangman);
    hangman.isComplete().should.be.false;
  });
});

describe("WordToGuess", function() {
  it('has a list of possible words', function() {
    var wordToGuess = Object.create(WordToGuess);
    wordToGuess.initialize(["pizza", "pie"]);
    wordToGuess.listOfWords.should.exist;
  });

  describe("selectWord", function() {
    it('randomly selects a word for the game', function() {
      var wordToGuess = Object.create(WordToGuess);
      wordToGuess.initialize(["foo", "bar"]);
      sinon.stub(Math, 'random').returns(0);
      wordToGuess.selectWord().should.equal(wordToGuess.listOfWords[0]);
      Math.random.restore();
    });    
  });

  describe('setCustomWord', function() {
    it('allow the player to set a custom word', function() {
      var wordToGuess = Object.create(WordToGuess);
      wordToGuess.setCustomWord("dive");
      wordToGuess.key.should.eql(["d", "i", "v", "e"]);
    });
  });

  it('generates the key for a given word', function() {
    var wordToGuess = Object.create(WordToGuess);
    wordToGuess.generateKey("epicodus");
    wordToGuess.key.should.eql(["e", "p", "i", "c", "o", "d", "u", "s"]);
  });

  describe('generateRevealedLetters', function() {
    it('starts with an array of blanks equal to the length of the key', function() {
      var wordToGuess = Object.create(WordToGuess);
      wordToGuess.generateKey("epicodus");
      wordToGuess.generateRevealedLetters();
      wordToGuess.revealedLetters.should.eql(["", "", "", "", "", "", "", ""]); 
    });
  });

  describe('hasGuessedLetter', function() {
    it('returns false if the letter does not match any of the unguessed letters', function() {
      var wordToGuess = Object.create(WordToGuess);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      wordToGuess.initialize();
      WordToGuess.selectWord.restore();
      wordToGuess.hasGuessedLetter("z").should.be.false;
    });

    it('returns true if the guessed letter matches any of the unguessed letters', function() {
      var wordToGuess = Object.create(WordToGuess);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      wordToGuess.initialize();
      WordToGuess.selectWord.restore();
      wordToGuess.hasGuessedLetter("o").should.be.true;
    });
  });

  describe('revealLetters', function() {
    it('reveals letters in the revealedLetters array if the guessed letter matches', function() {
      var wordToGuess = Object.create(WordToGuess);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      wordToGuess.initialize();
      WordToGuess.selectWord.restore();
      wordToGuess.revealLetters("o");
      wordToGuess.revealedLetters.should.eql(['', 'o', 'o', '', '', '', '', '']);
    });
  });

  describe('isRevealed', function() {
    it('returns true if the word has been fully revealed', function() {
      var wordToGuess = Object.create(WordToGuess);
      sinon.stub(WordToGuess, 'selectWord').returns("yes");
      wordToGuess.initialize();
      WordToGuess.selectWord.restore();
      wordToGuess.revealLetters('y');
      wordToGuess.revealLetters('e');
      wordToGuess.revealLetters('s');
      wordToGuess.isRevealed().should.be.true;
    });
  });
});

describe('Game', function() {

  describe('initialize', function() {
    it('creates and sets the hangman for the game', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.hangman.exist;
    });

    it('creates and sets a word to guess for the game', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.wordToGuess.should.exist;
    });
  });

  describe('setWordToGuess', function() {
    it('sets the word to guess for the game', function() {
      var game = Object.create(Game);
      var wordToGuess = Object.create(WordToGuess);
      game.setWordToGuess(wordToGuess);
      game.wordToGuess.should.equal(wordToGuess);
    });
  });

  describe('setHangman', function() {
    it('sets the hangman for the current game', function() {
      var game = Object.create(Game);
      var hangman = Object.create(Hangman);
      game.setHangman(hangman);
      game.hangman.should.equal(hangman);
    });
  });

  describe('makeGuess', function() {
    it('marks a letter as guessed', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.makeGuess('a');
      game.guessedLetters.length.should.equal(1);
    });

    it("reveals the letter in the word to guess", function() {
      var game = Object.create(Game);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      game.initialize(["foo", "bar"]);
      WordToGuess.selectWord.restore();
      game.makeGuess("f");
      game.wordToGuess.revealedLetters.should.eql(["f", "", "", "", "", "", "", ""]);
    });

    it("marks the letter as incorrect if it is not in the word to guess", function() {
      var game = Object.create(Game);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      game.initialize(["foo", "bar"]);
      WordToGuess.selectWord.restore();
      game.makeGuess('z');
      game.incorrectGuessedLetters.length.should.equal(1);
    });

    it("adds a body part to the hangman if the letter is an incorrect guess", function() {
      var game = Object.create(Game);
      sinon.stub(WordToGuess, 'selectWord').returns("football");
      game.initialize(["foo", "bar"]);
      WordToGuess.selectWord.restore();
      game.makeGuess('z');
      game.hangman.bodyParts.should.equal(1);
    });
  });

  it('has an array of guessed letters', function() {
    var game = Object.create(Game);
    game.initialize(["foo", "bar"]);
    game.guessedLetters.should.eql([]);
  });

  it('has an array of incorrect guessed letters', function() {
    var game = Object.create(Game);
    game.initialize(["foo", "bar"]);
    game.incorrectGuessedLetters.should.eql([]);
  });

  describe('markLetterAsGuessed', function() {
    it('adds a letter to the array of guessed letters', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.markLetterAsGuessed('a');
      game.guessedLetters.should.eql(['a']);
    });
  });

  describe('hasBeenGuessed', function() {
    it('returns true if the letter has been guessed', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.markLetterAsGuessed('a');
      game.hasBeenGuessed('a').should.be.true;
    });

    it('returns false if the letter has not been guessed', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.hasBeenGuessed('z').should.be.false;
    });
  });

  describe('markLetterAsIncorrectGuess', function() {
    it('adds a letter to the incorrect guesses', function() {
      var game = Object.create(Game);
      game.initialize(["foo", "bar"]);
      game.markLetterAsIncorrectGuess('p');
      game.incorrectGuessedLetters.should.eql('p');
    });
  });

  describe('isOver', function() {
    it("returns true if the hangman's body is complete", function() {
      var game = Object.create(Game);
      var hangman = Object.create(Hangman);
      hangman.bodyParts = 7;
      game.isOver(hangman).should.be.true;
    });

    it("returns true if the word is revealed", function() {
      var game = Object.create(Game);
      var hangman = Object.create(Hangman);
      var wordToGuess = Object.create(WordToGuess);
      sinon.stub(WordToGuess, 'selectWord').returns("a");
      wordToGuess.initialize();
      WordToGuess.selectWord.restore();
      wordToGuess.revealLetters('a');
      game.isOver(hangman, wordToGuess).should.be.true;
    });
  });
});
