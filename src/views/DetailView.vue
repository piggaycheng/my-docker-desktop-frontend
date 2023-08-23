<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import { useGlobalStore } from "../stores/global"
import { Terminal } from "xterm"

const w = (window as any);
const route = useRoute()
const queryTab = route.query.tab
const containerId = route.query.id

const tab = ref(queryTab)

const logsTerminal = new Terminal();
const terminal = new Terminal({
  cursorBlink: true,
});
terminal.onData((data) => {
  w.process.send("mainPty", {
    "type": "container",
    "method": "inputPty",
    "data": data
  })
})
const logsXterm = ref()
const xterm = ref()
let termStart = false;
let logsTermStart = false;

const execCallback = (e: string) => {
  if (!termStart && e.charAt(e.length - 1) === '\n') {
    termStart = true;
    return;
  }
  if (termStart) {
    terminal.write(e)
  }
}

const logsCallback = (e: string) => {
  if (!logsTermStart && e.charAt(e.length - 1) === '\n') {
    logsTermStart = true;
    return;
  }
  if (logsTermStart) {
    logsTerminal.write(e)
  }
}

const globalStore = useGlobalStore();

onMounted(() => {
  globalStore.showSidebar = false;
  globalStore.showAppBarBackBtn = true;

  terminal.open(xterm.value);
  w.process.listen("replyExecPty", execCallback)
  execContainer()

  logsTerminal.open(logsXterm.value);
  w.process.listen("replyLogsPty", logsCallback)
  getContainerLogs()
})

onUnmounted(() => {
  globalStore.showSidebar = true;
  globalStore.showAppBarBackBtn = false;

  w.process.send("mainPty", {
    "type": "container",
    "method": "exitExec"
  })

  w.process.send("mainPty", {
    "type": "container",
    "method": "exitLogs"
  })

  w.process.listenOff("replyExecPty")
  w.process.listenOff("replyLogsPty")
})

function getContainerLogs() {
  w.process.send("mainPty", {
    "type": "container",
    "method": "getContainerLogs",
    "containerId": containerId
  })
}

function execContainer() {
  w.process.send("mainPty", {
    "type": "container",
    "method": "execContainer",
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
    <v-window-item value="logs" eager>
      <div ref="logsXterm"></div>
    </v-window-item>
    <v-window-item value="terminal" eager>
      <div ref="xterm"></div>
    </v-window-item>
  </v-window>
</template>