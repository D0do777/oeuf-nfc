// ===============================
// LISTE DES TAGS NFC AUTORISÉS
// ===============================

const TAGS_AUTORISES = [
  "ABC123XYZ",
  "TAG0001",
  "TAG0002",
  "testj1",
  "DINOSAURE-001"
];

// ===============================
// RÉCUPÉRER LE TAG DE L'URL
// ===============================

function getTagIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag");
}

// ===============================
// VÉRIFICATION DU TAG
// ===============================

function verifierTagNFC() {
  const tagFromUrl = getTagIdFromUrl();
  const tagStocke = localStorage.getItem("tagValide");

  // 1️⃣ Si un tag valide est déjà stocké → OK
  if (tagStocke && TAGS_AUTORISES.includes(tagStocke)) {
    return true;
  }

  // 2️⃣ Sinon, on vérifie celui dans l’URL
  if (tagFromUrl && TAGS_AUTORISES.includes(tagFromUrl)) {
    localStorage.setItem("tagValide", tagFromUrl);
    return true;
  }

  // 3️⃣ Sinon → accès refusé
  afficherErreur();
  return false;
}

// ===============================
// AFFICHAGE ERREUR
// ===============================

function afficherErreur() {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `
      <h1>🚫 Accès refusé</h1>
      <p>Ce lien ne provient pas d’un œuf officiel.</p>
      <p>Scanne un tag NFC pour jouer 🥚</p>
    `;
  }
}

// ===============================
// LANCEMENT
// ===============================

const NFC_OK = verifierTagNFC();
window.NFC_OK = NFC_OK;

if (!NFC_OK) {
  console.warn("Accès bloqué : tag NFC invalide");
}
