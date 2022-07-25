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
  MDBDatepicker,
  MDBIcon
} from "mdb-vue-ui-kit";
import { useQuery, useMutation } from '@vue/apollo-composable';
import DocsGQL from "../graphql/Docs";
// import PdfViewer from "../components/Pdfviewer.vue";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

// require('pdfmake');
// require('datatables.net-buttons-bs5')();
// require('datatables.net-buttons/js/buttons.colVis.js')();
// require('datatables.net-buttons/js/buttons.html5.js')();
// require('datatables.net-buttons/js/buttons.print.js')();
// require('datatables.net-datetime')();
// require('datatables.net-keytable-bs5')();
// require('datatables.net-responsive-bs5')();
// require('datatables.net-scroller-bs5')();
// require('datatables.net-searchbuilder-bs5')();
// require('datatables.net-searchpanes-bs5')();
// require('datatables.net-select-bs5')();

DataTable.use(DataTableBs5);
DataTable.use(Select);
// DataTable.use(SearchBuilder);

const activeTabId1 = ref('filter');
let dt1;
let dt2;
// This variable is used in the `ref` attribute for the component
const table1 = ref(); 
const table2 = ref(); 
const data1 = ref([]);
const data2 = ref([]);

// 文件編輯資料
const nowID = ref("");

const nowDocLevel = ref("");
const docLevelSelect = ref();

const nowDocID = ref("");

const nowDocTypemu = ref([]);
const nowDocType = ref("");
const docTypeSelect = ref();

const nowDocName = ref("");
const nowVer = ref("");
const nowReleaseDate = ref("");
const nowParents = ref("");

// PDF Viewer ?file=../../../test.pdf
const pdfPath = ref("pdfjs-dist/web/viewer.html");

onMounted(function () {
  dt1 = table1.value.dt();
  dt2 = table2.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    updateDocContext(e, dt, type, indexes);
  });
  dt2.on('select', function (e, dt, type, indexes) {
    updateDocContext(e, dt, type, indexes);
  });
});

function updateDocContext(e, dt, type, indexes){
  if (type === 'row') {
    nowID.value = dt.rows(indexes).data()[0].id;
    docLevelSelect.value.setValue(parseInt(dt.rows(indexes).data()[0].doc_level));
    nowDocID.value = dt.rows(indexes).data()[0].doc_id;
    docTypeSelect.value.setValue(parseInt(dt.rows(indexes).data()[0].doc_type));
    nowDocName.value = dt.rows(indexes).data()[0].name;
    nowVer.value = dt.rows(indexes).data()[0].ver;
    nowReleaseDate.value = dt.rows(indexes).data()[0].release_date.split("T")[0];
    nowParents.value = dt.rows(indexes).data()[0].parent_id;

    pdfPath.value = "pdfjs-dist/web/viewer.html?file=../../../02_DOC/" + dt.rows(indexes).data()[0].doc_level + "/" + dt.rows(indexes).data()[0].upload;
  }
}

// 設定文件階層選單
const doclevelmu = ref([
  { text: "", value: "" },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 }
]);
const nowDocLevelmu = ref([
  { text: "", value: "" },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 }
]);
const doclevelsel = ref("");
const doctypemu = ref([]);
const doctypesel = ref("");
const docDidsel = ref("");
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
  if (docDidsel.value !== "") where.docId = docDidsel.value;
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
      return { text: x.doc_type, value: parseInt(x.doc_type_id) }
    });doctypemu.value.unshift({ text:"", value: "" });
    nowDocTypemu.value = result.data.getAllDocType.map(x => {
      return { text: x.doc_type, value: parseInt(x.doc_type_id) }
    }); nowDocTypemu.value.unshift({ text: "", value: "" });
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
  { data: "parent_id", title: "上階文件", visible: false },
  {
    data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }
  },
  { data: "upload", title: "掃描檔", visible: false },
  { data: "comment", title: "備註" }
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
  { data: "parent_id", title: "上階文件", visible: false },
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
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[5, 'desc']],
  scrollY: '32vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};


function clearFilter(){
  doclevelsel.value = "";
  doctypesel.value = "";
  docDidsel.value = "";
  docnamesel.value = "";
  docversel.value = "";
  docStautsel.value = "";
}



