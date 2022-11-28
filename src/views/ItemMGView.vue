<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import path from "path-browserify";
import { ref, reactive, onMounted, provide, inject } from "vue";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBSelect,
  MDBCheckbox,
  MDBTextarea,
  MDBDatepicker,
  MDBPopconfirm,
  MDBBtnClose,
  MDBAlert,
} from 'mdb-vue-ui-kit';
import ToolsGQL from "../graphql/Tools";
import PrjGQL from "../graphql/Prj";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  // console.log(result.data)
  if (!result.data.checktoken) {
    logOut();
  }
});
getchecktoken();

DataTable.use(DataTableBs5);
DataTable.use(Select);

//#region 取得權限==========Start
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
  // rGroup[1]技術主管以上專用
  // rGroup[2]技術人員專用(非己不可改)
  // rGroup[3]最低權限
  // rGroup[4]完全開放
  switch (myUserRole.value){
    case 0://訪客
        result = [false,false,false,false,false];
      break;
    case 1://校正人員
        result = [false,false,false,false,false];
      break;
    case 2://技術主管
      result = [false,true,false,true,true];
      break;
    case 3://系統負責人
      result = [true,true,true,true,true];
    break;
  }
  return result;
});
//#endregion 取得權限==========End

//#region 參數==========Start
// infomation
const publicPath = inject('publicPath');
const NavItem = ref("items");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");

const notProssing = ref(false);
const updateKey = ref(0);

// 標準件
const selEqptType = ref("");
const selEqptTypeMU = ref([]);
const selEqptTypeDOM = ref();

const nowEqptId = ref("");
const nowEqptType = ref("");
const nowEqptTypeMU = ref([]);
const nowEqptTypeDOM = ref();

const nowEqptChop = ref("");
const nowEqptChopMU = ref([]);
const nowEqptChopDOM = ref();

const nowEqptModel = ref("");
const nowEqptModelMU = ref([]);
const nowEqptModelDOM = ref();

const nowEqptSN = ref("");
const nowEqptCycle = ref("");
const nowEqptComment = ref("");

// 查核紀錄
const nowChkId = ref("");
const nowChkType = ref("");
const nowChkDate = ref("");
const nowChkReportId = ref("");
const nowChkCalOrg = ref("");
const nowChkCalOrgMU = ref([]);
const nowChkCalOrgDOM = ref();

const nowChkCalOrgCode = ref("");
const nowChkCalPass = ref(false);
const nowChkCalResult = ref(""); //報告檔案
const nowChkCalResultDL = computed(()=>{
  if(nowChkCalResult.value){
    return publicPath.value + "01_Equipment/" + nowEqptId.value + "/" + nowChkCalResult.value
  }else{
    return ""
  }
});

const nowChkCalComment = ref("");

// PDF
const pdfPath = ref("pdfjs-dist/web/viewer.html");

//#endregion 參數==========End


//#region 標準件管理==========Start
const dt_eqpt2 = ref();
const table_eqpt2 = ref(); 
const data_eqpt2 = ref([]);
const columns_eqpt2 = [
  {title:"索引", data:"ref_equpt_id", defaultContent: "-", visible: true},
  {title:"儀器類別", data:"ref_eqpt_type.type", defaultContent: "-"},
  {title:"廠牌", data:"chop", defaultContent: "-"},
  {title:"型號", data:"model", defaultContent: "-"},
  {title:"序號", data:"serial_number", defaultContent: "-"},
  {title:"最新校正日", data:"latest_chk.check_date", defaultContent: "-", render: (data) => {
    return toTWDate(data);}},
  {title:"校正週期", data:"cal_cycle", defaultContent: "-",className: 'dt-center'},
  {title:"有效", data:"latest_chk.check_date", defaultContent: "-",className: 'dt-center', render: (data, type, row, meta) => {
    let isValid;
    let cycal = parseFloat(row.cal_cycle.slice(0,-1));
    if(new Date()-new Date(data) < cycal * 365.25 * 24 * 60 * 60 * 1000 ){
      isValid='<i class="fas fa-lg fa-check-circle text-success"></i>'
    }else{
      isValid='<i class="fas fa-lg fa-times-circle text-danger"></i>'
    }
    return isValid;}}, 
  {title:"備註", data:"comment", defaultContent: "-"},
];
const tboption_eqpt2 = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  scrollY: 'calc(45vh - 11.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};
// 查詢全標準件
const { onResult: getAllEqpt, refetch: refgetAllEqpt } = useQuery(PrjGQL.GETALLEQPT);
getAllEqpt(result=>{
  if(!result.loading){
    data_eqpt2.value = result.data.getAllEqpt;
  }
});
// refgetAllEqpt({type: (selEqptType.value && selEqptType.value!==-1)?selEqptType.value:null});

