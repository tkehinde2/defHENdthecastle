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


// Phishing game state
const phishingGameState = {
  currentEmailIndex: 0,
  correctCount: 0,
  emails: [
    {
      from: "Royal Treasury &lt;treasury@kingdom-finances.gov&gt;",
      to: "Loyal Subject &lt;you@kingdom.gov&gt;",
      subject: "URGENT: Action Required - Your Royal Stipend",
      body: `
        <p>Dear Loyal Subject,</p>
        <p>The Royal Treasury has attempted to deposit your monthly stipend, but there was an issue with your account information. To avoid any delays in receiving your gold coins, please update your information immediately.</p>
        <p>Click <a href="#">here</a> to verify your identity and update your treasury account details. You will need to provide your full name, residence location, and the secret password to your kingdom account.</p>
        <p>This matter requires your immediate attention. Failure to respond within 1 day will result in forfeiture of your monthly stipend.</p>
        <p>With respect,<br>
         Lord Goldkeeper<br>
         Royal Treasury Department</p>
        <p><small>Note: The kingdom never asks for your secret password unless requested through official channels.</small></p>
      `,
      isPhishing: true,
      phishingIndicators: [
        "Requests your secret password, which legitimate messages would never do",
        "Creates urgency with a threat of losing funds",
        "Contains contradictory information (note at bottom contradicts main message)",
        "Uses a suspicious domain (kingdom-finances.gov instead of kingdom.gov)"
      ],
      explanation: "This message is a phishing attempt! It asks for your secret password, creates false urgency, and uses a suspicious domain name that doesn't match official kingdom communications."
    },
    {
      from: "Royal Guard Captain &lt;captain@royal-guard.kingdom.gov&gt;",
      to: "Loyal Subject &lt;you@kingdom.gov&gt;",
      subject: "Monthly Security Patrol Schedule",
      body: `
        <p>Greetings, Kingdom Defender,</p>
        <p>Attached is the monthly schedule for security patrols around the castle perimeter. Please review your assigned shifts and report any conflicts to your squadron leader.</p>
        <p>The schedule can be viewed securely through the Royal Guard Portal. <a href="#">Access the portal here</a> using your standard kingdom credentials.</p>
        <p>Remember to arrive at the armory 15 minutes before your shift for proper equipment inspection.</p>
        <p>Serving with honor,<br>
         Captain Shieldbearer<br>
         Royal Guard Command</p>
      `,
      isPhishing: false,
      explanation: "This is a legitimate message. It does not ask for sensitive information, directs you to the official portal, and contains expected information about guard duties."
    },
    {
      from: "Castle IT Support &lt;support@kngdom.gov&gt;",
      to: "Kingdom Employee &lt;you@kingdom.gov&gt;",
      subject: "CRITICAL: Your Kingdom Account Will Be Locked",
      body: `
        <p>Dear Valued Staff Member,</p>
        <p>Due to recent security breaches, we are implementing new security measures. Your account has been flagged for immediate password reset.</p>
        <p>You must <a href="#">click here urgently</a> to reset your password within the next 2 hours or your account will be automatically locked.</p>
        <p>When resetting, please provide your:</p>
        <ul>
          <li>Current password</li>
          <li>Mother's maiden name</li>
          <li>First pet's name</li>
        </ul>
        <p>Regards,<br>
         IT Security Team</p>
      `,
      isPhishing: true,
      phishingIndicators: [
        "There's a spelling error in the sender's email (kngdom.gov instead of kingdom.gov)",
        "Creates false urgency with a threat",
        "Asks for security question answers along with your current password",
        "Does not address you by your specific name or title"
      ],
      explanation: "This is a phishing attempt! The sender's email contains a misspelling (kngdom.gov), it creates urgency with threats, and asks for sensitive information including your current password and security question answers."
    }
  ]
};

// Function to open the phishing task modal
function openPhishingTask() {
  // Reset to first email if task was previously completed
  if (phishingGameState.currentEmailIndex >= phishingGameState.emails.length) {
    phishingGameState.currentEmailIndex = 0;
    phishingGameState.correctCount = 0;
  }
  
  // Display the current email
  displayCurrentEmail();
  
  // Show the overlay
  document.getElementById('phishingOverlay').style.display = 'flex';
}

// Function to display the current email
function displayCurrentEmail() {
  const currentEmail = phishingGameState.emails[phishingGameState.currentEmailIndex];
  
  // Update email content
  document.getElementById('emailFrom').innerHTML = currentEmail.from;
  document.getElementById('emailTo').innerHTML = currentEmail.to;
  document.getElementById('emailSubject').innerHTML = currentEmail.subject;
  document.getElementById('emailBody').innerHTML = currentEmail.body;
  
  // Update progress tracker
  document.getElementById('currentEmailNumber').textContent = phishingGameState.currentEmailIndex + 1;
}

// Function to handle user decision on phishing email
function makeDecision(decision) {
  const currentEmail = phishingGameState.emails[phishingGameState.currentEmailIndex];
  const isCorrect = (decision === 'phishing' && currentEmail.isPhishing) || 
                    (decision === 'safe' && !currentEmail.isPhishing);
  
  if (isCorrect) {
    // Correct answer
    phishingGameState.correctCount++;
    showSuccess("Well done! You correctly identified this message.");
    moveToNextEmail();
  } else {
    // Incorrect answer - show detailed feedback
    if (currentEmail.isPhishing) {
      // User thought a phishing email was safe
      
      // Display phishing indicators
      let indicatorsHTML = '<h3>Phishing Indicators:</h3><ul>';
      currentEmail.phishingIndicators.forEach(indicator => {
        indicatorsHTML += `<li>${indicator}</li>`;
      });
      indicatorsHTML += '</ul>';
      document.getElementById('phishingIndicators').innerHTML = indicatorsHTML;
      
      // Show error feedback overlay
      document.getElementById('phishingOverlay').style.display = 'none';
      document.getElementById('errorFeedbackOverlay').style.display = 'flex';
    } else {
      // User thought a safe email was phishing
      showError("This was actually a safe message. Not all official communications are suspicious!");
      moveToNextEmail();
    }
  }
}

