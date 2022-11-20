<template>
  <el-tabs
    v-show="tabs.length > 0"
    v-model="activeTab"
    type="card"
    class="tabs"
    @tab-click="handleTabClick"
    @tab-remove="handleRemoveTab"
    @mousedown="mouseDown($event)"
    @contextmenu.prevent="contextMenu($event)"
  >
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="item.path"
      :label="item.title"
      :name="item.path"
      :closable="index !== 0"
      class="tab-pane"
    ></el-tab-pane>
  </el-tabs>

  <ul
    v-show="isContextMenu"
    :style="{ left: left + 'px', top: top + 'px' }"
    class="contextMenu"
  >
    <li @click="refreshTab(tabStore.getCurrentTabName)">刷新</li>
    <li
      v-show="tabStore.getCurrentTabName !== 'dashboard'"
      @click="closeTab(tabStore.getCurrentTabName)"
    >
      关闭
    </li>
    <li @click="closeOtherTab(tabStore.getCurrentTabName)">关闭其他</li>
    <li @click="closeAllTab">关闭所有</li>
  </ul>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useTabStore } from '../../store/modules/tabs'
import { useRoute, useRouter } from 'vue-router'
import { settings } from '../../settings'
import { session } from '../../utils/storage'

const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()

const activeTab = computed({
  set: (value: string) => {
    tabStore.setActiveName(value)
  },
  get: (): string => {
    return tabStore.getActiveName
  }
})

const tabs = computed(() => {
  return tabStore.getTabs
})

const handleTabClick = (tab: any) => router.push(tab.props.name)

const handleRemoveTab = (currentPath: string) => {
  if (currentPath === '/dashboard') return
  const index = tabs.value.findIndex((tab) => tab.path === currentPath)
  const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
  activeTab.value = nextTab.path
  tabStore.setTabs(tabs.value.filter((tab) => tab.path !== currentPath))
  router.push(activeTab.value)
}

const left = ref<number>()
const top = ref<number>()
const isContextMenu = computed({
  set: (value) => {
    tabStore.setIsContextMenu(value as boolean)
  },
  get: () => {
    return tabStore.getIsContextMenu
  }
})

const contextMenu = (e: any) => {
  if (e.srcElement.id) {
    left.value = e.clientX
    top.value = e.clientY + 10
    tabStore.setIsContextMenu(true)
    tabStore.setCurrentTabName(
      e.srcElement.id.substring(4, e.srcElement.id.length)
    )
  }
}

// const removeSessionStorage = () => {
//   session.setNoEncrypt(settings.TABS_INFO_KEY, JSON.stringify(tabs.value))
//   tabStore.setIsContextMenu(false)
// }

// const refresh = () => {
//   const { path } = route
//   // 刷新之前存储数据
//   window.addEventListener('beforeunload', () =>
//     session.setNoEncrypt(settings.TABS_INFO_KEY, JSON.stringify(tabs.value))
//   )
//   const sessionTabsData = session.getNoDecrypt(settings.TABS_INFO_KEY)
//   if (sessionTabsData) {
//     // 设置刷新前的tab数据
//     tabStore.setTabs(JSON.parse(sessionTabsData))
//     // 设置刷新前选中的选项卡
//     tabStore.setActiveName(path as string)
//   }
// }

const refreshTab = (currentTabName: string) => {
  router.push(currentTabName)
  tabStore.setIsContextMenu(false)
}

const closeTab = (currentTabName: string) => {
  handleRemoveTab(currentTabName)
  tabStore.setIsContextMenu(false)
}

const closeOtherTab = (currentTabName: string) => {
  const index = tabs.value.findIndex((tab) => tab.path === currentTabName)
  tabs.value.splice(1, index - 1)
  tabs.value.splice(2, tabs.value.length)
  tabStore.setTabs(tabs.value)
  tabStore.setActiveName(currentTabName)
  router.push(currentTabName)
  tabStore.setIsContextMenu(false)
}

const closeAllTab = () => {
  tabs.value.splice(1, tabs.value.length)
  tabStore.setActiveName(tabs.value[0].path)
  router.push(tabStore.getActiveName)
  tabStore.setIsContextMenu(false)
}

const mouseDown = (e: any) => {
  if (e.button === 0) {
    tabStore.setIsContextMenu(false)
  }
}

watch(
  () => route.path,
  () => {
    activeTab.value = route.path
    tabStore.addTab({ title: route.meta.title, path: route.path })
  },
  { immediate: true }
)

// onMounted(() => {
//   refresh()
// })
</script>

<style scoped lang="scss">
.tabs {
  height: 30px;
  line-height: 30px;
  width: 100%;
}

:deep(.el-tabs__item) {
  position: relative;
  padding: 0 8px;
  height: 26px;
  font-size: 12px;
  display: inline-block;
  line-height: 26px;
  color: #495060;
  margin-top: 1.5px;
  margin-left: 4px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  text-rendering: optimizeLegibility;
}

:deep(.is-active) {
  background-color: #42b983;
  border-color: #42b983;
}

:deep(.el-tabs__item.is-active) {
  color: white;
}

.contextMenu {
  width: auto;
  margin: 0;
  border: 1px solid #ccc;
  background: #ffffff;
  z-index: 2000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);

  li {
    cursor: pointer;
    padding: 7px 16px;

    &:hover {
      background-color: rgba(100, 100, 100, 0.1);
    }
  }
}
</style>
