/**
 * motion.js — capa de movimiento del sitio, sobre anime.js v4.
 *
 * Contrato de robustez (no negociable): el HTML se sirve visible. Cada efecto
 * de este archivo oculta su objetivo justo antes de animarlo, en tiempo de
 * ejecución. Si el módulo no carga, si anime falla o si el visitante pide
 * movimiento reducido, el contenido sigue ahí y legible.
 *
 * API usada (anime 4.5): animate, createTimeline, stagger, onScroll, spring,
 * scrambleText (anima `textContent`) y utils.
 */

import {
  animate,
  createTimeline,
  onScroll,
  scrambleText,
  spring,
  stagger,
  utils,
} from 'animejs';

const html = document.documentElement;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Selectores que se revelan al entrar en pantalla. */
const REVEAL = '.reveal, .project-row, .xp-item, .cap-group, .stat';

/** Animaciones de revelado vivas, para la red de seguridad. */
let pending = [];

/* ============================ RED DE SEGURIDAD ==========================
   Si un elemento quedó oculto pero ya está en pantalla, se fuerza su estado
   final. Cubre el caso de un observador que nunca dispara.               */

function rescue() {
  if (!pending.length) return;
  pending = pending.filter(({ el, anim }) => {
    if (!el.isConnected) return false;
    const box = el.getBoundingClientRect();
    const visible = box.top < innerHeight && box.bottom > 0;
    if (!visible) return true;
    // Cualquier cosa visible pero translúcida se lleva a su estado final
    if (parseFloat(getComputedStyle(el).opacity) > 0.99) return false;
    try {
      if (anim) anim.complete();
      else utils.set(el, { opacity: 1, y: 0 });
    } catch {
      utils.set(el, { opacity: 1, y: 0 });
    }
    return false;
  });
}

/* ============================== HERO ==================================== */

/** Entrada escalonada de la portada. Se lanza cuando el boot ha terminado. */
export function heroIntro() {
  const hero = document.querySelector('.hero');
  if (!hero || reduced()) return;

  const pick = (sel) => [...hero.querySelectorAll(sel)];
  const lines = pick('.hero-name-line');
  const frame = pick('.portrait-frame');
  const portrait = pick('.portrait');
  const lead = pick('.hero-lead');
  const metas = pick('.hero-meta li');
  const index = pick('.hero-index li');

  const tl = createTimeline({ defaults: { ease: 'outExpo' } });
  /** anime falla con listas vacías: cada paso solo entra si hay objetivo. */
  const step = (targets, params, pos) => {
    if (targets.length) tl.add(targets, params, pos);
  };

  // El nombre entra con muelle: cada línea empuja a la siguiente
  step(lines, {
    opacity: [0, 1],
    y: [46, 0],
    duration: 900,
    ease: spring({ stiffness: 120, damping: 16 }),
    delay: stagger(90),
  });
  step(portrait, { opacity: [0, 1], duration: 700 }, '-=760');
  // El retrato se revela con un barrido vertical, como una imagen que carga
  step(
    frame,
    {
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
      duration: 900,
      ease: 'out(3)',
    },
    '-=700',
  );
  step(lead, { opacity: [0, 1], y: [14, 0], duration: 700 }, '-=620');
  step(
    metas,
    { opacity: [0, 1], x: [-12, 0], duration: 520, delay: stagger(55) },
    '-=560',
  );
  step(
    index,
    { opacity: [0, 1], y: [8, 0], duration: 420, delay: stagger(45) },
    '-=340',
  );

  return tl;
}

/* ========================= REVELADO POR SCROLL ========================== */

/**
 * Dispara `run` una sola vez, cuando `el` entra en pantalla.
 *
 * El observador se usa como disparador, nunca como `autoplay`: si se enlaza
 * al autoplay, anime pausa la animación al salir el elemento del viewport y
 * un scroll rápido —o una etiqueta sticky— la deja congelada a medias.
 * Así, una vez arrancada, siempre termina.
 */
