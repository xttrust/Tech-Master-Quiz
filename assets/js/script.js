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
    showGameContent(username, difficulty);

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
function showGameContent(username, difficulty) {

    // Get the game content wrapper
    let gameContentWrapper = document.getElementById("game-content-wrapper");

    // Create the welcome message paragraph
    let gameWelcomeMessage = document.createElement("p");
    gameWelcomeMessage.id = "game-welcome-message";
    gameWelcomeMessage.innerHTML = `Welcome <b>${username}</b>, selected difficulty: <b>${difficulty}</b>. Have fun!`;

    // Add the welcome message paragraph to the game content wrapper
    gameContentWrapper.appendChild(gameWelcomeMessage);

    // Set the data to local strage
    fetchData(difficulty);

    // Get the data from local storage
    let data = getData();

    console.log(getFinalData(data[0]));
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

    // Push the correct answer to the copied array
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
    // Construct the API URL based on the provided difficulty
    let apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=' + difficulty;

    // Fetch data from the API, handle the response, and store in local storage
    return fetch(apiUrl)
        .then(handleResponse) // Handle the response (check for errors and parse as JSON)
        .then(data => {
            // Remove existing data from local storage
            localStorage.removeItem('quizData');
            // Store new data in local storage after converting to JSON string
            localStorage.setItem('quizData', JSON.stringify(data.results));
        })
        .catch(error => {
            // Log an error message if there's an issue fetching data
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
    // Check if the response is okay, throw an error if not
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
    // Retrieve the stored data from local storage
    let storedData = localStorage.getItem('quizData');

    return JSON.parse(storedData);
}



