<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import path from "path-browserify";
import { ref, unref, onMounted, provide, inject } from "vue";
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
  MDBPopconfirm,
  MDBSwitch,
  MDBLightbox,
  MDBLightboxItem,
  MDBSpinner,
  MDBAlert,
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from 'mdb-vue-ui-kit';
import ToolsGQL from "../graphql/Tools";
import GcpGQL from "../graphql/Gcp";
import PrjGQL from "../graphql/Prj";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";
import { downloadGCP, downloadRef } from "../methods/share.js"
import OpenMap from "../components/Map.vue";

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

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

const rGroupSetting = inject("rGroupSetting");
const rGroup =computed(()=>{
  return rGroupSetting(myUserRole.value,false)
});
//#endregion 取得權限==========End

//#region 參數==========Start
// infomation
const publicPath = inject('publicPath');
const NavItem = ref("gcps");
provide("NavItem",NavItem);

const updateKey = ref(0);
const updateKey2 = ref(0);
const updateKey3 = ref(0);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const notProssing = ref(false);
const openMapDOM = ref();
const dlGCPdropdown1 = ref(false);
const dlGCPdropdown2 = ref(false);

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
const selGcpStatusMU = ref(JSON.parse(inject('ptStatusMU')));
const selGcpStatusDOM = ref();

const selGcpContact = ref("");
const selGcpContactMU = ref([]);
const selGcpContactDOM = ref();

const nowSelParams = computed(()=>{
  let paramsObj ={
    projectId: (parseInt(selPrjCode.value) > -1)?parseInt(selPrjCode.value):null,
    getAllGcpId: (selGcpId.value && selGcpId.value!=="")?selGcpId.value:null,
    enable: (parseInt(selGcpEnable.value) > -1)?parseInt(selGcpEnable.value):null,
    status: (selGcpStatus.value && selGcpStatus.value!==-1)?selGcpStatus.value:null,
    contactId: (parseInt(selGcpContact.value) > -1)?parseInt(selGcpContact.value):null,
  }
  // console.log(JSON.stringify(paramsObj))
  return JSON.stringify(paramsObj);
});
// select over

