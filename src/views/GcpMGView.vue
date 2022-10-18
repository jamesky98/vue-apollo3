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
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
  MDBDatepicker,
  MDBTextarea,
  MDBBtnClose,
  MDBPopconfirm,
  MDBSwitch,
  MDBLightbox,
  MDBLightboxItem,
  MDBSpinner,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import GcpGQL from "../graphql/Gcp";
import PrjGQL from "../graphql/Prj";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";

import OpenMap from "../components/Map.vue";

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
// 取得權限==========End

// 參數==========Start
// infomation
const NavItem = ref("gcps");
provide("NavItem",NavItem);

const updateKey = ref(0);
const updateKey2 = ref(0);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const notProssing = ref(false);
const openMapDOM = ref();

const activeTabId1 = ref('filter');
const activeTabId2 = ref('ptRecord');

const selPrjCode = ref("");
const selPrjCodeMU = ref([]);
const selPrjCodeDOM = ref();

const selGcpId = ref("");

const selGcpEnable = ref("");
const selGcpEnableMU = ref([]);
const selGcpEnableDOM = ref();

const selGcpStatus = ref("");
const selGcpStatusMU = ref([]);
const selGcpStatusDOM = ref();

const selGcpContact = ref("");
const selGcpContactMU = ref([]);
const selGcpContactDOM = ref();

const nowGcpEnable = ref(true);
const nowGcpId = ref("");

const nowGcpTypeCode = ref("");
const nowGcpTypeCodeMU = ref([]);
const nowGcpTypeCodeDOM = ref();

const nowGcpOwnerShip = ref("");
const nowGcpOwnerShipMU = ref([
  {text: "-未選取-", value: "-1"},
  {text: "公有地", value: "公有地"},
  {text: "私有地", value: "私有地"},
]);
const nowGcpOwnerShipDOM = ref();

const nowGcpEstablishment = ref("");
const nowGcpEstDate = ref("");

const nowGcpPavement = ref("");
const nowGcpPavementMU = ref([
  {text: "-未選取-", value: "-1"},
  {text: "道路面", value: "道路面"},
  {text: "建物頂樓", value: "建物頂樓"},
  {text: "人行道", value: "人行道"},
  {text: "空地地面", value: "空地地面"},
  {text: "泥土面", value: "泥土面"},
  {text: "水泥面", value: "水泥面"},
]);
const nowGcpPavementDOM = ref();

const nowGcpStyle = ref("");
const nowGcpStyleMU = ref([
  {text: "-未選取-", value: "-1"},
  {text: "鋼釘", value: "鋼釘"},
  {text: "鋼片", value: "鋼片"},
]);
const nowGcpStyleDOM = ref();

