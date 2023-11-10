<script setup>
import Chart from 'chart.js/auto';
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import path from "path-browserify";
import { ref, watch, onMounted, provide, inject } from "vue";
import {
  MDBInput,  MDBSelect,  MDBDatepicker,
  MDBCol,  MDBRow,  MDBContainer,
  MDBSpinner,  MDBBtn,  MDBPopconfirm,
  MDBTabs,  MDBTabNav,  MDBTabItem,  MDBTabContent,  MDBTabPane,
  MDBTextarea,  MDBLightbox,  MDBLightboxItem,
  MDBSwitch,  MDBCheckbox,  MDBAlert,
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from 'mdb-vue-ui-kit';
import ToolsGQL from "../graphql/Tools";
import GcpGQL from "../graphql/Gcp";
import PrjGQL from "../graphql/Prj";
import { computed } from "@vue/reactivity";
import { downloadGCP, downloadRef } from "../methods/share.js"
import { 
    monthsFull, 
    monthsShort, 
    weekdaysFull, 
    weekdaysShort,
    weekdaysNarrow
  } from "../methods/datePickerParams.js"
import { useStore } from 'vuex'

// dataTable 
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import Select from 'datatables.net-select';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import print from 'datatables.net-buttons/js/buttons.print'
import colvis from 'datatables.net-buttons/js/buttons.colVis'
import 'datatables.net-responsive';
import ButtonsBs5 from 'datatables.net-buttons-bs5';

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate, domTextSelect, updateSelMU } from '../methods/User';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

DataTable.use(DataTablesCore);
DataTable.use(Select);
DataTable.use(ButtonsHtml5);
DataTable.use(print);
DataTable.use(colvis);
DataTable.use(ButtonsBs5);

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

const rGroupSetting = inject("rGroupSetting");
const rGroup =computed(()=>{
  return rGroupSetting(myUserRole.value,false)
});
//#endregion 取得權限==========End

//#region 參數==========Start
// infomation
const NavItem = ref("prjs");
provide("NavItem",NavItem);
const infomsg = ref("");
const msgColor = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const activeTabId1 = ref("gcp_mg");
const notProssing = ref(false);
const notProssing2 = ref(true);
const notProssing3 = ref(true);
const updateKey = ref(0);
const updateKey2 = ref(0);
const updateKey3 = ref(0);
const dlGCPdropdown1 = ref(false);
const showRefReport = ref(false);
const store = useStore();
const publicPath = computed(() => store.state.selectlist.publicPath);

const nowPrjId = ref("");
const nowPrjCode = ref("");
const nowPrjCalTypeId = ref("");
const nowPrjCalTypeMU = computed(() => store.state.selectlist.caseCalTypeList2);
const nowPrjCalTypeDOM = ref();

const nowPrjMethod = ref("");
const nowPrjMethodMU = computed(() => store.state.selectlist.prjMethodList);
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

// 參考值表單
// 基本資料
const nowPRecordPtId = ref("");
const nowGcpEnable = ref(true);

const nowGcpTypeCode = ref("");
const nowGcpTypeCodeMU = computed(() => store.state.selectlist.gcpTypeList);
const nowGcpTypeCodeDOM = ref();

const nowGcpOwnerShip = ref("");
const nowGcpOwnerShipMU = computed(() => store.state.selectlist.gcpOwnerShipList);
const nowGcpOwnerShipDOM = ref();

const nowGcpEstablishment = ref("");
const nowGcpEstDate = ref("");

const nowGcpPavement = ref("");
const nowGcpPavementMU = computed(() => store.state.selectlist.gcpPavementList);
const nowGcpPavementDOM = ref();

const nowGcpStyle = ref("");
const nowGcpStyleMU = ref([]);
const nowGcpStyleDOM = ref();

const nowGcpSimage = ref("");
const nowGcpSimageDL = computed(()=>{
  if(nowGcpSimage.value){
    return publicPath.value + "04_GCP/Pt/" + nowGcpSimage.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowGcpComment = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  if(nowGcpDespImg.value){
    return publicPath.value + "04_GCP/Pt/" + nowGcpDespImg.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowGcpDespStr = ref("");
const nowGcpNeedContact = ref(false);
const nowGcpContactId = ref("");
const nowGcpContactMU = ref([]);
const nowGcpContactDOM = ref();
const nowGcpContactName = ref("");

const nowGcpContactAds = ref("");
const nowGcpContactPrs = ref("");
const nowGcpContactTel = ref("");
const nowGcpContactCom = ref("");

// 紀錄資料
const nowPRecordId = ref("");

const nowPRecordPrjId = ref("");
const nowPRecordPrjIdMU = ref([]);
const nowPRecordPrjIdDOM = ref();
const nowPRecordPrjCode = ref("");

const nowPRecordDate = ref("");
const nowPRecordDateDOM = ref();

const nowPRecordPerson = ref("");
const nowPRecordPersonMU = ref([]);
const nowPRecordPersonDOM = ref();

const nowPRecordPtStatus = ref("");
const nowPRecordPtStatusMU = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.ptStatusMU)));
const nowPRecordPtStatusDOM = ref();

const nowPRecordE = ref("");
const nowPRecordN = ref("");
const nowPRecordh = ref("");
const nowPRecordCoor = computed(()=>{
  if(nowPRecordE.value && nowPRecordN.value && nowPRecordh.value){
    return parseFloat(nowPRecordE.value).toFixed(3) + ", " + parseFloat(nowPRecordN.value).toFixed(3) + ", " + parseFloat(nowPRecordh.value).toFixed(3);
  }else{
    return ""
  }
});

const nowPRecordCom = ref("");
const nowPRecordImg0 = ref("");
const nowPRecordImg0DL = computed(()=>{
  if(nowPRecordImg0.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  if(nowPRecordImg1.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  if(nowPRecordImg2.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  if(nowPRecordImg3.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

const nowPRecordObs = ref("");
const nowPRecordObsDL = computed(()=>{
  if(nowPRecordObs.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordObs.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});

// 標準件
const nowEqptType = ref("");
const nowEqptTypeMU = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.eqptTypeList)));
const nowEqptTypeDOM = ref();
const nowEqptId = ref("");

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
    return publicPath.value + "01_Equipment/" + nowEqptId.value + "/" + nowChkCalResult.value + '?t=' + new Date().getTime()
  }else{
    return ""
  }
});
const chkResultPDF = ref("pdfjs-dist/web/viewer.html");

const nowChkCalComment = ref("");

// 作業與查核之連結紀錄
const nowLinkId = ref("");
const nowLinkChkId = ref("");
const nowLinkDel = ref([]);

// 管制圖
const refPrjCodeF = ref("");
const refPrjCodeFMU = ref([]);
const refPrjCodeFDOM = ref();

const ccLabel_F = ref("");
const ccAvg_F = ref("");
const ccStd_F = ref("");
const ccMax_F = ref("");
const ccMin_F = ref("");
const cchasData_F = ref(false);

const refPrjCodeI = ref("");
const refPrjCodeIMU = ref([]);
const refPrjCodeIDOM = ref();

const ccLabel_I = ref("");
const ccAvg_I = ref("");
const ccStd_I = ref("");
const ccMax_I = ref("");
const ccMin_I = ref("");
const cchasData_I = ref(false);

const refPrjCodeJ = ref("");
const refPrjCodeJMU = ref([]);
const refPrjCodeJDOM = ref();

const ccLabel_J = ref("");
const ccAvg_J = ref("");
const ccStd_J = ref("");
const ccMax_J = ref("");
const ccMin_J = ref("");
const cchasData_J = ref(false);

const refPrjCodeM = ref("");
const refPrjCodeMMU = ref([]);
const refPrjCodeMDOM = ref();

const ccLabel_M = ref("");
const ccAvg_M = ref("");
const ccStd_M = ref("");
const ccMax_M = ref("");
const ccMin_M = ref("");
const cchasData_M = ref(false);


let ctlChartF;
let ctlChartJ;
let ctlChartI;
let ctlChartM;

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
          markicon = '<i class="fas fa-wifi rotation180"></i>';
          classn = "typeI"
          calName = "空載光達";
          break;
        case 9: //車載光達
          markicon = '<i class="fas fa-taxi"></i>';
          classn = "typeM"
          calName = "車載光達";
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
  dom: 'Bfti',
  buttons: [
    {
      text: '重新整理',
      className: 'btn-sm',
      action: function ( e, dt, node, config ) {
        refgetAllPrj();
      }
    },
    {
      extend: 'copy',
      text: '複製',
      className: 'btn-sm',
      exportOptions: {
        modifier: {
          selected: null
        }
      }
    },
    {
      extend: 'colvis',
      className: 'btn-sm',
      text: '顯示欄位',
    }
  ],
  select: {style: 'single',info: false},
  order: [[1, 'desc']],
  scrollY: 'calc(50vh - 12rem)',
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
const { onDone: getAllPrjonDone, mutate: refgetAllPrj, onError: getAllPrjonError } = useMutation(PrjGQL.GETALLPRJ);
getAllPrjonDone(result=>{
  if(!result.loading && result.data.getAllPrj){
    notProssing.value = true;
    data_prj.value = result.data.getAllPrj;
    // 填入執行單位選單
    let orglist = [];
    orglist = result.data.getAllPrj.map(x => { return x.organizer });//從物件陣列中取出成陣列
    orglist = [...new Set(orglist)]; //ES6排除重複值語法
    let temp = orglist.sort().map(x => {
      return { text: x, value: x }
    }); temp.unshift({text: "-未選取-", value: -1});

    nowPrjOrganizerMU.value = temp;
    // console.log('OrgMU',nowPrjOrganizerMU.value);
  }
});
getAllPrjonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 查詢PrjByID
const { onDone: getPrjByIdonDone, mutate: refgetPrjById, onError: getPrjByIdonError } = useMutation(
  PrjGQL.GETPRJBYID, () => ({
    getPrjByIdId: -1,
}));
getPrjByIdonDone(result=>{
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

    let getEqpt = result.data.getPrjById.ref_use_eqpt;
    if(getEqpt){
      data_eqpt.value = getEqpt;
    }
  }
});
getPrjByIdonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 執行單位列表
function updatePrjOrganizer(){
  updateSelMU({
    newValue: nowPrjOrganizer,
    nowMU: nowPrjOrganizerMU,
    nowDOM: nowPrjOrganizerDOM,
    isUseID: false,
  })
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
  nowPrjOrganizer.value = -1;
  nowPrjOrganizerDOM.value.setValue(-1);
  nowPrjStartDate.value = " ";
  nowPrjEndDate.value = " ";
  nowPrjPublishDate.value = " ";
  // console.log('Org',nowPrjOrganizer.value);
  // console.log('OrgMU',nowPrjOrganizerMU.value);
}
// 儲存
const { mutate: savePrj, onDone: savePrjOnDone, onError: savePrjError } = useMutation(PrjGQL.SAVEPRJ);
savePrjOnDone(result=>{
  infomsg.value = "編號 " + result.data.updateRefPrj.project_code + "儲存完畢";
  msgColor.value = "blue";
});
savePrjError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
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
  infomsg.value = "編號 " + result.data.delRefPrj.project_code + "刪除完畢";
  msgColor.value = "blue";
});
delPrjError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function delPrjBtn(){
  delPrj({delRefPrjId: parseInt(nowPrjId.value)}).then(res=>{
    refgetAllPrj();
  })
}

