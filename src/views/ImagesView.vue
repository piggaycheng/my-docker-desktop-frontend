<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { VDataTable } from 'vuetify/labs/components';
import { useRouter } from 'vue-router';

const w = (window as any);
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

const messageCallback = (e: MessageEvent) => {
  if (e.data["origin-message"]) {
    switch (e.data["origin-message"].method) {
      case "getImages":
        data.value = JSON.parse(e.data.content)
        break;
      case "runImage":
        router.push({ path: "/containers" })
        break;
      default:
        break;
    }
  }
}

let isContent = false;
let content = "";

const mainCallback = (e: any) => {
  if (isContent) {
    content += e
  }

  if (e.charAt(e.length - 1) === '\n' && !isContent) {
    isContent = !isContent
  } else if (e.charAt(e.length - 1) === '\n' && isContent) {
    isContent = !isContent

    data.value = JSON.parse(`[${content.split("\n").filter(a => a).join(",")}]`)
  }
}

onMounted(() => {
  w.process.listen("replyMainPty", mainCallback)
  w.process.send("mainPty", {
    "type": "image",
    "method": "getImages"
  })
})

onUnmounted(() => {
  w.process.listenOff("replyMainPty")
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
