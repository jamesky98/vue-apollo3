<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import path from "path-browserify";
import { ref, reactive, onMounted, provide, inject } from "vue";
import {
  MDBInput,
  MDBSelect,
  MDBDatepicker,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSpinner,
  MDBBtn,
  MDBPopconfirm,
  MDBTabs,
  MDBTabNav,
  MDBTabItem,
  MDBTabContent,
  MDBTabPane,
} from 'mdb-vue-ui-kit';
import ToolsGQL from "../graphql/Tools";
import GcpGQL from "../graphql/Gcp";
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
const NavItem = ref("prjs");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const activeTabId1 = ref("gcp_mg");
const notProssing = ref(false);
const notProssing2 = ref(true);

const updateKey = ref(0);

const nowPrjId = ref("");
const nowPrjCode = ref("");
const nowPrjCalTypeId = ref("");
const nowPrjCalTypeMU = ref([]);
const nowPrjCalTypeDOM = ref();

const nowPrjMethod = ref("");
const nowPrjMethodMU = ref([
  {text: "-未選取-", value: "-1"},
  {text: "量測", value: "量測"},
  {text: "巡查", value: "巡查"},
  {text: "中間查核", value: "中間查核"},
]);
const nowPrjMethodDOM = ref();

const nowPrjYear = ref("");
const nowPrjMonth = ref("");
const nowPrjOrganizer = ref("");
const nowPrjOrganizerMU = ref([]);
const nowPrjOrganizerDOM = ref();

const nowPrjStartDate = ref("");
const nowPrjStartDateDOM = ref();

const nowPrjEndDate = ref("");
const nowPrjEndDateDOM = ref();

const nowPrjPublishDate = ref("");
const nowPrjPublishDateDOM = ref("");

const nowGcpId = ref("");
const nowGcpRecordId = ref("");

//#endregion 參數==========End

//#region 測量作業列表==========Start
const dt_prj = ref();
const table_prj = ref(); 
const data_prj = ref([]);
const columns_prj = [
  {title:"序號", data:"id", defaultContent: "-", visible: false},
  {title:"編號", data:"project_code", defaultContent: "-"},
  {title:"項目", data:"cal_type_id", defaultContent: "-", render: (data, type, row) => {
      let markicon = "";
      let classn = "";
      let calName = ""
      switch (data) {
        case 1: //航測像機
          markicon = '<i class="fas fa-plane-departure"></i>';
          classn = "typeF";
          calName = "航測像機";
          break;
        case 2: //空載光達
          markicon = '<i class="fas fa-wifi"></i>';
          classn = "typeI"
          calName = "空載光達";
          break;
      }
      // return "<span class='" + classn + "'>" + markicon + row.cal_type.name + "</span>"
      return "<span class='" + classn + "'>" + markicon + calName + "</span>"
  }},
  {title:"類型", data:"method", defaultContent: "-"},
  {title:"年", data:"year", defaultContent: "-"},
  {title:"月", data:"month", defaultContent: "-"},
  {title:"執行單位", data:"organizer", defaultContent: "-"},
  {title:"發布日", data:"publish_date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
];
const tboption_prj = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'desc']],
  scrollY: 'calc(50vh - 12.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

// 查詢AllPrj
const { onResult: getAllPrj, refetch: refgetAllPrj} = useQuery(PrjGQL.GETALLPRJ);
getAllPrj(result=>{
  if(!result.loading && result.data.getAllPrj){
    notProssing.value = true;
    data_prj.value = result.data.getAllPrj;
    // 填入執行單位選單
    let orglist = [];
    orglist = result.data.getAllPrj.map(x => { return x.organizer });//從物件陣列中取出成陣列
    orglist = [...new Set(orglist)]; //ES6排除重複值語法
    nowPrjOrganizerMU.value = orglist.sort().map(x => {
      return { text: x, value: x }
    }); nowPrjOrganizerMU.value.unshift({text: "-未選取-", value: "-1"});
  }
});
refgetAllPrj();

