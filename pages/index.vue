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
            @click="downloadFnc"
            >Download XLSX</v-btn
          >
          <v-btn
            color="primaryColor"
            class="text-capitalize mx-1"
            height="35"
            small
            @click="downloadFnc1"
            >Download XLSX 1</v-btn
          >
        </v-row>
      </template>
    </CommonReportTable>
  </div>
</template>


<script setup lang="ts">
import writeXlsxFile from "write-excel-file";
import Excel from "exceljs";

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

const schema = [
  {
    column: "Name",
    type: String,
    value: (val) => val.name,
  },
  {
    column: "Date",
    type: Date,
    format: "dd/mm/yyyy",
    value: (val) => val.date,
  },
  {
    column: "Time",
    type: String,
    format: "hh:mm:ss",
    value: (val) => val.time,
  },
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

const downloadFnc = async () => {
  console.log("Download Triggered", [...tableData.value]);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  const wsColumns = [
    { key: "name", header: "Name" },
    { key: "date", header: "Date" },
    { key: "time", header: "Time" },
  ];

  worksheet.columns = wsColumns;

  tableData.value.forEach((el) => {
    worksheet.addRow(el);
  });

  await workbook.xlsx.writeFile("report.xlsx");
};

const downloadFnc1 = async () => {
  console.log("Download Triggered", [...tableData.value]);

  await writeXlsxFile([...tableData.value], {
    schema,
    fileName: "report1.xlsx",
  });
  let headers = [
    { value: "Name", fontWeight: "bold" },
    { value: "Date", fontWeight: "bold" },
    { value: "Time", fontWeight: "bold" },
  ];
  let data = tableData.value.map((el) => {
    return [el.name, el.date, el.time];
  });

  let finalData = [headers, ...data];
  console.log("Final Data", finalData);

  await writeXlsxFile(finalData, {
    fileName: "report2.xlsx",
  });
};

onMounted(() => {
  //   reloadlist({ offset: 0, limit: 10, search: "" });/
});
</script>
