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
    intro.classList.add('introDown');
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
  }
  
  // Function to display the castle name at the top middle of the page
  function displayCastleName(name) {
    // Create a new div for the castle name
    const castleNameDisplay = document.createElement("div");
    castleNameDisplay.id = "castleNameDisplay";
    castleNameDisplay.textContent = name ;
  
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
  let timeLimit = 60; // 60 seconds time limit
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
  function hidePasswordGame() {
    passwordGameOverlay.style.display = "none";
    clearInterval(timerInterval);
    const element = document.getElementById("startPasswordGame");
    if (element) {
      element.remove();
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
  
      // Check the current hint
      if (currentHintIndex < passwordHints.length) {
        const currentHint = passwordHints[currentHintIndex];
        const hintElement = document.getElementById(currentHint.id);
  
        if (currentHint.regex.test(password)) {
          hintElement.classList.add("completed");
          currentHintIndex++;
          revealNextHint();
        }
      }
  
      // Check if all hints are completed
      if (currentHintIndex >= passwordHints.length) {
        currentTaskCheckbox.checked = true;
        setTimeout(() => {
          hidePasswordGame();
        }, 1000); // Wait 1 second before closing
      }
    });
  }
  
  // Start the timer
  function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `Time Left: ${timeLimit}s`;
    timerInterval = setInterval(() => {
      timeLimit--;
      timerDisplay.textContent = `Time Left: ${timeLimit}s`;
      if (timeLimit <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! Try again.");
        hidePasswordGame();
      }
    }, 1000);
  }
  
  // Event listener for the close button
  closeOverlay.addEventListener("click", hidePasswordGame);
  
  // Add event listeners to "Start Task" buttons
  document.querySelectorAll(".startTask").forEach((button) => {
    button.addEventListener("click", () => {
      const checkbox = button.closest("li").querySelector("input[type='checkbox']");
      showPasswordGame(checkbox);
    });
  });