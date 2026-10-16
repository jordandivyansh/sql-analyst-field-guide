const navButton = document.querySelector('[data-menu-toggle]');
const backdrop = document.querySelector('[data-menu-close]');
const themeStorageKey = 'sql-guide:theme';
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');

function getInitialTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return themePreference.matches ? 'dark' : 'light';
}

function updateThemeControls(theme) {
  const dark = theme === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const label = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', `Switch to ${label.toLowerCase()}`);
    button.setAttribute('title', `Switch to ${label.toLowerCase()}`);
    button.setAttribute('aria-pressed', String(dark));
    button.querySelector('.theme-toggle__icon').textContent = dark ? '☀' : '☾';
    button.querySelector('.theme-toggle__label').textContent = label;
  });
}

function applyTheme(theme, remember = false) {
  document.documentElement.dataset.theme = theme;
  if (remember) localStorage.setItem(themeStorageKey, theme);
  updateThemeControls(theme);
}

function makeThemeButton(modifier = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `theme-toggle ${modifier}`.trim();
  button.dataset.themeToggle = '';
  button.innerHTML = '<span class="theme-toggle__icon" aria-hidden="true"></span><span class="theme-toggle__label"></span>';
  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
  return button;
}

const sidebar = document.querySelector('.sidebar');
const progressCard = document.querySelector('.progress-card');
if (sidebar && progressCard) sidebar.insertBefore(makeThemeButton('theme-toggle--sidebar'), progressCard);

const mobileBar = document.querySelector('.mobile-bar');
if (mobileBar && navButton) {
  const mobileActions = document.createElement('div');
  mobileActions.className = 'mobile-actions';
  mobileActions.append(makeThemeButton('theme-toggle--compact'), navButton);
  mobileBar.appendChild(mobileActions);
}

applyTheme(getInitialTheme());

themePreference.addEventListener('change', (event) => {
  if (!localStorage.getItem(themeStorageKey)) applyTheme(event.matches ? 'dark' : 'light');
});

navButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  navButton.setAttribute('aria-expanded', String(open));
});

backdrop?.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
  navButton?.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('pre').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-wrap';
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.type = 'button';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy SQL example');
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.innerText);
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy'; }, 1200);
  });
  wrapper.appendChild(button);
});

const checklistBoxes = [...document.querySelectorAll('.checklist input[type="checkbox"][data-key]')];
checklistBoxes.forEach((box) => {
  box.checked = localStorage.getItem(`sql-guide:${box.dataset.key}`) === '1';
  box.addEventListener('change', () => {
    localStorage.setItem(`sql-guide:${box.dataset.key}`, box.checked ? '1' : '0');
    updateProgress();
  });
});

function updateProgress() {
  const all = [...document.querySelectorAll('.checklist input[type="checkbox"][data-key]')];
  const siteKeys = [
    'basics-select', 'basics-null', 'query-filter', 'joins', 'aggregation',
    'subqueries', 'window', 'dbms', 'mysql', 'analytics', 'sql50', 'projects'
  ];
  const storedDone = siteKeys.filter((key) => localStorage.getItem(`sql-guide:${key}`) === '1').length;
  const localDone = all.filter((box) => box.checked).length;
  const done = Math.max(storedDone, localDone);
  const percent = Math.round((done / siteKeys.length) * 100);
  document.querySelectorAll('[data-progress-bar]').forEach((bar) => { bar.style.width = `${percent}%`; });
  document.querySelectorAll('[data-progress-text]').forEach((label) => { label.textContent = `${done}/${siteKeys.length}`; });
}
updateProgress();

const search = document.querySelector('[data-topic-search]');
const cards = [...document.querySelectorAll('[data-topic-card]')];
const count = document.querySelector('[data-result-count]');
search?.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matches = card.textContent.toLowerCase().includes(query) || (card.dataset.keywords || '').includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  if (count) count.textContent = `${visible} topic${visible === 1 ? '' : 's'}`;
});
