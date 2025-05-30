// main.js

document.addEventListener('DOMContentLoaded', loadCartes);

let cartes = [];
let currentIndex = 0;

async function loadCartes() {
  try {
    const res = await fetch('data/cartes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cartes = await res.json();
    renderCarte();
  } catch (err) {
    console.error('Erreur chargement JSON :', err);
  }
}

function renderCarte() {
  const data = cartes[currentIndex];
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';

  const front = document.createElement('div');
  front.className = 'front ' + (data.images.length > 1 ? 'double' : 'single');

  // Barre de navigation
  const navDiv = document.createElement('div');
  navDiv.className = 'nav-buttons';
  navDiv.innerHTML = `
    <button id="prevBtn">Précédent</button>
    <button id="nextBtn">Suivant</button>
    <button id="randomBtn">Aléatoire</button>
  `;
  front.appendChild(navDiv);

  // Galerie d'images
  const wrap = document.createElement('div');
  wrap.className = 'images-wrapper';
  data.images.forEach(src => {
    const img = document.createElement('img');
    img.src = `images/${src}`;
    img.alt = data.titre;
    wrap.appendChild(img);
  });
  front.appendChild(wrap);

  // Verso
  const back = document.createElement('div');
  back.className = 'back';
  back.innerHTML = `
    <h3>Caractéristiques à observer</h3>
    <!-- ... reste du contenu ... -->
  `;

  card.append(front, back);
  container.appendChild(card);

  back.style.textAlign = 'center';

  // Flip recto/verso
  card.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    card.classList.toggle('flipped');
  });

  // Navigation logic
  navDiv.querySelector('#prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cartes.length) % cartes.length;
    renderCarte();
  });
  navDiv.querySelector('#nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cartes.length;
    renderCarte();
  });
  navDiv.querySelector('#randomBtn').addEventListener('click', () => {
    currentIndex = Math.floor(Math.random() * cartes.length);
    renderCarte();
  });
}
