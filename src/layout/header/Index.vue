<template>
  <div class="header-parent">
    <div class="left">
      <!--折叠-->
      <Collapse />
      <Breadcrumb />
    </div>
    <div class="right">
      <!--全屏-->
      <full-screen class="components-space" />
      <!--个人中心-->
      <Center />
    </div>
  </div>
</template>

<script setup lang="ts">
import Collapse from './components/Collapse.vue'
import FullScreen from './components/FullScreen.vue'
import Center from './components/Center.vue'
import Breadcrumb from '../../components/Breadcrumb/Index.vue'
</script>

<style scoped lang="scss">
.header-parent {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;

  .left {
    width: 50%;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .right {
    width: 50%;
    display: flex;
    justify-content: end;

    .components-space {
      margin-right: 5px;
    }
  }
}
</style>
