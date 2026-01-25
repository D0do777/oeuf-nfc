// Sélection des éléments du DOM
const message = document.getElementById("message");
const image = document.getElementById("image");

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

// Définir la rareté de l'œuf uniquement le huitième jour
function initialiserRarete(jour) {
  if (jour === 8 && !localStorage.getItem("rarete")) {
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
}

// Obtenir l'image en fonction du jour
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
    return oeufImages[jour - 1];
  } else if (jour === 7) {
    return creatureImage;
  } else {
    // Si on est au-delà du septième jour, on revient à un nouvel œuf
    return oeufImages[0];
  }
}

// Mettre à jour l'affichage en fonction du jour
function mettreAJourAffichage() {
  const jour = initialiserJour();
  initialiserRarete(jour);

  if (jour === 1) {
    message.textContent = "Un œuf vient d’apparaître. Reviens demain.";
  } else if (jour >= 2 && jour <= 7) {
    message.textContent = `Jour ${jour} : L’œuf évolue…`;
  } else {
    // Jour 8 et au-delà : nouvel œuf
    message.textContent = "Un nouvel œuf apparaît. Reviens demain.";
  }

  image.src = obtenirImage(jour);
}

// Appel initial des fonctions pour afficher correctement dès le chargement
mettreAJourAffichage();
