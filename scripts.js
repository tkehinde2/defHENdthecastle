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