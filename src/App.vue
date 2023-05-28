<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { useGlobalStore } from "./stores/global"

const globalStore = useGlobalStore();
</script>

<template>
  <v-layout>
    <Sidebar></Sidebar>
    <v-app-bar :title="globalStore.appBarTitle"></v-app-bar>
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