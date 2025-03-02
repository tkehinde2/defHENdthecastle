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

// Hide the password game overlay
function hidePasswordGame(isTimeEnded) {
  passwordGameOverlay.style.display = "none";
  clearInterval(timerInterval);
  const element = document.getElementById("startPasswordGame");
  if (isTimeEnded == false) {
    element.remove();
    box = document.getElementById("checkboxPasswordGame");
    box.checked = true;
  }
}

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
    
    // You could also add code here to update achievements or game progress
    // For example, show a notification or update an achievement
    // const achievementsList = document.querySelector('#achievements ul');
    // const achievementItem = achievementsList.querySelector('li:nth-child(2)');
    // achievementItem.style.color = '#4caf50'; // Change color to indicate completion
    
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
    const tower = document.getElementById("tower");
    tower.classList.add("landTower");
  }