// 查詢全標準件 By ID
const { mutate: getEqptById, onDone: getEqptByIdOnDone, onError: getEqptByIdError } = useMutation(PrjGQL.GETEQPTBYID);
getEqptByIdOnDone(result=>{
  let getData = result.data.getEqptById;
  nowEqptType.value = parseInt(getData.type);
  nowEqptTypeDOM.value.setValue((nowEqptType.value)?nowEqptType.value:-1);

  nowEqptChop.value = getData.chop;
  nowEqptChopDOM.value.setValue((nowEqptChop.value)?nowEqptChop.value:-1);

  nowEqptModel.value = getData.model;
  nowEqptModelDOM.value.setValue((nowEqptModel.value)?nowEqptModel.value:-1);

  nowEqptSN.value = getData.serial_number;
  nowEqptCycle.value = getData.cal_cycle;
  nowEqptComment.value = getData.comment;
});

// 查詢標準件類型下拉式清單
const { onResult: getEqptType, refetch: refgetEqptType } = useQuery(PrjGQL.GETEQPTTYPE);
getEqptType(result=>{
  if(!result.loading){
    // 篩選區
    selEqptTypeMU.value = result.data.getEqptType.map(x => {
      return { text: x.type, value: parseInt(x.eqpt_type_id) }
    }); selEqptTypeMU.value.unshift({ text: "-未選取-", value: -1 });
    // 資料區
    nowEqptTypeMU.value = result.data.getEqptType.map(x => {
      return { text: x.type, value: parseInt(x.eqpt_type_id) }
    }); nowEqptTypeMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
refgetEqptType();
// 切換標準件類型
function changeEqptType(){
  refgetAllEqpt({type: (selEqptType.value && selEqptType.value!==-1)?selEqptType.value:null});
}

// 廠牌清單
const { mutate: getChopList, onDone: getChopListOnDone, onError: getChopListError } = useMutation(PrjGQL.GETCHOPLIST);
getChopListOnDone(result=>{
  let getData = result.data.getEqptChopList;
  nowEqptChopMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowEqptChopMU.value.unshift({ text: "-未選取-", value: -1 });
});
getChopList();
function updateChop(){
  let newoption = nowEqptChop.value;
  let findid = nowEqptChopMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowEqptChopMU.value.push({text: newoption, value: newoption})
    nowEqptChopDOM.value.setValue(newoption);
  }
}

// 型號清單
const { mutate: getEqptModelList, onDone: getEqptModelListOnDone, onError: getEqptModelListError } = useMutation(PrjGQL.GETMODELLIST);
getEqptModelListOnDone(result=>{
  let getData = result.data.getEqptModelList;
  nowEqptModelMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowEqptModelMU.value.unshift({ text: "-未選取-", value: -1 });
});
getEqptModelList();
function updateModeel(){
  let newoption = nowEqptModel.value;
  let findid = nowEqptModelMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowEqptModelMU.value.push({text: newoption, value: newoption})
    nowEqptModelDOM.value.setValue(newoption);
  }
}

// 新增
function newEqpt(){
  nowEqptId.value = "";
  nowEqptType.value = -1;
  nowEqptTypeDOM.value.setValue(-1);
  nowEqptChop.value = "";
  nowEqptChopDOM.value.setValue(-1);
  nowEqptModel.value = "";
  nowEqptModelDOM.value.setValue(-1);
  nowEqptSN.value = "";
  nowEqptCycle.value = "";
  nowEqptComment.value = "";
}

// 儲存
const { mutate: saveRefEqpt, onDone: saveRefEqptOnDone, onError: saveRefEqptError } = useMutation(PrjGQL.SAVEREFEQPT);
function saveEqpt(){
  saveRefEqpt({
    refEquptId: (parseInt(nowEqptId.value))?parseInt(nowEqptId.value):-1,
    chop: (nowEqptChop.value===-1)?null:nowEqptChop.value,
    model: (nowEqptModel.value===-1)?null:nowEqptModel.value,
    serialNumber: nowEqptSN.value,
    type: (parseInt(nowEqptType.value) && parseInt(nowEqptType.value)!==-1)?parseInt(nowEqptType.value):null,
    calCycle: nowEqptCycle.value,
    comment: nowEqptComment.value,
  }).then(res=>{
    nowEqptId.value = parseInt(res.data.updateRefEqpt.ref_equpt_id);
    return refgetAllEqpt({type: (selEqptType.value && selEqptType.value!==-1)?selEqptType.value:null});
  });
}

// 刪除
const { mutate: delRefEqpt, onDone: delRefEqptOnDone, onError: delRefEqptError } = useMutation(PrjGQL.DELREFEQPT);
function delEqpt(){
  delRefEqpt({
    refEquptId: parseInt(nowEqptId.value)
  }).then(res=>{
    nowEqptId.value = null;
    // 更新eqpt2 table
    return refgetAllEqpt({type: (selEqptType.value && selEqptType.value!==-1)?selEqptType.value:null});
  })
}

//#endregion 標準件管理==========End

//#region 查核紀錄==========Start
const dt_chk = ref();
const table_chk = ref(); 
const data_chk = ref([]);
const columns_chk = [
  {title:"有效", data:"check_date", defaultContent: "-",className: 'dt-center', render: (data, type, row, meta) => {
    let isValid;
    let cycal = parseFloat(row.ref_eqpt.cal_cycle.slice(0,-1));
    if(new Date()-new Date(data) < cycal * 365.25 * 24 * 60 * 60 * 1000 ){
      isValid='<i class="fas fa-lg fa-check-circle text-success"></i>'
    }else{
      isValid='<i class="fas fa-lg fa-times-circle text-danger"></i>'
    }
    return isValid;}},  
  {title:"通過", data:"pass", defaultContent: "-", render: (data, type, row, meta) => {
    let isValid;
    if(data){
      isValid='<span class="text-info">pass</span>'
    }else{
      isValid='<span class="text-danger">NoPass</span>'
    }
    return isValid;}},
  {title:"索引", data:"eq_ck_id", defaultContent: "-", visible: false},
  {title:"週期", data:"ref_eqpt.cal_cycle", defaultContent: "-"},
  {title:"校正日", data:"check_date", defaultContent: "-", render: (data) => {
    return toTWDate(data);}},
  {title:"報告編號", data:"report_id", defaultContent: "-"},
  {title:"校正實驗室", data:"cal_org", defaultContent: "-", visible: false},
];
const tboption_chk = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[2, 'desc']],
  scrollY: 'calc(50vh - 13.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};
