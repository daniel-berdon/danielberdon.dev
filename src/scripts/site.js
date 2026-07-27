/**
 * site.js — comportamiento del sitio. El movimiento vive en ./motion.js
 * (anime.js); aquí queda la lógica: tema, boot, scroll-spy, copiar al
 * portapapeles y easter eggs.
 *
 * Principio de robustez: el contenido se sirve visible y nada de lo que hay
 * aquí puede dejarlo oculto. Si un módulo falla, el sitio sigue legible.
 */

import * as motion from './motion.js';

const html = document.documentElement;

/* Cadenas del lado del cliente, por idioma de la página (<html lang>) */
const ES = html.lang !== 'en';
const TEXT = {
  crtOn: ES
    ? 'CRT: ON — señal analógica restaurada (Esc para salir)'
    : 'CRT: ON — analog signal restored (Esc to exit)',
  crtOff: ES ? 'CRT: OFF — de vuelta al panel plano' : 'CRT: OFF — back to the flat panel',
  uptimeUnits: ES
    ? [
        ['año', 'años'],
        ['mes', 'meses'],
        ['día', 'días'],
        ['hora', 'horas'],
        ['minuto', 'minutos'],
        ['segundo', 'segundos'],
      ]
    : [
        ['year', 'years'],
        ['month', 'months'],
        ['day', 'days'],
        ['hour', 'hours'],
        ['minute', 'minutes'],
        ['second', 'seconds'],
      ],
};

/* Registro por página del scroll-spy */
const spy = { links: new Map(), sections: [] };

/* ====================== MOTOR LIGADO AL SCROLL ========================== */

function frameCheck() {
  const { links, sections } = spy;
  if (!sections.length) return;
  const pos = scrollY + innerHeight * 0.42;
  let currentId = null;
  for (const s of sections) {
    if (s.offsetTop <= pos) currentId = s.id;
  }
  links.forEach((grupo, id) => {
    grupo.forEach((link) => {
      if (id === currentId) link.setAttribute('data-active', '');
      else link.removeAttribute('data-active');
    });
  });
}

/* ==================== DEGRADADO DE LA BARRA DE PROGRESO =================
   La barra del header enseña el color de la sección que se está leyendo. En
   vez de repintarla en cada frame —y de saltar de un color a otro al cruzar
   un límite—, se compone una sola vez un degradado que recorre los tonos en
   el orden y las proporciones reales del documento. Luego el CSS recorta la
   barra según el avance: el borde cae siempre sobre el color que toca y la
   transición entre secciones la hace el propio degradado, mezclando.

   Se recalcula cuando cambian las medidas o los colores: carga, resize,
   cambio de página y cambio de tema.                                       */

function paintProgress() {
  if (!document.querySelector('.scroll-progress')) return;
  const max = html.scrollHeight - innerHeight;
  const secciones = [...document.querySelectorAll('.section[id]')];
  if (max <= 0 || !secciones.length) {
    html.style.removeProperty('--progress-grad');
    return;
  }

  const tono = (el) =>
    getComputedStyle(el).getPropertyValue('--tone').trim() ||
    getComputedStyle(html).getPropertyValue('--accent').trim();

  // Misma convención que el scroll-spy: una sección se está "viendo" cuando
  // su centro cruza el 42 % de la ventana. El ancla de cada tono va en ese
  // punto; entre dos anclas el degradado interpola solo.
  const at = (px) =>
    Math.min(100, Math.max(0, ((px - innerHeight * 0.42) / max) * 100));

  const paradas = [`${getComputedStyle(html).getPropertyValue('--accent').trim()} 0%`];
  for (const sec of secciones) {
    const centro = sec.offsetTop + sec.offsetHeight / 2;
    paradas.push(`${tono(sec)} ${at(centro).toFixed(2)}%`);
  }
  paradas.push(`${tono(secciones[secciones.length - 1])} 100%`);

  html.style.setProperty('--progress-grad', `linear-gradient(90deg, ${paradas.join(', ')})`);
}

/* Las medidas se estabilizan tarde (fuentes, imágenes): se recalcula con
   holgura en vez de en cada frame de scroll, que sería carísimo. */
let repaintTimer;
function schedulePaintProgress() {
  clearTimeout(repaintTimer);
  repaintTimer = setTimeout(paintProgress, 120);
}

function bindScroll() {
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = html.scrollHeight - innerHeight;
    html.toggleAttribute('data-scrolled', scrollY > 8);
    html.style.setProperty('--scroll-p', max > 0 ? String(Math.min(1, scrollY / max)) : '0');
    // Avance de salida de la portada: mueve los planos del terreno (ver 07d)
    html.style.setProperty(
      '--hero-p',
      Math.min(1, scrollY / Math.max(1, innerHeight * 0.85)).toFixed(4),
    );
    frameCheck();
  };
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
    setTimeout(() => {
      if (ticking) update();
    }, 150);
  };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  addEventListener('pageshow', request);
  addEventListener('resize', schedulePaintProgress, { passive: true });
  addEventListener('load', schedulePaintProgress);
  document.addEventListener('db:theme', schedulePaintProgress);
  update();
}

