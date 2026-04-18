import sharp from "sharp";

/** Output square size for team headshots (Next/Image uses this as intrinsic size). */
export const TEAM_PHOTO_SIZE = 1024;

/**
 * Trim near-uniform edges (e.g. circular Teams/LinkedIn exports on gray padding).
 * Too low: leaves gray rings; too high: may bite into hair against soft backgrounds.
 */
export const TEAM_PHOTO_TRIM_THRESHOLD = 14;

/**
 * Shared pipeline: optional trim → 1024² cover (attention) → sharpen → WebP.
 * Used by staff upload API and `npm run optimize:team-photos`.
 */
export async function pipelineTeamPhoto(input: Buffer): Promise<Buffer> {
  const chain = () =>
    sharp(input)
      .rotate()
      .trim({ threshold: TEAM_PHOTO_TRIM_THRESHOLD })
      .resize(TEAM_PHOTO_SIZE, TEAM_PHOTO_SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 92, effort: 4 });

  try {
    return await chain().toBuffer();
  } catch {
    return sharp(input)
      .rotate()
      .resize(TEAM_PHOTO_SIZE, TEAM_PHOTO_SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 92, effort: 4 })
      .toBuffer();
  }
}
