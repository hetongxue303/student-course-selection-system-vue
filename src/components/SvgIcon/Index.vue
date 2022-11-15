<template>
  <svg
    :aria-hidden="true"
    class="svg-icon"
    :style="{
      color: color,
      height: size + 'em',
      width: size + 'em',
      fill: fill,
      'margin-right': mr + 'px',
      'margin-left': ml + 'px'
    }"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

const props = defineProps({
  prefix: { type: String as PropType<string>, default: 'icon' },
  name: { type: String as PropType<string>, required: true },
  color: { type: String as PropType<string>, default: '' },
  size: { type: Number as PropType<number>, default: 1.2 },
  fill: { type: String as PropType<string>, default: 'currentColor' },
  ml: { type: Number as PropType<number>, default: 0 },
  mr: { type: Number as PropType<number>, default: 10 }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scoped lang="scss">
.svg-icon {
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
