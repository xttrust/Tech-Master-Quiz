const btnStart = document.getElementById("start");
const gameContentWrapper = document.getElementById("game-content-wrapper");
const localStorageData = getData();
let currentQuestion = 0; // Track the current question

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
    hideStartGameWrapper(); // Hide the startGameWrapper
    hideHowToPlay(); // Hide the howToPlay section
    // Start the game
    showGame(); // Display the game wrapper
    fetchData(difficulty) // Fetch the data from api based on difficulty
        .then(() => {
            showNextQuestion(username, difficulty);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Display the next question
 */
function showNextQuestion(username, difficulty) {
    if (currentQuestion < localStorageData.length) {
        let question = getFinalData(localStorageData[currentQuestion]);
        createWelcomeMessage(username, difficulty);
        createAnswersContent(currentQuestion, question);
        currentQuestion++; // Increment the current question
    } else {
        // Handle end of the quiz
        console.log("End of the quiz");
    }
}

function createAnswersContent(nr, question) {
    // Clear previous content
    gameContentWrapper.innerHTML = "";

    let progressText = document.createElement("p");
    progressText.innerHTML = `Question <strong>${nr + 1}</strong> out of ${localStorageData.length}`;
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

        // Add an event listener to each button
        answerOption.addEventListener("click", handleButtonClick);

        gameContentWrapper.appendChild(answerOption);
        gameContentWrapper.appendChild(document.createElement("br"));
    }
}

// Event handler for button click
function handleButtonClick(event) {
    showNextQuestion(document.getElementById("username").value, document.getElementById("difficulty").value);
    let selectedButton = event.target;
    let userAnswer = selectedButton.getAttribute("data-value");
    console.log(`The selected answer is: ${userAnswer}`);
}

/**
 * Creates the welcome message based on username and difficulty
 * @param {*} username 
 * @param {*} difficulty 
 */
function createWelcomeMessage(username, difficulty) {
    let gameWelcomeMessage = document.createElement("p");
    gameWelcomeMessage.id = "game-welcome-message";
    gameWelcomeMessage.innerHTML = `Welcome <strong>${username}</strong>, selected difficulty: <strong>${difficulty}</strong>. Have fun! <hr>`;

    // Add the welcome message paragraph to the game content wrapper
    gameContentWrapper.appendChild(gameWelcomeMessage);
}

/**
 * This function combines the correct answer with the incorrect answers,
 * shuffles the combined array, and creates a new object with the shuffled answers.
 * @param {*} array - The input data containing correct and incorrect answers.
 * @returns {Object} - An object with the correct answer, shuffled incorrect answers, and the question.
 */
function getFinalData(array) {
    // Copy the incorrect_answers array to avoid modifying the original
    let incorrectAnswersCopy = array.incorrect_answers.slice();

    incorrectAnswersCopy.push(array.correct_answer);

    let shuffledAnswers = shuffleArray(incorrectAnswersCopy);

    let result = {
        correctAnswer: array.correct_answer,
        incorrectAnswers: shuffledAnswers,
        question: array.question
    };

    return result;
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * It iterates through the array backward, and for each element, 
 * it randomly selects an element from the remaining 
 * unshuffled elements and swaps them.
 * @param {*} array 
 * @returns 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/**
 * Fetches quiz data from the specified API based on the provided difficulty level.
 * Removes existing data from local storage and stores new data.
 * @param {string} difficulty - The difficulty level for the quiz.
 * @returns {Promise<void>} A Promise that resolves when the data is fetched and stored.
 */
function fetchData(difficulty) {
    let apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=' + difficulty;

    return fetch(apiUrl)
        .then(handleResponse) // Handle the response (check for errors and parse as JSON)
        .then(data => {
            localStorage.removeItem('quizData');
            localStorage.setItem('quizData', JSON.stringify(data.results));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Handles the response from a fetch request.
 * Throws an error if the response is not okay, otherwise parses the response as JSON.
 * @param {Response} response - The response object from a fetch request.
 * @returns {Promise<Object>} A Promise that resolves to the parsed JSON data.
 */
function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

/**
 * This function retrieves the data from local storage and parses it.
 * @returns {Array} The parsed data or null if no data is found.
 */
function getData() {
    let storedData = localStorage.getItem('quizData');
    return JSON.parse(storedData);
}


/**
 * Check empty values for username
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
 * Hide how to play section
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



