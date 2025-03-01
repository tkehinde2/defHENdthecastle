var castleName;

const intro = document.getElementById("intro");
const castle = document.getElementById("castle")
const grass = document.getElementById("grass");
const checklist = document.getElementById("checklist");
const achievements = document.getElementById("achievements");

window.onload = function() {
    intro.classList.add('introDown'); // Add the animation class when the page loads
}


function start(){
    castleName = document.getElementById("castleName").value;   

    intro.classList.remove("introDown");
    intro.classList.add("introUp");

    grass.classList.add("grassDown");
    castle.classList.add("landCastle")

    checklist.classList.add("showMenus");
    achievements.classList.add("showMenus");
}