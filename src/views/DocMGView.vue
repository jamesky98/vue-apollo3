<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path from "path-browserify";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBSelect,
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
  MDBDatepicker,
  MDBTextarea,
  MDBAlert, 
  MDBBtnClose,
  MDBPopconfirm,
} from "mdb-vue-ui-kit";
import { computed } from "@vue/reactivity";
import DocsGQL from "../graphql/Docs";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

DataTable.use(DataTableBs5);
DataTable.use(Select);
// 取得權限==========Start
// const myUserId = ref("");
const myUserName = ref("");
// const myUserName2 = ref("");
// const myUserEmail = ref("");
// const myUserActive = ref(false);
const myUserRole = ref("");

const { onResult: getNowUser, refetch: refgetNowUser} = useQuery(UsersGQL.GETNOWUSER);
getNowUser(result=>{
  if (!result.loading && result && result.data.getNowUser) {
    let getData = result.data.getNowUser;
    // myUserId.value = getData.user_id;
    myUserName.value = getData.user_name;
    // myUserName2.value = getData.user_name2;
    // myUserEmail.value = getData.user_mail;
    // myUserActive.value = (getData.active===1)?true:false;
    myUserRole.value = getData.role;
  }
});
refgetNowUser();
const rGroup =computed(()=>{
  let result=[];
  // rGroup[0]最高權限
  // rGroup[1]技術主管專用
  // rGroup[2]技術人員專用(非己不可改)
  // rGroup[3]最低權限
  // rGroup[4]完全開放
  switch (myUserRole.value){
    case 0:
      result = [false,false,false,false,true];
      break;
    case 1:
      result = [false,false,true,true,true];
      break;
    case 2:
      result = [false,true,false,true,true];
      break;
    case 3:
      result = [true,true,true,true,true];
    break;
  }
  return result;
});
// 取得權限==========End

// Information
const NavItem = ref("docs");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);

const activeTabId1 = ref('filter');
const activeTabId2 = ref('histroy');
let dt1;
let dt2;
let dt3;
// This variable is used in the `ref` attribute for the component
const table1 = ref(); 
const table2 = ref(); 
const table3 = ref();
const data1 = ref([]);
const data2 = ref([]);
const data3 = ref([]);

// 文件編輯資料
const nowID = ref("");
const nowIDed = ref("");

const nowDocID = ref("");
const nowDocIDed = ref("");
const nowDocIDParent = ref("");

const nowDocLevel = ref("");
const docLevelSelect = ref();
const nowDocTypemu = ref([]);
const nowDocType = ref("");
const docTypeSelect = ref();
const nowDocName = ref("");
const nowVer = ref("");
const nowReleaseDate = ref("");
const itemRelDate = ref();
const nowParents = ref("");
const nowUpload = ref("");
const nowDownLoad = computed(()=>{
  return "02_DOC/" + nowDocLevel.value + "/" + nowUpload.value
});
// PDF Viewer ?file=../../../test.pdf
const pdfPath = ref("pdfjs-dist/web/viewer.html");
const nowEdUpload = ref("");
const nowEdDownLoad = computed(() => {
  return "02_DOC/" + nowDocLevel.value + "/" + nowEdUpload.value
});

const nowExpDate = ref("");
const itemExpDate = ref();
const nowComment = ref("");

onMounted(function () {
  dt1 = table1.value.dt();
  dt2 = table2.value.dt();
  dt3 = table3.value.dt();

  dt1.on('select', function (e, dt, type, indexes) {
    nowDocIDParent.value = dt.rows(indexes).data()[0].doc_id    
    updateDocContext(e, dt, type, indexes);
  });
  dt2.on('select', function (e, dt, type, indexes) {
    updateDocContext(e, dt, type, indexes);
  });
  dt3.on('select', function (e, dt, type, indexes) {
    updateDocContext(e, dt, type, indexes);
  });

});

