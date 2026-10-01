import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import floorSrc from '../assets/room/layer-floor.webp';
import architectureSrc from '../assets/room/layer-architecture.webp';
import rugSrc from '../assets/room/layer-rug.webp';
import sofaSrc from '../assets/room/layer-sofa.webp';
import tableSrc from '../assets/room/layer-table.webp';
import ceilingSrc from '../assets/room/layer-ceiling.webp';

gsap.registerPlugin(ScrollTrigger);

// Camadas de trás para a frente (ordem do manifest). scale/x/y posicionam cada PNG
// sobre a sala montada, em frações do palco, com transform-origin no canto superior
// esquerdo; foram medidos por registro de imagem contra 01-room-assembled.
// lift = deslocamento vertical no estado em suspensão.
const LAYERS = [
  { id: 'floor', src: floorSrc, scale: 0.995, x: 0.0026, y: 0.0009, lift: 0.2, out: 28, back: 71 },
  { id: 'architecture', src: architectureSrc, scale: 0.845, x: 0.0788, y: 0.0877, lift: -0.09, out: 24, back: 75 },
  { id: 'rug', src: rugSrc, scale: 0.8, x: 0.125, y: 0.09, lift: 0.085, out: 30, back: 72 },
  { id: 'sofa', src: sofaSrc, scale: 0.615, x: 0.2381, y: 0.3034, lift: -0.015, out: 27, back: 74 },
  { id: 'table', src: tableSrc, scale: 0.33, x: 0.3846, y: 0.4869, lift: 0.035, out: 29, back: 73 },
  { id: 'ceiling', src: ceilingSrc, scale: 0.695, x: 0.1609, y: 0.121, lift: -0.24, out: 17, back: 76 },
];

// Rastro luminoso no estado em suspensão (viewBox 1000 × 1000 do palco): sai do
// teto ("Surfaces"), contorna o sofá ("Corners") e termina no piso ("Finishing touches").
const TRAIL = 'M 200 72 C 70 190, 40 430, 200 590 C 330 690, 640 700, 860 610 C 1010 560, 1040 820, 900 900 C 830 950, 780 980, 760 1010';
const LABEL_AT = [55.5, 61.5, 67];

const MOTION_QUERY = '(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';