// Function to close error feedback and move to next email
function closeErrorFeedback() {
  document.getElementById('errorFeedbackOverlay').style.display = 'none';
  moveToNextEmail();
}

// Function to move to the next email
function moveToNextEmail() {
  phishingGameState.currentEmailIndex++;
  
  // Check if we've gone through all emails
  if (phishingGameState.currentEmailIndex >= phishingGameState.emails.length) {
    // All emails processed, show completion overlay
    console.log("The Phishing Game has ended!!");
    document.getElementById('phishingOverlay').style.display = 'none';
    
    // Mark the task as completed if at least 2 correct
    if (phishingGameState.correctCount >= 2) {
      const checkbox = document.querySelector('#checklist li:nth-child(2) input[type="checkbox"]');
      if (checkbox) checkbox.checked = true;
      
      // Remove the start button if it exists
      const element = document.getElementById("startPhishingGame");
      if (element) element.remove();

      // Display completion overlay
      document.getElementById('correctCount').textContent = phishingGameState.correctCount;
      document.getElementById('completionOverlay').style.display = 'flex';
    }
  } else {
    // Display the next email
    displayCurrentEmail();
    document.getElementById('phishingOverlay').style.display = 'flex';
  }
}

// Function to close completion overlay
function closeCompletionOverlay() {
  document.getElementById('completionOverlay').style.display = 'none';
}

// Helper functions for notifications
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

// Set up event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up help icon functionality
  const helpIcon = document.getElementById('phishingHelpIcon');
  const helpTooltip = document.getElementById('phishingHelpTooltip');
  const closeTooltipBtn = document.querySelector('.close-tooltip-btn');
  
  helpIcon.addEventListener('click', function() {
    helpTooltip.style.display = 'block';
  });
  
  closeTooltipBtn.addEventListener('click', function() {
    helpTooltip.style.display = 'none';
  });
});

// Wave 1
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
    }, 5000);

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

  function showWaveOneVictory(){
    const waveOneWinnerOverlay = document.getElementById("waveOneWinnerOverlay");
    waveOneWinnerOverlay.style.display = "flex";
    waveOneWinnerOverlay.style.display = "flex";
  }
  function hideWaveOneWinnerOverlay(){
    const waveOneWinnerOverlay = document.getElementById("waveOneWinnerOverlay");
    waveOneWinnerOverlay.remove();
    waveOneWinnerOverlay.remove();
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
    console.log("Collestion with tower!");
    showWaveOneVictory();
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

function handleEnemyCollision() {
    // Ensure the achievement is only added once
    if (isAchievementAdded) return;
    isAchievementAdded = true;
  
    // Remove the "Secure the Gates" task
    const secureGatesTask = document.querySelector("#checklist li:nth-child(1)");
    if (secureGatesTask) {
      secureGatesTask.remove();
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
  
    // Revert the music to the original track
    revertToOriginalMusic();
  
    // Ensure the "Protect the King's Data" and "Defend Against Hackers" tasks remain visible
    const protectKingsDataTask = document.querySelector("#checklist li:nth-child(1)");
    const defendAgainstHackersTask = document.querySelector("#checklist li:nth-child(2)");
  
    if (protectKingsDataTask) {
      protectKingsDataTask.style.display = "block"; // Ensure it's visible
    }
    if (defendAgainstHackersTask) {
      defendAgainstHackersTask.style.display = "block"; // Ensure it's visible
    }
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
  // Add this function to handle Wave 2
function launchWaveTwo() {
    const waveTwoOverlay = document.getElementById("waveTwoOverlay");
  
    setTimeout(() => {
      waveTwoOverlay.style.display = "flex";
    }, 3000);
  
    // Add any animations or logic for Wave 2 here
  }
  
  function hideWaveTwoOverlay() {
    const waveTwoOverlay = document.getElementById("waveTwoOverlay");
    waveTwoOverlay.remove();
  
    // Add an achievement for completing Wave 2
    addAchievement("Wave 2: Defended the Castle", "🛡️");
  
    // Show the "Defend Against Hackers" task
    const defendAgainstHackersTask = document.querySelector("#checklist li:nth-child(2)");
    if (defendAgainstHackersTask) {
      defendAgainstHackersTask.style.display = "block";
    }
  }
  
  // Modify the checkTwoFactorCode function to trigger Wave 2
  function checkTwoFactorCode() {
    const enteredCode = twoFactorInput.value.trim();
    if (enteredCode === correctTwoFactorCode.toString()) {
      hideTwoFactorGame(true);
      launchWaveTwo(); // Launch Wave 2 after completing the Two-Factor task
    }
  }
  function addNewTask(text, taskId, difficulty = "easy") {
    const checklist = document.querySelector("#checklist ul");
  
    // Create the new task
    const newTask = document.createElement("li");
  
    // Add the difficulty class
    if (difficulty === "medium") {
      newTask.classList.add("medium");
    } else if (difficulty === "hard") {
      newTask.classList.add("hard");
    }
  
    // Add the task content
    newTask.innerHTML = `
      <input type="checkbox" id="checkbox${taskId}" disabled>
      <span>${text}</span>
      <button class="startTask" id="${taskId}">Start Task</button>
    `;
  
    // Append the new task to the end of the checklist
    checklist.appendChild(newTask);
  }