// 查詢PrjByID
const { onResult: getPrjById, refetch: refgetPrjById } = useQuery(
  PrjGQL.GETPRJBYID, () => ({
    getPrjByIdId: -1,
}));
getPrjById(result=>{
  if(!result.loading && result.data.getPrjById){
    let getData = result.data.getPrjById;
    // console.log(getData);
    nowPrjCode.value = getData.project_code;
    nowPrjCalTypeId.value = getData.cal_type_id;
    nowPrjCalTypeDOM.value.setValue(nowPrjCalTypeId.value);

    nowPrjMethod.value = getData.method;
    nowPrjMethodDOM.value.setValue(nowPrjMethod.value);

    nowPrjYear.value = getData.year;
    nowPrjMonth.value = getData.month;
    nowPrjOrganizer.value = getData.organizer;
    nowPrjOrganizerDOM.value.setValue(nowPrjOrganizer.value);

    nowPrjStartDate.value = (getData.start_date)?(getData.start_date.split("T")[0]):" ";
    nowPrjEndDate.value = (getData.end_date)?(getData.end_date.split("T")[0]):" ";
    nowPrjPublishDate.value = (getData.publish_date)?(getData.publish_date.split("T")[0]):" ";
  }
});
refgetPrjById();

// 查詢校正項目列表
const { onResult: getCaseCalType, refetch: refgetCaseCalType } = useQuery(PrjGQL.GETCASECALTYPE);
getCaseCalType(result=>{
  if(!result.loading && result.data.getCaseCalType){
    nowPrjCalTypeMU.value = result.data.getCaseCalType.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    }); nowPrjCalTypeMU.value.unshift({ text:"-未選取-", value: -1 });
  }
});
refgetCaseCalType();

// 執行單位列表
function updatePrjOrganizer(){
  let newoption = nowPrjOrganizer.value;
  let findid = nowPrjOrganizerMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowPrjOrganizerMU.value.push({text: newoption, value: newoption})
    nowPrjOrganizerDOM.value.setValue(newoption);
  }
}

// 新增
function createPrj(){
  let temp;
  nowPrjId.value = "";
  nowPrjCode.value = "";
  nowPrjCalTypeId.value = -1;
  nowPrjCalTypeDOM.value.setValue(nowPrjCalTypeId.value);
  nowPrjMethod.value = "";
  nowPrjMethodDOM.value.setValue(-1);
  nowPrjYear.value = "";
  nowPrjMonth.value = "";
  nowPrjOrganizer.value = "";
  nowPrjOrganizerDOM.value.setValue(-1);
  nowPrjStartDate.value = " ";
  nowPrjEndDate.value = " ";
  nowPrjPublishDate.value = " ";
}
// 儲存
const { mutate: savePrj, onDone: savePrjOnDone, onError: savePrjError } = useMutation(PrjGQL.SAVEPRJ);
savePrjOnDone(result=>{
  infomsg.value = "編號 " + result.data.updateRefPrj.project_code + "儲存完畢";
});
function savePrjBtn(){
  savePrj({
    updateRefPrjId: (parseInt(nowPrjId.value))?parseInt(nowPrjId.value):-1,
    projectCode: (nowPrjCode.value)?nowPrjCode.value:null,
    calTypeId: (parseInt(nowPrjCalTypeId.value) && parseInt(nowPrjCalTypeId.value)!==-1)?parseInt(nowPrjCalTypeId.value):null,
    method: (nowPrjMethod.value && nowPrjMethod.value!=='-1')?nowPrjMethod.value:null,
    year: (parseInt(nowPrjYear.value))?parseInt(nowPrjYear.value):null,
    month: (parseInt(nowPrjMonth.value))?parseInt(nowPrjMonth.value):null,
    organizer: (nowPrjOrganizer.value && nowPrjOrganizer.value!==-'1')?nowPrjOrganizer.value:null,
    startDate: (nowPrjStartDate.value.trim() === "")? null: nowPrjStartDate.value.trim() + "T00:00:00.000Z",
    endDate: (nowPrjEndDate.value.trim() === "")? null: nowPrjEndDate.value.trim() + "T00:00:00.000Z",
    publishDate: (nowPrjPublishDate.value.trim() === "")? null: nowPrjPublishDate.value.trim() + "T00:00:00.000Z",
  }).then(res=>{
    refgetAllPrj().then(res=>{
      if(nowPrjId.value){
        dt_prj.value.rows(function ( idx, data, node ) {
          return (data.id===nowPrjId.value)?true:false
        }).select();
      } 
    });
  });
}

