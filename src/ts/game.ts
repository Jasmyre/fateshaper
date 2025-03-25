import { classes } from "./classes";
import {
	playerHand,
	robotHand,
	robotOutcomeDisplay,
	playerOutcomeDisplay,
	rockButton,
	paperButton,
	scissorsButton,
	skipButton,
	healButton,
	upgradeStrengthButton,
	upgradePrecisionButton,
	upgradeCritButton,
	upgradeSpeedButton,
	upgradeDefenseButton,
	upgradeHealingButton,
	buttons,
	roundDisplay,
	playerHPNumberDisplay,
	playerHPDisplay,
	playerMomentumNumberDisplay,
	playerMomentumDisplay,
	playerFatigueNumberDisplay,
	playerFatigueDisplay,
	robotHPNumberDisplay,
	robotHPDisplay,
	robotMomentumNumberDisplay,
	robotMomentumDisplay,
	robotFatigueNumberDisplay,
	robotFatigueDisplay,
	playerUpgradePointsDisplay,
	robotUpgradePointsDisplay,
	playerUpgradeStrengthDisplay,
	playerUpgradePrecisionDisplay,
	playerUpgradeCritDisplay,
	playerUpgradeSpeedDisplay,
	playerUpgradeDefenseDisplay,
	playerUpgradeHealingDisplay,
	robotUpgradeStrengthDisplay,
	robotUpgradePrecisionDisplay,
	robotUpgradeCritDisplay,
	robotUpgradeSpeedDisplay,
	robotUpgradeDefenseDisplay,
	robotUpgradeHealingDisplay,
	player2Name,
	player1Name,
} from "./elements";
import { backgroundMusicVolume, playSoundForOutcome } from "./sound";

const backgroundMusic = document.getElementById("bg-music") as HTMLAudioElement;

window.addEventListener("load", () => {
	const audioContext = new AudioContext();
	if (audioContext.state === "suspended") {
		audioContext.resume().then(() => {
			backgroundMusic.play().catch((error) => {
				console.error("Error playing background music:", error);
			});
			backgroundMusic.volume = backgroundMusicVolume;
		});
	} else {
		backgroundMusic.play().catch((error) => {
			console.error("Error playing background music:", error);
		});
	}
});

const ROUND_DELAY = 1400;
const OUTCOME_DISPLAY_DURATION = 3000;

const FATIGUE_DAMAGE_FACTOR = 1;

const BASE_HEALTH = 100;
const DAMAGE_VARIATION_MIN = 0.8;
const DAMAGE_VARIATION_MAX = 1.2;
const CRIT_MULTIPLIER = 1.5;
const SPEED_REDUCTION_PER_POINT = 0.05;
const DEFENSE_REDUCTION_PER_POINT = 0.03;

const FATIGUE_INCREASE = 3;
const TIE_FATIGUE_INCREASE = 1;
const FATIGUE_INCREASE_ON_HEAL = 5;
const MOMENTUM_INCREASE = 10;

const HEAL_BASE = 2;
const HEAL_MULTIPLIER = 1.5;

const MAX_UPGRADE = 10;

const BASE_STRENGTH = 5;
const BASE_PRECISION = 1;
const BASE_CRIT = 1;
const BASE_SPEED = 1;
const BASE_DEFENSE = 1;
const BASE_HEALING = 2;

const urlClass = new URLSearchParams(window.location.search).get("class") as
	| "Warrior"
	| "Mage"
	| "Rogue"
	| "Guardian"
	| "Assassin";
const playerClass = urlClass ?? "Assassin";
const classNames = Object.keys(classes);
const robotClass = classNames[Math.floor(Math.random() * classNames.length)];

const playerMaxHealth = BASE_HEALTH * classes[playerClass].health;
const robotMaxHealth = BASE_HEALTH * classes[robotClass].health;

const playerBaseStrength = BASE_STRENGTH * classes[playerClass].damage;
const robotBaseStrength = BASE_STRENGTH * classes[robotClass].damage;

const playerBaseDefense = BASE_DEFENSE * classes[playerClass].defense;
const robotBaseDefense = BASE_DEFENSE * classes[robotClass].defense;

const playerBaseSpeed = BASE_SPEED * classes[playerClass].speed;
const robotBaseSpeed = BASE_SPEED * classes[robotClass].speed;

