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
    title: 'Repository',
    key: 'Repository',
  }, {
    title: 'Tag',
    key: 'Tag',
  }, {
    title: 'Created',
    key: 'CreatedSince',
  }],
})

const messageCallback = (e: MessageEvent) => {
  if (e.data["origin-message"]) {
    data.value = JSON.parse(e.data.content)
  }
}

onMounted(() => {
  window.addEventListener("message", messageCallback)
  window.postMessage({
    "type": "image",
    "method": "getImages"
  })
})

onUnmounted(() => {
  window.removeEventListener("message", messageCallback)
})
</script>

<template>
  <div>
    <v-data-table :items="data" item-value="ID" :headers="dataTableConfig.headers"
      :items-per-page="dataTableConfig.itemsPerPage">
    </v-data-table>
  </div>
</template>
