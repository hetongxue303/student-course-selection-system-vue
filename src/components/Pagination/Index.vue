<template>
  <el-pagination
    class="pagination"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    :page-sizes="props.pageSizes"
    :small="props.small"
    :disabled="props.disabled"
    :background="props.background"
    :layout="props.layout"
    :prev-text="props.prevText"
    :next-text="props.nextText"
    :hide-on-single-page="props.hideOnSinglePage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
const handleSizeChange = (value: number) => emit('size-change', value)

const handleCurrentChange = (value: number) => emit('current-change', value)

const emit = defineEmits<{
  (e: 'current-change', currentPage: number): void
  (e: 'size-change', currentPage: number): void
}>()

const props = withDefaults(
  defineProps<{
    currentPage: number
    pageSize: number
    total: number
    small?: boolean
    disabled?: boolean
    background?: boolean
    layout?: string
    pageSizes?: number[]
    prevText?: string
    nextText?: string
    hideOnSinglePage?: boolean
  }>(),
  {
    small: true,
    disabled: false,
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 30, 50, 100],
    prevText: '',
    nextText: '',
    hideOnSinglePage: false
  }
)
</script>

<style scoped lang="scss">
.pagination {
  @apply m-p-10px;
}
</style>