const playerBaseHealing = BASE_HEALING * classes[playerClass].healing;
const robotBaseHealing = BASE_HEALING * classes[robotClass].healing;

let roundNum = 1;
let playerHealth = playerMaxHealth,
	robotHealth = robotMaxHealth;
let playerStrength = playerBaseStrength,
	robotStrength = robotBaseStrength;
let playerDefense = playerBaseDefense,
	robotDefense = robotBaseDefense;
let playerSpeed = playerBaseSpeed,
	robotSpeed = robotBaseSpeed;
let playerHealing = playerBaseHealing,
	robotHealing = robotBaseHealing;
let playerPrecision = BASE_PRECISION,
	robotPrecision = BASE_PRECISION;
let playerCrit = BASE_CRIT,
	robotCrit = BASE_CRIT;
let playerFatigue = 0,
	robotFatigue = 0;
let playerMomentum = 0,
	robotMomentum = 0;
let playerUpgradePoints = 0,
	robotUpgradePoints = 0;

// Score tracking variables
let playerTotalDamageDealt = 0;
let playerTotalHealingDone = 0;
let playerRoundsWon = 0;
let playerCriticalHits = 0;

let robotTotalDamageDealt = 0;
let robotTotalHealingDone = 0;
let robotRoundsWon = 0;
let robotCriticalHits = 0;

console.log("Player Class:", playerClass, classes[playerClass]);
console.log("Robot Class:", robotClass, classes[robotClass]);

interface GameData {
	gameId: string;
	startTime: string;
	endTime?: string;
	playerClass: string;
	robotClass: string;
	rounds: RoundData[];
	finalScores?: {
		playerScore: number;
		robotScore: number;
	};
	outcome?: "player" | "robot";
}

interface RoundData {
	roundNumber: number;
	playerAction: Action;
	robotAction: Action;
	playerStatsBefore: PlayerStats;
	robotStatsBefore: PlayerStats;
	damageDealt: {
		player: number;
		robot: number;
	};
	healingDone: {
		player: number;
		robot: number;
	};
	roundOutcome: "player" | "robot" | "tie";
	upgrades: {
		player: Upgrade[];
		robot: Upgrade[];
	};
}

interface PlayerStats {
	health: number;
	strength: number;
	precision: number;
	crit: number;
	speed: number;
	defense: number;
	healingStat: number;
	fatigue: number;
	momentum: number;
	upgradePoints: number;
}

interface Upgrade {
	stat: string;
	newValue: number;
}

// Add these helper functions for game history management
function saveGameHistory(game: GameData): void {
	const history = loadGameHistory();
	history.push(game);
	localStorage.setItem("gameHistory", JSON.stringify(history));
}

function loadGameHistory(): GameData[] {
	const history = localStorage.getItem("gameHistory");
	return history ? JSON.parse(history) : [];
}

// Initialize current game at the start of the script
let currentGame: GameData = {
	gameId: Date.now().toString(),
	startTime: new Date().toISOString(),
	playerClass: playerClass,
	robotClass: robotClass,
	rounds: [],
};


function calculateFinalScores(): { playerScore: number; robotScore: number } {
	// Player Score
	const playerDamageScore =
		playerTotalDamageDealt * (1 + playerCriticalHits * 0.1);
	const playerHealingScore =
		playerTotalHealingDone *
		(playerHealth <= playerMaxHealth / 2 ? 1.2 : 1);
	const playerRoundWinScore = playerRoundsWon * 100 + playerCriticalHits * 50;
	const playerEfficiencyScore = (playerMomentum - playerFatigue) * 10;
	const playerSurvivalBonus = (playerHealth / playerMaxHealth) * 500;

	const playerScore = Math.round(
		playerDamageScore +
			playerHealingScore +
			playerRoundWinScore +
			playerEfficiencyScore +
			playerSurvivalBonus
	);

	// Robot Score
	const robotDamageScore =
		robotTotalDamageDealt * (1 + robotCriticalHits * 0.1);
	const robotHealingScore =
		robotTotalHealingDone * (robotHealth <= robotMaxHealth / 2 ? 1.2 : 1);
	const robotRoundWinScore = robotRoundsWon * 100 + robotCriticalHits * 50;
	const robotEfficiencyScore = (robotMomentum - robotFatigue) * 10;
	const robotSurvivalBonus = (robotHealth / robotMaxHealth) * 500;

	const robotScore = Math.round(
		robotDamageScore +
			robotHealingScore +
			robotRoundWinScore +
			robotEfficiencyScore +
			robotSurvivalBonus
	);

	return { playerScore, robotScore };
}

