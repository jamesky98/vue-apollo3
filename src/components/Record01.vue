<script setup>
import { ref } from "vue";
import path from "path-browserify";
import {
  MDBRadio,
  MDBInput,
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

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";
import router from '../router';
import { logIn, logOut, toTWDate } from '../methods/User';

DataTable.use(DataTableBs5);
DataTable.use(Select);

// 引入案件編號
const props = defineProps({
  caseID: String
});
// 案件詳細編輯資料==========start
  // 案件之詳細資料
  // 申請
  const isSMCam = ref(true);
  const nowCaseCamTypeID = ref(""); // 像機類型

  const nowCaseItemID = ref(""); // 校正件索引
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
  const nowCasePlanMap = ref(""); // 航線規劃圖
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
  const nowCaseFlyMapAc = ref(""); // 實際航線規劃圖
  const nowCaseRecTable = ref(""); // 影像檢核紀錄表
  const nowCaseEO = ref(""); //外方位資料檔
  const nowCasePhotoNo = ref(""); //送校影像數
  const nowCaseOther = ref(""); //設備佐證照片
  const nowCaseErrData = ref(""); // 送校資料異常註記
  const nowCaseErrPhoto = ref(""); // 送校影像異常註記
  // 校正
  const nowCaseStartDate = ref(""); //開始校正日
  const nowCaseStartDateDOM = ref();

  const nowCaseRefPrjID = ref(""); // 參考值索引
  const nowCaseRefPrjCode = ref(""); // 參考值編號
  const nowCaseRefPrjPublishDate = ref(""); // 參考值發布日期

  const nowCaseREFUpload = ref(""); // 參考值檔
  const nowCaseGCPUpload = ref(""); // 控制點檔
  const nowCaseTotPt = ref(""); //總點數
  const nowCaseMeaPt = ref(""); //量測點數
  const nowCaseDelPt = ref(""); //刪除點數
  const nowCaseDelCommt = ref(""); //刪除註記
  const nowCaseDist = ref(""); // 畸變差參數
  const nowCaseFreeStd = ref(""); //自由網中誤差
  const nowCaseFreeUpload = ref(""); //自由網專案檔
  const nowCaseFixStd = ref(""); // 強制網中誤差
  const nowCaseFixUpload = ref(""); // 強制網專案檔
  const nowCaseImgNo = ref(""); // 使用影像數
  const nowCaseUndist = ref(false); // 是否已糾正影像
  const nowCaseCrtNo = ref(""); // 控制點數
  const nowCaseChkNo = ref(""); // 檢核點數
  const nowCaseATreport = ref(""); // 空三報表檔
  const nowCaseConnectNo = ref(""); // 連結點數
  const nowCaseObsNo = ref(""); // 觀測量
  const nowCaseRedundancy = ref(""); // 多於觀測量
  const nowCaseRMSx = ref(""); // X-均方根
  const nowCaseRMSy = ref(""); // Y-均方根
  const nowCaseRMSz = ref(""); // Z-均方根
  const nowCaseRsultFile = ref(""); // 計算成果表
  const nowCaseNetGraph = ref(""); //網形圖
  const nowCaseGCPGraph = ref(""); //點位分布圖
  const nowCaseSTDh = ref(""); //水平較差均方根
  const nowCaseSTDv = ref(""); //高程較差均方根
  const nowCaseKh = ref(""); //水平涵蓋因子
  const nowCaseKv = ref(""); //高程涵蓋因子
  const nowCaseSTDExl = ref(""); //不確定度計算表
  const nowCaseRecTemp = ref(""); //作業紀錄表範本
  // 出具報告
  const nowCaseHasLOGO = ref(true); //列印TAF LOGO
  const nowCaseReportTemp = ref(""); //校正報告範本
  const nowCaseReportEdit = ref(""); //校正報告編輯檔
  const nowCaseCompleteDate = ref(""); //報告(列印)日期
  const nowCaseChkDate = ref(""); // 數據檢核日
  const nowCaseChkPersonID = ref(""); //數據檢核人
  const nowCaseSignDate = ref(""); // 報告簽署日
  const nowCaseSignPersonID = ref(""); // 報告簽署人
  
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
    nowCaseRecDate.value = toTWDate(getData.receive_date);
    nowCaseFlyDate.value = toTWDate(getData.fly_date);
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
    // nowCaseEO.value = 
    nowCasePhotoNo.value = getData.photo_no;
    nowCaseOther.value = getData.others;
    nowCaseErrData.value = getData.err_data;
    nowCaseErrPhoto.value = getData.err_photo;
    // 校正
    nowCaseStartDate.value = toTWDate(getData.start_Date);
    nowCaseRefPrjID.value = getData.ref_id;
    nowCaseRefPrjCode.value = (getData.ref_project)?getData.ref_project.project_code:"";
    nowCaseRefPrjPublishDate.value = (getData.ref_project) ?toTWDate(getData.ref_project.publish_date):"";
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
    // 出具報告
    nowCaseHasLOGO.value = getData.has_logo;
    nowCaseReportTemp.value = getData.report_template;
    nowCaseReportEdit.value = getData.report_edit;
    nowCaseCompleteDate.value = toTWDate(getData.complete_date);
    nowCaseChkDate.value = toTWDate(getData.chk_date);
    nowCaseChkPersonID.value = getData.chk_person_id;
    nowCaseSignDate.value = toTWDate(getData.sign_date);
    nowCaseSignPersonID.value = getData.sign_person_id;
  }
});
refgetNowCaseF();