// 匯入紀錄
const { mutate: inputGcpRd, onDone: inputGcpRdOnDone, onError: inputGcpRdError } = useMutation(PrjGQL.INPUTGCPRECORDS);
inputGcpRdOnDone(result=>{
  // console.log(result.data.inputGCPRecords);
});
inputGcpRdError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
function inputRecord(POfile){
  if (POfile) {
    notProssing2.value = false;
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
          // console.log(res)
          infomsg.value = '共匯入' + res.data.inputGCPRecords + '筆紀錄';
          msgColor.value = "blue";
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
  {title:"序號", data:"gcp_record[0].id", defaultContent: "-", visible: false},
  {title:"點號", data:"id", defaultContent: "-"},
  {title:"狀態", data:"gcp_record[0].status", defaultContent: "-", render: statusRender},
  {title:"清查人", data:"gcp_record[0].person", defaultContent: "-"},
  {title:"清查日", data:"gcp_record[0].date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"類別", data:"gcp_type.type_name", defaultContent: "-"},
  {title:"坐標E", data:"gcp_record[0].coor_E", defaultContent: "-"},
  {title:"坐標N", data:"gcp_record[0].coor_N", defaultContent: "-"},
  {title:"坐標h", data:"gcp_record[0].coor_h", defaultContent: "-"},
  {title:"備註", data:"gcp_record[0].comment", defaultContent: "-"},
];
const tboption_gcp = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
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
const { mutate: getRcordByPrj, onDone: getRcordByPrjOnDone, onError: getRcordByPrjError } = useMutation(
  GcpGQL.GETALLGCP
);
getRcordByPrjOnDone(result=>{
  data_gcp.value = result.data.getAllGcp;
  notProssing2.value = true;
});
getRcordByPrjError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 作業編號清單
const { onDone: getAllPrjlistonDone, mutate: refgetAllPrjlist, onError: getAllPrjlistonError } = useMutation(PrjGQL.GETALLPRJ);
getAllPrjlistonDone(result=>{
  if(!result.loading && result.data.getAllPrj){
    let recordPrjList=[];
    result.data.getAllPrj.map(x => {
      recordPrjList.push({ text: x.project_code, value: parseInt(x.id)});
    }); 

    recordPrjList.sort((a,b)=>{
      return (a.text < b.text)?1:-1;
    });recordPrjList.unshift({ text: "-未選取-", value: -1 });
    nowPRecordPrjIdMU.value = recordPrjList;
  }
});
getAllPrjlistonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function nowPrjClose(e){
  if(nowPRecordPrjId.value===-1){
    nowPRecordPrjCode.value = ""  
  }else{
    nowPRecordPrjCode.value = document.querySelector('#PrjMGSelPrjId input').value;
  }
}

// 查詢Record單筆紀錄
const { mutate: getRecordById, onDone: getRecordByIdOnDone, onError: getRecordByIdError } = useMutation(GcpGQL.GETRECORDBYID);
getRecordByIdOnDone(result=>{
  if(result.data.getGcpRecordById){
    // console.log("getRecordByIdOnDone")
    let getData = result.data.getGcpRecordById;
    let getBase = result.data.getGcpRecordById.gcp;
    // console.log("getBase",getBase)
    nowPRecordPtId.value = getData.gcp_id;
    nowPRecordPrjId.value = getData.project_id;
    nowPRecordPrjIdDOM.value.setValue(nowPRecordPrjId.value);

    nowPRecordPrjCode.value = (getData.ref_project)?getData.ref_project.project_code:"";
    nowPRecordDate.value = (getData.date)?(getData.date.split("T")[0]):" ";
    nowPRecordPerson.value = getData.person;
    nowPRecordPersonDOM.value.setValue(nowPRecordPerson.value);

    nowPRecordPtStatus.value = getData.status;
    nowPRecordPtStatusDOM.value.setValue(nowPRecordPtStatus.value);

    nowPRecordE.value = getData.coor_E;
    nowPRecordN.value = getData.coor_N;
    nowPRecordh.value = getData.coor_h;
    nowPRecordCom.value = getData.comment;
    nowPRecordImg0.value = getData.close_photo;
    nowPRecordImg1.value = getData.far_photo1;
    nowPRecordImg2.value = getData.far_photo2;
    nowPRecordImg3.value = getData.far_photo3;
    nowPRecordObs.value = getData.obstruction; //透空圖

    // 基本資料
    nowGcpEnable.value = (getBase.enable===1)?true:false;
    nowGcpTypeCode.value = getBase.type_code;
    nowGcpTypeCodeDOM.value.setValue(nowGcpTypeCode.value);
    nowGcpOwnerShip.value = getBase.ownership;
    nowGcpOwnerShipDOM.value.setValue(nowGcpOwnerShip.value);
    nowGcpEstablishment.value = getBase.establishment;
    nowGcpEstDate.value = getBase.Est_date;
    nowGcpPavement.value = getBase.pavement;
    nowGcpPavementDOM.value.setValue(nowGcpPavement.value);
    nowGcpStyle.value = getBase.style;
    nowGcpStyleDOM.value.setValue(nowGcpStyle.value);
    nowGcpSimage.value = getBase.aerial_img;
    nowGcpComment.value = getBase.comment;
    nowGcpDespImg.value = getBase.pt_map;
    nowGcpDespStr.value = getBase.pt_desc;
    nowGcpNeedContact.value = (getBase.need_contact===1)?true:false;
    nowGcpContactId.value = (getBase.contact_id)?getBase.contact_id:-1;
    nowGcpContactDOM.value.setValue(nowGcpContactId.value);
    if(getBase.gcp_contact){
      nowGcpContactName.value = getBase.gcp_contact.name;
      nowGcpContactAds.value = getBase.gcp_contact.address;
      nowGcpContactPrs.value = getBase.gcp_contact.person;
      nowGcpContactTel.value = getBase.gcp_contact.tel;
      nowGcpContactCom.value = getBase.gcp_contact.comment;
    }else{
      nowGcpContactName.value = '-未選取-';
      nowGcpContactAds.value = "";
      nowGcpContactPrs.value = "";
      nowGcpContactTel.value = "";
      nowGcpContactCom.value = "";
    }
    // console.log('getRecordById')
    updateKey2.value=updateKey2.value+1;
  }
});
getRecordByIdError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 新增
function newPRecordBtn(){
  // 基本資料
  nowGcpEnable.value = true;
  nowGcpTypeCode.value = -1;
  nowGcpTypeCodeDOM.value.setValue(nowGcpTypeCode.value);
  nowGcpOwnerShip.value = "-1";
  nowGcpOwnerShipDOM.value.setValue(nowGcpOwnerShip.value);
  nowGcpEstablishment.value = "";
  nowGcpEstDate.value = "";
  nowGcpPavement.value = "-1";
  nowGcpPavementDOM.value.setValue(nowGcpPavement.value);
  nowGcpStyle.value = "-1";
  nowGcpStyleDOM.value.setValue(nowGcpStyle.value);
  nowGcpDespStr.value = "";
  nowGcpDespImg.value = "";
  nowGcpSimage.value = "";
  nowGcpNeedContact.value = false;
  nowGcpContactId.value = -1;
  nowGcpContactDOM.value.setValue(nowGcpContactId.value);
  nowGcpComment.value = "";
  nowGcpContactAds.value = "";
  nowGcpContactPrs.value = "";
  nowGcpContactTel.value = "";
  nowGcpContactCom.value = "";

  // 紀錄資料
  nowPRecordId.value = "";
  nowPRecordPtId.value = "";
  nowPRecordPrjId.value = parseInt(nowPrjId.value);
  nowPRecordPrjIdDOM.value.setValue(nowPRecordPrjId.value);
  nowPRecordPrjCode.value = "";
  nowPRecordDate.value = " ";
  nowPRecordPerson.value = -1;
  nowPRecordPersonDOM.value.setValue(-1);
  nowPRecordPtStatus.value = -1;
  nowPRecordPtStatusDOM.value.setValue(-1);
  nowPRecordE.value = "";
  nowPRecordN.value = "";
  nowPRecordh.value = "";
  nowPRecordCom.value = "";
  nowPRecordImg0.value = "";
  nowPRecordImg1.value = "";
  nowPRecordImg2.value = "";
  nowPRecordImg3.value = "";
  nowPRecordObs.value = "";

  dt_gcp.value.rows().deselect();
}

// 儲存
const { mutate: saveGcp, onDone: saveGcpOnDone, onError: saveGcpError } = useMutation(GcpGQL.UPDATEGCP);
const { mutate: saveGcpContact, onDone: saveGcpContactOnDone, onError: saveGcpContactError } = useMutation(GcpGQL.UPDATEGCPCONTACT);
const { mutate: saveGcpRecord, onDone: saveGcpRecordOnDone, onError: saveGcpRecordError } = useMutation(GcpGQL.UPDATEGCPRECORD);

saveGcpOnDone(result=>{
  infomsg.value = "點位 " + result.data.updateGCP.id + "儲存完畢";
  msgColor.value = "blue";
});
saveGcpContactOnDone(result=>{
  infomsg.value = "聯絡機關 " + result.data.updateGcpContact.id + "儲存完畢";
  msgColor.value = "blue";
});
saveGcpRecordOnDone(result=>{
  infomsg.value = "維護紀錄 " + result.data.updateGcpRecord.id + "儲存完畢";
  msgColor.value = "blue";
});

saveGcpError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
saveGcpContactError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
saveGcpRecordError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function saveGcpRecordBtn(){
  // 點號 作業編號 為必要
  if(!nowPRecordPtId.value){
    infomsg.value = "缺少點號"
    msgColor.value = "red";
    // alert1.value = true;
    return
  }
  if(!nowPRecordPrjId.value || parseInt(nowPRecordPrjId.value)===-1){
    infomsg.value = "缺少作業編號"
    msgColor.value = "red";
    // alert1.value = true;
    return
  }
  if(!nowGcpTypeCode.value || parseInt(nowGcpTypeCode.value)===-1){
    infomsg.value = "缺少點號類別"
    msgColor.value = "red";
    // alert1.value = true;
    return
  }
  let nowID = nowPRecordId.value;
  let nowPtID = nowPRecordPtId.value;
  // console.log('nowID',nowID);
  alert1.value = false;
  
    // 1-儲存聯繫資料
    let result = new Promise((resovle,rej)=>{
      let res;
      if(nowGcpContactId.value>-1 || nowGcpContactId.value===-2){
        res=saveGcpContact({
          updateGcpContactId: nowGcpContactId.value,
          name: document.querySelector('#contactSelectDOM div input').value,
          address: nowGcpContactAds.value,
          person: nowGcpContactPrs.value,
          tel: nowGcpContactTel.value,
          comment: nowGcpContactCom.value,
        })
      }else{
        res=null
      }
      resovle(res);
    }).then(res=>{
      // 更新contact menu
      // refgetAllContact();
      store.dispatch('selectlist/fetchGcpContactList');
      
      // 取得儲存contact的新ID
      return nowGcpContactId.value = (res)?parseInt(res.data.updateGcpContact.id):-1;
    }).then(res=>{
      // 2-儲存點位基本資料
      return saveGcp({
        updateGcpId: (nowPRecordPtId.value)?nowPRecordPtId.value:'-1',
        enable: (nowGcpEnable.value)?1:0,
        typeCode: (nowGcpTypeCode.value && nowGcpTypeCode.value!==-1)?parseInt(nowGcpTypeCode.value):null,
        ownership: nowGcpOwnerShip.value,
        establishment: nowGcpEstablishment.value,
        estDate: parseInt(nowGcpEstDate.value),
        pavement: (nowGcpPavement.value && nowGcpPavement.value!=='-1')?nowGcpPavement.value:null,
        style: (nowGcpStyle.value && nowGcpStyle.value!=='-1')?nowGcpStyle.value:null,
        ptDesc: nowGcpDespStr.value,
        ptMap: nowGcpDespImg.value,
        aerialImg: nowGcpSimage.value,
        needContact: (nowGcpNeedContact.value)?1:0,
        contactId: (res && res>-1)?res:null,
        comment: nowGcpComment.value,
      })
    }).then(res=>{
      // 3-儲存點位維護資料
      return saveGcpRecord({
        updateGcpRecordId: (parseInt(nowPRecordId.value))?parseInt(nowPRecordId.value):-1,
        gcpId: (nowPRecordPtId.value)?nowPRecordPtId.value:null,
        projectId: (parseInt(nowPRecordPrjId.value) && parseInt(nowPRecordPrjId.value)!==-1)?parseInt(nowPRecordPrjId.value):null,
        date: (nowPRecordDate.value.trim() === "")? null: nowPRecordDate.value.trim() + "T00:00:00.000Z",
        person: (nowPRecordPerson.value && nowPRecordPerson.value!==-1)?nowPRecordPerson.value:"",
        status: (nowPRecordPtStatus.value && nowPRecordPtStatus.value!==-1)?nowPRecordPtStatus.value:null,
        coorE: (parseFloat(nowPRecordE.value))?parseFloat(nowPRecordE.value):null,
        coorN: (parseFloat(nowPRecordN.value))?parseFloat(nowPRecordN.value):null,
        coorH: (parseFloat(nowPRecordh.value))?parseFloat(nowPRecordh.value):null,
        closePhoto: nowPRecordImg0.value,
        farPhoto1: nowPRecordImg1.value,
        farPhoto2: nowPRecordImg2.value,
        farPhoto3: nowPRecordImg3.value,
        obstruction: nowPRecordObs.value,
        comment: nowPRecordCom.value,
      })
    }).then(res=>{
      // 更新列表
      infomsg.value = "點位 " + res.data.updateGcpRecord.gcp_id + "紀錄儲存完畢"
      msgColor.value = "blue";
      notProssing2.value = false;
      return getRcordByPrj({projectId: parseInt(nowPrjId.value)});
    }).then(res=>{
      // 選擇目前點位
      dt_gcp.value.rows(function(idx,data,node){
        return data.id === nowPtID? true:false;
      }).select();
      return getRecordById({getGcpRecordByIdId: parseInt(nowID)});
    });
}

// 刪除
const { mutate: delGcpRecord, onDone: delGcpRecordOnDone, onError: delGcpRecordError } = useMutation(
  GcpGQL.DELGCPRECORD);
delGcpRecordOnDone(result=>{
  infomsg.value = "點位 " + result.data.delGcpRecord.gcp_id + "紀錄刪除完畢"
  msgColor.value = "blue";
});
delGcpRecordError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function delGcpRecordBtn(){
  delGcpRecord({
    delGcpRecordId: parseInt(nowPRecordId.value)
  }).then(res=>{
    return getRcordByPrj({projectId: parseInt(nowPrjId.value)});
  });
}

function updateGcpStyle(){
  updateSelMU({
    newValue: nowGcpStyle,
    nowMU: nowGcpStyleMU,
    nowDOM: nowGcpStyleDOM,
    isUseID: false,
  })
}

// 清查人員清單
const { mutate: getRecPerson, onDone: getRecPersonOnDone, onError: getRecPersonError } = useMutation(GcpGQL.GETRECPERSON);
getRecPersonOnDone(result=>{
  let getData = result.data.getAllRecPersonList;
  nowPRecordPersonMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowPRecordPersonMU.value.unshift({ text: "-未選取-", value: -1 });
  // console.log('PersonMU',nowPRecordPersonMU.value);
});
getRecPersonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function updateRecPerson(){
  updateSelMU({
    newValue: nowPRecordPerson,
    nowMU: nowPRecordPersonMU,
    nowDOM: nowPRecordPersonDOM,
    isUseID: false,
  })
}

// 聯絡機關清單
const { mutate: refgetContactById, onError: refgetContactByIdonError } = useMutation(GcpGQL.GETCONTACTBYID);
refgetContactByIdonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function updateContact(){
  updateSelMU({
    newValue: nowGcpContactName,
    nowMU: nowGcpContactMU,
    nowDOM: nowGcpContactDOM,
    isUseID: true,
  })
}
function changeContactID(){
  // console.log('nowGcpContactId',nowGcpContactId.value);
  refgetContactById(
    {getContactByIdId: (nowGcpContactId.value)?nowGcpContactId.value:-1}
  ).then(res=>{
    // 填入聯絡廠商欄位
    let getData = res.data.getContactById;
    // console.log('getData',getData);
    if(getData){
      nowGcpContactName.value = getData.name;
      nowGcpContactAds.value = getData.address;
      nowGcpContactPrs.value = getData.person;
      nowGcpContactTel.value = getData.tel;
      nowGcpContactCom.value = getData.comment;
    }else if(nowGcpContactId.value===-1){
      // console.log('nowGcpContactId',nowGcpContactId.value);
      nowGcpContactName.value = nowGcpContactMU.value.find(x=>x.value===-1).text;
      // console.log('nowGcpContactName',nowGcpContactName.value);
      nowGcpContactAds.value = '';
      nowGcpContactPrs.value = '';
      nowGcpContactTel.value = '';
      nowGcpContactCom.value = '';
    }
  });
}
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

//#region 標準件管理==========Start
const dt_eqpt = ref();
const table_eqpt = ref(); 
const data_eqpt = ref([]);
const columns_eqpt = [
  {title:"索引", data:"id", defaultContent: "-", visible: false, render: (data, type, row, meta) => {
    let myrow = dt_eqpt.value.row(meta.row).node();
    if(data){
      myrow.classList.remove("unsaved");
    }else{
      myrow.classList.add("unsaved");
    }
    return data}},
  {title:"查核紀錄", data:"eqpt_check_id", defaultContent: "-"},
  {title:"儀器類別", data:"ref_eqpt_check.ref_eqpt.ref_eqpt_type.type", defaultContent: "-"},
  {title:"廠牌", data:"ref_eqpt_check.ref_eqpt.chop", defaultContent: "-"},
  {title:"型號", data:"ref_eqpt_check.ref_eqpt.model", defaultContent: "-"},
  {title:"序號", data:"ref_eqpt_check.ref_eqpt.serial_number", defaultContent: "-"},
  {title:"報告編號", data:"ref_eqpt_check.report_id", defaultContent: "-"},
  {title:"校正日", data:"ref_eqpt_check.check_date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"校正機關", data:"ref_eqpt_check.cal_org", defaultContent: "-"},
];
const tboption_eqpt = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[6, 'asc']],
  scrollY: 'calc(100vh - 23rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};
// 查詢量測作業內標準件列表
const { mutate: getEqptByPrj, onDone: getEqptByPrjOnDone, onError: getEqptByPrjError } = useMutation(PrjGQL.GETEQPTBYRRJID);
getEqptByPrjOnDone(result=>{
  let getData = result.data.getEqptByPrj;
  getData.map(x=>{
    x.saved = true;
  })
  data_eqpt.value = getData;
  notProssing3.value = true;
});
getEqptByPrjError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

const dt_eqpt2 = ref();
const table_eqpt2 = ref(); 
const data_eqpt2 = ref([]);
const columns_eqpt2 = [
  {title:"索引", data:"ref_equpt_id", defaultContent: "-", visible: false},
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
];
const tboption_eqpt2 = {
  dom: 'ft',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  scrollY: 'calc(45vh - 13.5rem)',
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
const { onDone: getAllEqptonDone, mutate: refgetAllEqpt, onError: getAllEqptonError } = useMutation(PrjGQL.GETALLEQPT);
getAllEqptonDone(result=>{
  if(!result.loading){
    data_eqpt2.value = result.data.getAllEqpt;
    // console.log('data_eqpt2',data_eqpt2.value);
  }
});
getAllEqptonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 切換標準件類型
function changeEqptType(){
  refgetAllEqpt({type: (nowEqptType.value && nowEqptType.value!==-1)?nowEqptType.value:null});
}

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
  dom: 't',
  select: {style: 'single',info: false},
  order: [[2, 'desc']],
  scrollY: 'calc(50vh - 22rem)',
  scrollX: true,
  lengthChange: false,
  searching: false,
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
getChkByEqptError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

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
    chkResultPDF.value = "pdfjs-dist/web/viewer.html";  
  }else{
    chkResultPDF.value = "pdfjs-dist/web/viewer.html?file=" + publicPath.value + "01_Equipment/" + nowEqptId.value + "/" + nowChkCalResult.value + '?t=' + new Date().getTime();
    // console.log(pdfPath.value)
  }

  nowChkCalComment.value = getData.comment;
});
getChkByIdError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 更新表格顯示(欄寬)
function updatTable(){
  if(dt_eqpt.value) dt_eqpt.value.draw();
  if(dt_eqpt2.value) dt_eqpt2.value.draw();
  if(dt_chk.value) dt_chk.value.draw();
}

