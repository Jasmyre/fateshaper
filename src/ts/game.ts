// ===== Balancing Constants =====
const ROUND_DELAY = 1400; // ms for round animations
const OUTCOME_DISPLAY_DURATION = 3000; // ms to show outcome messages
// const TOTAL_ROUND_DELAY = ROUND_DELAY + OUTCOME_DISPLAY_DURATION;

// Health and Damage Constants
const BASE_HEALTH = 100;
const DAMAGE_VARIATION_MIN = 0.8;
const DAMAGE_VARIATION_MAX = 1.2; // computed as min + 0.4
const CRIT_MULTIPLIER = 1.5;
const SPEED_REDUCTION_PER_POINT = 0.05;
const DEFENSE_REDUCTION_PER_POINT = 0.03;

// Fatigue & Momentum Constants
const FATIGUE_INCREASE = 3;
const TIE_FATIGUE_INCREASE = 1;
const MOMENTUM_INCREASE = 10;

// Healing Constants (nerfed)
const HEAL_BASE = 1.5; // base heal value
const HEAL_MULTIPLIER = 2; // healing stat multiplier

// ===== Element Selectors =====
const buttons = document.querySelectorAll(
	".button"
) as NodeListOf<HTMLButtonElement>;

const playerHand = document.getElementById("player-hand") as HTMLImageElement;
const robotHand = document.getElementById("robot-hand") as HTMLImageElement;

const rockButton = document.getElementById("rock") as HTMLButtonElement;
const paperButton = document.getElementById("paper") as HTMLButtonElement;
const scissorsButton = document.getElementById("scissors") as HTMLButtonElement;
const skipButton = document.getElementById("skip") as HTMLButtonElement;
const healButton = document.getElementById("heal") as HTMLButtonElement;

const upgradeStrengthButton = document.getElementById(
	"upgrade-strength"
) as HTMLButtonElement;
const upgradePrecisionButton = document.getElementById(
	"upgrade-precision"
) as HTMLButtonElement;
const upgradeCritButton = document.getElementById(
	"upgrade-crit"
) as HTMLButtonElement;
const upgradeSpeedButton = document.getElementById(
	"upgrade-speed"
) as HTMLButtonElement;
const upgradeDefenseButton = document.getElementById(
	"upgrade-defense"
) as HTMLButtonElement;
const upgradeHealingButton = document.getElementById(
	"upgrade-healing"
) as HTMLButtonElement;

const playerHPNumberDisplay = document.getElementById(
	"player-hp-number"
) as HTMLElement;
const robotHPNumberDisplay = document.getElementById(
	"robot-hp-number"
) as HTMLElement;

const playerHPDisplay = document.getElementById(
	"player-hp-display"
) as HTMLElement;
const robotHPDisplay = document.getElementById(
	"robot-hp-display"
) as HTMLElement;
const roundDisplay = document.getElementById("round") as HTMLElement;

const playerMomentumNumberDisplay = document.getElementById(
	"player-momentum-number"
) as HTMLElement;
const robotMomentumNumberDisplay = document.getElementById(
	"robot-momentum-number"
) as HTMLElement;

const playerMomentumDisplay = document.getElementById(
	"player-momentum-display"
) as HTMLElement;
const robotMomentumDisplay = document.getElementById(
	"robot-momentum-display"
) as HTMLElement;

const playerFatigueNumberDisplay = document.getElementById(
	"player-fatigue-number"
) as HTMLElement;
const robotFatigueNumberDisplay = document.getElementById(
	"robot-fatigue-number"
) as HTMLElement;

const playerFatigueDisplay = document.getElementById(
	"player-fatigue-display"
) as HTMLElement;
const robotFatigueDisplay = document.getElementById(
	"robot-fatigue-display"
) as HTMLElement;

const playerUpgradePointsDisplay = document.getElementById(
	"player-upgrade-points"
) as HTMLElement;
const robotUpgradePointsDisplay = document.getElementById(
	"robot-upgrade-points"
) as HTMLElement;

