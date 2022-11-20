<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'
import { setBrowserTitle } from './utils/common'

const route = useRoute()
const router = useRouter()
watch(
  () => route.path,
  () => setBrowserTitle(router),
  { deep: true, immediate: true }
)
</script>

<template>
  <router-view />
</template>

<style scoped></style>
