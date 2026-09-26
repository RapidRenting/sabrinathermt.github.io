/** Approved portrait used on both Meet Sabrina pages. */
export type Headshot = {
  src: string;
  width: number;
  height: number;
  focalPoint: string;
};

export const headshot: Headshot | null = {
  src: '/assets/sabrina-headshot.webp',
  width: 960,
  height: 1200,
  focalPoint: '50% 35%',
};