function logDamageCalculation(
	effectiveStrength: number,
	baseDamage: number,
	critMultiplier: number,
	speedReduction: number,
	defenseReductionFactor: number,
	damageAfterReduction: number,
	fatigueDamageMultiplier: number,
	finalDamage: number
): void {
	console.log("=== Damage Calculation Breakdown ===");
	console.log(
		"Step 1: Effective Strength (ES) = Attacker Strength × (1 + Attacker Momentum/100) × (1 - Attacker Fatigue/100)"
	);
	console.log(`  ES = ${effectiveStrength.toFixed(2)}`);
	console.log("Step 2: Base Damage (BD) = ES × Variation Factor");
	console.log(
		`  BD = ${baseDamage}  [Variation Factor used between ${DAMAGE_VARIATION_MIN} and ${DAMAGE_VARIATION_MAX}]`
	);
	console.log("Step 3: Crit Multiplier (CM) = " + critMultiplier);
	console.log(
		"Step 4: Speed Reduction = Defender Speed × " +
			SPEED_REDUCTION_PER_POINT.toFixed(2)
	);
	console.log(`  Speed Reduction = ${speedReduction.toFixed(2)}`);
	console.log("Step 5: Damage after Speed = BD × CM × (1 - Speed Reduction)");
	console.log(
		`  Damage after Speed = ${(
			baseDamage *
			critMultiplier *
			(1 - speedReduction)
		).toFixed(2)}`
	);
	console.log(
		"Step 6: Effective Defense (ED) = Defender Defense × (1 - Defender Fatigue/100)"
	);
	console.log(
		"Step 7: Defense Reduction Factor (DRF) = 1 - (ED × " +
			DEFENSE_REDUCTION_PER_POINT.toFixed(2) +
			")"
	);
	console.log(`  DRF = ${defenseReductionFactor.toFixed(2)}`);
	console.log("Step 8: Damage after Reduction = Damage after Speed × DRF");
	console.log(
		`  Damage after Reduction = ${damageAfterReduction.toFixed(2)}`
	);
	console.log(
		"Step 9: Fatigue Damage Multiplier (FDM) = 1 + (Defender Fatigue/100 × FATIGUE_DAMAGE_FACTOR)"
	);
	console.log(`  FDM = ${fatigueDamageMultiplier.toFixed(2)}`);
	console.log("Step 10: Final Damage = Floor(Damage after Reduction × FDM)");
	console.log(`  Final Damage = ${finalDamage}`);
	console.log("=====================================");
}

function calculateDamage(
	attackerStrength: number,
	attackerPrecision: number,
	attackerCrit: number,
	defenderSpeed: number,
	defenderDefense: number,
	attackerFatigue: number,
	attackerMomentum: number,
	defenderFatigue: number,
	attacker: "player" | "robot"
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

	const variation = 1;
	let baseDamage = Math.floor(effectiveStrength * variation);

	const critRoll = Math.random();
	let critMultiplier = 1;
	let outcomeText = "";
	if (critRoll < effectiveCrit / 10) {
		critMultiplier = CRIT_MULTIPLIER;
		outcomeText = "crit";
		if (attacker === "player") {
			playerCriticalHits++;
		} else {
			robotCriticalHits++;
		}
		console.log(
			`Critical hit! Crit roll: ${critRoll.toFixed(2)} vs threshold: ${(
				effectiveCrit / 10
			).toFixed(2)} (Effective Crit: ${effectiveCrit.toFixed(2)})`
		);
	}
	if (!outcomeText) outcomeText = "normal";

	const speedReduction = defenderSpeed * SPEED_REDUCTION_PER_POINT;
	const damageAfterSpeed = baseDamage * critMultiplier * (1 - speedReduction);

	const effectiveDefense = defenderDefense * (1 - defenderFatigue / 100);
	const defenseReductionFactor =
		1 - effectiveDefense * DEFENSE_REDUCTION_PER_POINT;

	const damageAfterReduction = damageAfterSpeed * defenseReductionFactor;

	const fatigueDamageMultiplier =
		1 + (defenderFatigue / 100) * FATIGUE_DAMAGE_FACTOR;
	const finalDamage = Math.max(
		Math.floor(damageAfterReduction * fatigueDamageMultiplier),
		0
	);

	// Update damage dealt
	if (attacker === "player") {
		playerTotalDamageDealt += finalDamage;
	} else {
		robotTotalDamageDealt += finalDamage;
	}

	logDamageCalculation(
		effectiveStrength,
		baseDamage,
		critMultiplier,
		speedReduction,
		defenseReductionFactor,
		damageAfterReduction,
		fatigueDamageMultiplier,
		finalDamage
	);

	return { damage: finalDamage, outcome: outcomeText };
}

