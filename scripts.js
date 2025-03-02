const intro = document.getElementById("intro");
const castle = document.getElementById("castle");
const grass = document.getElementById("grass");
const checklist = document.getElementById("checklist");
const achievements = document.getElementById("achievements");

// Play the medieval soundtrack when the page loads
window.onload = function () {
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.play();

  // Ensure the music starts only after user interaction (to comply with browser autoplay policies)
  document.addEventListener("click", () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    }
  });

  // Add intro animation
  intro.classList.add("introDown");
};
// Function to initialize the health bar
function initializeHealthBar() {
    const castleHealthBar = document.getElementById("castleHealthBar");
    castleHealthBar.style.display = "block"; // Show the health bar
    updateHealthBar(100); // Start with 100% health
  }
  
  // Function to update the health bar
  function updateHealthBar(healthPercentage) {
    const castleHealthBarFill = document.getElementById("castleHealthBarFill");
    const castleHealthBarText = document.getElementById("castleHealthBarText");
  
    // Ensure health stays within 0-100%
    healthPercentage = Math.max(0, Math.min(100, healthPercentage));
  
    // Update the health bar width and text
    castleHealthBarFill.style.width = `${healthPercentage}%`;
    castleHealthBarText.textContent = `${healthPercentage}%`;
  
    // Change color based on health level
    if (healthPercentage <= 50) {
      castleHealthBarFill.style.backgroundColor = "#FF5722"; // Orange for low health
    } else {
      castleHealthBarFill.style.backgroundColor = "#4CAF50"; // Green for high health
    }
  }
  
  // Function to handle losing the password game
  function losePasswordGame() {
    updateHealthBar(50); // Reduce health to 50%
    alert("You lost the password game! Castle health reduced to 50%.");
  }
  
  function start() {
    const castleName = document.getElementById("castleName").value;
    if (!castleName) {
      alert("Please enter a castle name!");
      return;
    }
  
    // Hide the intro screen
    intro.classList.remove("introDown");
    intro.classList.add("introUp");
  
    // Start the grass and castle animations
    grass.classList.add("grassDown");
    castle.classList.add("landCastle");
  
    // Show the side menus
    checklist.classList.add("showMenus");
    achievements.classList.add("showMenus");
  
    // Display the castle name at the top middle of the page
    displayCastleName(castleName);
  
    // Hide the mountains
    const mountains = document.getElementById("mountains");
    mountains.classList.add("hidden");
  
    // Initialize the health bar
    initializeHealthBar();
  
    // Start cloud animations after the castle lands
    setTimeout(() => {
      document.getElementById("clouds").classList.add("animateClouds");
    }, 2000); // Adjust timing to match the castle landing animation
  }

// Function to display the castle name at the top middle of the page
function displayCastleName(name) {
  // Create a new div for the castle name
  const castleNameDisplay = document.createElement("div");
  castleNameDisplay.id = "castleNameDisplay";
  castleNameDisplay.textContent = name;

  // Append the castle name display to the body (or a specific container)
  document.body.appendChild(castleNameDisplay);

  // Fade in the castle name
  setTimeout(() => {
    castleNameDisplay.style.opacity = "1";
  }, 100); // Small delay to ensure the element is added to the DOM
}

const passwordGameOverlay = document.getElementById("passwordGameOverlay");
const passwordInput = document.getElementById("passwordInput");
const closeOverlay = document.getElementById("closeOverlay");

