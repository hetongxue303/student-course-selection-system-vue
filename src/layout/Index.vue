<template>
  <el-container>
    <el-aside>
      <Sidebar :is-collapse="appStore.getCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <!--      <Tab />-->
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from '@layout/sidebar/Index.vue'
import Header from '@layout/header/Index.vue'
import Footer from '@layout/footer/Index.vue'
// import Tab from '@components/Tabs/Index.vue'
import { useAppStore } from '../store/modules/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
:deep(.el-container) {
  height: 100vh;
  width: 100vw;
  background-color: white;
}

:deep(.el-aside) {
  height: 100vh;
  width: auto;
}

:deep(.el-header) {
  padding: 0;
  margin: 0;
  width: auto;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.el-main) {
  height: 100%;
  width: 100%;
}

:deep(.el-footer) {
  height: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
