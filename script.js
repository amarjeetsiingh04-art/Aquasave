
/* =====================================
   AQUASAVE - COMPLETE JAVASCRIPT
===================================== */


/* PAGE NAVIGATION */

const pageOrder = [
  "home",
  "about",
  "gallery",
  "tips",
  "facts",
  "calculator",
  "quiz",
  "contact"
];

function showPage(pageName) {
  const selectedPage = document.getElementById(pageName);
  if (!selectedPage) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.add("hidden");
  });

  selectedPage.classList.remove("hidden");

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.page === pageName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function getCurrentPageIndex() {
  return pageOrder.findIndex(id => {
    const page = document.getElementById(id);
    return page && !page.classList.contains("hidden");
  });
}

function nextPage() {
  const current = getCurrentPageIndex();

  if (current >= 0 && current < pageOrder.length - 1) {
    showPage(pageOrder[current + 1]);
  } else if (current === pageOrder.length - 1) {
    showPage("home");
  }
}

function previousPage() {
  const current = getCurrentPageIndex();

  if (current > 0) {
    showPage(pageOrder[current - 1]);
  }
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});


/* =====================================
   PREMIUM CURSOR TRAIL
===================================== */

if (window.matchMedia("(pointer: fine)").matches) {

  const cursor = document.querySelector(".cursor-trail");
  const trailElements = document.querySelectorAll(".cursor-line");

  if (cursor && trailElements.length) {

    const trails = Array.from(trailElements).map(element => ({
      element,
      x: 0,
      y: 0
    }));

    let mouseX = 0;
    let mouseY = 0;
    let started = false;

    document.addEventListener("mousemove", event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";

      if (!started) {
        trails.forEach(trail => {
          trail.x = mouseX;
          trail.y = mouseY;
        });

        started = true;
      }
    });

    function animateCursor() {
      if (started) {
        let previousX = mouseX;
        let previousY = mouseY;

        trails.forEach((trail, index) => {

          trail.x += (previousX - trail.x) * 0.35;
          trail.y += (previousY - trail.y) * 0.35;

          const dx = previousX - trail.x;
          const dy = previousY - trail.y;

          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          trail.element.style.width = length + "px";
          trail.element.style.left = trail.x + "px";
          trail.element.style.top = trail.y + "px";

          trail.element.style.transform =
            `rotate(${angle}rad)`;

          trail.element.style.opacity =
            String(0.8 * (1 - index / trails.length));

          previousX = trail.x;
          previousY = trail.y;
        });
      }

      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }
}


/* =====================================
   WATER CALCULATOR
===================================== */

function calculateWater() {

  const people = Number(document.getElementById("people").value);
  const minutes = Number(document.getElementById("minutes").value);
  const flow = Number(document.getElementById("flow").value);

  const result = document.getElementById("result");

  if (
    !Number.isFinite(people) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(flow) ||
    people < 1 ||
    minutes < 1 ||
    flow < 1
  ) {
    result.textContent = "Please enter valid positive numbers.";
    return;
  }

  const daily = people * minutes * flow;
  const weekly = daily * 7;
  const monthly = daily * 30;

  result.innerHTML = `
    <h3>Estimated Water Usage</h3>
    <p>Daily: <strong>${daily.toLocaleString()} litres</strong></p>
    <p>Weekly: <strong>${weekly.toLocaleString()} litres</strong></p>
    <p>Monthly: <strong>${monthly.toLocaleString()} litres</strong></p>
    <p>Try reducing shower time to save water.</p>
  `;
}


/* =====================================
   WATER CONSERVATION QUIZ
===================================== */

