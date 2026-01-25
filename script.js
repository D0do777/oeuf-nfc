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

const creatures = [
  { name: "Dino Commun", rarity: "Commun" },
  { name: "Dino Rare", rarity: "Rare" },
  { name: "Dino Épique", rarity: "Épique" },
  { name: "Dino Légendaire", rarity: "Légendaire" },
  // Ajoute d'autres créatures ici
];

function afficherIndex() {
  const indexContainer = document.getElementById("index-creatures");
  indexContainer.innerHTML = ""; // On vide d’abord le conteneur

  creatures.forEach(creature => {
    const div = document.createElement("div");
    div.className = "creature";

    const nom = document.createElement("p");
    nom.textContent = creature.name;

    // Vérifier si la créature est débloquée
    const debloquee = localStorage.getItem(creature.name);

    if (debloquee) {
      div.classList.add("debloquee");
    } else {
      div.classList.add("non-debloquee");
    }

    div.appendChild(nom);
    indexContainer.appendChild(div);
  });
}

// Appeler la fonction pour afficher l’index
afficherIndex();

// Tableau des images de l'œuf pour les six premiers jours
const oeufImages = [
  'Œuf de dinosaure 1.png',
  'oeuf 2.png',
  'oeuf 3.png',
  'oeuf 4.png',
  'oeuf 5.png',
  'image 6.png'
];

// Image de la créature pour le septième jour
const creatureImage = 'dinos.avif';

// Fonction pour obtenir l'image en fonction du jour actuel
function obtenirImage(jour) {
  if (jour >= 1 && jour <= 6) {
    return oeufImages[jour - 1];
  } else if (jour === 7) {
    return creatureImage;
  } else {
    // Si le jour est en dehors de 1 à 7, on peut afficher une image par défaut ou une image vide
    return 'image_defaut.jpg';
  }
}

// Exemple d'utilisation :
const jourActuel = 3; // Remplace par la logique pour obtenir le jour actuel
const imageAAfficher = obtenirImage(jourActuel);

// Afficher l'image (par exemple dans une balise <img> ou un élément HTML)
document.getElementById('image-container').src = imageAfficher;

let jourActuel = 1; // Remplace cette valeur pour tester différents jours

let imageAfficher;

if (jourActuel >= 1 && jourActuel <= 6) {
  // On affiche l’image de l’œuf correspondante
  imageA afficher = `images/oeuf_jour${jourActuel}.jpg`;
} else if (jourActuel === 7) {
  // On affiche l’image de la créature
  imageA afficher = 'images/creature_jour7.jpg';
}

// Maintenant, on met à jour l’image sur la page
document.getElementById('image-container').src = imageA afficher;
