# Theme20 — Serambi Betawi

Tailwind invitation theme with a rumah Betawi illustration, ondel-ondel pair, and repeating gigi balang trim. These illustrations are artistic interpretations for the invitation.

## Assets

- `rumah-betawi.webp`: generated watercolor house, resized to 1000px wide; alpha preserved.
- `ondel-ondel.webp`: generated watercolor pair, resized to 720px square; alpha preserved.
- `gigi-balang.svg`: repeating geometric trim drawn in code, 40 × 32px.

Generated using the built-in imagegen tool. Originals remain in the Codex generated_images directory. WebP exports were resized and compressed with Pillow.

## Prompts

### Courtyard foreground

`halaman-serambi.webp`: transparent watercolor foreground generated with built-in imagegen, resized to 1000px wide with alpha preserved. Positioned at the base of the hero frame under the house.

Use case: illustration-story. A wide low watercolor cutout foreground asset for the courtyard below a traditional Betawi house on a wedding invitation. Viewed slightly from above: a short warm sandstone stepping-stone path receding toward the top center, a few tiny white jasmine flowers and pink bougainvillea petals scattered across the ground, low tropical foliage and two small weathered terracotta pots at the far left and far right. Restrained elegant detailed watercolor in moss green, warm ochre, terracotta and ivory, matching a hand-painted traditional green timber Betawi house illustration. The upper center must stay empty so a house can be layered above it in code. Flat low composition, landscape 3:1. Genuine transparent background, soft naturally painted edges, no opaque rectangle, no house, no people, no writing, no watermark. Foliage modest, paving visible across the center rather than a blank middle.

### Serambi frame (theme18-style composition)

`serambi-frame.webp`: 900 × 1350 WebP, generated with built-in imagegen. Used on the cover, hero and mempelai cards. Typography follows theme18: Recoleta Alt headings and Georgia body, sans-serif labels and controls. Portraits use a thin gold arch frame.

Create a portrait 2:3 decorative architectural frame for an elegant Betawi wedding invitation, watercolor and detailed hand-painted timber. Like looking through the veranda of a traditional Betawi rumah kebaya: narrow carved dark green wooden posts at the extreme left and right edges, terracotta roof fascia across only the top 12 percent, golden gigi balang pendant triangular wooden fretwork under that fascia. Small tropical jasmine foliage and bougainvillea confined to lower outer corners, subtle gold detail. Warm ivory paper #fff9ea throughout the very large completely empty interior (central 75 percent width, from 18 percent to 88 percent height). Frame edges must be narrow, allow plentiful readable space for names and portrait. No house in the middle, no people, no text, no symbols or watermark, no Javanese pendopo carving. Flat full bleed rectangular portrait image, not a perspective mockup.

### Rumah Betawi

Use case: illustration-story. Create a landscape transparent cutout watercolor illustration asset for an elegant Betawi wedding invitation. A complete traditional Betawi rumah kebaya viewed straight on, terracotta broad pitched roof, deep veranda, green timber shutters and posts, yellow gigi balang triangular carved fascia under the roof, wooden balustrades and short front steps. Framed by a few tropical palms and bougainvillea, small colorful kembang kelapa ceremonial decorations beside veranda. Warm hand painted watercolor and fine ink details, forest green, burgundy, ochre gold. Entire building visible with generous padding. No people, no writing, no watermark. Actual transparent background, not white. Landscape 3:2.

### Ondel-ondel

Use case: illustration-story. Transparent cutout watercolor asset for a Betawi wedding invitation: a pair of traditional full-length Betawi ondel-ondel puppets standing side by side, male red painted face, black mustache, green long traditional robe and patterned sash, female pale cream painted face, red lips, burgundy kebaya and gold patterned skirt. Both have distinctive large cylindrical puppet bodies, black hair, fanlike radiating colorful kembang kelapa crown ornaments. Friendly dignified traditional painted faces, not scary, not human brides, not chibi. Elegant watercolor and fine ink details, forest green, burgundy and ochre gold. Entire pair including crowns and feet within frame with padding. No scenery, no text, no watermark. Actual transparent background. Square composition.

## Usage

Set the theme component name to `Theme20` in the existing theme administration flow. No database record is created by adding the component.

The opening cover uses the house in normal document flow so text does not overlap the decoration. Gigi balang marks section edges and the mempelai and greeting cards. The ondel-ondel pair sways once on entering the viewport; reduced motion disables the sway. Gallery and stories use the shared GaleriEditorial and LoveStoryAlbum components.

Visual references: https://dinaskebudayaan.jakarta.go.id/ikon-budaya-betawi/ondel-ondel and https://jdih.jakarta.go.id/dokumenPeraturanDirectory/0031/2017PERGUB0031011.pdf
