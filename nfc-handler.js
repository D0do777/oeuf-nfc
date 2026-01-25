// ===============================
// LISTE DES TAGS NFC AUTORISÉS
// ===============================

const TAGS_AUTORISES = [
  "ABC123XYZ",
  "TAG0001",
  "TAG0002",
  "DINOSAURE-001"
  // ➕ tu ajoutes ici autant de tags que tu veux
];

// ===============================
// LECTURE DU TAG DEPUIS L'URL
// ===============================

function getTagId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag");
}

// ===============================
// VÉRIFICATION DU TAG
// ===============================

function verifierTag() {
  const tagId = getTagId();

  if (!tagId) {
    afficherErreur("Aucun tag NFC détecté.");
    return false;
  }

  if (!TAGS_AUTORISES.includes(tagId)) {
    afficherErreur("Ce tag NFC n'est pas valide.");
    return false;
  }

  // Tag valide → on le mémorise pour l'appareil
  localStorage.setItem("tagValide", tagId);
  return true;
}

// ===============================
// MESSAGE D'ERREUR
// ===============================

function afficherErreur(message) {
  document.body.innerHTML = `
    <h1>🚫 Accès refusé</h1>
    <p>${message}</p>
    <p>Scanne un œuf officiel pour jouer 🥚</p>
  `;
}

// ===============================
// LANCEMENT
// ===============================

if (!verifierTag()) {
  throw new Error("Tag NFC invalide");
}

