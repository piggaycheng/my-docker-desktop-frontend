<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useGlobalStore } from "../stores/global"
import { Terminal } from "xterm"

const w = (window as any);
const route = useRoute()
const queryTab = route.query.tab
const containerId = route.query.id

const tab = ref(queryTab)

const containerLogs = ref("")
const terminal = new Terminal({
  cursorBlink: true,
});
terminal.onData((data) => {
  w.process.send("inputPty", data)
})
const xterm = ref()
let termStart = false;

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

const execCallback = (e: string) => {
  if (!termStart && e.charAt(e.length - 1) === '\n') {
    termStart = true;
    return;
  }
  if (termStart) {
    terminal.write(e)
  }
}

const globalStore = useGlobalStore();

onMounted(() => {
  // window.addEventListener("message", messageCallback)
  globalStore.showSidebar = false;
  globalStore.showAppBarBackBtn = true;

  terminal.open(xterm.value);

  w.process.send("toMain", {
    "type": "container",
    "method": "execContainer",
    "containerId": containerId
  })

  w.process.receive("fromMain", execCallback)
})

onUnmounted(() => {
  // window.removeEventListener("message", messageCallback)
  // window.postMessage({
  //   "type": "container",
  //   "method": "killSubProcess",
  //   "processKey": "logs"
  // })
  globalStore.showSidebar = true;
  globalStore.showAppBarBackBtn = false;
})

watch(tab, (newVal, oldVal) => {
  if (newVal === "logs") {
    // getContainerLogs()
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
    <v-window-item value="terminal">
      <div ref="xterm"></div>
    </v-window-item>
  </v-window>
</template>