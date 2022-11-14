<template>
  <!--全屏组件-->
  <div class="full-screen" @click="toggleFullScreen">
    <el-icon :size="20">
      <component is="FullScreen" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
</script>

<style scoped lang="scss">
.full-screen {
  width: 50px;
  height: 50px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(245, 245, 245, 0.8);
  }
}
</style>
