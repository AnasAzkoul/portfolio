<script setup lang="ts">
/**
 * Contact: one row per channel. A channel without its address yet shows a
 * draft note in place of the handle and isn't a link.
 */
definePageMeta({ turn: 4, crumb: 'CONTACT' })

type Channel =
  | { name: string; href: string; handle: string }
  | { name: string; todo: string }

const channels: Channel[] = [
  { name: 'Email', todo: 'add address' },
  {
    name: 'GitHub',
    href: 'https://github.com/AnasAzkoul',
    handle: '@ANASAZKOUL ↗'
  },
  { name: 'LinkedIn', todo: 'add profile' }
]

const row =
  'flex justify-between gap-4 border-b border-gold/16 py-3.5 text-[20px] text-ink no-underline'
const handle = 'self-center font-mono text-[11px] tracking-[2px] text-ink-dim'
</script>

<template>
  <FramedPanel
    kicker="04 · OPEN TO FRONTEND ROLES IN NL"
    title="Contact"
    close-to="/"
    variant="narrow"
  >
    <template v-for="channel in channels" :key="channel.name">
      <a
        v-if="'href' in channel"
        data-contact
        :href="channel.href"
        target="_blank"
        rel="noopener"
        :class="row"
        class="transition-colors duration-200 hover:text-gold-hi focus-visible:text-gold-hi focus-visible:outline-none"
      >
        {{ channel.name }}
        <span :class="handle">{{ channel.handle }}</span>
        <span class="sr-only">, opens in a new tab</span>
      </a>
      <div v-else data-contact :class="row">
        {{ channel.name }}
        <DraftNote class="self-center font-mono text-[11px] tracking-[2px]">{{
          channel.todo
        }}</DraftNote>
      </div>
    </template>
  </FramedPanel>
</template>
