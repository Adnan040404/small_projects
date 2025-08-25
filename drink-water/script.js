const cupsContainer = document.getElementById('cups');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');
const motivation = document.getElementById('motivation');
const historyList = document.getElementById('history');
const resetBtn = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');
const goalInput = document.getElementById('goal');
const setGoalBtn = document.getElementById('set-goal');

let dailyGoal = localStorage.getItem('goal') || 2; // liters
let consumed = JSON.parse(localStorage.getItem('consumed')) || 0;

init();

// Generate cups dynamically
function init() {
  cupsContainer.innerHTML = '';
  for (let i = 0; i < dailyGoal * 4; i++) {
    const cup = document.createElement('div');
    cup.classList.add('cup-small');
    cup.innerText = '250ml';
    cup.addEventListener('click', () => drinkWater(250));
    cupsContainer.appendChild(cup);
  }
  updateBigCup();
  loadHistory();
}

// Drink water
function drinkWater(amount) {
  consumed += amount;
  if (consumed > dailyGoal * 1000) consumed = dailyGoal * 1000;
  localStorage.setItem('consumed', consumed);
  updateBigCup();
}

// Update big cup
function updateBigCup() {
  const total = dailyGoal * 1000;
  const percent = (consumed / total) * 100;

  if (consumed === 0) {
    percentage.style.height = 0;
    percentage.innerText = '';
  } else {
    percentage.style.height = `${(percent / 100) * 330}px`;
    percentage.innerText = `${Math.floor(percent)}%`;
  }

  if (consumed === total) {
    remained.style.visibility = 'hidden';
    motivate("🎉 Goal Achieved! Stay Hydrated!");
    saveHistory();
  } else {
    remained.style.visibility = 'visible';
    liters.innerText = `${((total - consumed) / 1000).toFixed(2)}L`;
    motivate(getMotivation(percent));
  }
}

// Motivation messages
function getMotivation(percent) {
  if (percent === 0) return "Let's start drinking 💧";
  if (percent < 25) return "Keep going, your body thanks you 🙌";
  if (percent < 50) return "Halfway there! 🚀";
  if (percent < 75) return "Almost done, don’t stop now 💪";
  return "Just one last push! 🌊";
}

function motivate(msg) {
  motivation.innerText = msg;
}

// History
function saveHistory() {
  let history = JSON.parse(localStorage.getItem('history')) || [];
  const today = new Date().toLocaleDateString();
  if (!history.find(h => h.date === today)) {
    history.push({ date: today, goal: dailyGoal, consumed });
    if (history.length > 7) history.shift();
    localStorage.setItem('history', JSON.stringify(history));
  }
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  historyList.innerHTML = '';
  history.forEach(h => {
    const li = document.createElement('li');
    li.textContent = `${h.date}: ${h.consumed/1000}L / ${h.goal}L`;
    historyList.appendChild(li);
  });
}

// Reset
resetBtn.addEventListener('click', () => {
  consumed = 0;
  localStorage.setItem('consumed', 0);
  updateBigCup();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Set new goal
setGoalBtn.addEventListener('click', () => {
  dailyGoal = goalInput.value || 2;
  localStorage.setItem('goal', dailyGoal);
  consumed = 0;
  localStorage.setItem('consumed', 0);
  init();
});
