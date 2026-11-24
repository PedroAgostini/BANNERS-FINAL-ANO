# Product

## Platform

web

## Stack

Canvas banner models (one JS file per model, brand colors as parameters) rendered by a shared engine, plus an internal editor (app/index.html) that can be published as a private claude.ai artifact. Exports PNG + WebP in-browser or through headless Chrome (app/render.html).

## Users

Internal agency team that builds and maintains websites for US home-service companies. They swap the Thanksgiving hero banner on each client site for a Christmas one (Christmas 2026: Friday, Dec 25). End viewers are US homeowners visiting those sites.

## Product Purpose

Christmas hero-background banners for the same client lots as Thanksgiving (CLIENTES_LOTE*.md), each in desktop (1920×800) and mobile (1080×1350). The new banners must look different from the Thanksgiving ones: new compositions, not the same models recolored.

## Operating Context

- Banners carry no text. The client site overlays its own HTML headline, sub and CTA, so each banner reserves a clear copy zone: left on desktop, top on mobile.
- Tone switch per model: a dark copy zone for light text, or a light one for dark text.
- Recolor uses the primary and secondary brand colors. Each client's colors are in app/clients/<slug>/cliente.json.
- No mockups. The client photo is never placed as a framed picture, printed card, swatch card, mirror, window or object inside a scene. The previous project's framed.js and photoPrint were left out on purpose.
- Christmas details are real photographic cutouts with the background removed, checked on dark and light grounds. SVG or procedural drawing only for brand-color shapes and light effects (bokeh, glow, snow).

## Capabilities and Constraints

- Editor: swap the photo, with focal point and zoom per format; element slots with on/off, variant and bounded nudges; brand colors by hex or picker, plus an eyedropper from the logo; tone switch; sample headline and CTA that never export; shared client presets.
- Each model is approved by the user before the next one is built.

## Brand Commitments

None of their own; models must absorb any client palette.

## Product Principles

1. Bespoke, never generic: no clip-art, no AI-looking imagery, no repeated layouts.
2. The copy zone is sacred: a client headline must read cleanly over it, in either tone.
3. The trade is the hero; Christmas is the season around it.
4. Constrained flexibility: slots and variants keep an approved composition intact across many clients.

## Exclusions

- Faces are allowed in the family cutouts (app/assets/natal/familias/), as decided by the user on 2026-11-24.
- No visible logos or brand marks in photos.
- No textures as background or panel: no wood, marble, plaster, stone or floor (app/assets/tex/ is off-limits). Richness comes from brand color, light, bokeh and glow. A surface under floor objects is fine only if it is part of the cutout itself (snow, rug), or as a contact shadow.
- No cluttered look: few elements, in one designed arrangement.
- No stock photos: client photos only (app/assets/photo/ is off-limits). If a site has no good photo, ask the user.
- No two banners alike across client sites.
- Nothing in the copy zone: no element, firework or strong glow behind the headline, sub or CTA.
- Stay close to the references in refs/natal/ and refs/ano-novo/.
- No animation-style art, cartoons or flat illustration: photographic cutouts and realistic light only.
- No heavy gradients: soft, discreet transitions only.
- No low-quality imagery: nothing pixelated, blurry, compression-damaged, or upscaled past its source size.
- Balanced spacing: never cramped and never lost in empty space, with consistent margins.
- Sites with a transparent header, or one laid over the hero: measure the live header height and start the copy zone below it with generous clearance (about 40px or more), on desktop and on mobile.
- No client logo inside the art (mirrored mobile extensions duplicate it).
- No Thanksgiving or fall leftovers: pumpkins, fall leaves, acorns, wheat.
- Open decisions for the user: Santa or religious imagery, and "Merry Christmas" vs "Happy Holidays" in the copy.
