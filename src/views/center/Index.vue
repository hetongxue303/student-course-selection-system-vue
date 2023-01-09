<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { User } from '../../types/entity'
import { getUserCenter, updateUser } from '../../api/user'
import { useUserStore } from '../../store/modules/user'
import { cloneDeep } from 'lodash'
import { ElNotification } from 'element-plus'
import moment from 'moment'

const activeName = ref<string>('userinfo')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  nickName: [
    {
      required: true,
      message: '用昵称不能为空',
      trigger: 'blur'
    }
  ],
  realName: [
    {
      required: true,
      message: '姓名不能为空',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '电话不能为空',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '邮箱地址不正确',
      trigger: ['blur', 'change']
    }
  ]
})
const updateInfo = ref<User>({})
const handleSave = async () => {
  const { data } = await updateUser(updateInfo.value)
  if (data.code === 200) {
    ElNotification.success('编辑成功')
    await centerInfo()
    return
  }
  ElNotification.error('编辑失败,请重试！')
}

const userStore = useUserStore()
const userinfo = ref<User>({})
const centerInfo = async () => {
  const { data } = await getUserCenter(userStore.getUsername)
  if (data.code === 200) {
    userinfo.value = cloneDeep(data.data)
    updateInfo.value = cloneDeep(data.data)
  }
}

onMounted(() => centerInfo())

const passwordDialog = ref<boolean>(false)
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <span>个人信息</span>
        </template>
        <div class="avatar">
          <el-avatar :src="useUserStore().getAvatar" />
        </div>
        <ul>
          <li>
            <div class="item">
              <span>登陆账号</span>
              <span>{{ userinfo.username }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>用户昵称</span>
              <span>{{ userinfo.nickName }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span v-role="['admin']">用户姓名</span>
              <span v-role="['teacher']">教师姓名</span>
              <span v-role="['student']">学生姓名</span>
              <span>{{ userinfo.realName }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
              <span>{{ userinfo.gender === '1' ? '男' : '女' }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>手机号码</span>
              <span>{{ userinfo.phone }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>用户邮箱</span>
              <span>{{ userinfo.email }}</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>注册时间</span>
              <span>
                {{ moment(userinfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>安全设置</span>
              <div>
                <el-link
                  :underline="false"
                  style="color: #317ef3; margin-right: 5px; font-size: 13px"
                  @click="passwordDialog = true"
                >
                  修改密码
                </el-link>
                <el-link
                  :underline="false"
                  style="color: #317ef3; font-size: 13px"
                  @click="handleOpenDialog"
                >
                  修改邮箱
                </el-link>
              </div>
            </div>
          </li>
        </ul>
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
              label-width="50px"
            >
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="updateInfo.nickName" type="text" />
              </el-form-item>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="updateInfo.realName" type="text" />
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="updateInfo.phone" type="number" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="updateInfo.email" type="text" />
              </el-form-item>
              <el-form-item
                label="性别"
                prop="gender"
                style="display: flex; align-items: center"
              >
                <el-radio-group v-model="updateInfo.gender">
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

  <!--修改密码-->
  <el-dialog v-model="passwordDialog" title="修改密码" width="30%">
    内容
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordDialog = false">返回</el-button>
        <el-button type="primary" @click="passwordDialog = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 300px;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type='number']) {
  -moz-appearance: textfield !important;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}

:deep(.el-avatar) {
  height: 120px;
  width: 120px;
}
</style>
