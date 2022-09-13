<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path, { join } from "path-browserify";
import {
  MDBInput,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBPopconfirm,
  MDBIcon,
  MDBAnimation,
  MDBAlert,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import jStat from "jstat";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";

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
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const updateKey = ref(0);

const nowUcModuleName = ref(""); // 模組名稱
const selectUcModuleName = ref(""); // 模組列表
const nowUcModuleNameMU = ref([]);
const nowUcModuleNameDOM = ref();

const selectUcCalType = ref(""); // 校正項目列表
const nowUcCalTypeMU = ref([]);
const nowUcCalTypeDOM = ref();

const nowUcModule = reactive({uc:{}}); // 不確定度模組物件
const nowUcSection = ref(0); // 目前Section
const nowUcItem = ref(0); // 目前Item
const nowUcItemX = ref(0); // 目前Item
const nowUcItemFr = ref(0); // 目前Item
const nowUcItemFa = ref(0); // 目前Item

const selectUcSecType = ref(""); // 校正項目列表
const nowUcSecTypeMU = ref([
  {text: "", value: ""},
  {text: "平面", value: "平面"},
  {text: "高程", value: "高程"},
]);
const nowUcSecTypeDOM = ref();

const selectFrequency = ref(""); //變動時機
const nowFrequencyMU = ref([
  {text: "", value: ""},
  {text: "系統評估", value: "系統評估"},
  {text: "每年量測", value: "每年量測"},
  {text: "每次校正", value: "每次校正"},
]);
const nowFrequencyDOM = ref();
const ucModuleTemp = {
  "calType": "",
  "prjcode": "",
  "ver": "",
  "minUcH": "",
  "minUcV": "",
  "confLevel": "",
  "uom": "",
  "data": [
    {
      "section": "",
      "type": "",
      "comment": "",
      "data": [
        {
          "name": "",
          "frequency": "",
          "x": [],
          "x_title": [],
          "fr": [],
          "fr_title": [],
          "fa": [],
          "fa_title": [],
          "ux": "",
          "freedom": "",
          "factor": ""
        },]
    },]
};

const nowUcModuleDL = computed(() => {
  if (nowUcModuleName.value && nowUcModuleName.value !== "" && nowUcModuleName.value !== ".json") {
    return "06_Case/uncertainty/" + nowUcModuleName.value;
  } else {
    return undefined;
  }
});

// Section表格
let dt1;
const table1 = ref(); 
const columns1 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
  {title:"Section", data:"section"},
  {title:"Type", data:"type"},
];
const tboption1 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// Item表格
let dt2;
const table2 = ref(); 
const data2 = ref([]);
const columns2 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
  {title:"Item", data:"name"},
  {title:"變動時機", data:"frequency"},
];
const tboption2 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// ux表格
let dt3;
const table3 = ref(); 
const data3 = ref([]);
const columns3 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"x_title"},
  {title:"值", data:"x"},
];
const tboption3 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// freedom表格
let dt4;
const table4 = ref(); 
const data4 = ref([]);
const columns4 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"fr_title"},
  {title:"值", data:"fr"},
];
const tboption4 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// factor表格
let dt5;
const table5 = ref(); 
const data5 = ref([]);
const columns5 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},  
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"fa_title"},
  {title:"值", data:"fa"},
];
const tboption5 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// 查詢校正項目列表
const { result: caseCalType, onResult: getCaseCalType, refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);
getCaseCalType(result => {
  // 加入校正項目選單資料
  if (!result.loading) {
    // 篩選區
    nowUcCalTypeMU.value = result.data.getCaseCalType.map(x => {
      return { text: x.code,secondaryText: x.name, value: x.code }
    }); nowUcCalTypeMU.value.unshift({ text: "", value: "" });
  }
});
refgetCaseCalType();

// 取得不確定度列表
const {
  mutate: getUcList,
  onDone: getUcListOnDone,
  onError: getUcListError,
} = useMutation(CaseGQL.GETUCLIST);
getUcListOnDone((result) => {
  // 填入uclist選單
  if (!result.loading && result.data.getUclist) {
    let myArray = result.data.getUclist.map((x) => {
      return { text: x, value: x };
    });
    myArray.sort((a,b)=>{
      return (a.text > b.text)?1:-1
    }).reverse().unshift({ text: "", value: "" });
    nowUcModuleNameMU.value = myArray;
  }
});

// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    nowUcSection.value = dt.rows(indexes)[0][0];
    data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    nowUcItem.value = 0;
    nowUcItemX.value = 0;
    nowUcItemFr.value = 0;
    nowUcItemFa.value = 0;
    getItemData();
  });

  dt2 = table2.value.dt();
  dt2.on('select', function (e, dt, type, indexes) {
    nowUcItem.value = dt.rows(indexes)[0][0];
    getItemData();
  });

  dt3 = table3.value.dt();
  dt3.on('select', function (e, dt, type, indexes) {
    nowUcItemX.value = dt.rows(indexes)[0][0];
  });

  dt4 = table4.value.dt();
  dt4.on('select', function (e, dt, type, indexes) {
    nowUcItemFr.value = dt.rows(indexes)[0][0];
  });

  dt5 = table5.value.dt();
  dt5.on('select', function (e, dt, type, indexes) {
    nowUcItemFa.value = dt.rows(indexes)[0][0];
  });

  // 將選單設定為初始
  getUcList();
  createNewUc();
});

function readUcModule(){
  selectUcModuleName.value = nowUcModuleNameDOM.value.inputValue;
  if(selectUcModuleName.value){
    getUcModule();
  }else{
    createNewUc();
  }
}

// 執行取得不確定度模組getUcModule
const { mutate: getUcModule, onDone: getUcModuleOnDone, onError: getUcModuleError } = useMutation(
  CaseGQL.GETUCMODULE,
  () => ({
    variables: {
      filename: selectUcModuleName.value,
    }
  })
);
getUcModuleOnDone(result=>{
  // 填入基本資料
  nowUcModule.uc = JSON.parse(result.data.getUcModule);
  nowUcModuleName.value = selectUcModuleName.value;
  nowUcCalTypeDOM.value.setValue(nowUcModule.uc.calType);
  nowUcSection.value=0;
  nowUcItem.value=0;
  nowUcItemX.value=0;
  nowUcItemFr.value=0;
  nowUcItemFa.value=0;
  data2.value=nowUcModule.uc.data[nowUcSection.value].data;
  getItemData();
  // console.log(nowUcModule.uc);
  // console.log(nowUcCalTypeDOM.value);

});

function getItemData(){
  let x_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x;
  let x_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title;
  let fr_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr;
  let fr_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title;
  let fa_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa;
  let fa_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title;
  data3.value=[];
  for(let i=0; i<x_Array.length;i++){
    data3.value.push({x_title:x_title_Array[i],x:x_Array[i]});
  }
  data4.value=[];
  for(let i=0; i<fr_Array.length;i++){
    data4.value.push({fr_title:fr_title_Array[i],fr:fr_Array[i]});
  }
  data5.value=[];
  for(let i=0; i<fa_Array.length;i++){
    data5.value.push({fa_title:fa_title_Array[i],fa:fa_Array[i]});
  }

  selectUcSecType.value = nowUcModule.uc.data[nowUcSection.value].type;
  if(nowUcSecTypeDOM.value){nowUcSecTypeDOM.value.setValue(nowUcModule.uc.data[nowUcSection.value].type);}
  selectFrequency.value = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency;
  if(nowFrequencyDOM.value){nowFrequencyDOM.value.setValue(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency);}
  
}

// 新增模組
function createNewUc(){
  nowUcModuleName.value = ".json";
  nowUcModule.uc = JSON.parse(JSON.stringify(ucModuleTemp));
  nowUcCalTypeDOM.value.setValue(nowUcModule.uc.calType);
  nowUcSection.value = 0;
  nowUcItem.value = 0;
  nowUcItemX.value = 0;
  nowUcItemFr.value = 0;
  nowUcItemFa.value = 0;
  data2.value=nowUcModule.uc.data[nowUcSection.value].data;
  getItemData();
}

// 儲存模組
const { mutate: saveUcModule, onDone: saveUcModuleOnDone, onError: saveUcModuleError } = useMutation(
  CaseGQL.SAVEUCMODULE,
  () => ({
    variables: {
      filename: nowUcModuleName.value,
      ucModuleStr: JSON.stringify(nowUcModule.uc),
    }
  })
);
saveUcModuleOnDone(result=>{
  // console.log(nowUcModule.uc);
  // 更新狀態訊息
  infomsg.value = "模組 "+ nowUcModuleName.value + "儲存完畢";
  // alertColor.value = "primary";
  // alert1.value = true;
  getUcList().then(res=>{
    nowUcModuleNameDOM.value.setValue(result.data.saveUcModule);
  });
});

// 增加Section
function addSection(){
  nowUcModule.uc.data.push(JSON.parse(JSON.stringify(ucModuleTemp.data[0])));
}
// 刪除Section
function delSection(){
  if(nowUcModule.uc.data.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data.splice(nowUcSection.value,1);
    // 更新table
    nowUcSection.value=0;
    nowUcItem.value=0;
    nowUcItemX.value=0;
    nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    getItemData();
  }
}

