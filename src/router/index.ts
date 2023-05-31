import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImagesView from '../views/ImagesView.vue'
import { useGlobalStore } from "../stores/global"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/images',
      name: 'Images',
      component: ImagesView
    },
    {
      path: '/containers',
      name: 'Containers',
      component: HomeView
    }
  ]
})

router.beforeEach((to) => {
  const globalStore = useGlobalStore();
  globalStore.appBarTitle = to.name as string
})

export default router
