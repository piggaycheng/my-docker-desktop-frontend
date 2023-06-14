import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const appBarTitle = ref("")
  const showAppBarBackBtn = ref(false)
  const showSidebar = ref(true)

  return { appBarTitle, showSidebar, showAppBarBackBtn }
})
