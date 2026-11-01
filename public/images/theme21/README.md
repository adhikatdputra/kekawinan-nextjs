# Theme21 — Kabut Pagi

## Revamp: photographic mountain dawn

The current design uses `mountain-dawn.webp` (1000 × 1500), generated with built-in imagegen and exported with Pillow. The earlier watercolor assets remain archived and are no longer rendered. The hero has typography directly over a readable sky, a straight framed couple portrait, matching arched individual portraits, a forest-backed event itinerary and simpler greeting rows. Body typography now uses Maison Neue. Existing gallery, RSVP, music, gifts, QR and reduced-motion handling remain connected.

Prompt:

Photorealistic cinematic Indonesian mountain landscape at dawn for a premium wedding invitation background. Vertical 2:3. Dramatic layers of blue-green volcanic mountain ridges rising through low white mist, deep evergreen pine forest in foreground at bottom and edges, a tiny calm lake reflecting soft morning light in lower center. Upper third softly luminous foggy pale sky with smooth quiet negative space for dark typography. Atmospheric natural photography with beautiful subtle film grain, muted deep teal, grey sage and ivory, no oversaturated greens, no orange sunset. Strong depth and expansive majestic composition. No people, no buildings, no text, no watermark. Real photographic landscape, not watercolor, not illustration.

Mountain wedding invitation in forest green, eucalyptus and warm ivory. Styling uses Tailwind and the `alpine-*` tokens in globals.css. Recoleta Alt headings and Georgia body text.

## Assets

- `mountains.webp`: 900 × 1350 watercolor panorama, RGB.
- `botanical.webp`: 720 × 480 botanical decoration, transparent RGBA.

Generated with the built-in imagegen tool, then resized and exported with Pillow. Original generated images are preserved outside the repository.

## Prompts

### Mountains

Use case: illustration-story. Portrait 2:3 atmospheric hand-painted watercolor landscape for an elegant mountain wedding invitation. Indonesian tropical highland mountain silhouettes, layered emerald and sage ridges, drifting pale morning mist in valleys, pine trees on lower left and right, winding narrow river through a green valley. Upper 40 percent is serene pale warm ivory sky with extremely light clouds, generous empty sky for invitation names. Lower half rich detailed forest and mountains, soft natural paper grain. Sophisticated landscape painting, not cartoon, muted forest green, eucalyptus, warm cream, touches of dawn ochre. No lettering, no people, no buildings, no logos. Full bleed portrait artwork.

### Botanical foreground

Use case: illustration-story. Transparent watercolor botanical cutout for an elegant mountain wedding invitation. Asymmetric low horizontal arrangement of mountain fern fronds, delicate pine branches and small white wildflowers, tiny moss-covered stones at base. Fine naturalistic botanical watercolor with textured deep green and sage leaves, ivory flowers and restrained brown pinecones. Center has some air so it works layered across lower corner of a photograph. Entire arrangement within canvas with padding. Landscape 3:2. Genuine transparent background, no landscape, no text, no watermark.

## Layout and motion

Panorama cover with a dark readability overlay; opening photograph displayed like a printed travel keepsake. Alternating botanical portraits, a day-of itinerary, shared LoveStoryAlbum and GaleriCarousel, RSVP, greetings, gifts, music and guest QR use existing invitation data. No additional data fetching.

The cover panorama slowly settles into view once; botanical decorations settle when entering the viewport. Section reveals respect reduced motion. No autoplay carousel or perpetual decorative animation.

## Activation

Use component name `Theme21` in the existing theme administration flow. The component is loaded by the existing dynamic theme loader; adding these files does not create a database theme record.
