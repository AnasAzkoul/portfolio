/** Centre of the mosaic's 1000 × 1000 viewBox. */
export const CENTER = 500

const fmt = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`

/** Point at radius `r` and angle `a` (radians, clockwise from +x) around a centre. */
export function pt(
  r: number,
  a: number,
  cx = CENTER,
  cy = cx
): [number, number] {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

/** Closed 2n-pointed star alternating outer radius `ro` and inner radius `ri`. */
export function star(
  cx: number,
  cy: number,
  ro: number,
  ri: number,
  n: number,
  rot: number
): string {
  const step = Math.PI / n
  let d = ''
  for (let i = 0; i < 2 * n; i++) {
    const r = i % 2 === 0 ? ro : ri
    const [x, y] = pt(r, rot + i * step, cx, cy)
    d += `${i === 0 ? 'M' : 'L'}${fmt(x, y)} `
  }
  return `${d}Z`
}

/** Closed regular n-gon of circumradius `r`. */
export function poly(
  cx: number,
  cy: number,
  r: number,
  n: number,
  rot: number
): string {
  let d = ''
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(r, rot + (i * 2 * Math.PI) / n, cx, cy)
    d += `${i === 0 ? 'M' : 'L'}${fmt(x, y)} `
  }
  return `${d}Z`
}

/** Open star-polygon line joining every `skip`-th of n points on a circle of radius `r`. */
export function girih(
  cx: number,
  cy: number,
  r: number,
  n: number,
  skip: number,
  rot: number
): string {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const [x, y] = pt(r, rot + (i * skip * 2 * Math.PI) / n, cx, cy)
    d += `${i === 0 ? 'M' : 'L'}${fmt(x, y)} `
  }
  return d.trimEnd()
}
