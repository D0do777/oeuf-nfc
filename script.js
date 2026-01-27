function main() {

  // ====== ELEMENTS HTML ======
  const message = document.getElementById("message");
  const image = document.getElementById("image");

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

  const eggImages = [
    "oeuf1teatre.png",
    "oeuf2thea.png",
    "oeuf3thea.png",
    "oeuf4thea.png",
    "oeuf5thea.png",
    "oeuf6thea.png"
  ];

  const dinoImage = "dinos.avif";

  function runApp() {
    let day = parseInt(localStorage.getItem("day")) || 1;
    let lastScan = localStorage.getItem("lastScan");
    const today = getToday();

    if (lastScan === today) {
      message.textContent = "⏳ Tu as déjà scanné aujourd’hui. Reviens demain.";
      image.src = getImageForDay(day);
      return;
    }

    localStorage.setItem("lastScan", today);

    if (day === 1) {
      const rarity = generateRarity();
      localStorage.setItem("rarity", rarity);
      localStorage.setItem("day", 2);
      message.textContent = `🥚 Un œuf ${rarity} apparaît !`;
      image.src = eggImages[0];
      return;
    }

    if (day === 7) {
      const rarity = localStorage.getItem("rarity");
      message.textContent = `🦖 L’œuf ${rarity} éclot ! Un dinosaure apparaît !`;
      image.src = dinoImage;
      localStorage.setItem("day", day + 1);
      return;
    }

    if (day >= 8) {
      localStorage.removeItem("day");
      localStorage.removeItem("lastScan");
      localStorage.removeItem("rarity");
      localStorage.setItem("day", 1);
      runApp();
      return;
    }

    const rarity = localStorage.getItem("rarity");
    message.textContent = `Jour ${day} : l’œuf se fissure… (${rarity})`;
    image.src = eggImages[day - 1];
    localStorage.setItem("day", day + 1);
  }

  function getImageForDay(day) {
    if (day >= 1 && day <= 6) return eggImages[day - 1];
    if (day === 7) return dinoImage;
    return eggImages[0];
  }

  runApp();
}


if (!window.NFC_OK) {
  console.warn("Application bloquée (NFC requis)");

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

