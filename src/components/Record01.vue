<script setup>
import { ref, reactive, provide, inject } from "vue";
import path from "path-browserify";
import {
  MDBRadio,
  MDBInput,
  MDBCheckbox,
  MDBSwitch,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBIcon,
  MDBBtnClose,
  MDBStepper,
  MDBStepperStep,
  MDBStepperHead,
  MDBStepperContent,
  MDBStepperForm,
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
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";
import ItemGQL from "../graphql/Item";
import PrjGQL from "../graphql/Prj";
import SelectPs from "./SelectPs.vue";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";
import router from '../router';
import { logIn, logOut, toTWDate } from '../methods/User';
import { floatify } from '../methods/mathpor';

DataTable.use(DataTableBs5);
DataTable.use(Select);

// 引入案件編號
const props = defineProps({
  caseID: String
});

// 案件詳細編輯資料==========start
  // 案件之詳細資料
  // 申請
  const updateKey = ref(0);
  const isSMCam = ref(true);
  const nowCaseCalType = ref(""); //校正項目
  const nowCaseCamTypeID = ref(""); // 像機類型
  const nowCaseItemID = inject('nowCaseItemID'); // 校正件索引
  const nowCaseItemChop = ref(""); // 像機廠牌
  const nowCaseItemModel = ref(""); // 像機型號
  const nowCaseItemSN = ref(""); // 像機序號

  const nowCaseFocal = ref(""); // 焦距
  const nowCasePPAx = ref("");  // ppa_x
  const nowCasePPAy = ref("");  // ppa_y
  const nowCasePXw = ref(""); // 像元數量_寬(columns)(X)
  const nowCasePXh = ref(""); // 像元數量_高(rows)(Y)
  const nowCasePxSizeX = ref(""); // 像元尺寸X
  const nowCasePxSizeY = ref(""); // 像元尺寸Y
  const nowCaseSizeX = ref(""); // 元件尺寸X
  const nowCaseSizeY = ref(""); // 元件尺寸Y
  const nowCaseDistSoft = ref(""); // 畸變差糾正軟體
  const nowCaseDistVer = ref(""); // 畸變差糾正軟體版本

  const nowCasePlanY = ref(""); // 預定拍攝年
  const nowCasePlanM = ref(""); // 預定拍攝月
  const nowCaseGSD = ref(""); // 地元尺寸
  const nowCaseStripsNS = ref(""); // 南北航線數
  const nowCaseStripsEW = ref(""); // 東西航線數
  const nowCaseEndLap = ref(""); // 前後重疊率
  const nowCaseSideLap = ref(""); // 側向重疊率
  const nowCaseEllH = ref(""); // 飛航橢球高
  const nowCaseAGL = ref(""); // 飛航離地高
  const nowCaseCamReport = ref(""); // 像機率定報告
  const nowCaseCamReportDL = computed(()=>{
    if(nowCaseCamReport.value && nowCaseCamReport.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseCamReport.value
    }else{
      return undefined
    }
  });
  const nowCasePlanMap = ref(""); // 航線規劃圖
  const nowCasePlanMapDL = computed(()=>{
    if(nowCasePlanMap.value && nowCasePlanMap.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCasePlanMap.value
    }else{
      return undefined
    }
  });
  // 送校
  const nowCaseRecDate = ref(""); // 送校日期
  const nowCaseRecDateDOM =ref();

  const nowCaseFlyDate = ref(""); // 航拍日期
  const nowCaseFlyDateDOM = ref();

  const nowCaseGSDac = ref(""); // 實際地元尺寸
  const nowCaseStrNSac =ref(""); // 實際南北航線
  const nowCaseStrEWac = ref(""); // 實際東西航線
  const nowCaseEndLapAc = ref(""); // 實際前後重疊率
  const nowCaseSideLapAc = ref(""); // 實際側向重疊率
  const nowCaseEllHac = ref(""); // 實際飛航橢球高
  const nowCaseAGLac = ref(""); // 實際飛航離地高

  const nowCaseCamUpload = ref(""); // 上傳像機參數
  const nowCaseCamDL = computed(()=>{
    if(nowCaseCamUpload.value && nowCaseCamUpload.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseCamUpload.value
    }else{
      return undefined
    }});
  const nowCaseFlyMapAc = ref(""); // 實際航線規劃圖
  const nowCaseFlyMapAcDL = computed(()=>{
    if(nowCaseFlyMapAc.value && nowCaseFlyMapAc.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseFlyMapAc.value
    }else{
      return undefined
    }});
  const nowCaseRecTable = ref(""); // 影像檢核紀錄表
  const nowCaseRecTableDL = computed(()=>{
    if(nowCaseRecTable.value && nowCaseRecTable.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseRecTable.value
    }else{
      return undefined
    }});
  const nowCaseEO = ref(""); //外方位資料檔
  const nowCaseEODL = computed(()=>{
    if(nowCaseEO.value && nowCaseEO.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseEO.value
    }else{
      return undefined
    }});
  const nowCasePhotoNo = ref(""); //送校影像數
  const nowCaseOther = ref(""); //設備佐證照片
  const nowCaseOtherDL = computed(()=>{
    if(nowCaseOther.value && nowCaseOther.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseOther.value
    }else{
      return undefined
    }});
  const nowCaseErrData = ref(""); // 送校資料異常註記
  const nowCaseErrPhoto = ref(""); // 送校影像異常註記
  // 校正
  const nowCaseStartDate = ref(""); //開始校正日
  const nowCaseStartDateDOM = ref();

  const nowCaseRefPrjID = ref(""); // 量測作業索引
  const nowCaseRefPrjCode = ref(""); // 量測作業編號編號
  const nowCaseRefPrjPublishDate = ref(""); // 參考值發布日期
  const nowCaseREFUpload = ref(""); // 參考值檔
  const nowCaseREFUploadDL = computed(()=>{
    if(nowCaseREFUpload.value && nowCaseREFUpload.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseREFUpload.value
    }else{
      return undefined
    }});

  const nowCaseImgNo = ref(""); // 使用影像數
  const nowCaseUndist = ref(false); // 是否已糾正影像
  const nowCaseTotPt = ref(""); //總點數(自動計算)
  const nowCaseMeaPt = ref(""); //量測點數(自動計算)
  const nowCaseDelPt = ref(""); //刪除點數
  const nowCaseDelCommt = ref(""); //刪除註記
  const nowCaseDist = ref(""); // 畸變差參數

  // 平差紀錄
  const nowCaseFreeStd = ref(""); //自由網中誤差
  const nowCaseFreeUpload = ref(""); //自由網專案檔
  const nowCaseFreeUploadDL = computed(()=>{
    if(nowCaseFreeUpload.value && nowCaseFreeUpload.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseFreeUpload.value
    }else{
      return undefined
    }});

  const nowCaseFixStd = ref(""); // 強制網中誤差
  const nowCaseFixUpload = ref(""); // 強制網專案檔
  const nowCaseFixUploadDL = computed(()=>{
    if(nowCaseFixUpload.value && nowCaseFixUpload.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseFixUpload.value
    }else{
      return undefined
    }});

  const nowCaseGCPUpload = ref(""); // 控制點檔(上傳GCP.dat)
  const nowCaseGCPUploadDL = computed(()=>{
    if(nowCaseGCPUpload.value && nowCaseGCPUpload.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseGCPUpload.value
    }else{
      return undefined
    }});

  const nowCaseATreport = ref(""); // 空三報表檔(上傳PrintOut.0)
  const nowCaseATreportDL = computed(()=>{
    if(nowCaseATreport.value && nowCaseATreport.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseATreport.value
    }else{
      return undefined
    }});

  const nowCaseCrtNo = ref(""); // 控制點數(自動計算)
  const nowCaseChkNo = ref(""); // 檢核點數(自動計算)
  const nowCaseConnectNo = ref(""); // 連結點數(自動計算)
  const nowCaseObsNo = ref(""); // 觀測量(自動計算)
  const nowCaseRedundancy = ref(""); // 多餘觀測量(自動計算)
  const nowCaseRMSx = ref(""); // X-均方根(自動計算)
  const nowCaseRMSy = ref(""); // Y-均方根(自動計算)
  const nowCaseRMSz = ref(""); // Z-均方根(自動計算)
  const nowCaseSTDh = ref(""); //水平不確定度(自動計算)
  const nowCaseSTDv = ref(""); //高程不確定度(自動計算)
  const nowCaseRsultFile = ref(""); // 計算成果表(自動計算)
  const nowCaseRsultFileDL = computed(()=>{
    if(nowCaseRsultFile.value && nowCaseRsultFile.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseRsultFile.value
    }else{
      return undefined
    }});

  // 作業紀錄
  const nowCaseNetGraph = ref(""); //網形圖(上傳)
  const nowCaseNetGraphDL = computed(()=>{
    if(nowCaseNetGraph.value && nowCaseNetGraph.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseNetGraph.value
    }else{
      return undefined
    }});

  const nowCaseGCPGraph = ref(""); //點位分布圖(上傳)
  const nowCaseGCPGraphDL = computed(()=>{
    if(nowCaseGCPGraph.value && nowCaseGCPGraph.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseGCPGraph.value
    }else{
      return undefined
    }});

  const nowCaseSTDExl = ref(""); //不確定度計算表(上傳)
  const nowCaseSTDExlDL = computed(()=>{
    if(nowCaseSTDExl.value && nowCaseSTDExl.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseSTDExl.value
    }else{
      return undefined
    }});

  const nowCaseKh = ref(""); //水平涵蓋因子(自動計算)
  const nowCaseKv = ref(""); //高程涵蓋因子(自動計算)
  const nowCaseRecTemp = ref(""); //作業紀錄表範本
  const nowCaseCalResult = ref(""); //計算成果表
  const nowCaseUcResult = ref(""); //不確定度計算表
  // 出具報告
  const nowCaseHasLOGO = ref(true); //列印TAF LOGO
  const nowCaseReportTemp = ref(""); //校正報告範本
  const nowCaseReportEdit = ref(""); //校正報告編輯檔
  const nowCaseReportEditDL = computed(()=>{
    if(nowCaseReportEdit.value && nowCaseReportEdit.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseReportEdit.value
    }else{
      return undefined
    }});

  const nowCaseCompleteDate = ref(""); //報告(列印)日期
  const nowCaseCompleteDateDOM = ref();

  const nowCaseChkDate = ref(""); // 數據檢核日
  provide('nowCaseChkDate',nowCaseChkDate);

  const nowCaseChkPersonID = ref(""); //數據檢核人
  provide('nowCaseChkPersonID',nowCaseChkPersonID);
  const selectChkPersonID = ref("");
  provide('selectChkPersonID',selectChkPersonID);
  const nowCaseChkPersonMU = ref([]);
  provide('nowCaseChkPersonMU',nowCaseChkPersonMU);

  const nowCaseSignDate = ref(""); // 報告簽署日
  provide('nowCaseSignDate',nowCaseSignDate);

  const nowCaseSignPersonID = ref(""); // 報告簽署人
  provide('nowCaseSignPersonID',nowCaseSignPersonID);
  const selectSignPersonID = ref("");
  provide('selectSignPersonID',selectSignPersonID);
  const nowCaseSignPersonMU = ref([]);
  provide('nowCaseSignPersonMU',nowCaseSignPersonMU);

  const selectPsData = ref();
  const nowCaseReportScan = ref(""); //校正報告掃描檔
  const nowCaseReportScanDL = computed(()=>{
    if(nowCaseReportScan.value && nowCaseReportScan.value !== ""){
      return "06_Case/"+ props.caseID + "/" + nowCaseReportScan.value
    }else{
      return undefined
    }});

  const nowCasePDFPath = ref("pdfjs-dist/web/viewer.html"); //校正報告掃描檔路徑



  // 查詢Record01資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID.case_record_01) {
    // 填入資料
    let getData = result.data.getCasebyID.case_record_01;
    let getItem = result.data.getCasebyID.item_base;
    (result.data.getCasebyID.cal_type === 3) ? isSMCam.value = true : isSMCam.value = false;
    // 校正件資料
    nowCaseCalType.value = result.data.getCasebyID.cal_type;
    nowCaseCamTypeID.value = getData.cam_type + "";
    nowCaseItemID.value = (getItem) ? getItem.id : "";
    nowCaseItemChop.value = (getItem)?getItem.chop:"";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
    nowCaseFocal.value = getData.focal;
    nowCasePPAx.value = getData.ppa_x;
    nowCasePPAy.value = getData.ppa_y;
    nowCasePXh.value = getData.px_h;
    nowCasePXw.value = getData.px_w;
    nowCasePxSizeX.value = getData.px_size_x;
    nowCasePxSizeY.value = getData.px_size_y;
    nowCaseSizeX.value = getData.size_x;
    nowCaseSizeY.value = getData.size_y;
    nowCaseDistSoft.value = getData.distor_corr_soft;
    nowCaseDistVer.value = getData.distor_corr_ver;
    // 飛航規劃
    nowCasePlanY.value = getData.plan_year;
    nowCasePlanM.value = getData.plan_month;
    nowCaseGSD.value = getData.gsd;
    nowCaseStripsNS.value = getData.strips_ns;
    nowCaseStripsEW.value = getData.strips_ew;
    nowCaseEndLap.value = getData.end_lap;
    nowCaseSideLap.value = getData.side_lap;
    nowCaseEllH.value = getData.ell_height;
    nowCaseAGL.value = getData.agl;
    // 檢附資料
    nowCaseCamReport.value = getData.cam_report;
    nowCasePlanMap.value = getData.plan_map;
    // 送件
    nowCaseRecDate.value = (getData.receive_date)?getData.receive_date.split("T")[0]:"";
    nowCaseFlyDate.value = (getData.fly_date)?getData.fly_date.split("T")[0]:"";
    nowCaseGSDac.value = getData.gsd_ac;
    nowCaseStrNSac.value = getData.strip_ns_ac;
    nowCaseStrEWac.value = getData.strip_ew_ac;
    nowCaseEndLapAc.value = getData.end_lap_ac;
    nowCaseSideLapAc.value = getData.side_lap_ac;
    nowCaseEllHac.value = getData.ell_height_ac;
    nowCaseAGLac.value = getData.agl_ac;
    nowCaseCamUpload.value = getData.cam_parm;
    nowCaseFlyMapAc.value = getData.fly_map;
    nowCaseRecTable.value = getData.rec_table;
    nowCaseEO.value = getData.eo_file;
    nowCasePhotoNo.value = getData.photo_no;
    nowCaseOther.value = getData.others;
    nowCaseErrData.value = getData.err_data;
    nowCaseErrPhoto.value = getData.err_photo;
    // 校正
    nowCaseStartDate.value = (getData.start_Date)?getData.start_Date.split("T")[0]:"";
    nowCaseRefPrjID.value = getData.ref_id;
    nowCaseRefPrjCode.value = (getData.ref_project)?getData.ref_project.project_code:"";
    nowCaseRefPrjPublishDate.value = (getData.ref_project) ?getData.ref_project.publish_date.split("T")[0]:"";
    nowCaseREFUpload.value = getData.ref_file;
    nowCaseGCPUpload.value = getData.gcp_file;
    nowCaseTotPt.value = getData.total_pt;
    nowCaseMeaPt.value = getData.meas_pt;
    nowCaseDelPt.value = getData.del_pt;
    nowCaseDelCommt.value = getData.del_comt;
    nowCaseDist.value = getData.distrotion;
    nowCaseFreeStd.value = getData.free_std;
    nowCaseFreeUpload.value = getData.free_file;
    nowCaseFixStd.value = getData.fix_std;
    nowCaseFixUpload.value = getData.fix_file;
    nowCaseImgNo.value = getData.img_no;
    nowCaseUndist.value = getData.Undistortion;
    nowCaseCrtNo.value = getData.ctr_no;
    nowCaseChkNo.value = getData.chk_no;
    nowCaseATreport.value = getData.at_rpt;
    nowCaseConnectNo.value = getData.connect_no;
    nowCaseObsNo.value = getData.obs_no;
    nowCaseRedundancy.value = getData.redundancy;
    nowCaseRMSx.value = getData.RMS_x;
    nowCaseRMSy.value = getData.RMS_y;
    nowCaseRMSz.value = getData.RMS_z;
    nowCaseRsultFile.value = getData.result_file;
    nowCaseNetGraph.value = getData.net_graph;
    nowCaseGCPGraph.value = getData.gcp_graph;
    nowCaseSTDh.value = getData.std_h;
    nowCaseSTDv.value = getData.std_v;
    nowCaseKh.value = getData.k_h;
    nowCaseKv.value = getData.k_v;
    nowCaseSTDExl.value = getData.std_file;
    nowCaseRecTemp.value = getData.report_edit;
    nowCaseCalResult.value = getData.recal_table;
    nowCaseUcResult.value = getData.uccal_table;
    // 出具報告
    nowCaseHasLOGO.value = getData.has_logo;
    nowCaseReportTemp.value = getData.report_template;
    nowCaseReportEdit.value = getData.report_edit;
    nowCaseCompleteDate.value = (getData.complete_date)?getData.complete_date.split("T")[0]:""
    ;
    nowCaseChkDate.value = (getData.chk_date)?getData.chk_date.split("T")[0]:"";
    nowCaseChkPersonID.value = getData.chk_person_id;
    selectChkPersonID.value = getData.chk_person_id;
    
    nowCaseSignDate.value = (getData.sign_date)?getData.sign_date.split("T")[0]:"";
    nowCaseSignPersonID.value = getData.sign_person_id;
    selectSignPersonID.value = getData.sign_person_id;

    nowCaseReportScan.value = getData.report_scan
    if (!getData.report_scan){
      nowCasePDFPath.value = "pdfjs-dist/web/viewer.html";  
    }else{
      nowCasePDFPath.value = "pdfjs-dist/web/viewer.html?file=../../../06_Case/"+ props.caseID + "/" + getData.report_scan;
    }
  }
});
refgetNowCaseF();