function comSensorSize(){
  nowCaseSizeX.value = (parseFloat(nowCasePxSizeX.value) * parseFloat(nowCasePXw.value)/1000).toFixed(4);
  nowCaseSizeY.value = (parseFloat(nowCasePxSizeY.value) * parseFloat(nowCasePXh.value) / 1000).toFixed(4);
}

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
// const selItemTypeName = computed(() => {
//   let getData = selItemList.value.filter((x) => {
//     return parseInt(x.id) === selItemTypeID.value;
//   })[0];
//   return (getData) ? getData.type : "";
// });

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
    <!-- record01表單 linear -->
    <MDBStepper linear>
      <MDBStepperForm>
        <MDBStepperStep active>
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="12" class="border my-3">
                像機類型：
                <MDBRadio label="大像幅" value="1" v-model="nowCaseCamTypeID" inline name="caseCamType" />
                <MDBRadio label="中像幅" value="2" v-model="nowCaseCamTypeID" inline name="caseCamType" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                校正件
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="showItemFrom = true">查詢校正件</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required disabled size="sm" type="text" label="廠牌" v-model="nowCaseItemChop" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required disabled size="sm" type="text" label="型號" v-model="nowCaseItemModel" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required disabled size="sm" type="text" label="序號" v-model="nowCaseItemSN" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="焦距" v-model="nowCaseFocal" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像主點_X" v-model="nowCasePPAx" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像主點_Y" v-model="nowCasePPAy" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像元數(rows)" v-model="nowCasePXh" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像元數(columns)" v-model="nowCasePXw" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像元尺寸_x(um)" v-model="nowCasePxSizeX" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput required size="sm" type="text" label="像元尺寸_y(um)" v-model="nowCasePxSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="感應器尺寸_x(mm)" v-model="nowCaseSizeX" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="感應器尺寸_y(mm)" v-model="nowCaseSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3 ps-0">
                    <MDBBtn size="sm" color="primary" @click="comSensorSize()">計算尺寸</MDBBtn>
                  </MDBCol>
                  <MDBCol col="12">
                    <MDBRow v-if="isSMCam">
                      <MDBCol col="4" class="mb-3">
                        <MDBInput required size="sm" type="text" label="畸變差糾正軟體" v-model="nowCaseDistSoft" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput required size="sm" type="text" label="軟體版本" v-model="nowCaseDistVer" />
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
                    <MDBInput required size="sm" type="text" label="預定拍攝年(民國)" v-model="nowCasePlanY" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput required size="sm" type="text" label="預定拍攝月" v-model="nowCasePlanM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput required size="sm" type="text" label="地元尺寸GSD" v-model="nowCaseGSD" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="南北航線數" v-model="nowCaseStripsNS" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="東西航線數" v-model="nowCaseStripsEW" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="前後重疊率 %" v-model="nowCaseEndLap" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="側向重疊率 %" v-model="nowCaseSideLap" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="飛航橢球高(m)" v-model="nowCaseEllH" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required size="sm" type="text" label="飛航離地高AGL(m)" v-model="nowCaseAGL" />
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
                    <MDBInput required style="padding-right: 2.2em;" size="sm" type="text" readonly label="像機率定報告"
                      v-model="nowCaseCamReport">
                      <MDBBtnClose @click.prevent="nowCaseCamReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" accept=".pdf" id="itemCamReportUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 規劃圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput required style="padding-right: 2.2em;" size="sm" type="text" readonly label="航線規劃圖"
                      v-model="nowCasePlanMap">
                      <MDBBtnClose @click.prevent="nowCasePlanMap =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="itemCamPlanUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
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
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker size="sm" v-model="nowCaseRecDate" format=" YYYY-MM-DD " label="送件日"
                  ref="nowCaseRecDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                航拍資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBDatepicker size="sm" v-model="nowCaseFlyDate" format=" YYYY-MM-DD " label="航拍日"
                      ref="nowCaseFlyDateDOM" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="實際GSD(cm)" v-model="nowCaseGSDac" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際南北航線數" v-model="nowCaseStrNSac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際東西航線數" v-model="nowCaseStrEWac" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際前後重疊率(%)" v-model="nowCaseEndLapAc" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際側向重疊率(%)" v-model="nowCaseSideLapAc" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際橢球高(m)" v-model="nowCaseEllHac" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="實際離地高AGL(m)" v-model="nowCaseAGLac" />
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
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="像機參數"
                      v-model="nowCaseCamUpload">
                      <MDBBtnClose @click.prevent="nowCaseCamUpload =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" accept=".pdf" id="CamUploadUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 航線圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="實際航線圖"
                      v-model="nowCaseFlyMapAc">
                      <MDBBtnClose @click.prevent="nowCaseFlyMapAc =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="FlyMapAcUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <!-- 航拍紀錄表 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="航拍紀錄表"
                      v-model="nowCaseRecTable">
                      <MDBBtnClose @click.prevent="nowCaseRecTable =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="FlyMapAcUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <!-- 外方位紀錄檔 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="外方位紀錄檔"
                      v-model="nowCaseEO">
                      <MDBBtnClose @click.prevent="nowCaseEO =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="EOUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="送校影像數" v-model="nowCasePhotoNo" />
                  </MDBCol>
                  <div></div>
                  <!-- 設備佐證照片 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="設備佐證照片"
                      v-model="nowCaseOther">
                      <MDBBtnClose @click.prevent="nowCaseOther =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="OtherUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
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
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="4" class="my-3">
                <MDBDatepicker size="sm" v-model="nowCaseStartDate" format=" YYYY-MM-DD " label="校正開始日"
                  ref="nowCaseStartDateDOM" />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                參考值
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required disabled size="sm" type="text" label="廠牌" v-model="nowCaseItemChop" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="showItemFrom = true">查詢校正件</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput required disabled size="sm" type="text" label="型號" v-model="nowCaseItemModel" />
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
          <MDBStepperContent>
            報告內容01
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
</style>
