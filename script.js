const message = document.getElementById("message");
const image = document.getElementById("image");

let jour = localStorage.getItem("jour");

if (!jour) {
  jour = 1;
  localStorage.setItem("jour", jour);
  message.textContent = "Un œuf vient d’apparaître. Reviens demain.";
} else {
  message.textContent = "L’œuf se souvient de toi.";
}

image.src = "Œuf de dinosaure brillant (1).png";

const message = document.getElementById("message");
const image = document.getElementById("image");

// Récupérer la date du dernier scan
let dernierScan = localStorage.getItem("dernierScan");
let aujourdhui = new Date().toISOString().split('T')[0];

// Vérifier si c'est un nouveau jour
if (dernierScan !== aujourdhui) {
  // Mise à jour de la date et de la progression
  let jour = parseInt(localStorage.getItem("jour")) || 1;
  jour += 1; // On avance d'un jour
  localStorage.setItem("jour", jour);
  localStorage.setItem("dernierScan", aujourd'hui);
  
  // Mettre à jour le message
  message.textContent = `Jour ${jour} : L’œuf évolue...`;
} else {
  // Si c'est le même jour, pas de changement
  let jour = localStorage.getItem("jour") || 1;
  message.textContent = `Reviens demain pour faire évoluer l’œuf.`;
}

// Charger l'image de l'œuf (on peut ajouter des étapes ici)
image.src = "oeuf.png"; // Remplacer par l'image correcte plus tard

// Tirage aléatoire de rareté au premier scan
if (!localStorage.getItem("rarete")) {
  let chance = Math.random();
  let rarete = "Commun";
  
  if (chance < 0.05) {
    rarete = "Légendaire";
  } else if (chance < 0.15) {
    rarete = "Épique";
  } else if (chance < 0.40) {
    rarete = "Rare";
  }

  localStorage.setItem("rarete", rarete);
  message.textContent = `Rareté initiale : ${rarete}`;
} else {
  let rarete = localStorage.getItem("rarete");
  message.textContent = `Rareté : ${rarete}`;
}
