<template>
  <div v-if="!collapse" class="logo_content">
    <img src="https://eladmin.vip/demo/static/img/logo.381d6a3e.png" alt="" />
    <span v-show="false">Class-Admin</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  collapse: { type: Boolean, required: true, default: false }
})
</script>

<style scoped lang="scss">
.logo_content {
  width: auto;
  height: 50px;
  background-color: #304156;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 40px;
    width: 40px;
  }

  span {
    color: white;
    font-size: 18px;
    margin-left: 5px;
  }
}
</style>
