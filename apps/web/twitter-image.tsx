import { getOpengraphImage, alt as ogAlt } from "./opengraph-image";

export const alt = ogAlt;

// The recommended size for Twitter images is 1200x600 pixels.
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function Image() {
  return getOpengraphImage(size);
}
