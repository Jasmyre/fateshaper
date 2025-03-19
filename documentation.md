
# Advanced Rock-Paper-Scissors Combat Game Documentation

## Overview
This game is an advanced twist on the classic rock-paper-scissors. It ain’t just about picking rock, paper, or scissors – it adds a whole bunch of RPG-style mechanics. You'll manage stats like strength, precision, crit, speed, fatigue, and momentum. These stats affect every attack, making battles more strategic and dynamic.

## Game Lore
_In a not-so-distant future, even the simplest choice can decide life or death._  
In this world, warriors battle using the timeless moves of rock, paper, and scissors. But behind every move lies a complex system of fatigue and momentum. As you win, your momentum builds up and your attacks become more powerful. As the fight goes on, fatigue sets in and your abilities start to decline. Choose wisely when to push your luck or take a breather.

## Gameplay
- **Rounds:** The game is played in rounds. Each round, you choose a move – rock, paper, or scissors – while the robot opponent picks randomly.
- **Outcome:** The classic rules apply: rock beats scissors, scissors beats paper, and paper beats rock. Ties can happen too.
- **Attacks & Damage:** When you win or lose a round, an attack happens. The damage is calculated using your stats along with some randomness.
- **Skip Turn:** You can choose to skip your turn if you feel too fatigued. Skipping lets you recover some fatigue and lose a bit of momentum, but the robot still gets a chance to attack.

## Game Mechanics and Stats
### Core Stats
- **Strength:** Determines the raw power of your attack. Higher strength means you can potentially do more damage.
- **Precision:** Dictates your chance to hit the opponent. With a higher precision, your attack is more likely to land.
- **Crit:** Your chance to score a critical hit. If you crit, your attack does 50% extra damage.
- **Speed:** Helps reduce the damage you take. Each point in speed cuts incoming damage by 5%.
- **Fatigue:** Builds up as you fight. More fatigue means your effective strength, precision, and crit drop – you get tired!
- **Momentum:** Boosts your stats when you win consecutive rounds. It makes you hit harder and more accurately, rewarding your winning streaks.

### Detailed Calculations
The game uses a few formulas to calculate how much damage an attack does. Here’s the breakdown:

1. **Effective Stats Calculation:**  
   These formulas modify your base stats by taking into account fatigue (which hurts your performance) and momentum (which gives you a boost).
   - **Effective Strength:**  
     \[
     \text{Effective Strength} = \text{Strength} \times \left(1 + \frac{\text{Momentum}}{100}\right) \times \left(1 - \frac{\text{Fatigue}}{100}\right)
     \]
   - **Effective Precision:**  
     \[
     \text{Effective Precision} = \text{Precision} \times \left(1 - \frac{\text{Fatigue}}{100}\right) \times \left(1 + \frac{\text{Momentum}}{100}\right)
     \]
   - **Effective Crit:**  
     \[
     \text{Effective Crit} = \text{Crit} \times \left(1 + \frac{\text{Momentum}}{100}\right) \times \left(1 - \frac{\text{Fatigue}}{100}\right)
     \]

2. **Hit Chance:**  
   A random roll is generated (using something like `Math.random()`). If the roll is less than the effective precision divided by 10, your attack lands. Otherwise, it misses.  
   *(For example, if your effective precision is 10, the attack always hits. If it’s lower, you might miss.)*

3. **Base Damage Calculation:**  
   If your attack lands, the base damage is calculated by taking the effective strength and multiplying it by a random factor between 0.8 and 1.2.  
   \[
   \text{Base Damage} = \text{Effective Strength} \times \text{(random variation between 0.8 and 1.2)}
   \]

4. **Critical Hit:**  
   Another random roll checks for a critical hit. If the roll is less than the effective crit divided by 10, your attack is critical and you multiply the base damage by 1.5.

5. **Damage Reduction by Speed:**  
   The defender’s speed reduces the damage. Each point in speed decreases the damage by 5%.  
   \[
   \text{Damage After Reduction} = \text{Base Damage} \times \text{Crit Multiplier} \times \left(1 - \text{Defender Speed} \times 0.05\right)
   \]

6. **Final Damage:**  
   The final damage is the damage after reduction, rounded down to a whole number.

### Logging the Calculations
The game has a detailed logging function that prints out each step of the damage calculation. This helps you (or a developer) understand exactly how an attack’s damage was computed. The logs show:
- Effective strength used in the calculation.
- The base damage (with variation).
- Whether a critical hit occurred (and the crit multiplier).
- The speed reduction applied.
- The final damage value.

## Features
- **Dynamic Combat:** Every attack is calculated using a mix of stats and randomness, making each round unpredictable.
- **Fatigue & Momentum System:**  
  - **Fatigue** builds up as you fight, lowering your effectiveness.  
  - **Momentum** rewards you for winning rounds, boosting your attack power.
- **Skip Turn Option:**  
  If you're feeling too tired (high fatigue), you can skip your turn. This recovers some fatigue and lowers momentum, but it gives the robot a chance to strike.
- **Real-Time Stat Display:**  
  Your health, fatigue, and momentum are displayed with numbers and progress bars, so you can always see your current state.
- **In-Depth Logging:**  
  Every step of the damage calculation is logged in the console, providing a clear picture of the math behind each attack. This is great for debugging and understanding game mechanics.

## Code Structure
- **User Interface (UI):**  
  The HTML and CSS manage the layout, including buttons for moves (rock, paper, scissors, skip) and displays for health, momentum, and fatigue.
- **Game Logic (TypeScript):**  
  All the combat logic is written in TypeScript. Key functions include:
  - `calculateDamage()`: Computes the damage for an attack using the formulas above.
  - `logDamageCalculation()`: Logs a step-by-step breakdown of the damage calculation.
  - `updateStatsAfterRound()`: Adjusts fatigue and momentum based on the round outcome.
  - `playRound()`: Handles a round of combat when the player attacks.
  - `skipTurn()`: Manages the logic when the player chooses to skip a turn.
- **Logging:**  
  Detailed console logs show how effective stats are calculated, why an attack may miss, and the exact math behind the damage dealt.

## Conclusion
This advanced Rock-Paper-Scissors game transforms a simple game into a deep, strategic battle. With its rich stat system (strength, precision, crit, speed, fatigue, momentum) and detailed damage calculations, every round is a tactical challenge. Whether you're managing your momentum on a winning streak or deciding to skip a turn to recover, the game rewards smart choices and careful planning.

Enjoy the battle – and may your momentum carry you to victory!