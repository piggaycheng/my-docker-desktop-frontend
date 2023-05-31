import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImagesView from '../views/ImagesView.vue'
import ContainersView from '../views/ContainersView.vue'
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
      component: ContainersView
    }
  ]
})

router.beforeEach((to) => {
  const globalStore = useGlobalStore();
  globalStore.appBarTitle = to.name as string
})

export default router
