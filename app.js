const navButton = document.querySelector('[data-menu-toggle]');
const backdrop = document.querySelector('[data-menu-close]');

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