// 刪除
const { mutate: delPrj, onDone: delPrjOnDone, onError: delPrjError } = useMutation(PrjGQL.DELPRJ);
delPrjOnDone(result=>{
  infomsg.value = "編號 " + result.data.delRefPrj.project_code + "儲存完畢";
});

// 匯入紀錄
const { mutate: inputGcpRd, onDone: inputGcpRdOnDone, onError: inputGcpRdError } = useMutation(PrjGQL.INPUTGCPRECORDS);
inputGcpRdOnDone(result=>{
  console.log(result.data.inputGCPRecords);
});
function inputRecord(POfile){
  if (POfile) {
    let inputArray = [];
    const fReader = new FileReader();
    fReader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        // 全文件轉換成行
        let allTextLines = evt.target.result.split(/\r\n|\n/);
        // 逐行解析
        let i = 0;
        let ptData = [];
        let lineString = "";
        for(let i=0;i<allTextLines.length;i++){
          lineString = allTextLines[i].trim();
          if (lineString !== "") {
            let ptObj = {};
            ptData = lineString.split("\t");
            ptObj.gcp_id = ptData[1];
            ptObj.project_id = parseInt(nowPrjId.value);
            ptObj.date = new Date(ptData[3]+' GMT+0000').toISOString();
            ptObj.person = ptData[4];
            ptObj.status = ptData[5];
            ptObj.coor_E = (parseFloat(ptData[6]))?parseFloat(ptData[6]):null;
            ptObj.coor_N = (parseFloat(ptData[7]))?parseFloat(ptData[7]):null;
            ptObj.coor_h = (parseFloat(ptData[8]))?parseFloat(ptData[8]):null;
            ptObj.close_photo = ptData[1] + '-1.jpg';
            ptObj.far_photo1 = ptData[1] + '-2.jpg';
            ptObj.far_photo2 = ptData[1] + '-3.jpg';
            ptObj.far_photo3 = ptData[1] + '-4.jpg';
            ptObj.obstruction = null;
            ptObj.ismodify = (ptData[9])?1:0;
            ptObj.comment = (ptData[10])?ptData[10]:null;

            inputArray.push(ptObj);
          }
        }
        // console.log(inputArray)
        inputGcpRd({
          records: inputArray
        }).then(res=>{
          // 更新gcp table
          notProssing2.value = false;
          getRcordByPrj({projectId: parseInt(nowPrjId.value)});
        });
      }
    }
    //真正執行以文字方式載入檔案
    fReader.readAsText(POfile);
  }

  // 歸零
  let inputDOM;
  inputDOM = document.getElementById("AllUpload");
  inputDOM.value = "";
}
//#endregion 測量作業列表==========End

//#region 參考值管理==========Start
const dt_gcp = ref();
const table_gcp = ref(); 
const data_gcp = ref([]);
const columns_gcp = [
  {title:"序號", data:"id", defaultContent: "-", visible: false},
  {title:"點號", data:"gcp_id", defaultContent: "-"},
  {title:"狀態", data:"status", defaultContent: "-", render: statusRender},
  {title:"清查人", data:"person", defaultContent: "-"},
  {title:"清查日", data:"date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"類別", data:"gcp.gcp_type.type_name", defaultContent: "-"},
  {title:"坐標E", data:"coor_E", defaultContent: "-"},
  {title:"坐標N", data:"coor_N", defaultContent: "-"},
  {title:"坐標h", data:"coor_h", defaultContent: "-"},
];
const tboption_gcp = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'desc']],
  scrollY: 'calc(100vh - 18rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

// 查詢record by prj
const { mutate: getRcordByPrj, onDone: getRcordByPrjOnDone, onError: getRcordByPrjError } = useMutation(PrjGQL.CALREFGCP);
getRcordByPrjOnDone(result=>{
  data_gcp.value = result.data.calRefGcp;
  notProssing2.value = true;
});

//#endregion 參考值管理==========End

