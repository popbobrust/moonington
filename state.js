// Global game state and helpers

const GameState = {
  moonDust: 0,
  perClick: 1,
  perSecond: 0,
  upgrades: {}, // filled from upgrades.js
  lastTick: performance.now()
};

function formatNumber(value) {
  if (value < 1000) return value.toString();
  const units = ["K", "M", "B", "T", "Q"];
  let unitIndex = -1;
  let num = value;
  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }
  return num.toFixed(2) + units[unitIndex];
}

function addMoonDust(amount) {
  GameState.moonDust += amount;
  if (!Number.isFinite(GameState.moonDust)) {
    GameState.moonDust = 0;
  }
}

function canAfford(cost) {
  return GameState.moonDust >= cost;
}

function spendMoonDust(cost) {
  if (!canAfford(cost)) return false;
  GameState.moonDust -= cost;
  return true;
}
