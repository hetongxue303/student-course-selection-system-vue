<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <div class="components-center">
        <el-avatar
          shape="circle"
          :size="35"
          fit="fill"
          :src="userStore.getAvatar"
        />
        <span class="center-username">{{ userStore.getUsername }}</span>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <span>布局设置</span>
        </el-dropdown-item>
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
import { useCookies } from '@vueuse/integrations/useCookies'
import { settings } from '../../../settings'

const userStore = useUserStore()

const handlerLogout = async () => {
  ElMessageBox.confirm('您确认确认退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data } = await logout()
    const cookies = useCookies()
    switch (data.code) {
      case 200:
        userStore.systemLogout()
        cookies.remove(settings.AUTHORIZATION_KEY)
        ElMessage.success('注销成功')
        window.location.replace('/login')
        break
      default:
        ElMessage.error('注销失败')
    }
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