function calculateHeal(
	base: number,
	healingStat: number,
	healer: "player" | "robot"
): number {
	const healAmount = Math.round(base + healingStat * HEAL_MULTIPLIER);
	if (healer === "player") {
		playerTotalHealingDone += healAmount;
	} else {
		robotTotalHealingDone += healAmount;
	}
	return healAmount;
}

function upgradePlayerStat(stat: string): void {
	if (playerUpgradePoints <= 0) {
		alert("No upgrade points available");
		return;
	}

	let newValue: number;
	switch (stat) {
		case "strength":
			if (playerStrength - playerBaseStrength >= MAX_UPGRADE) {
				alert("Player strength is max");
				return;
			}
			newValue = ++playerStrength;
			// playerStrength++;
			break;
		case "precision":
			if (playerPrecision - BASE_PRECISION >= MAX_UPGRADE) {
				alert("Player precision is max");
				return;
			}
			newValue = ++playerPrecision;
			// playerPrecision++;
			break;
		case "crit":
			if (playerCrit - BASE_CRIT >= MAX_UPGRADE) {
				alert("Player crit is max");
				return;
			}
			newValue = ++playerCrit;
			// playerCrit++;
			break;
		case "speed":
			if (playerSpeed - playerBaseSpeed >= MAX_UPGRADE) {
				alert("Player speed is max");
				return;
			}
			newValue = ++playerSpeed;
			// playerSpeed++;
			break;
		case "defense":
			if (playerDefense - playerBaseDefense >= MAX_UPGRADE) {
				alert("Player defense is max");
				return;
			}
			newValue = ++playerDefense;
			// playerDefense++;
			break;
		case "healing":
			if (playerHealing - playerBaseHealing >= MAX_UPGRADE) {
				alert("Player healing is max");
				return;
			}
			newValue = ++playerHealing;
			// playerHealing++;
			break;
		default:
			console.log("Unknown stat");
			return;
	}
	playerUpgradePoints--;

	if (currentGame.rounds.length > 0) {
		const currentRound = currentGame.rounds[currentGame.rounds.length - 1];
		currentRound.upgrades.player.push({
			stat,
			newValue,
		});
	}

	updateRound();
}

