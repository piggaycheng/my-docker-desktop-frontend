<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { useGlobalStore } from "./stores/global"

const globalStore = useGlobalStore();
const router = useRouter();

const backHandler = () => {
  router.go(-1);
}
</script>

<template>
  <v-layout>
    <Sidebar v-model="globalStore.showSidebar"></Sidebar>
    <v-app-bar :title="globalStore.appBarTitle">
      <template #prepend>
        <v-btn v-if="globalStore.showAppBarBackBtn" variant="flat" icon @click="backHandler">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<style scoped>
.v-main {
  min-height: 100vh;
}
</style>