<script setup>
import { ref, provide, inject, unref } from "vue";
import {
  MDBInput,  MDBSwitch,  MDBTextarea,
  MDBCol,  MDBRow,  MDBContainer,
  MDBSelect,  MDBDatepicker,  MDBBtn,  MDBBtnClose,
  MDBStepper,  MDBStepperStep,  MDBStepperHead,  MDBStepperContent,  MDBStepperForm,
  MDBModal,  MDBModalHeader,  MDBModalTitle,  MDBModalBody,  MDBModalFooter,
  MDBTabs,  MDBTabNav,  MDBTabContent,  MDBTabItem,  MDBTabPane,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from "@vue/apollo-composable";
import PrjGQL from "../graphql/Prj";

import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import Select from "datatables.net-select";
import { computed } from "@vue/reactivity";
import router from "../router";
import { errorHandle, logIn, logOut, toTWDate } from "../methods/User";
import { useStore } from 'vuex'
import { 
  monthsFull, 
  monthsShort, 
  weekdaysFull, 
  weekdaysShort,
  weekdaysNarrow
} from "../methods/datePickerParams.js"

DataTable.use(DataTableBs5);
DataTable.use(Select);

//#region 參數==========start
  // 上層參數
  const nowCaseCalType = inject("nowCaseCalType");

  // 參考值列表
  // const showPrjFrom = ref(false);
  const prjTabId = ref("prjFilter");

  const seletPrjID = inject("seletPrjID");
  const seletPrjCode = inject("seletPrjCode");
  const seletPrjPublishDate = inject("seletPrjPublishDate");

  const filterPrjCode = ref("");

  const filterPrjPubDateStart = ref("");
  const filterPrjPubDateStartDOM = ref();

  const filterPrjPubDateEnd = ref("");
  const filterPrjPubDateEndDOM = ref();

//#endregion 參數==========End

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
//#endregion 參考值列表=========end

defineExpose({
  shownPrjModal,
});

</script>
<template>
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
</template>