# Advanced Rock-Paper-Scissors Combat Game Documentation

## Overview
This game is a next-level spin on the classic rock-paper-scissors. It’s not just about picking rock, paper, or scissors—there’s an entire RPG-style system working behind the scenes. You’ll need to manage stats like strength, precision, crit, speed, fatigue, and momentum, which all affect every move in combat. This makes each battle more strategic, dynamic, and unpredictable.

## Game Lore
_In a world where even the simplest gesture can change the tide of battle..._  
In this universe, champions from different classes (such as Warrior, Mage, Rogue, Guardian, and Assassin) clash using the timeless moves of rock, paper, and scissors. Behind each move is a complex interplay of fatigue and momentum—winning builds momentum and makes your strikes more lethal, while overexertion raises fatigue and diminishes your defenses. Choose your moves carefully to outlast your opponent.

## Gameplay
- **Rounds:**  
  The game is divided into rounds. In each round, you select an action (attack with rock, paper, or scissors, skip your turn, or heal), and your opponent (a robot) picks an action at random.
  
- **Outcomes:**  
  Traditional rock–paper–scissors rules apply: rock beats scissors, scissors beats paper, and paper beats rock. Ties occur when both players choose the same move.
  
- **Attacks & Damage:**  
  When one side wins a round, an attack is triggered. The damage you deal is calculated using your current stats combined with situational modifiers like fatigue and momentum.
  
- **Skip & Heal:**  
  - **Skip:** Sometimes, you may choose to skip your turn. This can be strategic when you’re too fatigued—skipping can help reduce fatigue but may give your opponent a chance to counterattack.  
  - **Heal:** You can opt to heal instead of attacking. Healing recovers some health, but it also increases your fatigue, so it must be used judiciously.

- **Upgrades:**  
  After every round, both you and the robot earn upgrade points. These points let you boost your stats (strength, precision, crit, speed, defense, healing) to improve your combat performance.

## Game Mechanics and Stats
### Core Stats
- **Strength:**  
  Determines the raw power behind your attacks.
  
- **Precision:**  
  Affects your chance to land an attack successfully.
  
- **Crit:**  
  Governs your likelihood of scoring a critical hit, which multiplies your damage.
  
- **Speed:**  
  Helps reduce the damage you take by allowing you to dodge or mitigate attacks.
  
- **Defense:**  
  Reduces the amount of damage you receive.
  
- **Healing:**  
  Determines how much health you regain when you choose to heal.
  
- **Fatigue:**  
  Builds up as you fight. The higher your fatigue, the less effective your stats become, and the more damage you take.
  
- **Momentum:**  
  Grows when you win rounds consecutively, boosting your overall attack performance.

### Detailed Calculations
The damage dealt in combat is determined through a series of mathematical steps that follow the PEMDAS rule (Parentheses, Exponents, Multiplication and Division, Addition and Subtraction). Here’s how it works:

1. **Effective Strength (ES):**  
   Adjusts the attacker’s base strength by factoring in momentum and fatigue.  
   \[
   ES = \text{Strength} \times \left(1 + \frac{\text{Momentum}}{100}\right) \times \left(1 - \frac{\text{Fatigue}}{100}\right)
   \]

2. **Base Damage (BD):**  
   Originally, BD was determined by multiplying ES with a random variation factor between 0.8 and 1.2. In the latest version, this variation has been removed for consistency:
   \[
   BD = ES \times 1
   \]

3. **Critical Hit Check:**  
   A random roll determines whether a critical hit occurs. If it does, the damage is multiplied by a fixed factor (e.g., 1.5).

4. **Speed Reduction:**  
   The defender’s speed reduces incoming damage. Each point in speed cuts the damage by a certain percentage:
   \[
   \text{Speed Reduction} = \text{Defender Speed} \times 0.05
   \]

5. **Damage after Speed:**  
   The damage after applying the speed reduction:
   \[
   \text{Damage after Speed} = BD \times \text{Crit Multiplier} \times (1 - \text{Speed Reduction})
   \]

6. **Effective Defense:**  
   The defender’s defense is reduced based on their fatigue:
   \[
   ED = \text{Defender Defense} \times \left(1 - \frac{\text{Defender Fatigue}}{100}\right)
   \]

7. **Defense Reduction Factor (DRF):**  
   Calculates the percentage of damage that isn’t blocked by the defender’s effective defense:
   \[
   DRF = 1 - (ED \times 0.03)
   \]

8. **Damage after Reduction:**  
   The damage after applying the defense reduction:
   \[
   \text{Damage after Reduction} = \text{Damage after Speed} \times DRF
   \]

9. **Fatigue Damage Multiplier:**  
   The higher the defender’s fatigue, the more damage they take:
   \[
   FDM = 1 + \left(\frac{\text{Defender Fatigue}}{100} \times \text{FATIGUE\_DAMAGE\_FACTOR}\right)
   \]
   For example, if FATIGUE_DAMAGE_FACTOR is 1 and the defender has 20 fatigue, then \( FDM = 1 + 0.20 = 1.2 \).

10. **Final Damage:**  
    The final damage is the damage after reduction multiplied by the fatigue damage multiplier, rounded down:
    \[
    \text{Final Damage} = \text{Floor}(\text{Damage after Reduction} \times FDM)
    \]

### Logging the Calculations
For debugging and understanding the math, the game logs each step:
- It shows the computed Effective Strength.
- It details the calculation of Base Damage.
- It logs whether a critical hit was achieved and the Crit Multiplier used.
- It displays the Speed Reduction and the resulting Damage after Speed.
- It calculates and logs the Effective Defense and the Defense Reduction Factor.
- Finally, it shows the application of the Fatigue Damage Multiplier and the Final Damage dealt.

## Features
- **Dynamic Combat:**  
  Your attacks and defenses are influenced by various stats that change as you battle, making every round unique.
  
- **Stat Management:**  
  Monitor and upgrade your stats (strength, precision, crit, speed, defense, healing) to adapt your strategy.
  
- **Fatigue & Momentum:**  
  - **Fatigue:** As you fight, fatigue increases—reducing your effectiveness and making you more vulnerable.  
  - **Momentum:** Winning consecutive rounds boosts your momentum, increasing your damage potential.
  
- **Tactical Choices:**  
  Decide when to attack, skip a turn to manage fatigue, or heal to recover lost health. Each decision has trade-offs.
  
- **Detailed Logging:**  
  The game provides in-depth logs of the damage calculations, allowing you to see the exact math behind each action.

## Code Structure
- **Constants and Base Values:**  
  All key numbers (delays, base health, multipliers, etc.) are defined as constants at the top, making it easy to balance and tweak the game.
  
- **Class Modifiers:**  
  Different classes (Warrior, Mage, Rogue, Guardian, Assassin) modify the base stats, giving each a unique feel.
  
- **Game Logic Functions:**  
  Functions like `calculateDamage()`, `calculateHeal()`, and `updateStatsAfterRound()` handle the core gameplay mechanics.
  
- **Logging Functions:**  
  Detailed logging functions break down each step of the calculations to help you understand how every number is derived.

## Conclusion
This advanced Rock-Paper-Scissors Combat Game takes a familiar game and transforms it into a deep, strategic experience. With its robust stat system, intricate damage calculations, and a unique fatigue and momentum mechanic, every round challenges you to make smart decisions. Whether you're upgrading your stats, managing your fatigue, or watching the detailed logs of your attack’s math, this game offers a rich, immersive combat experience.

Enjoy the battle, and may your strategy lead you to victory!