const playerUpgradeStrengthDisplay = document.getElementById(
	"player-upgrade-strength-display"
) as HTMLElement;
const playerUpgradePrecisionDisplay = document.getElementById(
	"player-upgrade-precision-display"
) as HTMLElement;
const playerUpgradeCritDisplay = document.getElementById(
	"player-upgrade-crit-display"
) as HTMLElement;
const playerUpgradeSpeedDisplay = document.getElementById(
	"player-upgrade-speed-display"
) as HTMLElement;
const playerUpgradeDefenseDisplay = document.getElementById(
	"player-upgrade-defense-display"
) as HTMLElement;
const playerUpgradeHealingDisplay = document.getElementById(
	"player-upgrade-healing-display"
) as HTMLElement;

const robotUpgradeStrengthDisplay = document.getElementById(
	"robot-upgrade-strength-display"
) as HTMLElement;
const robotUpgradePrecisionDisplay = document.getElementById(
	"robot-upgrade-precision-display"
) as HTMLElement;
const robotUpgradeCritDisplay = document.getElementById(
	"robot-upgrade-crit-display"
) as HTMLElement;
const robotUpgradeSpeedDisplay = document.getElementById(
	"robot-upgrade-speed-display"
) as HTMLElement;
const robotUpgradeDefenseDisplay = document.getElementById(
	"robot-upgrade-defense-display"
) as HTMLElement;
const robotUpgradeHealingDisplay = document.getElementById(
	"robot-upgrade-healing-display"
) as HTMLElement;

// Outcome containers (should be in your HTML)
const playerOutcomeDisplay = document.getElementById(
	"player-outcome"
) as HTMLElement;
const robotOutcomeDisplay = document.getElementById(
	"robot-outcome"
) as HTMLElement;

// ===== Global Game State Variables =====
let roundNum = 1;
let playerHealth = BASE_HEALTH,
	robotHealth = BASE_HEALTH;
let playerHPLoss = 0,
	robotHPLoss = 0;
let playerStrength = 1,
	robotStrength = 1;
let playerPrecision = 0,
	robotPrecision = 0;
let playerCrit = 0,
	robotCrit = 0;
let playerSpeed = 0,
	robotSpeed = 0;
let playerDefense = 0,
	robotDefense = 0;
let playerHealing = 0,
	robotHealing = 0;
let playerFatigue = 0,
	robotFatigue = 0;
let playerMomentum = 0,
	robotMomentum = 0;
let playerUpgradePoints = 0,
	robotUpgradePoints = 0;

// ===== Helper Functions =====

// showOutcomeDirect: Sets outcome message on the given container using outcomeType for styling,
// and then clears it after OUTCOME_DISPLAY_DURATION.
function showOutcomeDirect(
	container: HTMLElement,
	text: string,
	outcomeType: string
): void {
	container.textContent = text;
	container.className = ""; // Clear previous classes
	container.classList.add("text-xl", "outcome", "block");
	switch (outcomeType) {
		case "damage":
			container.classList.add("outcome-damage");
			break;
		case "heal":
			container.classList.add("outcome-heal");
			break;
		case "miss":
			container.classList.add("outcome-miss");
			break;
		case "skip":
			container.classList.add("outcome-skip");
			break;
		case "crit":
			container.classList.add("outcome-crit");
			break;
		default:
			break;
	}
	setTimeout(() => {
		container.textContent = "";
		container.className = "hidden";
	}, OUTCOME_DISPLAY_DURATION);
}

// disableButtons: Disable or enable all action and upgrade buttons.
function disableButtons(disable: boolean): void {
	buttons.forEach((button) => (button.disabled = disable));
}

// checkWin: Checks if either player has reached 0 HP.
function checkWin(): void {
	if (robotHealth <= 0) {
		window.location.href =
			"/rock-paper-scissors/history/index.html?playerWon=true";
	} else if (playerHealth <= 0) {
		window.location.href =
			"/rock-paper-scissors/history/index.html?playerWon=false";
	}
}

// finishRound: Called at the end of a round to update state and re-enable buttons.
// function finishRound(roundOutcome: "player" | "robot" | "tie"): void {
// 	playerUpgradePoints++;
// 	robotUpgradePoints++;
// 	robotAutoUpgrade();
// 	updateStatsAfterRound(roundOutcome);
// 	checkWin();
// 	roundNum++;
// 	updateRound();
// 	// Re-enable buttons after outcome display duration
// 	setTimeout(() => {
// 		disableButtons(false);
// 	}, OUTCOME_DISPLAY_DURATION);
// }

