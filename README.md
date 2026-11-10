# TIYATROTIST — Systems Developer Portfolio & Project Microsites

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-white?style=flat-square&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

The official engineering portfolio and interactive 3D project microsites platform for **Buğra Dere (Tiyatrotist)**. Built with Next.js 16 App Router, TypeScript, Three.js procedural rendering, and Lenis smooth scrolling.

Live platform: [tiyatrotist.com.tr](https://tiyatrotist.com.tr)

---

## Architecture Overview

```
tiyatrotist/
├── content/posts/           # Git-tracked Markdown articles with frontmatter
├── src/
│   ├── app/
│   │   ├── [lang]/          # Localized dynamic App Router (tr, en)
│   │   │   ├── blog/        # Editorial blog & article details
│   │   │   ├── projects/    # Project index & dedicated microsite routes
│   │   │   ├── hire/        # Collaboration, skills, and engagement briefs
│   │   │   └── contact/     # Verification and direct contact
│   │   ├── admin/           # Administrative dashboard & content tools
│   │   ├── sitemap.ts       # Dynamic sitemap generator
│   │   └── robots.ts        # Dynamic crawler directives
│   ├── components/
│   │   ├── bookos/          # BookOS 3D tablet & scrollytelling
│   │   ├── edith/           # E.D.I.T.H cybernetic core & neural HUD
│   │   ├── etapkitap/       # EtapKitap 4K smart board & classroom tools
│   │   ├── explorer-terminal/ # explorer-terminal Win32 reparenting simulator
│   │   ├── openpet/         # OpenPet cybernetic companion & Rust FSM
│   │   └── blog/            # Audio player, reading progress, TOC
│   ├── config/              # Centralized site & project configs
│   └── lib/                 # Unified blog service, analytics, Supabase
```

---

## Dedicated 3D Project Microsites

Each featured repository includes a dedicated scrollytelling microsite powered by procedural Three.js scenes and scrubbed timelines:

1. **BookOS** (`/projects/bookos`):
   - Monolithic tablet chassis rendered via procedural Three.js geometries and PBR metallic materials.
   - Smooth 90° landscape smart board rotation and exploded system layers scrubbing.

2. **E.D.I.T.H** (`/projects/edith`):
   - Cybernetic neural core with decoupled continuous spin and orbital agent rings.
   - Verified real-world architecture: Android Termux bridge, Faster-Whisper, Piper TTS, Multi-LLM failover pool, and FastAPI interface.

3. **EtapKitap** (`/projects/etapkitap`):
   - 65"/75" interactive smart board with procedural 16:9 canvas and floating stylus pen.
   - C++20 and Qt 6 architecture for Pardus ETAP 23, normalized hotspot coordinates, and classroom tools.

4. **explorer-terminal** (`/projects/explorer-terminal`):
   - Windows 11 File Explorer glass window with docked console.
   - Win32 `SetParent` injection architecture, auto directory synchronization, and interactive terminal simulator.

5. **OpenPet** (`/projects/openpet`):
   - Cybernetic desktop companion with articulated ears, OLED visor, halo ring, and segmented tail.
   - Rust modular architecture (`openpet-core`, `openpet-behavior`, `openpet-screen`, `openpet-ai`), FSM state machine simulator, and sub-15 MB memory footprint.

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later

### Local Installation

```bash
# Clone the repository
git clone https://github.com/Tiyatrotist/tiyatrotist.github.io.git
cd tiyatrotist

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to browse the localized site.

### Build & Type Verification

```bash
# TypeScript verification
npx tsc --noEmit

# Static generation / Production build
npm run build
```

---

## Design System & Motion Standards

- **Palette**: Strict brutalist monochrome palette (`#09090b` canvas, `#ffffff` accents, 1px hairline borders).
- **Motion Tokens**:
  - `120ms`: Micro-interactions and touch targets.
  - `280ms`: Drawers, command palettes, and modal reveals.
  - `420ms`: Hero transitions and scene camera pivots (`cubic-bezier(0.32, 0.72, 0, 1)` easing).
- **Accessibility**: Semantic HTML, zero-slop layout, minimum 48px touch targets, and automatic reduced-motion fallbacks.

---

## Security & Privacy Approach

- **Local-first Content**: Blog articles and project data are maintained directly in Git-tracked files with Supabase fallback.
- **Zero Third-party Trackers**: No intrusive ads, tracking pixels, or external ad scripts.
- **Controlled Contact**: Public communication is directed strictly through `iletisim@tiyatrotist.com.tr`.

---

## Maintainer & Identity

- **Maintainer**: Buğra Dere ([@Tiyatrotist](https://github.com/Tiyatrotist))
- **Email**: `iletisim@tiyatrotist.com.tr`
- **PGP / Verification**: Available on [tiyatrotist.com.tr/contact](https://tiyatrotist.com.tr/contact)

---

## License

This project is licensed under the [MIT License](LICENSE).
