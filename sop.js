document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".sop-hero__screen");
  const statuses = document.querySelectorAll(".transmission-card__status, .transmission-meta");

  function softHeroFlicker() {
    if (!hero) return;

    hero.style.filter = "brightness(1.025)";
    setTimeout(() => {
      hero.style.filter = "brightness(0.985)";
      setTimeout(() => {
        hero.style.filter = "";
      }, 70);
    }, 60);
  }

  function softStatusBlink() {
    if (!statuses.length) return;

    const target = statuses[Math.floor(Math.random() * statuses.length)];
    target.style.opacity = "0.25";

    setTimeout(() => {
      target.style.opacity = "0.78";
      setTimeout(() => {
        target.style.opacity = "";
      }, 90);
    }, 70);
  }

  function randomLoop(fn, minDelay, maxDelay) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(() => {
      fn();
      randomLoop(fn, minDelay, maxDelay);
    }, delay);
  }

  randomLoop(softHeroFlicker, 9000, 16000);
  randomLoop(softStatusBlink, 5000, 11000);
});