// logStats: For debugging purposes.
function logStats(): void {
	console.log(
		"Player HP:",
		playerHealth,
		"Strength:",
		playerStrength,
		"Precision:",
		playerPrecision,
		"Crit:",
		playerCrit,
		"Speed:",
		playerSpeed,
		"Defense:",
		playerDefense,
		"Fatigue:",
		playerFatigue,
		"Momentum:",
		playerMomentum,
		"Healing:",
		playerHealing,
		"Upgrade Points:",
		playerUpgradePoints
	);
	console.log(
		"Robot HP:",
		robotHealth,
		"Strength:",
		robotStrength,
		"Precision:",
		robotPrecision,
		"Crit:",
		robotCrit,
		"Speed:",
		robotSpeed,
		"Defense:",
		robotDefense,
		"Fatigue:",
		robotFatigue,
		"Momentum:",
		robotMomentum,
		"Healing:",
		robotHealing,
		"Upgrade Points:",
		robotUpgradePoints
	);
}

// updateRound: Updates UI elements to reflect the current game state.
function updateRound(): void {
	roundDisplay.textContent = `ROUND: ${roundNum}`;

	playerHPNumberDisplay.textContent = String(playerHealth);
	playerHPDisplay.style.width = `calc(${playerHealth}%)`;
	playerMomentumNumberDisplay.textContent = String(playerMomentum);
	playerMomentumDisplay.style.width = `calc(${playerMomentum}%)`;
	playerFatigueNumberDisplay.textContent = String(playerFatigue);
	playerFatigueDisplay.style.width = `calc(${playerFatigue}%)`;

	robotHPNumberDisplay.textContent = String(robotHealth);
	robotHPDisplay.style.width = `calc(${robotHealth}%)`;
	robotMomentumNumberDisplay.textContent = String(robotMomentum);
	robotMomentumDisplay.style.width = `calc(${robotMomentum}%)`;
	robotFatigueNumberDisplay.textContent = String(robotFatigue);
	robotFatigueDisplay.style.width = `calc(${robotFatigue}%)`;

	playerUpgradePointsDisplay.textContent = `Player 1 upgrade points: ${playerUpgradePoints}`;
	robotUpgradePointsDisplay.textContent = `Player 2 upgrade points: ${robotUpgradePoints}`;

	playerUpgradeStrengthDisplay.style.width = `calc(0% + ${
		playerStrength * 10
	}%)`;
	playerUpgradePrecisionDisplay.style.width = `calc(0% + ${
		playerPrecision * 10
	}%)`;
	playerUpgradeCritDisplay.style.width = `calc(0% + ${playerCrit * 10}%)`;
	playerUpgradeSpeedDisplay.style.width = `calc(0% + ${playerSpeed * 10}%)`;
	playerUpgradeDefenseDisplay.style.width = `calc(0% + ${
		playerDefense * 10
	}%)`;
	playerUpgradeHealingDisplay.style.width = `calc(0% + ${
		playerHealing * 10
	}%)`;

	robotUpgradeStrengthDisplay.style.width = `calc(0% + ${
		robotStrength * 10
	}%)`;
	robotUpgradePrecisionDisplay.style.width = `calc(0% + ${
		robotPrecision * 10
	}%)`;
	robotUpgradeCritDisplay.style.width = `calc(0% + ${robotCrit * 10}%)`;
	robotUpgradeSpeedDisplay.style.width = `calc(0% + ${robotSpeed * 10}%)`;
	robotUpgradeDefenseDisplay.style.width = `calc(0% + ${robotDefense * 10}%)`;
	robotUpgradeHealingDisplay.style.width = `calc(0% + ${robotHealing * 10}%)`;

	logStats();
}