// 加入查核紀錄
function addChk(){
  getChkById({eqCkId: parseInt(nowChkId.value)}).then(res=>{
    // console.log(res.data.getChkById);
    // console.log('data_eqpt',data_eqpt.value);
    // console.log('nowPrjId',nowPrjId.value);
    let newLinkData={
      eqpt_check_id: parseInt(nowChkId.value),
      project_id: parseInt(nowPrjId.value),
      ref_eqpt_check: res.data.getChkById,
      saved: false,
    };
    // console.log('newLinkData',newLinkData);
    if(data_eqpt.value.filter(x => x.eqpt_check_id===parseInt(nowChkId.value)).length===0){
      data_eqpt.value.push(newLinkData);
    }
  });
}
// 移除查核紀錄
function removeChk(){
  // 如果有id則加入刪除池再移出dt矩陣，否則直接移出dt矩陣
  if(nowLinkId.value){
    nowLinkDel.value.push(parseInt(nowLinkId.value));
  }
  // 移出dt矩陣
  data_eqpt.value = data_eqpt.value.filter(x => parseInt(x.eqpt_check_id) !== parseInt(nowLinkChkId.value));
  // console.log('nowLinkDel',nowLinkDel.value)
}

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
    nowChkId.value = res.data.updateRefEqptChk.eq_ck_id;
    // 更新chk table
    return getChkByEqpt({refEqptId: parseInt(nowEqptId.value)});
  })
}
saveRefEqptChkError(e=>{errorHandle(e,infomsg,alert1,msgColor)});


// 刪除Chk
const { mutate: delRefEqptChk, onDone: delRefEqptChkOnDone, onError: delRefEqptChkError } = useMutation(PrjGQL.DELREFEQPTCHK);
delRefEqptChkError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function delChk(){
  delRefEqptChk({eqCkId: parseInt(nowChkId.value)})
}

// 實驗室清單
function updateChkOrg(){
  updateSelMU({
    newValue: nowChkCalOrg,
    nowMU: nowChkCalOrgMU,
    nowDOM: nowChkCalOrgDOM,
    isUseID: false,
  })
}

// 儲存Link
const tempLink = ref([]);
const { mutate: savePrjEqpts, onDone: savePrjEqptsOnDone, onError: savePrjEqptsError } = useMutation(PrjGQL.SAVEPRJEQPTUSE);
const { mutate: delPrjEqpts, onDone: delPrjEqptsOnDone, onError: delPrjEqptsError } = useMutation(PrjGQL.DELPRJEQPTUSE);

savePrjEqptsError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
delPrjEqptsError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function saveLink(){
  // 先刪除nowLinkDel中的紀錄，再新增無所引的紀錄
  let newLinkIds = [];
  data_eqpt.value.map(x=>{
    if(!x.id){
      newLinkIds.push({
        eqpt_check_id: parseInt(x.eqpt_check_id),
        project_id: parseInt(x.project_id),
      })
    }
  });

  // 刪除被移除的紀錄
  delPrjEqpts({
    recordsId: nowLinkDel.value
  }).then(res=>{
    // 刪除池歸零
    nowLinkDel.value = [];
    // 新增新紀錄
    return savePrjEqpts({records: newLinkIds})
  }).then(res=>{
    // 更新data_eqpt
    notProssing3.value = false;
    getEqptByPrj({getEqptByPrjId: parseInt(nowPrjId.value)});
  })
}

// 複製Link
function copyLink(){
  tempLink.value = JSON.parse(JSON.stringify(data_eqpt.value));
  tempLink.value.map(x =>{
    delete x.id;
    delete x.project_id;
    x.saved = false;
  });

  console.log(tempLink.value);
}
// 貼上Link
function pasteLink(){
  if(nowPrjId.value && tempLink.value.length>0){
    tempLink.value.map(x=>{
      x.project_id = nowPrjId.value;
    });
    data_eqpt.value = tempLink.value;
  }
  // 歸零
  tempLink.value = [];
}

//#endregion 標準件管理==========End

//#region 管制圖==========Start
// 查詢參考作業清單
const { 
  mutate: getAllCChartList, 
  onDone: getAllCChartListonDone, 
  onError: getAllCChartListonError
} = useMutation(PrjGQL.GETALLCCHARTLIST);
getAllCChartListonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 查詢管制圖資料
const { 
  mutate: getAllCtlChart, 
  onDone: getAllCtlChartOnDone, 
  onError: getAllCtlChartonError 
} = useMutation(PrjGQL.GETALLCTLCHART);
getAllCtlChartonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

const { 
  mutate: getAllCtlChartM, 
  onDone: getAllCtlChartMOnDone, 
  onError: getAllCtlChartMonError 
} = useMutation(PrjGQL.GETALLCTLCHARTM);
getAllCtlChartMonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 查詢目前管制資料
const { 
  mutate: getNowCtlChart, 
  onDone: getNowCtlChartOnDone, 
  onError: getNowCtlChartonError 
} = useMutation(PrjGQL.GETCTLCHARTDATA);
getNowCtlChartonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 計算管制圖資料
const { 
  mutate: computeCtlChart, 
  onDone: computeCtlChartonDone, 
  onError: computeCtlChartonError 
} = useMutation(PrjGQL.COMPUTECTLCHART);
computeCtlChartonDone(result=>{
  // console.log(result.data)
})
computeCtlChartonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
function computeCChart(calCode,label,prjIdBase){
  // console.log('calCode',calCode);
  // console.log('label',label);
  // console.log('prjIdBase',prjIdBase);

  // if(label!=="目前作業非量測作業"){
    computeCtlChart({
      prjId: nowPrjCode.value,
      calCode: calCode,
      label: label,
      prjIdBase: prjIdBase,
    }).then(res=>{
      // 更新管制圖
      return updateCtlCahart();
    })
  // }
};

