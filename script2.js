const prizes = [
  {
    id: 1,
    name: "Бефстроганов и говядины в сливках с картофельным пюре",
    image: "./img/1.webp",
    probability: 'Эпик',
  },
  {
    id: 2,
    name: "Борщ с телятиной без сметаны",
    image: "./img/10.webp",
    probability: 'Редкость',
  },
  {
    id: 3,
    name: "Гедзе с курицей в соусе Чили",
    image: "./img/9.webp",
    probability: 'Редкость',
  },
  {
    id: 4,
     name: "Куриные котлеты с пюре и сырным соусом",
    image: "./img/8.webp",
    probability: 'Эпик',
  },
  {
    id: 5,
      name: "Куриные фрикадельки с рисом и овощами",
    image: "./img/7.webp",
    probability: 'База',
    
  },
  {
    id: 6,
    name: "Паста с морепродуктами",
    image: "./img/6.webp",
    probability: 'Эпик',
  },
  {
    id: 7,
    name: "Птитим с вишней и сливочным соусом",
    image: "./img/5.webp",
    probability: 'База',
  },
  {
    id: 8,
      name: "Традиционный плов с говядиной",
    image: "./img/4.webp",
    probability: 'Редкость',
  },
  {
    id: 9,
       name: "Филе белой рыбы, запеченное в соусе мисо, с копчеными сливками и картофельным пюре",
    image: "./img/3.webp",
    probability: 'База',
  },
  {
    id: 10,
     name: "Шоколадный брауни",
    image: "./img/2.webp",
    probability: 'Легенда',
  },
];
let deg = [36, 72, 108, 144, 180, 216, 252, 288, 324, 360];
//const probabilities = [7, 10, 10, 7, 15, 7, 15, 10, 15, 4];
const probabilities = [4, 15, 10, 15, 7, 15, 7, 10, 10, 7];
let isSpinning = false;
let currentRotation = 0;
const spinButton = document.getElementById("spinButton");
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedDegree = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeWeight += probabilities[i];
      if (random <= cumulativeWeight) {
        selectedDegree = deg[i];
        break;
      }
  }
  const probabilityIndex = deg.indexOf(selectedDegree);
  const probability = probabilities[probabilityIndex];
  const randomDegree = selectedDegree;
  const fullRotations = 360 + randomDegree;
  const newRotation = currentRotation + fullRotations;
  currentRotation = newRotation;
  const wheel = document.getElementById("wheel");
  wheel.style.transform = `rotate(${newRotation}deg)`;
  const sectorAngle = 360 / prizes.length;
  const normalizedAngle = (360 - (newRotation % 360)) % 360;
  const winningIndex = Math.floor(normalizedAngle / sectorAngle);
  const prize = prizes[winningIndex];
  localStorage.setItem('prize', JSON.stringify(prize));
  setTimeout(() => {
    isSpinning = false;
  }, 4000);
}
function updateStats() {
  const stats = phoneStorage.getStats();
  document.getElementById("participantCount").textContent =
    stats.totalParticipants;
  document.getElementById("participantCount2").textContent =
    stats.totalParticipants;
  document.getElementById("prizesCount").textContent = stats.totalParticipants;
}
spinButton.addEventListener("click", () => {
  setTimeout(() => {
    spinWheel();
  }, 500);
  setTimeout(() => {
    location.href = "./index3.html";
  }, 8000);
});








