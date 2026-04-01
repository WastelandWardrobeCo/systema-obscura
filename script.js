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

/* =========================
   Systema Obscura Agent
========================= */

async function askSystemaObscura(message) {
  try {
    const response = await fetch('https://project-656dj.vercel.app/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (data.reply) return data.reply;
    if (data.error) return `Signal error: ${data.error}`;

    return 'Signal unclear.';
  } catch (error) {
    return 'Signal lost. Try again.';
  }
}

const soAgentInput = document.getElementById('soAgentInput');
const soAgentResponse = document.getElementById('soAgentResponse');
const soAgentLauncher = document.getElementById('soAgentLauncher');
const soAgentPanel = document.getElementById('soAgentPanel');
const soAgentClose = document.getElementById('soAgentClose');

if (soAgentLauncher && soAgentPanel) {
  soAgentLauncher.addEventListener('click', () => {
    const isOpen = soAgentPanel.classList.toggle('is-open');
    soAgentLauncher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    soAgentPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen && soAgentInput) {
      setTimeout(() => soAgentInput.focus(), 100);
    }
  });
}

if (soAgentClose && soAgentPanel && soAgentLauncher) {
  soAgentClose.addEventListener('click', () => {
    soAgentPanel.classList.remove('is-open');
    soAgentPanel.setAttribute('aria-hidden', 'true');
    soAgentLauncher.setAttribute('aria-expanded', 'false');
  });
}

if (soAgentInput && soAgentResponse) {
  soAgentInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;

    const message = soAgentInput.value.trim();
    if (!message) return;

    soAgentResponse.textContent = 'Reading the signal...';
    soAgentInput.value = '';

    const reply = await askSystemaObscura(message);
    soAgentResponse.textContent = reply;
  });
}
