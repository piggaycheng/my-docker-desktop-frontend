<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const queryTab = route.query.tab

const tab = ref(queryTab)
const tabs = ["logs", "terminal"]
</script>

<template>
  <v-tabs v-model="tab">
    <v-tab value="logs">Logs</v-tab>
    <v-tab value="terminal">Terminal</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item v-for="tab in tabs" :key="tab" :value="tab">

    </v-window-item>
  </v-window>
</template>