function upgradeRobotStat(stat: string): void {
	switch (stat) {
		case "strength":
			if (robotStrength - robotBaseStrength >= MAX_UPGRADE) return;
			robotStrength++;
			break;
		case "precision":
			if (robotPrecision - BASE_PRECISION >= MAX_UPGRADE) return;
			robotPrecision++;
			break;
		case "crit":
			if (robotCrit - BASE_CRIT >= MAX_UPGRADE) return;
			robotCrit++;
			break;
		case "speed":
			if (robotSpeed - robotBaseSpeed >= MAX_UPGRADE) return;
			robotSpeed++;
			break;
		case "defense":
			if (robotDefense - robotBaseDefense >= MAX_UPGRADE) return;
			robotDefense++;
			break;
		case "healing":
			if (robotHealing - robotBaseHealing >= MAX_UPGRADE) return;
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
		const availableStats = stats.filter((stat) => {
			const currentValue = eval(
				"robot" + stat.charAt(0).toUpperCase() + stat.slice(1)
			);
			let baseValue: number;
			if (stat === "strength") baseValue = robotBaseStrength;
			else if (stat === "defense") baseValue = robotBaseDefense;
			else if (stat === "speed") baseValue = robotBaseSpeed;
			else if (stat === "healing") baseValue = robotBaseHealing;
			else baseValue = stat === "precision" ? BASE_PRECISION : BASE_CRIT;
			return currentValue - baseValue < MAX_UPGRADE;
		});

		if (availableStats.length === 0) {
			robotUpgradePoints = 0;
			break;
		}
		const stat =
			availableStats[Math.floor(Math.random() * availableStats.length)];
		upgradeRobotStat(stat);
		console.log(
			`Robot upgraded ${stat} to ${eval(
				"robot" + stat.charAt(0).toUpperCase() + stat.slice(1)
			)}`
		);

		if (currentGame.rounds.length > 0) {
			const currentRound =
				currentGame.rounds[currentGame.rounds.length - 1];
			currentRound.upgrades.robot.push({
				stat,
				newValue: eval(
					"robot" + stat.charAt(0).toUpperCase() + stat.slice(1)
				),
			});
		}
	}
}

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
	
	console.log(currentGame)
	
	const playerStatsBefore: PlayerStats = {
		health: playerHealth,
		strength: playerStrength,
		precision: playerPrecision,
		crit: playerCrit,
		speed: playerSpeed,
		defense: playerDefense,
		healingStat: playerHealing,
		fatigue: playerFatigue,
		momentum: playerMomentum,
		upgradePoints: playerUpgradePoints,
	};

	const robotStatsBefore: PlayerStats = {
		health: robotHealth,
		strength: robotStrength,
		precision: robotPrecision,
		crit: robotCrit,
		speed: robotSpeed,
		defense: robotDefense,
		healingStat: robotHealing,
		fatigue: robotFatigue,
		momentum: robotMomentum,
		upgradePoints: robotUpgradePoints,
	};

	// Track previous totals for delta calculation
	const prevPlayerDamage = playerTotalDamageDealt;
	const prevPlayerHealing = playerTotalHealingDone;
	const prevRobotDamage = robotTotalDamageDealt;
	const prevRobotHealing = robotTotalHealingDone;

	disableButtons(true);
	playerHand.src = "/v1rock.svg";
	robotHand.src = "/v1rock.svg";
	playerHand.classList.add("toss");
	robotHand.classList.add("toss");

	let roundOutcome: "player" | "robot" | "tie" = "tie";
	let damage = 0,
		healAmount = 0;
	const roundUpgrades = {
		player: [] as Upgrade[],
		robot: [] as Upgrade[],
	};

	setTimeout(() => {
		playerHand.classList.remove("toss");
		robotHand.classList.remove("toss");

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
				showOutcomeDirect(robotOutcomeDisplay, "tie", "miss");
				showOutcomeDirect(playerOutcomeDisplay, "tie", "miss");
			} else if (outcome === "player") {
				console.log("Player wins the attack!");
				const result = calculateDamage(
					playerStrength,
					playerPrecision,
					playerCrit,
					robotSpeed,
					robotDefense,
					playerFatigue,
					playerMomentum,
					robotFatigue,
					"player"
				);
				damage = result.damage;
				console.log("Damage dealt to robot:", damage);
				robotHealth = Math.max(robotHealth - damage, 0);
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
					robotMomentum,
					playerFatigue,
					"robot"
				);
				damage = result.damage;
				console.log("Damage dealt to player:", damage);
				playerHealth = Math.max(playerHealth - damage, 0);
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
				playerMomentum,
				robotFatigue,
				"player"
			);
			damage = result.damage;
			console.log("Damage dealt to robot:", damage);
			robotHealth = Math.max(robotHealth - damage, 0);
			roundOutcome = "player";
			let outcomeMsg = "skipped, ";
			if (result.outcome === "crit")
				outcomeMsg += `crit -${damage} damage`;
			else if (result.outcome === "miss") outcomeMsg += "miss";
			else outcomeMsg += `-${damage} damage`;
			showOutcomeDirect(
				robotOutcomeDisplay,
				outcomeMsg,
				result.outcome === "crit"
					? "crit"
					: result.outcome === "miss"
					? "miss"
					: "damage"
			);
		} else if (
			playerAction.startsWith("attack") &&
			robotAction === "heal"
		) {
			const playerMove = playerAction.split("-")[1];
			playerHand.src = `/v1${playerMove}.svg`;
			robotHand.src = "/heal.webp";
			console.log("Robot heals!");
			healAmount = calculateHeal(HEAL_BASE, robotHealing, "robot");
			robotHealth = Math.min(robotHealth + healAmount, robotMaxHealth);
			console.log(`Robot healed for ${healAmount} HP.`);
			const result = calculateDamage(
				playerStrength,
				playerPrecision,
				playerCrit,
				robotSpeed,
				robotDefense,
				playerFatigue,
				playerMomentum,
				robotFatigue,
				"player"
			);
			damage = result.damage;
			console.log("Damage dealt to robot:", damage);
			robotHealth = Math.max(robotHealth - damage, 0);
			roundOutcome = "player";
			showOutcomeDirect(
				robotOutcomeDisplay,
				`+${healAmount} heal, ` +
					(result.outcome === "crit"
						? `crit -${damage} damage`
						: result.outcome === "miss"
						? "miss"
						: `-${damage} damage`),
				result.outcome === "crit"
					? "crit"
					: result.outcome === "miss"
					? "heal"
					: "damage"
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
				robotMomentum,
				playerFatigue,
				"robot"
			);
			damage = result.damage;
			console.log("Damage dealt to player:", damage);
			playerHealth = Math.max(playerHealth - damage, 0);
			roundOutcome = "robot";
			let outcomeMsg = "skipped, ";
			if (result.outcome === "crit")
				outcomeMsg += `crit -${damage} damage`;
			else if (result.outcome === "miss") outcomeMsg += "miss";
			else outcomeMsg += `-${damage} damage`;
			showOutcomeDirect(
				playerOutcomeDisplay,
				outcomeMsg,
				result.outcome === "crit"
					? "crit"
					: result.outcome === "miss"
					? "miss"
					: "damage"
			);
		} else if (
			playerAction === "heal" &&
			robotAction.startsWith("attack")
		) {
			playerHand.src = "/heal.webp";
			const robotMove = robotAction.split("-")[1];
			robotHand.src = `/v1${robotMove}.svg`;
			console.log("Player heals!");

			healAmount = calculateHeal(HEAL_BASE, playerHealing, "player");
			playerHealth = Math.min(playerHealth + healAmount, playerMaxHealth);
			console.log(`Player healed for ${healAmount} HP.`);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			playerFatigue += FATIGUE_INCREASE_ON_HEAL;
			const result = calculateDamage(
				robotStrength,
				robotPrecision,
				robotCrit,
				playerSpeed,
				playerDefense,
				robotFatigue,
				robotMomentum,
				playerFatigue,
				"robot"
			);
			damage = result.damage;
			console.log("Damage dealt to player:", damage);
			playerHealth = Math.max(playerHealth - damage, 0);
			roundOutcome = "robot";
			showOutcomeDirect(
				playerOutcomeDisplay,
				`+${healAmount} heal, ` +
					(result.outcome === "crit"
						? `crit -${damage} damage`
						: result.outcome === "miss"
						? "miss"
						: `-${damage} damage`),
				result.outcome === "crit"
					? "crit"
					: result.outcome === "miss"
					? "heal"
					: "damage"
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
			const healAmountPlayer = calculateHeal(
				HEAL_BASE,
				playerHealing,
				"player"
			);
			playerHealth = Math.min(
				playerHealth + healAmountPlayer,
				playerMaxHealth
			);
			playerMomentum = Math.max(playerMomentum - 5, 0);
			playerFatigue += FATIGUE_INCREASE_ON_HEAL;
			const healAmountRobot = calculateHeal(
				HEAL_BASE,
				robotHealing,
				"robot"
			);
			robotHealth = Math.min(
				robotHealth + healAmountRobot,
				robotMaxHealth
			);
			robotMomentum = Math.max(robotMomentum - 5, 0);
			robotFatigue += FATIGUE_INCREASE_ON_HEAL;
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
				const healAmountRobot = calculateHeal(
					HEAL_BASE,
					robotHealing,
					"robot"
				);
				robotHealth = Math.min(
					robotHealth + healAmountRobot,
					robotMaxHealth
				);
				robotMomentum = Math.max(robotMomentum - 5, 0);
				robotFatigue += FATIGUE_INCREASE_ON_HEAL;
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
					playerHealing,
					"player"
				);
				playerHealth = Math.min(
					playerHealth + healAmountPlayer,
					playerMaxHealth
				);
				playerMomentum = Math.max(playerMomentum - 5, 0);
				playerFatigue += FATIGUE_INCREASE_ON_HEAL;
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

		// Update rounds won
		if (roundOutcome === "player") {
			playerRoundsWon++;
		} else if (roundOutcome === "robot") {
			robotRoundsWon++;
		}

		playerUpgradePoints++;
		robotUpgradePoints++;
		robotAutoUpgrade();
		updateStatsAfterRound(roundOutcome);
		checkWin();
		roundNum++;
		updateRound();

		const roundData: RoundData = {
			roundNumber: roundNum,
			playerAction,
			robotAction,
			playerStatsBefore,
			robotStatsBefore,
			damageDealt: {
				player: playerTotalDamageDealt - prevPlayerDamage,
				robot: robotTotalDamageDealt - prevRobotDamage,
			},
			healingDone: {
				player: playerTotalHealingDone - prevPlayerHealing,
				robot: robotTotalHealingDone - prevRobotHealing,
			},
			roundOutcome,
			upgrades: roundUpgrades,
		};

		currentGame.rounds.push(roundData);


		setTimeout(() => {
			disableButtons(false);
		}, OUTCOME_DISPLAY_DURATION);
	}, ROUND_DELAY);
}

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

