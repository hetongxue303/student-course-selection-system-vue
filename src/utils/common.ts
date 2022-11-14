import { Router } from 'vue-router'

/**
 * 设置浏览器标题
 * @param router 路由
 */
export const setBrowserTitle = (router: Router) => {
  if (typeof router.currentRoute.value.meta.title === 'string') {
    document.title = router.currentRoute.value.meta.title as string
  }
}