function updateDocContext(e, dt, type, indexes){
  if (type === 'row') {
    let getDocData = dt.rows(indexes).data()[0];
    nowID.value = getDocData.id;
    nowIDed.value = getDocData.id;
    docLevelSelect.value.setValue(parseInt(getDocData.doc_level));
    nowDocID.value = getDocData.doc_id;
    nowDocIDed.value = getDocData.doc_id;
    docTypeSelect.value.setValue(parseInt(getDocData.doc_type));
    nowDocName.value = getDocData.name;
    nowVer.value = getDocData.ver;
    if (getDocData.release_date === null){
      nowReleaseDate.value="";
      itemRelDate.value.inputValue = "";
    }else{
      nowReleaseDate.value = getDocData.release_date.split("T")[0];
    }
    nowParents.value = getDocData.parent_id;
    nowUpload.value = getDocData.upload;
    if (!getDocData.upload){
      pdfPath.value = "pdfjs-dist/web/viewer.html";  
    }else{
      pdfPath.value = "pdfjs-dist/web/viewer.html?file=../../../02_DOC/" + getDocData.doc_level + "/" + getDocData.upload;
    }
    nowEdUpload.value = getDocData.editable_upload;
    if (getDocData.expiration_date === null) {
      nowExpDate.value = "";
      itemExpDate.value.inputValue = "";
    } else {
      nowExpDate.value = getDocData.expiration_date.split("T")[0];
    }
    nowExpDate.value = (getDocData.expiration_date) ? getDocData.expiration_date.split("T")[0] : "";
    nowComment.value = getDocData.comment;
  }
}

// 設定文件階層選單
const doclevelmu = ref([
  { text: "", value: "" },
  { text: "一階", value: 1 },
  { text: "二階", value: 2 },
  { text: "三階", value: 3 },
  { text: "四階", value: 4 }
]);
const docLevelFilter = ref();
const nowDocLevelmu = ref([
  { text: "", value: "" },
  { text: "一階", value: 1 },
  { text: "二階", value: 2 },
  { text: "三階", value: 3 },
  { text: "四階", value: 4 }
]);
const doclevelsel = ref("");

const doctypemu = ref([]);
const doctypesel = ref("");
const docTypeFilter = ref();

const docDidsel = ref("");
const docnamesel = ref("");
const docversel=ref("");
const docStautsmu = ref([
  { text: "", value: "" },
  { text: "現役", value: 1 },
  { text: "廢止", value: 2 },
]);
const docStautsel = ref("");
const docStautsFilter = ref();

const parentsmu = ref([]);
const parentsel = ref("");
// 設定文件階層選單^^^^^

// 查詢全文件(最新)
const { result: allDocLatest, loading: lodingAllDoc, variables: varAllDocLatest , onResult: getAllDocLatest, refetch: refgetAllDocLatest } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);

const { result: allDocLatest2, loading: lodingAllDoc2, variables: varAllDocLatest2, onResult: getAllDocLatest2, refetch: refgetAllDocLatest2 } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);
getAllDocLatest(result => {
  // 加入table1資料
  if (!result.loading) {
    data1.value = result.data.getAllDocLatest;
  }
});
refgetAllDocLatest();

// 為上階文件選單另外建立一個
getAllDocLatest2(result => {
  // 加入table1資料
  if (!result.loading) {
    // 加入上階文件選單
    parentsmu.value = result.data.getAllDocLatest.map(x => {
      return { text: x.doc_id, value: x.doc_id }
    }); parentsmu.value.unshift({ text: "", value: "" });
  }
});
refgetAllDocLatest2();

