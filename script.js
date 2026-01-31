function main() {
  const image = document.getElementById("image");
  const rarityContainer = document.getElementById("rarity-container");
  const app = document.getElementById("app");

  // Création des objets Audio pour les sons
const sonApparitionOeuf = new Audio('audio/oeuf.wav');
const sonBoutonCollecte = new Audio('audio/bouton.flac');
const sonApparitionDino = new Audio('audio/dino.mp3');

  const eggImages = [
    "oeuf1teatre.png",
    "oeuf2thea.png",
    "oeuf3thea.png",
    "oeuf4thea.png",
    "oeuf5thea.png",
    "oeuf6thea.png"
  ];

  // 🦖 Dinosaures par rareté (modifiable librement)
  const DINOSAURES_PAR_RARETE = {
    "Commun": ["dinos.avif", "dinos.avif"],
    "Rare": ["dinos.avif", "dinos.avif"],
    "Épique": ["dinos.avif", "dinos.avif"],
    "Légendaire": ["dinos.avif"]
  };

  const RARETES = Object.keys(DINOSAURES_PAR_RARETE);

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function generateRarity() {
    const roll = Math.random();
    if (roll < 0.05) return "Légendaire";
    if (roll < 0.15) return "Épique";
    if (roll < 0.40) return "Rare";
    return "Commun";
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
    const available = DINOSAURES_PAR_RARETE[rarity].filter(d => !discovered.includes(d));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function getNextRarity() {
    const discovered = getDiscoveredDinos();
    const available = RARETES.filter(r =>
      DINOSAURES_PAR_RARETE[r].some(d => !discovered.includes(d))
    );
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function clearButtons() {
    const btn = document.getElementById("collect-btn");
    if (btn) btn.remove();
  }

  function runApp() {
    clearButtons();

    let day = parseInt(localStorage.getItem("day")) || 1;
    let lastScan = localStorage.getItem("lastScan");
    const today = getToday();

    // ⏳ Oubli d’un jour → retour jour 1 mais rareté conservée
    if (lastScan) {
      const diffDays = Math.floor((new Date(today) - new Date(lastScan)) / 86400000);
      if (diffDays > 1) {
        day = 1;
        localStorage.setItem("day", 1);
        rarityContainer.innerHTML = `<p>🥚 Tu as manqué un jour. L'œuf recommence, rareté conservée.</p>`;
        image.src = eggImages[0];
        localStorage.setItem("lastScan", today);
        return;
      }
    }

    if (lastScan === today) {
      rarityContainer.innerHTML = `<p>⏳ Tu as déjà scanné aujourd’hui. Reviens demain.</p>`;
      image.src = eggImages[Math.max(day - 1, 0)];
      return;
    }

    localStorage.setItem("lastScan", today);

    // Jour 1
    if (day === 1) {
      const rarity = localStorage.getItem("rarity") || generateRarity();
      localStorage.setItem("rarity", rarity);
      
      // Jouer le son d'apparition de l'œuf
      sonApparitionOeuf.play();
      
      rarityContainer.innerHTML = `<p>🥚 Un œuf ${rarity} apparaît !</p>`;
      image.src = eggImages[0];
      localStorage.setItem("day", 2);
      return;
    }

    // Jour 7 – éclosion
    if (day === 7) {
      const rarity = localStorage.getItem("rarity");
      const dino = selectDino(rarity);

      if (dino) {
          // Jouer le son d'apparition du dinosaure
        sonApparitionDino.play();
        addDiscoveredDino(dino);
        image.src = dino;
        rarityContainer.innerHTML = `<p>🦖 Un dinosaure ${rarity} est né !</p>`;
      } else {
        const next = getNextRarity();
        if (next) {
          localStorage.setItem("rarity", next);
          rarityContainer.innerHTML = `<p>✨ Tous les ${rarity} sont découverts. Prochaine rareté : ${next}</p>`;
        } else {
          rarityContainer.innerHTML = `<p>🎉 Tous les dinosaures sont découverts ! Merci ❤️</p>`;
        }
      }

      const btn = document.createElement("button");
      btn.id = "collect-btn";
      btn.textContent = "🥚 Collecter un nouvel œuf";
      btn.onclick = () => {
        // Jouer le son du bouton de collecte
        sonBoutonCollecte.play();
        localStorage.setItem("day", 1);
        runApp();
      };

      app.appendChild(btn);
      localStorage.setItem("day", 8);
      return;
    }

    // Jours 2 → 6
    const rarity = localStorage.getItem("rarity");
    rarityContainer.innerHTML = `<p>Jour ${day} : l’œuf évolue… (${rarity})</p>`;
    image.src = eggImages[day - 1];
    localStorage.setItem("day", day + 1);
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

