<script setup lang="ts">
/**
 * Contact: one row per channel. A channel without its address yet shows a
 * draft note in place of the handle and isn't a link.
 */
definePageMeta({ turn: 5, crumb: 'CONTACT', stage: 'beside' })
useSeoMeta({ title: 'Contact' })

type Channel =
  | { name: string; href: string; handle: string }
  | { name: string; todo: string }

const channels: Channel[] = [
  { name: 'Email', todo: 'add address' },
  {
    name: 'GitHub',
    href: 'https://github.com/AnasAzkoul',
    handle: '@ANASAZKOUL'
  },
  { name: 'LinkedIn', todo: 'add profile' }
]

const rowClass =
  'flex justify-between gap-4 border-b border-gold/16 py-3.5 text-[20px] text-ink no-underline'
// The handle's type, without its colour: a draft note keeps its own.
const handleType = 'self-center font-mono text-[12px] tracking-[1px]'
</script>

<template>
  <FramedPanel
    kicker="05 · OPEN TO FRONTEND ROLES IN NL"
    title="Contact"
    variant="narrow"
  >
    <template v-for="channel in channels" :key="channel.name">
      <a
        v-if="'href' in channel"
        data-contact
        :href="channel.href"
        target="_blank"
        rel="noopener"
        :class="rowClass"
        class="transition-colors duration-200 hover:text-gold-hi focus-visible:text-gold-hi focus-visible:outline-2 focus-visible:outline-gold"
      >
        {{ channel.name }}
        <span :class="handleType" class="text-ink-dim">
          {{ channel.handle }} <span aria-hidden="true">↗</span>
        </span>
        <span class="sr-only">, opens in a new tab</span>
      </a>
      <div v-else data-contact :class="rowClass">
        {{ channel.name }}
        <DraftNote :class="handleType">{{ channel.todo }}</DraftNote>
      </div>
    </template>
  </FramedPanel>
</template>