/* ============================== BOOT ==================================== */

/** Cierra la secuencia de arranque y devuelve el control al hero. */
function finishBoot() {
  const overlay = document.getElementById('boot');
  if (html.dataset.boot !== '1') return Promise.resolve();
  motion.bootProgress();
  // Deja respirar la secuencia (~1.6 s desde la navegación) y funde
  const wait = Math.max(0, 1600 - performance.now());
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        sessionStorage.setItem('db-boot', '1');
      } catch {}
      motion.bootOut(overlay).then(() => {
        delete html.dataset.boot;
        resolve();
      });
    }, wait);
  });
}

/* ============================== GLOBAL ================================== */

function toast(message) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = document.createElement('p');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => {
    el.setAttribute('data-out', '');
    setTimeout(() => el.remove(), 300);
  }, 2200);
}

/* Konami (↑↑↓↓←→←→BA) → modo CRT: scanlines, viñeta y glitch de encendido */
function bindKonami() {
  const seq = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA',
  ];
  let at = 0;
  addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && html.hasAttribute('data-crt')) {
      html.removeAttribute('data-crt');
      // Mismo corte de señal al apagar: el tubo no se va en silencio.
      motion.crtGlitch(document.getElementById('contenido'));
      toast(TEXT.crtOff);
      return;
    }
    at = e.code === seq[at] ? at + 1 : e.code === seq[0] ? 1 : 0;
    if (at !== seq.length) return;
    at = 0;
    const on = html.toggleAttribute('data-crt');
    motion.crtGlitch(document.getElementById('contenido'));
    toast(on ? TEXT.crtOn : 'CRT: OFF');
  });
}

/* ============================== SONIDO ==================================
   "Pop" sintetizado al vuelo con WebAudio: cero assets, cero descarga. El
   contexto se crea dentro del clic (gesto del usuario, así no lo bloquea la
   política de autoplay) y se reutiliza. Si el navegador no deja, silencio. */
let audioCtx;
function pop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx ||= new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    // Barrido rápido de grave a agudo + caída corta = burbuja al reventar
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.055);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  } catch {}
}

/* Copiar al portapapeles (delegado: sobrevive a los cambios de página) */
function bindCopy() {
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      // Fallback clásico; si tampoco puede, el mailto sigue ahí
      const ta = document.createElement('textarea');
      ta.value = btn.dataset.copy;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {}
      ta.remove();
      if (!ok) return;
    }
    // Recompensa: confeti desde el botón + pop. El confeti se calla solo bajo
    // prefers-reduced-motion; el sonido es corto y no depende del movimiento.
    motion.confettiBurst(btn);
    pop();

    const label = btn.querySelector('[data-copy-label]');
    const original = label ? label.textContent : '';
    btn.setAttribute('data-copied', '');
    if (label) label.textContent = btn.dataset.copiedLabel || (ES ? 'copiado ✓' : 'copied ✓');
    setTimeout(() => {
      btn.removeAttribute('data-copied');
      if (label) label.textContent = original;
    }, 1800);
  });
}

function consoleArt() {
  try {
    const accent = getComputedStyle(html).getPropertyValue('--accent-ink').trim() || '#4da3ff';
    const lineas = ES
      ? 'Astro + CSS nativo · anime.js para el movimiento · fuentes self-hosted\n' +
        '¿Curioseando el código? Eso ya me cae bien: danielberdon.dev@gmail.com\n' +
        'Pista: ↑↑↓↓←→←→BA'
      : 'Astro + vanilla CSS · anime.js for motion · self-hosted fonts\n' +
        'Browsing the code? I already like you: danielberdon.dev@gmail.com\n' +
        'Hint: ↑↑↓↓←→←→BA';
    console.log(
      `%c▄▄▄ danielberdon.dev %c v2 — ${ES ? 'gris, azul y en 1 bit' : 'gray, blue and 1-bit'}\n` +
        `%c${lineas}`,
      `color:${accent};font-weight:bold;font-size:14px`,
      'color:inherit;font-size:12px',
      'color:gray;font-size:12px',
    );
  } catch {}
}

/* ============================ POR PÁGINA ================================ */

/* ========================== UPTIME EN VIVO ==============================
   La ficha fetch presume uptime, así que la cifra tiene que correr como la
   de un servidor de verdad: años, meses y días de calendario —no de 30— más
   el reloj al segundo. El origen se ancla a la zona de Monterrey para que el
   número sea idéntico se lea desde donde se lea; sin JS queda el texto
   estático del HTML, que sigue siendo cierto. */

