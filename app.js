const questions = [
    textAnswerEl.value = "";
  }

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

  if (userAnswer == q.answer) {
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

loadQuestion();

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW failed', err));
  });
}
