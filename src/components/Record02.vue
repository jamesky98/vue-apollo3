<script setup>
import { ref, provide, inject } from "vue";
import path from "path-browserify";
import {
  MDBInput,  MDBSwitch,  MDBTextarea,
  MDBCol,  MDBRow,  MDBContainer,
  MDBSelect,  MDBDatepicker,  MDBBtn,  MDBBtnClose,
  MDBStepper,  MDBStepperStep,  MDBStepperHead,  MDBStepperContent,  MDBStepperForm,
  MDBModal,  MDBModalHeader,  MDBModalTitle,  MDBModalBody,  MDBModalFooter,
  MDBTabs,  MDBTabNav,  MDBTabContent,  MDBTabItem,  MDBTabPane,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import ToolsGQL from "../graphql/Tools";
import CaseGQL from "../graphql/Cases";
import EmpGQL from "../graphql/Employee";
import ItemGQL from "../graphql/Item";
import PrjGQL from "../graphql/Prj";
import SelectPs from "./SelectPs.vue";
import SelectUc from "./SelectUc.vue";
import SelectRptTemp from "./SelectRptTemp.vue";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";
import router from '../router'
import { errorHandle, logIn, logOut, toTWDate } from '../methods/User';
import { floatify } from "../methods/mathpor";
import { 
    monthsFull, 
    monthsShort, 
    weekdaysFull, 
    weekdaysShort,
    weekdaysNarrow
  } from "../methods/datePickerParams.js"

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

DataTable.use(DataTableBs5);
DataTable.use(Select);
//#region 參數==========start
// 取得權限
const rGroup = inject("rGroup");
// 引入案件編號
const props = defineProps({
  caseID: String
});
// Information
const infomsg = ref('');
const alert1 =ref(false);
const publicPath = inject('publicPath');
// 案件之詳細資料
const selectUcObj = ref();
const selectReportObj = ref();

const nowCaseTitle = inject("nowCaseTitle"); //報告抬頭
const nowCaseAddress = inject("nowCaseAddress"); //報告地址
// 申請
const updateKey = ref(0);
const nowCaseCalType = ref(""); //校正項目
const nowCaseCalTypeCode = ref(""); //校正項目
const nowCaseItemID = inject("nowCaseItemID"); // 校正件索引
const nowCaseItemChop = ref(""); // 光達廠牌
const nowCaseItemModel = ref(""); // 光達型號
const nowCaseItemSN = ref(""); // 光達序號

// const nowCaseParaType = ref("");  // 規格參數類型1:各項均有 2:整合精度
const isFullPara = ref(true);
const switchLabel = computed(() => {
  return (isFullPara.value) ? "具完整規格" : "具整合精度";
});

const nowCaseLrDisPrs = ref("");  // LIDAR設備測距精度
const nowCaseLrAngResol = ref("");  // LIDAR設備掃描角解析度
const nowCaseLrBeam = ref("");  // LIDAR設備發散角

const nowCaseGnssID = ref("");  // GNSS設備索引
const nowCaseGnssChop = ref("");  // GNSS設備廠牌
const nowCaseGnssModel = ref("");  // GNSS設備型號
const nowCaseGnssSN = ref("");  // GNSS設備序號
const nowCaseGnssPrcH = ref("");  // GNSS設備水平精度 或 整合型平面精度
const nowCaseGnssPrcV = ref("");  // GNSS設備高程精度 或 整合型高程精度

const nowCaseImuID = ref("");  // IMU設備索引
const nowCaseImuChop = ref("");  // IMU設備廠牌
const nowCaseImuModel = ref("");  // IMU設備型號
const nowCaseImuSN = ref("");  // IMU設備序號
const nowCaseImuOmg = ref("");  // IMU設備Omega精度
const nowCaseImuPhi = ref("");  // IMU設備Phi精度
const nowCaseImuKap = ref("");  // IMU設備Kappa精度
const nowCaseImuPrcO = ref("");  // IMU設備姿態角解析度

const nowCasePlanY = ref(""); // 預定拍攝年
const nowCasePlanM = ref(""); // 預定拍攝月
const nowCaseStrips = ref(""); // 航帶總數
const nowCaseEllH = ref(""); // 飛航橢球高
const nowCaseAGL = ref(""); // 飛航離地高
const nowCasePtDensity = ref(""); // 單航帶點雲密度
const nowCaseFOV = ref(""); // 最大掃描角FOV

const nowCaseLrReport = ref(""); // LiDAR規格
const nowCaseLrReportDL = computed(() => {
  if (nowCaseLrReport.value && nowCaseLrReport.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseLrReport.value;
  } else {
    return undefined;
  }
});

const nowCasePosReport = ref(""); // POS規格
const nowCasePosReportDL = computed(() => {
  if (nowCasePosReport.value && nowCasePosReport.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCasePosReport.value;
  } else {
    return undefined;
  }
});

const nowCasePlanMap = ref(""); // 航線規劃圖
const nowCasePlanMapDL = computed(() => {
  if (nowCasePlanMap.value && nowCasePlanMap.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCasePlanMap.value;
  } else {
    return undefined;
  }
});


// 送校
const nowCaseRecDate = inject('nowCaseRecDate'); // 送校日期
const nowCaseRecDateDOM = ref();

const nowCaseFlyDate = ref(""); // 掃描日期
const nowCaseFlyDateDOM = ref();

const nowCaseStripsAc = ref(""); // 實際航帶總數
const nowCaseEllHac = ref(""); // 實際橢球高
const nowCaseAGLac = ref(""); // 實際離地高AGL

const nowCasePtDensityac = ref(""); // 單航帶點雲密度
const nowCaseFOVac = ref(""); // 最大掃描角FOV

const nowCaseFlyMapAc = ref(""); // 實際航線圖
const nowCaseFlyMapAcDL = computed(() => {
  if (nowCaseFlyMapAc.value && nowCaseFlyMapAc.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseFlyMapAc.value;
  } else {
    return undefined;
  }
});

const nowCaseRecTable = ref(""); // 掃描紀錄表
const nowCaseRecTableDL = computed(() => {
  if (nowCaseRecTable.value && nowCaseRecTable.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseRecTable.value;
  } else {
    return undefined;
  }
});

const nowCaseLASNo = ref(""); // 點雲檔案數
const nowCaseOther = ref(""); // 設備佐證照片
const nowCaseOtherDL = computed(() => {
  if (nowCaseOther.value && nowCaseOther.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseOther.value;
  } else {
    return undefined;
  }
});

const nowCaseErrData = ref(""); // 文件異常註記
const nowCaseErrLAS = ref(""); // 點雲異常註記


// 校正
const nowCaseStartDate = inject('nowCaseStartDate'); //開始校正日
const nowCaseStartDateDOM = ref();

const nowCaseRefPrjID = ref(""); // 量測作業索引
const nowCaseRefPrjCode = ref(""); // 量測作業編號編號
const nowCaseRefPrjPublishDate = ref(""); // 參考值發布日期
const nowCaseRefEqpt = ref(); // 使用標準件


// 作業紀錄
const nowCaseSTDh = ref(""); //水平不確定度(自動計算)
const nowCaseSTDv = ref(""); //高程不確定度(自動計算)

const nowCaseKh = ref(""); //水平涵蓋因子(自動計算)
const nowCaseKv = ref(""); //高程涵蓋因子(自動計算)

const nowCaseCalResult = ref(); //計算成果表
const isCalResult = computed(()=>{ //計算表是否有成果
  if(!nowCaseCalResult.value){return false}
  let calTable = nowCaseCalResult.value;
  if (calTable.rmseH && calTable.rmseV){
    return true;
  }else{
    return false;
  }
});

const nowCaseUcResult = ref(); //不確定度計算表
const nowCaseUcModel = ref(""); //不確定度選用模組
provide("nowCaseUcModel", nowCaseUcModel);
const selectUcModel = ref("");
provide("selectUcModel", selectUcModel);
const nowCaseUcModelMU = ref([]);
provide("nowCaseUcModelMU", nowCaseUcModelMU);


// 出具報告
const nowCaseHasLOGO = ref(true); //列印TAF LOGO
const nowCaseReportTemp = ref(""); //校正報告範本
provide("nowCaseReportTemp", nowCaseReportTemp);
const selectReportTemp = ref("");
provide("selectReportTemp", selectReportTemp);
const nowCaseReportTempMU = ref([]);
provide("nowCaseReportTempMU", nowCaseReportTempMU);

const nowCaseReportEdit = inject('nowCaseReportEdit'); //校正報告編輯檔
const nowCaseReportEditDL = computed(() => {
  if (nowCaseReportEdit.value && nowCaseReportEdit.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseReportEdit.value;
  } else {
    return undefined;
  }
});

const nowCaseCompleteDate = inject('nowCaseCompleteDate'); //報告(列印)日期
const nowCaseCompleteDateDOM = ref();

const nowCaseChkDate = ref(""); // 數據檢核日
provide("nowCaseChkDate", nowCaseChkDate);

const nowCaseChkPersonID = inject('nowCaseChkPersonID_0'); //數據檢核人
provide("nowCaseChkPersonID", nowCaseChkPersonID);
const selectChkPersonID = ref("");
provide("selectChkPersonID", selectChkPersonID);
const nowCaseChkPersonMU = ref([]);
provide("nowCaseChkPersonMU", nowCaseChkPersonMU);

const nowCaseSignDate = ref(""); // 報告簽署日
provide("nowCaseSignDate", nowCaseSignDate);

const nowCaseSignPersonID = inject('nowCaseSignPersonID_0'); // 報告簽署人
provide("nowCaseSignPersonID", nowCaseSignPersonID);
const selectSignPersonID = ref("");
provide("selectSignPersonID", selectSignPersonID);
const nowCaseSignPersonMU = ref([]);
provide("nowCaseSignPersonMU", nowCaseSignPersonMU);

const nowCaseReportScan = inject('nowCaseReportScan'); //校正報告掃描檔
const nowCaseReportScanDL = computed(() => {
  if (nowCaseReportScan.value && nowCaseReportScan.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseReportScan.value;
  } else {
    return undefined;
  }
});

// const nowCasePDFPath = ref("pdfjs-dist/web/viewer.html"); //校正報告掃描檔路徑
const nowCasePDFPath = computed(() => {
  if (!nowCaseReportScan.value || nowCaseReportScan.value === '') {
    return "pdfjs-dist/web/viewer.html"
  } else {
    return "pdfjs-dist/web/viewer.html?file=" + publicPath.value + "06_Case/" +
      props.caseID + "/" + nowCaseReportScan.value;
  }
});
// 案件之詳細資料^^^
// 校正件列表
const iType = ref("");  // 選擇儀器類型2:光達 3:GNSS 4:IMU
const showItemFrom = ref(false);
const itemTabId = ref("itemEditor");

const seletItemId = ref("");

const selItemTypeID = ref("");
const selItemTypeMU = ref([]);
const selItemTypeDOM = ref();

const selItemChop = ref("");
const selItemModel = ref("");
const selItemSN = ref("");

const filterItemTypeID = ref("");
const filterItemTypeMU = ref([]);
const filterItemTypeDOM = ref();

const filterItemChop = ref("");
const filterItemChopMU = ref([]);
const filterItemChopDOM = ref();

const filterItemModel = ref("");
const filterItemModelMU = ref([]);
const filterItemModelDOM = ref();

const filterItemSN = ref("");

// 參考值列表
const showPrjFrom = ref(false);
const prjTabId = ref("prjFilter");

const seletPrjID = ref("");
const seletPrjCode = ref("");
const seletPrjPublishDate = ref("");

const filterPrjCode = ref("");

const filterPrjPubDateStart = ref("");
const filterPrjPubDateStartDOM = ref();

const filterPrjPubDateEnd = ref("");
const filterPrjPubDateEndDOM = ref();

//#endregion 參數==========End

//#region 案件詳細編輯資料==========start
// 查詢Record02資料
const {
  mutate: refgetNowCaseF,
  onDone: getNowCaseFonDone,
  onError: getNowCaseFonError,
} = useMutation(CaseGQL.GETFULLCASEBYID, () => ({
  variables: {
    getCasebyIdId: props.caseID,
  }
}));
getNowCaseFonDone(result => {
  if (!result.loading && result && result.data.getCasebyID.case_record_02) {
    // console.log(result.data.getCasebyID);
    // 填入資料
    let getData = result.data.getCasebyID.case_record_02;
    let getItem = result.data.getCasebyID.item_base;
    let getGNSS = result.data.getCasebyID.case_record_02.item_base_case_record_02_gnss_idToitem_base;
    let getIMU = result.data.getCasebyID.case_record_02.item_base_case_record_02_imu_idToitem_base;

    // 校正件資料
    nowCaseCalType.value = result.data.getCasebyID.cal_type;
    nowCaseCalTypeCode.value =
      result.data.getCasebyID.cal_type_cal_typeTocase_base.code;
    nowCaseItemID.value = getItem ? getItem.id : "";
    nowCaseItemChop.value = (getItem) ? getItem.chop : "";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
    // 參數型態
    // nowCaseParaType.value = getData.type;
    (getData.type === 1) ? isFullPara.value = true : isFullPara.value = false;

    // LiDAR規格
    nowCaseLrDisPrs.value = getData.dis_presision;
    nowCaseLrAngResol.value = getData.ang_resolution;
    nowCaseLrBeam.value = getData.beam;
    // GNSS規格
    nowCaseGnssID.value = getData.gnss_id;
    nowCaseGnssChop.value = (getGNSS) ? getGNSS.chop : "";
    nowCaseGnssModel.value = (getGNSS) ? getGNSS.model : "";
    nowCaseGnssSN.value = (getGNSS) ? getGNSS.serial_number : "";
    nowCaseGnssPrcH.value = getData.prec_h; // 等同整合型平面精度
    nowCaseGnssPrcV.value = getData.prec_v; // 等同整合型高程精度
    // IMU規格
    nowCaseImuID.value = getData.imu_id;
    nowCaseImuChop.value = (getIMU) ? getIMU.chop : "";
    nowCaseImuModel.value = (getIMU) ? getIMU.model : "";
    nowCaseImuSN.value = (getIMU) ? getIMU.serial_number : "";
    nowCaseImuOmg.value = getData.omega;
    nowCaseImuPhi.value = getData.phi;
    nowCaseImuKap.value = getData.kappa;
    nowCaseImuPrcO.value = getData.prec_ori;
    // 飛航規劃
    nowCasePlanY.value = getData.plan_year;
    nowCasePlanM.value = getData.plan_month;
    nowCaseStrips.value = getData.strips_no
    nowCaseEllH.value = getData.ell_height;
    nowCaseAGL.value = getData.agl;
    nowCasePtDensity.value = getData.cloud_density;
    nowCaseFOV.value = getData.fov;
    // 檢附資料
    nowCaseLrReport.value = getData.lidar_report;
    nowCasePosReport.value = getData.pos_report;
    nowCasePlanMap.value = getData.plan_map;
    // 送件
    
    nowCaseRecDate.value = (getData.receive_date)?getData.receive_date.split("T")[0]:" ";
    nowCaseFlyDate.value = (getData.fly_date)?getData.fly_date.split("T")[0]:" ";
    
    nowCaseStripsAc.value = getData.strips_no_ac;
    nowCaseEllHac.value = getData.ell_height_ac;
    nowCaseAGLac.value = getData.agl_ac;
    nowCasePtDensityac.value = getData.cloud_density_ac;
    nowCaseFOVac.value = getData.fov_ac;

    nowCaseFlyMapAc.value = getData.fly_map;
    nowCaseRecTable.value = getData.rec_table;
    nowCaseLASNo.value = getData.files_no;
    nowCaseOther.value = getData.others;
    nowCaseErrData.value = getData.err_data;
    nowCaseErrLAS.value = getData.err_cloud;

    // 校正
    nowCaseStartDate.value = (getData.start_Date)?getData.start_Date.split("T")[0]:" ";
    
    nowCaseRefPrjID.value = getData.ref_id;
    nowCaseRefPrjCode.value = getData.ref_project
      ? getData.ref_project.project_code
      : " ";
    nowCaseRefPrjPublishDate.value = getData.ref_project
      ? getData.ref_project.publish_date.split("T")[0]
      : " ";
    nowCaseRefEqpt.value = (getData.ref_project) ? getData.ref_project.ref_use_eqpt : null;

    nowCaseSTDh.value = getData.std_h;
    nowCaseSTDv.value = getData.std_v;
    nowCaseKh.value = getData.k_h;
    nowCaseKv.value = getData.k_v;
    nowCaseCalResult.value = getData.recal_table ? getData.recal_table :null;
    data1.value = calResultToData1();
    nowCaseUcResult.value = getData.uccal_table ? getData.uccal_table :null;

    // 出具報告
    nowCaseHasLOGO.value = getData.has_logo;

    nowCaseReportEdit.value = getData.report_edit;
    nowCaseCompleteDate.value = (getData.complete_date)?getData.complete_date.split("T")[0]:" ";
    
    nowCaseChkDate.value = getData.chk_date
      ? getData.chk_date.split("T")[0]
      : " ";
    nowCaseChkPersonID.value = getData.chk_person_id;
    selectChkPersonID.value = getData.chk_person_id;

    nowCaseSignDate.value = getData.sign_date
      ? getData.sign_date.split("T")[0]
      : " ";
    nowCaseSignPersonID.value = getData.sign_person_id;
    selectSignPersonID.value = getData.sign_person_id;

    nowCaseReportScan.value = getData.report_scan;

    // 不確定度模組
    getUcList().then(res=>{
      nowCaseUcModel.value = getData.uc_model;
      selectUcModel.value = getData.uc_model;
      if(selectUcObj.value){
        selectUcObj.value.doreNew();
      }
    }); // 取得不確定度模組清單，並填入下拉選單
    getRptList().then(res=>{
      nowCaseReportTemp.value = getData.report_template;
      selectReportTemp.value = getData.report_template;
      if(selectReportObj.value){
        selectReportObj.value.doreNew();
      }
    }); // 取得報告範本清單，並填入下拉選單
  }
});
getNowCaseFonError(e=>{errorHandle(e,infomsg,alert1)});

function filterArrayforObj(arr,key){
  let tempArray = [];
  for(let i=0;i<arr.length;i++){
    let hasElm = tempArray.findIndex((x)=>{
      return (x[key]===arr[i][key])?true:false
    });
    if(hasElm === -1){
      tempArray.push(arr[i]);
    }
  }
  return tempArray;
}

// 查詢報告簽署人列表
const { mutate: refgetAllSignPson, onDone: getAllSignPsononDone, onError: getAllSignPsononError } = useMutation(
  EmpGQL.GETEMPOWERBYROLE,
  ()=>({
    variables: {
      roleType:'報告簽署人',
      calType: parseInt(nowCaseCalType.value),
    }
  })
);
getAllSignPsononDone(result => {
  // 加入評估人員選單資料
  if (!result.loading && result.data.getEmpowerbyRole) {
    let mylist = [];
    mylist = result.data.getEmpowerbyRole.map(x => { return {person_id:x.person_id,name: x.employee.name} });//從物件陣列中取出成陣列
    mylist = filterArrayforObj(mylist,"person_id");// 去除重複
    nowCaseSignPersonMU.value = mylist.map(x => {
      return { text: x.name, value: x.person_id }
    }); nowCaseSignPersonMU.value.unshift({ text: "", value: "" });
  }
});
getAllSignPsononError(e=>{errorHandle(e,infomsg,alert1)});

// 查詢數據檢核人列表
const { mutate: refgetAllChkPson, onDone: getAllChkPsononDone, onError: getAllChkPsononError } = useMutation(
  EmpGQL.GETEMPOWERBYROLE,
  ()=>({
    variables: {
      roleType:'校正人員',
      calType: parseInt(nowCaseCalType.value),
    }
  })
);
getAllChkPsononDone(result => {
  // 加入評估人員選單資料
  if (!result.loading && result.data.getEmpowerbyRole) {
    let mylist = [];
    mylist = result.data.getEmpowerbyRole.map(x => { return {person_id:x.person_id,name: x.employee.name} });//從物件陣列中取出成陣列
    mylist = filterArrayforObj(mylist,"person_id");// 去除重複
    nowCaseChkPersonMU.value = mylist.map(x => {
      return { text: x.name, value: x.person_id }
    }); nowCaseChkPersonMU.value.unshift({ text: "", value: "" });
  }
});
getAllChkPsononError(e=>{errorHandle(e,infomsg,alert1)});

//#endregion 案件詳細編輯資料==========end

//#region 校正件列表=========start
let dtItem;
const tableItem = ref();
const dataItem = ref([]);
// 設定表格tableItem
const columnsItem = [
  { data: "id", title: "編號", defaultContent: "-" },
  { data: "chop", title: "廠牌", defaultContent: "-" },
  { data: "model", title: "型號", defaultContent: "-" },
  { data: "serial_number", title: "序號", defaultContent: "-" },
  { data: "item_type.type", title: "儀器類型", defaultContent: "-" },
];
const tboptionItem = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'asc']],
  scrollY: '22vh',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 查詢校正件資料