function comSensorSize(){
  nowCaseSizeX.value = (parseFloat(nowCasePxSizeX.value) * parseFloat(nowCasePXw.value)/1000).toFixed(4);
  nowCaseSizeY.value = (parseFloat(nowCasePxSizeY.value) * parseFloat(nowCasePXh.value) / 1000).toFixed(4);
}

function onChangeStep(){
  updateKey.value += 1;
}

// 查詢報告簽署人列表
  const { result: allSignPson, onResult: getAllSignPson, refetch: refgetAllSignPson } = useQuery(CaseGQL.GETOPERATOR,
    ()=>({ 
      calType: (nowCaseCalType.value==="")?null:nowCaseCalType.value,
      roleType: "報告簽署人"
    })
  );
  getAllSignPson(result=>{
    // 加入報告簽署人選單資料
    if (!result.loading && result.data.getEmpByRole) {
      // 資料區
      nowCaseSignPersonMU.value = result.data.getEmpByRole.map(x => {
        return { text: x.name, value: parseInt(x.person_id) }
      }); nowCaseSignPersonMU.value.unshift({ text: "", value: "" });
    }
  });
// 查詢數據檢核人列表
  const { result: allChkPson, onResult: getAllChkPson, refetch: refgetAllChkPson } = useQuery(CaseGQL.GETOPERATOR,
    ()=>({ 
      calType: (nowCaseCalType.value==="")?null:nowCaseCalType.value,
      roleType: null
    })
  );
  getAllChkPson(result=>{
    // 加入數據檢核人選單資料
    if (!result.loading && result.data.getEmpByRole) {
      // 資料區
      nowCaseChkPersonMU.value = result.data.getEmpByRole.map(x => {
        return { text: x.name, value: parseInt(x.person_id) }
      }); nowCaseChkPersonMU.value.unshift({ text: "", value: "" });
    }
  });

