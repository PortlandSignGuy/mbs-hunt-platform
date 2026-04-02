/**
 * Generate a prefixed ID: e.g. genId('HNT') → 'HNT-a1b2c3d4'
 */
export function genId(prefix = 'ID') {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}
