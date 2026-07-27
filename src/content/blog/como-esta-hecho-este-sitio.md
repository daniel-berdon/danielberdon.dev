---
titulo: 'Cómo está hecho este sitio'
resumen: 'Astro sin frameworks de UI, un retrato en 1 bit, tipografías propias y una regla que no negocio: si el JavaScript falla, el sitio se sigue leyendo.'
fecha: 2026-07-23
tags: ['Astro', 'CSS', 'Rendimiento', 'Accesibilidad']
---

Este sitio es mi carta de presentación, así que me pareció justo que también fuera
una muestra de cómo trabajo. Aquí está el desglose técnico, sin humo.

## El stack

Astro genera HTML estático. No hay React, Vue ni ningún framework de interfaz:
para un portafolio, enviar un runtime completo al navegador para pintar texto que
ya conozco en tiempo de compilación es pagar un peaje sin recibir nada a cambio.

El contenido vive en archivos Markdown validados con un esquema. Si mañana añado
un proyecto y olvido el año, la compilación falla con un mensaje claro en vez de
publicar una ficha rota. Es el mismo principio que aplico en cliente: que el error
aparezca lo más cerca posible de donde se cometió.

## Diseño

Los colores, la tipografía y la retícula salen de un único archivo de tokens CSS.
El tema claro y el oscuro no son el mismo diseño invertido: cada uno tiene su
propia escala de grises neutros. Encima va una paleta categórica que da color
propio a cada sección, verificada para cumplir contraste AA en ambos temas.

Las tipografías son Space Grotesk y JetBrains Mono, servidas desde mi propio
dominio. Nada de peticiones a terceros para pintar una letra.

## El retrato

La foto está procesada con dithering de 1 bit: en lugar de grises, sólo hay puntos
de tinta o fondo, como en los primeros Macintosh. Es un guiño, pero también una
decisión de peso: una imagen de dos colores comprime muchísimo mejor que una
fotografía.

## Movimiento

Las animaciones usan anime.js: la entrada de la portada, los revelados al hacer
scroll, los contadores y el texto que se descifra carácter a carácter.

Aquí está la regla que mencionaba al principio. **El HTML se sirve visible.**
Cada efecto oculta su objetivo en tiempo de ejecución, nunca desde el CSS, y
siempre después de comprobar `prefers-reduced-motion`. Si el JavaScript no carga,
si falla la red o si alguien pidió menos movimiento en su sistema, el contenido
está ahí y se lee. Además hay una red de seguridad que devuelve a su estado final
cualquier elemento que se quede a medias.

Suena paranoico hasta que te pasa: durante el desarrollo tuve exactamente ese bug
y secciones enteras quedaron invisibles. Las animaciones son un adorno; el
contenido, no.

## Accesibilidad y rendimiento

Navegación completa por teclado, enlace para saltar al contenido, foco visible con
estilo propio y contraste AA como mínimo en todo el texto. El JavaScript del
cliente pesa unos 25 KB comprimidos, animaciones incluidas.

## Los guiños

Hay un modo CRT escondido tras el código Konami, un mensaje en la consola del
navegador para quien abra las herramientas de desarrollo, y un `humans.txt`.
Los sitios también son para las personas que leen el código fuente.
