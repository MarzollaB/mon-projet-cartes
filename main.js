// main.js

document.addEventListener('DOMContentLoaded', loadCartes);

let cartes = [];
let currentIndex = 0;

async function loadCartes() {
  const res = await fetch('data/cartes.json');
  cartes = await res.json();
  renderCarte();
}

function renderCarte() {
  const data = cartes[currentIndex];
  const cardEl = document.getElementById('card');

  // Vide et remet la carte à l'état non-flippé
  cardEl.innerHTML = '';
  cardEl.classList.remove('flipped');

  // Création de la face recto (image)
  const front = document.createElement('div');
  front.className = 'face front';
  const img = document.createElement('img');
  img.src = `images/${data.images[0]}`;
  img.alt = data.titre;
  front.appendChild(img);

  // Création de la face verso (texte + boutons)
  const back = document.createElement('div');
  back.className = 'face back';
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

  // Assemblage
  cardEl.append(front, back);

  // Ajustement de la hauteur en fonction de la face visible
  adjustCardHeight(cardEl);

  // Gestion des boutons (stopPropagation pour éviter le flip)
  back.querySelector('#prevBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + cartes.length) % cartes.length;
    renderCarte();
  });
  back.querySelector('#nextBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % cartes.length;
    renderCarte();
  });
  back.querySelector('#randomBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = Math.floor(Math.random() * cartes.length);
    renderCarte();
  });

  // Flip au clic sur la carte
  cardEl.addEventListener('click', () => {
    cardEl.classList.toggle('flipped');
    adjustCardHeight(cardEl);
  });
}

// Ajuste la hauteur du conteneur .card pour englober la face active
function adjustCardHeight(cardEl) {
  // Permettre le calcul
  cardEl.style.height = 'auto';
  const activeFace = cardEl.classList.contains('flipped')
    ? cardEl.querySelector('.face.back')
    : cardEl.querySelector('.face.front');
  const h = activeFace.getBoundingClientRect().height;
  cardEl.style.height = `${h}px`;
}