// 基本資料
const nowGcpId = ref("");
const nowGcpRecordId = ref("");
const nowGcpEnable = ref(true);


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
  if(nowGcpSimage.value){
    return publicPath.value + "04_GCP/Pt/" + nowGcpSimage.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowGcpComment = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  if(nowGcpDespImg.value){
    return publicPath.value + "04_GCP/Pt/" + nowGcpDespImg.value + "?t=" + Math.random()
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
const nowPRecordPtStatusMU = ref(JSON.parse(inject('ptStatusMU')));
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
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  if(nowPRecordImg1.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  if(nowPRecordImg2.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  if(nowPRecordImg3.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordObs = ref("");
const nowPRecordObsDL = computed(()=>{
  if(nowPRecordObs.value){
    return publicPath.value + "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordObs.value + "?t=" + Math.random()
  }else{
    return ""
  }
});


//#endregion 參數==========End

//#region 下拉式篩選清單填入==========Start
// 作業編號清單
const { onDone: getAllPrjonDone, mutate: refgetAllPrj, onError: getAllPrjonError } = useMutation(PrjGQL.GETALLPRJ);
getAllPrjonDone(result=>{
  if(!result.loading && result.data.getAllPrj){
    let mulist=[];
    let recordPrjList=[];
    result.data.getAllPrj.map(x => {
      mulist.push({ text: x.project_code, value: parseInt(x.id)});
      recordPrjList.push({ text: x.project_code, value: parseInt(x.id)});
    }); 
    mulist.sort((a,b)=>{
      return (a.text < b.text)?1:-1;
    });mulist.unshift({ text: "-未選取-", value: -1 });

    recordPrjList.sort((a,b)=>{
      return (a.text < b.text)?1:-1;
    });recordPrjList.unshift({ text: "-未選取-", value: -1 });
    selPrjCodeMU.value = mulist;
    nowPRecordPrjIdMU.value = recordPrjList;
  }
});
getAllPrjonError(e=>{errorHandle(e,infomsg,alert1)});

// 啟用狀態清單
selGcpEnableMU.value = [
  {text: "-未選取-", value: -1},
  {text: "啟用", value: 1},
  {text: "未啟用", value: 0},
];
// 聯絡機關清單
const { onDone: getAllContactonDone, mutate: refgetAllContact, onError: getAllContactonError } = useMutation(GcpGQL.GETALLCONTACT);
getAllContactonDone(result=>{
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
getAllContactonError(e=>{errorHandle(e,infomsg,alert1)});

function updateContact(){
  // let newoption = nowGcpContactId.value;
  // let findid = nowGcpContactMU.value.findIndex(x => x.value===newoption);
  if(nowGcpContactName.value!==""){
    nowGcpContactMU.value.push({text: nowGcpContactName.value, value: -2})
    nowGcpContactDOM.value.setValue(-2);
    nowGcpContactName.value = "";
  }
}

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
const { onDone: getGcpTypeonDone, mutate: refgetGcpType, onError: getGcpTypeonError } = useMutation(GcpGQL.GETGCPTYPE);
getGcpTypeonDone(result=>{
  if(!result.loading && result.data.getGcpType){
    nowGcpTypeCodeMU.value = result.data.getGcpType.map(x => {
      return { text: x.type_name, value: parseInt(x.code) }
    });nowGcpTypeCodeMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
getGcpTypeonError(e=>{errorHandle(e,infomsg,alert1)});

// 清查人員清單
const { mutate: getRecPerson, onDone: getRecPersonOnDone, onError: getRecPersonError } = useMutation(GcpGQL.GETRECPERSON);
getRecPersonOnDone(result=>{
  let getData = result.data.getAllRecPersonList;
  nowPRecordPersonMU.value = getData.map(x => {
      return { text: x, value: x }
    });nowPRecordPersonMU.value.unshift({ text: "-未選取-", value: -1 });
});
getRecPersonError(e=>{errorHandle(e,infomsg,alert1)});

function updateRecPerson(){
  let newoption = nowPRecordPerson.value;
  let findid = nowPRecordPersonMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowPRecordPersonMU.value.push({text: newoption, value: newoption})
    nowPRecordPersonDOM.value.setValue(newoption);
  }
}

//#endregion 下拉式篩選清單填入==========End

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

//#region 點位基本列表==========Start
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
  },
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
    // console.log("getAllGcpOnDone");
    notProssing.value = true;
    data_gcp.value = result.data.getAllGcp;
    openMapDOM.value.loadFeatures();
    updateKey.value = updateKey.value + 1;
  }
});
getAllGcpError(e=>{errorHandle(e,infomsg,alert1)});

// 查詢GCPbyID
const { mutate: getGcpById, onDone: getGcpByIdOnDone, onError: getGcpByIdError } = useMutation(GcpGQL.GETGCPBYID);
getGcpByIdOnDone(result=>{
  let getData = result.data.getGcpById;
  nowGcpEnable.value = (getData.enable===1)?true:false;
  nowGcpRecordId.value = getData.latest_record.id;
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
getGcpByIdError(e=>{errorHandle(e,infomsg,alert1)});

// 儲存
const { mutate: saveGcp, onDone: saveGcpOnDone, onError: saveGcpError } = useMutation(GcpGQL.UPDATEGCP);
saveGcpOnDone(result=>{
  infomsg.value = "點位 " + result.data.updateGCP.id + "儲存完畢";
});
saveGcpError(e=>{errorHandle(e,infomsg,alert1)});

const { mutate: saveGcpContact, onDone: saveGcpContactOnDone, onError: saveGcpContactError } = useMutation(GcpGQL.UPDATEGCPCONTACT);
saveGcpContactError(e=>{errorHandle(e,infomsg,alert1)});

function saveGcpBtn(){
  saveGcpContact({
    updateGcpContactId: nowGcpContactId.value,
    name: document.querySelector('#contactSelectDOM div input').value,
    address: nowGcpContactAds.value,
    person: nowGcpContactPrs.value,
    tel: nowGcpContactTel.value,
    comment: nowGcpContactCom.value,
  }).then(res=>{
    return saveGcp({
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
    })
  }).then(res=>{getAllGcp()});
}

// 新增
function newGcpBtn(){
  nowGcpId.value = "";
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
delGcpError(e=>{errorHandle(e,infomsg,alert1)});
//#endregion 點位基本列表==========End

//#region 歷年量測列表==========Start
const dt_hist = ref();;
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
  order: [[4, 'desc']],
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
// 查詢Record歷年紀錄
const { onDone: getRcordByPIdonDone, mutate: getRcordByPId, onError: getRcordByPIdonError } = useMutation(GcpGQL.GETRECORDBYPID);
getRcordByPIdonDone(result=>{
  if(!result.loading){
    // console.log("getRcordByPId onResult")
    data_hist.value = result.data.getGcpRecordsByGCPId;
  }
});
getRcordByPIdonError(e=>{errorHandle(e,infomsg,alert1)});

// 查詢Record單筆紀錄
const { mutate: getRecordById, onDone: getRecordByIdOnDone, onError: getRecordByIdError } = useMutation(GcpGQL.GETRECORDBYID);
getRecordByIdOnDone(result=>{
  if(result.data.getGcpRecordById){
    // console.log("getRecordByIdOnDone")
    let getData = result.data.getGcpRecordById;
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

    updateKey2.value=updateKey2.value+1;
  }
});
getRecordByIdError(e=>{errorHandle(e,infomsg,alert1)});

// 儲存
const { mutate: saveGcpRecord, onDone: saveGcpRecordOnDone, onError: saveGcpRecordError } = useMutation(GcpGQL.UPDATEGCPRECORD);
saveGcpRecordOnDone(result=>{
  nowPRecordId.value = result.data.updateGcpRecord.id;
  nowGcpId.value = result.data.updateGcpRecord.gcp_id;
  infomsg.value = "點位 " + result.data.updateGcpRecord.gcp_id + "紀錄儲存完畢"
});
saveGcpRecordError(e=>{errorHandle(e,infomsg,alert1)});

function saveGcpRecordBtn(){
  saveGcpRecord({
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
  }).then(res=>{
    // console.log("1-save getAllGcp");
    nowRcdIdFromDT2 = nowPRecordId.value;
    return getAllGcp();
  });
}

// 新增
function newPRecordBtn(){
  nowPRecordId.value = "";
  nowPRecordPtId.value = nowGcpId.value;
  nowPRecordPrjId.value = -1;
  nowPRecordPrjIdDOM.value.setValue(nowPRecordPrjId.value);
  nowPRecordPrjCode.value = "";
  nowPRecordDate.value = " ";
  nowPRecordPerson.value = "";
  nowPRecordPersonDOM.value.setValue(-1);
  nowPRecordPtStatus.value = "";
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
}
// 刪除
const { mutate: delGcpRecord, onDone: delGcpRecordOnDone, onError: delGcpRecordError } = useMutation(
  GcpGQL.DELGCPRECORD);
delGcpRecordOnDone(result=>{
  infomsg.value = "點位 " + result.data.delGcpRecord.gcp_id + "紀錄刪除完畢"
});
delGcpRecordError(e=>{errorHandle(e,infomsg,alert1)});

function delGcpRecordBtn(){
  delGcpRecord({
    delGcpRecordId: parseInt(nowPRecordId.value)
  }).then(res=>{
    return getAllGcp();
  });
}

// 作業編號下拉式選取
function nowPrjClose(e){
  if(nowPRecordPrjId.value===-1){
    nowPRecordPrjCode.value = ""  
  }else{
    nowPRecordPrjCode.value = document.querySelector('#GCPMGSelPrjId input').value;
  }
}

//#endregion 歷年量測列表==========End

//#region 檔案上傳==========Start
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
  if (!uploadType.value || !nowGcpId.value) {
    return;
  }
  switch (uploadType.value) {
    case "GcpSimage":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-A" + subExt;
      break;
    case "GcpDespImg":
      subpath = "04_GCP/Pt"
      newName = nowGcpId.value + "-B" + subExt;
      break;
    case "PRecordImg0":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-1" + subExt;
      break;
    case "PRecordImg1":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-2" + subExt;
      break;
    case "PRecordImg2":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-3" + subExt;
      break;
    case "PRecordImg3":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-4" + subExt;
      break;
    case "PRecordImgObs":
      subpath = "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value;
      newName = nowGcpId.value + "-C" + subExt;
      break;
  }
  await uploadFile({
    file: upFile.value,
    subpath: subpath,
    newfilename: newName,
  });
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
uploadFileonError(e=>{errorHandle(e,infomsg,alert1)});

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

//#region 收合地圖==========Start
const showLeftData = ref(true);
const leftMAPmd = ref("6");
const leftMAPxl = ref("9");
const rightMAPmd = ref("6");
const rightMAPxl = ref("3");
const showMAPIcon = ref('<i class="fas fa-angle-double-left"></i>');
function zoomMapView(){
  if(showLeftData.value){
    // 準備關閉
    showLeftData.value = false;
    leftMAPmd.value = "6"
    leftMAPxl.value = "6"
    rightMAPmd.value = "6";
    rightMAPxl.value = "6";
    showMAPIcon.value = '<i class="fas fa-angle-double-right"></i>';
    updateKey3.value=updateKey3.value+1;
  }else{  
    // 準備開啟
    showLeftData.value = true;
    leftMAPmd.value = "6"
    leftMAPxl.value = "9"
    rightMAPmd.value = "6";
    rightMAPxl.value = "3";
    showMAPIcon.value = '<i class="fas fa-angle-double-left"></i>';
    updateKey3.value=updateKey3.value+1;
  }
}
//#endregion 收合地圖==========End

// 確認登入狀況
getchecktoken().then(res=>{
  refgetAllPrj().then(res=>{
    selPrjCode.value = selPrjCodeMU.value[1].value;
    selPrjCodeDOM.value.setValue(selPrjCode.value);
    getAllGcp();
  });
  refgetAllContact();
  refgetGcpType();
  getRecPerson();

  return 
}).catch(e=>{
  errorHandle(e,infomsg,alert1);
});

//#region 加載表格選取事件
let nowRcdIdFromDT1 = null;
let nowRcdIdFromDT2 = null;
onMounted(function () {
  dt_gcp.value = table_gcp.value.dt();
  dt_gcp.value.on('select', function (e, dt, type, indexes) {
    // console.log("dt_gcp select")
    nowRcdIdFromDT1 = dt.rows(indexes).data()[0].gcp_record[0].id;
    nowGcpId.value = dt.rows(indexes).data()[0].id;
    getGcpById({getGcpByIdId: nowGcpId.value}).then(res=>{
      // console.log("dt_gcp select getGcpById")
      return getRcordByPId({ gcpId: nowGcpId.value });
    }).then(res=>{
      // 文查圖
      openMapDOM.value.selectPtFeature(nowGcpId.value);
    });
  });
  dt_gcp.value.on('draw', function (e, dt, type, indexes) {
    // console.log("dt_gcp draw")
    selectNowGCP();
  });
  

  dt_hist.value = table_hist.value.dt();
  dt_hist.value.on('select', function (e, dt, type, indexes) {
    // console.log("dt_hist select")
    nowPRecordId.value = dt.rows(indexes).data()[0].id;
    getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
    e.preventDefault();
    e.stopPropagation();
  });
  dt_hist.value.on('draw', function (e, dt, type, indexes) {
    // console.log("dt_hist draw")
    selectNowGCPRecord();
    e.preventDefault();
    e.stopPropagation();
  });
});

function selectNowGCP(){
  if(nowGcpId.value){
    dt_gcp.value.rows(function ( idx, data, node ) {
      return (data.id===nowGcpId.value)?true:false
    }).select();
  }
}

function selectNowGCPRecord(){
  // console.log("nowRcdIdFromDT1",nowRcdIdFromDT1);
  // console.log("nowRcdIdFromDT2",nowRcdIdFromDT2);
  // console.log("dt count",dt_hist.value.rows().count());
  if(nowRcdIdFromDT2){
    // console.log("use 2-nowRcdIdFromDT2 select");
    dt_hist.value.rows(function ( idx, data, node ) {
      return (data.id===nowRcdIdFromDT2)?true:false
    }).select();
    nowRcdIdFromDT1 = null;
    nowRcdIdFromDT2 = null;
    return ;
  }else if(nowRcdIdFromDT1){
    // console.log("use 1-nowRcdIdFromDT1 select");
    dt_hist.value.rows(function ( idx, data, node ) {
      return (data.id===nowRcdIdFromDT1)?true:false
    }).select();
    nowRcdIdFromDT1 = null;
    nowRcdIdFromDT2 = null;
    return ;
  }else{
    // 總數大於0則選擇第1筆，否則不動作
    if(dt_hist.value.rows().count()>0){
      dt_hist.value.row(':eq(0)').select();
    }
  }
}

//#endregion 加載表格選取事件

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
        <MDBCol :md="leftMAPmd" :xl="leftMAPxl" class="h-100">
          <MDBRow class="h-100">
            <!-- 左上列表 -->
            <MDBCol col="12" style="height: 50%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100 overflow-auto">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto" style="position: relative ;">
                      <div :class="{ 'hiddenSpinner': notProssing}" style="position: absolute; left: 50%; top: 10rem;">
                        <MDBSpinner size="md" color="primary" />Loading...
                      </div>
                      <div class="mt-2" style="position:absolute;">目前點號：<span class="text-info">{{nowGcpId}} - {{nowGcpRecordId}}</span></div>
                      <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                        style="font-size: smaller;" class="display w-100 compact" />
                      
                      <div id="gcpbtn" class="gcptools d-flex">
                        <!-- 點位資料下載 -->
                        <MDBDropdown dropend v-model="dlGCPdropdown1">
                          <MDBDropdownToggle color="secondary" size="sm" @click="dlGCPdropdown1 = !dlGCPdropdown1">
                            <i class="fas fa-cloud-download-alt">下載</i>
                          </MDBDropdownToggle>
                          <MDBDropdownMenu dark>
                            <MDBDropdownItem href="#" @click.stop="downloadGCP(data_gcp)">詳細資料</MDBDropdownItem>
                            <MDBDropdownItem href="#" @click.stop="downloadRef(data_gcp)">參考值檔</MDBDropdownItem>
                          </MDBDropdownMenu>
                        </MDBDropdown>
                        <!-- 調查表列印 -->
                        <MDBDropdown dropend v-model="dlGCPdropdown2">
                          <MDBDropdownToggle color="primary" size="sm" @click="dlGCPdropdown2 = !dlGCPdropdown2">
                            列印調查表
                          </MDBDropdownToggle>
                          <MDBDropdownMenu dark>
                            <MDBDropdownItem href="#">
                              <RouterLink target="_blank" :to="{
                                  path: '/sicltab13',
                                  query: { recordID: nowGcpRecordId },
                                }" style="color: inherit;">
                                單一調查表
                              </RouterLink>
                            </MDBDropdownItem>
                            <MDBDropdownItem href="#">
                              <RouterLink target="_blank" :to="{
                                  path: '/sicltab13',
                                  query: { selParams: nowSelParams },
                                }" style="color: inherit;">
                                全部調查表
                              </RouterLink>
                            </MDBDropdownItem>
                          </MDBDropdownMenu>
                        </MDBDropdown>
                      </div>
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
                                <!-- <MDBBtn :disabled="!rGroup[4]" size="sm" color="primary" @click="testfun">test</MDBBtn> -->
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
                              <MDBCol xl="6" style="height: calc(100% - 4.5rem);" class="ps-0">
                                    <!-- 圖片 -->
                                    <MDBLightbox zoomLevel="0.25" class="text-center h-100 overflow-hidden img-thumbnail lightboxImg" style="position:relative;">
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
                                      <button v-show="nowGcpSimage" class="imgcancel btn p-0" @click.prevent="nowGcpSimage=''"></button>
                                      <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                        <MDBBtn :disabled="!rGroup[1] || !nowGcpId" size="sm" color="primary" @click.prevent="uploadBtn('GcpSimage')">上傳</MDBBtn>
                                        <MDBBtn tag="a" target=_blank :href="nowGcpSimageDL" download size="sm" color="secondary">下載</MDBBtn>
                                      </div>
                                    </MDBLightbox>
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
                              <MDBCol xl="6" class="text-center h-100 p-2">
                                <!-- 圖片 -->
                                <MDBLightbox zoomLevel="0.25" class="h-100 overflow-hidden img-thumbnail lightboxImg" style="position:relative;">
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
                                  <button v-show="nowGcpDespImg" class="imgcancel btn p-0" @click.prevent="nowGcpDespImg=''"></button>
                                  <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                    <MDBBtn :disabled="!rGroup[1] || !nowGcpId" size="sm" color="primary" @click.prevent="uploadBtn('GcpDespImg')">上傳</MDBBtn>
                                    <MDBBtn tag="a" target=_blank :href="nowGcpDespImgDL" download size="sm" color="secondary">下載</MDBBtn>
                                  </div>
                                </MDBLightbox>
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
                              <MDBSelect id="contactSelectDOM" size="sm" class="mt-2 col-12" 
                                label="機關名稱" 
                                v-model:options="nowGcpContactMU"
                                v-model:selected="nowGcpContactId" 
                                ref="nowGcpContactDOM" 
                                @close="updateContact()">
                                <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowGcpContactName" />
                              </MDBSelect>

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
                  <MDBRow class="h-100 overflow-auto">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto pt-2" style="position: relative ;">
                      <div style="position:absolute;">歷史紀錄 點號：<span class="text-info">{{nowGcpId}} - {{nowPRecordId}}</span></div>
                      <DataTable :data="data_hist" :columns="columns_hist" :options="tboption_hist" ref="table_hist"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 分割右 -->
                    <MDBCol lg="5" class="h-100 border-start">
                      <MDBRow>
                        <MDBCol col="12" class="py-2 border-bottom">
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newPRecordBtn">新增</MDBBtn>
                          <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveGcpRecordBtn">儲存</MDBBtn>
                          <!-- <MDBBtn size="sm" color="primary" @click="delGcpRecord">刪除</MDBBtn> -->
                          <MDBPopconfirm :disabled="!rGroup[1] || !nowPRecordId" class="btn-sm btn-danger me-auto" message="刪除後無法恢復，確定刪除嗎？"
                            cancelText="取消" confirmText="確定" @confirm="delGcpRecordBtn">
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
                              <MDBSelect id="GCPMGSelPrjId" size="sm" class="mt-2 col-xl-6" label="作業編號" v-model:options="nowPRecordPrjIdMU"
                                v-model:selected="nowPRecordPrjId" ref="nowPRecordPrjIdDOM" @close="nowPrjClose($event)"/>
                              <MDBCol xl="6" class="mt-2">
                                <MDBDatepicker size="sm" v-model="nowPRecordDate" format="YYYY-MM-DD" label="紀錄日期"
                                  ref="nowPRecordDateDOM" />
                              </MDBCol>

                              <MDBSelect filter size="sm" class="mt-2 col-xl-6 notext" 
                                label="作業人員" 
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
                                        <button v-show="nowPRecordImg3" class="imgcancel btn p-0" @click.prevent="nowPRecordImg3=''"></button>
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImg3')">上傳</MDBBtn>
                                          <MDBBtn tag="a" target=_blank :href="nowPRecordImg3DL" download size="sm" color="secondary">下載</MDBBtn>
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
                              <MDBRow class="overflow-auto align-content-start h-100 mx-0">
                                  <!-- 透空圖 -->
                                  <!-- <MDBCol xl="12" class="h-100"> -->
                                    <!-- <MDBRow class="h-100"> -->
                                      <MDBCol xl="12" class="text-center mt-2 overflow-hidden img-thumbnail lightboxImg" style="height: calc(100% - 1rem);position:relative;">
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
                                        <button v-show="nowPRecordObs" class="imgcancel btn p-0" @click.prevent="nowPRecordObs=''"></button>
                                        <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                          <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImgObs')">上傳</MDBBtn>
                                          <MDBBtn tag="a" target=_blank :href="nowPRecordObsDL" download size="sm" color="secondary">下載</MDBBtn>
                                        </div>
                                      </MDBCol>
                                    <!-- </MDBRow> -->
                                  <!-- </MDBCol> -->
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
        <MDBCol :md="rightMAPmd" :xl="rightMAPxl" class="h-100">
          <MDBRow style="position:relative ;margin-left: auto;height: calc(100% - 1rem);border-radius: 0rem 1.25rem 1.25rem 0;" class="my-2 bg-light border border-5 shadow-4">
            <button 
              style="position:absolute;top:-0.3rem;left:-0.6rem;height: calc(100% + 0.65rem);width: 1rem;border-radius: 0.25rem 0 0 0.25rem;" 
              class="m-0 p-0 btn btn-info" 
              @click.prevent="zoomMapView"
              v-html="showMAPIcon" >
            </button>
            <MDBCol col="12" class="h-100 p-2">
              <OpenMap ref="openMapDOM" :key="updateKey3"/>
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
.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 100%;
}
.fs-7{
  font-size: 0.8rem;
}

.gcptools{
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
}
@media screen and (max-width: 767px){
.dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate {
    float: left;
    text-align: left;
}}

</style>