const questions = [
  {
    question: "Which habit helps save water?",
    options: [
      "Leaving taps running",
      "Turning off taps while brushing",
      "Taking longer showers",
      "Washing one item at a time"
    ],
    answer: 1
  },
  {
    question: "What is rainwater harvesting?",
    options: [
      "Collecting and storing rainwater",
      "Wasting rainwater",
      "Polluting rivers",
      "Heating seawater"
    ],
    answer: 0
  },
  {
    question: "Which is a major source of freshwater?",
    options: [
      "Glaciers and ice caps",
      "Plastic bottles",
      "Petrol",
      "Smoke"
    ],
    answer: 0
  },
  {
    question: "When is a good time to water garden plants?",
    options: [
      "At midday in strong sunlight",
      "Early morning",
      "During strong winds",
      "Whenever a hose is left running"
    ],
    answer: 1
  },
  {
    question: "Why should we protect rivers?",
    options: [
      "They support people and ecosystems",
      "They create plastic",
      "They waste all water",
      "They are not useful"
    ],
    answer: 0
  },
  {
    question: "Which method can reduce irrigation water loss?",
    options: [
      "Drip irrigation",
      "Leaving pipes leaking",
      "Flooding every field",
      "Watering roads"
    ],
    answer: 0
  },
  {
    question: "What should you do if you see a leaking tap?",
    options: [
      "Ignore it",
      "Report it and arrange repair",
      "Open it more",
      "Waste more water"
    ],
    answer: 1
  },
  {
    question: "Which process is part of the water cycle?",
    options: [
      "Evaporation",
      "Burning plastic",
      "Mining",
      "Rusting"
    ],
    answer: 0
  },
  {
    question: "Why is freshwater important?",
    options: [
      "For drinking and ecosystems",
      "Only for decoration",
      "For making smoke",
      "It has no purpose"
    ],
    answer: 0
  },
  {
    question: "What is the best way to conserve water?",
    options: [
      "Use it responsibly every day",
      "Leave every tap open",
      "Pollute lakes",
      "Waste clean water"
    ],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let quizFinished = false;

function loadQuestion() {

  const q = questions[currentQuestion];

  document.getElementById("question").textContent = q.question;

  document.getElementById("quiz-progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  document.getElementById("quiz-progress-bar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  document.getElementById("quiz-result").textContent = "";

  const nextButton = document.getElementById("next-btn");

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "See My Score →"
      : "Next Question →";

  nextButton.onclick = nextQuestion;

  const options = document.getElementById("options");

  options.innerHTML = "";
  answered = false;

  q.options.forEach((option, index) => {

    const button = document.createElement("button");

    button.textContent = option;

    button.addEventListener("click", () => {

      if (answered) return;

      answered = true;

      if (index === q.answer) {
        score++;

        document.getElementById("quiz-result").textContent =
          "Correct answer. Well done!";
      } else {
        document.getElementById("quiz-result").textContent =
          "Not quite. The correct answer is highlighted.";
      }

      options.querySelectorAll("button").forEach((btn, i) => {

        btn.disabled = true;

        if (i === q.answer) {
          btn.style.borderColor = "#36e6a0";
          btn.style.background = "#174b43";
        } else if (i === index) {
          btn.style.borderColor = "#e66b7b";
        }

      });

    });

    options.appendChild(button);

  });
}

function nextQuestion() {

  if (quizFinished) {
    restartQuiz();
    return;
  }

  if (!answered) {
    document.getElementById("quiz-result").textContent =
      "Please select an answer first.";
    return;
  }

  if (currentQuestion === questions.length - 1) {
    showQuizScore();
    return;
  }

  currentQuestion++;
  loadQuestion();
}

function showQuizScore() {

  quizFinished = true;

  document.getElementById("question").textContent =
    "Quiz completed.";

  document.getElementById("options").innerHTML = "";

  document.getElementById("quiz-progress").textContent =
    `Final score: ${score} / ${questions.length}`;

  document.getElementById("quiz-progress-bar").style.width = "100%";

  document.getElementById("quiz-result").textContent =
    score >= 8
      ? "Excellent! You are a Water Conservation Champion."
      : score >= 5
      ? "Good work! Keep learning about water conservation."
      : "Keep practising. Every new fact helps protect water.";

  const nextButton = document.getElementById("next-btn");

  nextButton.textContent = "Restart Quiz ↻";
  nextButton.onclick = restartQuiz;
}

function restartQuiz() {

  currentQuestion = 0;
  score = 0;
  answered = false;
  quizFinished = false;

  loadQuestion();
}


/* =====================================
   CONTACT FORM
===================================== */

function submitContact(event) {

  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) return;

  document.getElementById("contact-result").textContent =
    `Thank you, ${name}. Your message has been noted.`;

  event.target.reset();
}


/* =====================================
   INITIALIZE WEBSITE
===================================== */

loadQuestion();
showPage("home");

function calculateHomeWater() {
  const people = Number(document.getElementById("homePeople").value);
  const minutes = Number(document.getElementById("homeMinutes").value);
  const flow = Number(document.getElementById("homeFlow").value);
  const result = document.getElementById("homeResult");

  if (
    !Number.isFinite(people) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(flow) ||
    people < 1 ||
    minutes < 1 ||
    flow < 1
  ) {
    result.textContent = "Please enter valid positive numbers.";
    return;
  }

  const daily = people * minutes * flow;

  result.innerHTML = `
    <h3>Your Estimated Water Usage</h3>
    <p>Daily: <strong>${daily.toLocaleString()} litres</strong></p>
    <p>Monthly: <strong>${(daily * 30).toLocaleString()} litres</strong></p>
    <p>Yearly: <strong>${(daily * 365).toLocaleString()} litres</strong></p>
  `;
}
// GLOWING CURSOR ANIMATION
const glowCursor = document.getElementById("glowCursor");

if (glowCursor && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", (e) => {
    glowCursor.style.left = e.clientX + "px";
    glowCursor.style.top = e.clientY + "px";
  });

  document.addEventListener("mousedown", () => {
    glowCursor.classList.add("active");
  });

  document.addEventListener("mouseup", () => {
    glowCursor.classList.remove("active");
  });
}
/* =====================================
   AQUASAVE 7 DAYS WATER CHALLENGE
===================================== */

