const main = document.querySelector(".main");
const typeArea = document.querySelector(".typingArea");
const btn = document.querySelector(".btn");

// word bank for random passages
const wordBank = [
  "programming", "developer", "JavaScript", "Python", "React", "machine",
  "learning", "artificial", "intelligence", "technology", "typing", "keyboard",
  "challenge", "project", "innovation", "practice", "problem", "solution",
  "computer", "science", "cloud", "data", "database", "performance", "speed",
  "accuracy", "system", "design", "network", "future", "digital", "world",
  "algorithm", "function", "variable", "loop", "condition", "frontend",
  "backend", "application", "engineer", "GitHub", "open", "source", "creative",
  "thinking", "error", "debugging", "testing", "collaboration", "teamwork",
  "career", "motivation", "success", "consistency"
];

const game = {
  start: 0,
  end: 0,
  user: "",
  arrText: "",
  mistakes: 0,
};

btn.addEventListener("click", () => {
  if (btn.textContent === "Start") {
    play();
    typeArea.value = "";
    typeArea.disabled = false;
    typeArea.focus();
  } else if (btn.textContent === "Done") {
    typeArea.disabled = true;
    main.style.borderColor = "white";
    end();
  }
});

// generate random passage
function generatePassage(minWords = 40, maxWords = 80) {
  let passageLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let passage = [];
  for (let i = 0; i < passageLength; i++) {
    let randWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    passage.push(randWord);
  }
  // make it look like sentences
  let text = passage.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

// Start game
function play() {
  let randText = generatePassage();
  main.textContent = randText;
  game.arrText = randText;
  main.style.borderColor = "#c8c8c8";
  btn.textContent = "Done";
  const duration = new Date();
  game.start = duration.getTime();
  game.mistakes = 0;
}

// End game
function end() {
  const duration = new Date();
  game.end = duration.getTime();
  const totalTime = (game.end - game.start) / 1000; // seconds
  game.user = typeArea.value;

  const correct = results();
  const accuracy = ((correct.score / correct.total) * 100).toFixed(2);
  const wpm = Math.round((game.user.split(" ").length / totalTime) * 60);
  const cpm = Math.round((game.user.length / totalTime) * 60);

  main.innerHTML = `
    <p><b>Time Taken:</b> ${totalTime.toFixed(2)} sec</p>
    <p><b>Correct Words:</b> ${correct.score} / ${correct.total}</p>
    <p><b>Mistakes:</b> ${game.mistakes}</p>
    <p><b>Accuracy:</b> ${accuracy}%</p>
    <p><b>WPM (Words Per Minute):</b> ${wpm}</p>
    <p><b>CPM (Characters Per Minute):</b> ${cpm}</p>
  `;

  btn.textContent = "Start";
}

// Check results
function results() {
  let valueOne = game.arrText.split(" ");
  let valueTwo = game.user.trim().split(" ");
  let score = 0;
  let mistakes = 0;

  valueOne.forEach((word, idx) => {
    if (word === valueTwo[idx]) {
      score++;
    } else if (valueTwo[idx] !== undefined) {
      mistakes++;
    }
  });

  if (valueTwo.length > valueOne.length) {
    mistakes += valueTwo.length - valueOne.length;
  }

  game.mistakes = mistakes;
  return { score, total: valueOne.length };
}
