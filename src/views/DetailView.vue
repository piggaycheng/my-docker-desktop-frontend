<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useGlobalStore } from "../stores/global"

const route = useRoute()
const queryTab = route.query.tab
const containerId = route.query.id

const tab = ref(queryTab)

const containerLogs = ref("")

const messageCallback = (e: MessageEvent) => {
  if (e.data["origin-message"]) {
    switch (e.data["origin-message"].method) {
      case "getContainerLogs":
        containerLogs.value += e.data.content;
        break;
      default:
        break;
    }

  }
}

const globalStore = useGlobalStore();

onMounted(() => {
  window.addEventListener("message", messageCallback)
  globalStore.showSidebar = false;
  globalStore.showAppBarBackBtn = true;
})

onUnmounted(() => {
  window.removeEventListener("message", messageCallback)
  window.postMessage({
    "type": "container",
    "method": "killSubProcess",
    "processKey": "logs"
  })
  globalStore.showSidebar = true;
  globalStore.showAppBarBackBtn = false;
})

watch(tab, (newVal, oldVal) => {
  if (newVal === "logs") {
    getContainerLogs()
  }
}, {
  immediate: true
})

function getContainerLogs() {
  window.postMessage({
    "type": "container",
    "method": "getContainerLogs",
    "containerId": containerId
  })
}
</script>

<template>
  <v-tabs v-model="tab">
    <v-tab value="logs">Logs</v-tab>
    <v-tab value="terminal">Terminal</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="logs">
      <pre>{{ containerLogs }}</pre>
    </v-window-item>
  </v-window>
</template>