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

  // Création de la carte
  const card = document.createElement('div');
  card.className = 'card';

  // RECTO : image uniquement
  const front = document.createElement('div');
  front.className = 'front';
  const img = document.createElement('img');
  img.src = `images/${data.images[0]}`;
  img.alt = data.titre;
  front.appendChild(img);

  // VERSO : tous les champs
  const back = document.createElement('div');
  back.className = 'back';
  back.innerHTML = `
    <h3>${data.titre}</h3>

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

    <h4>Diagnostic</h4>
    <p>${data.verso.diagnostic}</p>

    <h4>Plan de lutte</h4>
    <ul>${data.verso.plan_de_lutte.map(p => `<li>${p}</li>`).join('')}</ul>

    <h4>Leviers agronomiques</h4>
    <ul>${data.verso.leviers_agronomiques.map(l => `<li>${l}</li>`).join('')}</ul>

    <h4>Notes complémentaires</h4>
    <ul>${data.verso.notes_complementaires.map(n => `<li>${n}</li>`).join('')}</ul>

    <div class="nav-buttons">
      <button id="prevBtn">Précédent</button>
      <button id="nextBtn">Suivant</button>
      <button id="randomBtn">Aléatoire</button>
    </div>
  `;

  // Assemblage
  card.append(front, back);
  container.appendChild(card);

  // Basculer front/back au clic
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  // Boutons de navigation (empêche le flip)
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
}
