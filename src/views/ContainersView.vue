<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { VDataTable } from 'vuetify/labs/components';

const data = ref([]);
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
        getContainers();
        break;
      default:
        break;
    }

  }
}

onMounted(() => {
  window.addEventListener("message", messageCallback)
  getContainers()
})

onUnmounted(() => {
  window.removeEventListener("message", messageCallback)
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
</script>

<template>
  <div>
    <v-data-table :items="data" item-value="ID" :headers="dataTableConfig.headers"
      :items-per-page="dataTableConfig.itemsPerPage">
      <template v-slot:item.actions="{ item }">
        <v-btn variant="flat" size="small" class="me-2" icon="mdi-play"></v-btn>
        <v-btn variant="flat" size="small" class="me-2" icon="mdi-delete" @click="removeContainer(item.value)"></v-btn>
        <v-btn variant="flat" size="small" icon="mdi-dots-horizontal"></v-btn>
      </template>
    </v-data-table>
  </div>
</template>