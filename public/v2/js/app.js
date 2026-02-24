document.addEventListener("DOMContentLoaded", function () {

    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const playerLogo = document.getElementById("playerLogo");
    const liveBadge = document.getElementById("liveBadge");
    const equalizerBars = document.querySelectorAll(".equalizer span");

    let isPlaying = false;

    playBtn.addEventListener("click", function () {
        if (!isPlaying) {
            playerLogo.style.animationPlayState = "running";
            equalizerBars.forEach(bar => {
                bar.style.animationPlayState = "running";
            });
            liveBadge.textContent = "ON AIR";
            liveBadge.classList.add("on-air");
            isPlaying = true;
        }
    });

    stopBtn.addEventListener("click", function () {
        if (isPlaying) {
            playerLogo.style.animationPlayState = "paused";
            equalizerBars.forEach(bar => {
                bar.style.animationPlayState = "paused";
            });
            liveBadge.textContent = "OFF AIR";
            liveBadge.classList.remove("on-air");
            isPlaying = false;
        }
    });

});