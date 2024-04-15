<template>
  <div>
    <v-row no-gutters align="center">
      <!-- <v-text-field
        class="dropShadow extraSlim pb-2 ps-2"
        density="compact"
        variant="plain"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        single-line
        hide-details
        v-model="pagination.search"
        style="max-width: 200px; max-height: 35px"
        center-affix
        @update:model-value="sendSearchTrigger_FCN"
      ></v-text-field> -->

      <v-spacer></v-spacer>
      <slot name="actionButtons"></slot>
    </v-row>
    <div class="mt-5" style="border: 1px solid #eaecf0; border-radius: 10px">
      <v-data-table-server
        items-per-page-text="Rows Per Page"
        fixed-header
        select-strategy="page"
        :loading="props.tableLdr"
        class="text-truncate dark"
        :headers="props.tableColumns"
        :items="props.tableData"
        item-value="id"
        :items-length="props.totalItems"
        :items-per-page="pagination.itemsPerPage"
        v-model:page="pagination.page"
        @update:options="sendTrigger"
        @click:row="onClick"
        hover
        style="border-radius: 10px"
      >
        <!-- <template v-for="slot of  slotNames" #[slot]>
                    <slot :name="slot" :item="props.tableData[index]"></slot>
                </template> -->

        <!-- pass through normal slots -->

        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
          <slot :name="slotName" v-bind="slotData" />
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <slot name="expansion" :item="item"> </slot>
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>

<style scoped>
:deep(.v-data-table-footer__items-per-page) {
  display: none !important;
}

:deep(.v-data-table__th) {
  font-weight: 700 !important;
  font-size: 20px !important;
}

:deep(.extraSlim .v-field__input) {
  padding-top: 5px !important;
  /* font-size: 14px !important; */
}
</style>


<script setup lang="ts">
import debounce from "lodash.debounce";

const props = defineProps({
  tableLdr: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  tableColumns: {
    type: Array as PropType<any[]>,
    required: true,
  },
  tableData: {
    type: Array as PropType<any[]>,
    required: true,
  },
  totalItems: {
    type: Number as PropType<number>,
    required: true,
  },
});

const pagination = ref({
  page: 1,
  itemsPerPage: 25,
  search: "",
});

interface Trigger {
  offset: number;
  limit: number;
  search: string;
}

// Emits
const emits = defineEmits<{
  (event: "trigger", val: Trigger): void;
  (event: "rowClick", val: any): void;
}>();

const sendTrigger = () => {
  let obj = {
    offset: (pagination.value.page - 1) * pagination.value.itemsPerPage,
    limit: pagination.value.itemsPerPage,
    search: pagination.value.search ?? "",
  };
  console.log("Trigger --> ", obj);
  emits("trigger", obj);
};

const onClick = (event: any, item: any) => {
  let ret = JSON.parse(JSON.stringify(item.item));
  console.log("onClick", ret);
  emits("rowClick", ret);
};

const sendSearchTrigger_FCN = debounce(() => {
  sendTrigger();
}, 500);

// ####### MOUNTED #######

onMounted(() => {});
</script>
