<script setup lang="ts">
// Each view names itself with useSeoMeta({ title }); Home names none. After
// each navigation the route announcer reads the new title out to screen
// readers.
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: (title) => (title ? `${title} — Anas Azkoul` : 'Anas Azkoul')
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
