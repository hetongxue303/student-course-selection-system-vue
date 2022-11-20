import { Router } from 'vue-router'

export const setBrowserTitle = (router: Router) => {
  if (typeof router.currentRoute.value.meta.title === 'string') {
    document.title = router.currentRoute.value.meta.title as string
  }
}
