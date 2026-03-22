const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

const interactiveScreens = document.querySelectorAll('.channel-card, .artifact, .broadcast-panel');

interactiveScreens.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.setProperty('transform', 'translateY(-4px) scale(1.01)');
  });

  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('transform');
  });
});
