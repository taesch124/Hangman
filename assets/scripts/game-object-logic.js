const visibleLettersText = document.getElementById('current-word');
const winsText = document.getElementById("win-text");
const loseText = document.getElementById("lose-text");
const guessesLeftText = document.getElementById("guesses-left-text");
const guessedLettersText = document.getElementById('guessed-letters-text');
const gameEndContainer = document.getElementById('game-end-container');
const gamePlayText = document.getElementById('game-play-text');
const gameEndText = document.getElementById('game-end-text');
/*
1. Generate Random Letter
2. User guesses letter
3. Compare letter to phrases letters
4. Replace "_" in current phrase to show correct guess
5. If no more "_" in phrase, win and reset
6. If not a match, add to guessedLetters and subtract guessLeft
7. If guessedLeft reaches 0, lose and reset
*/

const possibleLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const possibleGames = ["The Legend of Zelda", "Halo", "Prince of Persia", "Super Mario", "Fallout", "Bioshock", "God of War", "Shadow of the Colossus", "Final Fantasy"];

let gameState = {
    wins: 0,
    losses: 0,
    guessesLeft: 10,
    guessedLetters: [],
    correctLetters: [],
    currentGame: null,
    gameOver: false,

    handleUserGuess: function(userGuess) {
        if (this.correctLetters.indexOf(userGuess) !== -1 || this.guessedLetters.indexOf(userGuess) !== -1 || possibleLetters.indexOf(userGuess) === -1) return;

        if(!this.checkGameForLetter(userGuess)) {
            this.guessedLetters.push(userGuess);
            guessedLettersText.innerHTML = printGuessedLetters(this.guessedLetters);
            this.guessesLeft--;
            guessesLeftText.innerHTML = this.guessesLeft;
            
            if(this.guessesLeft <= 0) {
                this.losses++;
                loseText.innerHTML = this.losses;
                this.gameWon(false);
            }
        }

        if(visibleLettersText.innerHTML.indexOf("_") === -1) {
            this.wins++;
            winsText.innerHTML = this.wins;
            this.gameWon(true); 
        }
    },

    generateRandomGame: function() {
        let game = this.currentGame;

        while(game === this.currentGame) {
            let randomIndex = Math.floor(Math.random() * possibleGames.length);
            game = possibleGames[randomIndex];
        }

        let visibleLetters = game.replace(/[a-zA-Z]/gi, "_");
        visibleLettersText.innerHTML = visibleLetters;
        this.currentGame = game;
    },

    resetGame: function() {
        this.guessesLeft = 10;
        guessesLeftText.innerHTML = this.guessesLeft;
        this.guessedLetters = [];
        this.correctLetters = [];
        guessedLettersText.innerHTML = "";
        this.generateRandomGame();

        gameEndContainer.classList.add('hidden');
        gamePlayText.classList.remove('hidden');
    },

    checkGameForLetter: function(userGuess) {
        let containsLetter = false;
        for (let i = 0; i < this.currentGame.length; i++) {
            if(this.currentGame.charAt(i).toLowerCase() === userGuess.toLowerCase()) {
                containsLetter = true;
                let visibleLetters = replaceAt(visibleLettersText.innerHTML, i, userGuess.toUpperCase());
                visibleLettersText.innerHTML = visibleLetters;
            }
        }

        if(containsLetter) {
            this.correctLetters.push(userGuess);
        }

        return containsLetter;
    },

    gameWon: function(gameWon) {
        gameEndContainer.classList.remove('hidden');
        gamePlayText.classList.add('hidden');

        if(gameWon) {
            gameEndText.innerHTML = "That's right! I was thinking of " + this.currentGame + "!";
        } else {
            gameEndText.innerHTML = "Sorry, I was thinking of " + this.currentGame + ". :(";
        }

        gameEndText.innerHTML += "<br><br>Press any key to play again.";
        this.gameOver = true;
    }
}

guessesLeftText.innerHTML = gameState.guessesLeft;
gameState.generateRandomGame();

document.onkeyup = function(event) {
    if(!gameState.gameOver) {
        gameState.handleUserGuess(event.key);
    } else {
        gameState.gameOver = false;
        gameState.resetGame();
    }
    
}

function printGuessedLetters(letters) {
    let resultString = "";
    for (let i = 0; i < letters.length; i++) {
        if(i === letters.length - 1) {
            resultString += letters[i].toUpperCase();
        } else {
            resultString += letters[i].toUpperCase() + ", ";
        }
    }
    return resultString;
}

function replaceAt(phrase, index, replacement) {
    return phrase.substr(0, index) + replacement + phrase.substr(index + replacement.length);
}