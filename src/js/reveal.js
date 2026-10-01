// Entradas discretas e rastros ciano de #about e do rodapé.
export function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));
}

const local = (rect, host) => ({
  left: rect.left - host.left,
  right: rect.right - host.left,
  top: rect.top - host.top,
  bottom: rect.bottom - host.top,
  midY: rect.top - host.top + rect.height / 2,
});

// #about: o traço acompanha a margem da foto e termina junto ao botão.
function aboutPath(svg) {
  const host = svg.parentElement;
  const h = host.getBoundingClientRect();
  const media = local(host.querySelector('.about__media').getBoundingClientRect(), h);
  const btn = local(host.querySelector('[data-about-target]').getBoundingClientRect(), h);
  const gap = 14;
  const r = 20;
  const x0 = media.left - gap;
  const y0 = media.top + (media.bottom - media.top) * 0.3;
  const yb = media.bottom + gap;

  if (btn.left > media.right) {
    // Corre por baixo da linha de chamada e termina sob o botão.
    const run = Math.max(yb, btn.bottom + 18);
    const ex = btn.left + (btn.right - btn.left) / 2;
    return { d: `M${x0} ${y0} V${run - r} Q${x0} ${run} ${x0 + r} ${run} H${ex}`, end: [ex, run] };
  }
  // Coluna única: desce pela margem até a altura do botão.
  return { d: `M${x0} ${y0} V${btn.midY}`, end: [x0, btn.midY] };
}

// Rodapé: o rastro corre pela linha superior e termina perto do logo.
function footerPath(svg) {
  const host = svg.parentElement;
  const h = host.getBoundingClientRect();
  const logo = local(host.querySelector('[data-footer-logo]').getBoundingClientRect(), h);
  const startX = h.width - Math.max(24, (h.width - Math.min(h.width, 1200)) / 2);
  const ex = logo.right + 14;
  const ey = logo.midY;
  const bend = Math.min(140, Math.max(60, (startX - ex) * 0.25));
  return { d: `M${startX} 0 H${ex + bend} C${ex + bend * 0.35} 0 ${ex + 8} ${ey * 0.35} ${ex} ${ey}`, end: [ex, ey] };
}

function setupTrace(svg, build) {
  const path = svg.querySelector('path');
  const dot = svg.querySelector('circle');
  const draw = () => {
    const { d, end } = build(svg);
    path.setAttribute('d', d);
    dot.setAttribute('cx', end[0]);
    dot.setAttribute('cy', end[1]);
  };
  draw();
  new ResizeObserver(draw).observe(svg.parentElement);
  document.fonts?.ready.then(draw);

  if (!('IntersectionObserver' in window)) return svg.classList.add('is-drawn');
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      svg.classList.add('is-drawn');
      io.disconnect();
    },
    { threshold: 0.35 },
  );
  io.observe(svg.parentElement);
}

export function initTraces() {
  const about = document.querySelector('[data-about-trace]');
  const footer = document.querySelector('[data-footer-trace]');
  if (about) setupTrace(about, aboutPath);
  if (footer) setupTrace(footer, footerPath);
}
