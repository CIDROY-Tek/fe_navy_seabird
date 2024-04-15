<template>
  <div class="pa-5">
    <CommonReportTable
      :table-columns="headers"
      :table-data="tableData"
      :total-items="tableTotal"
      :table-ldr="tableLdr"
      @trigger="reloadlist"
    >
      <template #actionButtons>
        <v-row no-gutters align="center" justify="end">
          <v-btn
            color="primaryColor"
            class="text-capitalize mx-1"
            height="35"
            small
            @click="saveToExcel"
            >Download Report</v-btn
          >
        </v-row>
      </template>
    </CommonReportTable>
  </div>
</template>


<script setup lang="ts">
import writeXlsxFile from "write-excel-file";

useHead({
  title: "Reports",
});

interface Trigger {
  offset: number;
  limit: number;
  search: string;
}

const headers = [
  { title: "Name", key: "name" },
  { title: "Date", key: "date", width: "200" },
  { title: "Time (24 Hrs)", key: "time", width: "200" },
];

const tableData = ref([] as any[]);
const tableTotal = ref(0 as number);
const tableLdr = ref(false as boolean);

const reloadlist = async (val: Trigger) => {
  console.log("Reload Triggered", val);
  // If Val is null, then it is called from mounted
  tableLdr.value = true;
  let ip = await $fetch(
    `/api_base/incompleteCheckoutReport?limit=${val.limit}&offset=${val.offset}&search=${val.search}`
  );
  console.log("Data Fetched", ip);
  let arr = ip.data.map((el: any) => {
    return {
      name: el.first_name,
      date: el.checktime.split(" ")[0] || "-",
      time: el.checktime.split(" ")[1] || "-",
    };
  });
  tableData.value = arr ?? [];
  tableTotal.value = ip.pagination.total ?? 0;
  tableLdr.value = false;
};

const saveToExcel = async () => {
  let dataObj = [];
  let ip = await $fetch(
    `/api_base/incompleteCheckoutReport?limit=1000000&offset=0`
  );
  if (ip.data.length > 0) {
    dataObj = ip.data.map((el: any) => {
      return {
        name: el.first_name,
        date: !!el.checktime.split(" ")[0]
          ? new Date(el.checktime.split(" ")[0])
          : "",
        time: el.checktime.split(" ")[1] || "",
      };
    });
    let dataSchema = [
      {
        column: "Name",
        type: String,
        value: (val) => val.name,
        width: 50,
        align: "left",
      },
      {
        column: "Date",
        type: Date,
        format: "dd/mm/yyyy",
        value: (val) => val.date,
        width: 30,
        align: "left",
      },
      {
        column: "Time (in 24 Hrs)",
        type: String,
        value: (val) => val.time,
        width: 30,
        align: "left",
      },
    ];
    console.log("Download Triggered 2", dataObj, dataSchema);

    await writeXlsxFile(dataObj, {
      schema: dataSchema,
      stickyRowsCount: 1,
      sheet: "Report",
      fileName: "Report.xlsx",
    });
  } else {
    alert("No Data Found");
  }
};

onMounted(() => {
  //   reloadlist({ offset: 0, limit: 10, search: "" });/
});
</script>
