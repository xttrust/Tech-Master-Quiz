const btnStart = document.getElementById("start");

btnStart.addEventListener("click", function (event) {
    event.preventDefault();
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
    console.log(`Welcome ${username}, difficulty ${difficulty}. The game has started.`);
});

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
 * This will display the game wrapper
 */
function showGame() {
    let gameWrapper = document.getElementById("game-content-wrapper");
    gameWrapper.style.display = "block";
}


