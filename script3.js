function createConfetti() {
  const colors = [
    "#10B981",
    "#34D399",
    "#6EE7B7",
    "#A7F3D0",
    "#FBBF24",
    "#F59E0B",
  ];
  const confettiContainer = document.getElementById("prize");
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "12px";
    confetti.style.height = "12px";
    confetti.style.borderRadius = "2px";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-12px";
    confetti.style.pointerEvents = "none";
    confetti.style.animation = `confettiFall ${
      3 + Math.random() * 2
    }s ease-out ${Math.random() * 2}s forwards`;
    confettiContainer.appendChild(confetti);
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 5000);
  }
}
const style = document.createElement("style");
style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(400px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
document.addEventListener("DOMContentLoaded", () => {
    createConfetti();
    try {
      const stored = JSON.parse(localStorage.getItem('prize'));
      document.querySelector('h2').innerHTML = `Ваше бесплатное блюдо: <br> ${stored.name}`;
      document.querySelector('.food').src = `${stored.image}`;
      if (stored.probability == 'База') {
        document.querySelector('.badges').src = './img/one.webp';
      }
      if (stored.probability == 'Редкость') {
        document.querySelector('.badges').src = './img/two.webp';
      }
      if (stored.probability == 'Эпик') {
        document.querySelector('.badges').src = './img/three.webp';
      }
      if (stored.probability == 'Легенда') {
        document.querySelector('.badges').src = './img/four.webp';
      }
    } catch (error) {
      console.error("Ошибка чтения данных из localStorage:", error);
    }

});



function sendDataToGoogleSheet() {
  const phone = JSON.parse(localStorage.getItem('wheel-participants'));
  const userDataJSON = localStorage.getItem('prize');
  if (!userDataJSON) {
    console.error('empty');
    return;
  }
  const userData = JSON.parse(userDataJSON);
  const dataToSend = [phone[phone.length-1], userData.name, userData.probability, new Date().toLocaleString()]; 
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbweUzkcecVRv9Inn8k-MIAzDxYXVkQM6A6iahi1SO6fbor44NUjIcWJidRUOpV0lyfWTQ/exec';
  fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors', 
    headers: {
      'Content-Type': 'text/plain; charset=utf-8', 
    },
    body: JSON.stringify(dataToSend), 
  })
  .then(() => {
    console.log('success');
  })
  .catch((error) => {
    console.error('error', error);
  });
}
sendDataToGoogleSheet();

document.getElementById("submit").addEventListener("click", () => {
showToast(
        "Возьмите свое блюдо из холодильника","", "error");
});
function showToast(title, description, type = "info") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
                <div class="toast-title">${title}</div>
                ${
                  description
                    ? `<div class="toast-description">${description}</div>`
                    : ""
                }
            `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 4000);
}









