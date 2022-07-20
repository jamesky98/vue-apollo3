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
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
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

const activeTabId1 = ref('filter');
let dt1;
let dt2;
// This variable is used in the `ref` attribute for the component
const table1 = ref(); 
const table2 = ref(); 
const data1 = ref([]);
const data2 = ref([]);
const nowID = ref("");
const nowDocID = ref("");

onMounted(function () {
  dt1 = table1.value.dt();
  dt2 = table2.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    if (type === 'row') {
      nowID.value = dt.rows(indexes).data()[0].id;
      nowDocID.value = dt.rows(indexes).data()[0].doc_id;
    }
  });
  dt2.on('select', function (e, dt, type, indexes) {
    if (type === 'row') {
      nowID.value = dt.rows(indexes).data()[0].id;
      nowDocID.value = dt.rows(indexes).data()[0].doc_id;
    }
  });
});

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
const docnamesel = ref("");
const docversel=ref("");
// const docParentmu = ref([]);
// const docParentsel = ref("");

const docStautsmu = ref([
  { text: "", value: "" },
  { text: "現役", value: 1 },
  { text: "廢止", value: 2 },
]);
const docStautsel = ref("");

// 查詢全文件(最新)
const { result: allDocLatest, loading: lodingAllDoc, variables: varAllDocLatest , onResult: getAllDocLatest, refetch: refgetAllDocLatest } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);
getAllDocLatest(result => {
  // 加入table1資料
  if (!result.loading) {
    data1.value = result.data.getAllDocLatest;
  }
  // 加入上階文件選單
  // docParentmu.value = result.data.getAllDocLatest.map(x => {
  //   return { text: x.doc_id, value: x.doc_id }
  // }); docParentmu.value.unshift({ text: "", value: "" });
});
refgetAllDocLatest();

function filterAllDocLatest() {
  let where = {};
  if (doclevelsel.value !== "") where.docLevel = doclevelsel.value;
  if (doctypesel.value !== "") where.docType = doctypesel.value;
  if (docnamesel.value !== "") where.name = docnamesel.value;
  if (docversel.value !== "") where.ver = docversel.value;
  if (docStautsel.value !== "") where.stauts = docStautsel.value;
  varAllDocLatest.value = where;
}


// 查詢文件類型
const { result: allDocType, onResult: getAllDocType, refetch: refgetAllDocType } = useQuery(DocsGQL.GETALLDOCTYPE);
getAllDocType(result => {
  // console.log(result);
  if (!result.loading) {
    doctypemu.value = result.data.getAllDocType.map(x => {
      return { text: x.doc_type, value: x.doc_type_id }
    });doctypemu.value.unshift({ text:"", value: "" });
  }
});
refgetAllDocType();

// 查詢歷史文件
const { result: histDoc, loading: lodingHistDoc, onResult: getHistDoc, refetch: refgetHistDoc } = useQuery(
  DocsGQL.GETDOCHISTORY,
  ()=>({
    
      docId: nowDocID.value
    
  })
);
getHistDoc(result => {
  if (!result.loading){
    data2.value = result.data.getDocHistory;
  }
});
refgetHistDoc();