const UPTIME_TZ = 'America/Monterrey';
let uptimeTimer = null;

const uptimeFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: UPTIME_TZ,
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/* Instante actual descompuesto en partes de calendario de Monterrey */
function partesTZ(fecha) {
  const p = {};
  for (const { type, value } of uptimeFmt.formatToParts(fecha)) {
    if (type !== 'literal') p[type] = Number(value);
  }
  // A medianoche algunos motores devuelven 24 en vez de 0
  if (p.hour === 24) p.hour = 0;
  return p;
}

/* Lee '2016-01-11T09:00:00' como fecha de Monterrey: se parte a mano para
   que la zona del visitante no desplace el origen */
function partesISO(iso) {
  const [dia, hora = '00:00:00'] = String(iso).split('T');
  const [year, month, day] = dia.split('-').map(Number);
  const [hour, minute, second] = hora.split(':').map(Number);
  return { year, month, day, hour, minute: minute || 0, second: second || 0 };
}

/* Resta de calendario con acarreo. Los días prestados salen del mes anterior
   al actual, así febrero presta 28 o 29 y no 30 de mentira. */
function uptimeDiff(ini, hoy) {
  let s = hoy.second - ini.second;
  let mi = hoy.minute - ini.minute;
  let h = hoy.hour - ini.hour;
  let d = hoy.day - ini.day;
  let mo = hoy.month - ini.month;
  let y = hoy.year - ini.year;
  if (s < 0) (s += 60), (mi -= 1);
  if (mi < 0) (mi += 60), (h -= 1);
  if (h < 0) (h += 24), (d -= 1);
  if (d < 0) {
    d += new Date(Date.UTC(hoy.year, hoy.month - 1, 0)).getUTCDate();
    mo -= 1;
  }
  if (mo < 0) (mo += 12), (y -= 1);
  return { y, mo, d, h, mi, s };
}

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function initUptime() {
  const el = document.querySelector('[data-uptime]');
  // Se limpia siempre: al navegar fuera del índice el nodo ya no existe
  if (uptimeTimer) uptimeTimer = clearInterval(uptimeTimer);
  if (!el || !el.dataset.uptime) return;

  const ini = partesISO(el.dataset.uptime);
  // Tres renglones de dos unidades: la columna de la ficha es estrecha y así
  // ninguna línea se parte sola —la altura del panel no salta con el tic—
  el.textContent = '';
  const filas = [0, 1, 2].map(() => el.appendChild(document.createElement('span')));

  const pintar = () => {
    const { y, mo, d, h, mi, s } = uptimeDiff(ini, partesTZ(new Date()));
    const valores = [y, mo, d, h, mi, s];
    const u = TEXT.uptimeUnits.map(([uno, varios], i) => plural(valores[i], uno, varios));
    filas.forEach((fila, i) => {
      fila.textContent = u.slice(i * 2, i * 2 + 2).join(', ');
    });
  };
  pintar();
  uptimeTimer = setInterval(pintar, 1000);
}

/* Scroll-spy: registra enlaces y secciones; frameCheck decide el activo */
function initSpy() {
  // Una sección puede tener más de un enlace: el del header y el de la barra
  // de móvil apuntan al mismo sitio y ambos deben marcarse.
  spy.links = new Map();
  document.querySelectorAll('a[data-spy]').forEach((a) => {
    const id = a.dataset.spy;
    if (!spy.links.has(id)) spy.links.set(id, []);
    spy.links.get(id).push(a);
  });
  spy.sections = [...spy.links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);
}

/* Terreno del hero. Nada persigue al puntero: se escribe --ter-dx (de -1 a 1
   desde el centro) para la guiñada de la cámara, y un --near por baliza con
   lo cerca que pasas de cada una. El resto lo hace CSS.
   Ni rAF ni animaciones en JS; una medida del SVG por movimiento. */
