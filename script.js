function main() {
  const image = document.getElementById("image");
  const rarityContainer = document.getElementById("rarity-container");
  const app = document.getElementById("app");

  // 🔊 Sons
  const sonApparitionOeuf = new Audio("audio/oeuf.wav");
  const sonBoutonCollecte = new Audio("audio/bouton.flac");
  const sonApparitionDino = new Audio("audio/dino.mp3");

  // 🥚 Images de l'œuf (jours 1 à 6)
  const eggImages = [
    "oeuf1teatre.png",
    "oeuf2thea.png",
    "oeuf3thea.png",
    "oeuf4thea.png",
    "oeuf5thea.png",
    "oeuf6thea.png"
  ];

  // 🦖 Dinos par rareté
  const DINOSAURES_PAR_RARETE = {
    Commun: ["dinos.avif"],
    Rare: ["dinos.avif"],
    Épique: ["dinos.avif"],
    Légendaire: ["dinos.avif"]
  };

  const RARETES = Object.keys(DINOSAURES_PAR_RARETE);

  // 📅 Date du jour
  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  // 🎲 Tirage rareté
  function generateRarity() {
    const roll = Math.random();
    if (roll < 0.05) return "Légendaire";
    if (roll < 0.15) return "Épique";
    if (roll < 0.4) return "Rare";
    return "Commun";
  }

  // 📦 Dinos découverts
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

  // 🚀 LOGIQUE PRINCIPALE
  function runApp() {
    clearButton();

    let day = parseInt(localStorage.getItem("day")) || 1;
    const lastScan = localStorage.getItem("lastScan");
    const today = getToday();

    // ⏳ Déjà scanné aujourd’hui
    if (lastScan === today) {
      rarityContainer.innerHTML = `<p>⏳ Tu as déjà scanné aujourd’hui. Reviens demain.</p>`;
      image.src = eggImages[Math.max(day - 1, 0)] || eggImages[0];
      return;
    }

    // 🕒 Mise à jour date
    localStorage.setItem("lastScan", today);

    // 🥚 JOUR 1
    if (day === 1) {
      const rarity = generateRarity();
      localStorage.setItem("rarity", rarity);
      sonApparitionOeuf.play();
      rarityContainer.innerHTML = `<p>🥚 Un œuf ${rarity} apparaît !</p>`;
      image.src = eggImages[0];
      localStorage.setItem("day", 2);
      return;
    }

    // 🦖 JOUR 7 – ÉCLOSION
    if (day === 7) {
      const rarity = localStorage.getItem("rarity");
      const dino = selectDino(rarity);

      if (dino) {
        sonApparitionDino.play();
        image.src = dino;
        rarityContainer.innerHTML = `<p>🦖 Un dinosaure ${rarity} est né !</p>`;
        addDiscoveredDino(dino);
      } else {
        rarityContainer.innerHTML = `<p>🎉 Tous les dinos ${rarity} sont déjà découverts !</p>`;
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
      return;
    }

    // 🥚 JOURS 2 → 6
    const rarity = localStorage.getItem("rarity");
    rarityContainer.innerHTML = `<p>Jour ${day} : l’œuf évolue… (${rarity})</p>`;
    image.src = eggImages[day - 1];
    localStorage.setItem("day", day + 1);
  }

  runApp();
}

// 🔒 NFC GATE
if (!window.NFC_OK) {
  document.getElementById("app").innerHTML = `
    <h1>🚫 NFC requis</h1>
    <p>Scanne un œuf officiel pour jouer 🥚</p>
  `;
} else {
  main();
}