function whenVisible(el, run) {
  const box = el.getBoundingClientRect();
  if (box.top < innerHeight * 0.92) {
    run();
    return null;
  }
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    run();
  };
  return onScroll({
    target: el,
    enter: 'bottom-=80 top',
    repeat: false,
    onEnter: once,
  });
}

export function revealOnScroll() {
  const els = document.querySelectorAll(REVEAL);
  if (!els.length || reduced()) return;

  els.forEach((el) => {
    if (el.dataset.motion) return;
    el.dataset.motion = '1';

    // Lo que ya está en pantalla no se toca: nada de parpadeos al cargar
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return;

    utils.set(el, { opacity: 0, y: 22 });
    const entry = { el, anim: null };
    pending.push(entry);
    whenVisible(el, () => {
      entry.anim = animate(el, {
        opacity: 1,
        y: 0,
        duration: 720,
        ease: 'outExpo',
      });
    });
  });
}

/** Las tarjetas de un bloque entran en cascada cuando el bloque aparece. */
export function staggerGroups() {
  if (reduced()) return;
  [
    ['.caps-grid', '.cap-group'],
    ['.method', '.step'],
    ['.contact-links', 'li'],
    ['.skill-list', '.pill'],
  ].forEach(([wrapSel, itemSel]) => {
    const wrap = document.querySelector(wrapSel);
    if (!wrap || wrap.dataset.motionGroup) return;
    wrap.dataset.motionGroup = '1';
    const items = [...wrap.querySelectorAll(itemSel)];
    if (!items.length) return;
    if (wrap.getBoundingClientRect().top < innerHeight * 0.92) return;

    items.forEach((el) => {
      utils.set(el, { opacity: 0, y: 24 });
      pending.push({ el, anim: null });
    });
    whenVisible(wrap, () => {
      const anim = animate(items, {
        opacity: 1,
        y: 0,
        duration: 700,
        ease: 'outExpo',
        delay: stagger(80),
      });
      pending.forEach((p) => {
        if (items.includes(p.el)) p.anim = anim;
      });
    });
  });
}

/* ======================== TEXTO: DECODIFICADO =========================== */

const GLYPHS = '01<>[]{}#$%&*+=~^/\\';

/** Enlaces del header: el texto se descifra al pasar el cursor. */
export function scrambleOnHover() {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    if (el.dataset.motionScramble) return;
    el.dataset.motionScramble = '1';
    el.addEventListener('mouseenter', () => {
      if (reduced()) return;
      // Si el enlace lleva HTML dentro (p. ej. el brand con su ".dev" en
      // azul), solo se descifran los nodos marcados: animar el textContent
      // del enlace entero lo aplanaría y destruiría ese marcado.
      const marked = el.querySelectorAll('[data-scramble-text]');
      const targets = marked.length ? [...marked] : [el];
      targets.forEach((target) => {
        animate(target, {
          textContent: scrambleText({ chars: GLYPHS, revealRate: 90 }),
          duration: 520,
        });
      });
    });
  });
}

/** Títulos de sección: se descifran una vez, al entrar en pantalla. */
export function scrambleOnEnter() {
  if (reduced()) return;
  document.querySelectorAll('.section-title').forEach((title) => {
    if (title.dataset.motionScramble) return;
    title.dataset.motionScramble = '1';
    // El icono es un hijo del título: solo se descifra el nodo de texto
    const node = [...title.childNodes].find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
    );
    if (!node) return;
    const original = node.textContent.trim();
    const holder = document.createElement('span');
    holder.textContent = original;
    node.replaceWith(holder);
    whenVisible(holder, () => {
      animate(holder, {
        textContent: scrambleText({ chars: GLYPHS, revealRate: 60 }),
        duration: 900,
      });
      // El título nunca se queda cifrado, pase lo que pase
      setTimeout(() => (holder.textContent = original), 1600);
    });
  });
}

/* ============================== DETALLES ================================ */