// 查詢管制資料計算成果
const { 
  mutate: getCCData, 
  onDone: getCCDataOnDone, 
  onError: getCCDataonError 
} = useMutation(PrjGQL.GETCCDATA);
getCCDataonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
// 匯出管制資料計算成果
function saveCCData(calCode,prjId){
  getCCData({
    prjId: prjId,
    calCode: calCode,
  }).then(res=>{
    if(res && res.data){
      let getData = res.data.getCtlChartData[0].data;
      let dataStr = "p1,p2,s,ds\n";
      // console.log(getData)
      for (let i = 0; i < getData.length; i++) {
        dataStr =
          dataStr +
          getData[i].p1 + "," +
          getData[i].p2 + "," +
          getData[i].s + "," +
          getData[i].ds + "," +
          "\n";
      }

      //藉型別陣列建構的 blob 來建立 URL
      let fileName = "data.csv";
      let blob = new Blob([dataStr], {
        type: "application/octet-stream",
      });
      let href = URL.createObjectURL(blob);
      // 從 Blob 取出資料
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.href = href;
      link.download = fileName;
      link.click();
      document.body.removeChild(link);
    }
  });
}

Chart.register({
  id: 'custom_canvas_background_color',
  beforeDraw: (chart, args, options) => {
    const {ctx, chartArea: {left, top, right, bottom}} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';

    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, 'rgb(246,251,252)');
    gradient.addColorStop(0.5, options.color);
    gradient.addColorStop(1, 'rgb(246,251,252)');
    // ctx.fillStyle = options.color;
    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, right - left, bottom - top);
    ctx.restore();
  },
  defaults: {
      color: 'white'
  }
});

// 門檻刻度上色
function limitTickColor(v_uplimit,v_downlimit){
  return (context)=>{
    if (context.tick.value === v_uplimit || context.tick.value === v_downlimit) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(0,0,0)';
  }
}
// 門檻刻度加寬
function limitTickLineWidth(v_uplimit,v_downlimit){
  return (context)=>{
    if (context.tick.value === v_uplimit || context.tick.value === v_downlimit) {
      return 1.5;
    }
    return 0.2;
  }
}
// 圖表統計值數列
function dataSetArray(getData){
  getData.unshift({ label:'', avg: null, max: null, min: null,});
  getData.push({ label:' ', avg: null, max: null, min: null,});
  // console.log('getData',getData);
  return [
    { label: '最大值', data: getData, parsing: { yAxisKey: 'max' }, 
      backgroundColor: 'rgb(0,114,255)', pointStyle: 'rect', radius:6, rotation: 45,},
    { label: '平均值', data: getData, parsing: { yAxisKey: 'avg' }, 
      backgroundColor: 'rgb(255,255,0)', pointStyle: 'triangle', radius:6,borderColor: 'rgb(255,153,0)',},
    { label: '最小值', data: getData, parsing: { yAxisKey: 'min' }, 
      backgroundColor: 'rgb(255,0,255)', pointStyle: 'rect', radius:6,},
  ];
}
function dataSetArrayM(getData){
  getData.unshift({ label:'', ds: null });
  getData.push({ label:' ', ds: null });
  // console.log('getData',getData);
  return [
    { label: '較差', data: getData, parsing: { yAxisKey: 'ds' }, 
      backgroundColor: 'rgb(0,114,255)', pointStyle: 'rect', radius:6, rotation: 45,},
    // { label: '平均值', data: getData, parsing: { yAxisKey: 'avg' }, 
    //   backgroundColor: 'rgb(255,255,0)', pointStyle: 'triangle', radius:6,borderColor: 'rgb(255,153,0)',},
    // { label: '最小值', data: getData, parsing: { yAxisKey: 'min' }, 
    //   backgroundColor: 'rgb(255,0,255)', pointStyle: 'rect', radius:6,},
  ];
}
// 圖表設定
function chartOptions(chart_title,x_title,y_title,v_uplimit,v_downlimit,tickstep,tickup,tickdown){
  return {
    layout: { padding: 10 },
    elements: { line:{borderWidth:0} },
    responsive: true,
    interaction: {
        intersect: false,
        mode: 'index',
      },
    parsing: { xAxisKey: 'label' },
    scales: {
      x: {
        title:{ display: true, text: x_title },
        grid: {lineWidth: 0},
      },
      y: {
        title:{ display: true, text: y_title },
        suggestedMin: tickdown,
        suggestedMax: tickup,
        ticks: { stepSize: tickstep },
        grid: {
          color: limitTickColor(v_uplimit,v_downlimit),
          lineWidth: limitTickLineWidth(v_uplimit,v_downlimit),
        },
      }
    },
    plugins: {
      legend: { 
        position: 'right', 
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: chart_title,
        font: {
          weight: 'bold',
          size: 16,
        }
      },
      custom_canvas_background_color: {
        color: 'rgb(201, 230, 238)'
      },
    }
  }
}
// 更新圖表
function updateCtlCahart(){
  if(nowPrjCalTypeId.value===1){
    // 更新F圖及J圖及M圖
    getAllCChartList({calCode: 'F'}).then(res=>{
      // 填入參考作業清單
      let getData=res.data.getAllCChartList;
      let list_F=[];
      let list_J=[];
      getData.reverse();
      for(let i=0;i<getData.length;i++){
        list_F.push({ text: getData[i], value: getData[i] });
        list_J.push({ text: getData[i], value: getData[i] });
      }
      list_F.unshift({ text:"-未選取-", value: '-1' });
      list_J.unshift({ text:"-未選取-", value: '-1' });
      refPrjCodeFMU.value = list_F;
      refPrjCodeJMU.value = list_J;
    }).then(res=>{
      // 取得F圖目前作業之管制資料
      return getNowCtlChart({
        prjId: nowPrjCode.value,
        calCode: 'F'
      })
    }).then(res=>{
      // 填入F圖目前資料
      let getData = res.data.getCtlChartData[0];
      if(!getData){
        refPrjCodeF.value = "-1";
        refPrjCodeFDOM.value.setValue('-1');
        ccLabel_F.value = (nowPrjMethod.value==='量測' || nowPrjMethod.value==='中間巡查')?"":"目前作業非量測作業";
        ccAvg_F.value = "-";
        ccStd_F.value = "-";
        ccMax_F.value = "-";
        ccMin_F.value = "-";
        cchasData_F.value = false;
      }else{
        refPrjCodeF.value = getData.prj_id_base;
        refPrjCodeFDOM.value.setValue(refPrjCodeF.value);
        ccLabel_F.value = getData.label;
        ccAvg_F.value = (getData.ave)?getData.ave.toFixed(3):"-";
        ccStd_F.value = (getData.std)?getData.std.toFixed(3):"-";
        ccMax_F.value = (getData.max)?getData.max.toFixed(3):"-";
        ccMin_F.value = (getData.min)?getData.min.toFixed(3):"-";
        cchasData_F.value = getData.hasdata;
      }
      return
    }).then(res=>{
      // 查詢F管制圖
      return getAllCtlChart({calCode: 'F', stopPrj: nowPrjCode.value});
    }).then(res=>{
      let canvas = document.getElementById("ctlChartF");
      let ctxF = canvas.getContext('2d');
      // 展繪F圖
      let getData = res.data.getAllCtlChart;
      if(ctlChartF){
        // ctlChartF.value.destroy();
        ctlChartF.data.datasets = dataSetArray(getData);
        ctlChartF.update();
      }else{
        ctlChartF = new Chart(ctxF,{
          type: 'line',
          data: { datasets: dataSetArray(getData) },
          options: chartOptions('航空測量攝影機管制圖','年度','基線較差(m)',0.03,-0.03,0.01,0.05,-0.05),
        });
      }
      return
    }).then(res=>{
      // 取得J圖目前作業之管制資料
      return getNowCtlChart({
        prjId: nowPrjCode.value,
        calCode: 'J'
      });
    }).then(res=>{
      // 填入J圖目前資料
      let getData = res.data.getCtlChartData[0];
      if(!getData){
        refPrjCodeJ.value = "-1";
        refPrjCodeJDOM.value.setValue('-1');
        ccLabel_J.value = (nowPrjMethod.value==='量測' || nowPrjMethod.value==='中間巡查')?"":"目前作業非量測作業";
        ccAvg_J.value = "-";
        ccStd_J.value = "-";
        ccMax_J.value = "-";
        ccMin_J.value = "-";
        cchasData_J.value = false;
      }else{
        refPrjCodeJ.value = getData.prj_id_base;
        refPrjCodeJDOM.value.setValue(refPrjCodeJ.value);
        ccLabel_J.value = getData.label;
        ccAvg_J.value = (getData.ave)?getData.ave.toFixed(3):"-";
        ccStd_J.value = (getData.std)?getData.std.toFixed(3):"-";
        ccMax_J.value = (getData.max)?getData.max.toFixed(3):"-";
        ccMin_J.value = (getData.min)?getData.min.toFixed(3):"-";
        cchasData_J.value = getData.hasdata;
      }
      return
    }).then(res=>{
      // 查詢J管制圖
      return getAllCtlChart({calCode: 'J', stopPrj: nowPrjCode.value});
    }).then(res=>{
      let canvas = document.getElementById("ctlChartJ");
      let ctxJ = canvas.getContext('2d');
      // 展繪J圖
      let getData = res.data.getAllCtlChart;
      if(ctlChartJ){
        // ctlChartJ.value.destroy();
        ctlChartJ.data.datasets = dataSetArray(getData);
        ctlChartJ.update();
      }else{
        ctlChartJ = new Chart(ctxJ,{
          type: 'line',
          data: { datasets: dataSetArray(getData) },
          options: chartOptions('小像幅航拍攝影機管制圖','年度','基線較差(m)',0.03,-0.03,0.01,0.05,-0.05),
        })
      }
    });
  }else if(nowPrjCalTypeId.value===2){
    // 更新I圖
    getAllCChartList({calCode: 'I'}).then(res=>{
      // 填入參考作業清單
      let getData=res.data.getAllCChartList;
      let list_I=[];
      getData.reverse();
      for(let i=0;i<getData.length;i++){
        list_I.push({ text: getData[i], value: getData[i] });
      }
      list_I.unshift({ text:"-未選取-", value: '-1' });
      refPrjCodeIMU.value = list_I;
    }).then(res=>{
      // 取得I圖目前作業之管制資料
      return getNowCtlChart({
        prjId: nowPrjCode.value,
        calCode: 'I'
      })
    }).then(res=>{
      // 填入I圖目前資料
      let getData = res.data.getCtlChartData[0];
      if(!getData){
        refPrjCodeI.value = "-1";
        refPrjCodeIDOM.value.setValue('-1');
        ccLabel_I.value = (nowPrjMethod.value==='量測' || nowPrjMethod.value==='中間巡查')?"":"目前作業非量測作業";
        ccAvg_I.value = "-";
        ccStd_I.value = "-";
        ccMax_I.value = "-";
        ccMin_I.value = "-";
        cchasData_I.value = false;
      }else{
        refPrjCodeI.value = getData.prj_id_base;
        refPrjCodeIDOM.value.setValue(refPrjCodeI.value);
        ccLabel_I.value = getData.label;
        ccAvg_I.value = (getData.ave)?getData.ave.toFixed(3):"-";
        ccStd_I.value = (getData.std)?getData.std.toFixed(3):"-";
        ccMax_I.value = (getData.max)?getData.max.toFixed(3):"-";
        ccMin_I.value = (getData.min)?getData.min.toFixed(3):"-";
        cchasData_I.value = getData.hasdata;
      }
      return
    }).then(res=>{
      return getAllCtlChart({calCode: 'I', stopPrj: nowPrjCode.value})
    }).then(res=>{
      let canvas = document.getElementById("ctlChartI");
      let ctxI = canvas.getContext('2d');
      // 展繪I圖
      let getData = res.data.getAllCtlChart;
      if(ctlChartI){
        // ctlChartI.value.destroy();
        ctlChartI.data.datasets = dataSetArray(getData);
        ctlChartI.update();
      }else{
        ctlChartI = new Chart(ctxI,{
          type: 'line',
          data: { datasets: dataSetArray(getData) },
          options: chartOptions('空載光達管制圖','時間(年月)','基線較差(m)',0.04,-0.04,0.01,0.05,-0.05),
        })
      }
    })
  }else if(nowPrjCalTypeId.value===9){
    // 更新M圖
    getAllCChartList({calCode: 'M'}).then(res=>{
      // 填入參考作業清單
      let getData=res.data.getAllCChartList;
      let list_M=[];
      getData.reverse();
      for(let i=0;i<getData.length;i++){
        list_M.push({ text: getData[i], value: getData[i] });
      }
      list_M.unshift({ text:"-未選取-", value: '-1' });
      refPrjCodeMMU.value = list_M;
    }).then(res=>{
      // 取得M圖目前作業之管制資料
      return getNowCtlChart({
        prjId: nowPrjCode.value,
        calCode: 'M'
      })
    }).then(res=>{
      // 填入M圖目前資料
      let getData = res.data.getCtlChartData[0];
      if(!getData){
        refPrjCodeM.value = "-1";
        refPrjCodeMDOM.value.setValue('-1');
        ccLabel_M.value = (nowPrjMethod.value==='基準量測' || nowPrjMethod.value==='中間查核')?"":"目前作業非量測作業";
        ccAvg_M.value = "-";
        ccStd_M.value = "-";
        ccMax_M.value = "-";
        ccMin_M.value = "-";
        cchasData_M.value = false;
      }else{
        refPrjCodeM.value = getData.prj_id_base;
        refPrjCodeMDOM.value.setValue(refPrjCodeM.value);
        ccLabel_M.value = getData.label;
        ccAvg_M.value = (getData.ave)?getData.ave.toFixed(3):"-";
        ccStd_M.value = (getData.std)?getData.std.toFixed(3):"-";
        ccMax_M.value = (getData.max)?getData.max.toFixed(3):"-";
        ccMin_M.value = (getData.min)?getData.min.toFixed(3):"-";
        cchasData_M.value = getData.hasdata;
      }
      // console.log(getData);
      return
    }).then(res=>{
      return getAllCtlChartM({calCode: 'M', stopPrj: nowPrjCode.value})
    }).then(res=>{
      let canvas = document.getElementById("ctlChartM");
      let ctxM = canvas.getContext('2d');
      // 展繪M圖
      let getData = res.data.getAllCtlChartM;
      // console.log(getData)
      if(ctlChartM){
        // ctlChartI.value.destroy();
        ctlChartM.data.datasets = dataSetArrayM(getData);
        ctlChartM.update();
      }else{
        ctlChartM = new Chart(ctxM,{
          type: 'line',
          data: { datasets: dataSetArrayM(getData) },
          options: chartOptions('車載光達管制圖','時間(年月)','基線較差(m)',0.014,-0.014,0.0035,0.021,-0.021),
        })
      }
    })
  }
}
//#endregion 管制圖==========Edn

