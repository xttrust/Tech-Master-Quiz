const btnStart = document.getElementById("start");


btnStart.addEventListener("click", function (event) {
    event.preventDefault();
    let dificulty = document.getElementById("dificulty").value;
    let username = document.getElementById("username").value;

    // Check username, if empty, stop the game and send an alert.
    if (!checkUsername(username)) {
        return false;
    }
    // Username was entered - Start the game
    hideGameWraper(); // Hide the startGameWraper
    // Start the game
    console.log(`Welcome ${username}, dificulty ${dificulty}. The game has started.`);
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
 * This will hide the form that lets the user to select 
 * dificulty and set username
 */
function hideGameWraper() {
    let startGameWraper = document.getElementById("start-game-wrapper");
    startGameWraper.style.display = 'none';
}