/** El icono del toggle gira con muelle en cada cambio de tema. */
export function themeToggleSpin() {
  document.addEventListener('db:theme', () => {
    if (reduced()) return;
    document.querySelectorAll('.theme-toggle .tico').forEach((icon) => {
      animate(icon, {
        rotate: [-90, 0],
        scale: [0.6, 1],
        duration: 700,
        ease: spring({ stiffness: 140, damping: 12 }),
      });
    });
  });
}

/* Filtro SVG que trocea el contenido en bandas horizontales y las desplaza
   de forma independiente (feDisplacementMap). El ruido se cuantiza en niveles
   discretos → bloques nítidos, no una ola; el canal vertical se aplana a 0.5
   → sin arrastre vertical, solo cortes que saltan de lado. Se inyecta una vez
   y se reutiliza. Devuelve {turb, disp} o null si algo falla. */
let glitchFx = null;
function ensureGlitchFilter() {
  if (glitchFx) return glitchFx;
  const existing = document.getElementById('crt-glitch');
  if (existing) {
    glitchFx = {
      turb: existing.querySelector('feTurbulence'),
      disp: existing.querySelector('feDisplacementMap'),
    };
    return glitchFx;
  }
  try {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText =
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    svg.innerHTML =
      '<filter id="crt-glitch" x="-6%" y="-2%" width="112%" height="104%"' +
      ' color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.0001 0.08"' +
      ' numOctaves="1" seed="3" result="n"/>' +
      '<feComponentTransfer in="n" result="nq">' +
      '<feFuncR type="discrete" tableValues="0 .3 .5 .7 1 .15 .85 .4 .6"/>' +
      '<feFuncG type="table" tableValues="0.5 0.5"/>' +
      '</feComponentTransfer>' +
      '<feDisplacementMap in="SourceGraphic" in2="nq" scale="0"' +
      ' xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>';
    document.body.appendChild(svg);
    glitchFx = {
      turb: svg.querySelector('feTurbulence'),
      disp: svg.querySelector('feDisplacementMap'),
    };
    return glitchFx.turb && glitchFx.disp ? glitchFx : (glitchFx = null);
  } catch {
    return null;
  }
}

/** Glitch de conmutación del modo CRT (mismo corte al entrar y al salir): la
 *  imagen se rompe en bloques cortados que saltan de sitio (desplazamiento SVG
 *  por bandas) con separación de canales RGB y cortes de señal. Sin sacudida
 *  lateral del bloque entero. Cada `call` reprograma el patrón de bandas → los
 *  bloques saltan a saltos; el último deja #contenido sin filtro (un filtro
 *  residual rompería sticky/fixed dentro). */
let crtTl = null;
export function crtGlitch(target) {
  if (reduced() || !target) return;
  const fx = ensureGlitchFilter();

  // Toggle rápido (on/off/on): mata la pasada anterior para que su limpieza
  // final no aterrice en mitad de la nueva.
  crtTl?.pause();

  // Un estado del glitch: patrón de bandas + intensidad del corte + fringe RGB.
  const apply = (scale, seed, freqY, [r, b, a], op) => {
    if (fx) {
      fx.turb.setAttribute('seed', seed);
      fx.turb.setAttribute('baseFrequency', `0.0001 ${freqY}`);
      fx.disp.setAttribute('scale', scale);
    }
    const split = a > 0
      ? ` drop-shadow(${r}px 0 rgba(255,64,64,${a}))` +
        ` drop-shadow(${b}px 0 rgba(72,196,255,${a}))`
      : '';
    target.style.filter = (fx && scale ? 'url(#crt-glitch)' : '') + split;
    target.style.opacity = op;
  };

  const tl = (crtTl = createTimeline());
  // t,  escala, seed, freqY, [fringeR, fringeB, alpha], opacidad
  const frames = [
    [0, 60, 3, 0.09, [5, -5, 0.6], 1],
    [70, 26, 17, 0.05, [-7, 7, 0.55], 0.55],
    [150, 74, 41, 0.12, [4, -4, 0.5], 1],
    [235, 0, 41, 0.08, [0, 0, 0], 0.75], // corte de señal: sin bloques
    [320, 44, 88, 0.06, [-3, 3, 0.5], 1],
    [430, 18, 9, 0.1, [0, 0, 0], 0.92],
  ];
  for (const [t, scale, seed, freqY, split, op] of frames) {
    tl.call(() => apply(scale, seed, freqY, split, op), t);
  }
  // Aterrizaje limpio: quita todo rastro de filtro/opacidad inline.
  tl.call(() => {
    target.style.filter = '';
    target.style.opacity = '';
    if (fx) fx.disp.setAttribute('scale', 0);
  }, 560);
}

