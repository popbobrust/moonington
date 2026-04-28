// Main game logic and DOM wiring

document.addEventListener("DOMContentLoaded", () => {
  const moonCountEl = document.getElementById("moon-count");
  const perClickEl = document.getElementById("per-click");
  const perSecondEl = document.getElementById("per-second");
  const moonButton = document.getElementById("moon-button");
  const upgradeListEl = document.getElementById("upgrade-list");
  const floatingContainer = document.getElementById("floating-text-container");

  if (!moonCountEl || !perClickEl || !perSecondEl || !moonButton || !upgradeListEl || !floatingContainer) {
    console.error("Moon Clicker: Missing DOM elements.");
    return;
  }

  initUpgrades();
  recalculateProduction();
  renderStats();
  renderUpgrades();

  moonButton.addEventListener("click", event => {
    handleMoonClick(event);
  });

  function handleMoonClick(event) {
    addMoonDust(GameState.perClick);
    renderStats();
    spawnFloatingText("+" + GameState.perClick, event);
  }

  function spawnFloatingText(text, event) {
    const rect = moonButton.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const span = document.createElement("span");
    span.className = "floating-text";
    span.textContent = text;
    span.style.left = rect.left + x - 10 + "px";
    span.style.top = rect.top + y - 10 + "px";

    floatingContainer.appendChild(span);

    span.addEventListener("animationend", () => {
      span.remove();
    });
  }

  function renderStats() {
    moonCountEl.textContent = formatNumber(Math.floor(GameState.moonDust));
    perClickEl.textContent = formatNumber(GameState.perClick);
    perSecondEl.textContent = formatNumber(GameState.perSecond.toFixed ? Number(GameState.perSecond.toFixed(2)) : GameState.perSecond);
  }

  function renderUpgrades() {
    upgradeListEl.innerHTML = "";

    Object.values(GameState.upgrades).forEach(upg => {
      const card = document.createElement("div");
      card.className = "upgrade-card";

      const info = document.createElement("div");
      info.className = "upgrade-info";

      const name = document.createElement("div");
      name.className = "upgrade-name";
      name.textContent = upg.name;

      const desc = document.createElement("div");
      desc.className = "upgrade-desc";
      desc.textContent = upg.description;

      const meta = document.createElement("div");
      meta.className = "upgrade-meta";

      let effectText = "";
      if (upg.type === "click") {
        effectText = `+${upg.clickBonus} per click`;
      } else if (upg.type === "idle") {
        effectText = `+${upg.idleBonus} idle / sec`;
      } else if (upg.type === "multiplier") {
        effectText = `+${Math.round((upg.clickMultiplierBonus || 0) * 100)}% click & +${Math.round((upg.idleMultiplierBonus || 0) * 100)}% idle per level`;
      }

      meta.textContent = `Level: ${upg.level} • Effect: ${effectText}`;

      info.appendChild(name);
      info.appendChild(desc);
      info.appendChild(meta);

      const button = document.createElement("button");
      button.className = "upgrade-button";
      const cost = getUpgradeCost(upg);
      button.textContent = `Buy (${formatNumber(cost)})`;

      if (!canAfford(cost)) {
        button.classList.add("disabled");
      }

      button.addEventListener("click", () => {
        const currentCost = getUpgradeCost(upg);
        if (!spendMoonDust(currentCost)) return;

        upg.level += 1;
        upg.currentCost = getUpgradeCost(upg);
        recalculateProduction();
        renderStats();
        renderUpgrades();
      });

      card.appendChild(info);
      card.appendChild(button);
      upgradeListEl.appendChild(card);
    });
  }

  function gameLoop(timestamp) {
    const deltaMs = timestamp - GameState.lastTick;
    GameState.lastTick = timestamp;

    const deltaSeconds = deltaMs / 1000;
    if (GameState.perSecond > 0) {
      addMoonDust(GameState.perSecond * deltaSeconds);
      renderStats();
    }

    requestAnimationFrame(gameLoop);
  }

  GameState.lastTick = performance.now();
  requestAnimationFrame(gameLoop);
});