// updateStatsAfterRound: Adjusts fatigue and momentum based on the round outcome.
function updateStatsAfterRound(result: "player" | "robot" | "tie"): void {
	if (result === "player") {
		playerMomentum += MOMENTUM_INCREASE;
		playerFatigue += FATIGUE_INCREASE;
		robotMomentum = 0;
		robotFatigue += FATIGUE_INCREASE;
	} else if (result === "robot") {
		robotMomentum += MOMENTUM_INCREASE;
		robotFatigue += FATIGUE_INCREASE;
		playerMomentum = 0;
		playerFatigue += FATIGUE_INCREASE;
	} else {
		playerFatigue += TIE_FATIGUE_INCREASE;
		robotFatigue += TIE_FATIGUE_INCREASE;
	}
	playerFatigue = Math.min(Math.max(playerFatigue, 0), 100);
	robotFatigue = Math.min(Math.max(robotFatigue, 0), 100);
	playerMomentum = Math.min(Math.max(playerMomentum, 0), 100);
	robotMomentum = Math.min(Math.max(robotMomentum, 0), 100);
}

// logDamageCalculation: Logs the detailed damage calculation for debugging.
function logDamageCalculation(
	effectiveStrength: number,
	baseDamage: number,
	critMultiplier: number,
	speedReduction: number,
	defenseReduction: number,
	damageAfterReduction: number,
	finalDamage: number
): void {
	console.log("=== Damage Calculation Breakdown ===");
	console.log(`Effective Strength: ${effectiveStrength.toFixed(2)}`);
	console.log(
		`Base Damage: ${baseDamage} (effectiveStrength * variation factor)`
	);
	console.log(`Crit Multiplier: ${critMultiplier}`);
	console.log(
		`Speed Reduction: ${speedReduction.toFixed(
			2
		)} (defenderSpeed * ${SPEED_REDUCTION_PER_POINT})`
	);
	console.log(
		`Defense Reduction Factor: ${defenseReduction.toFixed(
			2
		)} (1 - defenderDefense * ${DEFENSE_REDUCTION_PER_POINT})`
	);
	console.log(`Damage After Reductions: ${damageAfterReduction.toFixed(2)}`);
	console.log(`Final Damage (rounded): ${finalDamage}`);
	console.log("=====================================");
}

// calculateDamage: Computes damage and returns an object with damage and outcome.
function calculateDamage(
	attackerStrength: number,
	attackerPrecision: number,
	attackerCrit: number,
	defenderSpeed: number,
	defenderDefense: number,
	attackerFatigue: number,
	attackerMomentum: number
): { damage: number; outcome: string } {
	const effectiveStrength =
		attackerStrength *
		(1 + attackerMomentum / 100) *
		(1 - attackerFatigue / 100);
	const effectivePrecision =
		attackerPrecision *
		(1 - attackerFatigue / 100) *
		(1 + attackerMomentum / 100);
	const effectiveCrit =
		attackerCrit *
		(1 + attackerMomentum / 100) *
		(1 - attackerFatigue / 100);

	const hitRoll = Math.random();
	if (hitRoll >= effectivePrecision / 10) {
		console.log(
			`Attack missed! Hit roll: ${hitRoll.toFixed(2)} vs threshold: ${(
				effectivePrecision / 10
			).toFixed(2)} (Effective Precision: ${effectivePrecision.toFixed(
				2
			)})`
		);
		return { damage: 0, outcome: "miss" };
	}

	const variation =
		DAMAGE_VARIATION_MIN +
		Math.random() * (DAMAGE_VARIATION_MAX - DAMAGE_VARIATION_MIN);
	let baseDamage = Math.floor(effectiveStrength * variation);
	const critRoll = Math.random();
	let critMultiplier = 1;
	let outcomeText = "";
	if (critRoll < effectiveCrit / 10) {
		critMultiplier = CRIT_MULTIPLIER;
		outcomeText = "crit";
		console.log(
			`Critical hit! Crit roll: ${critRoll.toFixed(2)} vs threshold: ${(
				effectiveCrit / 10
			).toFixed(2)} (Effective Crit: ${effectiveCrit.toFixed(2)})`
		);
	}
	if (!outcomeText) outcomeText = "normal";

	const speedReduction = defenderSpeed * SPEED_REDUCTION_PER_POINT;
	const damageAfterSpeed = baseDamage * critMultiplier * (1 - speedReduction);
	const defenseReductionFactor =
		1 - defenderDefense * DEFENSE_REDUCTION_PER_POINT;
	const damageAfterReduction = damageAfterSpeed * defenseReductionFactor;
	const finalDamage = Math.max(Math.floor(damageAfterReduction), 0);

	logDamageCalculation(
		effectiveStrength,
		baseDamage,
		critMultiplier,
		speedReduction,
		defenseReductionFactor,
		damageAfterReduction,
		finalDamage
	);
	return { damage: finalDamage, outcome: outcomeText };
}

