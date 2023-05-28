import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const appBarTitle = ref("")

  return { appBarTitle }
})
