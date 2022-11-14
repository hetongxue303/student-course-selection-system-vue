<template>
  <div class="footer-text">
    <span
      >© 2022 Class Admin&nbsp;
      <el-link :underline="false" href="#">Apache License 2.0</el-link>
      &nbsp;⋅&nbsp;
      <el-link :underline="false" href="#">渝ICP备18xxx431号-8</el-link>
    </span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.footer-text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;

  span,
  .el-link {
    color: #7a8b9a;
    font: 12px Arial, sans-serif;
  }
}
</style>