// 查詢查核紀錄By標準件
const { mutate: getChkByEqpt, onDone: getChkByEqptOnDone, onError: getChkByEqptError } = useMutation(PrjGQL.GETCHKBYEQPTID);
getChkByEqptOnDone(result=>{
  data_chk.value = result.data.getChkByEqptId;
});
// 查詢查核紀錄By Id
const { mutate: getChkById, onDone: getChkByIdOnDone, onError: getChkByIdError } = useMutation(PrjGQL.GETCHKBYID);
getChkByIdOnDone(result=>{
  let getData = result.data.getChkById;
  nowChkType.value = getData.chek_type;
  nowChkDate.value = (getData.check_date)?getData.check_date.split('T')[0]:" ";
  nowChkReportId.value = getData.report_id;
  nowChkCalOrg.value = getData.cal_org;
  nowChkCalOrgDOM.value.setValue((nowChkCalOrg.value)?nowChkCalOrg.value:-1);

  nowChkCalOrgCode.value = getData.cal_org_id;
  nowChkCalPass.value = (getData.pass)?true:false;
  nowChkCalResult.value = getData.result;
  if (!getData.result){
    pdfPath.value = "pdfjs-dist/web/viewer.html";  
  }else{
    pdfPath.value = "pdfjs-dist/web/viewer.html?file=" + publicPath.value + "01_Equipment/" + nowEqptId.value + "/" + nowChkCalResult.value;
    // console.log(pdfPath.value)
  }
  nowChkCalComment.value = getData.comment;
});