// 增加Item
function addItem(){
  nowUcModule.uc.data[nowUcSection.value].data.push(JSON.parse(JSON.stringify(ucModuleTemp.data[0].data[0])));
}
// 刪除Item
function delItem(){
  if(nowUcModule.uc.data[nowUcSection.value].data.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data.splice(nowUcItem.value,1);
    // 更新table
    // nowUcSection.value=0;
    nowUcItem.value=0;
    nowUcItemX.value=0;
    nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    getItemData();
  }
}

// 增加Ux
function addUx(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title.push("");
  getItemData();
}
// 刪除Ux
function delUx(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.splice(nowUcItemX.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title.splice(nowUcItemX.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    nowUcItemX.value=0;
    // nowUcItemFr.value=0;
    // nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    getItemData();
  }
}

// 增加fr
function addFr(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title.push("");
  getItemData();
}
// 刪除fr
function delFr(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.splice(nowUcItemFr.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title.splice(nowUcItemFr.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    // nowUcItemX.value=0;
    nowUcItemFr.value=0;
    // nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    getItemData();
  }
}

// 增加fa
function addFa(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title.push("");
  getItemData();
}
// 刪除fa
function delFa(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.splice(nowUcItemFa.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title.splice(nowUcItemFa.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    // nowUcItemX.value=0;
    // nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    getItemData();
  }
}

// 下拉式選單資料回填
function updateCalType(){
  // console.log("selectUcCalType:",selectUcCalType.value);
  nowUcModule.uc.calType = selectUcCalType.value;
}
function updataSecType(){
  // console.log("selectUcSecType:",selectUcSecType.value);
  nowUcModule.uc.data[nowUcSection.value].type = selectUcSecType.value;
}
function updataFr(){
  // console.log("selectFrequency:",selectFrequency.value);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency = selectFrequency.value;
}

function addParam(tid){
  switch(tid){
    case 3:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].ux = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].ux + "parms["+ nowUcItemX.value +"]";    
      break;
    case 4:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].freedom = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].freedom + "parms["+ nowUcItemFr.value +"]";    
      break;
    case 5:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].factor = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].factor + "parms["+ nowUcItemFa.value +"]";    
      break;
  }
  
}

// 試算Uc
const { mutate: testUc, onDone: testUcOnDone, onError: testUcError } = useMutation(
  CaseGQL.GETUCRESULTFORMJSON,
  () => ({
    variables: {
      filename: nowUcModuleName.value,
    }
  })
);
testUcOnDone(result=>{
  // 更新狀態訊息
  infomsg.value = "試算結果 ucH: "+ result.data.getUcResultformJson.ucH_o + " ucV: " + result.data.getUcResultformJson.ucV_o;
  // alertColor.value = "primary";
  // alert1.value = true;
});


