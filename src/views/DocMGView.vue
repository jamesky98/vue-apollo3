<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
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
  MDBSelect,
  MDBDatatable,
  MDBIcon
} from "mdb-vue-ui-kit";
import DataTable from 'datatables.net-vue3';
import Select from 'datatables.net-select';
import DataTableBs5 from 'datatables.net-bs5';
import 'datatables.net-responsive';
import { useQuery,useMutation } from '@vue/apollo-composable'
import DocsGQL from "../graphql/Docs";

DataTable.use(DataTableBs5);
DataTable.use(Select);

let dt;
const table = ref(); // This variable is used in the `ref` attribute for the component
const nowID = ref("");
const nowDocID = ref("");

onMounted(function () {
  dt = table.value.dt();
  dt.on('select', function (e, dt, type, indexes) {
    if (type === 'row') {
      nowID.value = dt.rows(indexes).data()[0].id;
      nowDocID.value = dt.rows(indexes).data()[0].doc_id;
      // console.log(nowDocID.value);
    }
  });
});

const data = ref([]);

// 設定文件階層選單
const doclevelmu = ref([
  { text: "", value: "" },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 }
]);
const doclevelsel = ref("");

const doctypemu = ref([]);
const doctypesel = ref("");

const docParentmu = ref([]);
const docParentsel = ref("");

const docStautsmu = ref([
  { text: "", value: "" },
  { text: "現役", value: 1 },
  { text: "廢止", value: 2 },
]);
const docStautsel = ref("");



// // 查詢全文件(最新)
const { result: allDocLatest,loading:lodingAllDoc , onResult: getAllDocLatest } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);
getAllDocLatest(result => {
  console.log(lodingAllDoc.value);
  data.value = result.data.getAllDocLatest;
  // 加入上階文件選單
  docParentmu.value = result.data.getAllDocLatest.map(x => {
    return { text: x.doc_id, value: x.doc_id }
  }); docParentmu.value.unshift({ text: "", value: "" });
});

const { result: allDocType, onResult: getAllDocType } = useQuery(DocsGQL.GETALLDOCTYPE);
getAllDocType(result => {
  // console.log(result);
  doctypemu.value = result.data.getAllDocType.map(x => {
    return { text: x.doc_type, value: x.doc_type_id }
  });doctypemu.value.unshift({ text:"", value: "" });
});



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
                    <!-- <MDBCol v-if="allDocLatest && allDocLatest.getAllDocLatest"> -->
                    <!-- <MDBDatatable :dataset="dataset2" striped sm maxHeight="20%" /> -->
                    <DataTable :data="data" :columns="columns" :options="tboption" ref="table"
                      style="font-size: smaller" class="display compact w-100 border" />
                    <!-- </MDBCol> -->
                  </MDBRow>
                  <MDBRow class="flex-sm-fill">
                    <MDBCol tag="form" md="2" class="d-flex flex-md-column border">
                      條件篩選
                      <MDBSelect size="sm" class="mb-2" label="文件層級" v-model:options="doclevelmu"
                        v-model:selected="doclevelsel" />
                      <MDBSelect size="sm" class="mb-2" label="文件類型" v-model:options="doctypemu"
                        v-model:selected="doctypesel" />
                      <MDBInput size="sm" type="text" label="文件名稱" wrapperClass="mb-2" />
                      <MDBInput size="sm" type="text" label="版次" wrapperClass="mb-2" />
                      <MDBSelect size="sm" filter class="mb-2" label="上階文件" v-model:options="docParentmu"
                        v-model:selected="docParentsel" />
                      <MDBSelect size="sm" class="mb-2" label="現役狀態" v-model:options="docStautsmu"
                        v-model:selected="docStautsel" />
                      <MDBBtn size="sm" color="primary">篩選</MDBBtn>
                    </MDBCol>
                    <MDBCol tag="form" md="4" class="d-flex flex-md-column border">資料編輯
                      <p>{{ nowID }}</p>
                      <p>{{ nowDocID }}</p>
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
