export const classes: {
	[key: string]: {
		health: number;
		damage: number;
		defense: number;
		speed: number;
		healing: number;
	};
} = {
	Warrior: {
		health: 1.3,
		damage: 1.0,
		defense: 1.5,
		speed: 0.8,
		healing: 0.7,
	},
	Mage: { health: 0.8, damage: 1.5, defense: 0.7, speed: 1.0, healing: 1.4 },
	Rogue: { health: 1.0, damage: 1.3, defense: 0.8, speed: 1.6, healing: 0.8 },
	Guardian: {
		health: 1.5,
		damage: 0.8,
		defense: 1.7,
		speed: 0.7,
		healing: 1.0,
	},
	Assassin: {
		health: 0.7,
		damage: 1.6,
		defense: 0.6,
		speed: 1.8,
		healing: 0.7,
	},
};