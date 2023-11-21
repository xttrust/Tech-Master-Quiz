const btnStart = document.getElementById("start");
const gameContentWrapper = document.getElementById("game-content-wrapper");
const localStorageData = getData(); // Quiz data
let currentQuestion = 0; // Track the current question
let correctAnswers = 0; // Track the number of correct answers
let wrongAnswers = 0; // Track the number of wrong answers

// Wait for the document to be loaded
document.addEventListener("DOMContentLoaded", function () {
    btnStart.addEventListener("click", function (event) {
        event.preventDefault();
        startGame();
    });
});

/**
 * Starts the game  
 * @returns {boolean} - Returns false if username is empty.
 */
function startGame() {
    let difficulty = document.getElementById("difficulty").value;
    let username = document.getElementById("username").value;

    // Check username, if empty, stop the game and send an alert.
    if (!checkUsername(username)) {
        return false;
    }

    // Start the game
    showGame(); // Display the game wrapper

    hideStartGameWrapper(); // Hide the startGameWrapper
    hideHowToPlay(); // Hide the howToPlay section

    fetchData(difficulty)
        .then(() => {
            showNextQuestion(username, difficulty);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


/**
 * Display the next question
 * @param {string} username - The username of the player.
 * @param {string} difficulty - The difficulty level of the quiz.
 */
/**
 * Display the next question
 * @param {string} username - The username of the player.
 * @param {string} difficulty - The difficulty level of the quiz.
 */
function showNextQuestion(username, difficulty) {
    if (currentQuestion < localStorageData.length) {
        let question = getFinalData(localStorageData[currentQuestion]);

        // Clear previous content
        gameContentWrapper.innerHTML = "";

        // Display the welcome message
        createWelcomeMessage(username, difficulty);

        // Display the progress text
        let progressText = document.createElement("p");
        progressText.innerHTML = `Question ${currentQuestion + 1} out of ${localStorageData.length}`;
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

        currentQuestion++; // Increment the current question
    } else {
        // Handle end of the quiz and display the score
        displayScore();
        console.log("End of the quiz");
    }
}


// Event handler for button click
function handleButtonClick(event, correctAnswer) {
    let selectedButton = event.target;
    let userAnswer = selectedButton.getAttribute("data-value");

    // Check if the answer is correct
    if (userAnswer === correctAnswer) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    console.log(`The selected answer is: ${userAnswer}`);
    console.log(`The correct answer is: ${correctAnswer}`);

    // Proceed to the next question after a brief delay
    setTimeout(() => {
        showNextQuestion(document.getElementById("username").value, document.getElementById("difficulty").value);
    }, 100); // Adjust the delay duration as needed
}


/**
 * Creates the welcome message based on username and difficulty
 * @param {string} username - The username of the player.
 * @param {string} difficulty - The difficulty level of the quiz.
 */
function createWelcomeMessage(username, difficulty) {
    // Check if the welcome message already exists
    let existingWelcomeMessage = document.getElementById("game-welcome-message");
    if (existingWelcomeMessage) {
        // Update the existing welcome message if it exists
        existingWelcomeMessage.innerHTML = `Welcome <strong>${username}</strong>, selected difficulty: <strong>${difficulty}</strong>. Have fun! <hr>`;
    } else {
        // Create a new welcome message if it doesn't exist
        let gameWelcomeMessage = document.createElement("p");
        gameWelcomeMessage.id = "game-welcome-message";
        gameWelcomeMessage.innerHTML = `Welcome <strong>${username}</strong>, selected difficulty: <strong>${difficulty}</strong>. Have fun! <hr>`;

        // Add the welcome message at the beginning of the game content wrapper
        gameContentWrapper.insertBefore(gameWelcomeMessage, gameContentWrapper.firstChild);
    }
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

    let shuffledAnswers = shuffleArray(incorrectAnswersCopy);

    let result = {
        correctAnswer: array.correct_answer,
        incorrectAnswers: shuffledAnswers,
        question: array.question
    };

    return result;
}

/**
 * I asked chatGPT to show me an example of how to shuffle an array.
 * Shuffle an array using the Fisher-Yates algorithm
 * It iterates through the array backward, and for each element, 
 * it randomly selects an element from the remaining 
 * unshuffled elements and swaps them.
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
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

/**
 * Display the score
 */
function displayScore() {
    let scoreText = document.createElement("p");
    scoreText.innerHTML = `Score: Correct Answers - ${correctAnswers}, Wrong Answers - ${wrongAnswers}`;
    gameContentWrapper.appendChild(scoreText);
}
