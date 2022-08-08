<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import path from "path-browserify";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBFooter,
  MDBIcon
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

DataTable.use(DataTableBs5);
DataTable.use(Select);

let dt1;
const table1 = ref(); 
const data1 = ref([]);

// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();

  dt1.on('select', function (e, dt, type, indexes) {
    updateCaseContext(e, dt, type, indexes);
  });
});

// 案件資料顯示更新
function updateCaseContext(e, dt, type, indexes) {
  if (type === 'row') {
    let getCaseData = dt.rows(indexes).data()[0];
  }
}

// 設定表格table1
const columns1 = [
  { data: "id", title: "索引", visible: false },
  { data: "status_code", title: "狀態編號", className: "colnowarp" },
  { data: "case_status.status", title: "狀態" },
  // { data: "doc_type", title: "類型", visible: false },
  // { data: "name", title: "文件名稱" },
  // { data: "ver", title: "版次" },
  {
    data: "app_date", title: "申請日", className: "colnowarp", defaultContent: "", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }
  },
  // { data: "parent_id", title: "上階文件", visible: false },
  // {
  //   data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "", render: (data) => {
  //     let ttdate = ""
  //     if (data) { ttdate = data.split("T")[0]; }
  //     return ttdate;
  //   }
  // },
  // { data: "upload", title: "掃描檔", visible: false },
  // { data: "editable_upload", title: "編輯檔", visible: false },
  // { data: "comment", title: "備註" }
];
const tboption1 = {
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'asc']],
  scrollY: '35vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 查詢案件資料
const { result: allCase, loading: lodingAllCase, variables: varAllCase, onResult: getAllCase, refetch: refgetAllCase } = useQuery(
  CaseGQL.GETALLCASE,
);

getAllCase(result => {
  // 加入table1資料
  if (!result.loading) {
    data1.value = result.data.getAllCase;
  }
});

</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBContainer tag="main" fluid class="flex-grow-1">
        <MDBRow class="d-flex flex-md-column h-100 border">
          <!-- 左方列表 -->
          <MDBCol md="8" class="h-100 border">
            <!-- 上方列表 -->
            <MDBRow md="12" class="h-75 overflow-auto border">
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBRow>
            <!-- 下方篩選 -->
            <MDBRow md="12" class="flex-grow-1">
              下方篩選
            </MDBRow>
          </MDBCol>
          <!-- 右方案件資料 -->
          <MDBCol md="4" class="h-100 border">
            案件資料
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <!-- 頁腳 -->
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
