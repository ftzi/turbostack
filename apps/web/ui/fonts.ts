/**
 * You can change your used fonts here, which will be optimally loaded by Next.js
 * https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
 *
 * Some good fonts that are available in the `next/font/google` package to be easily used:
 *
 * Inter - https://fonts.google.com/specimen/Inter
 * Geist - https://fonts.google.com/specimen/Geist
 * Source_Sans_3 - https://fonts.google.com/specimen/Source+Sans+3
 * Roboto - https://fonts.google.com/specimen/Roboto
 * Poppins - https://fonts.google.com/specimen/Poppins
 * Lato - https://fonts.google.com/specimen/Lato
 * Noto - https://fonts.google.com/noto
 * Rubik - https://fonts.google.com/specimen/Rubik
 *
 * You can find all the fonts in this package here: https://fonts.google.com/
 */

import { Poppins } from "next/font/google";

// https://help.mantine.dev/q/next-load-fonts#loading-fonts-with-nextfont-package
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  // If subset is not defined, the font might only load after the first render, with Mantine.
  // https://github.com/vercel/next.js/blob/canary/errors/google-fonts-missing-subsets.mdx
  subsets: ["latin"],
});

export const fonts = {
  /** The default font used in all the texts. It's used in the `src/lib/ui/theme.ts` file. */
  default: poppins,
  poppins,
};
