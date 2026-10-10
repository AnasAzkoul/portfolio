<script setup lang="ts">
import type { LatticeTurn } from '~/utils/lattice'

const { turn = 0 } = defineProps<{
  /** Each turn rotates the lattice 22.5°. */
  turn?: LatticeTurn
}>()

const { rays, inner, mid, hotStars, rosette, pearls, border } = buildLattice()
</script>

<template>
  <svg
    viewBox="0 0 1000 1000"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    :style="{ '--turn': `${turn * 22.5}deg` }"
  >
    <g class="spin">
      <path v-for="(p, i) in rays" :key="`ray-${i}`" :d="p.d" :class="p.cls" />
      <path
        v-for="(p, i) in inner"
        :key="`inner-${i}`"
        :d="p.d"
        :class="p.cls"
      />
      <path v-for="(p, i) in mid" :key="`mid-${i}`" :d="p.d" :class="p.cls" />
      <g v-for="(s, i) in hotStars" :key="`hot-${i}`" class="hot">
        <circle :cx="s.hit.cx" :cy="s.hit.cy" :r="s.hit.r" :class="s.hit.cls" />
        <path v-for="(p, j) in s.paths" :key="j" :d="p.d" :class="p.cls" />
        <circle :cx="s.dot.cx" :cy="s.dot.cy" :r="s.dot.r" :class="s.dot.cls" />
      </g>
      <path
        v-for="(p, i) in rosette"
        :key="`rosette-${i}`"
        :d="p.d"
        :class="p.cls"
      />
      <circle
        v-for="(c, i) in pearls"
        :key="`pearl-${i}`"
        :cx="c.cx"
        :cy="c.cy"
        :r="c.r"
        :class="c.cls"
      />
      <circle
        v-for="c in border.rings"
        :key="`ring-${c.r}`"
        :cx="c.cx"
        :cy="c.cy"
        :r="c.r"
        :class="c.cls"
      />
      <path
        v-for="(p, i) in border.triangles"
        :key="`tri-${i}`"
        :d="p.d"
        :class="p.cls"
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  transform: rotate(var(--turn));
  transition: transform 1.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 200s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  svg {
    transform: none;
    transition: none;
  }
  .spin {
    animation: none;
  }
}
.g-line,
.g-line2,
.g-fine,
.g-pearl {
  fill: none;
  stroke-linejoin: round;
}
.g-line {
  stroke: var(--color-gold);
  stroke-width: 1;
  opacity: 0.2;
}
.g-line2 {
  stroke: var(--color-gold-hi);
  stroke-width: 1;
  opacity: 0.28;
}
.g-fine {
  stroke: var(--color-gold);
  stroke-width: 0.7;
  opacity: 0.12;
}
.g-pearl {
  stroke: var(--color-pearl);
  stroke-width: 0.8;
  opacity: 0.15;
}
.acc-red {
  fill: var(--color-red);
  opacity: 0.55;
}
.acc-grn {
  fill: var(--color-green);
  opacity: 0.55;
}
.acc-prl {
  fill: var(--color-pearl);
  opacity: 0.55;
}
.hot {
  transition: filter 0.35s ease;
}
.hot .hit {
  fill: transparent;
  pointer-events: all;
  cursor: pointer;
}
.hot .g-line2,
.hot .g-fine,
.hot .acc-red,
.hot .acc-grn,
.hot .acc-prl {
  transition: opacity 0.35s ease;
}
.hot:hover {
  filter: drop-shadow(0 0 6px rgba(224, 192, 121, 0.8));
}
.hot:hover .g-line2 {
  opacity: 0.85;
}
.hot:hover .g-fine {
  opacity: 0.55;
}
.hot:hover .acc-red,
.hot:hover .acc-grn,
.hot:hover .acc-prl {
  opacity: 0.95;
}
</style>
