# Sabrina's headshot

The English and French home and Meet Sabrina pages use the approved, lightly retouched
IMG_7231 portrait, selected on September 26, 2026. The website asset is a 960 × 1200
WebP with no EXIF or location metadata. The supplied HEIC originals and review
copies remain outside the published assets.

To replace the portrait:

1. Save the approved, optimized image to `public/assets/sabrina-headshot.webp`.
   Use a real photograph supplied by Sabrina, remove embedded location/EXIF
   metadata, and keep the original outside the repository.
2. In `src/data/headshot.ts`, replace `null` with the image details:

   ```ts
   export const headshot: Headshot | null = {
     src: '/assets/sabrina-headshot.webp',
     width: 1200,
     height: 1500,
     focalPoint: '50% 35%',
   };
   ```

   Set `width` and `height` to the actual file dimensions. A portrait crop around
   4:5, at least 800 pixels wide, suits the layout. Leave space around Sabrina's
   head and shoulders. `focalPoint` controls the crop; adjust it to keep her face
   visible on desktop and mobile. The shared display uses the original organic
   rounded shape and offset outline, with a square crop. The current portrait is
   aligned to the top to preserve space above Sabrina's hair.

3. The shared component supplies concise, localized alt text: “Portrait of
   Sabrina McMorran” / “Portrait de Sabrina McMorran”. Update this text only if the
   approved image needs a different description.
4. Run `npm run build` and check `/meet-sabrina/` and
   `/fr/rencontrez-sabrina/` on desktop and mobile. Confirm the image loads,
   Sabrina's face is comfortably framed, and the introduction remains readable.

Set the configuration back to `null` to return both pages to the text-only layout.
