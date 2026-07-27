---
titulo: 'Servidor de producción propio para la agencia'
problema: 'Los sitios de los clientes vivían en hosting compartido: caídas ajenas, cero control y respaldos que nadie verificaba.'
rol: 'Infraestructura y migración'
stack: ['AlmaLinux', 'cPanel/WHM', 'Apache/Nginx', 'Cloudflare', 'Bash']
resultado: 'Todos los sitios migrados sin caída; respaldos automáticos verificados y monitoreo continuo.'
anio: '2024'
cliente: 'AVADA 360'
orden: 3
destacado: true
---

## Contexto

La agencia operaba los sitios de sus clientes en hosting compartido: cuando el proveedor tenía problemas, todos los clientes los tenían, y la única opción era abrir un ticket y esperar. Los respaldos existían «en teoría», pero nadie había probado restaurar uno.

## Qué hice

- **Configuración del servidor desde cero** sobre AlmaLinux con cPanel/WHM: particionado de cuentas por cliente, hardening, firewall y actualizaciones programadas.
- **Migración planificada de todos los sitios** sin caída de servicio: DNS preparado con TTL bajo, traspaso por la noche y verificación sitio por sitio.
- **Correo corporativo bien configurado**: SPF, DKIM y DMARC desde el primer día, con Google Workspace para los equipos que lo necesitaban.
- **Respaldos automáticos con restauración probada** hacia NAS, más monitoreo y alertas: hoy una caída se detecta antes de que el cliente llame.

## Resultado

La continuidad del servicio dejó de depender de terceros. Los incidentes se resuelven en casa en minutos, los respaldos se restauran de verdad —no en teoría— y la agencia ofrece hosting a sus clientes con margen y con confianza.
