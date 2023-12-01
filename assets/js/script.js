const btnStartRef = document.querySelector("#start");
const gameContentWrapperRef = document.querySelector("#game-content-wrapper");
const howToPlayButtonToggleRef = document.querySelector("#howToPlayButtonToggle");
const howToPlayListRef = document.querySelector("#how-to-play-list");
const buttonIconRef = document.querySelector(".close-button i.fa-solid");
const startGameWrapperRef = document.querySelector("#start-game-wrapper");
const howToPlayWrapperRef = document.querySelector("#how-to-play");
const gameWrapperRef = document.querySelector("#game-content-wrapper");
const scoreMessageRef = document.querySelector("#score-message");
const scoreWrapperRef = document.querySelector("#score-wrapper");

let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizData;




/**
 * Check empty values for username
 * @param {string} username - The username to be checked.
 * @returns {boolean} - Returns true if the username is not empty.
 */
const checkUsername = (username) => {
    if (!username) {
        alert("Please enter a username.");
        return false;
    }
    return true;
}

/**
 * Hide the start game section
 */
const hideStartGameWrapper = () => {
    startGameWrapperRef.classList.add("hidden");
};

/**
 * Hide the how to play section
 */
const hideHowToPlay = () => {
    howToPlayWrapperRef.classList.add("hidden");
};

/**
 * Display the game wrapper
 */
const showGame = () => {
    gameWrapperRef.style.display = "block";
};

/**
 * Reset all values to 0 and reload the page
 */
const resetGame = () => {
    // Reset variables
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    // Reload the page to start a new game
    location.reload();
};

/**
 * Disable all buttons
 */
const disableButtons = () => {
    // const answerButtons is needed here when the function is called.
    const answerButtons = document.querySelectorAll(".button");
    answerButtons.forEach(button => {
        button.disabled = true;
    });
};

/**
 * Display the final score messages and a button to reset the game
 * @param {string} username - The username of the player.
 */
const displayScoreMessage = (username) => {

    let startMessage = "";

    if (correctAnswers < 5) {
        startMessage = "You can do better,";
    } else if (correctAnswers >= 5 && correctAnswers <= 8) {
        startMessage = "Not bad,";
    } else if (correctAnswers > 8) {
        startMessage = "Well done,";
    }

    // Display the score message
    scoreMessageRef.innerHTML = `
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
    scoreMessageRef.appendChild(playAgainButton);
}

/**
 * Display the score
 * @param {string} username - The username of the player.
 */
const displayScore = (username) => {
    gameWrapperRef.classList.add("hidden");

    scoreWrapperRef.classList.remove("hidden");
    scoreWrapperRef.classList.add("show");

    displayScoreMessage(username);
}

/**
 * Fetches quiz data from the specified API based on the provided difficulty level.
 * @param {string} difficulty - The difficulty level for the quiz.
 * @returns {Promise<Array>} A Promise that resolves to an array of quiz data.
 */
const fetchData = async (difficulty) => {
    let apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=' + difficulty;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
};

/**
 * Will handle the fetch API error
 * @param {*} error
 */
const handleFetchError = (error) => {
    alert("Error while loading API data, the game will restart.");

    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * Shuffle an array
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
const shuffleArray = (array) => {
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










// Wait for the document to be loaded
document.addEventListener("DOMContentLoaded", function () {

    // Add event listener for the start button click
    btnStartRef.addEventListener("click", async function (event) {
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

    // Add even listener for the how to play button
    howToPlayButtonToggleRef.addEventListener("click", (event) => {
        event.preventDefault();

        howToPlayListRef.classList.toggle("hidden");

        if (howToPlayListRef.classList.contains("hidden")) {
            // Container is hidden, change the icon to plus
            buttonIconRef.classList.remove("fa-minus");
            buttonIconRef.classList.add("fa-plus");
        } else {
            // Container is visible, change the icon to minus
            buttonIconRef.classList.remove("fa-plus");
            buttonIconRef.classList.add("fa-minus");
        }
    })

});















/**
 * Starts the game
 * @param {string} difficulty - The selected difficulty level.
 * @param {string} username - The entered username.
 * @returns {boolean}
 */
async function startGame(difficulty, username) {
    // Check if the username is valid
    if (!checkUsername(username)) return;

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
        gameContentWrapperRef.innerHTML = "";

        // Display welcome message
        createWelcomeMessage(username, difficulty);

        // Display progress text
        let progressText = document.createElement("p");
        progressText.innerHTML = `Question ${currentQuestion + 1} out of ${quizData.length}`;
        gameContentWrapperRef.appendChild(progressText);

        // Display the question
        let questionText = document.createElement("p");
        questionText.innerHTML = `<strong>${question.question}</strong>`;
        gameContentWrapperRef.appendChild(questionText);

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

            gameContentWrapperRef.appendChild(answerOption);
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