function bindTerrain() {
  const caja = document.querySelector('.hero-terrain');
  const svg = caja && caja.querySelector('.terrain-svg');
  if (!caja || !svg || caja.dataset.terrain) return;
  caja.dataset.terrain = '1';

  // Debe coincidir con el viewBox del SVG
  const VB_W = 800;
  const VB_H = 280;
  /* Radio de influencia sobre las balizas, en unidades del lienzo. Marca cuán
     localizada se siente la respuesta: más pequeño, más puntería. */
  const ALCANCE = 190;

  const balizas = [...caja.querySelectorAll('.ter-wp')].map((el) => ({
    el,
    x: Number(el.dataset.wx),
    y: Number(el.dataset.wy),
  }));

  caja.addEventListener(
    'pointermove',
    (event) => {
      const marco = svg.getBoundingClientRect();
      if (!marco.width || !marco.height) return;
      const fx = (event.clientX - marco.left) / marco.width;
      const fy = (event.clientY - marco.top) / marco.height;
      const vx = fx * VB_W;
      const vy = fy * VB_H;

      caja.style.setProperty('--ter-dx', (fx * 2 - 1).toFixed(3));

      // Respuesta diferencial: cada baliza se entera de lo cerca que pasas
      for (const b of balizas) {
        const d = Math.hypot(vx - b.x, vy - b.y);
        b.el.style.setProperty('--near', Math.max(0, 1 - d / ALCANCE).toFixed(3));
      }
    },
    { passive: true },
  );

  // Al salir, la cámara vuelve al frente y el paisaje se duerme
  caja.addEventListener('pointerleave', () => {
    caja.style.setProperty('--ter-dx', '0');
    for (const b of balizas) b.el.style.setProperty('--near', '0');
  });

  bindFlujo(caja);
}

/* ================= FLUJO DE GUIONES DE LA MALLA =========================
   Los guiones de las líneas en fuga corren siempre, con una animación CSS
   normal y corriente. Al pasar el puntero el flujo se frena, pero **de forma
   gradual**: `animation-duration` no es transicionable, así que en CSS el
   cambio solo puede ser un salto.

   La solución es no tocar la animación sino su velocidad de reproducción.
   `updatePlaybackRate` la cambia sin mover el tiempo actual —o sea, sin dar
   un tirón en la fase de los guiones— y aquí se lleva hasta su objetivo en
   pasos pequeños, con caída exponencial.

   Lo importante: el rAF solo vive durante la rampa (~0.6 s) y se apaga al
   llegar. El movimiento de base no depende de él, así que si el JS falla o
   se queda sin frames, los guiones siguen corriendo igual.               */

const FLUJO_LENTO = 0.45; // factor de velocidad con el puntero encima
const FLUJO_ACERCA = 8; // 1/s: cuanto mayor, antes alcanza el objetivo

const flujo = { anims: [], raf: 0, ultimo: 0, tasa: 1, meta: 1 };

function flujoPaso(ahora) {
  const dt = Math.min(0.05, (ahora - flujo.ultimo) / 1000);
  flujo.ultimo = ahora;
  flujo.tasa += (flujo.meta - flujo.tasa) * Math.min(1, dt * FLUJO_ACERCA);
  if (Math.abs(flujo.meta - flujo.tasa) < 0.005) flujo.tasa = flujo.meta;

  for (const anim of flujo.anims) {
    try {
      anim.updatePlaybackRate(flujo.tasa);
    } catch {}
  }

  // Llegó: se apaga el bucle hasta el próximo cambio de objetivo
  flujo.raf = flujo.tasa === flujo.meta ? 0 : requestAnimationFrame(flujoPaso);
}

function flujoHacia(meta) {
  flujo.meta = meta;
  if (flujo.raf || !flujo.anims.length) return;
  flujo.ultimo = performance.now();
  flujo.raf = requestAnimationFrame(flujoPaso);
}

function bindFlujo(caja) {
  // Con movimiento reducido el CSS ya no anima nada: no hay qué rampear
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lineas = [...caja.querySelectorAll('.terrain-cols polyline')];
  flujo.anims = lineas.flatMap((el) =>
    typeof el.getAnimations === 'function' ? el.getAnimations() : [],
  );
  if (!flujo.anims.length) return;
  caja.addEventListener('pointerenter', () => flujoHacia(FLUJO_LENTO));
  caja.addEventListener('pointerleave', () => flujoHacia(1));
}

/* 404: imprime la ruta real que falló en la traza decorativa */
function init404() {
  const el = document.querySelector('[data-404-path]');
  if (el) el.textContent = location.pathname;
}

/* ============================== ARRANQUE ================================ */

const initPage = () => {
  initSpy();
  initUptime();
  init404();
  bindTerrain();
  paintProgress();
  // Las entradas por scroll cambian la altura del documento mientras corren
  schedulePaintProgress();
  motion.revealOnScroll();
  motion.staggerGroups();
  motion.scrambleOnHover();
  motion.scrambleOnEnter();
  frameCheck();
};

if (!window.__dbSite) {
  window.__dbSite = true;
  bindScroll();
  bindKonami();
  bindCopy();
  consoleArt();
  motion.themeToggleSpin();
  motion.watchdog();
  // El hero espera a que la secuencia de arranque libere la pantalla
  finishBoot().then(() => motion.heroIntro());
}

document.addEventListener('astro:page-load', initPage);
if (document.readyState !== 'loading') initPage();
else document.addEventListener('DOMContentLoaded', initPage, { once: true });
