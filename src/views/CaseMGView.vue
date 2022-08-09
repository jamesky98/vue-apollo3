<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import path from "path-browserify";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBIcon
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

DataTable.use(DataTableBs5);
DataTable.use(Select);

// 案件列表=========start
  let dt1;
  const table1 = ref(); 
  const data1 = ref([]);

  // 加載表格選取事件
  onMounted(function () {
    dt1 = table1.value.dt();

    dt1.on('select', function (e, dt, type, indexes) {
      updateCaseContext(e, dt, type, indexes);
    });
  });

  // 案件資料顯示更新
  function updateCaseContext(e, dt, type, indexes) {
    if (type === 'row') {
      let getCaseData = dt.rows(indexes).data()[0];
    }
  }

  // 設定表格table1
  const columns1 = [
    {
      data: "status_code", title: "狀態", defaultContent: "-", className: "colnowarp", render: (data,type,row) => {
        let markicon="";
        let color="";
        let bcolor="";
        switch (data) {
          case 9: //退件
            markicon = '<i class="fas fa-reply-all"></i>';
            color = "#DE3163"
            bcolor ="antiquewhite";
            break;
          case 8: //補件
            markicon = '<i class="fas fa-history"></i>';
            color = "#DE3163"
            bcolor = "antiquewhite";
            break;
          case 7: //結案
            markicon = '<i class="fas fa-check"></i>';
            color = "green"
            bcolor = "white";
            break;
          case 6: //待繳費
            markicon = '<i class="fas fa-donate"></i>';
            color = "#F39C12"
            bcolor = "white";
            break;
          case 5: //陳核
            markicon = '<i class="fas fa-paste"></i>';
            color = "#6495ED"
            bcolor = "white";
            break;
          case 4: //校正中
            markicon = '<i class="fas fa-play"></i>';
            color = "#6495ED"
            bcolor = "white";
            break;
          case 3: //待送件
            markicon = '<i class="fas fa-hourglass-start"></i>';
            color = "#FF7F50"
            bcolor = "white";
            break;
          case 2: //審核中
            markicon = '<i class="fas fa-glasses"></i>';
            color = "#FF7F50"
            bcolor = "white";
            break;
          case 1: //(空)
            markicon = '<i class="fas fa-exclamation-circle"></i>';
            color = "Gray"
            bcolor = "white";
        }
        // console.log(row);
        return "<span style='color: " + color +"; background-color:"+ bcolor +"' >" + markicon + row.case_status.status + "</span>"
      }
    },
    
    { data: "id", title: "案件編號", defaultContent: "-" },
    { data: "cal_type", title: "校正項目編號", defaultContent: "-", visible: false },
    { data: "cal_type_cal_typeTocase_base.name", title: "校正項目名稱", defaultContent: "-", visible: false },
    { data: "cal_type_cal_typeTocase_base.code", title: "校正項目代碼", defaultContent: "-", render: (data, type, row) => {
      let markicon = "";
      let color = "";
      let bcolor = "";
      switch (data) {
        case "F": //航測像機
          markicon = '<i class="fas fa-plane-departure"></i>';
          color = "#6495ED"
          bcolor = "white";
          break;
        case "I": //空載光達
          markicon = '<i class="fas fa-wifi"></i>';
          color = "#229954"
          bcolor = "white";
          break;
        case "J": //小像幅
          markicon = '<i class="fas fa-camera"></i>';
          color = "#FF7F50"
          bcolor = "white";
          break;
      }
      return "<span style='color: " + color + "; background-color:" + bcolor + "' >" + markicon + row.cal_type_cal_typeTocase_base.name + "</span>"
      }
    },
    { data: "operators_id", title: "校正人員編號", defaultContent: "-", visible: false },
    { data: "employee_case_base_operators_idToemployee.name", title: "校正人員", defaultContent: "-" },
    {
      data: "app_date", title: "申請日", defaultContent: "-", render: (data) => {
        return toTWDate(data);
      }
    },
    {
      data: "charge", title: "費用", className: "colAlignRight", defaultContent: "-", 
      render: function (data, type) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(data)
      } 
    },
    {
      data: "pay_date", title: "繳費日", defaultContent: "-", render: (data) => {
        return toTWDate(data);
      }
    },
    { data: "cus.cus_org.name", title: "顧客名稱", defaultContent: "-" },
    
    { data: "item_base.chop", title: "廠牌", defaultContent: "-" },
    { data: "item_base.model", title: "型號", defaultContent: "-" },
    { data: "item_base.serial_number", title: "序號", defaultContent: "-" },
    { data: "agreement", title: "協議事項", defaultContent: "-", visible: true },
    // { data: "cus.name", title: "聯絡人", defaultContent: "-", visible: false },
    // { data: "cus.tel", title: "顧客電話", defaultContent: "-", visible: false },
    // { data: "cus.org_id", title: "公司編號", defaultContent: "-", visible: false },
    // { data: "cus.cus_org.tax_id", title: "公司統編", defaultContent: "-", visible: false },
    // { data: "cus_id", title: "顧客編號", defaultContent: "-", visible: false },
    // { data: "cus.address", title: "顧客地址", defaultContent: "-", visible: false },
    // { data: "cus.fax", title: "顧客傳真", defaultContent: "-", visible: false },
    // { data: "title", title: "報告抬頭", defaultContent: "-", visible: false },
    // { data: "address", title: "報告地址", defaultContent: "-", visible: false },
    // { data: "purpose", title: "校正目的", defaultContent: "-", visible: false },
    // { data: "item_id", title: "儀器代碼", defaultContent: "-", visible: false },
    // { data: "leader_id", title: "技術主管編號", defaultContent: "-", visible: false },
    // { data: "employee_case_base_leader_idToemployee.name", title: "技術主管", defaultContent: "-", visible: false },
    // { data: "case_status.status", title: "狀態名稱", defaultContent: "-", visible: false },
  ];
  const tboption1 = {
    dom: 'ti',
    select: {
      style: 'single',
      info: false
    },
    order: [[1, 'desc']],
    scrollY: '55vh',
    scrollX: true,
    lengthChange: false,
    searching: false,
    paging: false,
    responsive: true,
    language: {
      info: '共 _TOTAL_ 筆資料',
    }
  };

  function toTWDate(data){
    let ttdate = "";
    if (data) {
      ttdate = data.split("T")[0];
      let dateObj = new Date(ttdate);
      let year = dateObj.getFullYear() - 1911;
      let month = ((dateObj.getMonth() + 1) < 10) ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
      let date = (dateObj.getDate() < 10) ? "0" + dateObj.getDate() : dateObj.getDate();
      // console.log(dateObj.getMonth());
      ttdate = year + "/" + month + "/" + date
    }
    return ttdate;
  }

  // 查詢案件資料
  const { result: allCase, loading: lodingAllCase, variables: varAllCase, onResult: getAllCase, refetch: refgetAllCase } = useQuery(
    CaseGQL.GETALLCASE,
  );

  getAllCase(result => {
    // 加入table1資料
    if (!result.loading) {
      data1.value = result.data.getAllCase;
    }
  });
  refgetAllCase();
