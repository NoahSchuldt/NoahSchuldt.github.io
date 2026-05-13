let questions = [];
let currentIndex = 0;
let selectedAnswer = null;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const textAnswerEl = document.getElementById("text-answer");
const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("next");
const feedbackEl = document.getElementById("feedback");

function renderLatex(element) {
  renderMathInElement(element, {
    delimiters: [
      { left: "$", right: "$", display: false },
      { left: "$$", right: "$$", display: true }
    ]
  });
}

async function loadQuestions() {

  try {

    const res = await fetch("./questions.json");

    questions = await res.json();

    loadQuestion();

  } catch (err) {

    questionEl.innerHTML = `
      Failed to load questions.
      <br>
      Try refreshing the page.
    `;

    console.error(err);
  }
}

function loadQuestion() {

  const q = questions[currentIndex];

  questionEl.innerHTML = q.question;

  answersEl.innerHTML = "";

  feedbackEl.innerHTML = "";

  selectedAnswer = null;

  if (q.type === "multiple") {

    textAnswerEl.style.display = "none";

    q.options.forEach(option => {

      const btn = document.createElement("button");

      btn.innerHTML = option;

      btn.onclick = () => {

        selectedAnswer = option;

        document
          .querySelectorAll("#answers button")
          .forEach(b => b.classList.remove("selected"));

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

    feedbackEl.textContent = "Bitte eine Antwort eingeben.";

    return;
  }

  if (
    userAnswer === q.answer ||
    userAnswer === q.answer.replace(/\$/g, "")
  ) {

    feedbackEl.innerHTML = "Correct!";

  } else {

    feedbackEl.innerHTML =
      `Wrong! Richtige Antwort: ${q.answer}`;

    renderLatex(feedbackEl);
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

    feedbackEl.innerHTML = "";

  } else {

    loadQuestion();
  }
};

loadQuestions();

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker.register("./sw.js");

  });
}
//test
