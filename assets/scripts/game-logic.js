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
let wins = 0,
losses = 0;
let guessesLeft = 10;
guessesLeftText.innerHTML = guessesLeft;
let guessedLetters = [];
let correctLetters = [];
var currentGame = generateRandomGame();
var gameOver = false;

document.onkeyup = function(event) {
    if(!gameOver) {
        let userGuess = event.key;
        if (correctLetters.indexOf(userGuess) !== -1 || guessedLetters.indexOf(userGuess) !== -1 || possibleLetters.indexOf(userGuess) === -1) return;

        if(!checkGameForLetter(userGuess)) {
            guessedLetters.push(userGuess);
            guessedLettersText.innerHTML = printGuessedLetters(guessedLetters);
            guessesLeft--;
            guessesLeftText.innerHTML = guessesLeft;
            
            if(guessesLeft <= 0) {
                losses++;
                loseText.innerHTML = losses;
                gameWon(false);
            }
        }

        if(visibleLettersText.innerHTML.indexOf("_") === -1) {
            wins++;
            winsText.innerHTML = wins;
            gameWon(true); 
        }
    } else {
        gameOver = false;
        resetGame();
    }
    
}

function generateRandomGame() {
    let game = currentGame;

    while(game === currentGame) {
        let randomIndex = Math.floor(Math.random() * possibleGames.length);
        game = possibleGames[randomIndex];
    }

    let visibleLetters = game.replace(/[a-zA-Z]/gi, "_");
    visibleLettersText.innerHTML = visibleLetters;
    return game;
}

function resetGame() {
    guessesLeft = 10;
    guessesLeftText.innerHTML = guessesLeft;
    guessedLetters = [];
    correctLetters = [];
    guessedLettersText.innerHTML = "";
    currentGame = generateRandomGame();

    gameEndContainer.classList.add('hidden');
    gamePlayText.classList.remove('hidden');
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

function checkGameForLetter(userGuess) {
    let containsLetter = false;
    for (let i = 0; i < currentGame.length; i++) {
        if(currentGame.charAt(i).toLowerCase() === userGuess.toLowerCase()) {
            containsLetter = true;
            let visibleLetters = replaceAt(visibleLettersText.innerHTML, i, userGuess.toUpperCase());
            visibleLettersText.innerHTML = visibleLetters;
        }
    }

    if(containsLetter) {
        correctLetters.push(userGuess);
    }

    return containsLetter;
}

function gameWon(gameWon) {

    gameEndContainer.classList.remove('hidden');
    gamePlayText.classList.add('hidden');

    if(gameWon) {
        gameEndText.innerHTML = "That's right! I was thinking of " + currentGame + "!";
    } else {
        gameEndText.innerHTML = "Sorry, I was thinking of " + currentGame + ". :(";
    }

    gameEndText.innerHTML += "<br><br>Press any key to play again.";
    gameOver = true;
}
