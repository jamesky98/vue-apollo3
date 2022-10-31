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
  MDBTextarea,
  MDBLightbox,
  MDBLightboxItem,
  MDBSwitch,
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
const publicPath = inject('publicPath');
const NavItem = ref("prjs");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const activeTabId1 = ref("gcp_mg");
const notProssing = ref(false);
const notProssing2 = ref(true);
const notProssing3 = ref(true);

const updateKey = ref(0);
const updateKey2 = ref(0);
const updateKey3 = ref(0);

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

// 參考值表單
// 基本資料
const nowPRecordPtId = ref("");
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

// 標準件
const nowEqptType = ref("");
const nowEqptTypeMU = ref([]);
const nowEqptTypeDOM = ref();


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

    let getEqpt = result.data.getPrjById.ref_use_eqpt;
    if(getEqpt){
      data_eqpt.value = getEqpt;
    }
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
  {title:"備註", data:"comment", defaultContent: "-"},
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
const { mutate: getRcordByPrj, onDone: getRcordByPrjOnDone, onError: getRcordByPrjError } = useMutation(PrjGQL.CALREFGCP);
getRcordByPrjOnDone(result=>{
  data_gcp.value = result.data.calRefGcp;
  notProssing2.value = true;
});


// 作業編號清單
const { onResult: getAllPrjlist, refetch: refgetAllPrjlist } = useQuery(PrjGQL.GETALLPRJ);
getAllPrjlist(result=>{
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
refgetAllPrjlist();
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
    nowGcpContactId.value = getBase.contact_id;
    nowGcpContactDOM.value.setValue(nowGcpContactId.value);
    if(getBase.gcp_contact){
      nowGcpContactAds.value = getBase.gcp_contact.address;
      nowGcpContactPrs.value = getBase.gcp_contact.person;
      nowGcpContactTel.value = getBase.gcp_contact.tel;
      nowGcpContactCom.value = getBase.gcp_contact.comment;
    }else{
      nowGcpContactAds.value = "";
      nowGcpContactPrs.value = "";
      nowGcpContactTel.value = "";
      nowGcpContactCom.value = "";
    }

    updateKey2.value=updateKey2.value+1;
  }
});

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

  dt_gcp.value.rows().deselect();
}

// 儲存
const { mutate: saveGcp, onDone: saveGcpOnDone, onError: saveGcpError } = useMutation(GcpGQL.UPDATEGCP);
const { mutate: saveGcpContact, onDone: saveGcpContactOnDone, onError: saveGcpContactError } = useMutation(GcpGQL.UPDATEGCPCONTACT);
const { mutate: saveGcpRecord, onDone: saveGcpRecordOnDone, onError: saveGcpRecordError } = useMutation(GcpGQL.UPDATEGCPRECORD);

function saveGcpRecordBtn(){
  // 點號 作業編號 為必要
  if(nowPRecordPtId.value && nowPRecordPrjId.value && parseInt(nowPRecordPrjId).value!==-1){
    let result = saveGcpContact({
      updateGcpContactId: nowGcpContactId.value,
      name: document.querySelector('#contactSelectDOM div input').value,
      address: nowGcpContactAds.value,
      person: nowGcpContactPrs.value,
      tel: nowGcpContactTel.value,
      comment: nowGcpContactCom.value,
    }).then(res=>{
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
        contactId: (nowGcpContactId.value && nowGcpContactId.value!==-1)?parseInt(nowGcpContactId.value):null,
        comment: nowGcpComment.value,
      })
    }).then(res=>{
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
      notProssing2.value = false;
      return getRcordByPrj({projectId: parseInt(nowPrjId.value)});
    });

    // infomsg.value = "點位 " + result.data.updateGcpRecord.gcp_id + "紀錄儲存完畢"
  }
}

// 刪除
const { mutate: delGcpRecord, onDone: delGcpRecordOnDone, onError: delGcpRecordError } = useMutation(
  GcpGQL.DELGCPRECORD);
