function main() {
  const image = document.getElementById("image");
  const rarityContainer = document.getElementById("rarity-container");
  const app = document.getElementById("app");
  const titleContainer = document.getElementById("title-container");

  // 🔊 Sons
  const sonApparitionOeuf = new Audio("audio/oeuf.wav");
  const sonBoutonCollecte = new Audio("audio/bouton.flac");
  const sonApparitionDino = new Audio("audio/dino.mp3");

  // 🥚 Images des œufs (jours 1 → 6)
  const eggImages = [
    "oeuf1teatre.png",
    "oeuf2thea.png",
    "oeuf3thea.png",
    "oeuf4thea.png",
    "oeuf5thea.png",
    "oeuf6thea.png"
  ];

  // 🦖 Dinos par rareté (modifiable)
  const DINOSAURES_PAR_RARETE = {
    "Commun": ["dinos.avif"],
    "Rare": ["IMG_7934.jpeg"],
    "Épique": ["dinos.avif"],
    "Légendaire": ["dinos.avif"]
  };

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function generateRarity() {
    const roll = Math.random();
    if (roll < 0.05) return "Légendaire";
    if (roll < 0.15) return "Épique";
    if (roll < 0.4) return "Rare";
    return "Commun";
  }

  function updateTitle() {
    const rarity = localStorage.getItem("rarity");
    if (rarity) {
      titleContainer.innerHTML = `
        🥚 Œuf mystérieux<br>
        <span style="font-size:2rem;">Rareté : ${rarity}</span>
      `;
    } else {
      titleContainer.innerHTML = "🥚 Œuf mystérieux";
    }
  }

  function getDiscoveredDinos() {
    return JSON.parse(localStorage.getItem("dinosDecouverts") || "[]");
  }

  function addDiscoveredDino(dino) {
    const discovered = getDiscoveredDinos();
    discovered.push(dino);
    localStorage.setItem("dinosDecouverts", JSON.stringify(discovered));
  }

  function selectDino(rarity) {
    const discovered = getDiscoveredDinos();
    const available = DINOSAURES_PAR_RARETE[rarity].filter(
      d => !discovered.includes(d)
    );
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function clearButton() {
    const btn = document.getElementById("collect-btn");
    if (btn) btn.remove();
  }

  function runApp() {
    clearButton();

    let day = parseInt(localStorage.getItem("day")) || 1;
    const lastScan = localStorage.getItem("lastScan");
    const today = getToday();

    // ⏳ Oubli d’un jour → retour jour 1 (rareté conservée)
    if (lastScan) {
      const diffDays =
        Math.floor((new Date(today) - new Date(lastScan)) / 86400000);
      if (diffDays > 1) {
        localStorage.setItem("day", 1);
        image.src = eggImages[0];
        rarityContainer.innerHTML =
          `<p>🥚 Tu as manqué un jour. L'œuf recommence.</p>`;
        localStorage.setItem("lastScan", today);
        updateTitle();
        return;
      }
    }

    // ⛔ Déjà scanné aujourd’hui
    if (lastScan === today) {
      image.src = eggImages[Math.max(day - 1, 0)];
      rarityContainer.innerHTML =
        `<p>⏳ Tu as déjà scanné aujourd’hui.</p>`;
      updateTitle();
      return;
    }

    localStorage.setItem("lastScan", today);

    // 🥚 Jour 1
    if (day === 1) {
      const rarity = generateRarity();
      localStorage.setItem("rarity", rarity);

      sonApparitionOeuf.play();
      image.src = eggImages[0];
      rarityContainer.innerHTML =
        `<p>🥚 Un œuf ${rarity} apparaît !</p>`;

      localStorage.setItem("day", 2);
      updateTitle();
      return;
    }

    // 🦖 Jour 7 – éclosion
    if (day === 7) {
      const rarity = localStorage.getItem("rarity");
      const dino = selectDino(rarity);

      if (dino) {
        sonApparitionDino.play();
        addDiscoveredDino(dino);
        image.src = dino;
        rarityContainer.innerHTML =
          `<p>🦖 Un dinosaure ${rarity} est né !</p>`;
      }

      const btn = document.createElement("button");
      btn.id = "collect-btn";
      btn.textContent = "🥚 Collecter un nouvel œuf";
      btn.onclick = () => {
        sonBoutonCollecte.play();
        localStorage.setItem("day", 1);
        runApp();
      };

      app.appendChild(btn);
      localStorage.setItem("day", 8);
      updateTitle();
      return;
    }

    // 🐣 Jours 2 → 6
    const rarity = localStorage.getItem("rarity");
    image.src = eggImages[day - 1];
    rarityContainer.innerHTML =
      `<p>Jour ${day} : l’œuf évolue…</p>`;
    localStorage.setItem("day", day + 1);
    updateTitle();
  }

  runApp();
}

// 🔒 NFC Gate
if (!window.NFC_OK) {
  document.getElementById("app").innerHTML = `
    <h1>🚫 NFC requis</h1>
    <p>Scanne un œuf officiel pour jouer 🥚</p>
  `;
} else {
  main();
}