const {
  mutate: refgetAllItem,
  onDone: getAllItemonDone,
  onError: getAllItemonError
} = useMutation(ItemGQL.GETALLITEM);
getAllItemonDone(result => {
  // 加入校正件資料
  if (!result.loading && result.data.getAllItem) {
    dataItem.value = result.data.getAllItem;

    // 加入下拉式選單    
    let choplist = [];
    let modellist = [];

    choplist = result.data.getAllItem.map(x => { return x.chop });//從物件陣列中取出成陣列
    choplist = [...new Set(choplist)]; //ES6排除重複值語法
    filterItemChopMU.value = choplist.sort().map(x => {
      return { text: x, value: x }
    }); filterItemChopMU.value.unshift({ text: "", value: "" });

    modellist = result.data.getAllItem.map(x => { return x.model });//從物件陣列中取出成陣列
    modellist = [...new Set(modellist)]; //ES6排除重複值語法
    filterItemModelMU.value = modellist.sort().map(x => {
      return { text: x, value: x }
    }); filterItemModelMU.value.unshift({ text: "", value: "" });
  }
});
getAllItemonError(e=>{errorHandle(e,infomsg,alert1)});

// 查詢儀器類型
const {
  mutate: refgetAllItemType,
  onDone: getAllItemTypeonDone,
  onError: getAllItemTypeonError
} = useMutation(ItemGQL.GETALLITEMTYPE);
getAllItemTypeonDone(result => {
  // 加入儀器類型選單資料
  if (!result.loading && result.data.getAllItemType) {
    // 資料區
    selItemTypeMU.value = result.data.getAllItemType.map(x => {
      return { text: x.type, value: parseInt(x.id) }
    }); selItemTypeMU.value.unshift({ text: "", value: "" });
    // 篩選區
    filterItemTypeMU.value = result.data.getAllItemType.map(x => {
      return { text: x.type, value: parseInt(x.id) }
    }); filterItemTypeMU.value.unshift({ text: "", value: "" });
  }
});
getAllItemTypeonError(e=>{errorHandle(e,infomsg,alert1)});


