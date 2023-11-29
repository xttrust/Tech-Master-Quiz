const btnStart = document.querySelector("#start");
const gameContentWrapper = document.querySelector("#game-content-wrapper");
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizData;

// Wait for the document to be loaded
document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for the start button click
    btnStart.addEventListener("click", async function (event) {
        event.preventDefault();
        // Get the selected difficulty and username from the input fields
        const difficulty = document.querySelector("#difficulty").value;
        const username = document.querySelector("#username").value;
        try {
            // Fetch quiz data and start the game
            quizData = await fetchData(difficulty);
            startGame(difficulty, username);
        } catch (error) {
            // Handle fetch error
            handleFetchError(error);
        }
    });
});

/**
 * Starts the game
 * @param {string} difficulty - The selected difficulty level.
 * @param {string} username - The entered username.
 * @returns {boolean}
 */
async function startGame(difficulty, username) {
    // Check if the username is valid
    if (!checkUsername(username)) {
        return false;
    }

    showGame();
    hideStartGameWrapper();
    hideHowToPlay();

    showNextQuestion(username, difficulty);
}

/**
 * Display the next question
 * @param {string} username - The username of the player.
 * @param {string} difficulty - The difficulty level of the quiz.
 */
function showNextQuestion(username, difficulty) {
    // Check if there are more questions to display
    if (currentQuestion < quizData.length) {
        // Get data for the current question
        let question = getFinalData(quizData[currentQuestion]);

        // Clear previous content
        gameContentWrapper.innerHTML = "";

        // Display welcome message
        createWelcomeMessage(username, difficulty);

        // Display progress text
        let progressText = document.createElement("p");
        progressText.innerHTML = `Question ${currentQuestion + 1} out of ${quizData.length}`;
        gameContentWrapper.appendChild(progressText);

        // Display the question
        let questionText = document.createElement("p");
        questionText.innerHTML = `<strong>${question.question}</strong>`;
        gameContentWrapper.appendChild(questionText);

        // Display answer options as buttons
        for (let i = 0; i < question.incorrectAnswers.length; i++) {
            let answerOption = document.createElement("button");
            answerOption.type = "button";
            answerOption.classList.add("button");
            answerOption.classList.add("button-block");
            answerOption.setAttribute("data-value", question.incorrectAnswers[i]);
            answerOption.innerHTML = question.incorrectAnswers[i];

            // Add an event listener to each button with the correct answer
            answerOption.addEventListener("click", function (event) {
                handleButtonClick(event, question.correctAnswer);
            });

            gameContentWrapper.appendChild(answerOption);
        }

        currentQuestion++;
    } else {
        // No more questions, display final score
        displayScore(username);
    }
}

/**
 * Handle the #start button click event
 * @param {*} event
 * @param {*} correctAnswer
 */
function handleButtonClick(event, correctAnswer) {
    let selectedButton = event.target;
    let userAnswer = selectedButton.getAttribute("data-value");

    // Check if the user's answer is correct
    if (userAnswer === correctAnswer) {
        correctAnswers++;
        selectedButton.classList.add("button-green");
    } else {
        wrongAnswers++;
        selectedButton.classList.add("button-red");

        // Find and highlight the button with the correct answer
        const correctButton = findCorrectButton(correctAnswer);
        if (correctButton) {
            correctButton.classList.add("button-green");
        }
    }

    // Disable all buttons
    disableButtons();

    // Proceed to the next question after a brief delay
    setTimeout(() => {
        showNextQuestion(document.getElementById("username").value, document.getElementById("difficulty").value);
    }, 1200); // Add a timer for the user to see the wrong and correct answer.
}

/**
 * Find the button with the correct answer
 * @param {*} correctAnswer
 * @returns {HTMLElement|null}
 */
function findCorrectButton(correctAnswer) {
    const answerButtons = document.querySelectorAll(".button");
    for (const button of answerButtons) {
        if (button.getAttribute("data-value") === correctAnswer) {
            return button;
        }
    }
    return null;
}

/**
 * Updates the welcome message based on username and difficulty
 * @param {string} username
 * @param {string} difficulty
 */
function createWelcomeMessage(username, difficulty) {
    let welcomeMessageWrapper = document.querySelector("#welcome-message-wrapper");
    welcomeMessageWrapper.classList.remove("hidden");
    welcomeMessageWrapper.classList.add("show");

    let welcomeMessage = document.querySelector("#game-welcome-message");
    welcomeMessage.innerHTML = `Welcome <strong>${username}</strong>, selected difficulty: <strong>${difficulty}</strong>. Have fun!`;
}

/**
 * Fetches quiz data from the specified API based on the provided difficulty level.
 * @param {string} difficulty - The difficulty level for the quiz.
 * @returns {Promise<Array>} A Promise that resolves to an array of quiz data.
 */
