const heartContainers = document.querySelectorAll(".heart-container");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiPieces = [];

// Generate floating emoji
function spawnEmoji(container) {
  const emoji = document.createElement("div");
  emoji.classList.add("floating");
  emoji.innerText = Math.random() > 0.5 ? "❤️" : "💫";
  container.appendChild(emoji);

  setTimeout(() => emoji.remove(), 2000);
}

// Confetti explosion
function spawnConfetti(x, y) {
  for (let i = 0; i < 30; i++) {
    confettiPieces.push({
      x,
      y,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * -6,
      gravity: 0.2,
    });
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p, index) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.speedY += p.gravity;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    if (p.y > confettiCanvas.height) confettiPieces.splice(index, 1);
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// Like system
heartContainers.forEach((container, index) => {
  const grayHeart = container.querySelector(".gray-heart");
  const redHeart = container.querySelector(".red-heart");
  const likeCountEl = container.parentElement.querySelector(".like-count");

  let liked = false;
  let likeCount = 0;

  // Restore state from localStorage
  const savedState = JSON.parse(localStorage.getItem(`like-${index}`));
  if (savedState) {
    liked = savedState.liked;
    likeCount = savedState.count;
    if (liked) redHeart.classList.add("active");
    likeCountEl.textContent = `${likeCount} Likes`;
  }

  container.addEventListener("click", (e) => {
    const rect = container.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!liked) {
      redHeart.classList.add("active");
      likeCount++;
      spawnEmoji(container);
      spawnConfetti(x, y);
    } else {
      redHeart.classList.remove("active");
      likeCount = Math.max(0, likeCount - 1);
    }

    liked = !liked;
    likeCountEl.textContent = `${likeCount} Likes`;

    // Save state
    localStorage.setItem(
      `like-${index}`,
      JSON.stringify({ liked, count: likeCount })
    );
  });
});