// 查詢選取校正件資料
const {
  mutate: refgetselItem,
  onDone: getselItemonDone,
  onError: getselItemonError,
} = useMutation(ItemGQL.GETITEMBYID);
getselItemonDone(result => {
  if (!result.loading && result && result.data.getItemByID) {
    let getData = result.data.getItemByID
    selItemChop.value = getData.chop;
    selItemTypeID.value = getData.type;
    selItemTypeDOM.value.setValue(parseInt(getData.type));
    selItemModel.value = getData.model;
    selItemSN.value = getData.serial_number;
  } else {
    selItemChop.value = "";
    selItemModel.value = "";
    selItemSN.value = "";
    if (selItemTypeDOM.value) {
      selItemTypeDOM.value.setValue("");
    }
  }
});
getselItemonError(e=>{errorHandle(e,infomsg,alert1)});

// 開啟選擇校正件選單
function shownItemModal() {
  dtItem = tableItem.value.dt();
  dtItem.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    seletItemId.value = getData.id;
    refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
  });
  let where = {};
  where.type = iType.value;
  refgetAllItem(where).then(result=>{
    // 建立廠牌型號下拉式選單
    let choplist = [];
    let modellist = [];
    choplist = result.data.getAllItem.map((x) => {
      return x.chop;
    }); //從物件陣列中取出成陣列
    choplist = [...new Set(choplist)]; //ES6排除重複值語法
    filterItemChopMU.value = choplist.sort().map((x) => {
      return { text: x, value: x };
    });
    filterItemChopMU.value.unshift({ text: "", value: "" });

    modellist = result.data.getAllItem.map((x) => {
      return x.model;
    }); //從物件陣列中取出成陣列
    modellist = [...new Set(modellist)]; //ES6排除重複值語法
    filterItemModelMU.value = modellist.sort().map((x) => {
      return { text: x, value: x };
    });
    filterItemModelMU.value.unshift({ text: "", value: "" });
  });
  refgetAllItemType();

  switch (iType.value) {
    case 2:
      if (nowCaseItemID.value) {
        seletItemId.value = nowCaseItemID.value;
        refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
      }
      break;
    case 3:
      if (nowCaseGnssID.value) {
        seletItemId.value = nowCaseGnssID.value;
        refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
      }
      break;
    case 4:
      if (nowCaseImuID.value) {
        seletItemId.value = nowCaseImuID.value;
        refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
      }
      break;
  }
}

// 儲存校正件資料
const { mutate: saveItem, onDone: saveItemOnDone, onError: saveItemError } = useMutation(
  ItemGQL.SAVEITEM,
  () => ({
    variables: {
      updateItemId: parseInt(seletItemId.value),
      chop: selItemChop.value,
      model: selItemModel.value,
      serialNumber: selItemSN.value,
      type: parseInt(selItemTypeID.value),
    }
  })
);

saveItemOnDone(() => {
  refgetAllItem();
  refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
  // infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  // alert1.value = true;
});
saveItemError(e=>{errorHandle(e,infomsg,alert1)});

// 更多編輯=>引導至校正件管理
function gotoItemMG() {
  router.push('/cust');
}

// 清除校正件篩選條件
function clearItemFilter() {
  filterItemTypeID.value = "";
  filterItemTypeDOM.value.setValue("");

  filterItemChop.value = "";
  filterItemChopDOM.value.setValue("");

  filterItemModel.value = "";
  filterItemModelDOM.value.setValue("");

  filterItemSN.value = "";
}

// 執行校正件篩選
function doItemFilter() {
  let where = {};
  if (filterItemTypeID.value !== "") where.type = filterItemTypeID.value;
  if (filterItemChop.value !== "") where.chop = filterItemChop.value;
  if (filterItemModel.value !== "") where.model = filterItemModel.value;
  if (filterItemSN.value !== "") where.serialNumber = filterItemSN.value;

  // varAllItem.value = where;
  refgetAllItem(where);
}

// 案加入後回填校正件id
function setItemBtn() {
  switch (iType.value) {
    case 2:
      nowCaseItemID.value = seletItemId.value;
      nowCaseItemChop.value = selItemChop.value;
      nowCaseItemModel.value = selItemModel.value;
      nowCaseItemSN.value = selItemSN.value;
      break;
    case 3:
      nowCaseGnssID.value = seletItemId.value;
      nowCaseGnssChop.value = selItemChop.value;
      nowCaseGnssModel.value = selItemModel.value;
      nowCaseGnssSN.value = selItemSN.value;
      break;
    case 4:
      nowCaseImuID.value = seletItemId.value;
      nowCaseImuChop.value = selItemChop.value;
      nowCaseImuModel.value = selItemModel.value;
      nowCaseImuSN.value = selItemSN.value;
      break;
  }

  showItemFrom.value = false;
}

function showItemFromBtn(x) {
  // let where = {};
  iType.value = x;
  // where.type = iType.value;
  // varAllItem.value = where;
  showItemFrom.value = true;
}

//#endregion 校正件列表=========end

//#region 參考值列表=========start
let dtPrj;
const tablePrj = ref();
const dataPrj = ref([]);
// 設定表格tablePrj
const columnsPrj = [
  { data: "id", title: "編號", defaultContent: "-" },
  { data: "project_code", title: "作業編號", defaultContent: "-" },
  { data: "cal_type.name", title: "校正項目", defaultContent: "-" },
  { data: "publish_date", title: "發布日", defaultContent: "-", render: (data) => { return toTWDate(data); } },
  { data: "method", title: "方式", defaultContent: "-" },
  { data: "year", title: "作業年", defaultContent: "-" },
  { data: "month", title: "月", defaultContent: "-" },
  { data: "organizer", title: "作業機關", defaultContent: "-" },
  { data: "start_date", title: "開始日", defaultContent: "-", render: (data) => { return toTWDate(data); } },
  { data: "end_date", title: "結束日", defaultContent: "-", render: (data) => { return toTWDate(data); } },
];
const tboptionPrj = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: '22vh',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

const getPrjCalTypeId = computed(() => {
  if (nowCaseCalType.value === '') {
    return null
  } else if (nowCaseCalType.value === 3) {
    return 1
  } else {
    return nowCaseCalType.value
  }
})
// 查詢量測作業資料
const {
  mutate: refgetAllPrj,
  onDone: getAllPrjonDone,
  onError: getAllPrjonError
} = useMutation(PrjGQL.GETALLPRJ, () => ({
  variables: {
    calTypeId: getPrjCalTypeId.value,
    method: "量測",
  }
}));
getAllPrjonDone(result => {
  // 加入量測作業資料
  if (!result.loading && result.data.getAllPrj) {
    dataPrj.value = result.data.getAllPrj;
  }
});
getAllPrjonError(e=>{errorHandle(e,infomsg,alert1)});

// 開啟參考值選單
function shownPrjModal() {
  dtPrj = tablePrj.value.dt();
  dtPrj.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    seletPrjID.value = getData.id;
    seletPrjCode.value = getData.project_code;
    seletPrjPublishDate.value = (getData.publish_date)?getData.publish_date.split("T")[0]:" ";
  });
  refgetAllPrj();
}

