<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <span class="components-center">
        <el-avatar
          shape="circle"
          :size="35"
          fit="fill"
          :src="userStore.getAvatar"
        />
        <span class="center-username">{{ userStore.getUsername }}</span>
      </span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <router-link to="/user/center"> 个人中心</router-link>
        </el-dropdown-item>
        <el-dropdown-item divided @click="handlerLogout">
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../../../store/modules/user'
import { logout } from '../../../api/login'

const userStore = useUserStore()
const handlerLogout = () => {
  ElMessageBox.confirm('您确认确认退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout().then(({ data }) => {
      switch (data.code) {
        case 200:
          ElMessage.success('注销成功')
          useUserStore().systemLogout()
          window.location.replace('/login')
          window.location.reload()
          break
        default:
          ElMessage.error('注销失败，请重试！')
      }
    })
  })
}
</script>

<style scoped lang="scss">
.components-center {
  height: 49px;
  min-width: 100px;
  max-width: 150px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: rgba(245, 245, 245, 0.8);
  }

  .center-username {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    font-size: 12px;
  }
}
</style>
