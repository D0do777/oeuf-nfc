function main() {
  const message = document.getElementById("message");
  const image = document.getElementById("image");
  const rarityContainer = document.getElementById("rarity-container");

  const eggImages = [
    "oeuf1teatre.png",
    "oeuf2thea.png",
    "oeuf3thea.png",
    "oeuf4thea.png",
    "oeuf5thea.png",
    "oeuf6thea.png"
  ];

  // 🦖 Dinosaures par rareté (modifiable)
  const DINOSAURES_PAR_RARETE = {
    "Commun": ["dino_commun1.png", "dino_commun2.png"],
    "Rare": ["dino_rare1.png", "dino_rare2.png"],
    "Épique": ["dino_epique1.png", "dino_epique2.png"],
    "Légendaire": ["dino_legendaire1.png", "dino_legendaire2.png"]
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

  function selectDino(rarity) {
    const discovered = JSON.parse(localStorage.getItem("dinosDecouverts") || "[]");
    const available = DINOSAURES_PAR_RARETE[rarity].filter(d => !discovered.includes(d));
    if (available.length === 0) return null;
    const choix = available[Math.floor(Math.random() * available.length)];
    discovered.push(choix);
    localStorage.setItem("dinosDecouverts", JSON.stringify(discovered));
    return choix;
  }

  function getNextRarity() {
    const discovered = JSON.parse(localStorage.getItem("dinosDecouverts") || "[]");
    const availableRaretes = RARETES.filter(r =>
      DINOSAURES_PAR_RARETE[r].some(d => !discovered.includes(d))
    );
    if (availableRaretes.length === 0) return null; // tout découvert
    return availableRaretes[Math.floor(Math.random() * availableRaretes.length)];
  }

  function runApp() {
    let day = parseInt(localStorage.getItem("day")) || 1;
    let lastScan = localStorage.getItem("lastScan");
    const today = getToday();

    // === Reset partiel si oubli d'un jour ===
    if (lastScan) {
      const lastDate = new Date(lastScan);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000*60*60*24));

      if (diffDays > 1) {
        // Reset de l'œuf au jour 1 mais conserve la rareté et dinos déjà découverts
        day = 1;
        localStorage.setItem("day", day);

        const rarity = localStorage.getItem("rarity"); // garde la rareté existante
        rarityContainer.innerHTML = `
          <p>🥚 Tu as manqué un jour ! L'œuf revient au jour 1. Rarete conservée : ${rarity}</p>
        `;
        image.src = eggImages[0];
        localStorage.setItem("lastScan", today);
        return;
      }
    }

    // === Déjà scanné aujourd'hui ===
    if (lastScan === today) {
      rarityContainer.innerHTML = `<p>⏳ Tu as déjà scanné aujourd’hui. Reviens demain.</p>`;
      image.src = getImageForDay(day);
      return;
    }

    localStorage.setItem("lastScan", today);

    // === Jour 1 ===
    if (day === 1) {
      const rarity = localStorage.getItem("rarity") || generateRarity();
      localStorage.setItem("rarity", rarity);
      rarityContainer.innerHTML = `<p>🥚 Un œuf ${rarity} apparaît !</p>`;
      image.src = eggImages[0];
      localStorage.setItem("day", 2);
      return;
    }

    // === Jour 7 : éclosion ===
    if (day === 7) {
      const rarity = localStorage.getItem("rarity");
      const dino = selectDino(rarity);

      if (dino) {
        rarityContainer.innerHTML = `<p>🦖 L’œuf ${rarity} éclot ! Tu as découvert <strong>${dino}</strong> !</p>`;
        image.src = dino;
      } else {
        const nextRarete = getNextRarity();
        if (nextRarete) {
          localStorage.setItem("rarity", nextRarete);
          rarityContainer.innerHTML = `<p>🦖 Tous les dinosaures ${rarity} ont été découverts. Le prochain œuf sera de rareté <strong>${nextRarete}</strong>.</p>`;
          image.src = "dino_placeholder.png";
        } else {
          rarityContainer.innerHTML = `<p>🎉 Tu as découvert tous les dinosaures ! Merci d’avoir joué. En attendant la prochaine mise à jour, reviens bientôt !</p>`;
          image.src = "dino_placeholder.png";
        }
      }

      localStorage.setItem("day", day + 1);
      return;
    }

    // === Jours 8+ ===
    if (day >= 8) {
      rarityContainer.innerHTML = `<p>La progression continue…</p>`;
      image.src = getImageForDay(day);
      localStorage.setItem("day", day + 1);
      return;
    }

    // === Jours 2 à 6 ===
    const rarity = localStorage.getItem("rarity");
    rarityContainer.innerHTML = `<p>Jour ${day} : l’œuf se fissure… (${rarity})</p>`;
    image.src = eggImages[day - 1];
    localStorage.setItem("day", day + 1);
  }

  function getImageForDay(day) {
    if (day >= 1 && day <= 6) return eggImages[day - 1];
    return "dino_placeholder.png";
  }

  runApp();
}

// === NFC Gate ===
if (!window.NFC_OK) {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `
      <h1>🚫 NFC requis</h1>
      <p>Scanne un œuf officiel pour jouer 🥚</p>
    `;
  }
} else {
  main();
}