// 新增Chk
function newChk(){
  nowChkId.value = "";
  nowChkType.value = "校正";
  nowChkDate.value = " ";
  nowChkReportId.value = "";
  nowChkCalOrg.value = "";
  nowChkCalOrgDOM.value.setValue(-1);

  nowChkCalOrgCode.value = "";
  nowChkCalPass.value = false;
  nowChkCalResult.value = "";
  pdfPath.value = "pdfjs-dist/web/viewer.html";
  nowChkCalComment.value = "";
}
// 儲存Chk
const { mutate: saveRefEqptChk, onDone: saveRefEqptChkOnDone, onError: saveRefEqptChkError } = useMutation(PrjGQL.SAVEREFEQPTCHK);
function saveChk(){
  saveRefEqptChk({
    eqCkId: (parseInt(nowChkId.value))?parseInt(nowChkId.value):-1,
    refEqptId: (parseInt(nowEqptId.value))?parseInt(nowEqptId.value):null,
    chekType: (nowChkType.value)?nowChkType.value:null,
    checkDate: (nowChkDate.value.trim() === "")? null: nowChkDate.value.trim() + "T00:00:00.000Z",
    reportId: (nowChkReportId.value)?nowChkReportId.value:null,
    calOrg: (nowChkCalOrg.value)?nowChkCalOrg.value:null,
    calOrgId: (nowChkCalOrgCode.value)?nowChkCalOrgCode.value:null,
    pass: (nowChkCalPass.value)?true:false,
    result: (nowChkCalResult.value)?nowChkCalResult.value:null,
    comment: (nowChkCalComment.value)?nowChkCalComment.value:null,
  }).then(res=>{
    nowChkId.value = parseInt(res.data.updateRefEqptChk.eq_ck_id);
    // 更新chk table
    return getChkByEqpt({refEqptId: parseInt(nowEqptId.value)});
  })
}

// 刪除Chk
const { mutate: delRefEqptChk, onDone: delRefEqptChkOnDone, onError: delRefEqptChkError } = useMutation(PrjGQL.DELREFEQPTCHK);
function delChk(){
  delRefEqptChk({
    eqCkId: parseInt(nowChkId.value)
  }).then(res=>{
    nowChkId.value = null;
    // 更新chk table
    return getChkByEqpt({refEqptId: parseInt(nowEqptId.value)});
  })
}

// 實驗室清單
const { mutate: getChkOrgList, onDone: getChkOrgListOnDone, onError: getChkOrgListError } = useMutation(PrjGQL.GETALLCHKORGLIST);
getChkOrgListOnDone(result=>{
  let getData = result.data.getAllChkOrgList;
  nowChkCalOrgMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowChkCalOrgMU.value.unshift({ text: "-未選取-", value: -1 });
});
getChkOrgList();
function updateChkOrg(){
  let newoption = nowChkCalOrg.value;
  let findid = nowChkCalOrgMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowChkCalOrgMU.value.push({text: newoption, value: newoption})
    nowChkCalOrgDOM.value.setValue(newoption);
  }
}