export function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  ScrollTrigger.config({ ignoreMobileResize: true });

  const mm = gsap.matchMedia();
  mm.add(MOTION_QUERY, () => {
    document.documentElement.classList.add('motion-hero');
    const removeListeners = setupHero(hero);
    return () => {
      removeListeners();
      document.documentElement.classList.remove('motion-hero');
    };
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function setupHero(hero) {
  const stage = hero.querySelector('[data-stage]');
  const mover = stage.querySelector('[data-stage-mover]');
  const camera = stage.querySelector('[data-stage-camera]');
  const assembled = stage.querySelector('[data-stage-assembled]');
  const layersWrap = stage.querySelector('[data-stage-layers]');
  const trail = [...stage.querySelectorAll('[data-stage-trail] path')];
  const labels = [...stage.querySelectorAll('[data-stage-label]')];
  const count = hero.querySelector('[data-hero-count]');
  const bars = [...hero.querySelectorAll('.hero__bars i')];
  const approach = document.getElementById('approach');
  const slot = approach.querySelector('[data-approach-slot]');
  const slotRoom = approach.querySelector('[data-approach-room]');

  // As camadas só são baixadas no desktop com movimento; até decodificarem,
  // a sala montada continua visível (regra .is-ready no CSS).
  if (!layersWrap.childElementCount) {
    for (const layer of LAYERS) {
      const img = new Image();
      img.src = layer.src;
      img.alt = '';
      img.decoding = 'async';
      img.className = `layer-${layer.id}`;
      layersWrap.append(img);
    }
    Promise.all([...layersWrap.children].map((img) => img.decode().catch(() => {}))).then(() => stage.classList.add('is-ready'));
  }
  const imgs = [...layersWrap.children];

  trail.forEach((path) => {
    path.setAttribute('d', TRAIL);
    path.setAttribute('pathLength', '1');
  });
  gsap.set(trail, { strokeDasharray: 1, strokeDashoffset: 1 });
  LAYERS.forEach((layer, i) => {
    gsap.set(imgs[i], { xPercent: layer.x * 100, yPercent: layer.y * 100, scale: layer.scale, transformOrigin: '0 0' });
  });

  const setProgress = (p) => {
    const phases = [
      [0, 0.4],
      [0.4, 0.7],
      [0.7, 1],
    ];
    phases.forEach(([a, b], i) => bars[i]?.style.setProperty('--fill', gsap.utils.clamp(0, 1, (p - a) / (b - a)).toFixed(3)));
    if (count) count.textContent = p < 0.4 ? '01' : p < 0.7 ? '02' : '03';
  };

  // Roteiro de scroll (0–100 = progresso do hero fixo).
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    },
  });

  tl.to({}, { duration: 100 }, 0);

  // 0–15: sala montada, leve aproximação.
  tl.fromTo(camera, { scale: 1, yPercent: 0 }, { scale: 1.03, duration: 15, ease: 'sine.inOut' }, 0);

  // 15–25: transição de opacidade para as camadas; o teto começa a subir.
  tl.fromTo(layersWrap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 4 }, 15);
  tl.to(assembled, { autoAlpha: 0, duration: 5 }, 17);

  // 25–55: paredes e móveis se afastam; tapete e piso revelam a separação.
  LAYERS.forEach((layer, i) => {
    tl.to(imgs[i], { yPercent: (layer.y + layer.lift) * 100, duration: 55 - layer.out, ease: 'power2.inOut' }, layer.out);
  });
  tl.to(camera, { scale: 0.8, yPercent: -4, duration: 31, ease: 'power2.inOut' }, 22);

  // 55–70: composição suspensa; o rastro percorre os detalhes com mensagens curtas.
  LAYERS.forEach((layer, i) => {
    tl.to(imgs[i], { yPercent: `+=${i % 2 ? 0.8 : -0.8}`, duration: 15, ease: 'sine.inOut' }, 55);
  });
  tl.to(trail, { strokeDashoffset: 0, duration: 13, ease: 'power1.inOut' }, 55);
  labels.forEach((label, i) => {
    tl.fromTo(label, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 2.5 }, LABEL_AT[i]);
  });

  // 70–90: as camadas voltam ao lugar, com sobreposição temporal.
  tl.to(labels, { autoAlpha: 0, duration: 3 }, 70);
  tl.to(trail, { strokeDashoffset: -1, duration: 7, ease: 'power1.in' }, 70);
  LAYERS.forEach((layer, i) => {
    tl.to(imgs[i], { yPercent: layer.y * 100, duration: 90 - layer.back, ease: 'power2.inOut' }, layer.back);
  });
  tl.to(camera, { scale: 1, yPercent: 0, duration: 18, ease: 'power2.inOut' }, 72);

  // 90–100: volta para a sala montada.
  tl.to(assembled, { autoAlpha: 1, duration: 4 }, 90);
  tl.to(layersWrap, { autoAlpha: 0, duration: 2 }, 94);

  // Passagem para #approach: a sala desliza até o espaço reservado na seção
  // seguinte enquanto o fundo passa de navy para branco; ao se acomodar, a imagem
  // da seção assume no mesmo lugar e a página volta à rolagem normal.
  let geo = { dx: 0, dy: 1, s: 1 };
  const measure = () => {
    const h = hero.getBoundingClientRect();
    const st = stage.getBoundingClientRect();
    const a = approach.getBoundingClientRect();
    const sl = slot.getBoundingClientRect();
    geo = { dx: sl.left - st.left, dy: Math.max(1, h.bottom - st.top + (sl.top - a.top)), s: sl.width / st.width };
  };
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);

  let swapped = null;
  const swap = (on) => {
    if (on === swapped) return;
    swapped = on;
    gsap.set(stage, { autoAlpha: on ? 0 : 1 });
    gsap.set(slotRoom, { autoAlpha: on ? 1 : 0 });
  };

  gsap.fromTo(
    mover,
    { x: 0, y: 0, scale: 1, transformOrigin: '0 0' },
    {
      x: () => geo.dx,
      y: () => geo.dy,
      scale: () => geo.s,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: approach,
        start: 'top bottom',
        end: () => `+=${geo.dy}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => swap(self.progress > 0.999),
        onRefresh: (self) => swap(self.progress > 0.999),
      },
    },
  );

  return () => ScrollTrigger.removeEventListener('refreshInit', measure);
}
