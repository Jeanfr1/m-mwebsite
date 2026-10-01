// Header fixo: menu mobile, tema conforme a seção sob ele (logo branco no navy,
// azul no claro) e link ativo.
export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const toggle = header.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = [...header.querySelectorAll('.nav__link')];

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    header.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));

  const sections = [...document.querySelectorAll('main section[data-theme]:not([hidden]), footer[data-theme]')];
  const hero = document.getElementById('hero');
  const wave = hero.querySelector('.hero__wave');
  let ticking = false;

  const update = () => {
    ticking = false;
    const line = header.offsetHeight / 2;
    const current =
      sections.find((el) => {
        const r = el.getBoundingClientRect();
        // A onda branca no pé do hero já pertence ao fundo claro.
        const bottom = el === hero ? r.bottom - wave.offsetHeight * 0.6 : r.bottom;
        return r.top <= line && bottom > line;
      }) ?? sections[0];
    const heroTop = current === hero && hero.getBoundingClientRect().top > -2;
    header.dataset.theme = current.dataset.theme;
    header.classList.toggle('is-solid', !heroTop);
    // Link ativo: a seção que ocupa a faixa logo abaixo do header.
    const probe = header.offsetHeight + window.innerHeight * 0.2;
    const reading = sections.find((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    links.forEach((a) => a.classList.toggle('is-active', a.hash === `#${reading?.id}`));
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
