<script setup>
import { ref, inject } from "vue";
import {
  MDBInput,
  MDBCol,  MDBRow,  MDBContainer,
  MDBBtn,
} from 'mdb-vue-ui-kit';
import { useMutation } from "@vue/apollo-composable";
import PrjGQL from "../graphql/Prj";

import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import Select from "datatables.net-select";
import { computed } from "@vue/reactivity";
import router from "../router";
import { errorHandle, toTWDate } from "../methods/User";

DataTable.use(DataTableBs5);
DataTable.use(Select);

//#region 參數==========start
  // 上層參數
  const nowCaseCalType = inject("nowCaseCalType");

  // 參考值列表
  const nowCaseRefPrjID = inject("nowCaseRefPrjID"); // 量測作業索引
  const nowCaseRefPrjCode = inject("nowCaseRefPrjCode"); // 量測作業編號編號
  const nowCaseRefPrjPublishDate = inject("nowCaseRefPrjPublishDate"); // 參考值發布日期
  const seletPrjPublishDate = computed(()=>{
    return (nowCaseRefPrjPublishDate.value.trim())?toTWDate(nowCaseRefPrjPublishDate.value):""
  });

  const selPrjYear = ref("");
  const selPrjMounth = ref("");
  const selPrjCalType = ref("");
  const selPrjMethod = ref("");
  const selPrjOrg = ref("");
  const selPrjStartDate = ref("");
  const selPrjEndDate = ref("");
//#endregion 參數==========End

//#region 參考值列表=========start
  let dtPrj;
  const tablePrj = ref();
  const dataPrj = ref([]);
  // 設定表格tablePrj
  const columnsPrj = [
    { data: "id", title: "索引", defaultContent: "-" },
    { data: "project_code", title: "編號", defaultContent: "-" },
    { data: "cal_type.name", title: "校正項目", defaultContent: "-" },
    { data: "publish_date", title: "發布日", defaultContent: "-", render: (data) => { return toTWDate(data); } },
    { data: "method", title: "類型", defaultContent: "-" },
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
      nowCaseRefPrjID.value = getData.id;
      nowCaseRefPrjCode.value = getData.project_code;
      nowCaseRefPrjPublishDate.value = (getData.publish_date)?getData.publish_date.split("T")[0]:" ";

      selPrjYear.value = getData.year;
      selPrjMounth.value = getData.month;
      selPrjCalType.value = getData.cal_type.name;
      selPrjMethod.value = getData.method;
      selPrjOrg.value = getData.organizer;
      selPrjStartDate.value = (getData.start_date)?toTWDate(getData.start_date):"";
      selPrjEndDate.value = (getData.end_date)?toTWDate(getData.end_date):"";
    });
    refgetAllPrj().then(res=>{
      // 選擇原作業
      // console.log('nowCaseRefPrjID',nowCaseRefPrjID.value)
      if(nowCaseRefPrjID.value){
        dtPrj.rows(function(idx,data,node){
          // console.log('data_id: ',data.id);
          return parseInt(data.id) === parseInt(nowCaseRefPrjID.value)? true:false
        }).select();
      }
    });
  }

  // 更多編輯=>引導至校正件管理
  function gotoPrjMG() {
    router.push('/prjs');
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
        <MDBRow>
          <MDBCol  col="12" class="my-2">
            <MDBBtn size="sm" color="primary" @click="gotoPrjMG">量測作業管理</MDBBtn>
          </MDBCol>
          <MDBCol col="12" class="mb-2">
            目前選擇：{{nowCaseRefPrjID}}
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="作業編號" v-model="nowCaseRefPrjCode" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="年" v-model="selPrjYear" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="月" v-model="selPrjMounth" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="校正項目" v-model="selPrjCalType" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="作業方式" v-model="selPrjMethod" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="作業機關" v-model="selPrjOrg" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="開始日" v-model="selPrjStartDate" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="結束日" v-model="selPrjEndDate" />
          </MDBCol>
          <MDBCol col="4" class="mb-2">
            <MDBInput disabled size="sm" type="text" label="發布日" v-model="seletPrjPublishDate" />
          </MDBCol>
        </MDBRow>
        

      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>