(function () {

  const STORAGE_KEY = "aquasaveChallengeV1";

  const checks = document.querySelectorAll(
    "#water-challenge .challenge-check"
  );

  if (!checks.length) return;

  const pointsElement = document.getElementById("challengePoints");
  const countElement = document.getElementById("challengeCount");
  const percentElement = document.getElementById("challengePercent");
  const levelElement = document.getElementById("challengeLevel");
  const messageElement = document.getElementById("challengeMessage");
  const successElement = document.getElementById("challengeSuccess");
  const progressBar = document.getElementById("challengeBar");

  function saveProgress() {
    try {
      const completed = Array.from(checks).map(check => check.checked);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch (error) {
      console.warn("Challenge progress could not be saved.", error);
    }
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (Array.isArray(saved)) {
        checks.forEach((check, index) => {
          check.checked = saved[index] === true;
        });
      }
    } catch (error) {
      console.warn("Challenge progress could not be loaded.", error);
    }
  }

  function updateChallenge() {

    const completed = Array.from(checks)
      .filter(check => check.checked).length;

    const total = checks.length;
    const points = completed * 10;
    const percentage = Math.round((completed / total) * 100);

    pointsElement.textContent = points;
    countElement.textContent = `${completed}/${total}`;
    percentElement.textContent = `${percentage}%`;

    progressBar.style.width = `${percentage}%`;

    if (completed === 0) {
      levelElement.textContent = "🌱 Beginner";
      messageElement.textContent =
        "💧 Start your water-saving journey!";
      successElement.textContent =
        "🌍 Every drop counts!";
    } else if (completed <= 2) {
      levelElement.textContent = "🌱 Beginner";
      messageElement.textContent =
        "✨ Great start! Keep completing your missions.";
      successElement.textContent =
        "💧 Small actions make a big difference!";
    } else if (completed <= 4) {
      levelElement.textContent = "💧 Water Saver";
      messageElement.textContent =
        "👏 You're building excellent water-saving habits!";
      successElement.textContent =
        "🌊 You're making progress!";
    } else if (completed <= 6) {
      levelElement.textContent = "🏅 Water Champion";
      messageElement.textContent =
        "🔥 Almost there! Just a few missions left.";
      successElement.textContent =
        "🌍 Your actions help protect our planet!";
    } else {
      levelElement.textContent = "🏆 Water Hero";
      messageElement.textContent =
        "🎉 All seven missions completed!";
      successElement.textContent =
        "🏆 Congratulations! You're a Water Hero!";
    }

    saveProgress();
  }

  checks.forEach(check => {
    check.addEventListener("change", updateChallenge);
  });

  window.resetWaterChallenge = function () {

    const shouldReset = window.confirm(
      "Are you sure you want to reset your challenge progress?"
    );

    if (!shouldReset) return;

    checks.forEach(check => {
      check.checked = false;
    });

    updateChallenge();
  };

  loadProgress();
  updateChallenge();

})();