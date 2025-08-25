const container = document.getElementById('imageContainer');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const captionText = document.getElementById("caption");
const closeModal = document.getElementsByClassName("close")[0];
const downloadBtn = document.getElementById("downloadBtn");
const likeBtn = document.getElementById("likeBtn");

let currentImg = '';
let likedImages = JSON.parse(localStorage.getItem("likedImages")) || [];

let category = "nature"; // default category
let page = 1;

// Fetch random images
async function loadImages() {
  for (let i = 0; i < 9; i++) {
    const img = document.createElement("img");
    img.src = `https://source.unsplash.com/400x400/?${category}&sig=${Math.random()}`;
    img.alt = category;
    img.addEventListener("click", () => openModal(img.src, category));
    container.appendChild(img);
  }
}

// Open Modal
function openModal(src, caption) {
  modal.style.display = "block";
  modalImg.src = src;
  captionText.innerText = caption;
  currentImg = src;
}

// Close modal
closeModal.onclick = () => modal.style.display = "none";

// Download Image
downloadBtn.onclick = () => {
  const a = document.createElement("a");
  a.href = currentImg;
  a.download = "downloaded_image.jpg";
  a.click();
};

// Like Image
likeBtn.onclick = () => {
  if (!likedImages.includes(currentImg)) {
    likedImages.push(currentImg);
    localStorage.setItem("likedImages", JSON.stringify(likedImages));
    alert("Image Liked ❤️");
  } else {
    alert("Already Liked!");
  }
};

// Infinite Scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    loadImages();
  }
});

// Search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    category = searchInput.value || "nature";
    container.innerHTML = "";
    loadImages();
  }
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀ Light Mode" : "🌙 Dark Mode";
});

// Initial Load
loadImages();
