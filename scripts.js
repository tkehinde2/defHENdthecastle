const intro = document.getElementById("intro");
const castle = document.getElementById("castle");
const grass = document.getElementById("grass");
const checklist = document.getElementById("checklist");
const achievements = document.getElementById("achievements");

window.onload = function() {
  intro.classList.add('introDown');
}

function start() {
  const castleName = document.getElementById("castleName").value;
  if (!castleName) {
    alert("Please enter a castle name!");
    return;
  }

  intro.classList.remove("introDown");
  intro.classList.add("introUp");

  grass.classList.add("grassDown");
  castle.classList.add("landCastle");

  checklist.classList.add("showMenus");
  achievements.classList.add("showMenus");
}
const passwordGameOverlay = document.getElementById("passwordGameOverlay");
const passwordInput = document.getElementById("passwordInput");
const closeOverlay = document.getElementById("closeOverlay");

const passwordHints = [
  { id: "hintLength", regex: /.{8,}/, message: "🔒 Must be at least 8 characters long." },
  { id: "hintNumber", regex: /\d/, message: "🔢 Must contain a number." },
  { id: "hintSpecialChar", regex: /[!@#$%^&*(),.?":{}|<>]/, message: "✨ Must contain a special character." },
  { id: "hintCastleWord", regex: /defend|castle|king|shield/i, message: "🏰 Must include a castle-related word (e.g., 'defend')." },
  { id: "hintEmoji", regex: /[\u{1F600}-\u{1F6FF}]/u, message: "😀 Must include an emoji." },
];

let currentTaskCheckbox = null;
let currentHintIndex = 0;

// Show the password game overlay
function showPasswordGame(checkbox) {
  currentTaskCheckbox = checkbox;
  passwordGameOverlay.style.display = "flex";
  passwordInput.value = "";
  currentHintIndex = 0;
  resetHints();
  revealNextHint();
  updatePasswordHints();
}

// Hide the password game overlay
function hidePasswordGame() {
  passwordGameOverlay.style.display = "none";
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

// Event listener for the close button
closeOverlay.addEventListener("click", hidePasswordGame);

// Add event listeners to "Start Task" buttons
document.querySelectorAll(".startTask").forEach((button) => {
  button.addEventListener("click", () => {
    const checkbox = button.closest("li").querySelector("input[type='checkbox']");
    showPasswordGame(checkbox);
  });
});