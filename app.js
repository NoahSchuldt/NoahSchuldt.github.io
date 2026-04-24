let questions = [];
let currentIndex = 0;
let selectedAnswer = null;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const textAnswerEl = document.getElementById("text-answer");
const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("next");
const feedbackEl = document.getElementById("feedback");

// Render LaTeX
function renderLatex(element) {
  renderMathInElement(element, {
    delimiters: [
      { left: "$", right: "$", display: false },
      { left: "$$", right: "$$", display: true }
    ]
  });
}

// Load questions from JSON
async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    questions = await res.json();
    loadQuestion();
  } catch (err) {
    questionEl.textContent = "Failed to load questions.";
    console.error(err);
  }
}

function loadQuestion() {
  const q = questions[currentIndex];

  questionEl.innerHTML = q.question;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";
  selectedAnswer = null;

  if (q.type === "multiple") {
    textAnswerEl.style.display = "none";

    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.innerHTML = option;

      btn.onclick = () => {
        selectedAnswer = option;
        document.querySelectorAll("#answers button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };

      answersEl.appendChild(btn);
      renderLatex(btn);
    });

  } else {
    textAnswerEl.style.display = "block";
    textAnswerEl.value = "";
  }

  renderLatex(questionEl);

  submitBtn.style.display = "inline";
  nextBtn.style.display = "none";
}

submitBtn.onclick = () => {
  const q = questions[currentIndex];
  let userAnswer;

  if (q.type === "multiple") {
    userAnswer = selectedAnswer;
  } else {
    userAnswer = textAnswerEl.value.trim();
  }

  if (!userAnswer) {
    feedbackEl.textContent = "Please provide an answer.";
    return;
  }

  if (userAnswer == q.answer || userAnswer == q.answer.replace(/\$/g, "")) {
    feedbackEl.textContent = "Correct!";
  } else {
    feedbackEl.textContent = `Wrong! Correct answer: ${q.answer}`;
  }

  submitBtn.style.display = "none";
  nextBtn.style.display = "inline";
};

nextBtn.onclick = () => {
  currentIndex++;

  if (currentIndex >= questions.length) {
    questionEl.textContent = "Finished!";
    answersEl.innerHTML = "";
    textAnswerEl.style.display = "none";
    submitBtn.style.display = "none";
    nextBtn.style.display = "none";
    feedbackEl.textContent = "";
  } else {
    loadQuestion();
  }
};

// Init
loadQuestions();

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW failed', err));
  });
}
