// Define all upgrades and how they affect the game

const UpgradeDefinitions = [
  {
    id: "better-gloves",
    name: "Lunar Gloves",
    description: "Reinforced gloves let you scoop more dust per tap.",
    baseCost: 15,
    costMultiplier: 1.15,
    type: "click",
    clickBonus: 1
  },
  {
    id: "titanium-shovel",
    name: "Titanium Shovel",
    description: "A serious shovel for serious moon digging.",
    baseCost: 100,
    costMultiplier: 1.18,
    type: "click",
    clickBonus: 5
  },
  {
    id: "nano-drill",
    name: "Nano Drill",
    description: "Microscopic drills burrow into the regolith.",
    baseCost: 750,
    costMultiplier: 1.2,
    type: "click",
    clickBonus: 20
  },
  {
    id: "moon-rover",
    name: "Moon Rover",
    description: "Autonomous rover gathers dust while you plan your empire.",
    baseCost: 50,
    costMultiplier: 1.15,
    type: "idle",
    idleBonus: 1
  },
  {
    id: "drone-swarm",
    name: "Drone Swarm",
    description: "A swarm of drones combs the surface for dust.",
    baseCost: 400,
    costMultiplier: 1.18,
    type: "idle",
    idleBonus: 5
  },
  {
    id: "mining-outpost",
    name: "Mining Outpost",
    description: "A permanent outpost dedicated to lunar extraction.",
    baseCost: 2500,
    costMultiplier: 1.22,
    type: "idle",
    idleBonus: 20
  },
  {
    id: "orbital-refinery",
    name: "Orbital Refinery",
    description: "Processes dust in orbit, boosting all production.",
    baseCost: 10000,
    costMultiplier: 1.3,
    type: "multiplier",
    clickMultiplierBonus: 0.25,
    idleMultiplierBonus: 0.25
  }
];

function initUpgrades() {
  UpgradeDefinitions.forEach(def => {
    GameState.upgrades[def.id] = {
      ...def,
      level: 0,
      currentCost: def.baseCost
    };
  });
}

function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
}

function recalculateProduction() {
  let basePerClick = 1;
  let basePerSecond = 0;
  let clickFlatBonus = 0;
  let idleFlatBonus = 0;
  let clickMultiplier = 1;
  let idleMultiplier = 1;

  Object.values(GameState.upgrades).forEach(upg => {
    if (upg.type === "click") {
      clickFlatBonus += upg.clickBonus * upg.level;
    } else if (upg.type === "idle") {
      idleFlatBonus += upg.idleBonus * upg.level;
    } else if (upg.type === "multiplier") {
      clickMultiplier += (upg.clickMultiplierBonus || 0) * upg.level;
      idleMultiplier += (upg.idleMultiplierBonus || 0) * upg.level;
    }
  });

  GameState.perClick = Math.max(1, Math.floor((basePerClick + clickFlatBonus) * clickMultiplier));
  GameState.perSecond = Math.max(0, (basePerSecond + idleFlatBonus) * idleMultiplier);
}