// 設定表格table1
const columns1 = [
  { data: "id", title: "索引", visible: false },
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
const tboption1 = {
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'asc']],
  scrollY: '30vh', 
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料', 
  }
};
// 設定表格table2
const columns2 = [
  { data: "id", title: "索引", width:"10px" },
  { data: "doc_id", title: "文件編號", className: "colnowarp", width: "30px" },
  { data: "doc_level", title: "層級", visible: false },
  { data: "doc_type", title: "類型", visible: false },
  { data: "ver", title: "版次", width: "50px" },
  {
    data: "release_date", title: "發行日", className: "colnowarp", defaultContent: "", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }, width: "50px"
  },
  {
    data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }, visible: false
  },
  { data: "name", title: "文件名稱", width: "50px" },
  { data: "parent_id", title: "父階文件", visible: false },
  { data: "upload", title: "掃描檔", visible: false },
  { data: "editable_upload", title: "編輯檔", visible: false },
  { data: "comment", title: "備註", width: "50px" }
];
const tboption2 = {
  autoWidth: false,
  select: {
    style: 'single',
    info: false
  },
  order: [[5, 'desc']],
  scrollY: '28vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: false,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};


</script>

<template>
  <MDBContainer fluid class="h-md-100">
    <MDBRow class="d-flex flex-column h-md-100">
      <Navbar1 />
      <main class="flex-md-fill">
        <MDBContainer fluid class="px-0 py-2 w-100 h-100">
          <MDBCard class="rounded-5 text-black h-100">
            <MDBCardBody class="h-100">
              <MDBRow class="h-100">
                <MDBCol md="8" class="h-100 border">
                  <MDBRow class="h-100">
                    <MDBCol col="12" class="h-50">
                      <!-- <MDBCol v-if="allDocLatest && allDocLatest.getAllDocLatest"> -->
                      <!-- <MDBDatatable :dataset="dataset2" striped sm maxHeight="20%" /> -->
                      <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1"
                        style="font-size: smaller" class="display compact h-100 w-100 border" />
                      <!-- </MDBCol> -->
                    </MDBCol>
                    <MDBCol md="12" class="h-50">
                      <MDBRow class="h-100">
                        <MDBCol md="7" class="h-100 border">歷史文件
                          <DataTable :data="data2" :columns="columns2" :options="tboption2" loding="lodingHistDoc"
                            ref="table2" style="font-size: smaller" class="display h-80 compact w-100 border" />
                        </MDBCol>
                        <MDBCol md="5" class="h-100 border">
                          <MDBTabs v-model="activeTabId1">
                            <!-- Tabs navs -->
                            <MDBTabNav tabsClasses="mb-3">
                              <MDBTabItem tabId="filter" href="filter">篩選</MDBTabItem>
                              <MDBTabItem tabId="editor" href="editor">資料編輯</MDBTabItem>
                            </MDBTabNav>
                            <!-- Tabs navs -->
                            <!-- Tabs content -->
                            <MDBTabContent>
                              <!-- 篩選表單 -->
                              <MDBTabPane tabId="filter">
                                <MDBCol tag="form" md="12" class="d-flex flex-md-column h-100 border" @submit.prevent="
                                filterAllDocLatest()">
                                  條件篩選
                                  <MDBSelect size="sm" class="mb-2" label="文件層級" v-model:options="doclevelmu"
                                    v-model:selected="doclevelsel" />
                                  <MDBSelect size="sm" class="mb-2" label="文件類型" v-model:options="doctypemu"
                                    v-model:selected="doctypesel" />
                                  <MDBInput size="sm" type="text" label="文件名稱" wrapperClass="mb-2"
                                    v-model="docnamesel" />
                                  <MDBInput size="sm" type="text" label="版次" wrapperClass="mb-2" v-model="docversel" />
                                  <!-- <MDBSelect size="sm" filter class="mb-2" label="上階文件" v-model:options="docParentmu"
                                    v-model:selected="docParentsel" /> -->
                                  <MDBSelect size="sm" class="mb-2" label="現役狀態" v-model:options="docStautsmu"
                                    v-model:selected="docStautsel" />
                                  <MDBBtn size="sm" color="primary" type="submit">篩選</MDBBtn>
                                </MDBCol>
                              </MDBTabPane>
                              <!-- 編輯表單 -->
                              <MDBTabPane tabId="editor">
                                <MDBCol tag="form" md="12" class="d-flex flex-md-column h-100 border">資料編輯

                                </MDBCol>
                              </MDBTabPane>
                            </MDBTabContent>
                            <!-- Tabs content -->
                          </MDBTabs>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
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