// 案件詳細編輯資料==========end

// 校正件列表=========start
let dtItem;
const tableItem = ref();
const dataItem = ref([]);
const showItemFrom = ref(false);
const itemTabId = ref("itemEditor");

const seletItemId = ref("");

const selItemTypeID = ref("");
const selItemTypeMU = ref([]);
const selItemTypeDOM = ref();
const selItemList = ref([]);

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

// 設定表格tableItem
const columnsItem = [
  { data: "id", title: "編號", defaultContent: "-" },
  { data: "chop", title: "廠牌", defaultContent: "-" },
  { data: "model", title: "型號", defaultContent: "-" },
  { data: "serial_number", title: "序號", defaultContent: "-" },
  { data: "item_type.type", title: "儀器類型", defaultContent: "-" },
];
const tboptionItem = {
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'asc']],
  scrollY: '22vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 查詢校正件資料
const { result: allItem, loading: lodingAllItem, variables: varAllItem, onResult: getAllItem, refetch: refgetAllItem } = useQuery(
  ItemGQL.GETALLITEM,
);
getAllItem(result => {
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

// 查詢儀器類型
const { result: allItemType, loading: lodingAllItemType, onResult: getAllItemType, refetch: refgetAllItemType } = useQuery(
  ItemGQL.GETALLITEMTYPE,
);
getAllItemType(result => {
  // 加入儀器類型選單資料
  if (!result.loading && result.data.getAllItemType ) {
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


// 查詢選取校正件資料
const { result: selItemData, loading: loadselItem, onResult: getselItem, refetch: refgetselItem } = useQuery(
  ItemGQL.GETITEMBYID,
  () => ({
    getItemByIdId: parseInt(seletItemId.value)
  })
);
getselItem(result => {
  if (!result.loading && result && result.data.getItemByID) {
    let getData = result.data.getItemByID
    selItemChop.value = getData.chop;
    selItemTypeID.value = getData.type;
    selItemTypeDOM.value.setValue(parseInt(getData.type));
    selItemModel.value = getData.model;
    selItemSN.value = getData.serial_number;
  }else{
    selItemChop.value = "";
    selItemModel.value = "";
    selItemSN.value = "";
    if (selItemTypeDOM.value) {
      selItemTypeDOM.value.setValue("");
    }
  }
});

function shownItemModal() {
  dtItem = tableItem.value.dt();
  dtItem.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    seletItemId.value = getData.id;
  });
  refgetAllItem();
  refgetAllItemType();
  if (nowCaseItemID.value) {
    seletItemId.value = nowCaseItemID.value;
    refgetselItem();
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
saveItemError((error) => {
  console.log(error);
});
saveItemOnDone(() => {
  refgetAllItem();
  refgetselItem();
  // infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  // alert1.value = true;
});
// 更多編輯=>引導至校正件管理
function gotoItemMG(){
  router.push('/items');
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

  varAllItem.value = where;
}

// 案加入後回填校正件id
function setItemBtn() {
  nowCaseItemID.value = seletItemId.value;
  nowCaseItemChop.value = selItemChop.value;
  nowCaseItemModel.value = selItemModel.value;
  nowCaseItemSN.value = selItemSN.value;

  showItemFrom.value = false;
}
// 校正件列表=========end

// 參考值列表=========start
let dtPrj;
const tablePrj = ref();
const dataPrj = ref([]);
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

// 設定表格tablePrj
const columnsPrj = [
  { data: "id", title: "編號", defaultContent: "-" },
  { data: "project_code", title: "作業編號", defaultContent: "-" },
  { data: "cal_type.name", title: "校正項目", defaultContent: "-" },
  { data: "publish_date", title: "發布日", defaultContent: "-", render: (data) => {return toTWDate(data);} },
  { data: "method", title: "方式", defaultContent: "-" },
  { data: "year", title: "作業年", defaultContent: "-" },
  { data: "month", title: "月", defaultContent: "-" },
  { data: "organizer", title: "作業機關", defaultContent: "-" },
  { data: "start_date", title: "開始日", defaultContent: "-", render: (data) => {return toTWDate(data);}},
  { data: "end_date", title: "結束日", defaultContent: "-", render: (data) => {return toTWDate(data);}},
];
const tboptionPrj = {
  dom: 'ti',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: '22vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 查詢量測作業資料
const { result: allPrj, loading: lodingAllPrj, variables: varAllPrj, onResult: getAllPrj, refetch: refgetAllPrj } = useQuery(
  PrjGQL.GETALLPRJ,
);
getAllPrj(result => {
  // 加入量測作業資料
  if (!result.loading && result.data.getAllPrj) {
    dataPrj.value = result.data.getAllPrj;
  }
});

function shownPrjModal() {
  dtPrj = tablePrj.value.dt();
  dtPrj.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    seletPrjID.value = getData.id;
    seletPrjCode.value = getData.project_code;
    seletPrjPublishDate.value = getData.publish_date.split("T")[0];
  });
  refgetAllPrj();
}

// 更多編輯=>引導至校正件管理
function gotoPrjMG(){
  router.push('/prjs');
}

// 清除校正件篩選條件
function clearPrjFilter() {
  filterPrjCode.value = "";
  filterPrjPubDateStart.value = "";
  filterPrjPubDateEnd.value = "";
}

// 執行量測作業篩選
function doPrjFilter() {
  let where = {};
  if (filterPrjCode.value !== "") where.projectCode = filterPrjCode.value;
  if (filterPrjPubDateStart.value !== "") where.pubdateStart = filterPrjPubDateStart.value;
  if (filterPrjPubDateEnd.value !== "") where.pubdateEnd = filterPrjPubDateEnd.value;

  varAllPrj.value = where;
}

// 案加入後回填量測作業id
function setPrjBtn() {
  nowCaseRefPrjID.value = seletPrjID.value;
  nowCaseRefPrjCode.value = seletPrjCode.value;
  nowCaseRefPrjPublishDate.value = seletPrjPublishDate.value;
  showPrjFrom.value = false;
}

// 參考值列表=========end


// 儲存Record01
const { mutate: saveRecord01, onDone: saveRecord01OnDone, onError: saveRecord01Error } = useMutation(
  CaseGQL.SAVECASERECORD01,
  () => ({
    variables: {
      updateRecord01Id: props.caseID,
      camType: parseInt(nowCaseCamTypeID.value),
      focal: parseFloat(nowCaseFocal.value),
      ppaX: parseFloat(nowCasePPAx.value),
      ppaY: parseFloat(nowCasePPAy.value),
      pxW: parseInt(nowCasePXw.value),
      pxH: parseInt(nowCasePXh.value),
      pxSizeX: parseFloat(nowCasePxSizeX.value),
      pxSizeY: parseFloat(nowCasePxSizeY.value),
      sizeX: parseFloat(nowCaseSizeX.value),
      sizeY: parseFloat(nowCaseSizeY.value),
      planYear: parseInt(nowCasePlanY.value),
      planMonth: parseInt(nowCasePlanM.value),
      gsd: parseFloat(nowCaseGSD.value),
      stripsNs: parseInt(nowCaseStripsNS.value),
      stripsEw: parseInt(nowCaseStripsEW.value),
      endLap: parseFloat(nowCaseEndLap.value),
      sideLap: parseFloat(nowCaseSideLap.value),
      ellHeight: parseFloat(nowCaseEllH.value),
      agl: parseFloat(nowCaseAGL.value),
      camReport: nowCaseCamReport.value,
      planMap: nowCasePlanMap.value,
      receiveDate: (nowCaseRecDate.value === "") ? null : (nowCaseRecDate.value.trim() + "T00:00:00.000Z"),
      flyDate: (nowCaseFlyDate.value === "") ? null : (nowCaseFlyDate.value.trim() + "T00:00:00.000Z"),
      stripNsAc: parseInt(nowCaseStrNSac.value),
      stripEwAc: parseInt(nowCaseStrEWac.value),
      endLapAc: parseFloat(nowCaseEndLapAc.value),
      sideLapAc: parseFloat(nowCaseSideLapAc.value),
      ellHeightAc: parseFloat(nowCaseEllHac.value),
      aglAc: parseFloat(nowCaseAGLac.value),
      gsdAc: parseFloat(nowCaseGSDac.value),
      camParm: nowCaseCamUpload.value,
      flyMap: nowCaseFlyMapAc.value,
      recTable: nowCaseRecTable.value,
      photoNo: parseInt(nowCasePhotoNo.value),
      others: nowCaseOther.value,
      errData: nowCaseErrData.value,
      errPhoto: nowCaseErrPhoto.value,
      distorCorrSoft: nowCaseDistSoft.value,
      distorCorrVer: nowCaseDistVer.value,
      undistortion: nowCaseUndist.value,
      startDate: (nowCaseStartDate.value === "") ? null : (nowCaseStartDate.value.trim() + "T00:00:00.000Z"),
      refId: parseInt(nowCaseRefPrjID.value),
      refFile: nowCaseREFUpload.value,
      gcpFile: nowCaseGCPUpload.value,
      totalPt: parseInt(nowCaseTotPt.value),
      measPt: parseInt(nowCaseMeaPt.value),
      delPt: parseInt(nowCaseDelPt.value),
      delComt: nowCaseDelCommt.value,
      freeStd: parseFloat(nowCaseFreeStd.value),
      freeFile: nowCaseFreeUpload.value,
      fixStd: parseFloat(nowCaseFixStd.value),
      fixFile: nowCaseFixUpload.value,
      imgNo: parseInt(nowCaseImgNo.value),
      ctrNo: parseInt(nowCaseCrtNo.value),
      chkNo: parseInt(nowCaseChkNo.value),
      atRpt: nowCaseATreport.value,
      connectNo: parseInt(nowCaseConnectNo.value),
      obsNo: parseInt(nowCaseObsNo.value),
      redundancy: parseInt(nowCaseRedundancy.value),
      rmsX: parseFloat(nowCaseRMSx.value),
      rmsY: parseFloat(nowCaseRMSy.value),
      rmsZ: parseFloat(nowCaseRMSz.value),
      resultFile: nowCaseRsultFile.value,
      netGraph: nowCaseNetGraph.value,
      gcpGraph: nowCaseGCPGraph.value,
      stdH: parseFloat(nowCaseSTDh.value),
      stdV: parseFloat(nowCaseSTDv.value),
      kH: parseFloat(nowCaseKh.value),
      kV: parseFloat(nowCaseKv.value),
      stdFile: nowCaseSTDExl.value,
      reportEdit: nowCaseReportEdit.value,
      chkDate: (nowCaseChkDate.value === "") ? null : (nowCaseChkDate.value.trim() + "T00:00:00.000Z"),
      chkPersonId: (selectChkPersonID.value === "")?null:parseInt(selectChkPersonID.value),
      completeDate: (nowCaseCompleteDate.value === "") ? null : (nowCaseCompleteDate.value.trim() + "T00:00:00.000Z"),
      signDate: (nowCaseSignDate.value === "") ? null : (nowCaseSignDate.value.trim() + "T00:00:00.000Z"),
      signPersonId: (selectSignPersonID.value === "")?null:parseInt(selectSignPersonID.value),
      reportScan: nowCaseReportScan.value,
      hasLogo: nowCaseHasLOGO.value,
      reportTemplate: nowCaseReportTemp.value,
      distrotion: nowCaseDist.value,
      recordTamplate: nowCaseRecTemp.value,
      eoFile: nowCaseEO.value,
      recalTable: nowCaseCalResult.value,
      uccalTable: nowCaseUcResult.value,
    }
  })
);
saveRecord01Error((error) => {
  console.log(error);
});
saveRecord01OnDone(() => {
  // console.log(nowCaseCalResult.value)
  // console.log('nowCaseChkPersonID: ',nowCaseChkPersonID.value); 
  // console.log('selectChkPersonID: ',selectChkPersonID.value);
  // infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  // alert1.value = true;
});

// 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId){
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  document.getElementById(inputId).click();
}

// 上傳檔案
const { mutate: uploadFile, onDone: uploadFileOnDone } = useMutation(CaseGQL.UPLOADFILE);

uploadFileOnDone(result=>{
  // 儲存(更新)上傳紀錄資料
  if(!uploadType.value){return}
  switch (uploadType.value){
    case 'itemCamReportUpload':
      nowCaseCamReport.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'planMapUpload':
      nowCasePlanMap.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'CamUploadUpload':
      nowCaseCamUpload.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'FlyMapAcUpload':
      nowCaseFlyMapAc.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'RecTableUpload':
      nowCaseRecTable.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'EOUpload':
      nowCaseEO.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'OtherUpload':
      nowCaseOther.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'REFUpload':
      nowCaseREFUpload.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'FreeUpload':
      nowCaseFreeUpload.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'FixUpload':
      nowCaseFixUpload.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'GCPUpload':
      nowCaseGCPUpload.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'ATreportUpload':
      nowCaseATreport.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'NetGraphUpload':
      nowCaseNetGraph.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'GCPGraphUpload':
      nowCaseGCPGraph.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'STDExlUpload':
      nowCaseSTDExl.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
    case 'ReportScanUpload':
      nowCaseReportScan.value = result.data.uploadFile.filename;
      saveRecord01()
      break;
  }
});

// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e){
  upFile.value = e.target.files[0];
  let subpath = "06_Case/" + props.caseID;
  let newName = "";
  if(!uploadType.value){return}
  switch (uploadType.value){
    case 'itemCamReportUpload':
      newName = "01_CamReport" + path.extname(e.target.value);
      break;
    case 'planMapUpload':
      newName = "02_PlanDwg" + path.extname(e.target.value);
      break;
    case 'CamUploadUpload':
      newName = "03_CamParameter" + path.extname(e.target.value);
      break;
    case 'FlyMapAcUpload':
      newName = "04_APhotoDwg" + path.extname(e.target.value);
      break;
    case 'RecTableUpload':
      newName = "05_RecForm" + path.extname(e.target.value);
      break;
    case 'EOUpload':
      newName = "05_EO" + path.extname(e.target.value);
      break;
    case 'OtherUpload':
      newName = "06_Other" + path.extname(e.target.value);
      break;
    case 'REFUpload':
      newName = "07_Ref" + path.extname(e.target.value);
      break;
    case 'FreeUpload':
      newName = "09_FreeWeb" + path.extname(e.target.value);
      break;
    case 'FixUpload':
      newName = "10_FixWeb" + path.extname(e.target.value);
      break;
    case 'GCPUpload':
      newName = "08_GCP" + path.extname(e.target.value);
      break;
    case 'ATreportUpload':
      await readPrintOut(e.target.files[0]);
      newName = "11_Printout" + path.extname(e.target.value);
      break;
    case 'NetGraphUpload':
      newName = "14_NetworkDiag" + path.extname(e.target.value);
      break;
    case 'GCPGraphUpload':
      newName = "15_PtDistribution" + path.extname(e.target.value);
      break;
    case 'STDExlUpload':
      newName = "13_UncertaintyCal" + path.extname(e.target.value);
      break;
    case 'ReportScanUpload':
      newName = "17_ReportScan" + path.extname(e.target.value);
      break;
  }  
  await uploadFile({ 
    file: upFile.value,
    subpath: subpath,
    newfilename: newName,
  });
}

// 檔案上傳==========End


// 讀取PrintOut.0 並填入資料====Start
const { result: refPtData, variables: varRefPtData, onResult: getRefPtData, refetch: refgetRefPtData } = useQuery(
  PrjGQL.GETGCPRECBYPRJ,
);

const pramJsonStr = ref("");

async function readPrintOut(POfile){
  let total_Img = 0; //像片總數
  let pt_Ref = 0;    //校正標數(參考值數量)
  let pt_F = 0;     //控制點數(Full control points)
  let pt_T = 0;     //連接點數(Tie points)
  let pt_C = 0;     //檢核點數(Check points)

  let total_Obs = 0;//總連結數(總觀測量)
  let redundancy = 0;//多餘觀測數
  let sig_0 = 0.0;  //Sigma0
  let rms_X = 0.0;
  let rms_Y = 0.0;
  let rms_Z = 0.0;
  let rmse_H = 0.0;
  let rmse_V = 0.0;

  let isBlunderFlag = false;
  let isContrlPtFlag = false;
  let isContrlPtFinish = false;
  let isLinkPtFlag = false;

  let pt_Data = {};
  let pt_Type = "";
  let pt_Name = "";
  let pt_X = 0.0;
  let pt_Y = 0.0;
  let pt_Z = 0.0;
  let pt_temp;
  let pt_temp_pos=0;
  let pramJson={};

  if (POfile) { 
    //確認有檔案存在
    //建立檔案讀取器
    const fReader = new FileReader();     
    
    //檔案載入後要執行的事
    fReader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        // 全文件轉換成行
        let allTextLines = evt.target.result.split(/\r\n|\n/);
        // 逐行解析
        let i = 0;
        do {
          if(allTextLines[i].trim()!==""){
            //取得像片總數
            if(allTextLines[i].indexOf(" Number of Images")>=0){
              total_Img = parseInt(allTextLines[i].slice(allTextLines[i].indexOf(":")+1));
            }

            //取得總連結數(總觀測量)
            if(allTextLines[i].indexOf(" Total number of observations")>=0){
              total_Obs = parseInt(allTextLines[i].slice(allTextLines[i].indexOf(":")+1));
            }
            // 取得多餘觀測數
            if(allTextLines[i].indexOf(" Total redundancy")>=0){
              redundancy = parseInt(allTextLines[i].slice(allTextLines[i].indexOf(":")+1));
            }

            // 取得sigma0
            if(allTextLines[i].indexOf(" Sigma0:")>=0){
              sig_0 = parseFloat(allTextLines[i].slice(allTextLines[i].indexOf(":")+1));
            }
            
            // Blunders within control points
            if(allTextLines[i].indexOf("Blunders within control points")>=0){isBlunderFlag=true};
            // 非Blunders within control points區塊
            if(allTextLines[i].indexOf(" Control points")>=0 && !isBlunderFlag){
              isContrlPtFlag=true;
              i = i + 4;
            };

            if(isContrlPtFlag && !isBlunderFlag && !isContrlPtFinish){
              // 讀取控制點資料
              if(allTextLines[i].indexOf("Maximum changes at control points:")>=0){
                isContrlPtFinish=true;
              }else{
                pt_Type = allTextLines[i].slice(0,2).trim();
                pt_Name = allTextLines[i].slice(2,54).trim();
                pt_temp = allTextLines[i].slice(56).trim();
                pt_X = parseFloat(pt_temp.slice(0,pt_temp.indexOf(" ")).trim());
                i=i+1
                pt_temp = allTextLines[i].slice(56).trim();
                pt_Y = parseFloat(pt_temp.slice(0,pt_temp.indexOf(" ")).trim());
                i=i+1
                pt_temp = allTextLines[i].slice(56).trim();
                pt_Z = parseFloat(pt_temp.slice(0,pt_temp.indexOf(" ")).trim());
                i=i+1
                pt_Data[pt_Name] = {
                  type: pt_Type,
                  x: pt_X,
                  y: pt_Y,
                  z: pt_Z,
                };
                pt_F=pt_F+1;
              }
            }

            if(isContrlPtFlag && !isBlunderFlag && isContrlPtFinish && isLinkPtFlag){
              if(allTextLines[i].indexOf("RMS:")>=0){
                // 讀取RMS值
                pt_temp = allTextLines[i].slice(allTextLines[i].indexOf("RMS:")+4).trim();
                pt_temp_pos=pt_temp.indexOf(" ");
                rms_X = parseFloat(pt_temp.slice(0,pt_temp_pos).trim());
                pt_temp = pt_temp.slice(pt_temp_pos+1).trim();
                pt_temp_pos=pt_temp.indexOf(" ");
                rms_Y = parseFloat(pt_temp.slice(0,pt_temp_pos).trim());
                pt_temp = pt_temp.slice(pt_temp_pos+1).trim();
                rms_Z = parseFloat(pt_temp.slice(0).trim());
                isBlunderFlag=true;
              }else{
                // 讀取連結點資料
                pt_Type = allTextLines[i].slice(0,2).trim();
                pt_Name = allTextLines[i].slice(2,54).trim();
                pt_temp = allTextLines[i].slice(55).trim();
                pt_temp_pos=pt_temp.indexOf(" ");
                pt_X = parseFloat(pt_temp.slice(0,pt_temp_pos).trim());
                pt_temp = pt_temp.slice(pt_temp_pos+1).trim();
                pt_temp_pos=pt_temp.indexOf(" ");
                pt_Y = parseFloat(pt_temp.slice(0,pt_temp_pos).trim());
                pt_temp = pt_temp.slice(pt_temp_pos+1).trim();
                pt_temp_pos=pt_temp.indexOf(" ");
                pt_Z = parseFloat(pt_temp.slice(0,pt_temp_pos).trim());
                
                pt_Data[pt_Name] = {
                  type: pt_Type,
                  x: pt_X,
                  y: pt_Y,
                  z: pt_Z,
                };
                pt_T=pt_T+1
              }
            }else if(isContrlPtFlag && !isBlunderFlag && isContrlPtFinish){
              if(allTextLines[i].indexOf("  Point ID")>=0){
                isLinkPtFlag=true;
              }
            }
          }

          i = i + 1;
        } while (i < allTextLines.length);

        // 比對參考值檔找出檢核點
        // 同時計算RMSE及檢核點數量
        varRefPtData.value = {
          projectId: parseInt(nowCaseRefPrjID.value),
          status: "正常",
          calTypeId: parseInt(nowCaseCamTypeID.value),
        }
        getRefPtData(result=>{
          if(!result.loading && result.data.getGcpRecordsByPrj && pt_Data){
            let refData = result.data.getGcpRecordsByPrj;
            let dx=0.0;
            let dy=0.0;
            let dz=0.0;
            refData.forEach((x,i)=>{
              if(pt_Data[x.gcp_id]){
                if(pt_Data[x.gcp_id].type==="T"){
                  pt_Data[x.gcp_id].sx = x.coor_E;
                  pt_Data[x.gcp_id].dx = floatify(pt_Data[x.gcp_id].x - x.coor_E);
                  dx = dx + pt_Data[x.gcp_id].dx ** 2;

                  pt_Data[x.gcp_id].sy = x.coor_N;
                  pt_Data[x.gcp_id].dy = floatify(pt_Data[x.gcp_id].y - x.coor_N);
                  dy = dy + pt_Data[x.gcp_id].dy ** 2;

                  pt_Data[x.gcp_id].sz = x.coor_h;
                  pt_Data[x.gcp_id].dz = floatify(pt_Data[x.gcp_id].z - x.coor_h);
                  dz = dz + pt_Data[x.gcp_id].dz ** 2;
                  pt_C=pt_C+1;
                }
              }
            });

            // 填入資料
            pt_Ref = refData.length;
            nowCaseImgNo.value = total_Img;
            nowCaseObsNo.value = total_Obs;
            nowCaseRedundancy.value = redundancy;
            nowCaseFixStd.value = sig_0 * 1000.0;
            nowCaseRMSx.value = floatify(rms_X * 1000);
            nowCaseRMSy.value = floatify(rms_Y * 1000);
            nowCaseRMSz.value = floatify(rms_Z * 1000);
            nowCaseTotPt.value = pt_Ref;
            nowCaseMeaPt.value = pt_F + pt_C;
            nowCaseDelPt.value = pt_Ref - (pt_F + pt_C);
            nowCaseCrtNo.value = pt_F;
            nowCaseChkNo.value = pt_C;
            nowCaseConnectNo.value = pt_T;

            // console.log("pt_Data",pt_Data);
            // 將pt_Data寫入nowCaseCalResult
            nowCaseCalResult.value = JSON.stringify(pt_Data);
            // console.log(nowCaseCalResult.value);

          }
        });
        
        pramJson={
          sx:nowCaseRMSx.value,
          sy:nowCaseRMSy.value,
          sz:nowCaseRMSz.value,
          redundancy:nowCaseRedundancy.value,
          gsd:nowCaseGSDac.value,
        }
        pramJsonStr.value = JSON.stringify(pramJson);
        computeUc();
      };
    };
    //真正執行以文字方式載入檔案
    fReader.readAsText(POfile); 
  }
}
// 讀取PrintOut.0 並填入資料====End