// 案件列表=========end
// 篩選=========start
  // 案件狀態
  const caseStatusMU = ref([]);
  const caseStatusSEL = ref("");
  const caseStatusFilter=ref();
  // 案件編號
  const caseIDSEL=ref("");
  // 校正項目
  const caseTypeMU = ref([]);
  const caseTypeSEL = ref("");
  const caseTypeFilter = ref();
  // 校正人員
  const caseOptMU = ref([]);
  const caseOptSEL = ref("");
  const caseOptFilter = ref();
  // 顧客公司
  const caseCustMU = ref([]);
  const caseCustSEL = ref("");
  const caseCustFilter = ref();
  // 廠牌
  const caseChopMU = ref([]);
  const caseChopSEL = ref("");
  const caseChopFilter = ref();
  // 型號
  const caseModelMU = ref([]);
  const caseModelSEL = ref("");
  const caseModelFilter = ref();
  // 序號
  const caseSelnumSEL = ref("");
  // 申請日
  const caseAppDateStartSEL = ref("");
  const caseAppDateStartFilter = ref();
  const caseAppDateEndtSEL = ref("");
  const caseAppDateEndFilter = ref();
  // 繳費日
  const casePayDateStartSEL = ref("");
  const casePayDateStartFilter = ref();
  const casePayDateEndtSEL = ref("");
  const casePayDateEndFilter = ref();
  // 執行篩選
  function caseDoFilter(){

  }
  // 清除條件
  function caseClearFilter() {

  }