// 查詢文件類型
const { result: allDocType, onResult: getAllDocType, refetch: refgetAllDocType } = useQuery(DocsGQL.GETALLDOCTYPE);
getAllDocType(result => {
  // 加入文件類型選單資料
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

// 查詢下階文件
const { result: childDoc, loading: lodingChildDoc, onResult: getChildDoc, refetch: refgetChildDoc } = useQuery(
  DocsGQL.GETDOCCHILD,
  () => ({
    docId: nowDocIDParent.value
  })
);
getChildDoc(result => {
  if (!result.loading) {
    data3.value = result.data.getDocChild;
  }
});
refgetChildDoc();



// 設定表格table1
const columns1 = [
  { data: "id", title: "索引", defaultContent: "-", visible: false },
  { data: "doc_id", title: "文件編號", defaultContent: "-", className: "colnowarp" },
  { data: "doc_level", title: "層級", defaultContent: "-" },
  { data: "doc_type", title: "類型", defaultContent: "-", visible: false },
  { data: "name", title: "文件名稱", defaultContent: "-" },
  { data: "ver", title: "版次", defaultContent: "-" },
  {
    data: "release_date", title: "發行日", className: "colnowarp", defaultContent: "-", render: (data) =>{
      let ttdate =""
      if(data){ttdate = data.split("T")[0];}
      return ttdate;
  }},
  { data: "parent_id", title: "上階文件", defaultContent: "-", visible: false },
  {
    data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "-", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }
  },
  { data: "upload", title: "掃描檔", defaultContent: "-", visible: false },
  { data: "editable_upload", title: "編輯檔", defaultContent: "-", visible: false },
  { data: "comment", title: "備註", defaultContent: "-" }
];
const tboption1 = {
  dom: 'tif',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'asc']],
  scrollY: 'calc(50vh - 11rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料', 
  }
};
// 設定表格table2、table3
const columns2 = [
  { data: "id", title: "索引", defaultContent: "-", width:"10px" },
  { data: "doc_id", title: "文件編號", defaultContent: "-", className: "colnowarp", width: "30px" },
  { data: "doc_level", title: "層級", defaultContent: "-", visible: false },
  { data: "doc_type", title: "類型", defaultContent: "-", visible: false },
  { data: "ver", title: "版次", defaultContent: "-", width: "50px" },
  {
    data: "release_date", title: "發行日", className: "colnowarp", defaultContent: "-", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }, width: "50px"
  },
  { data: "parent_id", title: "上階文件", defaultContent: "-", visible: false },
  {
    data: "expiration_date", title: "廢止日", className: "colnowarp", defaultContent: "-", render: (data) => {
      let ttdate = ""
      if (data) { ttdate = data.split("T")[0]; }
      return ttdate;
    }, visible: false
  },
  { data: "name", title: "文件名稱", defaultContent: "-", width: "50px" },
  { data: "parent_id", title: "父階文件", defaultContent: "-", visible: false },
  { data: "upload", title: "掃描檔", defaultContent: "-", visible: false },
  { data: "editable_upload", title: "編輯檔", defaultContent: "-", visible: false },
  { data: "comment", title: "備註", defaultContent: "-", width: "50px" }
];
const tboption2 = {
  autoWidth: false,
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[5, 'desc']],
  scrollY: 'calc(50vh - 13rem)',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