// 呼叫計算不確定度=======Start
const { mutate: computeUc, onDone: computeUcOnDone, onError: computeUcError } = useMutation(
  CaseGQL.COMPUTEUC,
  () => ({
    variables: {
      parm:pramJsonStr.value,
    }
  })
);
computeUcOnDone(result=>{
  nowCaseSTDh.value = result.data.computeUc[0];
  nowCaseSTDv.value = result.data.computeUc[3];
  nowCaseKh.value = result.data.computeUc[2].toFixed(2);
  nowCaseKv.value = result.data.computeUc[5].toFixed(2);
});
// 呼叫計算不確定度=======End

defineExpose({
  saveRecord01
});

</script>
<template>
  <div class="h-100 overflow-auto">
    <!-- 選擇校正件 -->
    <MDBModal style="left: 66%;" @shown="shownItemModal" v-model="showItemFrom" staticBackdrop scrollable>
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
            <!-- 篩選 或 編輯 -->
            <MDBCol col="12" class="border">
              <MDBTabs v-model="itemTabId">
                <MDBTabNav tabsClasses="">
                  <MDBTabItem tabId="itemEditor" href="itemEditor">資料編輯</MDBTabItem>
                  <MDBTabItem tabId="itemFilter" href="itemFilter">條件篩選</MDBTabItem>
                </MDBTabNav>
                <MDBTabContent>
                  <!-- 編輯表單 -->
                  <MDBTabPane class="h-100" tabId="itemEditor">
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
                  </MDBTabPane>
                  <!-- 篩選表單 -->
                  <MDBTabPane tabId="itemFilter">
                    <!-- 功能列 -->
                    <div class="mt-2">
                      <MDBBtn size="sm" color="primary" @click="doItemFilter">篩選</MDBBtn>
                      <MDBBtn size="sm" color="primary" @click="clearItemFilter">清除</MDBBtn>
                    </div>
                    <!-- 條件欄位 -->
                    <MDBRow>
                      <MDBSelect filter size="sm" class="my-3  col-6" label="儀器類型" v-model:options="filterItemTypeMU"
                        v-model:selected="filterItemTypeID" ref="filterItemTypeDOM" />
                      <div></div>
                      <MDBSelect filter size="sm" class="mb-2  col-6" label="廠牌" v-model:options="filterItemChopMU"
                        v-model:selected="filterItemChop" ref="filterItemChopDOM" />
                      <MDBSelect filter size="sm" class="mb-2  col-6" label="型號" v-model:options="filterItemModelMU"
                        v-model:selected="filterItemModel" ref="filterItemModelDOM" />
                      <MDBCol col="12" class="mb-2">
                        <MDBInput size="sm" type="text" label="序號" v-model="filterItemSN" />
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
        <MDBBtn color="primary" @click="setItemBtn">加入</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <!-- 選擇參考值量測作業 -->
    <MDBModal style="left: 66%;" @shown="shownPrjModal" v-model="showPrjFrom" staticBackdrop scrollable>
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
            <MDBCol col="12" class="border">
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
                        <MDBDatepicker size="sm" v-model="filterPrjPubDateStart" format="YYYY-MM-DD" label="發布日(起)"
                          ref="filterPrjPubDateStartDOM" />
                      </MDBCol>
                      <MDBCol col="6" class="mb-3">
                        <MDBDatepicker size="sm" v-model="filterPrjPubDateEnd" format="YYYY-MM-DD" label="發布日(迄)"
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
    <!-- record01表單 linear -->
    <MDBStepper linear @onChangeStep="onChangeStep">
      <MDBStepperForm>
        <MDBStepperStep active>
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                校正件
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol v-if="!isSMCam" col="12" class="border-bottom">
                    像機類型：
                    <MDBRadio tooltipFeedback required label="大像幅" value="1" v-model="nowCaseCamTypeID" inline name="caseCamType" />
                    <MDBRadio tooltipFeedback required label="中像幅" value="2" v-model="nowCaseCamTypeID" inline name="caseCamType" />
                  </MDBCol>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="showItemFrom = true">選擇校正件</MDBBtn>
                      <RouterLink target="_blank" :to="{ path: '/sicltab01' ,query:{ caseID: props.caseID }}">
                        <MDBBtn size="sm" color="primary">列印管理表</MDBBtn>
                      </RouterLink>
                      <RouterLink v-if="!isSMCam" target="_blank" :to="{ path: '/sicltab02' ,query:{ caseID: props.caseID }}">
                        <MDBBtn size="sm" color="primary">列印申請單</MDBBtn>
                      </RouterLink>
                      <RouterLink v-else target="_blank" :to="{ path: '/sicltab03' ,query:{ caseID: props.caseID }}">
                        <MDBBtn size="sm" color="primary">列印申請單</MDBBtn>
                      </RouterLink>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="廠牌" v-model="nowCaseItemChop" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="型號" v-model="nowCaseItemModel" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="序號" v-model="nowCaseItemSN" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="焦距(mm)" v-model="nowCaseFocal" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像主點_X" v-model="nowCasePPAx" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像主點_Y" v-model="nowCasePPAy" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像元數(rows)" v-model="nowCasePXh" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像元數(columns)" v-model="nowCasePXw" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像元尺寸_x(um)" v-model="nowCasePxSizeX" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="像元尺寸_y(um)" v-model="nowCasePxSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="感應器尺寸_x(mm)" v-model="nowCaseSizeX" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="感應器尺寸_y(mm)" v-model="nowCaseSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3 ps-0">
                    <MDBBtn size="sm" color="primary" @click="comSensorSize()">計算尺寸</MDBBtn>
                  </MDBCol>
                  <MDBCol col="12">
                    <MDBRow v-if="isSMCam">
                      <MDBCol col="4" class="mb-3">
                        <MDBInput tooltipFeedback required size="sm" type="text" label="畸變差糾正軟體" v-model="nowCaseDistSoft" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput tooltipFeedback required size="sm" type="text" label="軟體版本" v-model="nowCaseDistVer" />
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                飛航規劃
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="預定拍攝年(民國)" v-model="nowCasePlanY" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="預定拍攝月" v-model="nowCasePlanM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="地元尺寸GSD" v-model="nowCaseGSD" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="南北航線數" v-model="nowCaseStripsNS" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="東西航線數" v-model="nowCaseStripsEW" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="前後重疊率 %" v-model="nowCaseEndLap" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="側向重疊率 %" v-model="nowCaseSideLap" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="飛航橢球高(m)" v-model="nowCaseEllH" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required size="sm" type="text" label="飛航離地高AGL(m)" v-model="nowCaseAGL" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red;" class="border border-danger">※AGL = 橢球高 - 195 m</div>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 率定報告 -->
                  <MDBCol col="9" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="像機率定報告"
                      v-model="nowCaseCamReport">
                      <MDBBtnClose @click.prevent="nowCaseCamReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" id="itemCamReportUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('itemCamReportUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseCamReportDL" download size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 規劃圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="航線規劃圖"
                      v-model="nowCasePlanMap">
                      <MDBBtnClose @click.prevent="nowCasePlanMap =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".dwg" id="planMapUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('planMapUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCasePlanMapDL" download size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="2">
            送校
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker required size="sm" v-model="nowCaseRecDate" format="YYYY-MM-DD" label="送件日"
                  ref="nowCaseRecDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                航拍資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBDatepicker required size="sm" v-model="nowCaseFlyDate" format="YYYY-MM-DD " label="航拍日"
                      ref="nowCaseFlyDateDOM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput required size="sm" type="text" label="實際GSD(cm)" v-model="nowCaseGSDac" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際南北航線數" v-model="nowCaseStrNSac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際東西航線數" v-model="nowCaseStrEWac" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際前後重疊率(%)" v-model="nowCaseEndLapAc" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際側向重疊率(%)" v-model="nowCaseSideLapAc" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際橢球高(m)" v-model="nowCaseEllHac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="實際離地高AGL(m)" v-model="nowCaseAGLac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red;" class="border border-danger">※AGL = 橢球高 - 195 m</div>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 像機參數 -->
                  <MDBCol col="9" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="像機參數"
                      v-model="nowCaseCamUpload">
                      <MDBBtnClose @click.prevent="nowCaseCamUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" id="CamUploadUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('CamUploadUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseCamDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 航線圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="實際航線圖"
                      v-model="nowCaseFlyMapAc">
                      <MDBBtnClose @click.prevent="nowCaseFlyMapAc =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".dwg" id="FlyMapAcUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('FlyMapAcUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseFlyMapAcDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <!-- 航拍紀錄表 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="航拍紀錄表"
                      v-model="nowCaseRecTable">
                      <MDBBtnClose @click.prevent="nowCaseRecTable =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="RecTableUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('RecTableUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseRecTableDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <!-- 外方位紀錄檔 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="外方位紀錄檔"
                      v-model="nowCaseEO">
                      <MDBBtnClose @click.prevent="nowCaseEO =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol required col="3" class="px-0 mb-3">
                    <input type="file" id="EOUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('EOUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseEODL" download size="sm" color="secondary" >下載</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="送校影像數" v-model="nowCasePhotoNo" />
                  </MDBCol>
                  <div></div>
                  <!-- 設備佐證照片 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="設備佐證照片"
                      v-model="nowCaseOther">
                      <MDBBtnClose @click.prevent="nowCaseOther =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="OtherUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('OtherUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseOtherDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                異常註記
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBTextarea size="sm" label="資料異常註記" rows="2" v-model="nowCaseErrData" />
                  </MDBCol>
                  <MDBCol col="12" class="mb-3">
                    <MDBTextarea size="sm" label="影像異常註記" rows="2" v-model="nowCaseErrPhoto" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="3">
            校正
          </MDBStepperHead>
          <MDBStepperContent :key="updateKey">
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker required size="sm" v-model="nowCaseStartDate" format="YYYY-MM-DD" label="校正開始日"
                  ref="nowCaseStartDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                參考值
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="showPrjFrom = true">查詢量測作業</MDBBtn>
                    <MDBBtn size="sm" color="primary" @click="">產生參考值檔</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="量測作業編號" v-model="nowCaseRefPrjCode" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="發布日期" v-model="nowCaseRefPrjPublishDate" />
                  </MDBCol>
                  
                  <!-- 參考值檔 -->
                  <!-- <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="參考值檔"
                      v-model="nowCaseREFUpload">
                      <MDBBtnClose @click.prevent="nowCaseREFUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="REFUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('REFUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseREFUploadDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol> -->
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                量測紀錄
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol v-if="isSMCam" col="4" class="mt-3">
                    <MDBCheckbox label="是否已糾正影像" v-model="nowCaseUndist" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="6" class="my-3">
                    <MDBTextarea size="sm" label="刪除註記" rows="4" v-model="nowCaseDelCommt" />
                  </MDBCol>
                  <MDBCol col="6" class="my-3">
                    <MDBTextarea required size="sm" label="畸變差參數" rows="4" v-model="nowCaseDist" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                平差紀錄
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBInput required size="sm" type="text" label="自由網中誤差(um)" v-model="nowCaseFreeStd" />
                  </MDBCol>
                  <!-- 自由網專案檔 -->
                  <MDBCol col="5" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="自由網專案檔"
                      v-model="nowCaseFreeUpload">
                      <MDBBtnClose @click.prevent="nowCaseFreeUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" id="FreeUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('FreeUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseFreeUploadDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="強制網中誤差(um)" v-model="nowCaseFixStd" />
                  </MDBCol>
                  <!-- 強制網專案檔 -->
                  <MDBCol col="5" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="強制網專案檔"
                      v-model="nowCaseFixUpload">
                      <MDBBtnClose @click.prevent="nowCaseFixUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="FixUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('FixUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseFixUploadDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <!-- 控制點檔 -->
                  <!-- <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="控制點檔"
                      v-model="nowCaseGCPUpload">
                      <MDBBtnClose @click.prevent="nowCaseGCPUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="GCPUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('GCPUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseGCPUploadDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol> -->
                  <!-- 空三報表檔 -->
                  <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="空三報表檔"
                      v-model="nowCaseATreport">
                      <MDBBtnClose @click.prevent="nowCaseATreport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="ATreportUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('ATreportUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseATreportDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="使用影像數" v-model="nowCaseImgNo" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <RouterLink v-if="!isSMCam" target="_blank" :to="{ path: '/sicltab05' ,query:{ caseID: props.caseID }}">
                      <MDBBtn size="sm" color="primary">列印計算成果</MDBBtn>
                    </RouterLink>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="總點數" v-model="nowCaseTotPt" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="量測點數" v-model="nowCaseMeaPt" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="刪除點數" v-model="nowCaseDelPt" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="控制點數" v-model="nowCaseCrtNo" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="檢核點數" v-model="nowCaseChkNo" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="連結點數" v-model="nowCaseConnectNo" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="觀測量" v-model="nowCaseObsNo" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="多餘觀測量" v-model="nowCaseRedundancy" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="X-均方根(mm)" v-model="nowCaseRMSx" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="Y-均方根(mm)" v-model="nowCaseRMSy" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="Z-均方根(mm)" v-model="nowCaseRMSz" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="水平不確定度(mm)" v-model="nowCaseSTDh" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="高程不確定度(mm)" v-model="nowCaseSTDv" />
                  </MDBCol>
                  <div></div>
                  <!-- 計算成果表 -->
                  <!-- <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="計算成果表"
                      v-model="nowCaseRsultFile">
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <MDBBtn tag="a" :href="nowCaseRsultFileDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol> -->
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                作業紀錄
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 網形圖 -->
                  <MDBCol col="8" class="my-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="網形圖"
                      v-model="nowCaseNetGraph">
                      <MDBBtnClose @click.prevent="nowCaseNetGraph =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" id="NetGraphUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('NetGraphUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseNetGraphDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>
                  <!-- 點位分布圖 -->
                  <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="點位分布圖"
                      v-model="nowCaseGCPGraph">
                      <MDBBtnClose @click.prevent="nowCaseGCPGraph =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="GCPGraphUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('GCPGraphUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseGCPGraphDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>

                  <!-- 不確定度計算表 -->
                  <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="不確定度計算表"
                      v-model="nowCaseSTDExl">
                      <MDBBtnClose @click.prevent="nowCaseSTDExl =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="STDExlUpload" @change="uploadChenge" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="uploadBtn('STDExlUpload')">上傳</MDBBtn>
                    <MDBBtn tag="a" :href="nowCaseSTDExlDL" download size="sm" color="secondary">下載</MDBBtn>
                  </MDBCol>

                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="水平涵蓋因子" v-model="nowCaseKh" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput tooltipFeedback required readonly size="sm" type="text" label="高程涵蓋因子" v-model="nowCaseKv" />
                  </MDBCol>
                  <div></div>
                  <!-- 產生作業紀錄表 -->
                  <MDBCol col="8" class="mb-3">
                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="作業紀錄表範本"
                      v-model="nowCaseRecTemp">
                      <MDBBtnClose @click.prevent="nowCaseRecTemp =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" id="RecTemp" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">產生作業紀錄表</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
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
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>
                      <MDBCol col="12" class="my-3">
                        <MDBSwitch label="具TAF-LOGO" v-model="nowCaseHasLOGO" />
                      </MDBCol>
                      <!-- 選擇報告範本 -->
                      <MDBCol col="8" class="mb-3">
                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="報告範本"
                          v-model="nowCaseReportTemp">
                          <MDBBtnClose @click.prevent="nowCaseReportTemp =''" class="btn-upload-close" />
                        </MDBInput>
                      </MDBCol>
                      <MDBCol col="3" class="px-0 mb-3">
                        <input type="file" id="RecTemp" @change="" style="display: none;" />
                        <MDBBtn size="sm" color="primary" @click="">選擇範本</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="">產生報告</MDBBtn>
                      </MDBCol>

                      <!-- 報告編輯檔 -->
                      <MDBCol col="8" class="mb-3">
                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="報告編輯檔"
                          v-model="nowCaseReportEdit">
                          <MDBBtnClose @click.prevent="nowCaseReportEdit =''" class="btn-upload-close" />
                        </MDBInput>
                      </MDBCol>
                      <MDBCol col="3" class="px-0 mb-3">
                        <input type="file" id="REFUpload" @change="" style="display: none;" />
                        <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                        <MDBBtn tag="a" :href="nowCaseReportEditDL" download size="sm" color="secondary">下載</MDBBtn>
                      </MDBCol>

                      <MDBCol col="4" class="mb-3">
                        <MDBDatepicker required size="sm" v-model="nowCaseCompleteDate" format="YYYY-MM-DD" label="報告完成日"
                          ref="nowCaseCompleteDateDOM" />
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    檢核與簽署
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>
                      <SelectPs ref="selectPsData"/>
                      <!-- 校正報告掃描檔 -->
                      <MDBCol col="8" class="mb-3">
                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em;" size="sm" type="text" label="報告掃描檔"
                          v-model="nowCaseReportScan">
                          <MDBBtnClose @click.prevent="nowCaseReportScan =''" class="btn-upload-close" />
                        </MDBInput>
                      </MDBCol>
                      <MDBCol col="3" class="px-0 mb-3">
                        <input type="file" id="ReportScanUpload" @change="uploadChenge" style="display: none;" />
                        <MDBBtn size="sm" color="primary" @click="uploadBtn('ReportScanUpload')">上傳</MDBBtn>
                        <MDBBtn tag="a" :href="nowCaseReportScanDL" download size="sm" color="secondary">下載</MDBBtn>
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
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>
                      <iframe id="nowCasePDF-viewer" :src="nowCasePDFPath" style="height:calc(100vh - 16rem) ;" class="w-100"></iframe>
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
.was-validated .form-control:invalid, .form-control.is-invalid {
    margin-bottom: 0rem;
    background-image: none;
    border-color: #f93154;
}
.was-validated .form-control:valid, .form-control.is-valid {
    margin-bottom: 0rem;
    background-image: none;
    border-color: #00b74a;
}
.was-validated .form-check-input:invalid~.form-check-label, .form-check-input.is-invalid~.form-check-label {
    color: #f93154;
    margin-bottom: 0rem;
}
.was-validated .form-check-input:valid~.form-check-label, .form-check-input.is-valid~.form-check-label {
    color: #00b74a;
    margin-bottom: 0rem;
}
</style>