// calculateHeal: Computes the heal amount based on a base value and the healing stat.
function calculateHeal(base: number, healingStat: number): number {
	return base + healingStat * HEAL_MULTIPLIER;
}

// ===== Upgrade Functions =====

function upgradePlayerStat(stat: string): void {
	if (playerUpgradePoints <= 0) {
		alert("No upgrade points available");
		return;
	}
	switch (stat) {
		case "strength":
			if (playerStrength === 10) {
				alert("Player strength is max");
				return;
			}
			playerStrength++;
			break;
		case "precision":
			if (playerPrecision === 10) {
				alert("Player precision is max");
				return;
			}
			playerPrecision++;
			break;
		case "crit":
			if (playerCrit === 10) {
				alert("Player crit is max");
				return;
			}
			playerCrit++;
			break;
		case "speed":
			if (playerSpeed === 10) {
				alert("Player speed is max");
				return;
			}
			playerSpeed++;
			break;
		case "defense":
			if (playerDefense === 10) {
				alert("Player defense is max");
				return;
			}
			playerDefense++;
			break;
		case "healing":
			if (playerHealing === 10) {
				alert("Player healing is max");
				return;
			}
			playerHealing++;
			break;
		default:
			console.log("Unknown stat");
			return;
	}
	playerUpgradePoints--;
	updateRound();
}

function upgradeRobotStat(stat: string): void {
	switch (stat) {
		case "strength":
			if (robotStrength === 10) return;
			robotStrength++;
			break;
		case "precision":
			if (robotPrecision === 10) return;
			robotPrecision++;
			break;
		case "crit":
			if (robotCrit === 10) return;
			robotCrit++;
			break;
		case "speed":
			if (robotSpeed === 10) return;
			robotSpeed++;
			break;
		case "defense":
			if (robotDefense === 10) return;
			robotDefense++;
			break;
		case "healing":
			if (robotHealing === 10) return;
			robotHealing++;
			break;
		default:
			break;
	}
	robotUpgradePoints--;
}

function robotAutoUpgrade(): void {
	const stats = [
		"strength",
		"precision",
		"crit",
		"speed",
		"defense",
		"healing",
	];
	while (robotUpgradePoints > 0) {
		const stat = stats[Math.floor(Math.random() * stats.length)];
		upgradeRobotStat(stat);
		console.log(
			`Robot upgraded ${stat} to ${eval(
				"robot" + stat.charAt(0).toUpperCase() + stat.slice(1)
			)}`
		);
	}
}

// ===== Action Helpers & Game Logic =====

type Action =
	| "attack-rock"
	| "attack-paper"
	| "attack-scissors"
	| "skip"
	| "heal";

function getRobotAction(): Action {
	const actions: Action[] = [
		"attack-rock",
		"attack-paper",
		"attack-scissors",
		"skip",
		"heal",
	];
	return actions[Math.floor(Math.random() * actions.length)];
}

function rpsWinner(
	playerMove: string,
	robotMove: string
): "player" | "robot" | "tie" {
	if (playerMove === robotMove) return "tie";
	if (
		(playerMove === "rock" && robotMove === "scissors") ||
		(playerMove === "scissors" && robotMove === "paper") ||
		(playerMove === "paper" && robotMove === "rock")
	) {
		return "player";
	}
	return "robot";
}