const passwordHints = [
  { id: "hintLength", regex: /.{12,}/, message: "🔒 Must be at least 12 characters long." },
  { id: "hintNumber", regex: /\d/, message: "🔢 Must contain a number." },
  { id: "hintSpecialChar", regex: /[!@#$%^&*(),.?":{}|<>]/, message: "✨ Must contain a special character." },
  { id: "hintCastleWord", regex: /defend|castle|king|shield/i, message: "🏰 Must include a castle-related word (e.g., 'defend')." },
  { id: "hintEmoji", regex: /[\u{1F600}-\u{1F6FF}]/u, message: "😀 Must include an emoji." },
  { id: "hintUppercase", regex: /[A-Z]/, message: "🔠 Must contain an uppercase letter." },
  { id: "hintLowercase", regex: /[a-z]/, message: "🔡 Must contain a lowercase letter." },
  { id: "hintNoSpaces", regex: /^\S*$/, message: "🚫 Must not contain spaces." },
];

let currentTaskCheckbox = null;
let currentHintIndex = 0;
let timerInterval = null;
const randomNumber = null;

// Ensure the twoFactor game overlay buttons are selected correctly
const twoFactorOverlay = document.getElementById("twoFactorGameOverlay");
const closeTwoFactorBtn = twoFactorOverlay.querySelector("#closeOverlay");
const submitTwoFactorBtn = document.getElementById("sumbitTwoFactor")
const twoFactorInput = document.getElementById("twoFactorInput");
let correctTwoFactorCode = null; // Store the correct code

function showTwoFactorGame(checkbox) {
    currentTaskCheckbox = checkbox;
    twoFactorOverlay.style.display = "flex";
    twoFactorInput.value = "";
    generateQRCode();
}

function hideTwoFactorGame(isCodeCorrect) {
    twoFactorOverlay.style.display = "none";
    if (isCodeCorrect) {
        const element = document.getElementById("startTwoFactorGame");
        if (element) {
            element.remove();
            const box = document.getElementById("checkboxTwoFactorGame");
            box.checked = true;
        }
    }
}

// Generate QR code and verification number
function generateQRCode() {
    correctTwoFactorCode = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const qrData = encodeURIComponent(correctTwoFactorCode.toString());
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&format=png&bgcolor=255-255-255-0`;
    document.getElementById("qrcode").src = qrUrl;
}

// Verify Two-Factor Code
function checkTwoFactorCode() {
    const enteredCode = twoFactorInput.value.trim();
    if (enteredCode === correctTwoFactorCode.toString()) {
        hideTwoFactorGame(true);
    }
}

// Attach event listeners
closeTwoFactorBtn.addEventListener("click", () => hideTwoFactorGame(false));
submitTwoFactorBtn.addEventListener("click", checkTwoFactorCode);


// Show the password game overlay
function showPasswordGame(checkbox) {
  currentTaskCheckbox = checkbox;
  passwordGameOverlay.style.display = "flex";
  passwordInput.value = "";
  currentHintIndex = 0;
  resetHints();
  revealNextHint();
  updatePasswordHints();
  startTimer();
}

// Modify the hidePasswordGame function to handle losing the game
function hidePasswordGame(isTimeEnded) {
    passwordGameOverlay.style.display = "none";
    clearInterval(timerInterval);
  
    if (isTimeEnded) {
      losePasswordGame(); // Reduce health if the player loses
    } else {
      const element = document.getElementById("startPasswordGame");
      if (element) {
        element.remove();
        const box = document.getElementById("checkboxPasswordGame");
        box.checked = true;
      }
    }}

// Reset hints to their initial state
function resetHints() {
  passwordHints.forEach((hint) => {
    const hintElement = document.getElementById(hint.id);
    hintElement.classList.remove("completed", "visible");
    hintElement.style.opacity = "0";
  });
}

// Reveal the next hint
function revealNextHint() {
  if (currentHintIndex < passwordHints.length) {
    const hintElement = document.getElementById(passwordHints[currentHintIndex].id);
    hintElement.classList.add("visible");
    hintElement.style.opacity = "1";
  }
}

// Update password hints in real-time
function updatePasswordHints() {
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value;
  
      // Reset all hints to incomplete (white)
      passwordHints.forEach((hint) => {
        const hintElement = document.getElementById(hint.id);
        hintElement.classList.remove("completed");
      });
  
      // Check each hint and mark as completed if the condition is met
      let allHintsCompleted = true;
      passwordHints.forEach((hint, index) => {
        const hintElement = document.getElementById(hint.id);
        if (hint.regex.test(password)) {
          hintElement.classList.add("completed");
        } else {
          allHintsCompleted = false;
        }
  
        // Reveal the next hint if the current one is completed
        if (index === currentHintIndex && hint.regex.test(password)) {
          currentHintIndex++;
          revealNextHint();
        }
      });
  
      // Check if all hints are completed
      if (allHintsCompleted) {
        currentTaskCheckbox.checked = true;
        setTimeout(() => {
          hidePasswordGame(false);
        }, 1000); // Wait 1 second before closing
        launchWaveOne();
      }
    });
  }

// Start the timer
function startTimer() {
    let timeLimit = 60; // 60 seconds time limit
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = `Time Left: ${timeLimit}s`;
  timerInterval = setInterval(() => {
    timeLimit--;
    timerDisplay.textContent = `Time Left: ${timeLimit}s`;
    if (timeLimit <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! Try again.");
      hidePasswordGame(true);
    }
  }, 1000);
}

// Event listener for the close button
closeOverlay.addEventListener("click", hidePasswordGame);

// Add event listeners to "Start Task" buttons
document.querySelectorAll("#startPasswordGame").forEach((button) => {
  button.addEventListener("click", () => {
    const checkbox = button.closest("li").querySelector("input[type='checkbox']");
    showPasswordGame(checkbox);
  });
});

document.querySelectorAll("#startTwoFactorGame").forEach((button) => {
    button.addEventListener("click", () => {
      const checkbox = button.closest("li").querySelector("input[type='checkbox']");
      showTwoFactorGame(checkbox);
    });
  });


  // Phishing Task

  // Phishing Task Functions

// Function to open the phishing task modal
function openPhishingTask() {
  document.getElementById('phishingOverlay').style.display = 'flex';
}

// Function to handle user decision on phishing email
function makeDecision(decision) {
  if (decision === 'phishing') {
    // Correct answer
    showSuccess("Well done! You've identified a phishing attempt. The message asked for your secret password, which legitimate kingdom messages would never do.");
    
    // Mark the checkbox as completed
    const checkbox = document.querySelector('#checklist li:nth-child(2) input[type="checkbox"]');
    checkbox.checked = true;

    // Start Task Button will be removed
    const element = document.getElementById("startPhishingGame");
    element.remove();
    
    
  } else {
    // Incorrect answer
    showError("That was a phishing attempt! Always be suspicious of messages asking for your secret password!");
    // You could add code here for consequences of incorrect answer
  }
  
  // Close the phishing overlay
  document.getElementById('phishingOverlay').style.display = 'none';
}

// Helper functions for feedback (assuming these don't exist yet)
function showSuccess(message) {
  // Create a success notification
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.innerHTML = `
    <div class="notification-content">
      <span>✓</span>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showError(message) {
  // Create an error notification
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <div class="notification-content">
      <span>✗</span>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add these notification styles to your CSS
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.5s forwards;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .notification.success {
    background-color: #2a4d2a;
    border: 2px solid #4CAF50;
  }
  
  .notification.error {
    background-color: #4d2a2a;
    border: 2px solid #f44336;
  }
  
  .notification span {
    font-size: 1.5rem;
  }
  
  .notification p {
    margin: 0;
    color: #f4f4f4;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

  function launchWaveOne(){
    const waveOneOverlay = document.getElementById("waveOneOverlay");

    setTimeout(() => {
        waveOneOverlay.style.display = "flex";
      }, 3000);
    
    const tower = document.getElementById("tower");
    tower.classList.add("landTower");
    
  }

function waveOneEnemy(){
    const enemyOne = document.getElementById("enemyOne");
    const enemyTwo = document.getElementById("enemyTwo");
    const enemyThree = document.getElementById("enemyThree");

      enemyOne.classList.add("enemyMove");  

    setTimeout(() => {
        // Shake the enemy when the player reaches it

        enemyOne.classList.add("enemyShake");
        

        setTimeout(() => {
            // Make the enemy fall off the screen
            enemyOne.classList.add("enemyMove");
           
        }, 500);
    }, 4500);
}
  
  function hideWaveOneOverlay(){
    waveOneOverlay.remove();
    let music = document.getElementById("backgroundMusic")
    let source = document.getElementById("musicSource");
    source.src = "attack.mp3";
    music.load();
    music.play();
    displayWaveName("Wave 1: Secure The Gates")

    waveOneEnemy();
  }

  function displayWaveName(name) {
    // Create a new div for the castle name
    const waveNameDisplay = document.createElement("div");
    waveNameDisplay.id = "waveNameDisplay";
    waveNameDisplay.textContent = name;
  
    // Append the castle name display to the body (or a specific container)
    document.body.appendChild(waveNameDisplay);
  
    // Fade in the castle name
    
    waveNameDisplay.style.opacity = "1";
    setTimeout(() => {
        waveNameDisplay.style.opacity = "0";
      }, 3500); // Small delay to ensure the element is added to the DOM
    

  }

// Flag to track if the achievement has been added
let isAchievementAdded = false;

// Function to check if the enemy touches the archer or defender
function checkEnemyCollision() {
  const enemyOne = document.getElementById("enemyOne");
  const tower = document.getElementById("tower");
  const castle = document.getElementById("castle");

  const enemyRect = enemyOne.getBoundingClientRect();
  const towerRect = tower.getBoundingClientRect();
  const castleRect = castle.getBoundingClientRect();

  // Check collision with tower (archer)
  if (
    enemyRect.left < towerRect.right &&
    enemyRect.right > towerRect.left &&
    enemyRect.top < towerRect.bottom &&
    enemyRect.bottom > towerRect.top
  ) {
    handleEnemyCollision();
  }

  // Check collision with castle (defender)
  if (
    enemyRect.left < castleRect.right &&
    enemyRect.right > castleRect.left &&
    enemyRect.top < castleRect.bottom &&
    enemyRect.bottom > castleRect.top
  ) {
    handleEnemyCollision();
  }
}

// Store the original music source
const originalMusicSource = "medieval-soundtrack.mp3";

// Function to handle enemy collision
function handleEnemyCollision() {
  // Ensure the achievement is only added once
  if (isAchievementAdded) return;
  isAchievementAdded = true;

  // Remove the password game
  const passwordGameButton = document.getElementById("startPasswordGame");
  if (passwordGameButton) {
    passwordGameButton.remove();
  }

  // Mark the "Secure the Gates" task as completed
  const secureGatesCheckbox = document.getElementById("checkboxPasswordGame");
  if (secureGatesCheckbox) {
    secureGatesCheckbox.checked = true;
  }

  // Add the "First Line of Defense" achievement
  addAchievement("First Line of Defense", "🏆");

  // Show the achievement pop-up
  showAchievementPopup("First Line of Defense");

  // Remove the "Secure the Gates" task from objectives
  const secureGatesTask = document.querySelector("#checklist li:nth-child(1)");
  if (secureGatesTask) {
    secureGatesTask.remove();
  }

  // Add a new task (example: "Build a Moat")
  addNewTask("Build a Moat", "startMoatGame");

  // Revert the music to the original track
  revertToOriginalMusic();
}

// Function to add an achievement
function addAchievement(text, icon) {
  const achievementsList = document.querySelector("#achievements ul");
  const achievementItem = document.createElement("li");
  achievementItem.innerHTML = `
    <span class="achievement-icon">${icon}</span>
    <span class="achievement-text">${text}</span>
  `;
  achievementsList.appendChild(achievementItem);
}

// Function to add a new task
// Function to add a new task with difficulty
function addNewTask(text, taskId, difficulty = "easy") {
    const checklist = document.querySelector("#checklist ul");
    const newTask = document.createElement("li");
  
    // Add the difficulty class
    if (difficulty === "medium") {
      newTask.classList.add("medium");
    } else if (difficulty === "hard") {
      newTask.classList.add("hard");
    }
  
    newTask.innerHTML = `
      <input type="checkbox" id="checkbox${taskId}" disabled>
      <span>${text}</span>
      <button class="startTask" id="${taskId}">Start Task</button>
    `;
    checklist.appendChild(newTask);
  }
// Function to show the achievement pop-up
function showAchievementPopup(achievementName) {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.innerHTML = `
    <span class="achievement-icon">🏆</span>
    <span class="achievement-text">Achievement Unlocked: ${achievementName}</span>
  `;

  // Append the popup to the body
  document.body.appendChild(popup);

  // Add the "show" class to trigger the animation
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  // Remove the popup after the animation ends
  setTimeout(() => {
    popup.remove();
  }, 3000); // Adjust timing to match the animation duration
}

// Call the collision check function periodically
setInterval(checkEnemyCollision, 100);


// Function to revert the music to the original track
function revertToOriginalMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    const musicSource = document.getElementById("musicSource");
    musicSource.src = originalMusicSource;
    backgroundMusic.load();
    backgroundMusic.play();
  }