function showOutcomeDirect(
	container: HTMLElement,
	text: string,
	outcomeType: string
): void {
	container.textContent = text;
	container.className = "";
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
	playSoundForOutcome(outcomeType);
	setTimeout(() => {
		container.textContent = "";
		container.className = "hidden";
	}, OUTCOME_DISPLAY_DURATION);
}

function checkWin(): void {
	if (robotHealth <= 0 || playerHealth <= 0) {
		const { playerScore, robotScore } = calculateFinalScores();
		currentGame.endTime = new Date().toISOString();
		currentGame.finalScores = { playerScore, robotScore };
		currentGame.outcome = playerHealth > 0 ? "player" : "robot";

		saveGameHistory(currentGame);

		window.location.href = `/winning.html?playerWon=${
			playerHealth > 0
		}&playerScore=${playerScore}&robotScore=${robotScore}`;
	}
}

function disableButtons(disable: boolean): void {
	buttons.forEach((button) => (button.disabled = disable));
}

function logStats(): void {
	console.log("Player Stats:", {
		Health: playerHealth,
		Strength: playerStrength,
		Precision: playerPrecision,
		Crit: playerCrit,
		Speed: playerSpeed,
		Defense: playerDefense,
		Healing: playerHealing,
		Fatigue: playerFatigue,
		Momentum: playerMomentum,
		Class: playerClass,
	});
	console.log("Robot Stats:", {
		Health: robotHealth,
		Strength: robotStrength,
		Precision: robotPrecision,
		Crit: robotCrit,
		Speed: robotSpeed,
		Defense: robotDefense,
		Healing: robotHealing,
		Fatigue: robotFatigue,
		Momentum: robotMomentum,
		Class: robotClass,
	});
	console.log("Score Stats:", {
		PlayerDamage: playerTotalDamageDealt,
		PlayerHealing: playerTotalHealingDone,
		PlayerRoundsWon: playerRoundsWon,
		PlayerCrits: playerCriticalHits,
		RobotDamage: robotTotalDamageDealt,
		RobotHealing: robotTotalHealingDone,
		RobotRoundsWon: robotRoundsWon,
		RobotCrits: robotCriticalHits,
	});
}

