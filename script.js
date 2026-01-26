if (!window.NFC_OK) {
  console.warn("Application bloquée (NFC requis)");
  document.body.innerHTML = "<h1>🚫 NFC requis</h1>";
  return;
}


// ====== ELEMENTS HTML ======
const message = document.getElementById("message");
const image = document.getElementById("image");

// ====== DATE DU JOUR ======
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ====== RARETÉ (UNE FOIS PAR ŒUF) ======
function generateRarity() {
  const roll = Math.random();

  if (roll < 0.05) return "Légendaire";   // 5%
  if (roll < 0.15) return "Épique";       // 10%
  if (roll < 0.40) return "Rare";         // 25%
  return "Commun";                        // 60%
}

// ====== IMAGES ======
const eggImages = [
  "Œuf de dinosaure 1.png",
  "oeuf 2.png",
  "oeuf 3.png",
  "oeuf 4.png",
  "oeuf 5.png",
  "image 6.png"
];

const dinoImage = "dinos.avif";

// ====== LOGIQUE PRINCIPALE ======
function runApp() {
  let day = parseInt(localStorage.getItem("day")) || 1;
  let lastScan = localStorage.getItem("lastScan");
  const today = getToday();

  // ❌ Scan déjà fait aujourd’hui
  if (lastScan === today) {
    message.textContent = "⏳ Tu as déjà scanné aujourd’hui. Reviens demain.";
    image.src = getImageForDay(day);
    return;
  }

  // ✅ Nouveau jour
  localStorage.setItem("lastScan", today);

  // 🎲 Premier jour → nouvelle rareté
  if (day === 1) {
    const rarity = generateRarity();
    localStorage.setItem("rarity", rarity);
    localStorage.setItem("day", 2);
    message.textContent = `🥚 Un œuf ${rarity} apparaît !`;
    image.src = eggImages[0];
    return;
  }

  // 🦖 Jour 7 → dinosaure
  if (day === 7) {
    message.textContent = "🦖 L’œuf éclot ! Un dinosaure apparaît !";
    image.src = dinoImage;
    localStorage.setItem("day", day + 1);
    return;
  }

  // 🔁 Jour 8 → reset (nouvel œuf)
  if (day >= 8) {
    localStorage.removeItem("day");
    localStorage.removeItem("lastScan");
    localStorage.removeItem("rarity");
    localStorage.setItem("day", 1);
    runApp();
    return;
  }

  // 🥚 Jours 2 → 6
 message.textContent = `Jour ${day + 1} : l’œuf se fissure…`;
  image.src = eggImages[day - 1];
  localStorage.setItem("day", day + 1);
}

// ====== IMAGE SELON JOUR ======
function getImageForDay(day) {
  if (day >= 1 && day <= 6) return eggImages[day - 1];
  if (day === 7) return dinoImage;
  return eggImages[0];
}


const rarity = localStorage.getItem("rarity");
message.textContent = `Jour ${day + 1} : l’œuf se fissure… (${rarity})`;

message.textContent = "⏳ Tu as déjà scanné aujourd’hui. Reviens demain.";


// ====== LANCEMENT ======
runApp();
