<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { VDataTable } from 'vuetify/labs/components';
import { useReplyMessage, useSendMessage, useListener, type CallbackEvent } from '../hooks/MainPty'

const containerListReplyMessage = useReplyMessage("getContainers")
const { sendMessage } = useSendMessage()
const data = computed(() => {
  let result = []
  try {
    result = JSON.parse(containerListReplyMessage.replyMessage.value as any)
  } catch { }
  return result
});
const dataTableConfig = ref({
  itemsPerPage: 5,
  headers: [{
    title: 'ID',
    key: 'ID',
  }, {
    title: 'Name',
    key: 'Names',
  }, {
    title: 'Image',
    key: 'Image',
  }, {
    title: 'Port',
    key: 'Ports',
  }, {
    title: 'Status',
    key: 'Status',
  }, {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  }],
})

const messageCallback = (e: MessageEvent) => {
  if (e.data["origin-message"]) {
    switch (e.data["origin-message"].method) {
      case "getContainers":
        data.value = JSON.parse(e.data.content)
        break;
      case "removeContainer":
      case "startContainer":
      case "stopContainer":
        getContainers();
        break;
      default:
        break;
    }

  }
}

const mainCallback = (e: CallbackEvent) => {
  switch (e.originMessage.method) {
    case "getContainers":
      containerListReplyMessage.appendReplyMessage(e.data)
      break;
    default:
      break;
  }
}

useListener("replyMainPty", mainCallback)

onMounted(() => {
  sendMessage("mainPty", "container", "getContainers")
})

function getContainers() {
  window.postMessage({
    "type": "container",
    "method": "getContainers"
  })
}

function removeContainer(containerId: string) {
  window.postMessage({
    "type": "container",
    "method": "removeContainer",
    "containerId": containerId
  })
}

function startContainer(containerId: string) {
  window.postMessage({
    "type": "container",
    "method": "startContainer",
    "containerId": containerId
  })
}

function stopContainer(containerId: string) {
  window.postMessage({
    "type": "container",
    "method": "stopContainer",
    "containerId": containerId
  })
}

const moreItems = [{
  "title": "Logs",
  "to": "Detail",
  "query": { tab: "logs" }
}, {
  "title": "Terminal",
  "to": "Detail",
  "query": { tab: "terminal" }
}]
</script>

<template>
  <div>
    <v-data-table :items="data" item-value="ID" :headers="dataTableConfig.headers"
      :items-per-page="dataTableConfig.itemsPerPage">
      <template v-slot:item.actions="{ item }">
        <v-btn v-if="item.raw.State === 'exited'" variant="flat" size="small" class="me-2" icon="mdi-play"
          @click="startContainer(item.value)"></v-btn>
        <v-btn v-else-if="item.raw.State === 'running'" variant="flat" size="small" class="me-2" icon="mdi-pause"
          @click="stopContainer(item.value)"></v-btn>
        <v-btn variant="flat" size="small" class="me-2" icon="mdi-delete" @click="removeContainer(item.value)"></v-btn>
        <v-btn variant="flat" size="small" icon>
          <v-icon>mdi-dots-horizontal</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item v-for="(moreItem, index) in moreItems" :key="index" :value="index"
                :to="{ name: moreItem.to, query: Object.assign(moreItem.query, { id: item.raw.ID }) }">
                <v-list-item-title>{{ moreItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