</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBContainer tag="main" fluid class="flex-grow-1">
        <MDBRow class="h-100 border">
          <!-- 左方資料欄 -->
          <MDBCol md="8" class="h-100 border">
            <MDBRow md="12" class="h-50 overflow-auto border">
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBRow>
            <MDBRow md="12" class="h-50">

              <MDBCol md="7" class="h-100 overflow-auto border">歷史文件{{ nowDocID }}
                <DataTable :data="data2" :columns="columns2" :options="tboption2" loding="lodingHistDoc" ref="table2"
                  style="font-size: smaller" class="display compact w-100" />
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
                      <MDBRow tag="form" md="12" style="height: 33vh;"
                        class="d-flex align-content-start overflow-auto border" @submit.prevent="
                        filterAllDocLatest()">
                        <div>條件篩選</div>
                        <MDBSelect size="sm" class="mb-2 col-6" label="文件層級" v-model:options="doclevelmu"
                          v-model:selected="doclevelsel" />
                        <MDBSelect size="sm" class="mb-2 col-6" label="文件類型" v-model:options="doctypemu"
                          v-model:selected="doctypesel" />
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件編號" v-model="docDidsel" />
                        </MDBCol>
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件名稱" v-model="docnamesel" />
                        </MDBCol>
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="版次" v-model="docversel" />
                        </MDBCol>
                        <MDBSelect size="sm" class="mb-2 col-6" label="現役狀態" v-model:options="docStautsmu"
                          v-model:selected="docStautsel" />
                      </MDBRow>
                      <div class="d-flex justify-content-end">
                        <MDBBtn size="sm" color="primary" @click="clearFilter()">清除</MDBBtn>
                        <MDBBtn size="sm" color="primary" type="submit">篩選</MDBBtn>
                      </div>
                    </MDBTabPane>
                    <!-- 編輯表單 -->
                    <MDBTabPane tabId="editor">
                      <MDBRow tag="form" md="12" style="height: 33vh;"
                        class="d-flex align-content-start overflow-auto border">
                        <div>資料編輯</div>
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="索引" readonly v-model="nowID" />
                        </MDBCol>
                        <MDBSelect size="sm" class="mb-2 col-6" label="文件層級" v-model:options="nowDocLevelmu"
                          v-model:selected="nowDocLevel" ref="docLevelSelect" />
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件編號" v-model="nowDocID" />
                        </MDBCol>
                        <MDBSelect size="sm" class="mb-2 col-6" label="文件類型" v-model:options="nowDocTypemu"
                          v-model:selected="nowDocType" ref="docTypeSelect" />
                        <MDBCol col="12" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件名稱" v-model="nowDocName" />
                        </MDBCol>
                        <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="版次" v-model="nowVer" />
                        </MDBCol>
                        <MDBCol col="6" class="mb-2">
                          <MDBDatepicker size="sm" v-model="nowReleaseDate" format=" YYYY-MM-DD " label="發行日" />
                        </MDBCol>
                        <MDBCol col="12" class="mb-2">
                          <MDBInput size="sm" type="text" label="上階文件" v-model="nowParents" />
                        </MDBCol>
                        <!-- <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件層級" readonly v-model="nowDocLevel" />
                        </MDBCol> -->


                        <!-- 選單 -->
                        <!-- <MDBSelect size="sm" class="mb-2 col-6" label="文件層級" /> -->
                        <!-- 文字 -->
                        <!-- <MDBCol col="6" class="mb-2">
                          <MDBInput size="sm" type="text" label="文件編號" />
                        </MDBCol> -->

                      </MDBRow>
                      <div class="d-flex justify-content-end">
                        <MDBBtn size="sm" color="primary">新增</MDBBtn>
                        <MDBBtn size="sm" color="primary">刪除</MDBBtn>
                        <MDBBtn size="sm" color="primary">修改</MDBBtn>
                      </div>
                    </MDBTabPane>
                  </MDBTabContent>
                  <!-- Tabs content -->
                </MDBTabs>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 右方PDF顯示 -->
          <MDBCol md="4" class="h-100 border">
            <!-- PDF預覽 -->
            <!-- <PdfViewer/> -->
            <iframe id="pdf-js-viewer" :src="pdfPath" class="h-100 w-100"></iframe>
            <!-- <a href="pdfjs-dist/web/viewer.html?file=%2Fmy-pdf-file.pdf">Open Full Screen PDF.js Viewer</a> -->
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.colnowarp {
  white-space: nowrap;
}
#the-canvas {
  border: 1px solid black;
  direction: ltr;
}

</style>