// 篩選=========end


</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBContainer tag="main" fluid class="flex-grow-1">
        <MDBRow class="d-flex flex-md-column h-100 border">
          <!-- 左方列表 -->
          <MDBCol md="8" class="h-100 border">
            <!-- 上方列表 -->
            <MDBRow md="12" class="h-75 overflow-auto border">
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBRow>
            <!-- 下方篩選 -->
            <MDBRow md="12" class="flex-grow-1 overflow-auto">
              <div class="mb-3 d-flex">
                <div class="flex-grow-1">篩選條件</div>
                <div>
                  <MDBBtn size="sm" color="primary" @click="caseClearFilter">清除</MDBBtn>
                  <MDBBtn size="sm" color="primary" @click="caseDoFilter">篩選</MDBBtn>
                </div>
              </div>
              <MDBSelect size="sm" class="mb-3 col-3" label="案件狀態" v-model:options="caseStatusMU"
                v-model:selected="caseStatusSEL" ref="caseStatusFilter" />
              <MDBCol col="3" class="mb-3">
                <MDBInput size="sm" type="text" label="案件編號" v-model="caseIDSEL" />
              </MDBCol>
              <MDBSelect size="sm" class="mb-3  col-3" label="校正項目" v-model:options="caseTypeMU"
                v-model:selected="caseTypeSEL" ref="caseTypeFilter" />
              <MDBSelect filter size="sm" class="mb-3  col-3" label="校正人員" v-model:options="caseOptMU"
                v-model:selected="caseOptSEL" ref="caseOptFilter" />
              <MDBSelect filter size="sm" class="mb-3  col-3" label="顧客" v-model:options="caseCustMU"
                v-model:selected="caseCustSEL" ref="caseCustFilter" />
              <MDBSelect filter size="sm" class="mb-3  col-3" label="廠牌" v-model:options="caseChopMU"
                v-model:selected="caseChopSEL" ref="caseChopFilter" />
              <MDBSelect filter size="sm" class="mb-3  col-3" label="型號" v-model:options="caseModelMU"
                v-model:selected="caseModelSEL" ref="caseModelFilter" />
              <MDBCol col="3" class="mb-3">
                <MDBInput size="sm" type="text" label="序號" v-model="caseSelnumSEL" />
              </MDBCol>
              <MDBCol col="3" class="mb-3">
                <MDBDatepicker size="sm" v-model="caseAppDateStartSEL" format=" YYYY-MM-DD " label="申請日(起)"
                  ref="caseAppDateStartFilter" />
              </MDBCol>
              <MDBCol col="3" class="mb-3">
                <MDBDatepicker size="sm" v-model="caseAppDateEndtSEL" format=" YYYY-MM-DD " label="申請日(迄)"
                  ref="caseAppDateEndFilter" />
              </MDBCol>
              <MDBCol col="3" class="mb-3">
                <MDBDatepicker size="sm" v-model="casePayDateStartSEL" format=" YYYY-MM-DD " label="繳費日(起)"
                  ref="casePayDateStartFilter" />
              </MDBCol>
              <MDBCol col="3" class="mb-3">
                <MDBDatepicker size="sm" v-model="casePayDateEndtSEL" format=" YYYY-MM-DD " label="繳費日(迄)"
                  ref="casePayDateEndFilter" />
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 右方案件資料 -->
          <MDBCol md="4" class="h-100 border">
            案件資料
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <!-- 頁腳 -->
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.colAlignRight{
  text-align: right;
}
</style>