// 更多編輯=>引導至校正件管理
function gotoPrjMG() {
  router.push('/prjs');
}

// 清除校正件篩選條件
function clearPrjFilter() {
  filterPrjCode.value = "";
  filterPrjPubDateStart.value = " ";
  filterPrjPubDateEnd.value = " ";
}

// 執行量測作業篩選
function doPrjFilter() {
  let where = {};
  if (filterPrjCode.value !== "") where.projectCode = filterPrjCode.value;
  if (filterPrjPubDateStart.value.trim() !== "") where.pubdateStart = filterPrjPubDateStart.value.trim();
  if (filterPrjPubDateEnd.value.trim() !== "") where.pubdateEnd = filterPrjPubDateEnd.value.trim();

  // varAllPrj.value = where;
  refgetAllPrj(where);
}

// 案加入後回填量測作業id
function setPrjBtn() {
  nowCaseRefPrjID.value = seletPrjID.value;
  nowCaseRefPrjCode.value = seletPrjCode.value;
  nowCaseRefPrjPublishDate.value = seletPrjPublishDate.value;
  calRefGcp().then(res=>{
    // console.log("calRefGcp");
    return saveRecord02();  
  }).then(res=>{
    // console.log("saveRecord02");
    return refgetNowCaseF();
  }).then(res=>{
    // console.log("refgetNowCaseF");
    return getUcList();
  }).then(res=>{
    // console.log("getUcList");
    showPrjFrom.value = false;
  })
}

// 查詢參考值並填入data1
const { mutate: calRefGcp, onDone: calRefGcpOnDone, onError: calRefGcponError } = useMutation(
  PrjGQL.CALREFGCP,
  () => ({
    variables: {
      projectId: parseInt(nowCaseRefPrjID.value),
      status: "正常",
      calTypeId: 4,
    },
  })
);
calRefGcpOnDone(result=>{
  // 資料寫入data1
  let getData = result.data.calRefGcp;
  let myArray = [];
  getData.forEach((x,i)=>{
    myArray.push({
      type: "T",
      gcp_id: x.gcp_id,
      coor_E: x.coor_E,
      coor_N: x.coor_N,
      coor_h: x.coor_h,
      meas_E: "",
      meas_N: "",
      meas_h: "",
      count: 0,
      d_E: "",
      d_N: "",
      d_h: "",
      memo: "",
    });
  })
  myArray.sort((a,b)=>{
    return (a.gcp_id > b.gcp_id)?1:-1;
  })
  data1.value = myArray;
  data1ToCalResult();
});
calRefGcponError(e=>{errorHandle(e,infomsg,alert1)});

//#endregion 參考值列表=========end

// 儲存Record02
const {
  mutate: saveRecord02,
  onDone: saveRecord02OnDone,
  onError: saveRecord02Error,
} = useMutation(CaseGQL.SAVECASERECORD02, () => ({
  variables: {
    updateRecord02Id: props.caseID,
    type: (isFullPara.value) ? 1 : 2,
    gnssId: parseInt(nowCaseGnssID.value),
    imuId: parseInt(nowCaseImuID.value),
    disPresision: parseFloat(nowCaseLrDisPrs.value),
    angResolution: parseFloat(nowCaseLrAngResol.value),
    beam: parseFloat(nowCaseLrBeam.value),
    precH: parseFloat(nowCaseGnssPrcH.value),
    precV: parseFloat(nowCaseGnssPrcV.value),
    omega: parseFloat(nowCaseImuOmg.value),
    phi: parseFloat(nowCaseImuPhi.value),
    kappa: parseFloat(nowCaseImuKap.value),
    precOri: parseFloat(nowCaseImuPrcO.value),
    planYear: parseInt(nowCasePlanY.value),
    planMonth: parseInt(nowCasePlanM.value),
    stripsNo: parseInt(nowCaseStrips.value),
    ellHeight: parseFloat(nowCaseEllH.value),
    agl: parseFloat(nowCaseAGL.value),
    cloudDensity: parseFloat(nowCasePtDensity.value),
    fov: parseFloat(nowCaseFOV.value),
    lidarReport: nowCaseLrReport.value,
    posReport: nowCasePosReport.value,
    planMap: nowCasePlanMap.value,
    receiveDate: nowCaseRecDate.value.trim() === ""
      ? null
      : nowCaseRecDate.value.trim() + "T00:00:00.000Z",
    flyDate: nowCaseFlyDate.value.trim() === ""
      ? null
      : nowCaseFlyDate.value.trim() + "T00:00:00.000Z",
    stripsNoAc: parseInt(nowCaseStripsAc.value),
    ellHeightAc: parseFloat(nowCaseEllHac.value),
    aglAc: parseFloat(nowCaseAGLac.value),
    cloudDensityAc: parseFloat(nowCasePtDensityac.value),
    fovAc: parseFloat(nowCaseFOVac.value),
    flyMap: nowCaseFlyMapAc.value,
    recTable: nowCaseRecTable.value,
    filesNo: parseInt(nowCaseLASNo.value),
    others: nowCaseOther.value,
    errData: nowCaseErrData.value,
    errCloud: nowCaseErrLAS.value,
    startDate: nowCaseStartDate.value.trim() === ""
      ? null
      : nowCaseStartDate.value.trim() + "T00:00:00.000Z",
    refId: parseInt(nowCaseRefPrjID.value),
    totalPt: parseInt(0),
    gcpFile: "",
    measFile: "",
    resultFile: "",
    stdH: parseFloat(nowCaseSTDh.value),
    stdV: parseFloat(nowCaseSTDv.value),
    kH: parseFloat(nowCaseKh.value),
    kV: parseFloat(nowCaseKv.value),
    stdFile: "",
    reportEdit: nowCaseReportEdit.value,
    chkDate: nowCaseChkDate.value.trim() === ""
      ? null
      : nowCaseChkDate.value.trim() + "T00:00:00.000Z",
    chkPersonId: selectChkPersonID.value === "" ? null : parseInt(selectChkPersonID.value),
    completeDate: nowCaseCompleteDate.value.trim() === ""
      ? null
      : nowCaseCompleteDate.value.trim() + "T00:00:00.000Z",
    signDate: nowCaseSignDate.value.trim() === ""
      ? null
      : nowCaseSignDate.value.trim() + "T00:00:00.000Z",
    signPersonId:
      selectSignPersonID.value === ""
        ? null
        : parseInt(selectSignPersonID.value),
    reportScan: nowCaseReportScan.value,
    hasLogo: nowCaseHasLOGO.value,
    reportTemplate: selectReportTemp.value,
    recordTamplate: "",
    recalTable: (nowCaseCalResult.value)?nowCaseCalResult.value:undefined,
    uccalTable: (nowCaseUcResult.value)?nowCaseUcResult.value:undefined,
    ucModel: selectUcModel.value,
  },
}));
saveRecord02OnDone(() => {
  refgetNowCaseF();
  // console.log(nowCaseCalResult.value)
  // console.log('nowCaseChkPersonID: ',nowCaseChkPersonID.value);
  // console.log('selectChkPersonID: ',selectChkPersonID.value);
  // infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  // alert1.value = true;
});
saveRecord02Error(e=>{errorHandle(e,infomsg,alert1)});

//#region 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId) {
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  const inputDOM = document.getElementById("AllUpload");
  inputDOM.setAttribute("accept","");
  switch (inputId){
    case "itemLrReportUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
    case "itemPOSReportUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
    case "itemLrPlanUpload":
      inputDOM.setAttribute("accept",".dwg");
      break;
    case "FlyMapAcUpload":
      inputDOM.setAttribute("accept",".dwg");
      break;
    case "RecTableUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
    case "OtherUpload":
      inputDOM.setAttribute("accept","");
      break;
    case "ptCloudUpload":
      inputDOM.setAttribute("accept",".xyz");
      break;

    case "ReportEditUpload":
      inputDOM.setAttribute("accept",".docx");
      break;
    case "ReportScanUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
      
  }
  
  inputDOM.click();
}

// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e) {
  upFile.value = e.target.files[0];
  let subpath = "06_Case/" + props.caseID;
  let newName = "";
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "itemLrReportUpload":
      newName = "01_LrReport" + path.extname(e.target.value);
      break;
    case "itemPOSReportUpload":
      newName = "02_POSReport" + path.extname(e.target.value);
      break;
    case "itemLrPlanUpload":
      newName = "03_LrPlan" + path.extname(e.target.value);
      break;
    case "FlyMapAcUpload":
      newName = "04_FlyMapAc" + path.extname(e.target.value);
      break;
    case "RecTableUpload":
      newName = "05_RecForm" + path.extname(e.target.value);
      break;
    case "OtherUpload":
      newName = "06_Other" + path.extname(e.target.value);
      break;
    case "ptCloudUpload":
      subpath = subpath + "/CloudPt"
      newName = data1.value[upPtIndex.value].gcp_id + path.extname(e.target.value);
      await ptCloudAvg(upFile.value,upPtIndex.value);
      break;
    case "ReportEditUpload":
      newName = props.caseID + path.extname(e.target.value)
      break;
    case "ReportScanUpload":
      newName = "17_ReportScan" + path.extname(e.target.value);
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
    case "itemLrReportUpload":
      nowCaseLrReport.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "itemPOSReportUpload":
      nowCasePosReport.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "itemLrPlanUpload":
      nowCasePlanMap.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "FlyMapAcUpload":
      nowCaseFlyMapAc.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "RecTableUpload":
      nowCaseRecTable.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "OtherUpload":
      nowCaseOther.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "ptCloudUpload":
      saveRecord02();
      break;
    case "ReportEditUpload":
      nowCaseReportEdit.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
    case "ReportScanUpload":
      nowCaseReportScan.value = result.data.uploadFile.filename;
      saveRecord02();
      break;
  }
  let inputDOM;
  inputDOM = document.getElementById("AllUpload");
  inputDOM.value = "";
});
uploadFileonError(e=>{errorHandle(e,infomsg,alert1)});
//#endregion 檔案上傳==========End