</script>
<template>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    appendToBody autohide :delay="2000">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100 overflow-hidden">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <div style="height: calc(100% - 6.5em);">
        <MDBRow style="margin-left:0;margin-right:0;" class="h-100 justify-content-between flex-md-nowrap overflow-visible">
          <!-- 左 -->
          <MDBCol md="4" class="h-100 ps-0 pe-1">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Base內容 -->
              <MDBSelect size="sm" class="my-3 col-12" label="選擇不確定度模組" v-model:options="nowUcModuleNameMU"
                v-model:selected="selectUcModuleName" ref="nowUcModuleNameDOM" @close="readUcModule"/>
              <MDBCol col="12" class="mb-3">
                <MDBBtn :disabled="!rGroup[1]" v-if="nowUcModuleName===selectUcModuleName" size="sm" color="primary" @click="saveUcModule">儲存</MDBBtn>
                <MDBBtn :disabled="!rGroup[1]" v-else size="sm" color="primary" @click="saveUcModule">另存新檔</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="testUc">試算</MDBBtn>
                <MDBBtn size="sm" color="primary">
                  <RouterLink target="_blank" :to="{ path: '/sicltab08', query: { moduleName: nowUcModuleName },}">
                    <span class="btn-primary">列印計算表</span>
                  </RouterLink>
                </MDBBtn>
                <MDBBtn tag="a" :href="nowUcModuleDL" download size="sm" color="secondary">下載</MDBBtn>
              </MDBCol>

              <MDBCol col="8" class="mb-3">
                <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="模組名稱" v-model="nowUcModuleName"/>
              </MDBCol>

              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                基本資訊
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBSelect :disabled="!rGroup[1]" size="sm" class="my-3 col-8" label="校正項目" v-model:options="nowUcCalTypeMU"
                    v-model:selected="selectUcCalType" ref="nowUcCalTypeDOM" @change="updateCalType"/>

                  <MDBCol col="8" class="mb-3">
                    <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="量測作業編號" v-model="nowUcModule.uc.prjcode"/>
                  </MDBCol>

                  <MDBCol col="8" class="mb-3">
                    <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="系統評估版本" v-model="nowUcModule.uc.ver"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-3">
                    <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="最小不確定度H" v-model="nowUcModule.uc.minUcH"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-3">
                    <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="最小不確定度V" v-model="nowUcModule.uc.minUcV"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-3">
                    <MDBInput :disabled="!rGroup[1]" size="sm" type="text" label="長度單位" v-model="nowUcModule.uc.uom"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>

              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                Section列表
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol md="12" class="mt-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addSection">增加項目</MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="delSection">刪除項目</MDBBtn>
                  </MDBCol>
                  <MDBCol md="12" class="mb-3">
                    <DataTable :data="nowUcModule.uc.data" :columns="columns1" :options="tboption1" ref="table1"
                      style="font-size: smaller" class="border border-info display w-100 compact" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 中 -->
          <MDBCol md="4" class="h-100 px-1">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Section內容 -->
              <MDBCol col="8" class="my-3">
                目前Section：{{nowUcSection}}
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-secondary text-white">
                Section基本資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="8" class="my-3">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="Section" v-model="nowUcModule.uc.data[nowUcSection].section"/>
                  </MDBCol>
                  <MDBSelect :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" class="mb-3 col-8" label="type" v-model:options="nowUcSecTypeMU"
                    v-model:selected="selectUcSecType" ref="nowUcSecTypeDOM" @change="updataSecType"/>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" label="comment" rows="2" v-model="nowUcModule.uc.data[nowUcSection].comment"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-secondary text-white">
                Item列表
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol md="12" class="mt-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addItem">增加項目</MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="delItem">刪除項目</MDBBtn>
                  </MDBCol>
                  <MDBCol md="12" class="mb-3">
                    <DataTable :data="data2" :columns="columns2" :options="tboption2" ref="table2"
                      style="font-size: smaller" class="border border-secondary display w-100 compact" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 右 -->
          <MDBCol md="4" class="h-100 ps-1 pe-0">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Item內容 -->
              <MDBCol col="8" class="my-3">
                目前Item：{{nowUcItem}}
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-success text-white">
                Item基本資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="8" class="my-3">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="name" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].name"/>
                  </MDBCol>
                  <MDBSelect :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" class="mb-3 col-8" label="變動時機" v-model:options="nowFrequencyMU"
                    v-model:selected="selectFrequency" ref="nowFrequencyDOM" @change="updataFr"/>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-success text-white">
                ux不確定度
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- ux -->
                  <MDBCol md="12" class="mt-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addUx">增加項目</MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="delUx">刪除項目</MDBBtn>
                  </MDBCol>
                  <MDBCol md="12" class="mb-3">
                    <DataTable :data="data3" :columns="columns3" :options="tboption3" ref="table3"
                      style="font-size: smaller" class="border border-success display w-100 compact" />
                  </MDBCol>
                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].x_title[nowUcItemX]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].x[nowUcItemX]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="12" class="mb-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(3)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                  </MDBCol>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="ux計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].ux"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-success text-white">
                自由度
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- freedom -->
                  <MDBCol md="12" class="mt-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addFr">增加項目</MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="delFr">刪除項目</MDBBtn>
                  </MDBCol>
                  <MDBCol md="12" class="mb-3">
                    <DataTable :data="data4" :columns="columns4" :options="tboption4" ref="table4"
                      style="font-size: smaller" class="border border-success display w-100 compact" />
                  </MDBCol>
                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fr_title[nowUcItemFr]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fr[nowUcItemFr]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="12" class="mb-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(4)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                  </MDBCol>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="freedom計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].freedom"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-success text-white">
                靈敏係數
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- factor -->
                  <MDBCol md="12" class="mt-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="addFa">增加項目</MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="delFa">刪除項目</MDBBtn>
                  </MDBCol>
                  <MDBCol md="12" class="mb-3">
                    <DataTable :data="data5" :columns="columns5" :options="tboption5" ref="table5"
                      style="font-size: smaller" class="border border-success display w-100 compact" />
                  </MDBCol>

                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fa_title[nowUcItemFa]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="6" class="mb-0">
                    <MDBInput :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fa[nowUcItemFa]" @keyup="getItemData"/>
                  </MDBCol>
                  <MDBCol col="12" class="mb-2">
                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(5)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                  </MDBCol>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea :disabled="!rGroup[1]" v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="factor計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].factor"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
        

      </div>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.datatable tbody tr:last-child {
  border-bottom: rgba(0,0,0,0);
  height: auto;
}
.rounded-top-5 {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}

.rounded-top-7 {
  border-top-right-radius: 1rem !important;
  border-top-left-radius: 1rem !important;
}

.rounded-bottom-5 {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}

.rounded-bottom-7 {
  border-bottom-right-radius: 1rem !important;
  border-bottom-left-radius: 1rem !important;
}

.addParamBtn{
  width: 100%;
  line-height: 0.5;
}
</style>