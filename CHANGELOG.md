# Changelog

All notable changes to the **TIYATROTIST** portfolio and microsites platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-10

### Added
- **Dedicated 3D Scrollytelling Project Microsites**:
  - `BookOS` (`/projects/bookos`): Monolithic 3D tablet with landscape smart board rotation and exploded system layers.
  - `E.D.I.T.H` (`/projects/edith`): Cybernetic neural core with decoupled continuous spin and synaptic particle cloud.
  - `EtapKitap` (`/projects/etapkitap`): 4K interactive smart board with dynamic canvas and floating stylus pen.
  - `explorer-terminal` (`/projects/explorer-terminal`): Windows 11 File Explorer glass window with docked terminal and Win32 reparenting view.
  - `OpenPet` (`/projects/openpet`): Cybernetic desktop pet with articulated ears, OLED visor, halo ring, and real-time Rust telemetry HUD.
- **Unified Blog Infrastructure**:
  - Dual data source: Git-tracked local Markdown posts with frontmatter merged with Supabase database records.
  - Reading progress bar, dynamic table of contents, and accessible audio narration player.
- **Search Engine Optimization & Structured Data**:
  - Semantic JSON-LD schemas (`WebSite`, `Person`, `SoftwareApplication`, `TechArticle`).
  - OpenGraph and Twitter Cards metadata across all localized dynamic routes.
  - Dynamic `sitemap.ts` and crawler-safe `robots.ts`.

### Changed
- Replaced legacy mock/game assets with production brutalist monochrome design system.
- Standardized motion tokens (120ms micro, 280ms drawer/sheet, 420ms hero transitions with spring dynamics).
- Centralized project telemetry in `src/config/projects.ts`.

### Removed
- Removed legacy AdSense (`ads.txt`, ad script components).
- Removed deprecated prototype minigames to enforce zero-bloat architecture.