//#endregion 查核紀錄==========End

//#region 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId) {
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  const inputDOM = document.getElementById("AllUpload");
  inputDOM.setAttribute("accept","");
  switch (inputId) {
    case "ChkCalResult":
      inputDOM.setAttribute("accept",".pdf");
      break;
  }
  inputDOM.click();
}
// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e) {
  let selFileName;
  let subExt;
  if(e.type==='drop'){
    upFile.value = e.dataTransfer.files[0];
    selFileName = e.dataTransfer.files[0].name;
    subExt = path.extname(selFileName);
  }else{
    upFile.value = e.target.files[0];
    selFileName = e.target.value;
  }
  subExt = path.extname(selFileName);
  let subpath;
  let newName = "";
  let isUpload = false;
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "ChkCalResult":
      subpath = "01_Equipment/" + nowEqptId.value;
      newName = nowChkReportId.value + subExt;
      isUpload = true;
      break;
  }
  if (isUpload){
    await uploadFile({
      file: upFile.value,
      subpath: subpath,
      newfilename: newName,
    });
  }
}
// 上傳檔案
const { mutate: uploadFile, onDone: uploadFileOnDone } = useMutation(
  ToolsGQL.UPLOADFILE
);
uploadFileOnDone((result) => {
  // console.log("uploadFile")
  // 儲存(更新)上傳紀錄資料
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "ChkCalResult":
      nowChkCalResult.value = "";
      nowChkCalResult.value = result.data.uploadFile.filename;
      saveChk();
      break;
  }
  let inputDOM;
  inputDOM = document.getElementById("AllUpload");
  inputDOM.value = "";
});

// drop
function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
function dropFile(e){
  uploadType.value = e.target.id;
  uploadChenge(e);
}
//#endregion 檔案上傳==========End

//#region 加載表格選取事件==========Start
onMounted(function () {
  dt_eqpt2.value = table_eqpt2.value.dt();
  dt_eqpt2.value.on('select', function (e, dt, type, indexes) {
    nowEqptId.value = dt.rows(indexes).data()[0].ref_equpt_id;
    // 查詢查核紀錄
    getChkByEqpt({refEqptId: parseInt(nowEqptId.value)}).then(res=>{
      newChk();
    });
    // 查詢By ID
    getEqptById({refEquptId: parseInt(nowEqptId.value)});

    e.preventDefault();
    e.stopPropagation();
  });
  dt_eqpt2.value.on('draw', function (e, dt, type, indexes) {
    if(nowEqptId.value){
      selectNowId(nowEqptId.value, 'ref_equpt_id', dt_eqpt2.value);
    }
    e.preventDefault();
    e.stopPropagation();
  });
  
  dt_chk.value = table_chk.value.dt();
  dt_chk.value.on('select', function (e, dt, type, indexes) {
    nowChkId.value = dt.rows(indexes).data()[0].eq_ck_id;
    getChkById({eqCkId: parseInt(nowChkId.value)});
    e.preventDefault();
    e.stopPropagation();
  });
  dt_chk.value.on('draw', function (e, dt, type, indexes) {
    if(nowChkId.value){
      selectNowId(nowChkId.value, 'eq_ck_id', dt_chk.value);
    }
    e.preventDefault();
    e.stopPropagation();
  });
});

// 一定要由onMounted裡面的draw觸發，否則dt還未渲染，會找不到物件
function selectNowId(nowId, col, dt){
  if(parseInt(nowId)){
    dt.rows(function ( idx, data, node ) {
      return (parseInt(data[col])===parseInt(nowId))?true:false
    }).select();
  }
}