/** Ráfaga de confeti vectorial desde el centro de un elemento: cuadros de 1 bit
 *  con los tonos de las secciones, disparados en abanico y con caída. Se dibuja
 *  en una capa fija sin eventos (nunca tapa un clic) y la capa se retira al
 *  terminar, así que no deja nodos ni animaciones vivas. */
export function confettiBurst(origin) {
  if (reduced() || !origin) return;

  const box = origin.getBoundingClientRect();
  if (!box.width && !box.height) return;
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;

  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  layer.setAttribute('aria-hidden', 'true');

  const bits = [];
  for (let i = 0; i < 28; i++) {
    const bit = document.createElement('i');
    bit.className = 'confetti-bit';
    // Mezcla de piezas: macizas, huecas (wireframe) y barras finas
    if (i % 3 === 0) bit.dataset.shape = 'hollow';
    else if (i % 4 === 0) bit.dataset.shape = 'bar';
    bit.style.setProperty('--tone', `var(--c-${(i % 6) + 1})`);
    bit.style.left = `${cx}px`;
    bit.style.top = `${cy}px`;
    layer.appendChild(bit);
    bits.push(bit);
  }
  document.body.appendChild(layer);

  let longest = 0;
  for (const bit of bits) {
    // Abanico hacia arriba (−90° es arriba en pantalla) y empuje variable
    const ang = (-90 + utils.random(-64, 64)) * (Math.PI / 180);
    const push = utils.random(70, 190);
    const x = Math.cos(ang) * push;
    const rise = Math.sin(ang) * push;
    const subida = utils.random(300, 420);
    const caida = utils.random(520, 760);
    longest = Math.max(longest, subida + caida);

    animate(bit, {
      x: [
        { to: x * 0.72, duration: subida, ease: 'outQuad' },
        { to: x, duration: caida, ease: 'outQuad' },
      ],
      y: [
        { to: rise, duration: subida, ease: 'outQuad' },
        { to: rise + utils.random(140, 300), duration: caida, ease: 'inQuad' },
      ],
      rotate: utils.random(-340, 340),
      scale: [
        { to: 1, duration: 140, ease: 'outBack' },
        { to: 0.55, duration: subida + caida - 140, ease: 'linear' },
      ],
      opacity: [
        { to: 1, duration: 60 },
        { to: 1, duration: subida },
        { to: 0, duration: caida - 60, ease: 'inQuad' },
      ],
    });
  }

  setTimeout(() => layer.remove(), longest + 200);
}

/** Barra de progreso del boot: llenado por pasos, como un cargador real. */
export function bootProgress() {
  const bar = document.querySelector('.boot-bar i');
  if (!bar || reduced()) return;
  return animate(bar, {
    scaleX: [0, 1],
    duration: 900,
    ease: 'steps(18)',
  });
}

/** Fundido de salida del boot. Devuelve promesa para encadenar el hero. */
export function bootOut(overlay) {
  if (!overlay) return Promise.resolve();
  if (reduced()) {
    overlay.style.display = 'none';
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    animate(overlay, {
      opacity: [1, 0],
      duration: 420,
      ease: 'outQuad',
      onComplete: () => {
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        resolve();
      },
    });
    // Si algo se atasca, el hero arranca igualmente
    setTimeout(resolve, 700);
  });
}

/** Engancha la red de seguridad al scroll del sitio. */
export function watchdog() {
  addEventListener('scroll', rescue, { passive: true });
  setTimeout(rescue, 3500);
  setTimeout(rescue, 8000);
}
