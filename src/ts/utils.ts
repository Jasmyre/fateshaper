const idleMusic = new Audio("/idle.mp3");

window.addEventListener("load", () => {
	idleMusic.play();
	idleMusic.volume = 0.75;
	idleMusic.loop = true;
});