//#endregion 加載表格選取事件==========End



</script>
<template>
  <input type="file" id="AllUpload" @change="uploadChenge($event)" style="display: none" />
  <MDBAlert v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    autohide :delay="2000.0">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1/>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <!-- 左方列表 -->
        <MDBCol md="5" xl="5" class="h-100">
          <MDBRow class="h-100">
            <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
              <MDBRow class="h-100">
                <!-- 左上列表 -->
                <MDBCol col="12" style="height: 50%;" class="border-bottom">
                  <MDBRow class="h-100 align-content-start">
                    <MDBCol col="6"><span>標準件清單</span></MDBCol>
                    <MDBSelect filter size="sm" class="mt-2 col-6" 
                      label="儀器類型" 
                      v-model:options="selEqptTypeMU"
                      v-model:selected="selEqptType" 
                      ref="selEqptTypeDOM"
                      @change="changeEqptType" />
                    <DataTable :data="data_eqpt2" :columns="columns_eqpt2" :options="tboption_eqpt2" ref="table_eqpt2"
                      style="font-size: smaller;" class="display w-100 compact" />
                  </MDBRow>
                </MDBCol>
                <!-- 左下資料 -->
                <MDBCol col="12" style="height: 50%;" class="">
                  <!-- 功能按鈕 -->
                  <MDBRow>
                    <MDBCol col="12" class="py-2 border-bottom">
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newEqpt">新增</MDBBtn>
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveEqpt">儲存</MDBBtn>
                      <MDBPopconfirm :disabled="!rGroup[1] || !nowEqptId" 
                        class="btn-sm btn-danger me-auto" 
                        message="刪除後無法恢復，確定刪除嗎？"
                        cancelText="取消" confirmText="確定" 
                        @confirm="delEqpt">
                        刪除
                      </MDBPopconfirm>
                    </MDBCol>
                  </MDBRow>
                  <!-- 標準件資料表單 -->
                  <!-- 資料區 -->
                  <MDBRow style="height: calc(100% - 3.5rem);" class="overflow-auto align-content-start">
                    <MDBCol class="d-flex align-items-center">
                      標準件索引：<span class="text-info">{{nowEqptId}}</span>
                    </MDBCol>
                    <div></div>
                    <MDBSelect filter size="sm" class="mt-2 col-xl-8" 
                      label="儀器類型" 
                      v-model:options="nowEqptTypeMU"
                      v-model:selected="nowEqptType" 
                      ref="nowEqptTypeDOM"/>
                    
                    <MDBSelect size="sm" class="mt-2 col-xl-8" 
                      label="廠牌" 
                      v-model:options="nowEqptChopMU"
                      v-model:selected="nowEqptChop" 
                      ref="nowEqptChopDOM"
                      @close="updateChop()">
                      <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowEqptChop" />
                    </MDBSelect>
                    
                    <MDBSelect size="sm" class="mt-2 col-xl-8" 
                      label="型號" 
                      v-model:options="nowEqptModelMU"
                      v-model:selected="nowEqptModel" 
                      ref="nowEqptModelDOM"
                      @close="updateModeel()">
                      <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowEqptModel" />
                    </MDBSelect>

                    <MDBCol xl="8" class="mt-2">
                      <MDBInput size="sm" type="text" label="序號" v-model="nowEqptSN"/>
                    </MDBCol>
                    <MDBCol xl="8" class="mt-2">
                      <MDBInput size="sm" type="text" label="校正週期" v-model="nowEqptCycle"/>
                    </MDBCol>
                    <MDBCol col="12" class="mt-2">
                      <MDBTextarea size="sm" label="備註" rows="2" v-model="nowEqptComment" />
                    </MDBCol>

                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol md="7" xl="7" class="h-100">
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);" class="my-2 bg-light border border-5 rounded-8 shadow-4 overflow-auto">
            <!-- 查核紀錄 -->
            <MDBCol col="6" class="h-100 border-end">
              <MDBRow class="h-100">
                <!-- 上方 -->
                <MDBCol col="12" class="h-50 border-bottom">
                  查核紀錄
                  <DataTable :data="data_chk" :columns="columns_chk" :options="tboption_chk" ref="table_chk"
                    style="font-size: smaller;" class="display w-100 compact" />
                </MDBCol>
                <!-- 下方 -->
                <MDBCol col="12" class="h-50">
                  <!-- 功能按鈕 -->
                  <MDBRow>
                    <MDBCol col="12" class="py-2 border-bottom">
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newChk">新增</MDBBtn>
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveChk">儲存</MDBBtn>
                      <MDBPopconfirm :disabled="!rGroup[1] || !nowChkId" 
                        class="btn-sm btn-danger me-auto" 
                        message="刪除後無法恢復，確定刪除嗎？"
                        cancelText="取消" confirmText="確定" 
                        @confirm="delChk">
                        刪除
                      </MDBPopconfirm>
                    </MDBCol>
                  </MDBRow>
                  <!-- 資料區 -->
                  <MDBRow style="height: calc(100% - 3.5rem);" class="overflow-auto align-content-start">
                    <MDBCol class="d-flex align-items-center">
                      紀錄索引：<span class="text-info">{{nowChkId}}</span>
                    </MDBCol>
                    <div></div>
                    <MDBCol md="6" xl="4" class="mt-2">
                      <MDBInput readonly size="sm" type="text" label="校正類型" v-model="nowChkType" />
                    </MDBCol>
                    <MDBCol md="6" xl="4" class="mt-2">
                      <MDBDatepicker size="sm" v-model="nowChkDate" format="YYYY-MM-DD" label="校正日"
                        ref="nowChkDateDOM" />
                    </MDBCol>
                    <div></div>
                    <MDBCol col="8" class="mt-2">
                      <MDBInput size="sm" type="text" label="報告編號" v-model="nowChkReportId"/>
                    </MDBCol>
                    <MDBCol col="8" class="mt-2">
                      <MDBInput readonly style="padding-right: 2.2em" size="sm" type="text"
                        label="校正報告" v-model="nowChkCalResult">
                        <MDBBtnClose :disabled="!rGroup[1]" @click.prevent="nowChkCalResult = ''"
                          class="btn-upload-close" />
                      </MDBInput>
                    </MDBCol>

                    <MDBCol col="4" class="mt-2 ">
                      <MDBBtn :disabled="!rGroup[1] || !nowChkReportId || !nowEqptId" size="sm" color="primary" @click.prevent="uploadBtn('ChkCalResult')">上傳</MDBBtn>
                      <MDBBtn tag="a" target=_blank :href="nowChkCalResultDL" download size="sm" color="secondary">下載</MDBBtn>
                    </MDBCol>
                    <div></div>
                    <MDBSelect size="sm" class="mt-2 col-8" label="校正實驗室" 
                      v-model:options="nowChkCalOrgMU"
                      v-model:selected="nowChkCalOrg" 
                      ref="nowChkCalOrgDOM"
                      @close="updateChkOrg()">
                      <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowChkCalOrg" />
                    </MDBSelect>
                    <MDBCol col="4" class="mt-2">
                      <MDBInput size="sm" type="text" label="實驗室編號" v-model="nowChkCalOrgCode" />
                    </MDBCol>
                    <div></div>
                    <MDBCol md="6" xl="4" class="mt-2">
                      <MDBCheckbox label="通過" v-model="nowChkCalPass" />
                    </MDBCol>
                    <div></div>
                    <MDBCol col="12" class="mt-2">
                      <MDBTextarea size="sm" label="備註" rows="2" v-model="nowChkCalComment" />
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 校正報告 -->
            <MDBCol col="6" class="h-100 pb-2">
              <iframe id="pdf-js-viewer" :src="pdfPath" class="h-100 w-100"></iframe>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
</style>
