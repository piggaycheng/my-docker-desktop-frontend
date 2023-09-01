<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { VDataTable } from 'vuetify/labs/components';
import { useRouter } from 'vue-router';
import { useReplyMessage, useListener } from '../hooks/MainPty'

const w = (window as any);
const imageListReplyMessage = useReplyMessage("getImages")
const data = computed(() => {
  let result = []
  try {
    result = JSON.parse(imageListReplyMessage.replyMessage.value as any)
  } catch { }
  return result
});
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
    title: 'Size',
    key: 'Size',
  },
  {
    title: 'Created',
    key: 'CreatedSince',
  }, {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  }],
})
const router = useRouter()

const mainCallback = (e: any) => {
  switch (e.originMessage.method) {
    case "getImages":
      imageListReplyMessage.appendReplyMessage(e.data)
      break;
    case "runImage":
      router.push({ path: "/containers" })
      break;
    default:
      break;
  }
}

useListener("replyMainPty", mainCallback)

onMounted(() => {
  w.process.send("mainPty", {
    "type": "image",
    "method": "getImages"
  })
})

const runImage = (imageId: string) => {
  window.postMessage({
    "type": "image",
    "method": "runImage",
    "imageId": imageId
  })
}
</script>

<template>
  <div>
    <v-data-table :items="data" item-value="ID" :headers="dataTableConfig.headers"
      :items-per-page="dataTableConfig.itemsPerPage">
      <template v-slot:item.actions="{ item }">
        <v-btn variant="flat" size="small" class="me-2" icon="mdi-play" @click="runImage(item.value)"></v-btn>
        <v-btn variant="flat" size="small" class="me-2" icon="mdi-delete"></v-btn>
        <v-btn variant="flat" size="small" icon="mdi-dots-horizontal"></v-btn>
      </template>
    </v-data-table>
  </div>
</template>