function updateRound(): void {
	player1Name.innerHTML = /*html*/ `
		<div>Player 1</div>
		(${playerClass})
	`;
	player2Name.innerHTML = /*html*/ `
		<div>Player 2</div>
		(${robotClass})
	`;

	roundDisplay.textContent = `ROUND: ${roundNum}`;
	playerHPNumberDisplay.textContent = String(playerHealth.toFixed(0));
	playerHPDisplay.style.width = `${(playerHealth / playerMaxHealth) * 100}%`;
	playerMomentumNumberDisplay.textContent = String(playerMomentum);
	playerMomentumDisplay.style.width = `${playerMomentum}%`;
	playerFatigueNumberDisplay.textContent = String(playerFatigue);
	playerFatigueDisplay.style.width = `${playerFatigue}%`;

	robotHPNumberDisplay.textContent = String(robotHealth.toFixed(0));
	robotHPDisplay.style.width = `${(robotHealth / robotMaxHealth) * 100}%`;
	robotMomentumNumberDisplay.textContent = String(robotMomentum);
	robotMomentumDisplay.style.width = `${robotMomentum}%`;
	robotFatigueNumberDisplay.textContent = String(robotFatigue);
	robotFatigueDisplay.style.width = `${robotFatigue}%`;

	playerUpgradePointsDisplay.textContent = `Player 1 upgrade points: ${playerUpgradePoints}`;
	robotUpgradePointsDisplay.textContent = `Player 2 upgrade points: ${robotUpgradePoints}`;

	playerUpgradeStrengthDisplay.style.width = `${
		(playerStrength - playerBaseStrength) * 10
	}%`;
	playerUpgradePrecisionDisplay.style.width = `${
		(playerPrecision - BASE_PRECISION) * 10
	}%`;
	playerUpgradeCritDisplay.style.width = `${(playerCrit - BASE_CRIT) * 10}%`;
	playerUpgradeSpeedDisplay.style.width = `${
		(playerSpeed - playerBaseSpeed) * 10
	}%`;
	playerUpgradeDefenseDisplay.style.width = `${
		(playerDefense - playerBaseDefense) * 10
	}%`;
	playerUpgradeHealingDisplay.style.width = `${
		(playerHealing - playerBaseHealing) * 10
	}%`;

	robotUpgradeStrengthDisplay.style.width = `${
		(robotStrength - robotBaseStrength) * 10
	}%`;
	robotUpgradePrecisionDisplay.style.width = `${
		(robotPrecision - BASE_PRECISION) * 10
	}%`;
	robotUpgradeCritDisplay.style.width = `${(robotCrit - BASE_CRIT) * 10}%`;
	robotUpgradeSpeedDisplay.style.width = `${
		(robotSpeed - robotBaseSpeed) * 10
	}%`;
	robotUpgradeDefenseDisplay.style.width = `${
		(robotDefense - robotBaseDefense) * 10
	}%`;
	robotUpgradeHealingDisplay.style.width = `${
		(robotHealing - robotBaseHealing) * 10
	}%`;

	logStats();
}

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

