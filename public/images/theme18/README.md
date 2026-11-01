# Theme18 — Panggih

Adat Jawa, sogan brown, antique gold, ivory paper, pendopo framing and gunungan ornaments.

Assets generated with built-in ImageGen, optimized to WebP while preserving the gunungan's alpha channel.

- `pendopo.webp`: Portrait wedding stationery backdrop, Central Javanese pendopo carved teak pillars and joglo lintel, warm ivory negative space, antique gold botanical scrollwork and jasmine, hand-painted/engraved heirloom aesthetic. No text or people.
- `gunungan.webp`: Transparent standalone Javanese kayon gunungan, tree of life, pierced-leather engraving in gold and sogan brown, jasmine at its base. No lettering.
- `kawung.svg`: Repeating geometric kawung-inspired ornament drawn as a lightweight vector for portrait details and the message-card border.

Component: `Theme18` (`src/components/theme/theme18.tsx`). The existing dynamic theme loader resolves `Theme18` automatically. Register/select this component through the existing admin theme management to use it for an invitation. This change does not insert database records.

Motion: retracting entrance panels, cover exit transition, stagger-free scroll reveals, gently floating gunungan. Respects reduced-motion preferences.
