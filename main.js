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

  // 1. On ajoute d'abord les boutons
  const navDiv = document.createElement('div');
  navDiv.className = 'nav-buttons';
  navDiv.innerHTML = `
    <button id="prevBtn">Précédent</button>
    <button id="nextBtn">Suivant</button>
    <button id="randomBtn">Aléatoire</button>
  `;
  front.appendChild(navDiv);

  // 2. Puis on ajoute la galerie d'images (scroll horizontal)
  const wrap = document.createElement('div');
  wrap.className = 'images-wrapper';
  data.images.forEach(src => {
    const img = document.createElement('img');
    img.src = `images/${src}`;
    img.alt = data.titre;
    wrap.appendChild(img);
  });
  front.appendChild(wrap);

  // Back side
  const back = document.createElement('div');
  back.className = 'back';
  back.innerHTML = `
    <h3>Caractéristiques à observer</h3>
    <h4>Symptômes visibles</h4>
    <ul>${data.verso.symptomes_visibles.map(s => `<li>${s}</li>`).join('')}</ul>
    <h4>Localisation dans le champ</h4>
    <p>${data.verso.localisation_dans_le_champ}</p>
    <h4>Feuilles atteintes</h4>
    <p>${data.verso.feuilles_atteintes}</p>
    <h4>Répartition sur la feuille</h4>
    <p>${data.verso.repartition_sur_la_feuille}</p>
    <h4>Symptômes secondaires</h4>
    <p>${data.verso.symptomes_secondaires}</p>

    <div class="diagnostic-box">
      <h4 class="diagnostic">Diagnostic</h4>
      <p class="diagnostic-text">${data.verso.diagnostic}</p>
    </div>

    <h4>Plan de lutte</h4>
    <ul>${data.verso.plan_de_lutte.map(p => `<li>${p}</li>`).join('')}</ul>
    <h4>Leviers agronomiques</h4>
    <ul>${data.verso.leviers_agronomiques.map(l => `<li>${l}</li>`).join('')}</ul>
    <h4>Notes complémentaires</h4>
    <ul>${data.verso.notes_complementaires.map(n => `<li>${n}</li>`).join('')}</ul>
  `;

  card.append(front, back);
  container.appendChild(card);

  back.style.textAlign = 'center';

  // Flip event
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
