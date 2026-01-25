// Sélection des éléments du DOM
const message = document.getElementById("message");
const image = document.getElementById("image");
const indexContainer = document.getElementById("index-creatures");

// Récupérer ou initialiser le jour et la date du dernier scan
function initialiserJour() {
  let jour = parseInt(localStorage.getItem("jour")) || 1;
  const dernierScan = localStorage.getItem("dernierScan");
  const aujourd'hui = new Date().toISOString().split('T')[0];

  if (dernierScan !== aujourd'hui) {
    jour += 1;
    localStorage.setItem("jour", jour);
    localStorage.setItem("dernierScan", aujourd'hui);
  }

  return jour;
}

// Définir la rareté de l'œuf si non définie
function initialiserRarete() {
  if (!localStorage.getItem("rarete")) {
    const chance = Math.random();
    let rarete = "Commun";

    if (chance < 0.05) {
      rarete = "Légendaire";
    } else if (chance < 0.15) {
      rarete = "Épique";
    } else if (chance < 0.40) {
      rarete = "Rare";
    }

    localStorage.setItem("rarete", rarete);
  }

  return localStorage.getItem("rarete");
}

// Afficher le message et l'image en fonction du jour et de la rareté
function mettreAJourAffichage() {
  const jour = initialiserJour();
  const rarete = initialiserRarete();

  if (jour === 1) {
    message.textContent = "Un œuf vient d’apparaître. Reviens demain.";
  } else {
    message.textContent = `Jour ${jour} : L’œuf évolue... Rareté : ${rarete}`;
  }

  image.src = obtenirImage(jour);
}

// Obtenir l'image correspondante au jour
function obtenirImage(jour) {
  const oeufImages = [
    'Œuf de dinosaure 1.png',
    'oeuf 2.png',
    'oeuf 3.png',
    'oeuf 4.png',
    'oeuf 5.png',
    'image 6.png'
  ];

  const creatureImage = 'dinos.avif';

  if (jour >= 1 && jour <= 6) {
    return `images/${oeufImages[jour - 1]}`;
  } else if (jour === 7) {
    return `images/${creatureImage}`;
  } else {
    return 'images/image_defaut.jpg';
  }
}

// Mettre à jour l'index des créatures débloquées
function afficherIndex() {
  const creatures = [
    { name: "Dino Commun", rarity: "Commun" },
    { name: "Dino Rare", rarity: "Rare" },
    { name: "Dino Épique", rarity: "Épique" },
    { name: "Dino Légendaire", rarity: "Légendaire" }
    // Ajouter d'autres créatures si nécessaire
  ];

  indexContainer.innerHTML = "";

  creatures.forEach(creature => {
    const div = document.createElement("div");
    div.className = localStorage.getItem(creature.name) ? "debloquee" : "non-debloquee";

    const nom = document.createElement("p");
    nom.textContent = creature.name;

    div.appendChild(nom);
    indexContainer.appendChild(div);
  });
}

// Appel initial des fonctions
mettreAJourAffichage();
afficherIndex();
