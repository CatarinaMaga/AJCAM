const flowData = {
  detectar: {
    image: 'assets/demo-cameras.jpg', alt: 'Tela de câmeras do Argos EPI', kicker: 'VISÃO COMPUTACIONAL',
    title: 'Pessoas e EPIs são identificados no vídeo.',
    text: 'O sistema recebe a imagem da câmera, encontra cada pessoa e relaciona os equipamentos visíveis às regiões corretas do corpo.'
  },
  comparar: {
    image: 'assets/demo-epis.jpg', alt: 'Tela de configuração dos EPIs no Argos EPI', kicker: 'REGRAS CONTEXTUAIS',
    title: 'O resultado é comparado às exigências da área.',
    text: 'Cada área monitorada pode exigir equipamentos diferentes. O Argos considera esse contexto antes de classificar a situação.'
  },
  alertar: {
    image: 'assets/demo-tv-alerta.jpg', alt: 'TV de avisos do Argos EPI com alerta vermelho de falta de EPI', kicker: 'RESPOSTA IMEDIATA',
    title: 'A possível ausência vira um alerta claro.',
    text: 'O painel destaca a pessoa e o item não identificado. A TV de avisos pode reforçar a comunicação com sinal visual e voz.'
  },
  registrar: {
    image: 'assets/demo-historico.jpg', alt: 'Histórico individual do Argos EPI com número de violações e gráficos por dia', kicker: 'HISTÓRICO AUDITÁVEL',
    title: 'O evento alimenta acompanhamento e prevenção.',
    text: 'Ocorrências, evidências mínimas e tratativas ajudam a observar tendências e orientar ações preventivas, sempre com conferência humana.'
  }
};

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const menuLabel = document.querySelector('[data-menu-label]');
const setMenu = open => {
  menuButton?.setAttribute('aria-expanded', String(open));
  if (menuLabel) menuLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
  nav?.classList.toggle('is-open', open);
  header.classList.toggle('menu-is-open', open);
  document.body.classList.toggle('menu-open', open);
};

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
    setMenu(false);
    menuButton?.focus();
  }
});
// Ao girar o celular ou alargar a janela, o menu móvel não pode ficar aberto por baixo do menu de desktop
window.matchMedia('(min-width: 861px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const updateFlow = key => {
  const data = flowData[key];
  if (!data) return;
  const image = document.querySelector('[data-flow-image]');
  image.src = data.image;
  image.alt = data.alt;
  document.querySelector('[data-flow-kicker]').textContent = data.kicker;
  document.querySelector('[data-flow-title]').textContent = data.title;
  document.querySelector('[data-flow-text]').textContent = data.text;
  document.querySelector('.flow-panel')?.animate([{ opacity: .35, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
};

document.querySelectorAll('[data-flow]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-flow]').forEach(item => {
    item.classList.remove('is-active');
    item.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('is-active');
  tab.setAttribute('aria-selected', 'true');
  updateFlow(tab.dataset.flow);
}));

const scene = document.querySelector('.simulator-scene');
const personB = document.querySelector('[data-person-b]');
const simDescription = document.querySelector('[data-sim-description]');
const eventStatus = document.querySelector('[data-event-status]');
const eventTitle = document.querySelector('[data-event-title]');
const eventCount = document.querySelector('[data-event-count]');
const eventLog = document.querySelector('[data-event-log]');
const toast = document.querySelector('[data-toast]');
let alertActive = false;
let toastTimer;

const showToast = (message, type = 'safe') => {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle('is-alert', type === 'alert');
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
};

const addLog = (title, detail, alert = false) => {
  const item = document.createElement('li');
  item.className = 'is-new';
  const time = document.createElement('time');
  time.textContent = 'AGORA';
  const copy = document.createElement('span');
  const strong = document.createElement('b');
  strong.textContent = title;
  copy.append(strong, document.createTextNode(detail));
  item.append(time, copy);
  eventLog.prepend(item);
  while (eventLog.children.length > 4) eventLog.lastElementChild.remove();
  eventCount.textContent = String(eventLog.children.length).padStart(2, '0');
  if (alert) time.style.color = 'var(--red)';
};

document.querySelector('[data-remove-epi]')?.addEventListener('click', () => {
  if (alertActive) {
    showToast('O alerta já está ativo nesta simulação.', 'alert');
    return;
  }
  alertActive = true;
  scene.classList.add('is-alert');
  personB.classList.remove('is-safe');
  personB.classList.add('is-alert');
  personB.querySelector('b').textContent = 'FALTA CAPACETE';
  simDescription.textContent = 'Possível ausência identificada na Pessoa 02.';
  eventStatus.classList.remove('is-safe');
  eventStatus.classList.add('is-alert');
  eventStatus.querySelector('.event-status-icon').textContent = '!';
  eventTitle.textContent = 'Ação necessária';
  addLog('Possível falta de EPI', 'Pessoa 02 · capacete não identificado', true);
  showToast('Alerta gerado: capacete não identificado na Pessoa 02.', 'alert');
});

document.querySelector('[data-reset-epi]')?.addEventListener('click', () => {
  if (!alertActive) {
    showToast('A simulação já está no estado seguro.');
    return;
  }
  alertActive = false;
  scene.classList.remove('is-alert');
  personB.classList.remove('is-alert');
  personB.classList.add('is-safe');
  personB.querySelector('b').textContent = 'SEGURO';
  simDescription.textContent = 'Todos os EPIs exigidos foram identificados.';
  eventStatus.classList.remove('is-alert');
  eventStatus.classList.add('is-safe');
  eventStatus.querySelector('.event-status-icon').textContent = '✓';
  eventTitle.textContent = 'Operação segura';
  addLog('Conformidade restabelecida', 'Capacete identificado na Pessoa 02');
  showToast('Estado seguro restabelecido.');
});

const navSections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${visible.target.id}`));
}, { threshold: [0.25, 0.55], rootMargin: '-20% 0px -55%' });
navSections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => showToast('Reproduzindo a apresentação do Argos EPI.'));
});

