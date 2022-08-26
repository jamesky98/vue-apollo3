<script setup>
import { ref } from "vue";
import path from "path-browserify";
import {
  MDBInput,
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

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";
import router from '../router'

DataTable.use(DataTableBs5);
DataTable.use(Select);

// 引入案件編號
const props = defineProps({
  caseID: String
});
// 案件詳細編輯資料==========start
  // 案件之詳細資料
  const isFullPara = ref(true);
  const switchLabel = computed(() => {
    return (isFullPara.value)?"具完整規格":"具整合精度";
  });
  const nowCaseItemID = ref(""); // 校正件索引
  const nowCaseItemChop = ref(""); // 光達廠牌
  const nowCaseItemModel = ref(""); // 光達型號
  const nowCaseItemSN = ref(""); // 光達序號

  const nowCaseParaType = ref("");  // 規格參數類型1:各項均有 2:整合精度

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
  const nowCasePosReport = ref(""); // POS規格
  const nowCasePlanMap = ref(""); // 航線規劃圖

  // 查詢Record02資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID.case_record_02) {
    // 填入資料
    let getData = result.data.getCasebyID.case_record_02;
    let getItem = result.data.getCasebyID.item_base;
    let getGNSS = result.data.getCasebyID.case_record_02.item_base_case_record_02_gnss_idToitem_base;
    let getIMU = result.data.getCasebyID.case_record_02.item_base_case_record_02_imu_idToitem_base;
    // 校正件資料
    nowCaseItemChop.value = (getItem) ? getItem.chop : "";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
    // 參數型態
    nowCaseParaType.value = getData.type;
    (getData.type === 1) ? isFullPara.value = true : isFullPara.value = false;

    // LiDAR規格
    nowCaseLrDisPrs.value = getData.dis_presision;
    nowCaseLrAngResol.value = getData.ang_resolution;
    nowCaseLrBeam.value = getData.beam;
    // GNSS規格
    nowCaseGnssChop.value = (getGNSS) ? getGNSS.chop:"";
    nowCaseGnssModel.value = (getGNSS) ? getGNSS.model : "";
    nowCaseGnssSN.value = (getGNSS) ? getGNSS.serial_number : "";
    nowCaseGnssPrcH.value = getData.prec_h; // 等同整合型平面精度
    nowCaseGnssPrcV.value = getData.prec_v; // 等同整合型高程精度
    // IMU規格
    nowCaseImuChop.value = (getIMU) ? getIMU.chop:"";
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
  }
});
refgetNowCaseF();
// 案件詳細編輯資料==========end

// 校正件列表=========start
let dtItem;
const iType = ref("");  // 選擇儀器類型2:光達 3:GNSS 4:IMU

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
  } else {
    selItemChop.value = "";
    selItemModel.value = "";
    selItemSN.value = "";
    if (selItemTypeDOM.value){
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

  switch (iType.value){
    case 2:
      if (nowCaseItemID.value) {
        seletItemId.value = nowCaseItemID.value;
        refgetselItem();
      }
      break;
    case 3:
      if (nowCaseGnssID.value) {
        seletItemId.value = nowCaseGnssID.value;
        refgetselItem();
      }
      break;
    case 4:
      if (nowCaseImuID.value) {
        seletItemId.value = nowCaseImuID.value;
        refgetselItem();
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
function gotoItemMG() {
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
  switch (iType.value){
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


function showItemFromBtn(x){
  let where = {};
  iType.value = x;
  where.type = iType.value;
  varAllItem.value = where;
  showItemFrom.value = true;
}

// 校正件列表=========end


defineExpose({
  nowCaseItemID,
  saveRecord02 (){

  }
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
    <!-- record02表單 -->
    <MDBStepper>
      <MDBStepperForm>
        <MDBStepperStep active>
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="12" class="mt-3 rounded-top-5 bg-info text-white">
                校正件
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="showItemFromBtn(2)">查詢校正件</MDBBtn>
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
              <MDBCol col="12">
                <MDBSwitch :label="switchLabel" v-model="isFullPara" />
              </MDBCol>
              <MDBCol v-show="isFullPara">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    各項參數
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>
                      <MDBCol col="4" class="mb-3">
                        LiDAR規格
                      </MDBCol>
                      <div></div>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label="雷射測距精度(mm)" v-model="nowCaseLrDisPrs" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label='掃描角解析度Resolution(")' v-model="nowCaseLrAngResol" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label='掃描發散角Beam(")' v-model="nowCaseLrBeam" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBRow>
                          <MDBCol col="6">GNSS規格</MDBCol>
                          <MDBCol col="6">
                            <MDBBtn size="sm" color="primary" @click="showItemFromBtn(3)">查詢GNSS</MDBBtn>
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
                        <MDBInput size="sm" type="text" label="平面定位精度(mm)" v-model="nowCaseGnssPrcH" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label="高程定位精度(mm)" v-model="nowCaseGnssPrcV" />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="4" class="mb-3">
                        <MDBRow>
                          <MDBCol col="6">IMU規格</MDBCol>
                          <MDBCol col="6">
                            <MDBBtn size="sm" color="primary" @click="showItemFromBtn(4)">查詢GNSS</MDBBtn>
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
                        <MDBInput size="sm" type="text" label='Omega精度(")' v-model="nowCaseImuOmg" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label='Phi精度(")' v-model="nowCaseImuPhi" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label='Kappa精度(")' v-model="nowCaseImuKap" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label='姿態角解析度(")' v-model="nowCaseImuPrcO" />
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
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>


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
                    <MDBInput size="sm" type="text" label="預定拍攝年(民國)" v-model="nowCasePlanY" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="預定拍攝月" v-model="nowCasePlanM" />
                  </MDBCol>

                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="航帶總數" v-model="nowCaseStrips" />
                  </MDBCol>

                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="飛航橢球高" v-model="nowCaseEllH" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="飛航離地高(AGL)" v-model="nowCaseAGL" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red;" class="border border-danger">※AGL = 橢球高 - 195 m</div>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="點雲密度" v-model="nowCasePtDensity" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="FOV" v-model="nowCaseFOV" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 光達規格 -->
                  <MDBCol col="9" class="my-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="光達規格"
                      v-model="nowCaseLrReport">
                      <MDBBtnClose @click.prevent="nowCaseLrReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-3">
                    <input type="file" accept=".pdf" id="itemLrReportUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- POS規格 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="POS規格"
                      v-model="nowCasePosReport">
                      <MDBBtnClose @click.prevent="nowCasePosReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="itemPOSReportUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 規劃圖 -->
                  <MDBCol col="9" class="mb-3">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="航線規劃圖"
                      v-model="nowCasePlanMap">
                      <MDBBtnClose @click.prevent="nowCasePlanMap =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-3">
                    <input type="file" accept=".pdf" id="itemLrPlanUpload" @change="" style="display: none;" />
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
            送校內容02
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="3">
            校正
          </MDBStepperHead>
          <MDBStepperContent>
            校正內容02
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="4">
            出具報告
          </MDBStepperHead>
          <MDBStepperContent>
            報告內容02
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
