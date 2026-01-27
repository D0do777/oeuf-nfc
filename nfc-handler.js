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

  if (!tagFromUrl) {
    afficherErreur("🚫 Accès refusé", "Un tag NFC valide est requis pour jouer.");
    return false;
  }

  if (TAGS_AUTORISES.includes(tagFromUrl)) {
    localStorage.setItem("tagValide", tagFromUrl);
    return true;
  }

  afficherErreur("🚫 Accès refusé", "Ce tag NFC n'est pas reconnu.");
  return false;
}

// ===============================
// AFFICHAGE ERREUR
// ===============================
function afficherErreur(title, message) {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `
      <h1>${title}</h1>
      <p>${message}</p>
      <p>Scanne un œuf officiel pour jouer 🥚</p>
    `;
  }
}

// ===============================
// LANCEMENT
// ===============================
const NFC_OK = verifierTagNFC();
window.NFC_OK = NFC_OK;

if (!NFC_OK) console.warn("Accès bloqué : tag NFC invalide");