delGcpRecordOnDone(result=>{
  infomsg.value = "點位 " + result.data.delGcpRecord.gcp_id + "紀錄刪除完畢"
});
function delGcpRecordBtn(){
  delGcpRecord({
    delGcpRecordId: parseInt(nowPRecordId.value)
  }).then(res=>{
    return getRcordByPrj({projectId: parseInt(nowPrjId.value)});
  });
}

// 類別清單
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

// 聯絡機關清單
const { onResult: getAllContact, refetch: refgetAllContact } = useQuery(GcpGQL.GETALLCONTACT);
getAllContact(result=>{
  if(!result.loading && result.data.getAllContact){
    // 資料區
    nowGcpContactMU.value = result.data.getAllContact.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    });nowGcpContactMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
refgetAllContact();
function updateContact(){
  // let newoption = nowGcpContactId.value;
  // let findid = nowGcpContactMU.value.findIndex(x => x.value===newoption);
  if(nowGcpContactName.value!==""){
    nowGcpContactMU.value.push({text: nowGcpContactName.value, value: -2})
    nowGcpContactDOM.value.setValue(-2);
    nowGcpContactName.value = "";
  }
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

//#region 標準件管理==========End
const dt_eqpt = ref();
const table_eqpt = ref(); 
const data_eqpt = ref([]);
const columns_eqpt = [
  {title:"索引", data:"id", defaultContent: "-", visible: false},
  {title:"查核紀錄", data:"eqpt_check_id", defaultContent: "-"},
  {title:"儀器類別", data:"ref_eqpt_check.ref_eqpt.ref_eqpt_type.type", defaultContent: "-"},
  {title:"廠牌", data:"ref_eqpt_check.ref_eqpt.chop", defaultContent: "-"},
  {title:"型號", data:"ref_eqpt_check.ref_eqpt.model", defaultContent: "-"},
  {title:"序號", data:"ref_eqpt_check.ref_eqpt.serial_number", defaultContent: "-"},
  {title:"報告編號", data:"ref_eqpt_check.report_id", defaultContent: "-"},
  {title:"校正日", data:"ref_eqpt_check.check_date", defaultContent: "-", render: (data) => {
      return toTWDate(data);}},
  {title:"校正機關", data:"ref_eqpt_check.cal_org", defaultContent: "-"},
  {title:"已儲存", data:"saved", defaultContent: "-", render: (data, type, row, meta) => {
    let myrow = dt_eqpt.value.row(meta.row).node();
    if(data){
      myrow.classList.remove("unsaved");
    }else{
      myrow.classList.add("unsaved");
    }
    return data}},
];
const tboption_eqpt = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[6, 'asc']],
  scrollY: 'calc(100vh - 21rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

const dt_eqpt2 = ref();
const table_eqpt2 = ref(); 
const data_eqpt2 = ref([]);
const columns_eqpt2 = [
  {title:"有效", data:"id", defaultContent: "-"},  
  {title:"索引", data:"id", defaultContent: "-", visible: false},
  {title:"儀器類別", data:"ref_eqpt_type.type", defaultContent: "-"},
  {title:"廠牌", data:"chop", defaultContent: "-"},
  {title:"型號", data:"model", defaultContent: "-"},
  {title:"序號", data:"serial_number", defaultContent: "-"},
  {title:"校正週期", data:"cal_cycle", defaultContent: "-"},
];
const tboption_eqpt2 = {
  dom: 'ft',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
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

// 查詢標準件列表
const { mutate: getEqptByPrj, onDone: getEqptByPrjOnDone, onError: getEqptByPrjError } = useMutation(PrjGQL.GETEQPTBYRRJID);
getEqptByPrjOnDone(result=>{
  let getData = result.data.getEqptByPrj;
  getData.map(x=>{
    x.saved = true;
  })
  data_eqpt.value = getData;
  notProssing3.value = true;
});

// 查詢全標準件
const { onResult: getAllEqpt, refetch: refgetAllEqpt } = useQuery(PrjGQL.GETALLEQPT);
getAllEqpt(result=>{
  if(!result.loading){
    data_eqpt2.value = result.data.getAllEqpt;
  }
});
refgetAllEqpt({type: (nowEqptType.value && nowEqptType.value!==-1)?nowEqptType.value:null});

// 查詢標準件類型下拉式清單
const { onResult: getEqptType, refetch: refgetEqptType } = useQuery(PrjGQL.GETEQPTTYPE);
getEqptType(result=>{
  if(!result.loading){
    nowEqptTypeMU.value = result.data.getEqptType.map(x => {
      return { text: x.type, value: parseInt(x.eqpt_type_id) }
    }); nowEqptTypeMU.value.unshift({ text: "-未選取-", value: -1 });
  }
});
refgetEqptType();
// 切換標準件類型
function changeEqptType(){
  console.log(nowEqptType.value);
  refgetAllEqpt({type: (nowEqptType.value && nowEqptType.value!==-1)?nowEqptType.value:null});
}



function updatTable(){
  if(dt_eqpt.value) dt_eqpt.value.draw();
  if(dt_eqpt2.value) dt_eqpt2.value.draw();
}

function  showLOG(context) {
  console.log(context,nowEqptType.value)
}
//#endregion 標準件管理==========End





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
    notProssing3.value = false;
    getEqptByPrj({getEqptByPrjId: parseInt(nowPrjId.value)});

    updatTable()
  });

  dt_gcp.value = table_gcp.value.dt();
  dt_gcp.value.on('select', function (e, dt, type, indexes) {
    // console.log("dt_gcp select")
    nowPRecordId.value = dt.rows(indexes).data()[0].id;
    getRecordById({getGcpRecordByIdId: parseInt(nowPRecordId.value)});
    e.preventDefault();
    e.stopPropagation();
  });

  dt_eqpt.value = table_eqpt.value.dt();
  dt_eqpt2.value = table_eqpt2.value.dt();
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
                    <MDBCol col="12" class="d-flex py-2 border-bottom">
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
                <MDBTabs v-model="activeTabId1" @shown="updatTable">
                  <!-- Tabs navs -->
                  <MDBTabNav tabsClasses="">
                    <MDBTabItem tabId="gcp_mg" href="gcp_mg">參考值管理</MDBTabItem>
                    <MDBTabItem tabId="item_mg" href="item_mg">標準件管理</MDBTabItem>
                  </MDBTabNav>
                  <!-- Tabs Content -->
                  <MDBTabContent style="height: calc(100% - 3rem);">
                    <!-- 參考值管理 -->
                    <MDBTabPane tabId="gcp_mg" class="h-100">
                      <MDBRow class="h-100">
                        <!-- 列表 -->
                        <MDBCol lg="5" class="h-100 border-end" style="position:relative ;">
                          <div :class="{ 'hiddenSpinner': notProssing2}" style="position: absolute; left: 50%; top: 10rem;">
                            <MDBSpinner size="md" color="primary" />Loading...
                          </div>
                          <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                            style="font-size: smaller;" class="display w-100 compact" />
                        </MDBCol>
                        <!-- 表單 -->
                        <MDBCol lg="7" class="h-100">
                          <MDBRow>
                            <MDBCol col="12" class="py-2 border-bottom">
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="newPRecordBtn">新增</MDBBtn>
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="saveGcpRecordBtn">儲存</MDBBtn>
                              <MDBPopconfirm :disabled="!rGroup[1] || !nowPRecordId" 
                                class="btn-sm btn-danger me-auto" 
                                message="刪除後無法恢復，確定刪除嗎？"
                                cancelText="取消" confirmText="確定" 
                                @confirm="delGcpRecordBtn">
                                刪除
                              </MDBPopconfirm>
                            </MDBCol>
                          </MDBRow>
                          <!-- 參考值表單 -->
                          <MDBRow :key="updateKey2" class="overflow-auto align-content-start mx-0" style="height: calc(100% - 3rem);">
                            <MDBCol xl="12" class="mt-2">
                              目前點號：<span class="text-info">{{nowPRecordPtId}} - {{nowPRecordId}}</span>
                            </MDBCol>
                            <!-- 基本資料 -->
                            <MDBCol col="12" class="rounded-top-5 bg-info text-white" @click="collapseDIV($event,'baseclick')">
                              基本資料
                            </MDBCol>
                            <MDBCol col="12" class="mb-2 pb-2 border rounded-bottom-5">
                              <MDBRow v-show="baseShow">
                                <MDBCol col="12" class="mt-2">
                                  <MDBSwitch label="啟用" labelClass="fs-7" v-model="nowGcpEnable" />
                                </MDBCol>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput size="sm" type="text" label="點號" v-model="nowPRecordPtId" />
                                </MDBCol>
                                <MDBSelect size="sm" class="mt-2 col-md-6 col-xl-4" label="類別" v-model:options="nowGcpTypeCodeMU"
                                  v-model:selected="nowGcpTypeCode" ref="nowGcpTypeCodeDOM" />
                                <MDBSelect size="sm" class="mt-2 col-md-6 col-xl-4" label="周圍舖面" v-model:options="nowGcpPavementMU"
                                  v-model:selected="nowGcpPavement" ref="nowGcpPavementDOM" />
                                <MDBSelect size="sm" class="mt-2 col-md-6 col-xl-4" label="土地產權" v-model:options="nowGcpOwnerShipMU"
                                  v-model:selected="nowGcpOwnerShip" ref="nowGcpOwnerShipDOM" />
                                <MDBSelect size="sm" class="mt-2 col-md-6 col-xl-4" label="標心樣式" v-model:options="nowGcpStyleMU"
                                  v-model:selected="nowGcpStyle" ref="nowGcpStyleDOM" />
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
                                          <button v-show="nowGcpSimage" class="imgcancel btn p-0" @click.prevent="nowGcpSimage=''"></button>
                                          <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                            <MDBBtn :disabled="!rGroup[1] || !nowPRecordPtId" size="sm" color="primary" @click.prevent="uploadBtn('GcpSimage')">上傳</MDBBtn>
                                            <MDBBtn tag="a" :href="nowGcpSimageDL" download size="sm" color="secondary">下載</MDBBtn>
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
                                          <button v-show="nowGcpDespImg" class="imgcancel btn p-0" @click.prevent="nowGcpDespImg=''"></button>
                                          <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                            <MDBBtn :disabled="!rGroup[1] || !nowPRecordPtId" size="sm" color="primary" @click.prevent="uploadBtn('GcpDespImg')">上傳</MDBBtn>
                                            <MDBBtn tag="a" :href="nowGcpDespImgDL" download size="sm" color="secondary">下載</MDBBtn>
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
                                <MDBSelect id="contactSelectDOM" size="sm" class="mt-2 col-12" 
                                  label="機關名稱" 
                                  v-model:options="nowGcpContactMU"
                                  v-model:selected="nowGcpContactId" 
                                  ref="nowGcpContactDOM" 
                                  @close="updateContact()">
                                  <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowGcpContactName" />
                                </MDBSelect>

                                <MDBCol col="12" class="mt-2">
                                  <MDBInput size="sm" type="text" label="地址" v-model="nowGcpContactAds" />
                                </MDBCol>
                                <MDBCol md="6" class="mt-2">
                                  <MDBInput size="sm" type="text" label="聯絡對象" v-model="nowGcpContactPrs" />
                                </MDBCol>
                                <MDBCol md="6" class="mt-2">
                                  <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowGcpContactTel" />
                                </MDBCol>
                                <MDBCol col="12" class="mt-2">
                                  <MDBTextarea size="sm" label="聯絡備註" rows="2" v-model="nowGcpContactCom" />
                                </MDBCol>
                              </MDBRow>
                            </MDBCol>
                            <!-- 紀錄資料 -->
                            <MDBCol col="12" class="rounded-top-5 bg-info text-white" @click="collapseDIV($event,'recordclick')">
                              紀錄資料
                            </MDBCol>
                            <MDBCol col="12" class="mb-2 pb-2 border rounded-bottom-5">
                              <MDBRow v-show="recordShow">
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBInput readonly size="sm" type="text" label="索引" v-model="nowPRecordId" />
                                </MDBCol>
                                <MDBSelect id="PrjMGSelPrjId" size="sm" class="mt-2 col-md-6 col-xl-4" label="作業編號" v-model:options="nowPRecordPrjIdMU"
                                  v-model:selected="nowPRecordPrjId" ref="nowPRecordPrjIdDOM" @close="nowPrjClose($event)"/>
                                <MDBCol md="6" xl="4" class="mt-2">
                                  <MDBDatepicker size="sm" v-model="nowPRecordDate" format=" YYYY-MM-DD " label="紀錄日期"
                                    ref="nowPRecordDateDOM" />
                                </MDBCol>
                                <MDBSelect filter size="sm" class="mt-2 col-md-6 col-xl-4" 
                                  label="作業人員" 
                                  v-model:options="nowPRecordPersonMU"
                                  v-model:selected="nowPRecordPerson" 
                                  ref="nowPRecordPersonDOM"
                                  @close="updateRecPerson()">
                                  <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowPRecordPerson" />
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
                                            <button v-show="nowPRecordImg0" class="imgcancel btn p-0" @click.prevent="nowPRecordImg0=''"></button>
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
                                              <MDBBtn tag="a" :href="nowPRecordImg1DL" download size="sm" color="secondary">下載</MDBBtn>
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
                                              <MDBBtn tag="a" :href="nowPRecordImg2DL" download size="sm" color="secondary">下載</MDBBtn>
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
                                              <MDBBtn tag="a" :href="nowPRecordImg3DL" download size="sm" color="secondary">下載</MDBBtn>
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
                                            <button v-show="nowPRecordObs" class="imgcancel btn p-0" @click.prevent="nowPRecordObs=''"></button>
                                            <div style="position: absolute; right: 0.2rem; bottom: 0.2rem;">
                                              <MDBBtn :disabled="!rGroup[1] || !nowPRecordId || !nowPRecordPrjCode" size="sm" color="primary" @click.prevent="uploadBtn('PRecordImgObs')">上傳</MDBBtn>
                                              <MDBBtn tag="a" :href="nowPRecordObsDL" download size="sm" color="secondary">下載</MDBBtn>
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
                        <MDBCol lg="5" class="h-100 border-end">
                          <!-- 功能列 -->
                          <MDBRow>
                            <MDBCol col="12" class="d-flex py-2 border-bottom">
                              <span class="me-auto">作業使用之標準件</span>
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="secondary" @click="">全複製</MDBBtn>
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="secondary" @click="">貼上</MDBBtn>
                              <MDBBtn :disabled="!rGroup[1]" size="sm" color="primary" @click="">儲存</MDBBtn>
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
                        <MDBCol lg="7" class="h-100">
                          <!-- 左上 -->
                          <MDBRow class="h-50 border-bottom overflow-auto align-content-start">
                            <span>查詢標準件</span>
                            <MDBSelect filter size="sm" class="mt-2" 
                              style="display:contents ;"
                              label="儀器類型" 
                              v-model:options="nowEqptTypeMU"
                              v-model:selected="nowEqptType" 
                              ref="nowEqptTypeDOM"
                              @change="changeEqptType" />
                            <DataTable :data="data_eqpt2" :columns="columns_eqpt2" :options="tboption_eqpt2" ref="table_eqpt2"
                              style="font-size: smaller;" class="display w-100 compact" />
                          </MDBRow>
                          <!-- 左下 -->
                          <MDBRow class="h-50">
                            <!-- 左下左(按鈕) -->
                            <div style="width: 4rem;" class="h-100 border"></div>
                            <!-- 左下右(表單) -->
                            <div style="width: calc(100% - 4rem);" class="h-100 border"></div>
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
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.unsaved{
  color:rgba(255, 0, 0, 0.5)
}
</style>