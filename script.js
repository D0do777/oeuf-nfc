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

  // Dinosaures par rareté
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
    // Vérifie les raretés disponibles avec dinos non découverts
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

    if (lastScan === today) {
      rarityContainer.innerHTML = `<p>⏳ Tu as déjà scanné aujourd’hui. Reviens demain.</p>`;
      image.src = getImageForDay(day);
      return;
    }

    localStorage.setItem("lastScan", today);

    if (day === 1) {
      let rarity = generateRarity();
      localStorage.setItem("rarity", rarity);
      localStorage.setItem("day", 2);
      rarityContainer.innerHTML = `<p>🥚 Un œuf ${rarity} apparaît !</p>`;
      image.src = eggImages[0];
      return;
    }

    if (day === 7) {
      let rarity = localStorage.getItem("rarity");
      const dino = selectDino(rarity);

      if (dino) {
        rarityContainer.innerHTML = `<p>🦖 L’œuf ${rarity} éclot ! Tu as découvert <strong>${dino}</strong> !</p>`;
        image.src = dino;
      } else {
        // tous les dinos de cette rareté sont découverts
        const nextRarete = getNextRarity();
        if (nextRarete) {
          localStorage.setItem("rarity", nextRarete);
          rarityContainer.innerHTML = `<p>🦖 Tous les dinosaures ${rarity} ont été découverts. Le prochain œuf sera de rareté <strong>${nextRarete}</strong>.</p>`;
          image.src = "dino_placeholder.png";
        } else {
          // tout est découvert
          rarityContainer.innerHTML = `<p>🎉 Tu as découvert tous les dinosaures ! Merci d’avoir joué. En attendant la prochaine mise à jour, reviens bientôt !</p>`;
          image.src = "dino_placeholder.png";
        }
      }

      localStorage.setItem("day", day + 1);
      return;
    }

    if (day >= 8) {
      rarityContainer.innerHTML = `<p>La progression continue…</p>`;
      image.src = getImageForDay(day);
      localStorage.setItem("day", day + 1);
      return;
    }

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

// NFC Gate
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
