---
titulo: 'In-house production server for the agency'
problema: 'Client sites lived on shared hosting: other people’s outages, zero control and backups nobody verified.'
rol: 'Infrastructure and migration'
stack: ['AlmaLinux', 'cPanel/WHM', 'Apache/Nginx', 'Cloudflare', 'Bash']
resultado: 'Every site migrated with no downtime; verified automatic backups and continuous monitoring.'
anio: '2024'
cliente: 'AVADA 360'
orden: 3
destacado: true
---

## Context

The agency ran its clients’ sites on shared hosting: when the provider had problems, every client had them, and the only option was to open a ticket and wait. Backups existed “in theory”, but nobody had ever tried restoring one.

## What I did

- **Server configuration from scratch** on AlmaLinux with cPanel/WHM: per-client account partitioning, hardening, firewall and scheduled updates.
- **Planned migration of every site** with no service interruption: DNS prepared with low TTLs, overnight transfers and site-by-site verification.
- **Properly configured corporate email**: SPF, DKIM and DMARC from day one, with Google Workspace for the teams that needed it.
- **Automatic backups with proven restores** to a NAS, plus monitoring and alerts: today an outage is detected before the client calls.

## Outcome

Service continuity stopped depending on third parties. Incidents are solved in-house in minutes, backups are restored for real — not in theory — and the agency offers hosting to its clients with margin and with confidence.