// Add this function to display history (to be called from a history page)
// function displayGameHistory(): void {
//   const history = loadGameHistory();
//   const historyContainer = document.getElementById('history-container');
  
//   if (!historyContainer || history.length === 0) return;

//   historyContainer.innerHTML = history.map(game => `
//     <div class="game-history">
//       <h3>Game ${new Date(game.startTime).toLocaleString()}</h3>
//       <p>Player: ${game.playerClass} vs Robot: ${game.robotClass}</p>
//       <p>Outcome: ${game.outcome === 'player' ? 'Player Won' : 'Robot Won'}</p>
//       <p>Score: Player ${game.finalScores?.playerScore} - ${game.finalScores?.robotScore}</p>
//       <div class="rounds">
//         ${game.rounds.map(round => `
//           <div class="round">
//             <h4>Round ${round.roundNumber}</h4>
//             <p>Player: ${round.playerAction} | Robot: ${round.robotAction}</p>
//             <p>Outcome: ${round.roundOutcome}</p>
//             <p>Damage: Player ${round.damageDealt.player} | Robot ${round.damageDealt.robot}</p>
//             <p>Healing: Player ${round.healingDone.player} | Robot ${round.healingDone.robot}</p>
//           </div>
//         `).join('')}
//       </div>
//     </div>
//   `).join('');
// }

// Add this to your winning.html page script to show the last game
// function displayLastGame(): void {
//   const history = loadGameHistory();
//   if (history.length === 0) return;

//   const lastGame = history[history.length - 1];
//   const gameSummary = document.getElementById('game-summary');
  
//   if (gameSummary) {
//     gameSummary.innerHTML = `
//       <h2>Game Summary</h2>
//       <p>Player: ${lastGame.playerClass} vs Robot: ${lastGame.robotClass}</p>
//       <p>Rounds played: ${lastGame.rounds.length}</p>
//       <p>Final score: Player ${lastGame.finalScores?.playerScore} - ${lastGame.finalScores?.robotScore}</p>
//       <p>Outcome: ${lastGame.outcome === 'player' ? 'You Won!' : 'Robot Won'}</p>
//     `;
//   }
// }