//#region 點位狀態顯示樣式
function statusRender(data,type,row){
  let markicon="";
  let classn="";
  switch (data) {
    case "遺失":
      markicon = '<i class="fas fa-lg fa-times"></i>';
      classn = "status89";
      break;
    case "損毀":
      markicon = '<i class="fas fa-skull-crossbones"></i>';
      classn = "status89";
      break;
    case "正常":
      markicon = '<i class="fas fa-check"></i>';
      classn = "status7";
      break;
    case "不適用":
      markicon = '<i class="fas fa-ban"></i>';
      classn = "status23";
      break;
    case "停用":
      markicon = '<i class="fas fa-ban"></i>';
      classn = "status23";
      break;
    default:
      markicon = '<i class="fas fa-exclamation-circle"></i>';
      classn = "status1";
  }
  return "<span class='" + classn +"'>" + markicon + data + "</span>"
}
//#endregion 點位狀態顯示樣式

//#region 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId) {
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  const inputDOM = document.getElementById("AllUpload");
  inputDOM.setAttribute("accept","");
  switch (inputId) {
    case "inputRecord":
      // inputDOM.setAttribute("accept",".csv");
      break;
    case "GcpSimage":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "GcpDespImg":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "PRecordImg0":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "PRecordImg1":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "PRecordImg2":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "PRecordImg3":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "PRecordImgObs":
      inputDOM.setAttribute("accept","image/*");
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
    case "inputRecord":
      inputRecord(upFile.value);
      break;
    case "GcpSimage":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-A" + subExt;
      isUpload = true;
      break;
    case "GcpDespImg":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-B" + subExt;
      isUpload = true;
      break;
    case "PRecordImg0":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-1" + subExt;
      isUpload = true;
      break;
    case "PRecordImg1":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-2" + subExt;
      isUpload = true;
      break;
    case "PRecordImg2":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-3" + subExt;
      isUpload = true;
      break;
    case "PRecordImg3":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-4" + subExt;
      isUpload = true;
      break;
    case "PRecordImgObs":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-C" + subExt;
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
    case "GcpSimage":
      nowGcpSimage.value = "";
      nowGcpSimage.value = result.data.uploadFile.filename;
      saveGcpBtn();
      break;
    case "GcpDespImg":
      nowGcpDespImg.value = "";
      nowGcpDespImg.value = result.data.uploadFile.filename;
      saveGcpBtn();
      break;
    case "PRecordImg0":
      nowPRecordImg0.value = ""
      nowPRecordImg0.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
      break;
    case "PRecordImg1":
      nowPRecordImg1.value = "";
      nowPRecordImg1.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
      break;
    case "PRecordImg2":
      nowPRecordImg2.value = "";
      nowPRecordImg2.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
      break;
    case "PRecordImg3":
      nowPRecordImg3.value = "";
      nowPRecordImg3.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
      break;
    case "PRecordImgObs":
      nowPRecordObs.value = "";
      nowPRecordObs.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
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

// 加載表格選取事件
onMounted(function () {
  dt_prj.value = table_prj.value.dt();
  dt_prj.value.on('select', function (e, dt, type, indexes) {
    nowPrjId.value = dt.rows(indexes).data()[0].id;
    refgetPrjById({ getPrjByIdId: parseInt(nowPrjId.value) });
    notProssing2.value = false;
    getRcordByPrj({projectId: parseInt(nowPrjId.value)});
  });

  dt_gcp.value = table_gcp.value.dt();
  // dt_gcp.on('select', function (e, dt, type, indexes) {
  //   nowPRecordId.value = dt.rows(indexes).data()[0].id;
  //   getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
  // });
});

</script>
<template>
  <input type="file" id="AllUpload" @change="uploadChenge($event)" style="display: none" />
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1/>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <!-- 左方列表 -->
        <MDBCol md="4" xl="4" class="h-100">
          <MDBRow class="h-100">
            <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
              <MDBRow class="h-100">
                <!-- 左上列表 -->
                <MDBCol col="12" style="height: 50%;position: relative ;" class="overflow-auto border-bottom">
                  <div :class="{ 'hiddenSpinner': notProssing}" style="position: absolute; left: 50%; top: 10rem;">
                    <MDBSpinner size="md" color="primary" />Loading...
                  </div>
                  <div class="mt-2" style="position:absolute;">目前作業：<span class="text-info">{{nowPrjCode}} - {{nowPrjId}}</span></div>
                  <DataTable :data="data_prj" :columns="columns_prj" :options="tboption_prj" ref="table_prj"
                    style="font-size: smaller;" class="display w-100 compact" />
                </MDBCol>
                <!-- 左下資料 -->
                <MDBCol col="12" style="height: 50%;" class="">
                  <MDBRow class="align-content-start">
                    <!-- 功能按鈕 -->
                    <MDBCol col="12" class="py-2 border-bottom">
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="createPrj">新增</MDBBtn>
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="savePrjBtn">儲存</MDBBtn>
                      <MDBPopconfirm :disabled="!rGroup[1] || !nowPrjId" class="btn-sm btn-danger me-auto" message="刪除後無法恢復，確定刪除嗎？"
                        cancelText="取消" confirmText="確定" @confirm="delPrj">
                        刪除
                      </MDBPopconfirm>
                      <MDBBtn :disabled="!rGroup[1] || !nowPrjId" size="sm" color="primary" @click="uploadBtn('inputRecord')">匯入紀錄</MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                    <!-- 資料 -->
                    <MDBCol col="12" class="mt-2">
                      資料編輯
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput readonly size="sm" type="text" label="序號" v-model="nowPrjId" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput size="sm" type="text" label="作業編號" v-model="nowPrjCode" />
                    </MDBCol>
                    <MDBSelect size="sm" class="mt-2 col-xl-6" label="校正項目" v-model:options="nowPrjCalTypeMU"
                      v-model:selected="nowPrjCalTypeId" ref="nowPrjCalTypeDOM" />
                    <MDBSelect size="sm" class="mt-2 col-xl-6" label="作業類型" v-model:options="nowPrjMethodMU"
                      v-model:selected="nowPrjMethod" ref="nowPrjMethodDOM" />
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput size="sm" type="text" label="作業年份" v-model="nowPrjYear" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput size="sm" type="text" label="作業年月" v-model="nowPrjMonth" />
                    </MDBCol>
                    <MDBSelect size="sm" class="mt-2 col-xl-12" label="執行單位" v-model:options="nowPrjOrganizerMU"
                      v-model:selected="nowPrjOrganizer" ref="nowPrjOrganizerDOM" @close="updatePrjOrganizer()">
                      <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowPrjOrganizer" />
                    </MDBSelect>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker size="sm" v-model="nowPrjStartDate" format=" YYYY-MM-DD " label="開始作業"
                        ref="nowPrjStartDateDOM" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker size="sm" v-model="nowPrjEndDate" format=" YYYY-MM-DD " label="結束作業"
                        ref="nowPrjEndDateDOM" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker size="sm" v-model="nowPrjPublishDate" format=" YYYY-MM-DD " label="發布日期"
                        ref="nowPrjPublishDateDOM" />
                    </MDBCol>

                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol md="8" xl="8" class="h-100">
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);" class="my-2 bg-light border border-5 rounded-8 shadow-4">
            <MDBCol col="12" class="h-100">
                <!-- Tabs -->
                <MDBTabs v-model="activeTabId1">
                  <!-- Tabs navs -->
                  <MDBTabNav tabsClasses="">
                    <MDBTabItem tabId="gcp_mg" href="gcp_mg">參考值管理</MDBTabItem>
                    <MDBTabItem tabId="item_mg" href="item_mg">標準件管理</MDBTabItem>
                  </MDBTabNav>
                  <!-- Tabs Content -->
                  <MDBTabContent :key="updateKey" style="height: calc(100% - 3rem);">
                    <!-- 參考值管理 -->
                    <MDBTabPane tabId="gcp_mg" class="h-100">
                      <MDBRow class="h-100">
                        <MDBCol lg="5" class="h-100 border-end" style="position:relative ;">
                          <div :class="{ 'hiddenSpinner': notProssing2}" style="position: absolute; left: 50%; top: 10rem;">
                            <MDBSpinner size="md" color="primary" />Loading...
                          </div>
                          <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                            style="font-size: smaller;" class="display w-100 compact" />
                        </MDBCol>
                        <MDBCol lg="7" class="h-100">
                          表單
                        </MDBCol>
                      </MDBRow>                    
                    </MDBTabPane>
                    <!-- 標準件管理 -->
                    <MDBTabPane tabId="item_mg" class="h-100">
                      <MDBRow class="h-100">
                        <MDBCol lg="5" class="h-100 border-end">
                          列表
                        </MDBCol>
                        <MDBCol lg="7" class="h-100">
                          表單
                        </MDBCol> 
                      </MDBRow> 
                    </MDBTabPane>
                  </MDBTabContent>
                </MDBTabs>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
