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
  const container = document.getElementById('card-container');

  // On remplace tout
  container.innerHTML = '';

  // Création de la carte
  const card = document.createElement('div');
  card.className = 'card';

  // Recto : image
  const front = document.createElement('div');
  front.className = 'front';
  const img = document.createElement('img');
  img.src = `images/${data.images[0]}`;
  img.alt = data.titre;
  front.appendChild(img);

  // Verso : texte + boutons
  const back = document.createElement('div');
  back.className = 'back';
  back.innerHTML = `
    <h3>${data.titre}</h3>
    <h4>Symptômes visibles</h4>
    <ul>${data.verso.symptomes_visibles.map(s=>`<li>${s}</li>`).join('')}</ul>
    <h4>Diagnostic</h4>
    <p>${data.verso.diagnostic}</p>
    <h4>Plan de lutte</h4>
    <ul>${data.verso.plan_de_lutte.map(p=>`<li>${p}</li>`).join('')}</ul>
    <div class="nav-buttons">
      <button id="prevBtn">Précédent</button>
      <button id="nextBtn">Suivant</button>
      <button id="randomBtn">Aléatoire</button>
    </div>
  `;

  // Assemblage
  card.append(front, back);
  container.appendChild(card);

  // Clic bascule front/back
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  // Hook des boutons (empêche la propagation pour ne pas rebasculer)
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
