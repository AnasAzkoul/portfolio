<script setup lang="ts">
// Each view names itself with useSeoMeta({ title }); Home names none. After
// each navigation the route announcer reads the new title out to screen
// readers.
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: (title) => (title ? `${title} — Anas Azkoul` : 'Anas Azkoul'),
  // The ICO's `sizes` keeps Chrome from choosing it over the SVG.
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ]
})

// The preview a link to any page gets when it's shared in a chat app or on
// social media. The card is the Home hero, drawn at 1200 × 630.
const { siteUrl } = useRuntimeConfig().public
const route = useRoute()
const description =
  'Frontend developer in Weert, open to frontend roles in the Netherlands. Old-city craft, built in code.'
useSeoMeta({
  description,
  ogType: 'website',
  ogSiteName: 'Anas Azkoul',
  ogTitle: 'Anas Azkoul — Frontend Developer',
  ogDescription: description,
  ogUrl: () => new URL(route.path, siteUrl).href,
  ogImage: new URL('/og-image.jpg', siteUrl).href,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt:
    'Anas Azkoul, Frontend Developer, set in a gold Damascene star lattice',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