//#region 呼叫計算不確定度=======Start
// 取得不確定度列表
const {
  mutate: getUcList,
  onDone: getUcListOnDone,
  onError: getUcListError,
} = useMutation(CaseGQL.GETUCLIST, () => ({
  variables: {
    caltypecode: nowCaseCalTypeCode.value,
    refprjcode: nowCaseRefPrjCode.value,
  },
}));
getUcListOnDone((result) => {
  // 填入uclist選單
  if (!result.loading && result.data.getUclist) {  
    let myArray = [];
    result.data.getUclist.forEach((x) => {
      if(isFullPara.value && (x.indexOf("_A")>-1)){
        myArray.push({ text: x, value: x });
      }else if(!isFullPara.value && (x.indexOf("_B")>-1)){
        myArray.push({ text: x, value: x });
      }
    });
    myArray.unshift({text: "-未選取-", value: '-1'})
    nowCaseUcModelMU.value = myArray;
  }
});
getUcListError(e=>{errorHandle(e,infomsg,alert1)});

function reloadUcMU(){
  let oldselect = selectUcModel.value;
  getUcList().then(res=>{
    selectUcModel.value = oldselect;
  });
}

// 計算不確定度(return 不確定度H V、有效位置及計算表)
const pramJsonStr = ref("");

function computeUcBtn(){
  let calResult = nowCaseCalResult.value;
  let pramJson = {
    lrdis: nowCaseLrDisPrs.value, // LiDAR規格測距精度(mm)
    lrbeam: nowCaseLrBeam.value, // LiDAR規格雷射擴散角(秒)
    lrang: nowCaseLrAngResol.value, // LiDAR規格掃描角解析度(秒)
    posH: nowCaseGnssPrcH.value, // POS規格平面精度(mm)
    posV: nowCaseGnssPrcV.value, // POS規格高程精度(mm)
    posOmg: nowCaseImuOmg.value, // POS規格Omega精度(秒)
    posPhi: nowCaseImuPhi.value, // POS規格Phi精度(秒)
    posKap: nowCaseImuKap.value, // POS規格Kappa精度(秒)
    posOri: nowCaseImuPrcO.value, // POS測角解析度(秒)
    agl: nowCaseAGLac.value, // 飛行離地高(m)
    fov: nowCaseFOVac.value, // 最大掃描角(度)FOV
    minpt: calResult.minCloudPt, // 最少點雲數
    maxpt: calResult.maxCloudPt, // 最多點雲數
  };
  pramJsonStr.value = JSON.stringify(pramJson);
  computeUc();
}

const {
  mutate: computeUc,
  onDone: computeUcOnDone,
  onError: computeUcError,
} = useMutation(CaseGQL.COMPUTEUC, () => ({
  variables: {
    parm: pramJsonStr.value,
    ucModel: selectUcModel.value,
  },
}));
computeUcOnDone((result) => {
  // console.log(result.data.computeUc);
  if (!result.loading && result.data.computeUc) {
    nowCaseUcResult.value = result.data.computeUc;
    nowCaseSTDh.value = result.data.computeUc.fixUcH;
    nowCaseSTDv.value = result.data.computeUc.fixUcV;
    nowCaseKh.value = result.data.computeUc.tinvH.toFixed(2);
    nowCaseKv.value = result.data.computeUc.tinvV.toFixed(2);
    // console.log(nowCaseUcResult.value);
    saveRecord02();
  }
});
computeUcError(e=>{errorHandle(e,infomsg,alert1)});

//#endregion 呼叫計算不確定度=======End

//#region 量測作業表格==========Start
let dt1;
const table1 = ref();
const data1 = ref([]);
const columns1 = [
  { title: "序號", render: (data, type, row, meta) => { return meta.row; },width:"1rem" },
  { title: "量測資料", render: (data, type, row, meta) => { 
      if (row.type==='T'){
        return '<span class="btn btn-primary btn-sm ripple-surface uploadCP">上傳</span>' 
      }else if(row.type==='F'){
        return '<span class="btn btn-primary btn-sm ripple-surface btnDisabled">上傳</span>' 
      }
      
    },width:"1rem" 
  },
  { title: "剔除", data: "type", render: (data, type, row, meta) => {
      if(data==='T'){
        return '<span style="cursor: pointer;" class="deltype text-success"><i class="fas fa-lg fa-check-circle"></i>使用</span>'
      }else if(data==='F'){
        return '<span style="cursor: pointer;" class="deltype text-danger"><i class="fas fa-lg fa-times-circle"></i>剔除</span>'
      }
    },width:"1rem"},
  { title: "點號", data: "gcp_id" },
  { title: "註記", data: "memo",render: (data, type, row, meta) => {
      if(row.type==='F'){
        return '<input class="editDt" type="text" value="'+data+'"/>'
      }else if(row.type==='T'){
        return data;
      }
    },width:"5rem" 
  },
  { title: "E_mes", data: "meas_E", className: 'dt-right' },
  { title: "N_mes", data: "meas_N", className: 'dt-right' },
  { title: "h_mes", data: "meas_h", className: 'dt-right' },
  { title: "點雲個數", data: "count", className: 'dt-right' },
  { title: "E_ref", data: "coor_E", className: 'dt-right' },
  { title: "N_ref", data: "coor_N", className: 'dt-right' },
  { title: "h_ref", data: "coor_h", className: 'dt-right' },
  { title: "dE", data: "d_E", className: 'dt-right' },
  { title: "dN", data: "d_N", className: 'dt-right' },
  { title: "dh", data: "d_h", className: 'dt-right' },
];

const tboption1 = {
  dom: 'ti',
  // select: { style: 'single', info: false },
  order: [[0, 'asc']],
  scrollY: '15vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// 加載表格選取事件
function onChangeStep() {
  updateKey.value += 1;
}
const setpFlag = ref(1);
const upPtIndex = ref("");
function loadtable(index){
  if(index===3 && setpFlag.value!==index){
    dt1 = table1.value.dt();
    dt1.off('click', '.uploadCP');
    dt1.on('click', '.uploadCP', function (e) {
      upPtIndex.value = parseInt(e.target.parentElement.previousSibling.innerText);
      uploadBtn("ptCloudUpload");
      e.stopPropagation()
    });
    dt1.on('click', '.deltype', function (e) {
      upPtIndex.value = parseInt(e.currentTarget.parentElement.previousSibling.previousSibling.innerText);
      if(data1.value[upPtIndex.value].type==='T'){
        // 剔除點位
        data1.value[upPtIndex.value].type='F';
      }else{
        // 使用點位
        data1.value[upPtIndex.value].type='T';
        data1.value[upPtIndex.value].memo='';
      }
      data1ToCalResult();

      nowCaseSTDh.value="";
      nowCaseSTDv.value="";
      nowCaseKh.value="";
      nowCaseKv.value="";
      nowCaseUcResult.value=null;

      e.stopPropagation()
    });
    dt1.on('change', '.editDt', function (e) {
      upPtIndex.value = parseInt(e.currentTarget.parentElement.parentElement.firstChild.innerText);
      data1.value[upPtIndex.value].memo=e.target.value;
      data1ToCalResult();
    });
  }
  setpFlag.value = index;
}

// 計算成果匯入表格
function calResultToData1(){
  if(!nowCaseCalResult.value){
    // console.log("[]");
    return []
  }
  // console.log("calResultToData1");
  let calTable = nowCaseCalResult.value;
  let myArray = [];
  for(let key in calTable.data){
    // if(calTable.data[key].type==='T'){
      myArray.push({
        gcp_id: key,
        type: calTable.data[key].type,
        coor_E: calTable.data[key].sx,
        coor_N: calTable.data[key].sy,
        coor_h: calTable.data[key].sz,
        meas_E: calTable.data[key].x,
        meas_N: calTable.data[key].y,
        meas_h: calTable.data[key].z,
        count: calTable.data[key].count,
        d_E: calTable.data[key].dx,
        d_N: calTable.data[key].dy,
        d_h: calTable.data[key].dz,
        memo: calTable.data[key].memo,
      })
    // }
  }

  myArray.sort((a,b)=>{
    return (a.gcp_id > b.gcp_id)?1:-1;
  })
  return myArray;
}

function data1ToCalResult(){
  let myCalResult={};
  let pt_Data = {};
  let rmseE = 0.0;
  let rmseN = 0.0;
  let rmseV = 0.0;
  let minPt = 0;
  let maxPt = 0;
  let pt_Used = 0;
  let pt_Total = data1.value.length;
  for(let i=0; i < pt_Total ; i++){
    let pt_Name = data1.value[i].gcp_id;
    pt_Data[pt_Name]={
      type: data1.value[i].type,
      sx: data1.value[i].coor_E,
      sy: data1.value[i].coor_N,
      sz: data1.value[i].coor_h,
      x: data1.value[i].meas_E,
      y: data1.value[i].meas_N,
      z: data1.value[i].meas_h,
      count: data1.value[i].count,
      dx: data1.value[i].d_E,
      dy: data1.value[i].d_N,
      dz: data1.value[i].d_h,
      memo: data1.value[i].memo,
    }

    if(data1.value[i].type==="T"){
      rmseE = rmseE + parseFloat(data1.value[i].d_E)**2;
      rmseN = rmseN + parseFloat(data1.value[i].d_N)**2;
      rmseV = rmseV + parseFloat(data1.value[i].d_h)**2;
      if(pt_Used===0){
        minPt = data1.value[i].count;
        maxPt = data1.value[i].count;
      }else{
        (data1.value[i].count < minPt)?minPt = data1.value[i].count:minPt = minPt;
        (data1.value[i].count > maxPt)?maxPt = data1.value[i].count:maxPt = maxPt;
      }
      pt_Used = pt_Used + 1;
    }
  }
  if(pt_Used > 0){
    rmseE = (rmseE/pt_Used)**0.5;
    rmseN = (rmseN/pt_Used)**0.5;
    myCalResult.rmseH = ((rmseE**2 + rmseE**2)**0.5)*1000;
    myCalResult.rmseV = ((rmseV/pt_Used)**0.5)*1000;
    myCalResult.minCloudPt = minPt;
    myCalResult.maxCloudPt = maxPt;
  }
  myCalResult.ptUsed = pt_Used;
  myCalResult.ptUsed = pt_Used;
  myCalResult.ptTotal = pt_Total;
  myCalResult.ptDel = pt_Total - pt_Used;
  myCalResult.data = pt_Data;
  // console.log(myCalResult);
  // console.log(selectUcModel.value);
  nowCaseCalResult.value = myCalResult;
}

async function ptCloudAvg(POfile, ptIndex) {
  if (POfile) {
    let pt_x = 0.0;
    let pt_y = 0.0;
    let pt_z = 0.0;
    let pt_count = 0;
    //確認有檔案存在
    //建立檔案讀取器
    const fReader = new FileReader();

    fReader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        // 全文件轉換成行
        let allTextLines = evt.target.result.split(/\r\n|\n/);
        // 逐行解析
        let i = 0;
        let ptData = [];
        let lineString = "";
        do {
          // 計算平均
          lineString = allTextLines[i].trim();
          if (lineString !== "") {
            // 有效資料
            pt_count = pt_count + 1;
            ptData = lineString.split(" ");
            pt_x = pt_x + parseFloat(ptData[0]);
            pt_y = pt_y + parseFloat(ptData[1]);
            pt_z = pt_z + parseFloat(ptData[2]);
          }
          i = i + 1;
        } while (i < allTextLines.length);
        if(pt_count > 0){
          let x_avg = pt_x / pt_count;
          let y_avg = pt_y / pt_count;
          let z_avg = pt_z / pt_count;
          data1.value[ptIndex].meas_E = parseFloat(x_avg.toFixed(3));
          data1.value[ptIndex].meas_N = parseFloat(y_avg.toFixed(3));
          data1.value[ptIndex].meas_h = parseFloat(z_avg.toFixed(3));
          data1.value[ptIndex].count = pt_count;
          // console.log(data1.value);
          data1.value[ptIndex].d_E = parseFloat((x_avg - parseFloat(data1.value[ptIndex].coor_E)).toFixed(3));
          data1.value[ptIndex].d_N = parseFloat((y_avg - parseFloat(data1.value[ptIndex].coor_N)).toFixed(3));
          data1.value[ptIndex].d_h = parseFloat((z_avg - parseFloat(data1.value[ptIndex].coor_h)).toFixed(3));

          data1ToCalResult();
          
          nowCaseSTDh.value="";
          nowCaseSTDv.value="";
          nowCaseKh.value="";
          nowCaseKv.value="";
          nowCaseUcResult.value=null;

        }
      }
    }
    //真正執行以文字方式載入檔案
    fReader.readAsText(POfile);
  }
}