const nowGcpSimage = ref("");
const nowGcpSimageDL = computed(()=>{
  if(nowGcpDespImg.value){
    return "04_GCP/Pt/" + nowGcpSimage.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowGcpComment = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  if(nowGcpDespImg.value){
    return "04_GCP/Pt/" + nowGcpDespImg.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowGcpDespStr = ref("");
const nowGcpNeedContact = ref(false);
const nowGcpContactId = ref("");
const nowGcpContactMU = ref([]);
const nowGcpContactDOM = ref();

const nowGcpContactAds = ref("");
const nowGcpContactPrs = ref("");
const nowGcpContactTel = ref("");
const nowGcpContactCom = ref("");
// 清查紀錄
const nowPRecordId = ref("");
const nowPRecordPtId = ref("");
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
const nowPRecordPtStatusMU = ref([
  {text: "-未選取-", value: -1},
  {text: "正常", value: "正常"},
  {text: "遺失", value: "遺失"},
  {text: "損毀", value: "損毀"},
  {text: "不適用", value: "不適用"},
  {text: "停用", value: "停用"},
]);
const nowPRecordPtStatusDOM = ref();

const nowPRecordE = ref("");
const nowPRecordN = ref("");
const nowPRecordh = ref("");
const nowPRecordCoor = computed(()=>{
  if(nowPRecordE.value && nowPRecordN.value && nowPRecordh.value){
    return parseFloat(nowPRecordE.value).toFixed(3) + "," + parseFloat(nowPRecordN.value).toFixed(3) + "," + parseFloat(nowPRecordh.value).toFixed(3);
  }else{
    return ""
  }
});

const nowPRecordCom = ref("");

const nowPRecordImg0 = ref("");
const nowPRecordImg0DL = computed(()=>{
  if(nowPRecordImg0.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  if(nowPRecordImg1.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  if(nowPRecordImg2.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  if(nowPRecordImg3.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordObs = ref("");
const nowPRecordObsDL = computed(()=>{
  if(nowPRecordObs.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordObs.value + "?t=" + Math.random()
  }else{
    return ""
  }
});


// 參數==========End

// 下拉式篩選清單填入==========Start
// 作業編號清單
const { onResult: getAllPrj, refetch: refgetAllPrj } = useQuery(PrjGQL.GETALLPRJ);
getAllPrj(result=>{
  if(!result.loading && result.data.getAllPrj){
    let mulist=[];
    let recordPrjList=[];
    result.data.getAllPrj.map(x => {
      mulist.push({ text: x.project_code, value: parseInt(x.id)});
      recordPrjList.push({ text: x.project_code, value: parseInt(x.id)});
    }); 
    mulist.sort((a,b)=>{
      return (a.project_code > b.project_code)?1:-1;
    });mulist.unshift({ text: "-未選取-", value: -1 });

    recordPrjList.sort((a,b)=>{
      return (a.project_code > b.project_code)?1:-1;
    });recordPrjList.unshift({ text: "-未選取-", value: -1 });
    selPrjCodeMU.value = mulist;
    nowPRecordPrjIdMU.value = recordPrjList;
  }
});
refgetAllPrj().then(res=>{
  selPrjCode.value = selPrjCodeMU.value[1].value;
  // console.log(selPrjCode.value);
  selPrjCodeDOM.value.setValue(selPrjCode.value);
  getAllGcp();
});
// 啟用狀態清單
selGcpEnableMU.value = [
  {text: "-未選取-", value: -1},
  {text: "啟用", value: 1},
  {text: "未啟用", value: 0},
];
// 點位狀態清單
selGcpStatusMU.value = [
  {text: "-未選取-", value: -1},
  {text: "正常", value: "正常"},
  {text: "遺失", value: "遺失"},
  {text: "損毀", value: "損毀"},
  {text: "不適用", value: "不適用"},
  {text: "停用", value: "停用"},
];
// 聯絡機關清單
const { onResult: getAllContact, refetch: refgetAllContact } = useQuery(GcpGQL.GETALLCONTACT);
getAllContact(result=>{
  if(!result.loading && result.data.getAllContact){
    // 篩選區
    selGcpContactMU.value = result.data.getAllContact.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    });selGcpContactMU.value.unshift({ text: "-未選取-", value: -1 });
    // 資料區
    nowGcpContactMU.value = result.data.getAllContact.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    });nowGcpContactMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
refgetAllContact();

// 清除篩選
function clearfilter(){
  selPrjCode.value=-1;
  selPrjCodeDOM.value.setValue(-1);

  selGcpId.value="";

  selGcpEnable.value=-1;
  selGcpEnableDOM.value.setValue(-1);

  selGcpStatus.value=-1;
  selGcpStatusDOM.value.setValue(-1);

  selGcpContact.value=-1;
  selGcpContactDOM.value.setValue(-1);
}

function dofilter(){
  notProssing.value = false;
  getAllGcp();
}

// nowGcpTypeCodeMU
const { onResult: getGcpType, refetch: refgetGcpType } = useQuery(GcpGQL.GETGCPTYPE);
getGcpType(result=>{
  if(!result.loading && result.data.getGcpType){
    nowGcpTypeCodeMU.value = result.data.getGcpType.map(x => {
      return { text: x.type_name, value: parseInt(x.code) }
    });nowGcpTypeCodeMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
refgetGcpType();

// 清查人員清單
const { mutate: getRecPerson, onDone: getRecPersonOnDone, onError: getRecPersonError } = useMutation(GcpGQL.GETRECPERSON);
getRecPersonOnDone(result=>{
  let getData = result.data.getAllRecPersonList;
  nowPRecordPersonMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowPRecordPersonMU.value.unshift({ text: "-未選取-", value: -1 });
});
getRecPerson();
function updateRecPerson(){
  let newoption = nowPRecordPerson.value;
  let findid = nowPRecordPersonMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowPRecordPersonMU.value.push({text: newoption, value: newoption})
    nowPRecordPersonDOM.value.setValue(newoption);
  }
}

// 下拉式篩選清單填入==========End

// 點位狀態顯示樣式
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

// 點位基本列表==========Start
const dt_gcp = ref();
provide("dt_gcp", dt_gcp);
const table_gcp = ref(); 
const data_gcp = ref([]);
provide("gcpCoor", data_gcp);
const columns_gcp = [
  {title:"啟用", data:"enable",width:"4rem",className: 'dt-center',render: (data,type,row) => {
    if(data===1){
      return '<i class="fas fa-lg fa-check-circle text-success"></i>'
    }else{
      return '<i class="fas fa-lg fa-times-circle text-danger"></i>'
    }
  }},
  {title:"點號", data:"id", defaultContent: "-"},
  {title:"狀態", data:"gcp_record[0].status", defaultContent: "-", render: statusRender},
  {title:"類別", data:"gcp_type.type_name", defaultContent: "-"},
  {title:"作業編號", data:"gcp_record[0].ref_project.project_code", defaultContent: "-"},
  {title:"作業方式", data:"gcp_record[0].ref_project.method", defaultContent: "-"},
  {title:"清查日", data:"gcp_record[0].date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"清查人", data:"gcp_record[0].person", defaultContent: "-"},
  {title:"需聯絡", data:"need_contact", render: (data,type,row) => {
      if(data===1){
        return "<span class='status23'><i class='fab fa-lg fa-viber'></i></span>"
      }else {
        return "-"
      }
    }},
];
const tboption_gcp = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  scrollY: 'calc(50vh - 12.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};
// 查詢AllGCP
const { mutate: getAllGcp, onDone: getAllGcpOnDone, onError: getAllGcpError } = useMutation(
  GcpGQL.GETALLGCP,() => ({
    variables: {
      projectId: (parseInt(selPrjCode.value) > -1)?parseInt(selPrjCode.value):null,
      getAllGcpId: (selGcpId.value && selGcpId.value!=="")?selGcpId.value:null,
      enable: (parseInt(selGcpEnable.value) > -1)?parseInt(selGcpEnable.value):null,
      status: (selGcpStatus.value && selGcpStatus.value!==-1)?selGcpStatus.value:null,
      contactId: (parseInt(selGcpContact.value) > -1)?parseInt(selGcpContact.value):null,
    }
}));
getAllGcpOnDone(result=>{
  if(!result.loading){
    // console.log(result.data.getAllGcp);
    data_gcp.value = result.data.getAllGcp;
    openMapDOM.value.loadFeatures();
    notProssing.value = true;
    updateKey.value = updateKey.value + 1;
    selectNowGCP();
  }
});

function selectNowGCP(){
  if(nowGcpId.value){
    dt_gcp.value.rows(function ( idx, data, node ) {
      return (data.id===nowGcpId.value)?true:false
    }).select();
  }
}

// 查詢GCPbyID
const { mutate: getGcpById, onDone: getGcpByIdOnDone, onError: getGcpByIdError } = useMutation(GcpGQL.GETGCPBYID);
getGcpByIdOnDone(result=>{
  let getData = result.data.getGcpById;
  nowGcpEnable.value = (getData.enable===1)?true:false;
  
  nowGcpTypeCode.value = getData.type_code;
  nowGcpTypeCodeDOM.value.setValue(nowGcpTypeCode.value);

  nowGcpOwnerShip.value = getData.ownership;
  nowGcpOwnerShipDOM.value.setValue(nowGcpOwnerShip.value);

  nowGcpEstablishment.value = getData.establishment;
  nowGcpEstDate.value = getData.Est_date;

  nowGcpPavement.value = getData.pavement;
  nowGcpPavementDOM.value.setValue(nowGcpPavement.value);

  nowGcpStyle.value = getData.style;
  nowGcpStyleDOM.value.setValue(nowGcpStyle.value);

  nowGcpSimage.value = getData.aerial_img;
  nowGcpComment.value = getData.comment;
  nowGcpDespImg.value = getData.pt_map;
  nowGcpDespStr.value = getData.pt_desc;
  nowGcpNeedContact.value = (getData.need_contact===1)?true:false;
  nowGcpContactId.value = getData.contact_id;
  nowGcpContactDOM.value.setValue(nowGcpContactId.value);

  if(getData.gcp_contact){
    nowGcpContactAds.value = getData.gcp_contact.address;
    nowGcpContactPrs.value = getData.gcp_contact.person;
    nowGcpContactTel.value = getData.gcp_contact.tel;
    nowGcpContactCom.value = getData.gcp_contact.comment;
  }else{
    nowGcpContactAds.value = "";
    nowGcpContactPrs.value = "";
    nowGcpContactTel.value = "";
    nowGcpContactCom.value = "";
  }
  updateKey.value = updateKey.value + 1;
});

// 儲存
const { mutate: saveGcp, onDone: saveGcpOnDone, onError: saveGcpError } = useMutation(GcpGQL.UPDATEGCP);
saveGcpOnDone(result=>{
  infomsg.value = "點位 " + result.data.updateGCP.id + "儲存完畢";
});
function saveGcpBtn(){
  saveGcp({
    updateGcpId: (nowGcpId.value)?nowGcpId.value:'-1',
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
    contactId: (nowGcpContactId.value && nowGcpContactId.value!==-1)?parseInt(nowGcpContactId.value):null,
    comment: nowGcpComment.value,
  }).then(res=>{getAllGcp()});
}

// 新增
function newGcpBtn(){
  nowGcpId.value = "";
  nowGcpEnable.value = true;

  nowGcpTypeCode.value = -1;
  nowGcpTypeCodeDOM.value.setValue(nowGcpTypeCode.value);

  nowGcpOwnerShip.value = "";
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
}

// 刪除
const { mutate: delGcp, onDone: delGcpOnDone, onError: delGcpError } = useMutation(
  GcpGQL.DELGCP,()=>({
    variables: {
      delGcpId: nowGcpId.value,
}}));
delGcpOnDone(result=>{
  infomsg.value = "點位 " + result.data.delGCP.id + "刪除完畢"
});
// 點位基本列表==========End

// 歷年量測列表==========Start
let dt_hist;
const table_hist = ref(); 
const data_hist = ref([]);
const columns_hist = [
  {title:"狀態", data:"status", defaultContent: "-", render: statusRender},
  {title:"作業編號", data:"ref_project.project_code", defaultContent: "-"},
  {title:"作業方式", data:"ref_project.method", defaultContent: "-"},
  {title:"辦理單位", data:"ref_project.organizer", defaultContent: "-"},
  {title:"清查日", data:"date", className: "dt-center", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"清查人", data:"person", defaultContent: "-"},
  {title:"E坐標", data:"coor_E", className:"dt-body-right", defaultContent: "-"},
  {title:"N坐標", data:"coor_N", className:"dt-body-right", defaultContent: "-"},
  {title:"h坐標", data:"coor_h", className:"dt-body-right", defaultContent: "-"},
  {title:"備註", data:"comment", defaultContent: "-"},
];
const tboption_hist = {
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
  }
};
// 查詢Record歷年紀錄
const { onResult: getRcordByPId, refetch: refgetRcordByPId } = useQuery(
  GcpGQL.GETRECORDBYPID,
  ()=>({gcpId:""})
);
getRcordByPId(result=>{
  if(!result.loading){
    // console.log(result.data.getGcpRecordsByGCPId);
    data_hist.value = result.data.getGcpRecordsByGCPId;
    if(nowPRecordId.value){
      dt_hist.rows(function ( idx, data, node ) {
        return (data.id===nowPRecordId.value)?true:false
      }).select();
    }
  }
});
// 查詢Record單筆紀錄
const { mutate: getRecordById, onDone: getRecordByIdOnDone, onError: getRecordByIdError } = useMutation(GcpGQL.GETRECORDBYID);
getRecordByIdOnDone(result=>{
  let getData = result.data.getGcpRecordById;
  nowPRecordPtId.value = getData.gcp_id;
  nowPRecordPrjId.value = getData.project_id;
  nowPRecordPrjIdDOM.value.setValue(nowPRecordPrjId.value);

  nowPRecordPrjCode.value = (getData.ref_project)?getData.ref_project.project_code:"";
  nowPRecordDate.value = (getData.date)?(getData.date.split("T")[0]):"";
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

  updateKey2.value=updateKey2.value+1;
});

// 儲存
const { mutate: saveGcpRecord, onDone: saveGcpRecordOnDone, onError: saveGcpRecordError } = useMutation(GcpGQL.UPDATEGCPRECORD);
saveGcpRecordOnDone(result=>{
  infomsg.value = "點位 " + result.data.updateGcpRecord.gcp_id + "紀錄儲存完畢"
});
function saveGcpRecordBtn(){
  saveGcpRecord({
    updateGcpRecordId: (parseInt(nowPRecordId.value))?parseInt(nowPRecordId.value):-1,
    gcpId: (nowPRecordPtId.value)?nowPRecordPtId.value:null,
    projectId: (parseInt(nowPRecordPrjId.value) && parseInt(nowPRecordPrjId.value)!==-1)?parseInt(nowPRecordPrjId.value):null,
    date: (nowPRecordDate.value === "")? null: nowPRecordDate.value.trim() + "T00:00:00.000Z",
    person: nowPRecordPerson.value,
    status: nowPRecordPtStatus.value,
    coorE: nowPRecordE.value,
    coorN: nowPRecordN.value,
    coorH: nowPRecordh.value,
    closePhoto: nowPRecordImg0.value,
    farPhoto1: nowPRecordImg1.value,
    farPhoto2: nowPRecordImg2.value,
    farPhoto3: nowPRecordImg3.value,
    obstruction: nowPRecordObs.value,
    comment: nowPRecordCom.value,
  }).then(res=>{
    getAllGcp();
  }).then(res=>{
    refgetRcordByPId({ gcpId: nowGcpId.value });
  }).then(res=>{
    getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
  });
}

// 新增
function newPRecordBtn(){
  nowPRecordId.value = "";
  nowPRecordPtId.value = nowGcpId.value;
  nowPRecordPrjId.value = -1;
  nowPRecordPrjIdDOM.value.setValue(nowPRecordPrjId.value);

  nowPRecordPrjCode.value = "";

  nowPRecordDate.value = "";
  nowPRecordDateDOM.value.value.inputValue="";

  nowPRecordPerson.value = "";
  nowPRecordPtStatus.value = "";
  nowPRecordE.value = "";
  nowPRecordN.value = "";
  nowPRecordh.value = "";
  nowPRecordCom.value = "";
  nowPRecordImg0.value = "";
  nowPRecordImg1.value = "";
  nowPRecordImg2.value = "";
  nowPRecordImg3.value = "";
  nowPRecordObs.value = "";
}
// 刪除
const { mutate: delGcpRecord, onDone: delGcpRecordOnDone, onError: delGcpRecordError } = useMutation(
  GcpGQL.DELGCPRECORD,()=>({
    variables: {
      delGcpRecordId: nowPRecordId.value,
}}));
delGcpRecordOnDone(result=>{
  infomsg.value = "點位 " + result.data.delGcpRecord.gcp_id + "紀錄刪除完畢"
});

// 作業編號下拉式選取
function nowPrjChange(e){
  nowPRecordPrjCode.value = nowPRecordPrjIdDOM.value.inputValue;
}

// 歷年量測列表==========End



// 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId) {
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  const inputDOM = document.getElementById("AllUpload");
  inputDOM.setAttribute("accept","");
  switch (inputId) {
    case "GcpSimage":
      inputDOM.setAttribute("accept","image/*");
      break;
    case "GcpDespImg":
      inputDOM.setAttribute("accept","image/*");
      break;
  }
  inputDOM.click();
}
// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e) {
  upFile.value = e.target.files[0];
  let subpath;
  let newName = "";
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "GcpSimage":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-A" + path.extname(e.target.value);
      break;
    case "GcpDespImg":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-B" + path.extname(e.target.value);
      break;
    case "PRecordImg0":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-1" + path.extname(e.target.value);
      break;
    case "PRecordImg1":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-2" + path.extname(e.target.value);
      break;
    case "PRecordImg2":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-3" + path.extname(e.target.value);
      break;
    case "PRecordImg3":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-4" + path.extname(e.target.value);
      break;
    case "PRecordImgObs":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-C" + path.extname(e.target.value);
      break;
  }
  await uploadFile({
    file: upFile.value,
    subpath: subpath,
    newfilename: newName,
  });
}
// 上傳檔案
const { mutate: uploadFile, onDone: uploadFileOnDone } = useMutation(
  CaseGQL.UPLOADFILE
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

// 檔案上傳==========End

// 加載表格選取事件
onMounted(function () {
  dt_gcp.value = table_gcp.value.dt();
  dt_gcp.value.on('select', function (e, dt, type, indexes) {
    nowGcpId.value = dt.rows(indexes).data()[0].id;
    refgetRcordByPId({ gcpId: nowGcpId.value });
    getGcpById({getGcpByIdId: nowGcpId.value});
    // 文查圖
    openMapDOM.value.selectPtFeature(nowGcpId.value);
  });

  dt_hist = table_hist.value.dt();
  dt_hist.on('select', function (e, dt, type, indexes) {
    nowPRecordId.value = dt.rows(indexes).data()[0].id;
    getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
  });
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
        <MDBCol md="6" xl="9" class="h-100">
          <MDBRow class="h-100">
            <!-- 左上列表 -->
            <MDBCol col="12" style="height: 50%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100 overflow-auto">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto pt-2" style="position: relative ;">
                      <div :class="{ 'hiddenSpinner': notProssing}" style="position: absolute; left: 50%; top: 10rem;">
                        <MDBSpinner size="md" color="primary" />Loading...
                      </div>
                      <div style="position:absolute;">目前點號：<span class="text-info">{{nowGcpId}}</span></div>
                      <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 分割右 -->
                    <MDBCol lg="5" class="h-100 border-start">
                      <MDBRow>
                        <MDBCol col="12" class="py-2 border-bottom">
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newGcpBtn">新增</MDBBtn>
                          <MDBBtn :disabled="!rGroup[1] || !nowGcpId" size="sm" color="primary" @click="saveGcpBtn">儲存</MDBBtn>
                          <!-- <MDBBtn size="sm" color="primary" @click="delGcp">刪除</MDBBtn> -->
                          <MDBPopconfirm :disabled="!rGroup[1] || !nowGcpId" class="btn-sm btn-danger me-auto" message="刪除後無法恢復，確定刪除嗎？"
                            cancelText="取消" confirmText="確定" @confirm="delGcp">
                            刪除
                          </MDBPopconfirm>
                        </MDBCol>
                      </MDBRow>
                      <MDBTabs v-model="activeTabId1">
                        <!-- Tabs navs -->
                        <MDBTabNav tabsClasses="">
                          <MDBTabItem tabId="filter" href="filter">篩選</MDBTabItem>
                          <MDBTabItem tabId="baseData" href="baseData">基本資料</MDBTabItem>
                          <MDBTabItem tabId="description" href="description">點之記</MDBTabItem>
                          <MDBTabItem tabId="contact" href="contact">聯絡資訊</MDBTabItem>
                        </MDBTabNav>
                        <MDBTabContent :key="updateKey" style="height: calc(100% - 6rem);">
                          <!-- 篩選 -->
                          <MDBTabPane tabId="filter" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="clearfilter">清除</MDBBtn>
                                <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="dofilter">篩選</MDBBtn>
                                <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="selectNowGCP">test</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="作業編號" v-model:options="selPrjCodeMU"
                                v-model:selected="selPrjCode" ref="selPrjCodeDOM" />
                              <div></div>
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="點號" v-model="selGcpId" />
                              </MDBCol>
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="啟用狀態" v-model:options="selGcpEnableMU"
                                v-model:selected="selGcpEnable" ref="selGcpEnableDOM" />
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="點位狀態" v-model:options="selGcpStatusMU"
                                v-model:selected="selGcpStatus" ref="selGcpStatusDOM" />
                                <div></div>
                              <MDBSelect filter size="sm" class="mt-2 col-xl-6" label="聯絡機關" v-model:options="selGcpContactMU"
                                v-model:selected="selGcpContact" ref="selGcpContactDOM" />
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 基本資料 -->
                          <MDBTabPane tabId="baseData" class="h-100">
                            <MDBRow class="overflow-auto align-content-start h-100">
                              <!-- 左方資料 -->
                              <MDBCol xl="6">
                                <MDBRow>
                                  <MDBCol xl="6" class="mt-2">
                                    <MDBSwitch label="啟用" labelClass="fs-7" v-model="nowGcpEnable" />
                                  </MDBCol>
                                  <MDBCol xl="6" class="mt-2">
                                    <MDBInput size="sm" type="text" label="點號" v-model="nowGcpId" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="類別" v-model:options="nowGcpTypeCodeMU"
                                    v-model:selected="nowGcpTypeCode" ref="nowGcpTypeCodeDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-12" label="周圍舖面" v-model:options="nowGcpPavementMU"
                                    v-model:selected="nowGcpPavement" ref="nowGcpPavementDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-xl-6" label="土地產權" v-model:options="nowGcpOwnerShipMU"
                                    v-model:selected="nowGcpOwnerShip" ref="nowGcpOwnerShipDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-xl-6" label="標心樣式" v-model:options="nowGcpStyleMU"
                                    v-model:selected="nowGcpStyle" ref="nowGcpStyleDOM" />
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設機關" v-model="nowGcpEstablishment" />
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設年月" v-model="nowGcpEstDate" />
                                  </MDBCol>
                                  
                                </MDBRow>
                              </MDBCol>
                              <!-- 右方航拍略圖 -->
                              <MDBCol xl="6" style="height: calc(100% - 4.5rem); position:relative;" class="ps-0">
                                  <!-- <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg h-100" style="position:relative;"> -->
                                    <MDBLightbox zoomLevel="0.25" class="text-center h-100 overflow-hidden img-thumbnail lightboxImg">
                                      <MDBLightboxItem 
                                        :src="nowGcpSimageDL" 
                                        :fullScreenSrc="nowGcpSimageDL"
                                        onerror="this.src='nosrc.png'"
                                        alt="航拍略圖" 
                                        class="img-allfluid" />
                                    </MDBLightbox>
                                    <div style="position: absolute; right: 1rem; bottom: 0.2rem;">
                                      <MDBBtn :disabled="!rGroup[1] || !nowGcpId" size="sm" color="primary" @click.prevent="uploadBtn('GcpSimage')">上傳</MDBBtn>
                                      <MDBBtn tag="a" :href="nowGcpSimageDL" download size="sm" color="secondary">下載</MDBBtn>
                                    </div>
                                  <!-- </MDBCol> -->
                              </MDBCol>

                              <!-- 下方備註 -->
                              <MDBCol col="12" class="my-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowGcpComment" />
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 點之記 -->
                          <MDBTabPane tabId="description" class="h-100">
                            <MDBRow class="overflow-auto align-content-start h-100">
                              <!-- 左方點之記略圖 -->
                              <MDBCol xl="6" class="text-center h-100 p-2" style="position:relative;">
                                <MDBLightbox zoomLevel="0.25" class="h-100 overflow-hidden img-thumbnail lightboxImg">
                                  <MDBLightboxItem 
                                  :src="nowGcpDespImgDL" 
                                  :fullScreenSrc="nowGcpDespImgDL"
                                  onerror="this.src='nosrc.png'"
                                  alt="點之記略圖" 
                                  class="img-allfluid" />
                                </MDBLightbox>
                                <div style="position: absolute; right: 1rem; bottom: 1rem;">
                                  <MDBBtn :disabled="!rGroup[1] || !nowGcpId" size="sm" color="primary" @click.prevent="uploadBtn('GcpDespImg')">上傳</MDBBtn>
                                  <MDBBtn tag="a" :href="nowGcpDespImgDL" download size="sm" color="secondary">下載</MDBBtn>
                                </div>
                              </MDBCol>

                              <!-- 右文 -->
                              <MDBCol xl="6" class="h-100">
                                <MDBRow class="h-100">
                                  <MDBCol col="12" class="h-100">
                                    <MDBTextarea size="sm" class="mt-2" label="點之記說明" rows="13.5" v-model="nowGcpDespStr" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 聯絡資訊 -->
                          <MDBTabPane tabId="contact" class="h-100">
                            <MDBRow class="overflow-auto align-content-start h-100">
                              <MDBCol xl="6" class="mt-2">
                                <MDBSwitch label="需聯絡" labelClass="fs-7" v-model="nowGcpNeedContact" />
                              </MDBCol>
                              <MDBSelect size="sm" class="mt-2 col-12" label="機關名稱" v-model:options="nowGcpContactMU"
                                v-model:selected="nowGcpContactId" ref="nowGcpContactDOM" />
                              <MDBCol xl="12" class="mt-2">
                                <MDBInput size="sm" type="text" label="地址" v-model="nowGcpContactAds" />
                              </MDBCol>
                              <MDBCol xl="8" class="mt-2">
                                <MDBInput size="sm" type="text" label="聯絡對象" v-model="nowGcpContactPrs" />
                              </MDBCol>
                              <MDBCol xl="8" class="mt-2">
                                <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowGcpContactTel" />
                              </MDBCol>
                              <MDBCol col="12" class="mt-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowGcpContactCom" />
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                        </MDBTabContent>
                      </MDBTabs>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 左下歷年列表 -->
            <MDBCol col="12" style="height: 50%;">
              <MDBRow class="h-100">
                <MDBCol col="12" class="border border-5 rounded-8 shadow-4 mb-2" style="height: calc(100% - 0.5rem)">
                  <MDBRow class="h-100" style="position:relative ;">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto pt-2" style="position: relative ;">
                      <div style="position:absolute;">歷史紀錄 點號：<span class="text-info">{{nowGcpId}}</span></div>
                      <DataTable :data="data_hist" :columns="columns_hist" :options="tboption_hist" ref="table_hist"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 分割右 -->
                    <MDBCol lg="5" class="h-100 border-start">
                      <MDBRow>
                        <MDBCol col="12" class="py-2 border-bottom">
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newPRecordBtn">新增</MDBBtn>
                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId" size="sm" color="primary" @click="saveGcpRecordBtn">儲存</MDBBtn>
                          <!-- <MDBBtn size="sm" color="primary" @click="delGcpRecord">刪除</MDBBtn> -->
                          <MDBPopconfirm :disabled="!rGroup[1] || !nowPRecordId" class="btn-sm btn-danger me-auto" message="刪除後無法恢復，確定刪除嗎？"
                            cancelText="取消" confirmText="確定" @confirm="delGcpRecord">
                            刪除
                          </MDBPopconfirm>
                        </MDBCol>
                      </MDBRow>
                      <MDBTabs v-model="activeTabId2">
                        <!-- Tabs navs -->
                        <MDBTabNav tabsClasses="">
                          <MDBTabItem tabId="ptRecord" href="ptRecord">清查資料</MDBTabItem>
                          <MDBTabItem tabId="images" href="images">照片</MDBTabItem>
                          <MDBTabItem tabId="obsImg" href="obsImg">透空圖</MDBTabItem>
                        </MDBTabNav>
                        <MDBTabContent :key="updateKey2" style="height: calc(100% - 6rem);">
                          <!-- 清查資料 -->
                          <MDBTabPane tabId="ptRecord" class="h-100">
                            <MDBRow class="overflow-auto align-content-start h-100">
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput readonly size="sm" type="text" label="索引" v-model="nowPRecordId" />
                              </MDBCol>
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput readonly size="sm" type="text" label="點號" v-model="nowPRecordPtId" />
                              </MDBCol>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="作業編號" v-model:options="nowPRecordPrjIdMU"
                                v-model:selected="nowPRecordPrjId" ref="nowPRecordPrjIdDOM" @close="nowPrjChange($event)"/>
                              <MDBCol xl="6" class="mt-2">
                                <MDBDatepicker size="sm" v-model="nowPRecordDate" format=" YYYY-MM-DD " label="紀錄日期"
                                  ref="nowPRecordDateDOM" />
                              </MDBCol>

                              <MDBSelect filter size="sm" class="mt-2 col-xl-6 notext" 
                                v-model:options="nowPRecordPersonMU"
                                v-model:selected="nowPRecordPerson" 
                                ref="nowPRecordPersonDOM"
                                @close="updateRecPerson()">
                                <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowPRecordPerson" />
                              </MDBSelect>

                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="點位狀況" v-model:options="nowPRecordPtStatusMU"
                                v-model:selected="nowPRecordPtStatus" ref="nowPRecordPtStatusDOM" />

                              <MDBCol xl="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="E坐標" v-model="nowPRecordE" />
                              </MDBCol>
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="N坐標" v-model="nowPRecordN" />
                              </MDBCol>
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="h坐標" v-model="nowPRecordh" />
                              </MDBCol>
                              <MDBCol xl="12" class="mt-2">
                                <MDBInput readonly size="sm" type="text" v-model="nowPRecordCoor" />
                              </MDBCol>

                              <MDBCol col="12" class="mt-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowPRecordCom" />
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 照片資料 -->
                          <MDBTabPane tabId="images" class="h-100">
                            <MDBLightbox zoomLevel="0.25" class="h-100">
                              <MDBRow class="overflow-auto align-content-start h-100">
                                  <!-- 近照 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                        <MDBLightboxItem 
                                          :src="nowPRecordImg0DL" 
                                          :fullScreenSrc="nowPRecordImg0DL"
                                          onerror="this.src='nosrc.png'"
                                          alt="近照" 
                                          class="img-allfluid" />
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg0')">上傳</MDBBtn>
                                          <MDBBtn tag="a" :href="nowPRecordImg0DL" download size="sm" color="secondary">下載</MDBBtn>
                                        </div>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>
                                  <!-- 遠照1 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                        <MDBLightboxItem 
                                          :src="nowPRecordImg1DL" 
                                          :fullScreenSrc="nowPRecordImg1DL"
                                          onerror="this.src='nosrc.png'"
                                          alt="遠照1" 
                                          class="img-allfluid" />
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg1')">上傳</MDBBtn>
                                          <MDBBtn tag="a" :href="nowPRecordImg1DL" download size="sm" color="secondary">下載</MDBBtn>
                                        </div>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>
                                  <!-- 遠照2 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                        <MDBLightboxItem 
                                          :src="nowPRecordImg2DL" 
                                          :fullScreenSrc="nowPRecordImg2DL"
                                          onerror="this.src='nosrc.png'"
                                          alt="遠照2" 
                                          class="img-allfluid" />
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg2')">上傳</MDBBtn>
                                          <MDBBtn tag="a" :href="nowPRecordImg2DL" download size="sm" color="secondary">下載</MDBBtn>
                                        </div>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>
                                  <!-- 遠照3 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: 8.75rem;position:relative;">
                                        <MDBLightboxItem 
                                          :src="nowPRecordImg3DL" 
                                          :fullScreenSrc="nowPRecordImg3DL"
                                          onerror="this.src='nosrc.png'"
                                          alt="遠照3" 
                                          class="img-allfluid" />
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg3')">上傳</MDBBtn>
                                          <MDBBtn tag="a" :href="nowPRecordImg3DL" download size="sm" color="secondary">下載</MDBBtn>
                                        </div>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                              </MDBRow>
                            </MDBLightbox>
                          </MDBTabPane>
                          <!-- 透空圖 -->
                          <MDBTabPane tabId="obsImg" class="h-100">
                            <MDBLightbox zoomLevel="0.25" class="h-100">
                              <MDBRow class="overflow-auto align-content-start h-100">
                                  <!-- 透空圖 -->
                                  <MDBCol xl="12" class="h-100">
                                    <MDBRow class="h-100">
                                      <MDBCol class="text-center mx-2 mt-2 p-0 overflow-hidden img-thumbnail lightboxImg" style="height: calc(100% - 6rem)">
                                          <MDBLightboxItem 
                                            :src="nowPRecordObsDL"
                                            :fullScreenSrc="nowPRecordObsDL" 
                                            onerror="this.src='nosrc.png'"
                                            alt="透空圖" 
                                            class="img-allfluid" />
                                      </MDBCol>
                                      <div></div>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                          label="透空圖" v-model="nowPRecordObs">
                                          <MDBBtnClose @click.prevent="nowPRecordObs = ''"
                                            class="btn-upload-close" />
                                        </MDBInput>
                                      </MDBCol>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click="uploadBtn('PRecordImgObs')">上傳</MDBBtn>
                                        <MDBBtn tag="a" :href="nowPRecordObsDL" download size="sm" color="secondary">下載</MDBBtn>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                              </MDBRow>
                            </MDBLightbox>
                          </MDBTabPane>
                        </MDBTabContent>
                      </MDBTabs>

                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol md="6" xl="3" class="h-100">
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);" class="my-2 bg-light border border-5 rounded-8 shadow-4">
            <MDBCol col="12" class="h-100 p-2">
              <OpenMap ref="openMapDOM" />
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
.datatable tbody tr:last-child {
  border-bottom: rgba(0, 0, 0, 0);
  height: auto;
}
tr > td > span.status89{
  color: #DE3163;
}
tr.selected > td >span.status89 {
  color: white;
}

tr>td>span.status7 {
  color: green;
}
tr.selected>td>span.status7 {
  color: white;
}

tr>td>span.status6 {
  color: #F39C12;
}
tr.selected>td>span.status6 {
  color: white;
}

tr>td>span.status45 {
  color: #6495ED;
}
tr.selected>td>span.status45 {
  color: white;
}

tr>td>span.status23 {
  color: #FF7F50;
}
tr.selected>td>span.status23 {
  color: white;
}

tr>td>span.status1 {
  color: Gray;
}
tr.selected>td>span.status1 {
  color: white;
}

.nav-tabs .nav-link{
  padding: 0.75rem 1rem;
}
.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 100%;
}
.fs-7{
  font-size: 0.8rem;
}
.hiddenSpinner {
  display: none;
}
.img-allfluid{
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>