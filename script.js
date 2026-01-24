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
