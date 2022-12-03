<template>
  <el-dropdown trigger="hover">
    <span class="el-dropdown-link">
      <div class="components-center">
        <el-avatar
          shape="circle"
          :size="30"
          src="https://p26-passport.byteacctimg.com/img/user-avatar/7eb085af8382dfa92ed6fb9a4aea448c~300x300.image"
        />
        <span class="center-username">管理员</span>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>布局设置</el-dropdown-item>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item divided @click="dialogVisible = true"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!--对话框-->
  <el-dialog
    v-model="dialogVisible"
    title="确认退出"
    width="35%"
    top="0"
    align-center
  >
    <span>您确认确认退出系统吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">返回</el-button>
        <el-button type="success" @click="handlerLogout">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../../store/modules/user'
import { logout } from '../../../api/login'

// 实例化
const userStore = useUserStore()
const dialogVisible = ref(false)

// 注销处理
const handlerLogout = async () => {
  const { data } = await logout()
  switch (data.code as number) {
    case 200:
      await userStore.systemLogout()
      ElMessage.success('注销成功')
      window.location.replace('/login')
      break
    default:
      ElMessage.error('注销失败')
  }
}
</script>

<style scoped lang="scss">
.components-center {
  width: 100px;
  height: 49px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  cursor: pointer;

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
