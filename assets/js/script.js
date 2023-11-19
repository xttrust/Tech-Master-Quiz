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

}