//#region 收合資料
const baseShow = ref(false);
const recordShow = ref(true);
function collapseDIV(e, src){
  // console.log(e);
  switch (src){
    case 'baseclick':
      baseShow.value = !baseShow.value;
      break;
    case 'recordclick':
      recordShow.value = !recordShow.value;
      break;
  }
}
//#endregion 收合資料

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
    case "inputRecord":
      inputRecord(upFile.value);
      break;
    case "GcpSimage":
      subpath = "04_GCP/Pt"
      newName = nowPRecordPtId.value + "-A" + subExt;
      isUpload = true;
      break;
    case "GcpDespImg":
      subpath = "04_GCP/Pt"
      newName = nowPRecordPtId.value + "-B" + subExt;
      isUpload = true;
      break;
    case "PRecordImg0":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowPRecordPtId.value + "-1" + subExt;
      isUpload = true;
      break;
    case "PRecordImg1":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowPRecordPtId.value + "-2" + subExt;
      isUpload = true;
      break;
    case "PRecordImg2":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowPRecordPtId.value + "-3" + subExt;
      isUpload = true;
      break;
    case "PRecordImg3":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowPRecordPtId.value + "-4" + subExt;
      isUpload = true;
      break;
    case "PRecordImgObs":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowPRecordPtId.value + "-C" + subExt;
      isUpload = true;
      break;
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
const { mutate: uploadFile, onDone: uploadFileOnDone, onError: uploadFileonError } = useMutation(
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
      saveGcpRecordBtn();
      break;
    case "GcpDespImg":
      nowGcpDespImg.value = "";
      nowGcpDespImg.value = result.data.uploadFile.filename;
      saveGcpRecordBtn();
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
uploadFileonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

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

// 確認登入狀況
getchecktoken().then(res=>{
  refgetAllPrj();
  refgetPrjById();
  refgetAllPrjlist();
  getRecPerson();
  // refgetAllContact();
  refgetAllEqpt({type: (nowEqptType.value && nowEqptType.value!==-1)?nowEqptType.value:null});
  store.dispatch('selectlist/fetchChkOrgList').then(res=>{
    nowChkCalOrgMU.value = JSON.parse(JSON.stringify(store.state.selectlist.chkOrgList));
  });

  store.dispatch('selectlist/fetchEqptTypeList');
  store.dispatch('selectlist/fetchCalTypeList');
  store.dispatch('selectlist/fetchGcpTypeList');
  store.dispatch('selectlist/fetchGcpStyleList').then(res=>{
    nowGcpStyleMU.value = JSON.parse(JSON.stringify(store.state.selectlist.gcpStyleList));
  });
  store.dispatch('selectlist/fetchGcpContactList').then(res=>{
    nowGcpContactMU.value = JSON.parse(JSON.stringify(store.state.selectlist.gcpContactList));
  });


  return
}).catch(e=>{
  errorHandle(e,infomsg,alert1,msgColor);
});

//#region 加載表格選取事件==========Start
onMounted(function () {
  dt_prj.value = table_prj.value.dt();
  dt_prj.value.on('select', function (e, dt, type, indexes) {
    nowLinkDel.value = [];
    nowPrjId.value = dt.rows(indexes).data()[0].id;
    refgetPrjById({ getPrjByIdId: parseInt(nowPrjId.value) }).then(res=>{
      // 更新管制圖
      updateCtlCahart();
    });
    notProssing2.value = false;
    getRcordByPrj({projectId: parseInt(nowPrjId.value)});
    notProssing3.value = false;
    getEqptByPrj({getEqptByPrjId: parseInt(nowPrjId.value)});
    // 更新表格欄位寬度
    updatTable();
    
  });

  dt_gcp.value = table_gcp.value.dt();
  dt_gcp.value.on('user-select', function ( e, dt, type, cell, originalEvent ) {
    let indexes = cell.index(this).row;
    nowPRecordId.value = dt.rows(indexes).data()[0].gcp_record[0].id;
    // console.log(nowPRecordId.value)
    getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
  });
  // dt_gcp.value.on('select', function (e, dt, type, indexes) {
  //   // console.log("dt_gcp select")
  //   nowPRecordId.value = dt.rows(indexes).data()[0].gcp_record[0].id;
  //   getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
  //   e.preventDefault();
  //   e.stopPropagation();
  // });

  dt_eqpt.value = table_eqpt.value.dt();
  dt_eqpt.value.on('select', function (e, dt, type, indexes) {
    nowLinkId.value = dt.rows(indexes).data()[0].id;
    nowLinkChkId.value = dt.rows(indexes).data()[0].eqpt_check_id;
    // 連動顯示儀器列表
    nowEqptId.value = dt.rows(indexes).data()[0].ref_eqpt_check.ref_eqpt_id;
    refgetAllEqpt({type: null}).then(res=>{
      // 由儀器列表中選擇目前儀器
      let selRowID = dt_eqpt2.value.rows(function ( idx, data, node ) {
        return (data.ref_equpt_id=== nowEqptId.value+'')?true:false
      })[0][0];
      // 捲動到視窗內(模擬select，不觸動select事件)
      dt_eqpt2.value.row(selRowID).node().classList.add('selected');
      dt_eqpt2.value.row(selRowID).node().scrollIntoView();
      // 連動顯示查核歷程
      return getChkByEqpt({refEqptId: parseInt(nowEqptId.value)})
    }).then(res=>{
      // 由查核紀錄中選擇目前記錄
      let selRowID = dt_chk.value.rows(function ( idx, data, node ) {
        return (data.eq_ck_id === nowLinkChkId.value + '')?true:false
      }).select()[0][0];
      // 捲動到視窗內
      dt_chk.value.row(selRowID).node().scrollIntoView();
    });
    e.preventDefault();
    e.stopPropagation();
  });

  dt_eqpt2.value = table_eqpt2.value.dt();
  dt_eqpt2.value.on('select', function (e, dt, type, indexes) {
    nowEqptId.value = dt.rows(indexes).data()[0].ref_equpt_id;
    getChkByEqpt({refEqptId: parseInt(nowEqptId.value)}).then(res=>{
      newChk();
    });
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
    // console.log("dt_gcp draw")
    selectNowChk(nowChkId.value, 'eq_ck_id', dt_chk.value);
  });
});

// 一定要由onMounted裡面的draw觸發，否則dt還未渲染，會找不到物件
function selectNowChk(nowId, col, dt){
  if(nowId){
    dt.rows(function ( idx, data, node ) {
      return (data[col]===nowId)?true:false
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
        <MDBCol md="4" xl="4" class="h-100">
          <MDBRow class="h-100">
            <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
              <MDBRow class="h-100">
                <!-- 左上列表 -->
                <MDBCol col="12" style="height: 50%;position: relative ;" class="overflow-auto border-1 border-bottom">
                  <div :class="{ 'hiddenSpinner': notProssing}" style="position: absolute; left: 50%; top: 10rem;">
                    <MDBSpinner size="md" color="primary" />Loading...
                  </div>
                  <!-- <div class="mt-2" style="position:absolute;">目前作業：<span class="text-info">{{nowPrjCode}} - {{nowPrjId}}</span></div> -->
                  <DataTable 
                    :data="data_prj" 
                    :columns="columns_prj" 
                    :options="tboption_prj" 
                    ref="table_prj"
                    style="font-size: smaller; padding-top: 1rem;" 
                    class="display w-100 compact" />
                </MDBCol>
                <!-- 左下資料 -->
                <MDBCol col="12" style="height: 50%;" class="">
                  <MDBRow class="align-content-start">
                    <!-- 功能按鈕 -->
                    <MDBCol col="12" class="d-flex py-2 border-1 border-bottom">
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="createPrj">新增</MDBBtn>
                      <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="savePrjBtn">儲存</MDBBtn>
                      <MDBPopconfirm :disabled="!rGroup[1] || !nowPrjId" class="btn-sm btn-danger me-auto" message="刪除後無法恢復，確定刪除嗎？"
                        cancelText="取消" confirmText="確定" @confirm="delPrjBtn">
                        刪除
                      </MDBPopconfirm>
                      
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
                    <MDBSelect 
                      size="sm" class="mt-2 col-xl-6" 
                      label="作業類型" 
                      v-model:options="nowPrjMethodMU"
                      v-model:selected="nowPrjMethod" 
                      ref="nowPrjMethodDOM" />
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput size="sm" type="text" label="作業年份" v-model="nowPrjYear" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBInput size="sm" type="text" label="作業年月" v-model="nowPrjMonth" />
                    </MDBCol>
                    <MDBSelect size="sm" class="mt-2 col-xl-12" 
                      label="執行單位" 
                      v-model:options="nowPrjOrganizerMU"
                      v-model:selected="nowPrjOrganizer" 
                      ref="nowPrjOrganizerDOM" 
                      @close="updatePrjOrganizer()">
                      <MDBInput 
                        size="sm" 
                        type="text" 
                        label="自訂新選項" 
                        v-model="nowPrjOrganizer"
                        @click="domTextSelect($event)" />
                    </MDBSelect>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker 
                        size="sm" 
                        v-model="nowPrjStartDate" 
                        format="YYYY-MM-DD" label="開始作業"
                        confirmDateOnSelect
                        removeClearBtn
                        removeCancelBtn
                        removeOkBtn
                        :monthsFull = "monthsFull"
                        :monthsShort = "monthsShort"
                        :weekdaysFull = "weekdaysFull"
                        :weekdaysShort = "weekdaysShort"
                        :weekdaysNarrow = "weekdaysNarrow"
                        />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker 
                        size="sm" 
                        v-model="nowPrjEndDate" 
                        format="YYYY-MM-DD" label="結束作業"
                        confirmDateOnSelect
                        removeCancelBtn removeOkBtn
                        :monthsFull = "monthsFull"
                        :monthsShort = "monthsShort"
                        :weekdaysFull = "weekdaysFull"
                        :weekdaysShort = "weekdaysShort"
                        :weekdaysNarrow = "weekdaysNarrow"
                        ref="nowPrjEndDateDOM" />
                    </MDBCol>
                    <MDBCol xl="6" class="mt-2">
                      <MDBDatepicker 
                        size="sm" 
                        v-model="nowPrjPublishDate" 
                        format="YYYY-MM-DD" label="發布日期"
                        confirmDateOnSelect
                        removeCancelBtn removeOkBtn
                        :monthsFull = "monthsFull"
                        :monthsShort = "monthsShort"
                        :weekdaysFull = "weekdaysFull"
                        :weekdaysShort = "weekdaysShort"
                        :weekdaysNarrow = "weekdaysNarrow"
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
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);" class="my-2 bg-light border border-5 rounded-8 shadow-4 overflow-auto">
            <MDBCol col="12" class="h-100">
                <!-- Tabs -->
                <MDBTabs v-model="activeTabId1" @shown="updatTable">
                  <!-- Tabs navs -->
                  <MDBTabNav tabsClasses="">
                    <MDBTabItem tabId="gcp_mg" href="gcp_mg">參考值管理</MDBTabItem>
                    <MDBTabItem tabId="item_mg" href="item_mg">標準件管理</MDBTabItem>
                    <MDBTabItem tabId="ctrl_chart" href="ctrl_chart">管制圖</MDBTabItem>
                  </MDBTabNav>
                  <!-- Tabs Content -->
                  <MDBTabContent style="height: calc(100% - 3rem);">
                    <!-- 參考值管理 -->
                    <MDBTabPane tabId="gcp_mg" class="h-100">
                      <MDBRow class="h-100">
                        <!-- 列表 -->
                        <MDBCol lg="5" class="h-100 border-1 border-end" style="position:relative ;">
                          <div :class="{ 'hiddenSpinner': notProssing2}" style="position: absolute; left: 50%; top: 10rem;">
                            <MDBSpinner size="md" color="primary" />Loading...
                          </div>
                          <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                            style="font-size: smaller;" class="display w-100 compact" />
                        </MDBCol>
                        <!-- 表單 -->
                        <MDBCol lg="7" class="h-100">
                          <MDBRow>
                            <MDBCol col="12" class="d-flex py-2 border-1 border-bottom">
                              <MDBBtn :disabled="!rGroup[1] || !nowPrjId" size="sm" color="primary" @click="uploadBtn('inputRecord')">匯入紀錄</MDBBtn>
                              
                              <MDBDropdown class="me-auto" dropend v-model="dlGCPdropdown1">
                                <MDBDropdownToggle :disabled="!rGroup[4] || !nowPrjId" color="secondary" size="sm" @click="dlGCPdropdown1 = !dlGCPdropdown1">
                                  <i class="fas fa-cloud-download-alt">下載</i>
                                </MDBDropdownToggle>
                                <MDBDropdownMenu dark>
                                  <MDBDropdownItem href="#" @click.stop="downloadGCP(data_gcp)">詳細資料</MDBDropdownItem>
                                  <MDBDropdownItem href="#" @click.stop="downloadRef(data_gcp)">參考值檔</MDBDropdownItem>
                                </MDBDropdownMenu>
                              </MDBDropdown>
                            </MDBCol>
                          </MDBRow>
                          <!-- 參考值表單 -->
                          <MDBRow :key="updateKey2" class="overflow-auto align-content-start mx-0" style="height: calc(100% - 3rem);">
                            <MDBCol xl="12" class="my-2 d-flex justify-content-between">
                              <div>
                                目前點號：<span class="text-info">{{nowPRecordPtId}} - {{nowPRecordId}}</span>
                              </div>
                              <div>
                                <RouterLink target="_blank" :to="{
                                    path: '/sicltab13',
                                    query: { recordID: nowPRecordId },
                                  }">
                                  <MDBBtn :disabled="!nowPRecordId" size="sm" color="primary">列印調查表</MDBBtn>
                                </RouterLink>
                                <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newPRecordBtn">新增</MDBBtn>
                                <MDBBtn :disabled="!rGroup[1] || !nowPRecordPtId" size="sm" color="primary" @click="saveGcpRecordBtn">儲存</MDBBtn>
                                <MDBPopconfirm :disabled="!rGroup[1] || !nowPRecordId" 
                                  class="btn-sm btn-danger" 
                                  message="刪除後無法恢復，確定刪除嗎？"
                                  cancelText="取消" confirmText="確定" 
                                  @confirm="delGcpRecordBtn">
                                  刪除
                                </MDBPopconfirm>
                              </div>
                            </MDBCol>
                            <!-- 基本資料 -->
                            <MDBCol col="12" class="rounded-top-5 bg-info text-white" @click="collapseDIV($event,'baseclick')">
                              基本資料
                            </MDBCol>
                            <MDBCol col="12" class="mb-2 pb-2 border border-1 rounded-bottom-5">
                              <MDBRow v-show="baseShow">
                                <MDBCol col="12" class="mt-2">
                                  <MDBSwitch label="啟用" labelClass="fs-7" v-model="nowGcpEnable" />
                                </MDBCol>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="點號" v-model="nowPRecordPtId" />
                                </MDBCol>
                                <MDBSelect 
                                  size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="類別" 
                                  v-model:options="nowGcpTypeCodeMU"
                                  v-model:selected="nowGcpTypeCode" 
                                  ref="nowGcpTypeCodeDOM" />
                                <MDBSelect 
                                  size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="周圍舖面" 
                                  v-model:options="nowGcpPavementMU"
                                  v-model:selected="nowGcpPavement" 
                                  ref="nowGcpPavementDOM" />
                                <MDBSelect 
                                  size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="土地產權" 
                                  v-model:options="nowGcpOwnerShipMU"
                                  v-model:selected="nowGcpOwnerShip" 
                                  ref="nowGcpOwnerShipDOM" />
                                <MDBSelect 
                                  size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="標心樣式" 
                                  v-model:options="nowGcpStyleMU"
                                  v-model:selected="nowGcpStyle" 
                                  ref="nowGcpStyleDOM"
                                  @close="updateGcpStyle()">
                                  <MDBInput 
                                    size="sm" 
                                    type="text" 
                                    label="自訂新選項" 
                                    v-model="nowGcpStyle"
                                    @click="domTextSelect($event)" />
                                </MDBSelect>

                                <MDBCol md="12" xl="8" class="mt-2">
                                  <MDBInput size="sm" type="text" label="測設機關" v-model="nowGcpEstablishment" />
                                </MDBCol>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="測設年月" v-model="nowGcpEstDate" />
                                </MDBCol>
                                <MDBCol col="12" class="mt-2">
                                  <MDBTextarea size="sm" label="點位備註" rows="2" v-model="nowGcpComment" />
                                </MDBCol>

                                <!-- 航照圖及點之記 -->
                                <MDBLightbox zoomLevel="0.25" style="height: 9.5rem;">
                                  <MDBRow class="overflow-auto align-content-start h-100">
                                    <!-- 航拍略圖 -->
                                    <MDBCol xl="6">
                                      <MDBRow>
                                        <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                          <!-- 圖片 -->
                                          <MDBLightboxItem 
                                            id="GcpSimage"
                                            :src="nowGcpSimageDL" 
                                            :fullScreenSrc="nowGcpSimageDL"
                                            onerror="this.src='nosrc.png'"
                                            alt="航拍略圖" 
                                            class="img-allfluid"
                                            @drop.prevent="dropFile($event)"
                                            @dragover.prevent="cancelDefault($event)"
                                            @dragenter.prevent="cancelDefault($event)" />
                                          <!-- 按鈕 -->
                                          <div v-show="nowGcpSimage" class="imgtitle">{{nowGcpSimage}}</div>
                                          <div v-show="!nowGcpSimage" class="imgtitle">航拍略圖</div>
                                          <button v-show="nowGcpSimage" class="imgcancel btn p-0" @click.prevent="nowGcpSimage=''"></button>
                                          <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                            <MDBBtn :disabled="!rGroup[1] || !nowPRecordPtId" size="sm" color="primary" @click.prevent="uploadBtn('GcpSimage')">上傳</MDBBtn>
                                            <MDBBtn tag="a" target=_blank :href="nowGcpSimageDL" download size="sm" color="secondary">下載</MDBBtn>
                                          </div>
                                        </MDBCol>
                                      </MDBRow>
                                    </MDBCol>
                                    <!-- 點之記略圖 -->
                                    <MDBCol xl="6">
                                      <MDBRow>
                                        <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                          <!-- 圖片 -->
                                          <MDBLightboxItem 
                                            id="GcpDespImg"
                                            :src="nowGcpDespImgDL" 
                                            :fullScreenSrc="nowGcpDespImgDL"
                                            onerror="this.src='nosrc.png'"
                                            alt="點之記略圖" 
                                            class="img-allfluid"
                                            @drop.prevent="dropFile($event)"
                                            @dragover.prevent="cancelDefault($event)"
                                            @dragenter.prevent="cancelDefault($event)" />
                                          <!-- 按鈕 -->
                                          <div v-show="nowGcpDespImg" class="imgtitle">{{nowGcpDespImg}}</div>
                                          <div v-show="!nowGcpDespImg" class="imgtitle">點之記略圖</div>
                                          <button v-show="nowGcpDespImg" class="imgcancel btn p-0" @click.prevent="nowGcpDespImg=''"></button>
                                          <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                            <MDBBtn :disabled="!rGroup[1] || !nowPRecordPtId" size="sm" color="primary" @click.prevent="uploadBtn('GcpDespImg')">上傳</MDBBtn>
                                            <MDBBtn tag="a" target=_blank :href="nowGcpDespImgDL" download size="sm" color="secondary">下載</MDBBtn>
                                          </div>
                                        </MDBCol>
                                      </MDBRow>
                                    </MDBCol>
                                  </MDBRow>
                                </MDBLightbox>
                                <!-- 點之記說明 -->
                                <MDBCol col="12" class="h-100">
                                  <MDBTextarea size="sm" class="mt-2" label="點之記說明" rows="3" v-model="nowGcpDespStr" />
                                </MDBCol>
                                <!-- 聯絡機關 -->
                                <MDBCol col="12" class="mt-2">
                                  <MDBSwitch label="需聯絡" labelClass="fs-7" v-model="nowGcpNeedContact" />
                                </MDBCol>
                                <MDBSelect 
                                  :disabled="!nowGcpNeedContact"
                                  id="contactSelectDOM" size="sm" class="mt-2 col-12" 
                                  label="機關名稱" 
                                  :preselect="false"
                                  v-model:options="nowGcpContactMU"
                                  v-model:selected="nowGcpContactId" 
                                  ref="nowGcpContactDOM" 
                                  @change="changeContactID()"
                                  @close="updateContact()">
                                  <MDBInput 
                                    size="sm" 
                                    type="text" 
                                    label="自訂新選項" 
                                    v-model="nowGcpContactName"
                                    @click="domTextSelect($event)" />
                                </MDBSelect>

                                <MDBCol col="12" class="mt-2">
                                  <MDBInput :disabled="!nowGcpNeedContact" size="sm" type="text" label="地址" v-model="nowGcpContactAds" />
                                </MDBCol>
                                <MDBCol md="6" class="mt-2">
                                  <MDBInput :disabled="!nowGcpNeedContact" size="sm" type="text" label="聯絡對象" v-model="nowGcpContactPrs" />
                                </MDBCol>
                                <MDBCol md="6" class="mt-2">
                                  <MDBInput :disabled="!nowGcpNeedContact" size="sm" type="text" label="聯絡電話" v-model="nowGcpContactTel" />
                                </MDBCol>
                                <MDBCol col="12" class="mt-2">
                                  <MDBTextarea :disabled="!nowGcpNeedContact" size="sm" label="聯絡備註" rows="2" v-model="nowGcpContactCom" />
                                </MDBCol>
                              </MDBRow>
                            </MDBCol>
                            <!-- 紀錄資料 -->
                            <MDBCol col="12" class="rounded-top-5 bg-info text-white" @click="collapseDIV($event,'recordclick')">
                              紀錄資料
                            </MDBCol>
                            <MDBCol col="12" class="mb-2 pb-2 border border-1 rounded-bottom-5">
                              <MDBRow v-show="recordShow">
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput readonly size="sm" type="text" label="索引" v-model="nowPRecordId" />
                                </MDBCol>
                                <MDBSelect id="PrjMGSelPrjId" size="sm" class="mt-2 col-md-6 col-xl-4" label="作業編號" v-model:options="nowPRecordPrjIdMU"
                                  v-model:selected="nowPRecordPrjId" ref="nowPRecordPrjIdDOM" @close="nowPrjClose($event)"/>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBDatepicker 
                                    size="sm" 
                                    v-model="nowPRecordDate" 
                                    format="YYYY-MM-DD" label="紀錄日期"
                                    :monthsFull = "monthsFull"
                                    :monthsShort = "monthsShort"
                                    :weekdaysFull = "weekdaysFull"
                                    :weekdaysShort = "weekdaysShort"
                                    :weekdaysNarrow = "weekdaysNarrow"
                                    confirmDateOnSelect
                                    removeCancelBtn removeOkBtn
                                    ref="nowPRecordDateDOM" />
                                </MDBCol>
                                <MDBSelect filter size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="作業人員" 
                                  v-model:options="nowPRecordPersonMU"
                                  v-model:selected="nowPRecordPerson" 
                                  ref="nowPRecordPersonDOM"
                                  @close="updateRecPerson()">
                                  <MDBInput 
                                    size="sm" 
                                    type="text" 
                                    label="自訂新選項" 
                                    v-model="nowPRecordPerson"
                                    @click="domTextSelect($event)" />
                                </MDBSelect>
                                <MDBSelect size="sm" class="mt-2 col-md-6 col-xl-4" label="點位狀況" v-model:options="nowPRecordPtStatusMU"
                                  v-model:selected="nowPRecordPtStatus" ref="nowPRecordPtStatusDOM" />
                                <div></div>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="E坐標" v-model="nowPRecordE" />
                                </MDBCol>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="N坐標" v-model="nowPRecordN" />
                                </MDBCol>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="h坐標" v-model="nowPRecordh" />
                                </MDBCol>
                                <MDBCol xl="12" class="mt-2">
                                  <MDBInput readonly size="sm" type="text" v-model="nowPRecordCoor" />
                                </MDBCol>
                                <MDBCol col="12" class="mt-2">
                                  <MDBTextarea size="sm" label="清查備註" rows="2" v-model="nowPRecordCom" />
                                </MDBCol>
                                <!-- 照片 -->
                                <MDBLightbox zoomLevel="0.25" style="height: 19rem;">
                                  <MDBRow class="overflow-auto align-content-start h-100">
                                      <!-- 近照 -->
                                      <MDBCol xl="6">
                                        <MDBRow>
                                          <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                            <!-- 圖片 -->
                                            <MDBLightboxItem 
                                              id="PRecordImg0"
                                              :src="nowPRecordImg0DL" 
                                              :fullScreenSrc="nowPRecordImg0DL"
                                              onerror="this.src='nosrc.png'"
                                              alt="近照" 
                                              class="img-allfluid"
                                              @drop.prevent="dropFile($event)"
                                              @dragover.prevent="cancelDefault($event)"
                                              @dragenter.prevent="cancelDefault($event)" />
                                            <!-- 按鈕 -->
                                            <div v-show="nowPRecordImg0" class="imgtitle">{{nowPRecordImg0}}</div>
                                            <div v-show="!nowPRecordImg0" class="imgtitle">近照</div>
                                            <button v-show="nowPRecordImg0" class="imgcancel btn p-0" @click.prevent="nowPRecordImg0=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg0')">上傳</MDBBtn>
                                              <MDBBtn tag="a" target=_blank :href="nowPRecordImg0DL" download size="sm" color="secondary">下載</MDBBtn>
                                            </div>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCol>
                                      <!-- 遠照1 -->
                                      <MDBCol xl="6">
                                        <MDBRow>
                                          <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                            <!-- 圖片 -->
                                            <MDBLightboxItem 
                                              id="PRecordImg1"
                                              :src="nowPRecordImg1DL" 
                                              :fullScreenSrc="nowPRecordImg1DL"
                                              onerror="this.src='nosrc.png'"
                                              alt="遠照1" 
                                              class="img-allfluid"
                                              @drop.prevent="dropFile($event)"
                                              @dragover.prevent="cancelDefault($event)"
                                              @dragenter.prevent="cancelDefault($event)" />
                                            <!-- 按鈕 -->
                                            <div v-show="nowPRecordImg1" class="imgtitle">{{nowPRecordImg1}}</div>
                                            <div v-show="!nowPRecordImg1" class="imgtitle">遠照1</div>
                                            <button v-show="nowPRecordImg1" class="imgcancel btn p-0" @click.prevent="nowPRecordImg1=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg1')">上傳</MDBBtn>
                                              <MDBBtn tag="a" target=_blank :href="nowPRecordImg1DL" download size="sm" color="secondary">下載</MDBBtn>
                                            </div>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCol>
                                      <!-- 遠照2 -->
                                      <MDBCol xl="6">
                                        <MDBRow>
                                          <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                            <!-- 圖片 -->
                                            <MDBLightboxItem 
                                              id="PRecordImg2"
                                              :src="nowPRecordImg2DL" 
                                              :fullScreenSrc="nowPRecordImg2DL"
                                              onerror="this.src='nosrc.png'"
                                              alt="遠照2" 
                                              class="img-allfluid"
                                              @drop.prevent="dropFile($event)"
                                              @dragover.prevent="cancelDefault($event)"
                                              @dragenter.prevent="cancelDefault($event)" />
                                            <!-- 按鈕 -->
                                            <div v-show="nowPRecordImg2" class="imgtitle">{{nowPRecordImg2}}</div>
                                            <div v-show="!nowPRecordImg2" class="imgtitle">遠照2</div>
                                            <button v-show="nowPRecordImg2" class="imgcancel btn p-0" @click.prevent="nowPRecordImg2=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg2')">上傳</MDBBtn>
                                              <MDBBtn tag="a" target=_blank :href="nowPRecordImg2DL" download size="sm" color="secondary">下載</MDBBtn>
                                            </div>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCol>
                                      <!-- 遠照3 -->
                                      <MDBCol xl="6">
                                        <MDBRow>
                                          <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                            <!-- 圖片 -->
                                            <MDBLightboxItem 
                                              id="PRecordImg3"
                                              :src="nowPRecordImg3DL" 
                                              :fullScreenSrc="nowPRecordImg3DL"
                                              onerror="this.src='nosrc.png'"
                                              alt="遠照3" 
                                              class="img-allfluid"
                                              @drop.prevent="dropFile($event)"
                                              @dragover.prevent="cancelDefault($event)"
                                              @dragenter.prevent="cancelDefault($event)" />
                                            <!-- 按鈕 -->
                                            <div v-show="nowPRecordImg3" class="imgtitle">{{nowPRecordImg3}}</div>
                                            <div v-show="!nowPRecordImg3" class="imgtitle">遠照3</div>
                                            <button v-show="nowPRecordImg3" class="imgcancel btn p-0" @click.prevent="nowPRecordImg3=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg3')">上傳</MDBBtn>
                                              <MDBBtn tag="a" target=_blank :href="nowPRecordImg3DL" download size="sm" color="secondary">下載</MDBBtn>
                                            </div>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCol>
                                      <!-- 透空圖 -->
                                      <MDBCol xl="6">
                                        <MDBRow>
                                          <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                            <!-- 圖片 -->
                                            <MDBLightboxItem 
                                              id="PRecordImgObs"
                                              :src="nowPRecordObsDL" 
                                              :fullScreenSrc="nowPRecordObsDL"
                                              onerror="this.src='nosrc.png'"
                                              alt="透空圖" 
                                              class="img-allfluid"
                                              @drop.prevent="dropFile($event)"
                                              @dragover.prevent="cancelDefault($event)"
                                              @dragenter.prevent="cancelDefault($event)" />
                                            <!-- 按鈕 -->
                                            <div v-show="nowPRecordObs" class="imgtitle">{{nowPRecordObs}}</div>
                                            <div v-show="!nowPRecordObs" class="imgtitle">透空圖</div>
                                            <button v-show="nowPRecordObs" class="imgcancel btn p-0" @click.prevent="nowPRecordObs=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImgObs')">上傳</MDBBtn>
                                              <MDBBtn tag="a" target=_blank :href="nowPRecordObsDL" download size="sm" color="secondary">下載</MDBBtn>
                                            </div>
                                          </MDBCol>
                                        </MDBRow>
                                      </MDBCol>
                                  </MDBRow>
                                </MDBLightbox>
                              </MDBRow>
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>                    
                    </MDBTabPane>
                    <!-- 標準件管理 -->
                    <MDBTabPane tabId="item_mg" class="h-100">
                      <MDBRow class="h-100">
                        <!-- 列表 -->
                        <MDBCol lg="5" class="h-100 border-1 border-end">
                          <!-- 功能列 -->
                          <MDBRow>
                            <MDBCol col="12" class="d-flex py-2 border-1 border-bottom">
                              <span class="me-auto">作業使用之標準件</span>
                              <MDBBtn :disabled="!rGroup[1] || data_eqpt.length===0" size="sm" color="secondary" @click="copyLink">全複製</MDBBtn>
                              <MDBBtn :disabled="!rGroup[1] || !nowPrjId || tempLink.length===0" size="sm" color="secondary" @click="pasteLink">貼上</MDBBtn>
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveLink">儲存</MDBBtn>
                            </MDBCol>
                          </MDBRow>
                          <MDBRow class="overflow-auto align-content-start" style="position:relative; height: fcalc(100% - 3rem);">
                            <div :class="{ 'hiddenSpinner': notProssing3}" style="position: absolute; left: 50%; top: 10rem;">
                              <MDBSpinner size="md" color="primary" />Loading...
                            </div>
                            <DataTable :data="data_eqpt" :columns="columns_eqpt" :options="tboption_eqpt" ref="table_eqpt"
                              style="font-size: smaller;" class="display w-100 compact" />
                          
                          </MDBRow>
                        </MDBCol>
                        <!-- 表單 -->
                        <MDBCol v-show="!showRefReport" lg="7" class="h-100">
                          <!-- 左上 -->
                          <MDBRow style="height: 45%;" class="border-1 border-bottom overflow-auto align-content-start">
                            <MDBCol col="6"><span>查詢標準件</span></MDBCol>
                            <MDBSelect filter size="sm" class="mt-2 col-6" 
                              label="標準件類型" 
                              v-model:options="nowEqptTypeMU"
                              v-model:selected="nowEqptType" 
                              ref="nowEqptTypeDOM"
                              @change="changeEqptType" />
                            <DataTable 
                              :data="data_eqpt2" 
                              :columns="columns_eqpt2" 
                              :options="tboption_eqpt2" 
                              ref="table_eqpt2"
                              style="font-size: smaller; padding-top: 1rem;"
                              class="display w-100 compact" />
                          </MDBRow>
                          <!-- 左下 -->
                          <MDBRow style="height: 55%;">
                            <!-- 左下左(按鈕) -->
                            <div style="width: 4rem;" class="h-100 border-1 border-end d-flex align-items-center">
                              <MDBCol col="12">
                                <MDBBtn :disabled="!rGroup[1] || !nowChkId || !nowPrjId" size="sm" color="primary" class="px-1 my-2" @click="addChk">加入</MDBBtn>
                                <MDBBtn :disabled="!rGroup[1] || !nowLinkChkId" size="sm" color="secondary" class="px-1 my-2" @click="removeChk">移除</MDBBtn>
                              </MDBCol>
                            
                            </div>
                            <!-- 左下右(表單) -->
                            <div style="width: calc(100% - 4rem);" class="h-100">
                              <MDBRow class="h-100 align-content-start">
                                <!-- 查核歷程 -->
                                <DataTable :data="data_chk" :columns="columns_chk" :options="tboption_chk" ref="table_chk"
                                  style="font-size: smaller;" class="display w-100 compact" />
                                <!-- 功能按鈕 -->
                                <MDBRow>
                                  <MDBCol col="12" class="py-2 border-1 border-bottom d-flex">
                                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newChk">新增</MDBBtn>
                                    <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveChk">儲存</MDBBtn>
                                    <MDBPopconfirm :disabled="!rGroup[1] || !nowChkId" 
                                      class="btn-sm btn-danger me-auto" 
                                      message="刪除後無法恢復，確定刪除嗎？"
                                      cancelText="取消" confirmText="確定" 
                                      @confirm="delChk">
                                      刪除
                                    </MDBPopconfirm>
                                    <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="showRefReport=!showRefReport">顯示報告</MDBBtn>
                                  </MDBCol>
                                </MDBRow>
                                <!-- 資料區 -->
                                <MDBRow style="height: calc(100% - 12rem);" class="overflow-auto align-content-start">
                                  <MDBCol class="d-flex align-items-center">
                                    查核紀錄：<span class="text-info">{{nowChkId}}</span>
                                  </MDBCol>
                                  <MDBCol md="6" xl="4" class="mt-2">
                                    <MDBInput readonly size="sm" type="text" label="校正類型" v-model="nowChkType" />
                                  </MDBCol>
                                  <MDBCol md="6" xl="4" class="mt-2">
                                    <MDBDatepicker 
                                      size="sm" 
                                      v-model="nowChkDate" 
                                      format="YYYY-MM-DD" label="校正日"
                                      :monthsFull = "monthsFull"
                                      :monthsShort = "monthsShort"
                                      :weekdaysFull = "weekdaysFull"
                                      :weekdaysShort = "weekdaysShort"
                                      :weekdaysNarrow = "weekdaysNarrow"
                                      confirmDateOnSelect
                                      removeCancelBtn removeOkBtn
                                      ref="nowChkDateDOM" />
                                  </MDBCol>
                                  <div></div>
                                  <MDBCol col="8" class="mt-2">
                                    <MDBInput size="sm" type="text" label="報告編號" v-model="nowChkReportId"/>
                                  </MDBCol>
                                  <MDBCol col="4" class="mt-2 ">
                                    <MDBBtn :disabled="!rGroup[1] || !nowChkReportId || !nowEqptId" size="sm" color="primary" @click.prevent="uploadBtn('ChkCalResult')">上傳</MDBBtn>
                                    <MDBBtn tag="a" target=_blank :href="nowChkCalResultDL" download size="sm" color="secondary">下載</MDBBtn>
                                  </MDBCol>
                                  <div></div>
                                  <MDBSelect size="sm" class="mt-2 col-8" label="校正實驗室" 
                                    :preselect="false"
                                    v-model:options="nowChkCalOrgMU"
                                    v-model:selected="nowChkCalOrg" 
                                    ref="nowChkCalOrgDOM"
                                    @close="updateChkOrg()">
                                    <MDBInput 
                                      size="sm" 
                                      type="text" 
                                      label="自訂新選項" 
                                      v-model="nowChkCalOrg"
                                      @click="domTextSelect($event)" />
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
                              </MDBRow>
                            </div>
                          </MDBRow>
                        </MDBCol>
                        <!-- 標準件校正報告 -->
                        <MDBCol v-show="showRefReport" lg="7" class="h-100">
                          <div>
                            <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="showRefReport=!showRefReport">關閉報告</MDBBtn>
                          </div>
                          <iframe id="pdf-js-viewer" :src="chkResultPDF" class="w-100" style="height: calc(100% - 2rem);"></iframe>
                        </MDBCol>
                      </MDBRow> 
                    </MDBTabPane>
                    <!-- 管制圖 -->
                    <MDBTabPane tabId="ctrl_chart" class="h-100">
                      <MDBRow class="h-100 overflow-auto">
                        <!-- 航測像機 -->
                        <MDBCol v-show="(nowPrjCalTypeId===1)" col="12" class="border-1 border-top" >
                          <!-- F -->
                          <div class="hstack gap-3 mt-2">
                            <span class="typeF"><i class="fas fa-plane-departure"></i>航測像機</span>
                            <div>目前作業：<span class="text-info">{{nowPrjCode}}</span></div>
                            <div>
                              <MDBInput size="sm" type="text" label="簡稱標籤" v-model="ccLabel_F"/>
                            </div>
                            
                            <MDBSelect size="sm" label="參考作業" 
                              v-model:options="refPrjCodeFMU"
                              v-model:selected="refPrjCodeF" 
                              ref="refPrjCodeFDOM" />
                            <MDBBtn 
                              :disabled="!rGroup[1] || !refPrjCodeF || !(nowPrjMethod==='量測' || nowPrjMethod==='中間查核')" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="computeCChart('F',ccLabel_F,refPrjCodeF)"
                            >計算</MDBBtn>
                            <MDBBtn 
                              :disabled="!(nowPrjMethod==='量測' || nowPrjMethod==='中間查核') || !cchasData_F" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="saveCCData('F',nowPrjCode)"
                            >匯出計算</MDBBtn>
                          </div>
                          <div class="hstack gap-3 mt-2">
                            <div>計算資料：
                              <span v-if="cchasData_F" class="status71"><i class="fas fa-check-circle"></i></span>
                              <span v-else="cchasData_F" class="status1"><i class="fas fa-check-circle"></i></span>
                            </div>
                            <div>平均值：<span style="color: rgb(255,153,0);">{{ccAvg_F}}</span></div>
                            <div>最小值：<span style="color: rgb(255,0,255);">{{ccMin_F}}</span></div>
                            <div>最大值：<span style="color: rgb(0,114,255);">{{ccMax_F}}</span></div>
                          </div>
                          <MDBRow class="justify-content-center">
                            <MDBCol xl="8" class="my-2">
                              <!-- <div class="w-100"> -->
                                <canvas id="ctlChartF" class="border border-1"></canvas>
                              <!-- </div> -->
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                        <!-- 小像幅航拍攝影機 -->
                        <MDBCol v-show="(nowPrjCalTypeId===1)" col="12" class="border-1 border-top" >
                          <!-- J -->
                          <div class="hstack gap-3 mt-2">
                            <span class="typeJ"><i class="fas fa-camera"></i>小像幅航拍攝影機</span>
                            <div>目前作業：<span class="text-info">{{nowPrjCode}}</span></div>
                            <div>
                              <MDBInput size="sm" type="text" label="簡稱標籤" v-model="ccLabel_J"/>
                            </div>
                            
                            <MDBSelect size="sm" label="參考作業" 
                              v-model:options="refPrjCodeJMU"
                              v-model:selected="refPrjCodeJ" 
                              ref="refPrjCodeJDOM" />
                            <MDBBtn 
                              :disabled="!rGroup[1] || !refPrjCodeJ || !(nowPrjMethod==='量測' || nowPrjMethod==='中間查核')" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="computeCChart('J',ccLabel_J,refPrjCodeJ)"
                            >計算</MDBBtn>
                            <MDBBtn 
                              :disabled="!(nowPrjMethod==='量測' || nowPrjMethod==='中間查核') || !cchasData_J" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="saveCCData('J',nowPrjCode)"
                            >匯出計算</MDBBtn>
                          </div>
                          <div class="hstack gap-3 mt-2">
                            <div>計算資料：
                              <span v-if="cchasData_J" class="status71"><i class="fas fa-check-circle"></i></span>
                              <span v-else="cchasData_J" class="status1"><i class="fas fa-check-circle"></i></span>
                            </div>
                            <div>平均值：<span style="color: rgb(255,153,0);">{{ccAvg_J}}</span></div>
                            <div>最小值：<span style="color: rgb(255,0,255);">{{ccMin_J}}</span></div>
                            <div>最大值：<span style="color: rgb(0,114,255);">{{ccMax_J}}</span></div>
                          </div>
                          <MDBRow class="justify-content-center">
                            <MDBCol xl="8" class="my-2">
                              <!-- <div class="w-100"> -->
                                <canvas id="ctlChartJ" class="border border-1"></canvas>
                              <!-- </div> -->
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                        <!-- 空載光達 -->
                        <MDBCol v-show="(nowPrjCalTypeId===2)" col="12" class="border-1 border-top" >
                          <!-- I -->
                          <div class="hstack gap-3 mt-2">
                            <span class="typeI"><i class="fas fa-wifi rotation180"></i>空載光達</span>
                            <div>目前作業：<span class="text-info">{{nowPrjCode}}</span></div>
                            <div>
                              <MDBInput size="sm" type="text" label="簡稱標籤" v-model="ccLabel_I"/>
                            </div>
                            
                            <MDBSelect size="sm" label="參考作業" 
                              v-model:options="refPrjCodeIMU"
                              v-model:selected="refPrjCodeI" 
                              ref="refPrjCodeIDOM" />
                            <MDBBtn 
                              :disabled="!rGroup[1] || !(nowPrjMethod==='量測' || nowPrjMethod==='中間查核')" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="computeCChart('I',ccLabel_I,refPrjCodeI)"
                            >計算</MDBBtn>
                            <MDBBtn 
                              :disabled="!(nowPrjMethod==='量測' || nowPrjMethod==='中間查核') || !cchasData_I" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="saveCCData('I',nowPrjCode)"
                            >匯出計算</MDBBtn>
                          </div>
                          <div class="hstack gap-3 mt-2">
                            <div>計算資料：
                              <span v-if="cchasData_I" class="status71"><i class="fas fa-check-circle"></i></span>
                              <span v-else="cchasData_I" class="status1"><i class="fas fa-check-circle"></i></span>
                            </div>
                            <div>平均值：<span style="color: rgb(255,153,0);">{{ccAvg_I}}</span></div>
                            <div>最小值：<span style="color: rgb(255,0,255);">{{ccMin_I}}</span></div>
                            <div>最大值：<span style="color: rgb(0,114,255);">{{ccMax_I}}</span></div>
                          </div>
                          <MDBRow class="justify-content-center">
                            <MDBCol xl="8" class="my-2">
                              <!-- <div class="w-100"> -->
                                <canvas id="ctlChartI" class="border border-1"></canvas>
                              <!-- </div> -->
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                        <!-- 車載光達 -->
                        <MDBCol v-show="(nowPrjCalTypeId===9)" col="12" class="border-1 border-top" >
                          <!-- M -->
                          <div class="hstack gap-3 mt-2">
                            <span class="typeM"><i class="fas fa-wifi rotation180"></i>車載光達</span>
                            <div>目前作業：<span class="text-info">{{nowPrjCode}}</span></div>
                            <div>
                              <MDBInput size="sm" type="text" label="簡稱標籤" v-model="ccLabel_M"/>
                            </div>
                            
                            <MDBSelect size="sm" label="參考作業" 
                              v-model:options="refPrjCodeMMU"
                              v-model:selected="refPrjCodeM" 
                              ref="refPrjCodeMDOM" />
                            <MDBBtn 
                              :disabled="!rGroup[1] || !(nowPrjMethod==='基準量測' || nowPrjMethod==='中間查核')" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="computeCChart('M',ccLabel_M,refPrjCodeM)"
                            >計算</MDBBtn>
                            <MDBBtn 
                              :disabled="!(nowPrjMethod==='基準量測' || nowPrjMethod==='中間查核') || !cchasData_M" 
                              size="sm" 
                              color="primary" 
                              @click.prevent="saveCCData('M',nowPrjCode)"
                            >匯出計算</MDBBtn>
                          </div>
                          <div class="hstack gap-3 mt-2">
                            <div>計算資料：
                              <span v-if="cchasData_M" class="status71"><i class="fas fa-check-circle"></i></span>
                              <span v-else="cchasData_M" class="status1"><i class="fas fa-check-circle"></i></span>
                            </div>
                            <div>平均值：<span style="color: rgb(255,153,0);">{{ccAvg_M}}</span></div>
                            <div>最小值：<span style="color: rgb(255,0,255);">{{ccMin_M}}</span></div>
                            <div>最大值：<span style="color: rgb(0,114,255);">{{ccMax_M}}</span></div>
                          </div>
                          <MDBRow class="justify-content-center">
                            <MDBCol xl="8" class="my-2">
                              <!-- <div class="w-100"> -->
                                <canvas id="ctlChartM" class="border border-1"></canvas>
                              <!-- </div> -->
                            </MDBCol>
                          </MDBRow>
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
      <Footer1 :msg="infomsg" :activeColor="msgColor" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.unsaved{
  color:rgba(255, 0, 0, 0.5)
}
</style>