//#endregion 量測作業表格==========End

//#region 產生報告==========Start
const pramRptStr = ref("");
// 按鈕觸發動作
function buildReportBtn() {
  // 查詢報告資料=>載入時已查詢
  // 填入參數
  let parms = {};

  let CompleteDateAy = nowCaseCompleteDate.value.split("-");
  parms.nowCaseCompleteDateY = (parseInt(CompleteDateAy[0]) - 1911).toString();
  parms.nowCaseCompleteDateM = CompleteDateAy[1];
  parms.nowCaseCompleteDateD = CompleteDateAy[2];
  parms.nowCaseID = props.caseID;
  parms.nowCaseFullID = nowCaseCalTypeCode.value + props.caseID;
  parms.nowCaseItemChop = nowCaseItemChop.value;
  parms.nowCaseItemModel = nowCaseItemModel.value;
  parms.nowCaseItemSN = nowCaseItemSN.value;
  parms.nowCaseTitle = nowCaseTitle.value;
  parms.nowCaseAddress = nowCaseAddress.value;

  let nowCaseRecDateAy = nowCaseRecDate.value.split("-");
  parms.nowCaseRecDateY = (parseInt(nowCaseRecDateAy[0]) - 1911).toString();
  parms.nowCaseRecDateM = nowCaseRecDateAy[1];
  parms.nowCaseRecDateD = nowCaseRecDateAy[2];

  let nowCaseFlyDateAy = nowCaseFlyDate.value.split("-");
  parms.nowCaseFlyDateY = (parseInt(nowCaseFlyDateAy[0]) - 1911).toString();
  parms.nowCaseFlyDateM = nowCaseFlyDateAy[1];
  parms.nowCaseFlyDateD = nowCaseFlyDateAy[2];

  parms.nowCaseRefPrjCode = nowCaseRefPrjCode.value;
  let prjPubDateAy = nowCaseRefPrjPublishDate.value.split("-");
  parms.nowCaseRefPrjPublishDateY = (parseInt(prjPubDateAy[0]) - 1911).toString();
  parms.nowCaseRefPrjPublishDateM = prjPubDateAy[1];
  parms.nowCaseRefPrjPublishDateD = prjPubDateAy[2];

  let calTable = nowCaseCalResult.value;
  // console.log("calTable",calTable);
  let ucTable = nowCaseUcResult.value;
  // console.log("ucTable",ucTable);

  let defVerH = [];
  let defVerV = [];
  let fixDigPosH = parseInt(ucTable.digPosH);
  let fixDigPosV = parseInt(ucTable.digPosV);

  for (let key in calTable.data) {
    if (calTable.data[key].type === 'T') {
      defVerH.push({
        ptName: key,
        dx: fixDataDigPos(calTable.data[key].dx * 1000, fixDigPosH),
        dy: fixDataDigPos(calTable.data[key].dy * 1000, fixDigPosH),
        dxy: fixDataDigPos(((calTable.data[key].dx ** 2 + calTable.data[key].dy ** 2) ** 0.5) * 1000, fixDigPosH),
        fixUcH: ucTable.fixUcH
      });

      defVerV.push({
        ptName: key,
        dz: fixDataDigPos(calTable.data[key].dz * 1000, fixDigPosV),
        fixUcV: ucTable.fixUcV
      });
    }
  }

  defVerH.sort((a, b) => { (a.pt_name > b.pt_name) ? 1 : -1 });
  defVerV.sort((a, b) => { (a.pt_name > b.pt_name) ? 1 : -1 });

  for (let i = 0; i < defVerH.length; i++) {
    defVerH[i].index = i + 1;
    defVerV[i].index = i + 1;
  }

  parms.defVerH = defVerH;
  parms.defVerV = defVerV;

  parms.nowCaseChkNo = calTable.ptUsed;

  parms.nowCaseRmseH = fixDataDigPos(parseFloat(calTable.rmseH), parseInt(ucTable.digPosH));
  parms.nowCaseRmseV = fixDataDigPos(parseFloat(calTable.rmseV), parseInt(ucTable.digPosV));

  parms.nowCaseLrDisPrs = nowCaseLrDisPrs.value;
  parms.nowCaseLrAngResol = nowCaseLrAngResol.value;
  parms.nowCaseLrBeam = nowCaseLrBeam.value;

  parms.nowCaseGnssChop =  nowCaseGnssChop.value;
  parms.nowCaseGnssModel =  nowCaseGnssModel.value;
  parms.nowCaseGnssSN =  nowCaseGnssSN.value;
  parms.nowCaseGnssPrcH =  nowCaseGnssPrcH.value;
  parms.nowCaseGnssPrcV =  nowCaseGnssPrcV.value;

  parms.nowCaseImuChop =  nowCaseImuChop.value;
  parms.nowCaseImuModel =  nowCaseImuModel.value;
  parms.nowCaseImuSN =  nowCaseImuSN.value;
  parms.nowCaseImuOmg =  nowCaseImuOmg.value;
  parms.nowCaseImuPhi =  nowCaseImuPhi.value;
  parms.nowCaseImuKap =  nowCaseImuKap.value;
  parms.nowCaseImuPrcO =  nowCaseImuPrcO.value;

  parms.nowCaseEllHac = nowCaseEllHac.value;
  parms.nowCaseAGLac = nowCaseAGLac.value;
  parms.nowCaseStripsAc = nowCaseStripsAc.value;
  parms.nowCasePtDensity = nowCasePtDensity.value;
  parms.nowCaseFOV =  nowCaseFOV.value;

  parms.nowCaseKh = nowCaseKh.value;
  parms.nowCaseKv = nowCaseKv.value;
  parms.confLevel = (ucTable.confLevel * 100).toFixed(0);

  let eqData = [];
  let eqptCount = 0;
  nowCaseRefEqpt.value.forEach((x, i) => {
    let chkDateArray = (x.ref_eqpt_check.check_date.split("T")[0]).split("-");
    eqptCount = eqptCount + 1;
    eqData.push({
      index: eqptCount,
      itemChop: x.ref_eqpt_check.ref_eqpt.chop,
      itemModel: x.ref_eqpt_check.ref_eqpt.model,
      itemSN: x.ref_eqpt_check.ref_eqpt.serial_number,
      rptID: x.ref_eqpt_check.report_id,
      chkDate: (chkDateArray[0] - 1911) + "/" + chkDateArray[1] + "/" + chkDateArray[2],
      ferq: x.ref_eqpt_check.ref_eqpt.cal_cycle,
      org: x.ref_eqpt_check.cal_org + "(" + x.ref_eqpt_check.cal_org_id + ")"
    })
  });

  parms.eqData = eqData;
  
  pramRptStr.value = JSON.stringify(parms);
  buildRpt();
}

// 對資料作有效位數修整
function fixDataDigPos(data, pos) {
  // 四捨五入
  return Math.round(data / 10 ** pos) * 10 ** pos;
  ;
}

// 產生報告動作發送
const {
  mutate: buildRpt,
  onDone: buildRptOnDone,
  onError: buildRptError,
} = useMutation(CaseGQL.BUILDREPORT01, () => ({
  variables: {
    parm: pramRptStr.value,
    reportSample: selectReportTemp.value,
  },
}));
buildRptOnDone(result => {
  // 報告產生完成
  // 回填編輯檔欄位
  nowCaseReportEdit.value = result.data.buildReport01;
  // 儲存Record02
  saveRecord02().then(res=>{
    // 觸發下載編輯檔
    let btnDOM = document.getElementById("ReportEditDownload");
    btnDOM.click();
  });
});
buildRptError(e=>{errorHandle(e,infomsg,alert1)});

