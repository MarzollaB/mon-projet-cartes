// main.js

document.addEventListener('DOMContentLoaded', loadCartes);

let cartes = [];
let currentIndex = 0;

async function loadCartes() {
  const response = await fetch('data/cartes.json');
  cartes = await response.json();
  showCarte(0);
}

function showCarte(i) {
  const data = cartes[i];
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  // Création de la carte
  const card = document.createElement('div');
  card.className = 'card';
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    adjustCardHeight(card);
  });

  // RECTO : image
  const front = document.createElement('div');
  front.className = 'card__face card__face--front';
  const img = document.createElement('img');
  img.src = `images/${data.images[0]}`;
  img.alt = data.titre;
  front.appendChild(img);

  // VERSO : texte structuré + boutons
  const back = document.createElement('div');
  back.className = 'card__face card__face--back';
  back.innerHTML = `
    <h3>${data.titre}</h3>
    <h4>Symptômes visibles</h4>
    <ul>${data.verso.symptomes_visibles.map(s => `<li>${s}</li>`).join('')}</ul>
    <h4>Diagnostic</h4>
    <p>${data.verso.diagnostic}</p>
    <h4>Plan de lutte</h4>
    <ul>${data.verso.plan_de_lutte.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="nav-buttons">
      <button id="prevBtn">Précédent</button>
      <button id="nextBtn">Suivant</button>
      <button id="randomBtn">Aléatoire</button>
    </div>
  `;

  // Assemblage et insertion
  card.appendChild(front);
  card.appendChild(back);
  container.appendChild(card);

  // On attache les handlers sur les boutons à l'intérieur du verso
  back.querySelector('#prevBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + cartes.length) % cartes.length;
    showCarte(currentIndex);
  });
  back.querySelector('#nextBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % cartes.length;
    showCarte(currentIndex);
  });
  back.querySelector('#randomBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = Math.floor(Math.random() * cartes.length);
    showCarte(currentIndex);
  });

  // Ajuste la hauteur pour la face visible
  adjustCardHeight(card);
}

// Ajuste la hauteur du conteneur .card en fonction de la face visible
function adjustCardHeight(card) {
  const isFlipped = card.classList.contains('flipped');
  const visibleFace = isFlipped
    ? card.querySelector('.card__face--back')
    : card.querySelector('.card__face--front');

  // Mesure la hauteur nécessaire
  card.style.height = 'auto';
  const neededHeight = visibleFace.getBoundingClientRect().height;
  card.style.height = `${neededHeight}px`;
}