function processRound(playerAction: Action): void {
	console.clear();
	const robotAction = getRobotAction();
	console.log(
		`Player Action: ${playerAction} | Robot Action: ${robotAction}`
	);
	disableButtons(true);
	// Start with default images and toss animation
	playerHand.src = "/v1rock.svg";
	robotHand.src = "/v1rock.svg";
	playerHand.classList.add("toss");
	robotHand.classList.add("toss");

	let roundOutcome: "player" | "robot" | "tie" = "tie";
	let damage = 0,
		healAmount = 0;

	setTimeout(() => {
		playerHand.classList.remove("toss");
		robotHand.classList.remove("toss");

		// Process branches based on actions
		if (
			playerAction.startsWith("attack") &&
			robotAction.startsWith("attack")
		) {
			const playerMove = playerAction.split("-")[1];
			const robotMove = robotAction.split("-")[1];
			playerHand.src = `/v1${playerMove}.svg`;
			robotHand.src = `/v1${robotMove}.svg`;

			const outcome = rpsWinner(playerMove, robotMove);
			if (outcome === "tie") {
				console.log("Both attacked and it's a tie! No damage dealt.");
				roundOutcome = "tie";
				showOutcomeDirect(robotOutcomeDisplay, "tie", "skip");
				showOutcomeDirect(playerOutcomeDisplay, "tie", "skip");
			} else if (outcome === "player") {
				console.log("Player wins the attack!");
				const result = calculateDamage(
					playerStrength,
					playerPrecision,
					playerCrit,
					robotSpeed,
					robotDefense,
					playerFatigue,
					playerMomentum
				);
				damage = result.damage;
				console.log("Damage dealt to robot:", damage);
				robotHPLoss += damage;
				robotHealth = Math.max(BASE_HEALTH - robotHPLoss, 0);
				roundOutcome = "player";
				if (result.outcome === "crit")
					showOutcomeDirect(
						robotOutcomeDisplay,
						`crit -${damage} damage`,
						"crit"
					);
				else if (result.outcome === "miss")
					showOutcomeDirect(robotOutcomeDisplay, "miss", "miss");
				else
					showOutcomeDirect(
						robotOutcomeDisplay,
						`-${damage} damage`,
						"damage"
					);
			} else {
				console.log("Robot wins the attack!");
				const result = calculateDamage(
					robotStrength,
					robotPrecision,
					robotCrit,
					playerSpeed,
					playerDefense,
					robotFatigue,
					robotMomentum
				);
				damage = result.damage;
				console.log("Damage dealt to player:", damage);
				playerHPLoss += damage;
				playerHealth = Math.max(BASE_HEALTH - playerHPLoss, 0);
				roundOutcome = "robot";
				if (result.outcome === "crit")
					showOutcomeDirect(
						playerOutcomeDisplay,
						`crit -${damage} damage`,
						"crit"
					);
				else if (result.outcome === "miss")
					showOutcomeDirect(playerOutcomeDisplay, "miss", "miss");
				else
					showOutcomeDirect(
						playerOutcomeDisplay,
						`-${damage} damage`,
						"damage"
					);
			}
		} else if (
			playerAction.startsWith("attack") &&
			robotAction === "skip"
		) {
			const playerMove = playerAction.split("-")[1];
			playerHand.src = `/v1${playerMove}.svg`;
			robotHand.src = "/skip.png";
			console.log("Robot skipped!");
			robotFatigue = Math.max(robotFatigue - 10, 0);
			robotMomentum = Math.max(robotMomentum - 5, 0);
			const result = calculateDamage(
				playerStrength,
				playerPrecision,
				playerCrit,
				robotSpeed,
				robotDefense,
				playerFatigue,
				playerMomentum
			);
			damage = result.damage;
			console.log("Damage dealt to robot:", damage);
			robotHPLoss += damage;
			robotHealth = Math.max(BASE_HEALTH - robotHPLoss, 0);
			roundOutcome = "player";
			let outcomeMsg = "skipped, ";
			if (result.outcome === "crit")
				outcomeMsg += `crit -${damage} damage`;
			else if (result.outcome === "miss") outcomeMsg += "miss";
			else outcomeMsg += `-${damage} damage`;
			showOutcomeDirect(robotOutcomeDisplay, outcomeMsg, "skip");
		} else if (
			playerAction.startsWith("attack") &&
			robotAction === "heal"
		) {
			const playerMove = playerAction.split("-")[1];
			playerHand.src = `/v1${playerMove}.svg`;
			robotHand.src = "/heal.webp";
			console.log("Robot heals!");
			healAmount = calculateHeal(HEAL_BASE, robotHealing);
			robotHPLoss = Math.max(robotHPLoss - healAmount, 0);
			robotHealth = Math.min(robotHealth + healAmount, BASE_HEALTH);
			console.log(`Robot healed for ${healAmount} HP.`);
			const result = calculateDamage(
				playerStrength,
				playerPrecision,
				playerCrit,
				robotSpeed,
				robotDefense,
				playerFatigue,
				playerMomentum
			);
			damage = result.damage;
			console.log("Damage dealt to robot:", damage);
			robotHPLoss += damage;
			robotHealth = Math.max(BASE_HEALTH - robotHPLoss, 0);
			roundOutcome = "player";
			showOutcomeDirect(
				robotOutcomeDisplay,
				`+${healAmount} heal, ` +
					(result.outcome === "crit"
						? `crit -${damage} damage`
						: result.outcome === "miss"
						? "miss"
						: `-${damage} damage`),
				result.outcome === "crit" ? "crit" : "damage"
			);
		} else if (
			playerAction === "skip" &&
			robotAction.startsWith("attack")
		) {
			playerHand.src = "/skip.png";
			const robotMove = robotAction.split("-")[1];
			robotHand.src = `/v1${robotMove}.svg`;
			console.log("Player skipped!");
			playerFatigue = Math.max(playerFatigue - 10, 0);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			const result = calculateDamage(
				robotStrength,
				robotPrecision,
				robotCrit,
				playerSpeed,
				playerDefense,
				robotFatigue,
				robotMomentum
			);
			damage = result.damage;
			console.log("Damage dealt to player:", damage);
			playerHPLoss += damage;
			playerHealth = Math.max(BASE_HEALTH - playerHPLoss, 0);
			roundOutcome = "robot";
			let outcomeMsg = "skipped, ";
			if (result.outcome === "crit")
				outcomeMsg += `crit -${damage} damage`;
			else if (result.outcome === "miss") outcomeMsg += "miss";
			else outcomeMsg += `-${damage} damage`;
			showOutcomeDirect(playerOutcomeDisplay, outcomeMsg, "skip");
		} else if (
			playerAction === "heal" &&
			robotAction.startsWith("attack")
		) {
			playerHand.src = "/heal.webp";
			const robotMove = robotAction.split("-")[1];
			robotHand.src = `/v1${robotMove}.svg`;
			console.log("Player heals!");
			healAmount = calculateHeal(HEAL_BASE, playerHealing);
			playerHPLoss = Math.max(playerHPLoss - healAmount, 0);
			playerHealth = Math.min(playerHealth + healAmount, BASE_HEALTH);
			console.log(`Player healed for ${healAmount} HP.`);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			playerFatigue += 5;
			const result = calculateDamage(
				robotStrength,
				robotPrecision,
				robotCrit,
				playerSpeed,
				playerDefense,
				robotFatigue,
				robotMomentum
			);
			damage = result.damage;
			console.log("Damage dealt to player:", damage);
			playerHPLoss += damage;
			playerHealth = Math.max(BASE_HEALTH - playerHPLoss, 0);
			roundOutcome = "robot";
			showOutcomeDirect(
				playerOutcomeDisplay,
				`+${healAmount} heal, ` +
					(result.outcome === "crit"
						? `crit -${damage} damage`
						: result.outcome === "miss"
						? "miss"
						: `-${damage} damage`),
				result.outcome === "crit" ? "crit" : "damage"
			);
		} else if (playerAction === "skip" && robotAction === "skip") {
			console.log(
				"Both skipped. Both recover fatigue and lose momentum."
			);
			playerFatigue = Math.max(playerFatigue - 10, 0);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			robotFatigue = Math.max(robotFatigue - 10, 0);
			robotMomentum = Math.max(robotMomentum - 5, 0);
			roundOutcome = "tie";
			showOutcomeDirect(playerOutcomeDisplay, "skipped", "skip");
			showOutcomeDirect(robotOutcomeDisplay, "skipped", "skip");
		} else if (playerAction === "heal" && robotAction === "heal") {
			console.log("Both heal.");
			const healAmountPlayer = calculateHeal(HEAL_BASE, playerHealing);
			playerHealth = Math.min(
				playerHealth + healAmountPlayer,
				BASE_HEALTH
			);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			playerFatigue += 5;
			const healAmountRobot = calculateHeal(HEAL_BASE, robotHealing);
			robotHealth = Math.min(robotHealth + healAmountRobot, BASE_HEALTH);
			robotMomentum = Math.max(robotMomentum - 5, 0);
			robotFatigue += 5;
			console.log(
				`Player healed for ${healAmountPlayer} HP, Robot healed for ${healAmountRobot} HP.`
			);
			roundOutcome = "tie";
			showOutcomeDirect(
				playerOutcomeDisplay,
				`+${healAmountPlayer} heal`,
				"heal"
			);
			showOutcomeDirect(
				robotOutcomeDisplay,
				`+${healAmountRobot} heal`,
				"heal"
			);
		} else if (
			(playerAction === "skip" && robotAction === "heal") ||
			(playerAction === "heal" && robotAction === "skip")
		) {
			console.log(
				"One skipped and one healed. Both actions resolve separately."
			);
			if (playerAction === "skip") {
				playerFatigue = Math.max(playerFatigue - 10, 0);
				playerMomentum = Math.max(playerMomentum - 5, 0);
				const healAmountRobot = calculateHeal(HEAL_BASE, robotHealing);
				robotHealth = Math.min(
					robotHealth + healAmountRobot,
					BASE_HEALTH
				);
				robotMomentum = Math.max(robotMomentum - 5, 0);
				robotFatigue += 5;
				console.log(
					`Player skipped; Robot healed for ${healAmountRobot} HP.`
				);
				roundOutcome = "tie";
				showOutcomeDirect(
					robotOutcomeDisplay,
					`+${healAmountRobot} heal`,
					"heal"
				);
				showOutcomeDirect(playerOutcomeDisplay, "skipped", "skip");
			} else {
				robotFatigue = Math.max(robotFatigue - 10, 0);
				robotMomentum = Math.max(robotMomentum - 5, 0);
				const healAmountPlayer = calculateHeal(
					HEAL_BASE,
					playerHealing
				);
				playerHealth = Math.min(
					playerHealth + healAmountPlayer,
					BASE_HEALTH
				);
				playerMomentum = Math.max(playerMomentum - 5, 0);
				playerFatigue += 5;
				console.log(
					`Robot skipped; Player healed for ${healAmountPlayer} HP.`
				);
				roundOutcome = "tie";
				showOutcomeDirect(
					playerOutcomeDisplay,
					`+${healAmountPlayer} heal`,
					"heal"
				);
				showOutcomeDirect(robotOutcomeDisplay, "skipped", "skip");
			}
		}

		// Award upgrade points and auto-upgrade robot
		playerUpgradePoints++;
		robotUpgradePoints++;
		robotAutoUpgrade();

		updateStatsAfterRound(roundOutcome);
		checkWin();
		roundNum++;
		updateRound();

		// Re-enable buttons only after outcome display duration
		setTimeout(() => {
			disableButtons(false);
		}, OUTCOME_DISPLAY_DURATION);
	}, ROUND_DELAY);
}

// ===== Event Listeners =====
rockButton.addEventListener("click", () => processRound("attack-rock"));
paperButton.addEventListener("click", () => processRound("attack-paper"));
scissorsButton.addEventListener("click", () => processRound("attack-scissors"));
skipButton.addEventListener("click", () => processRound("skip"));
healButton.addEventListener("click", () => processRound("heal"));

upgradeStrengthButton.addEventListener("click", () =>
	upgradePlayerStat("strength")
);
upgradePrecisionButton.addEventListener("click", () =>
	upgradePlayerStat("precision")
);
upgradeCritButton.addEventListener("click", () => upgradePlayerStat("crit"));
upgradeSpeedButton.addEventListener("click", () => upgradePlayerStat("speed"));
upgradeDefenseButton.addEventListener("click", () =>
	upgradePlayerStat("defense")
);
upgradeHealingButton.addEventListener("click", () =>
	upgradePlayerStat("healing")
);

updateRound();
