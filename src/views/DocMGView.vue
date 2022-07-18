<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBIcon
} from 'mdb-vue-ui-kit';
import DataTable from 'datatables.net-vue3';
import Select from 'datatables.net-select';
import DataTableBs5 from 'datatables.net-bs5';
import 'datatables.net-responsive';
import { useQuery,useMutation } from '@vue/apollo-composable'
import DocsGQL from "../graphql/Docs";
import dt from "datatables.net"
DataTable.use(DataTableBs5);
DataTable.use(Select);

// // 執行查詢
const { result,loading,error } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);
// 設定表格
const columns = [
  { data: "id", title: "序號", visible: false },
  { data: "doc_id", title: "文件編號", className: "colnowarp" },
  { data: "doc_level", title: "層級" },
  { data: "doc_type", title: "類型", visible: false },
  { data: "name", title: "文件名稱" },
  { data: "ver", title: "版次" },
  {
    data: "release_date", title: "發行日", className: "colnowarp", defaultContent: "", render: (data) =>{
      let ttdate =""
      if(data){ttdate = data.split("T")[0];}
      return ttdate;
  }},
  {
    data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }
  },
  { data: "comment", title: "備註" }
];
const tboption = {
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'asc']],
  scrollY: '30vh', 
  scrollX: true,
  scrollCollapse: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料', 
  }
};

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-column h-100">
      <Navbar1 />
      <main class="flex-md-fill">
        <MDBContainer fluid class="px-0 py-2 w-100 h-100">
          <MDBCard class="rounded-5 text-black  h-100">
            <MDBCardBody>
              <MDBRow class="h-100">
                <MDBCol md="8" class="border">
                  <MDBRow class="h-sm-50">
                    <MDBCol v-if="result && result.getAllDocLatest">
                      <DataTable :data="result.getAllDocLatest" :columns="columns" :options="tboption"
                        style="font-size: smaller" class="display compact w-100 border" />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow class="flex-sm-fill">
                    <MDBCol tag="form" md="2" class="d-flex flex-md-column border">
                      條件篩選
                      <select class="form-select form-select-sm mb-2" label="文件層級">
                        <option selected>文件層級</option>
                      </select>
                      <select class="form-select form-select-sm mb-2" label="文件分類">
                        <option selected>文件分類</option>
                      </select>
                      <MDBInput size="sm" type="text" label="文件名稱" wrapperClass="mb-2" />
                      <MDBInput size="sm" type="text" label="版次" wrapperClass="mb-2" />
                      <select class="form-select form-select-sm mb-2" label="上階文件">
                        <option selected>上階文件</option>
                      </select>
                      <select class="form-select form-select-sm mb-2" label="現役狀態">
                        <option selected>現役狀態</option>
                      </select>
                      <MDBBtn size="sm" color="primary">篩選</MDBBtn>
                    </MDBCol>
                    <MDBCol tag="form" md="4" class="d-flex flex-md-column border">資料編輯
                    </MDBCol>
                    <MDBCol md="6" class="border">歷史文件</MDBCol>
                  </MDBRow>
                </MDBCol>
                <MDBCol md="4" class="border">
                  PDF預覽
                </MDBCol>

              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </main>
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.colnowarp {
  white-space: nowrap;
}
</style>