// 取得報告範本列表
const {
  mutate: getRptList,
  onDone: getRptListOnDone,
  onError: getRptListError,
} = useMutation(CaseGQL.GETRPTLIST, () => ({
  variables: {
    caltypecode: nowCaseCalTypeCode.value,
  },
}));
getRptListOnDone((result) => {
  // 填入rptlist選單
  if (!result.loading && result.data.getRptlist) {
    nowCaseReportTempMU.value = result.data.getRptlist.map((x) => {
      return { text: x, value: x };
    });nowCaseReportTempMU.value.unshift({text: "-未選取-", value: '-1'})
  }
});
getRptListError(e=>{errorHandle(e,infomsg,alert1)});

//#endregion 產生報告==========End

getchecktoken().then(res=>{
  refgetNowCaseF();
  refgetAllSignPson();
  refgetAllChkPson();

}).catch(e=>{
  errorHandle(e,infomsg,alert1);
});

defineExpose({
  saveRecord02,
});

</script>
<template>
  <div class="h-100 overflow-auto">
    <input type="file" id="AllUpload" @change="uploadChenge($event)" style="display: none" />
    <!-- 選擇校正件 -->
    <MDBModal @shown="shownItemModal" v-model="showItemFrom" staticBackdrop scrollable>
      <MDBModalHeader>
        <MDBModalTitle>請選擇校正件</MDBModalTitle>
      </MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <!-- 校正件列表 -->
            <MDBCol col="12">
              <DataTable :data=" dataItem" :columns="columnsItem" :options="tboptionItem" ref="tableItem"
                style="font-size: smaller" class="display w-100 compact" />
            </MDBCol>
            <!-- 編輯 -->
            <MDBCol col="12" class="border border-1">
              <!-- 功能列 -->
              <div class="mt-2">
                <MDBBtn size="sm" color="primary" @click="saveItem">儲存</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="gotoItemMG">校正件管理</MDBBtn>
              </div>
              <MDBRow>
                <MDBSelect filter size="sm" class="my-3  col-6" label="儀器類型" v-model:options="selItemTypeMU"
                  v-model:selected="selItemTypeID" ref="selItemTypeDOM" />
                <MDBCol col="6" class="my-3 fs-6">
                  目前:{{ seletItemId }}
                </MDBCol>
                <!-- <div></div> -->
                <MDBCol col="6" class="mb-2">
                  <MDBInput size="sm" type="text" label="廠牌" v-model="selItemChop" />
                </MDBCol>
                <MDBCol col="6" class="mb-2">
                  <MDBInput size="sm" type="text" label="型號" v-model="selItemModel" />
                </MDBCol>
                <MDBCol col="12" class="mb-2">
                  <MDBInput size="sm" type="text" label="序號" v-model="selItemSN" />
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="primary" @click="setItemBtn">加入</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <!-- 選擇參考值量測作業 -->
    <MDBModal @shown="shownPrjModal" v-model="showPrjFrom" staticBackdrop scrollable>
      <MDBModalHeader>
        <MDBModalTitle>請選擇參考值量測作業</MDBModalTitle>
      </MDBModalHeader>
      <MDBModalBody>
        <MDBContainer fluid>
          <MDBRow>
            <!-- 量測作業列表 -->
            <MDBCol col="12">
              <DataTable :data=" dataPrj" :columns="columnsPrj" :options="tboptionPrj" ref="tablePrj"
                style="font-size: smaller" class="display w-100 compact" />
            </MDBCol>
            <!-- 篩選 或 編輯 -->
            <MDBCol col="12" class="border border-1">
              <MDBTabs v-model="prjTabId">
                <MDBTabNav tabsClasses="">
                  <MDBTabItem tabId="prjFilter" href="prjFilter">條件篩選</MDBTabItem>
                </MDBTabNav>
                <MDBTabContent>
                  <!-- 篩選表單 -->
                  <MDBTabPane tabId="prjFilter">
                    <!-- 功能列 -->
                    <div class="mt-2">
                      <MDBBtn size="sm" color="primary" @click="doPrjFilter">篩選</MDBBtn>
                      <MDBBtn size="sm" color="primary" @click="clearPrjFilter">清除</MDBBtn>
                      <MDBBtn size="sm" color="primary" @click="gotoPrjMG">量測作業管理</MDBBtn>
                    </div>
                    <!-- 條件欄位 -->
                    <MDBRow>
                      <MDBCol col="6" class="mb-2">
                        目前：{{seletPrjID}}-{{seletPrjCode}}
                      </MDBCol>
                      <MDBCol col="6" class="mb-2">
                        <MDBInput size="sm" type="text" label="作業編號" v-model="filterPrjCode" />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="6" class="mb-3">
                        <MDBDatepicker 
                          size="sm" 
                          v-model="filterPrjPubDateStart" 
                          format="YYYY-MM-DD" label="發布日(起)"
                          :monthsFull = "monthsFull"
                          :monthsShort = "monthsShort"
                          :weekdaysFull = "weekdaysFull"
                          :weekdaysShort = "weekdaysShort"
                          :weekdaysNarrow = "weekdaysNarrow"
                          confirmDateOnSelect
                          removeCancelBtn
                          removeOkBtn
                          ref="filterPrjPubDateStartDOM" />
                      </MDBCol>
                      <MDBCol col="6" class="mb-3">
                        <MDBDatepicker 
                          size="sm" 
                          v-model="filterPrjPubDateEnd" 
                          format="YYYY-MM-DD" label="發布日(迄)"
                          :monthsFull = "monthsFull"
                          :monthsShort = "monthsShort"
                          :weekdaysFull = "weekdaysFull"
                          :weekdaysShort = "weekdaysShort"
                          :weekdaysNarrow = "weekdaysNarrow"
                          confirmDateOnSelect
                          removeCancelBtn
                          removeOkBtn
                          ref="filterPrjPubDateEndDOM" />
                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
                </MDBTabContent>
              </MDBTabs>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="primary" @click="setPrjBtn">加入</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <!-- record02表單 -->
    <MDBStepper linear @onChangeStep="onChangeStep">
      <MDBStepperForm>
        <MDBStepperStep active @click="loadtable(1)">
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="12" class="mt-3 rounded-top-5 bg-info text-white">
                校正件
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="showItemFromBtn(2)">查詢校正件</MDBBtn>
                    <RouterLink target="_blank" :to="{ path: '/sicltab01' ,query:{ caseID: props.caseID }}">
                      <MDBBtn size="sm" color="primary">
                        列印管理表
                      </MDBBtn>
                    </RouterLink>
                    <RouterLink target="_blank" :to="{ path: '/sicltab04' ,query:{ caseID: props.caseID }}">
                      <MDBBtn size="sm" color="primary">列印申請單</MDBBtn>
                    </RouterLink>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="廠牌" v-model="nowCaseItemChop" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="型號" v-model="nowCaseItemModel" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="序號" v-model="nowCaseItemSN" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="my-2">
                <MDBSwitch :disabled="!rGroup[2]" :label="switchLabel" v-model="isFullPara" @change="reloadUcMU" />
              </MDBCol>
              <MDBCol v-show="isFullPara">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    各項參數
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                    <MDBRow>
                      <MDBCol col="12" class="mb-3">
                        LiDAR規格
                      </MDBCol>
                      <div></div>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="雷射測距精度(mm)"
                          v-model="nowCaseLrDisPrs" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='掃描角解析度Resolution(")'
                          v-model="nowCaseLrAngResol" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='掃描發散角Beam(")'
                          v-model="nowCaseLrBeam" />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="12" class="mb-3">
                        <MDBRow>
                          <MDBCol col="4">GNSS規格</MDBCol>
                          <MDBCol col="8">
                            <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="showItemFromBtn(3)">查詢GNSS
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <div></div>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="廠牌" v-model="nowCaseGnssChop" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="型號" v-model="nowCaseGnssModel" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="序號" v-model="nowCaseGnssSN" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="平面定位精度(mm)"
                          v-model="nowCaseGnssPrcH" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="高程定位精度(mm)"
                          v-model="nowCaseGnssPrcV" />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="12" class="mb-3">
                        <MDBRow>
                          <MDBCol col="4">IMU規格</MDBCol>
                          <MDBCol col="8">
                            <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="showItemFromBtn(4)">查詢GNSS
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <div></div>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="廠牌" v-model="nowCaseImuChop" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="型號" v-model="nowCaseImuModel" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput disabled size="sm" type="text" label="序號" v-model="nowCaseImuSN" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='Omega精度(")'
                          v-model="nowCaseImuOmg" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='Phi精度(")'
                          v-model="nowCaseImuPhi" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='Kappa精度(")'
                          v-model="nowCaseImuKap" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label='姿態角解析度(")'
                          v-model="nowCaseImuPrcO" />
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol v-show="!isFullPara">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    整合精度
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                    <MDBRow>
                      <MDBCol col="4" class="my-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="平面定位精度(mm)"
                          v-model="nowCaseGnssPrcH" />
                      </MDBCol>
                      <MDBCol col="4" class="my-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="高程定位精度(mm)"
                          v-model="nowCaseGnssPrcV" />
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                飛航規劃
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="預定拍攝年(民國)" v-model="nowCasePlanY" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="預定拍攝月" v-model="nowCasePlanM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="航帶總數" v-model="nowCaseStrips" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="飛航橢球高" v-model="nowCaseEllH" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="飛航離地高(AGL)" v-model="nowCaseAGL" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red;" class="border border-1 border-danger">※AGL = 橢球高 - 195 m</div>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="點雲密度" v-model="nowCasePtDensity" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="FOV" v-model="nowCaseFOV" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <!-- 光達規格 -->
                  <MDBCol col="9" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text"
                      label="光達規格" v-model="nowCaseLrReport">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseLrReport =''"
                        class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('itemLrReportUpload')">上傳
                    </MDBBtn>
                    <MDBBtn tag="a" target=_blank size="sm" :href="nowCaseLrReportDL" download color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- POS規格 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text"
                      label="POS規格" v-model="nowCasePosReport">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCasePosReport =''"
                        class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('itemPOSReportUpload')">
                      上傳</MDBBtn>
                    <MDBBtn tag="a" target=_blank size="sm" :href="nowCasePosReportDL" download color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 規劃圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text"
                      label="航線規劃圖" v-model="nowCasePlanMap">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCasePlanMap =''"
                        class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('itemLrPlanUpload')">上傳
                    </MDBBtn>
                    <MDBBtn tag="a" target=_blank size="sm" :href="nowCasePlanMapDL" download color="secondary">下載</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep @click="loadtable(2)">
          <MDBStepperHead icon="2">
            送校
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker 
                  required size="sm" 
                  v-model="nowCaseRecDate" 
                  format="YYYY-MM-DD" label="送件日"
                  :monthsFull = "monthsFull"
                  :monthsShort = "monthsShort"
                  :weekdaysFull = "weekdaysFull"
                  :weekdaysShort = "weekdaysShort"
                  :weekdaysNarrow = "weekdaysNarrow"
                  confirmDateOnSelect
                  removeCancelBtn
                  removeOkBtn
                  ref="nowCaseRecDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                掃描資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBDatepicker 
                      required size="sm" 
                      v-model="nowCaseFlyDate" 
                      format="YYYY-MM-DD " label="掃描日"
                      :monthsFull = "monthsFull"
                      :monthsShort = "monthsShort"
                      :weekdaysFull = "weekdaysFull"
                      :weekdaysShort = "weekdaysShort"
                      :weekdaysNarrow = "weekdaysNarrow"
                      confirmDateOnSelect
                      removeCancelBtn
                      removeOkBtn
                      ref="nowCaseFlyDateDOM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="航帶總數(條)"
                      v-model="nowCaseStripsAc" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="實際橢球高(m)"
                      v-model="nowCaseEllHac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="實際離地高AGL(m)"
                      v-model="nowCaseAGLac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red" class="border border-1 border-danger">
                      ※AGL = 橢球高 - 195 m
                    </div>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="單航帶點雲密度(pt/m2)"
                      v-model="nowCasePtDensityac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="最大掃描角FOV(°)"
                      v-model="nowCaseFOVac" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <!-- 航線圖 -->
                  <MDBCol col="9" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                      label="實際航線圖" v-model="nowCaseFlyMapAc">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseFlyMapAc = ''"
                        class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('FlyMapAcUpload')">上傳
                    </MDBBtn>
                    <MDBBtn tag="a" target=_blank :href="nowCaseFlyMapAcDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <!-- 掃描紀錄表 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                      label="航拍紀錄表" v-model="nowCaseRecTable">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseRecTable = ''"
                        class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('RecTableUpload')">上傳
                    </MDBBtn>
                    <MDBBtn tag="a" target=_blank :href="nowCaseRecTableDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="點雲檔案數" v-model="nowCaseLASNo" />
                  </MDBCol>
                  <div></div>
                  <!-- 設備佐證照片 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                      label="設備佐證照片" v-model="nowCaseOther">
                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseOther = ''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('OtherUpload')">上傳
                    </MDBBtn>
                    <MDBBtn tag="a" target=_blank :href="nowCaseOtherDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                異常註記
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBTextarea :disabled="!rGroup[2]" size="sm" label="文件異常註記" rows="2" v-model="nowCaseErrData" />
                  </MDBCol>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea :disabled="!rGroup[2]" size="sm" label="點雲異常註記" rows="2" v-model="nowCaseErrLAS" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep @click="loadtable(3)">
          <MDBStepperHead icon="3">
            校正
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker 
                  required size="sm" 
                  v-model="nowCaseStartDate" 
                  format="YYYY-MM-DD" label="校正開始日"
                  :monthsFull = "monthsFull"
                  :monthsShort = "monthsShort"
                  :weekdaysFull = "weekdaysFull"
                  :weekdaysShort = "weekdaysShort"
                  :weekdaysNarrow = "weekdaysNarrow"
                  confirmDateOnSelect
                  removeCancelBtn
                  removeOkBtn
                  ref="nowCaseStartDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                參考值
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click.stop="showPrjFrom = true">查詢量測作業</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="量測作業編號"
                      v-model="nowCaseRefPrjCode" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="發布日期"
                      v-model="nowCaseRefPrjPublishDate" />
                  </MDBCol>
                  <!-- 參考值選單 -->
                  <SelectUc ref="selectUcObj" />
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                量測紀錄
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="mb-3">
                    <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1"
                      style="font-size: smaller" class="display w-100 compact"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                作業紀錄
              </MDBCol>
              <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn :disabled="!rGroup[2] || !isCalResult || !selectUcModel || selectUcModel==='-1'" size="sm" color="primary" @click.stop="computeUcBtn">
                      計算不確定度
                    </MDBBtn>
                    <MDBBtn :disabled="!rGroup[2] || !isCalResult" size="sm" color="primary">
                      <RouterLink target="_blank" :to="{
                        path: '/sicltab09',
                        query: { caseID: props.caseID },
                      }">
                        <span class="btn-primary text-white">列印計算成果</span>
                      </RouterLink>
                    </MDBBtn>
                    <MDBBtn :disabled="!rGroup[2] || !nowCaseUcResult" size="sm" color="primary">
                      <RouterLink target="_blank" :to="{
                        path: '/sicltab06',
                        query: { caseID: props.caseID },
                      }">
                        <span class="btn-primary text-white">列印不確定度計算表</span>
                      </RouterLink>
                    </MDBBtn>
                  </MDBCol>
                  <div></div>

                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="水平不確定度(mm)"
                      v-model="nowCaseSTDh" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="高程不確定度(mm)"
                      v-model="nowCaseSTDv" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="水平涵蓋因子"
                      v-model="nowCaseKh" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="高程涵蓋因子"
                      v-model="nowCaseKv" />
                  </MDBCol>
                  <!-- 產生作業紀錄表 -->
                  <MDBCol col="12" class="mb-3">
                    <MDBBtn size="sm" color="primary">
                      <RouterLink target="_blank" :to="{
                        path: '/sicltab10',
                        query: { caseID: props.caseID },
                      }">
                        <span class="btn-primary text-white">列印作業紀錄表</span>
                      </RouterLink>
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>

            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep @click="loadtable(4)">
          <MDBStepperHead icon="4">
            出具報告
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="6">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    報告設定
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                    <MDBRow>
                      <MDBCol col="12" class="my-3">
                        <MDBSwitch label="具TAF-LOGO" v-model="nowCaseHasLOGO" />
                      </MDBCol>
                      <!-- 選擇報告範本 -->
                      <SelectRptTemp ref="selectReportObj" />
                      <MDBCol lg="6" class="mb-3">
                        <MDBDatepicker 
                          required size="sm" 
                          v-model="nowCaseCompleteDate" 
                          format="YYYY-MM-DD" label="報告完成日"
                          :monthsFull = "monthsFull"
                          :monthsShort = "monthsShort"
                          :weekdaysFull = "weekdaysFull"
                          :weekdaysShort = "weekdaysShort"
                          :weekdaysNarrow = "weekdaysNarrow"
                          confirmDateOnSelect
                          removeCancelBtn
                          removeOkBtn 
                          ref="nowCaseCompleteDateDOM" />
                      </MDBCol>

                      <MDBCol col="12" class="mb-3">
                        <MDBBtn :disabled="!rGroup[2] || !selectReportTemp || selectReportTemp==='-1' || !nowCaseCompleteDate" size="sm" color="secondary" @click.stop="buildReportBtn()">產生報告
                        </MDBBtn>
                      </MDBCol>

                      <!-- 報告編輯檔 -->
                      <MDBCol col="8" class="mb-3">
                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                          label="報告編輯檔" v-model="nowCaseReportEdit">
                          <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseReportEdit = ''"
                            class="btn-upload-close" />
                        </MDBInput>
                      </MDBCol>
                      <MDBCol col="3" class="px-0 mb-3">
                        <input type="file" id="ReportEditUpload" @change="" style="display: none" />
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click.stop="uploadBtn('ReportEditUpload')">
                          上傳</MDBBtn>
                        <MDBBtn id="ReportEditDownload" tag="a" target=_blank :href="nowCaseReportEditDL" download size="sm"
                          color="secondary">下載</MDBBtn>
                      </MDBCol>

                    </MDBRow>
                  </MDBCol>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    檢核與簽署
                  </MDBCol>
                  <MDBCol col="12" class="pb-3 border border-1 rounded-bottom-5">
                    <MDBRow>
                      <SelectPs />
                      <!-- 校正報告掃描檔 -->
                      <MDBCol col="8" class="mt-3">
                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                          label="報告掃描檔" v-model="nowCaseReportScan">
                          <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowCaseReportScan = ''"
                            class="btn-upload-close" />
                        </MDBInput>
                      </MDBCol>
                      <MDBCol col="3" class="px-0 mt-3">
                        <input type="file" id="ReportScanUpload" @change="uploadChenge($event)" style="display: none" />
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click.stop="uploadBtn('ReportScanUpload')">
                          上傳</MDBBtn>
                        <MDBBtn tag="a" target=_blank :href="nowCaseReportScanDL" download size="sm" color="secondary">下載</MDBBtn>
                      </MDBCol>

                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="6">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    校正報告
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border border-1 rounded-bottom-5">
                    <MDBRow>
                      <iframe id="nowCasePDF-viewer" :src="nowCasePDFPath" style="height: calc(100vh - 16rem)"
                        class="w-100"></iframe>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
      </MDBStepperForm>
    </MDBStepper>
  </div>
</template>
<style>
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

.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}

.py-3 {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}

.was-validated .form-control:invalid,
.form-control.is-invalid {
  margin-bottom: 0rem;
  background-image: none;
  border-color: #f93154;
}

.was-validated .form-control:valid,
.form-control.is-valid {
  margin-bottom: 0rem;
  background-image: none;
  border-color: #00b74a;
}

.was-validated .form-check-input:invalid~.form-check-label,
.form-check-input.is-invalid~.form-check-label {
  color: #f93154;
  margin-bottom: 0rem;
}

.was-validated .form-check-input:valid~.form-check-label,
.form-check-input.is-valid~.form-check-label {
  color: #00b74a;
  margin-bottom: 0rem;
}

.btnDisabled{
  pointer-events: none;
  opacity: .65;
  border: 0;
}
</style>
