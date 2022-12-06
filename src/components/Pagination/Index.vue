<script setup lang="ts">
import { Page } from '../../types/query'

const props = withDefaults(defineProps<Page>(), {
  small: true,
  disabled: false,
  background: false,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: () => [10, 20, 30, 50, 100]
})
</script>

<template>
  <el-pagination
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :page-sizes="props.pageSizes"
    :small="props.small"
    :disabled="props.disabled"
    :background="props.background"
    :layout="props.layout"
    :total="props.total"
  />
</template>

<style scoped lang="scss"></style>
