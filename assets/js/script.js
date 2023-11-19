const btnStart = document.getElementById("start");

// Wait for the document to be loaded
document.addEventListener("DOMContentLoaded", function () {

    btnStart.addEventListener("click", function (event) {
        event.preventDefault();
        startGame();
    });

});

/**
 * Starts the game  
 * @returns false
 */
function startGame() {
    let difficulty = document.getElementById("difficulty").value;
    let username = document.getElementById("username").value;

    // Check username, if empty, stop the game and send an alert.
    if (!checkUsername(username)) {
        return false;
    }
    // Username was entered - Start the game
    hideStartGameWrapper(); // Hide the startGameWrapper
    // Start the game
    showGame();
    showGameWelcomeMessage(username, difficulty);
    console.log(fetchApiData(difficulty));
}


/**
 * Check empty values on username. If the username is empty
 * it will show an alert
 */
function checkUsername(username) {
    if (!username) {
        alert("Please enter a username.");
        return false;
    }
    return true;
}

/**
 * This will hide the form that lets the user select 
 * difficulty and set username
 */
function hideStartGameWrapper() {
    let startGameWrapper = document.getElementById("start-game-wrapper");
    startGameWrapper.classList.add("hidden");
}

/**
 * Display the game wrapper
 */
function showGame() {
    let gameWrapper = document.getElementById("game-content-wrapper");
    gameWrapper.style.display = "block";
}


/**
 * Display the game welcome message
 */
function showGameWelcomeMessage(username, difficulty) {
    let gameWelcomeMessage = document.getElementById("game-welcome-message");
    gameWelcomeMessage.innerHTML = `Welcome <b>${username}</b>, your difficulty is: <b>${difficulty}</b>. Have fun!`;
}

function fetchApiData(difficulty) {
    const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=" + difficulty;
    let quizData = [];

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            for (let i = 0; i < data.results.length; i++) {
                let questionData = {
                    question: data.results[i].question,
                    correctAnswer: data.results[i].correct_answer,
                    incorrectAnswers: data.results[i].incorrect_answers
                };

                quizData.push(questionData);
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    return quizData;
}