async function fetchData(difficulty) {
    let apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=' + difficulty;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
}

/**
 * Will handle the fetch API error
 * @param {*} error
 */
function handleFetchError(error) {
    alert("Error while loading API data, the game will restart.");

    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * This function combines the correct answer with the incorrect answers,
 * shuffles the combined array, and creates a new object with the shuffled answers.
 * @param {Object} array - The input data containing correct and incorrect answers.
 * @returns {Object} - An object with the correct answer, shuffled incorrect answers, and the question.
 */
function getFinalData(array) {
    // Copy the incorrect_answers array to avoid modifying the original
    let incorrectAnswersCopy = array.incorrect_answers.slice();

    incorrectAnswersCopy.push(array.correct_answer);

    // Shuffle the combined array
    let shuffledAnswers = shuffleArray(incorrectAnswersCopy);

    let result = {
        correctAnswer: array.correct_answer,
        incorrectAnswers: shuffledAnswers,
        question: array.question
    };

    return result;
}

/**
 * Shuffle an array
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

/**
 * Check empty values for username
 * @param {string} username - The username to be checked.
 * @returns {boolean} - Returns true if the username is not empty.
 */
function checkUsername(username) {
    if (!username) {
        alert("Please enter a username.");
        return false;
    }
    return true;
}

/**
 * Hide the start game section
 */
function hideStartGameWrapper() {
    let startGameWrapper = document.getElementById("start-game-wrapper");
    startGameWrapper.classList.add("hidden");
}

/**
 * Hide the how to play section
 */
function hideHowToPlay() {
    let howToPlayWrapper = document.getElementById("how-to-play");
    howToPlayWrapper.classList.add("hidden");
}

/**
 * Display the game wrapper
 */
function showGame() {
    let gameWrapper = document.getElementById("game-content-wrapper");
    gameWrapper.style.display = "block";
}

/**
 * Display the score
 * @param {string} username - The username of the player.
 */
function displayScore(username) {
    // Hide the game wrapper
    let gameWrapper = document.getElementById("game-content-wrapper");
    gameWrapper.classList.add("hidden");

    // Show the score wrapper
    let scoreWrapper = document.getElementById("score-wrapper");
    scoreWrapper.classList.remove("hidden");
    scoreWrapper.classList.add("show");

    // Display the score message
    displayScoreMessage(username);
}

/**
 * Display the final score messages and a button to reset the game
 * @param {string} username - The username of the player.
 */
function displayScoreMessage(username) {
    let scoreMessage = document.getElementById("score-message");
    let startMessage = "";

    if (correctAnswers < 5) {
        startMessage = "You can do better,";
    } else if (correctAnswers >= 5 && correctAnswers <= 8) {
        startMessage = "Not bad,";
    } else if (correctAnswers > 8) {
        startMessage = "Well done,";
    }

    // Display the score message
    scoreMessage.innerHTML = `
        ${startMessage} <strong>${username}!</strong> Here are the results of your answers:<br><br>
        <strong>Correct Answers:</strong> <span class="text-green">${correctAnswers}</span><br>
        <strong>Incorrect Answers:</strong> <span class="text-red">${wrongAnswers}</span>
    `;

    // Add a button to play again
    let playAgainButton = document.createElement("button");
    playAgainButton.type = "button";
    playAgainButton.classList.add("button");
    playAgainButton.classList.add("d-block");
    playAgainButton.innerHTML = "Play Again";

    // Add an event listener to the play again button
    playAgainButton.addEventListener("click", resetGame);

    // Add the button to the score message
    scoreMessage.appendChild(playAgainButton);
}

/**
 * Reset all values to 0 and reload the page
 */
function resetGame() {
    // Reset variables
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    // Reload the page to start a new game
    location.reload();
}

/**
 * Disable all buttons
 */
function disableButtons() {
    const answerButtons = document.querySelectorAll(".button");
    answerButtons.forEach(button => {
        button.disabled = true;
    });
}

/**
 * Toggle the how to play list visibility
 */
function toggleHowToPlayList() {
    let howToPlayList = document.getElementById("how-to-play-list");
    howToPlayList.classList.toggle("hidden");

    let buttonIcon = document.querySelector(".close-button i.fa-solid");
    if (howToPlayList.classList.contains("hidden")) {
        // Container is hidden, change the icon to plus
        buttonIcon.classList.remove("fa-minus");
        buttonIcon.classList.add("fa-plus");
    } else {
        // Container is visible, change the icon to minus
        buttonIcon.classList.remove("fa-plus");
        buttonIcon.classList.add("fa-minus");
    }
}
