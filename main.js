document.addEventListener('DOMContentLoaded', loadCartes);
let cartes = [], currentIndex = 0;
async function loadCartes() {
  const res = await fetch('data/cartes.json'); cartes = await res.json(); showCarte(0);
}
function showCarte(i) {
  const data = cartes[i];
  const container = document.getElementById('card-container'); container.innerHTML = '';
  const card = document.createElement('div'); card.className = 'card'; card.addEventListener('click', () => card.classList.toggle('flipped'));
  const front = document.createElement('div'); front.className = 'card__face card__face--front';
  data.images.forEach(src => {
    const img = document.createElement('img'); img.src = `images/${src}`; img.alt = data.titre; img.style.maxWidth = '100%'; img.style.display = 'block'; img.style.marginBottom = '8px'; front.appendChild(img);
  });
  const back = document.createElement('div'); back.className = 'card__face card__face--back';
  back.innerHTML = `
    <h3>${data.titre}</h3>
    <h4>Symptômes visibles</h4>
    <ul>${data.verso.symptomes_visibles.map(s => `<li>${s}</li>`).join('')}</ul>
    <h4>Diagnostic</h4><p>${data.verso.diagnostic}</p>
    <h4>Plan de lutte</h4><ul>${data.verso.plan_de_lutte.map(p => `<li>${p}</li>`).join('')}</ul>
  `;
  card.append(front, back); container.appendChild(card);
}
document.getElementById('prevBtn').addEventListener('click', () => { currentIndex = (currentIndex - 1 + cartes.length) % cartes.length; showCarte(currentIndex); });
document.getElementById('nextBtn').addEventListener('click', () => { currentIndex = (currentIndex + 1) % cartes.length; showCarte(currentIndex); });
document.getElementById('randomBtn').addEventListener('click', () => { currentIndex = Math.floor(Math.random() * cartes.length); showCarte(currentIndex); });
