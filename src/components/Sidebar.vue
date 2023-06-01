<script setup lang="ts">
import { ref } from "vue"

const items = ref([
  { text: 'Home', to: '/' },
  { text: 'Images', to: '/images' },
  { text: 'Containers', to: '/containers' },
])
</script>

<template>
  <v-navigation-drawer permanent absolute>
    <v-list density="compact" nav>
      <v-list-item v-for="(item, i) in items" :key="i" :value="item" color="primary" :to="item.to">
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>