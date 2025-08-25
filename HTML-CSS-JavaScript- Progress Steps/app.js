const progress = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const circles = document.querySelectorAll(".circle");
const steps = document.querySelectorAll(".step");
const summary = document.getElementById("summary");

let activeIndex = 1;

// Move to next step
nextBtn.addEventListener("click", () => {
  if (!validateStep(activeIndex)) return;

  activeIndex++;
  if (activeIndex > circles.length) {
    activeIndex = circles.length;
  }
  updateUI();
});

// Move to previous step
prevBtn.addEventListener("click", () => {
  activeIndex--;
  if (activeIndex < 1) {
    activeIndex = 1;
  }
  updateUI();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "Enter") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

// Update UI
function updateUI() {
  circles.forEach((circle, index) => {
    if (index < activeIndex) circle.classList.add("active");
    else circle.classList.remove("active");
  });

  steps.forEach((step, index) => {
    step.classList.toggle("active", index === activeIndex - 1);
  });

  const actives = document.querySelectorAll(".circle.active");
  progress.style.width =
    ((actives.length - 1) / (circles.length - 1)) * 100 + "%";

  prevBtn.disabled = activeIndex === 1;
  nextBtn.textContent =
    activeIndex === circles.length ? "Finish" : "Next";

  if (activeIndex === circles.length) {
    generateSummary();
  }
}

// Validate inputs before moving forward
function validateStep(stepIndex) {
  const currentStep = steps[stepIndex - 1];
  const inputs = currentStep.querySelectorAll("input[required]");
  for (let input of inputs) {
    if (!input.value.trim()) {
      input.style.borderColor = "red";
      input.focus();
      return false;
    } else {
      input.style.borderColor = "#ccc";
    }
  }
  return true;
}

// Show summary at final step
function generateSummary() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const newsletter = document.getElementById("newsletter").checked
    ? "Yes"
    : "No";
  const updates = document.getElementById("updates").checked
    ? "Yes"
    : "No";

  summary.innerHTML = `
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Username:</b> ${username}</p>
    <p><b>Newsletter:</b> ${newsletter}</p>
    <p><b>Product Updates:</b> ${updates}</p>
  `;
}
