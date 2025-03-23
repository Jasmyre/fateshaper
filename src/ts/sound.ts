export const outcomePriorities: { [key: string]: number } = {
	crit: 5,
	damage: 4,
	heal: 3,
	miss: 2,
	skip: 1,
};

export const soundDamage = new Audio("/hit.mp3");
export const soundHeal = new Audio("/heal.mp3");
export const soundMiss = new Audio("/miss.mp3");
export const soundSkip = new Audio("/mc_crit.mp3");
export const soundCrit = new Audio("/crit.mp3");

export const backgroundMusicVolume = 0.7;

const backgroundMusic = document.getElementById("bg-music") as HTMLAudioElement;

export function playSoundForOutcome(outcomeType: string): void {
	if (backgroundMusic.paused) {
		backgroundMusic.play();
		backgroundMusic.volume = backgroundMusicVolume;
	}

	switch (outcomeType) {
		case "damage":
			soundDamage.play();
			break;
		case "heal":
			soundHeal.play();
			break;
		case "miss":
			soundMiss.play();
			break;
		case "skip":
			soundSkip.play();
			break;
		case "crit":
			soundCrit.play();
			break;
		default:
			break;
	}
}