const columns3 = [
  { data: "id", title: "索引", width: "10px" },
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
const tboption3 = {
  autoWidth: false,
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[2, 'asc']],
  scrollY: 'calc(50vh - 13rem)',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

// 執行篩選
function filterAllDocLatest() {
  let where = {};
  if (doclevelsel.value !== "") where.docLevel = doclevelsel.value;
  if (doctypesel.value !== "") where.docType = doctypesel.value;
  if (docDidsel.value !== "") where.docId = docDidsel.value;
  if (docnamesel.value !== "") where.name = docnamesel.value;
  if (docversel.value !== "") where.ver = docversel.value;
  if (docStautsel.value !== "") where.stauts = docStautsel.value;

  varAllDocLatest.value = where;
  // console.log("filte data!!")
}
// 清空篩選條件
function clearFilter(){
  doclevelsel.value = "";
  docLevelFilter.value.setValue("");
  doctypesel.value = "";
  docTypeFilter.value.setValue("");
  docDidsel.value = "";
  docnamesel.value = "";
  docversel.value = "";
  docStautsel.value = "";
  docStautsFilter.value.setValue("");
}

// 增加上階文件
function addParentDoc(){
  if (nowParents.value === ""){
    nowParents.value = parentsel.value;
  }else{
    // 判斷重複值
    let olddate = nowParents.value.split(";");
    if (!olddate.includes(parentsel.value)){
      nowParents.value = nowParents.value + ";" + parentsel.value;
}}}

// 編輯表單-新增
const { mutate: addDoc, onDone: addDocOnDone, onError: addDocError } = useMutation(
  DocsGQL.ADDDOC,
  ()=>({
    variables: {
      docId: nowDocIDed.value,
      docLevel: parseInt(nowDocLevel.value),
      docType: parseInt(nowDocType.value),
      name: nowDocName.value,
      ver: nowVer.value,
      releaseDate: (nowReleaseDate.value === "") ? null : (nowReleaseDate.value.trim() + "T00:00:00.000Z"),
      expirationDate: (nowExpDate.value === "") ? null : (nowExpDate.value.trim() + "T00:00:00.000Z"),
      parentId: (nowParents.value === "") ? null : nowParents.value,
      upload: (nowUpload.value === "") ? null : nowUpload.value,
      editableUpload: (nowEdUpload.value === "") ? null : nowEdUpload.value,
      comment: (nowComment.value === "") ? null : nowComment.value,
    }
  })
);
addDocOnDone(()=>{
  refgetAllDocLatest();
  refgetAllDocLatest2();
  refgetHistDoc();
  infomsg.value = "ID:" + nowIDed.value+ " " + nowDocIDed.value + "完成新增";
  alert1.value = true;
});

// 編輯表單-新增
function addDocBtn(){
  // 清空欄位
  nowIDed.value="";
  docLevelSelect.value.setValue("");
  nowDocIDed.value ="";
  docTypeSelect.value.setValue("");
  nowDocName.value ="";
  nowVer.value ="";
  nowReleaseDate.value ="";
  itemRelDate.value.inputValue=""
  nowParents.value ="";
  nowUpload.value ="";
  nowEdUpload.value ="";
  nowExpDate.value ="";
  itemExpDate.value.inputValue = ""
}
// 編輯表單-複製並新增
function copyAddDocBtn() {
  // 清空部分欄位
  nowIDed.value = "";
  nowUpload.value = "";
  nowEdUpload.value = "";
}


// 編輯表單-刪除
const { mutate: delDocfun, onDone: delDocOnDone, onError: delDocError } = useMutation(
  DocsGQL.DELDOC,
  () => ({
    variables: {
      delDocId: parseInt(nowIDed.value),
    }
  }));
delDocOnDone(()=>{
  refgetAllDocLatest();
  refgetAllDocLatest2();
  refgetHistDoc();
  infomsg.value = "ID:" + nowIDed.value+ " " + nowDocIDed.value + "完成刪除";
  alert1.value = true;
});

// 編輯表單-修改
const { mutate: saveDoc, onDone: saveDocOnDone, onError: saveDocError } = useMutation(
  DocsGQL.SAVEDOC,
  () => ({
    variables: {
      updateDocId: parseInt(nowIDed.value),
      docId: nowDocIDed.value,
      docLevel: parseInt(nowDocLevel.value),
      docType: parseInt(nowDocType.value),
      name: nowDocName.value,
      ver: nowVer.value,
      releaseDate: (nowReleaseDate.value === "") ? null : (nowReleaseDate.value.trim() + "T00:00:00.000Z"),
      expirationDate: (nowExpDate.value === "") ? null : (nowExpDate.value.trim() + "T00:00:00.000Z"),
      parentId: (nowParents.value === "") ? null : nowParents.value,
      upload: (nowUpload.value === "") ? null : nowUpload.value,
      editableUpload: (nowEdUpload.value === "") ? null : nowEdUpload.value,
      comment: (nowComment.value === "") ? null : nowComment.value,
    }
  })
);

saveDocError((error)=>{
  console.log(error);
});
saveDocOnDone(()=>{
  refgetAllDocLatest();
  refgetAllDocLatest2();
  refgetHistDoc();
  infomsg.value = "ID:"+nowIDed.value+ " " + nowDocIDed.value + "完成修改";
  alert1.value = true;
});

// 編輯表單-儲存
function saveDocBtn() {
  if(nowIDed.value===""){
    // 執行新增
    addDoc();
  }else{
    // 執行修改
    saveDoc();
  }
}

// 檔案上傳==========start
  const isUploadBtn = ref(true);
  function uploadBtn(){
    // console.log(nowDocLevel.value);
    // console.log(nowReleaseDate.value);
    isUploadBtn.value=true;
    if (nowDocIDed.value === "") {
      alert("請輸入文件編號 !!");
      return;
    }
    if (nowDocLevel.value === ""){
      alert("請輸入文件階層 !!");
      return;
    }
    if (nowReleaseDate.value === "") {
      alert("請輸入發行日 !!");
      return;
    }
    
    document.getElementById("itemUpload").click();
  }

  
  // 上傳檔案
  const { mutate: uploadDoc, onDone: uploadDocOnDone } = useMutation(DocsGQL.UPLOADDOC);
  // 儲存(更新)上傳路徑檔名
  const { mutate: saveUpload, onDone: saveUploadOnDone, onError: saveUploadError } = useMutation(DocsGQL.SAVEUPLOAD);

  saveUploadOnDone(() => {
    refgetAllDocLatest();
    refgetHistDoc();
  });

  uploadDocOnDone((result)=>{
    // console.log(result.data.uploadDoc);
    infomsg.value = "ID:" + nowIDed.value + " " + nowDocIDed.value + "檔案完成上傳";
    alert1.value = true;
    if(isUploadBtn.value){
      nowUpload.value = result.data.uploadDoc.filename;
      saveUpload({
        updateDocId: parseInt(nowIDed.value),
        upload: nowUpload.value,
      });
      pdfPath.value = "pdfjs-dist/web/viewer.html?file=../../../02_DOC/" + nowDocLevel.value + "/" + nowUpload.value;
      
      // console.log(pdfPath.value);
    }else{
      nowEdUpload.value = result.data.uploadDoc.filename;
      saveUpload({
        updateDocId: parseInt(nowIDed.value),
        editableUpload: nowEdUpload.value,
      });
    }
  });

  // 檔案選擇器選擇事件
  const upFile = ref();
  function uploadChenge(e){
    upFile.value = e.target.files[0];
    uploadDoc({ 
      file: upFile.value,
      subpath: nowDocLevel.value + "",
      newfilename: nowDocIDed.value + "_" + nowReleaseDate.value.replaceAll("-", "") + path.extname(e.target.value),
    });
  }


  function expUploadBtn() {
    isUploadBtn.value = false;
    if (nowDocIDed.value === "") {
      alert("請輸入文件編號 !!");
      return;
    }
    if (nowDocLevel.value === "") {
      alert("請輸入文件階層 !!");
      return;
    }
    if (nowReleaseDate.value === "") {
      alert("請輸入發行日 !!");
      return;
    }

    document.getElementById("itemExpUpload").click();
  }
// 檔案上傳==========end

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 6.5em);" class="overflow-auto">
        <!-- 左方資料欄 -->
        <MDBCol md="8" class="h-100">
          <MDBRow class="h-100 align-content-between">
            <!-- 上方列表 -->
            <MDBCol md="12" style="height: calc(50% - 1.5rem) ;"
              class="mt-2 overflow-auto border border-5 rounded-8 shadow-4">
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBCol>
            <!-- 下方子列表 -->
            <MDBCol md="12" class="h-50 mb-2 border border-5 rounded-8 shadow-4 overflow-auto">
              <MDBRow class="h-100">
                <!-- 下方左側資料 -->
                <MDBCol md="7" class="h-100 overflow-auto">
                  <MDBTabs v-model="activeTabId2">
                    <!-- Tabs navs -->
                    <MDBTabNav tabsClasses="mb-3">
                      <MDBTabItem tabId="histroy" href="histroy">歷史文件</MDBTabItem>
                      <MDBTabItem tabId="children" href="children">下階文件</MDBTabItem>
                    </MDBTabNav>
                    <MDBTabContent>
                      <MDBTabPane tabId="histroy">
                        <DataTable :data="data2" :columns="columns2" :options="tboption2" loding="lodingHistDoc"
                          ref="table2" style="font-size: smaller" class="display compact w-100" />
                      </MDBTabPane>
                      <MDBTabPane tabId="children">
                        <DataTable :data="data3" :columns="columns3" :options="tboption3" loding="lodingChildDoc"
                          ref="table3" style="font-size: smaller" class="display compact w-100" />
                      </MDBTabPane>
                    </MDBTabContent>
                  </MDBTabs>
                </MDBCol>
                <!-- 下方右側資料 -->
                <MDBCol md="5" class="h-100 border-start">
                  <MDBTabs v-model="activeTabId1">
                    <!-- Tabs navs -->
                    <MDBTabNav tabsClasses="mb-1">
                      <MDBTabItem tabId="filter" href="filter">條件篩選</MDBTabItem>
                      <MDBTabItem tabId="editor" href="editor">資料編輯</MDBTabItem>
                    </MDBTabNav>
                    <!-- Tabs navs -->
                    <!-- Tabs content -->
                    <MDBTabContent style="height: calc(100% - 3.5rem);">
                      <!-- 篩選表單 -->
                      <MDBTabPane tabId="filter">
                        <!-- 功能列 -->
                        <div class="my-2 d-flex">
                          <div class="flex-grow-1">條件篩選</div>
                          <div>
                            <MDBBtn size="sm" color="primary" @click="clearFilter()">清除</MDBBtn>
                            <MDBBtn size="sm" color="primary" @click="filterAllDocLatest()">篩選</MDBBtn>
                          </div>
                        </div>
                        <!-- 條件欄位 -->
                        <MDBRow md="12" class="d-flex align-content-start overflow-auto">
                          <MDBSelect size="sm" class="mt-3 mb-3 col-6" label="文件層級" v-model:options="doclevelmu"
                            v-model:selected="doclevelsel" ref="docLevelFilter" />
                          <MDBSelect size="sm" class="mt-3 mb-3 col-6" label="文件類型" v-model:options="doctypemu"
                            v-model:selected="doctypesel" ref="docTypeFilter" />
                          <MDBCol col="6" class="mb-3">
                            <MDBInput size="sm" type="text" label="文件編號" v-model="docDidsel" />
                          </MDBCol>
                          <MDBCol col="6" class="mb-3">
                            <MDBInput size="sm" type="text" label="文件名稱" v-model="docnamesel" />
                          </MDBCol>
                          <MDBCol col="6" class="mb-3">
                            <MDBInput size="sm" type="text" label="版次" v-model="docversel" />
                          </MDBCol>
                          <MDBSelect size="sm" class="mb-3 col-6" label="現役狀態" v-model:options="docStautsmu"
                            v-model:selected="docStautsel" ref="docStautsFilter" />
                        </MDBRow>
                      </MDBTabPane>
                      <!-- 編輯表單 -->
                      <MDBTabPane class="h-100" tabId="editor">
                        <!-- 功能列表 -->
                        <div class="d-flex py-2">
                          <MDBPopconfirm :disabled="!rGroup[1]" class="btn-sm btn-danger me-auto" position="top" message="刪除後無法恢復，確定刪除嗎？"
                            cancelText="取消" confirmText="確定" @confirm="delDocfun()">
                            刪除
                          </MDBPopconfirm>
                          <!-- <MDBBtn size="sm" class="me-auto" color="danger" @click="delDocfun()">刪除</MDBBtn> -->
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="copyAddDocBtn()">複製並新增</MDBBtn>
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addDocBtn()">新增</MDBBtn>
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveDocBtn()">儲存</MDBBtn>
                        </div>
                        <!-- 資料欄位 -->
                        <MDBRow tag="form" md="12" style="height:calc(100% - 3rem) ;"
                          class="d-flex align-content-start overflow-auto">
                          <MDBCol col="6" class="my-3">
                            <MDBInput size="sm" type="text" label="索引" readonly v-model="nowIDed" />
                          </MDBCol>
                          <MDBSelect :disabled="!rGroup[1]" size="sm" class="my-3 col-6" label="文件層級" required v-model:options="nowDocLevelmu"
                            v-model:selected="nowDocLevel" ref="docLevelSelect" />
                          <MDBCol col="6" class="mb-3">
                            <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="文件編號" required v-model="nowDocIDed"
                              oninput="this.value = this.value.toUpperCase()" />
                          </MDBCol>
                          <MDBSelect :disabled="!rGroup[1]" size="sm" class="mb-3 col-6" label="文件類型" required v-model:options="nowDocTypemu"
                            v-model:selected="nowDocType" ref="docTypeSelect" />
                          <MDBCol col="12" class="mb-3">
                            <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="文件名稱" required v-model="nowDocName" />
                          </MDBCol>
                          <MDBCol col="6" class="mb-3">
                            <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="版次" required v-model="nowVer" />
                          </MDBCol>
                          <MDBCol col="6" class="mb-3"></MDBCol>
                          <MDBCol col="6" class="mb-3">
                            <MDBDatepicker size="sm" v-model="nowReleaseDate" format=" YYYY-MM-DD " label="發行日"
                              ref="itemRelDate" />
                          </MDBCol>
                          <MDBCol col="6" class="mb-3">
                            <MDBDatepicker size="sm" v-model="nowExpDate" format=" YYYY-MM-DD " label="廢止日"
                              ref="itemExpDate" />
                          </MDBCol>
                          <MDBCol col="12" class="mb-3">
                            <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="上階文件" v-model="nowParents" />
                          </MDBCol>
                          <MDBSelect v-if="rGroup[1]" class="mb-3 col-6" style="padding-right: 0;" filter size="sm" label="加入上階文件"
                            v-model:options="parentsmu" v-model:selected="parentsel" />
                          <MDBCol v-if="rGroup[1]" col="6" class="mb-3 px-0">
                            <MDBBtn size="sm" color="primary" @click="addParentDoc()">加入</MDBBtn>
                          </MDBCol>
                          <MDBCol col="9" class="mb-3">
                            <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="掃描檔"
                              v-model="nowUpload">
                              <MDBBtnClose :disabled="!rGroup[1]" @click.prevent="nowUpload=''" class="btn-upload-close" />
                            </MDBInput>
                          </MDBCol>
                          <MDBCol col="3" class="px-0 mb-3">
                            <input type="file" accept=".pdf" id="itemUpload" @change="uploadChenge"
                              style="display: none;" />
                            <MDBBtn v-if="rGroup[1]" size="sm" color="primary" @click="uploadBtn">上傳</MDBBtn>
                            <MDBBtn tag="a" :href="nowDownLoad" download size="sm" color="secondary">下載</MDBBtn>
                          </MDBCol>
                          <MDBCol col="9" class="mb-3">
                            <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="編輯檔"
                              v-model="nowEdUpload">
                              <MDBBtnClose :disabled="!rGroup[1]" @click.prevent="nowEdUpload=''" class="btn-upload-close" />
                            </MDBInput>
                          </MDBCol>
                          <MDBCol col="3" class="px-0 mb-3">
                            <input type="file" accept=".doc,.docx" id="itemExpUpload" @change="uploadChenge"
                              style="display: none;" />
                            <MDBBtn v-if="rGroup[1]" size="sm" color="primary" @click="expUploadBtn">上傳</MDBBtn>
                            <MDBBtn tag="a" :href="nowEdDownLoad" download size="sm" color="secondary">下載</MDBBtn>
                          </MDBCol>
                          <MDBCol col="12" class="mb-3">
                            <MDBTextarea :disabled="!rGroup[1]" size="sm" label="備註" rows="2" v-model="nowComment" />
                          </MDBCol>
                        </MDBRow>
                      </MDBTabPane>
                    </MDBTabContent>
                    <!-- Tabs content -->
                  </MDBTabs>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方PDF顯示 -->
        <MDBCol md="4" class="h-100">
          <!-- PDF預覽 -->
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);"
            class="my-2 bg-light overflow-auto border border-5 rounded-8 shadow-4">
            <iframe id="pdf-js-viewer" :src="pdfPath" class="h-100 w-100"></iframe>
          </MDBRow>

        </MDBCol>
      </MDBRow>

      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" color="primary" position="top-right" stacking width="535px"
    appendToBody autohide :delay="2000">
    {{ infomsg }}
  </MDBAlert>
</template>
<style>
.datatable tbody tr:last-child {
  border-bottom: rgba(0,0,0,0);
  height: auto;
}
div.dataTables_filter {
  padding-top: 0.85em;
}
.colnowarp {
  white-space: nowrap;
}
#the-canvas {
  border: 1px solid black;
  direction: ltr;
}

.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}

</style>
