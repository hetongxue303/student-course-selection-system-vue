<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { User } from '../../types/entity'
import { getUserCenter, updateUser } from '../../api/user'
import { useUserStore } from '../../store/modules/user'
import { cloneDeep } from 'lodash'
import { ElNotification } from 'element-plus'

const activeName = ref<string>('userinfo')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  nickName: [
    {
      required: true,
      message: '请输入以后昵称',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入电话',
      trigger: 'blur',
      type: 'number'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '邮箱地址不正确',
      trigger: ['blur', 'change']
    }
  ]
})
const handleSave = async () => {
  const { data } = await updateUser(userinfo.value)
  if (data.code === 200) {
    ElNotification.success('编辑成功')
    return
  }
  ElNotification.error('编辑失败,请重试！')
}

const userStore = useUserStore()
const userinfo = ref<User>({})
const centerInfo = async () => {
  const { data } = await getUserCenter(userStore.getUsername)
  if (data.code === 200) userinfo.value = cloneDeep(data.data)
}

onMounted(() => centerInfo())
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <span>个人信息</span>
        </template>
        <div
          style="display: flex; align-items: center; justify-content: center"
        >
          <el-avatar
            :src="userStore.getAvatar"
            style="width: 150px; height: 150px; cursor: pointer"
            alt="点击上传头像"
          />
        </div>
        <div
          style="display: flex; align-items: center; justify-content: center"
        ></div>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="用户资料" name="userinfo">
            <el-form
              ref="ruleFormRef"
              :model="userinfo"
              :rules="rules"
              label-width="80px"
            >
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="userinfo.nickName" type="text" />
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="userinfo.phone" type="number" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userinfo.email" type="text" />
              </el-form-item>
              <el-form-item
                label="性别"
                prop="gender"
                style="display: flex; align-items: center"
              >
                <el-radio-group v-model="userinfo.gender">
                  <el-radio :label="'1'" size="large">男</el-radio>
                  <el-radio :label="'2'" size="large">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="handleSave">
                  保存信息
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="operate-log">
            待开发...
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 300px;
}
</style>
