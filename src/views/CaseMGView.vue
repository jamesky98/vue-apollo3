<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import path from "path-browserify";
import {
  MDBInput,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBPopconfirm,
  MDBIcon,
  MDBAnimation,
  MDBAlert,
  MDBStepper, 
  MDBStepperStep, 
  MDBStepperHead, 
  MDBStepperContent, 
  MDBStepperForm,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

DataTable.use(DataTableBs5);
DataTable.use(Select);

// Information
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");

// 案件列表=========start
  let dt1;
  const table1 = ref(); 
  const data1 = ref([]);

  // 加載表格選取事件
  onMounted(function () {
    dt1 = table1.value.dt();
    dt1.on('select', function (e, dt, type, indexes) {
      nowCaseID.value = dt.rows(indexes).data()[0].id
    });
  });

  // 設定表格table1
  const columns1 = [
    {
      data: "status_code", title: "狀態", defaultContent: "-", className: "colnowarp", render: (data,type,row) => {
        let markicon="";
        let classn="";
        switch (data) {
          case 9: //退件
            markicon = '<i class="fas fa-reply-all"></i>';
            classn = "status89";
            break;
          case 8: //補件
            markicon = '<i class="fas fa-history"></i>';
            classn = "status89";
            break;
          case 7: //結案
            markicon = '<i class="fas fa-check"></i>';
            classn = "status7";
            break;
          case 6: //待繳費
            markicon = '<i class="fas fa-donate"></i>';
            classn = "status6";
            break;
          case 5: //陳核
            markicon = '<i class="fas fa-paste"></i>';
            classn = "status45";
            break;
          case 4: //校正中
            markicon = '<i class="fas fa-play"></i>';
            classn = "status45";
            break;
          case 3: //待送件
            markicon = '<i class="fas fa-hourglass-start"></i>';
            classn = "status23";
            break;
          case 2: //審核中
            markicon = '<i class="fas fa-glasses"></i>';
            classn = "status23";
            break;
          case 1: //(空)
            markicon = '<i class="fas fa-exclamation-circle"></i>';
            classn = "status1";
        }
        return "<span class='" + classn +"'>" + markicon + row.case_status.status + "</span>"
      }
    },
    
    { data: "id", title: "案件編號", defaultContent: "-" },
    { data: "cal_type", title: "校正項目編號", defaultContent: "-", visible: false },
    { data: "cal_type_cal_typeTocase_base.name", title: "校正項目名稱", defaultContent: "-", visible: false },
    { data: "cal_type_cal_typeTocase_base.code", title: "校正項目代碼", defaultContent: "-", render: (data, type, row) => {
      let markicon = "";
      let classn = "";
      switch (data) {
        case "F": //航測像機
          markicon = '<i class="fas fa-plane-departure"></i>';
          classn = "typeF"
          break;
        case "I": //空載光達
          markicon = '<i class="fas fa-wifi"></i>';
          classn = "typeI"
          break;
        case "J": //小像幅
          markicon = '<i class="fas fa-camera"></i>';
          classn = "typeJ"
          break;
      }
      // return "<span style='color: " + color + "; background-color:" + bcolor + "' >" + markicon + row.cal_type_cal_typeTocase_base.name + "</span>"
      return "<span class='"+ classn +"'>" + markicon + row.cal_type_cal_typeTocase_base.name + "</span>"
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
      data: "case_record_01.complete_date", title: "完成日", defaultContent: "-", render: (data, type, row) => {
        if (data) {
          return toTWDate(data);
        } else if (row.case_record_02){
          return toTWDate(row.case_record_02.complete_date);
        }
      }
    },
    {
      data: "pay_date", title: "繳費日", defaultContent: "-", render: (data) => {
        return toTWDate(data);
      }
    },
    {
      data: "charge", title: "費用", className: "colAlignRight", defaultContent: "-", 
      render: function (data, type) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(data)
      } 
    },
    { data: "cus.cus_org.name", title: "顧客名稱", defaultContent: "-" },
    
    { data: "item_base.chop", title: "廠牌", defaultContent: "-" },
    { data: "item_base.model", title: "型號", defaultContent: "-" },
    { data: "item_base.serial_number", title: "序號", defaultContent: "-" },
    { data: "agreement", title: "協議事項", defaultContent: "-", visible: true },
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
    let where = {};
    if (caseStatusSEL.value !== "") where.statusCode = parseInt(caseStatusSEL.value);
    if (caseIDSEL.value !== "") where.getAllCaseId = caseIDSEL.value;
    if (caseTypeSEL.value !== "") where.calType = parseInt(caseTypeSEL.value);
    if (caseOptSEL.value !== "") where.operatorsId = parseInt(caseOptSEL.value);
    if (caseCustSEL.value !== "") where.orgId = parseInt(caseCustSEL.value);
    if (caseChopSEL.value !== "") where.itemChop = caseChopSEL.value;
    if (caseModelSEL.value !== "") where.itemModel = caseModelSEL.value;
    if (caseSelnumSEL.value !== "") where.itemSn = caseSelnumSEL.value;
    if (caseAppDateStartSEL.value !== "") where.appdateStart = caseAppDateStartSEL.value.trim() + "T00:00:00.000Z" ;
    if (caseAppDateEndtSEL.value !== "") where.appdateEnd = caseAppDateEndtSEL.value.trim() + "T00:00:00.000Z";
    if (casePayDateStartSEL.value !== "") where.paydateStart = casePayDateStartSEL.value.trim() + "T00:00:00.000Z";
    if (casePayDateEndtSEL.value !== "") where.paydateEnd = casePayDateEndtSEL.value.trim() + "T00:00:00.000Z";

    varAllCase.value = where;
  }
  // 清除條件
  function caseClearFilter() {
    caseStatusFilter.value.setValue("");
    caseIDSEL.value = "";
    caseTypeFilter.value.setValue("");
    caseOptFilter.value.setValue("");
    caseCustFilter.value.setValue("");
    caseChopFilter.value.setValue("");
    caseModelFilter.value.setValue("");
    caseSelnumSEL.value = "";

    caseAppDateStartSEL.value = "";
    caseAppDateStartFilter.value.inputValue = ""
    caseAppDateEndtSEL.value = "";
    caseAppDateEndFilter.value.inputValue = ""

    casePayDateStartSEL.value = "";
    casePayDateStartFilter.value.inputValue = ""
    casePayDateEndtSEL.value = "";
    casePayDateEndFilter.value.inputValue = ""

  }
// 篩選=========end
// 填入下拉式選單==========Start

  // 查詢案件狀態列表
  const { result: caseStatus, onResult: getCaseStatus, refetch: refgetCaseStatus } = useQuery(CaseGQL.GETCASESTATUS);
  getCaseStatus(result => {
    // 加入案件狀態選單資料
    if (!result.loading) {
      // 篩選區
      caseStatusMU.value = result.data.getCaseStatus.map(x => {
        return { text: x.status, value: parseInt(x.code) }
      }); caseStatusMU.value.unshift({ text: "", value: "" });
      // 資料區
      nowCaseStatusMU.value = result.data.getCaseStatus.map(x => {
        return { text: x.status, value: parseInt(x.code) }
      }); nowCaseStatusMU.value.unshift({ text: "", value: "" });
      // nowDocTypemu.value = result.data.getAllDocType.map(x => {
      //   return { text: x.doc_type, value: parseInt(x.doc_type_id) }
      // }); nowDocTypemu.value.unshift({ text: "", value: "" });
    }
  });
  refgetCaseStatus();

  // 查詢校正項目列表
  const { result: caseCalType, onResult: getCaseCalType, refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);
  getCaseCalType(result => {
    // 加入校正項目選單資料
    if (!result.loading) {
      // 篩選區
      caseTypeMU.value = result.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); caseTypeMU.value.unshift({ text: "", value: "" });
      // 新增案件區
      addCaseTypeIdMU.value = result.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); addCaseTypeIdMU.value.unshift({ text: "", value: "" });
      // nowDocTypemu.value = result.data.getAllDocType.map(x => {
      //   return { text: x.doc_type, value: parseInt(x.doc_type_id) }
      // }); nowDocTypemu.value.unshift({ text: "", value: "" });
    }
  });
  refgetCaseCalType();

  // 查詢校正人員列表
  const { result: caseOperator, onResult: getCaseOperator, refetch: refgetCaseOperator } = useQuery(CaseGQL.GETOPERATOR,
    { roleType: "校正人員"}
  );
  getCaseOperator(result => {
    // 加入校正人員選單資料
    if (!result.loading) {
      // 篩選區
      caseOptMU.value = result.data.getEmpByRole.map(x => {
        return { text: x.name, value: parseInt(x.person_id) }
      }); caseOptMU.value.unshift({ text: "", value: "" });
      // 資料區
      nowCaseOperatorMU.value = result.data.getEmpByRole.map(x => {
        return { text: x.name, value: parseInt(x.person_id) }
      }); nowCaseOperatorMU.value.unshift({ text: "", value: "" });
      // nowDocTypemu.value = result.data.getAllDocType.map(x => {
      //   return { text: x.doc_type, value: parseInt(x.doc_type_id) }
      // }); nowDocTypemu.value.unshift({ text: "", value: "" });
    }
  });
  refgetCaseOperator();

  // 查詢顧客列表
  const { result: caseAllOrg, onResult: getCaseAllOrg, refetch: refgetCaseAllOrg } = useQuery(CaseGQL.GETALLORG);
  getCaseAllOrg(result => {
    // 加入顧客選單資料
    if (!result.loading) {
      caseCustMU.value = result.data.getAllOrg.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); caseCustMU.value.unshift({ text: "", value: "" });
      // nowDocTypemu.value = result.data.getAllDocType.map(x => {
      //   return { text: x.doc_type, value: parseInt(x.doc_type_id) }
      // }); nowDocTypemu.value.unshift({ text: "", value: "" });
    }
  });
  refgetCaseAllOrg();

// 查詢待校件列表
const { result: caseAllItem, onResult: getCaseAllItem, refetch: refgetCaseAllItem } = useQuery(CaseGQL.GETALLITEM);
getCaseAllItem(result => {
  // 加入待校件選單資料
  if (!result.loading) {
    let choplist=[];
    let modellist = [];

    choplist = result.data.getAllItem.map(x=>{return x.chop});//從物件陣列中取出成陣列
    choplist = [...new Set(choplist)]; //ES6排除重複值語法
    caseChopMU.value = choplist.sort().map(x=>{
      return { text: x, value: x }
    }); caseChopMU.value.unshift({ text: "", value: "" });

    modellist = result.data.getAllItem.map(x => { return x.model });//從物件陣列中取出成陣列
    modellist = [...new Set(modellist)]; //ES6排除重複值語法
    caseModelMU.value = modellist.sort().map(x => {
      return { text: x, value: x }
    }); caseModelMU.value.unshift({ text: "", value: "" });
  }
});
refgetCaseAllItem();

// 填入下拉式選單==========end
// 案件基本資料==========start
// 新增案件指標
const showCaseNew = ref(false);
// 案件狀態
const nowCaseStatus = ref("");
const nowCaseStatusMU = ref([]);
const nowCaseStatusDOM = ref();
// 案件編號
const nowCaseID = ref("");
const addCaseID = ref("");
// 申請日期
const nowCaseAppDate = ref("");
const addCaseAppDate = ref("");
const addCaseAppDateDOM = ref();
// 校正項目
const nowCaseTypeName = ref("");
const addCaseTypeIdSEL = ref("");
const addCaseTypeIdMU = ref([]);
const addCaseTypeIdDOM = ref("");
const nowCaseTypeId = ref("");

// 顧客
const nowCaseCustOrgName = ref("");
const nowCaseCustTaxID = ref("");
const nowCaseCustName = ref("");
const nowCaseCustTel = ref("");
const nowCaseCustFax = ref("");
const nowCaseCustAddress = ref("");
const nowCaseTitle = ref("");
const nowCaseAddress = ref("");
const nowCasePurpose = ref("");
const nowCaseAgreement = ref("");
// 費用
const nowCaseCharge = ref("");
// 繳費日
const nowCasePayDate = ref("");
const nowCasePayDateDOM = ref();
// 校正人員
const nowCaseOperator = ref("");
const nowCaseOperatorMU = ref([]);
const nowCaseOperatorDOM = ref();
// 技術主管
const nowCaseLeader = ref("");
const nowCaseLeaderDOM = ref();
const nowCaseLeaderMU = ref([]);

// 查詢技術主管列表
const { result: caseLeader, onResult: getCaseLeader, refetch: refgetCaseLeader } = useQuery(CaseGQL.GETOPERATOR,
  { roleType: "技術主管" }
);
getCaseLeader(result => {
  // 加入技術主管選單資料
  if (!result.loading) {
    nowCaseLeaderMU.value = result.data.getEmpByRole.map(x => {
      return { text: x.name, value: parseInt(x.person_id) }
    }); nowCaseLeaderMU.value.unshift({ text: "", value: "" });
  }
});
refgetCaseLeader();

// 查詢顯示選擇案件之簡單資料
const { result: nowCaseS, loading: lodingnowCaseS, onResult: getNowCaseS, refetch: refgetNowCaseS } = useQuery(
  CaseGQL.GETSIMPLECASEBYID,
  ()=>({
    getCasebyIdId: nowCaseID.value
  })
);
getNowCaseS(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入簡單資料
    let getData = result.data.getCasebyID;
    nowCaseStatusDOM.value.setValue(parseInt(getData.status_code));
    nowCaseAppDate.value = toTWDate(getData.app_date);
    nowCaseTypeName.value = getData.cal_type_cal_typeTocase_base.name;
    nowCaseTypeId.value = getData.cal_type
    nowCaseCustOrgName.value = (getData.cus)?getData.cus.cus_org.name:"";
    nowCaseCustTaxID.value = (getData.cus) ?getData.cus.cus_org.tax_id:"";
    nowCaseCustName.value = (getData.cus) ?getData.cus.name:"";
    nowCaseCustTel.value = (getData.cus) ?getData.cus.tel:"";
    nowCaseCustFax.value = (getData.cus) ?getData.cus.fax:"";
    nowCaseCustAddress.value = (getData.cus) ?getData.cus.address:"";
    nowCaseTitle.value = getData.title;
    nowCaseAddress.value = getData.address;
    nowCasePurpose.value = getData.purpose;
    nowCaseAgreement.value = getData.agreement;
    if (getData.charge === 0){
      nowCaseCharge.value =""  
    }else{
      nowCaseCharge.value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(getData.charge);  
    }
    nowCasePayDate.value = toTWDate(getData.pay_date);
    nowCaseOperatorDOM.value.setValue(parseInt(getData.operators_id));
    nowCaseLeaderDOM.value.setValue(parseInt(getData.leader_id));
  }
});

// 報告抬頭地址同上
function copyTileAdd(){
  nowCaseTitle.value = nowCaseCustOrgName.value;
  nowCaseAddress.value = nowCaseCustAddress.value;
}

// 新增案件==開啟表單
function openAddCaseForm(){
  showCaseNew.value = true;
}
// 新增案件==確認
const { mutate: addCase, onDone: addCaseOnDone, onError: addCaseError } = useMutation(
  CaseGQL.ADDCASE,
  () => ({
    variables: {
      creatCaseId: addCaseID.value,
      calType: parseInt(addCaseTypeIdSEL.value),
      appDate: (addCaseAppDate.value === "") ? null : (addCaseAppDate.value.trim() + "T00:00:00.000Z"),
    }
  })
);

addCaseOnDone((result) => {
  let getResultData = result.data.creatCase;
  // 填入基本資料
  nowCaseID.value = getResultData.id;
  // 更新狀態訊息
  infomsg.value = "ID:" + nowCaseID.value + "完成新增";
  alert1.value = true;
})

function AddCaseOK() {
  // 檢查必填資料
  // 新增Case_base
  // 依據校正項目同步新增record_01或record_02※解析器已經同步新增
  addCase();
  showCaseNew.value = false;
}

// 新增案件==取消
function AddCaseCancel() { 
  showCaseNew.value = false;
}

// 新增案件==自動取得申請日
function getAppDateByCaseId() {
  // 驗證addCaseID存在正確日期?
  let checkstr = addCaseID.value.substr(0, 4) + "-" + addCaseID.value.substr(4, 2) + "-" + addCaseID.value.substr(6, 2);
  let isValidDate = Date.parse(checkstr);
  if (isNaN(isValidDate)) {
    // 非正確日期
    infomsg.value ="非正確日期";
    alertColor.value ="danger";
    alert1.value=true;
  }else{
    // 填入日期
    addCaseAppDate.value = checkstr;
    addCaseAppDateDOM.value.inputValue = checkstr;
  }
}
// 案件基本資料==========end
// 案件詳細編輯資料==========start


// 查詢顯示選擇案件之詳細資料
// 查詢Record01資料

// 查詢Record02資料

// 顯示編輯更多畫面
const caseBtnText = ref("編輯更多<i class='fas fa-angle-double-right'/>");
const showCaseLeftDiv = ref(true);
const animationType = ref("slide-left-ja");
const showCaseEditAnima = ref(false);

const showCaseEditR01Flag = ref(false);
const showCaseEditR02Flag = ref(false);
// 編輯更多按鈕
function showCaseEdit(){
  console.log(nowCaseTypeId.value);
  if (showCaseEditAnima.value){
    if (animationType.value ==="slide-right-ja"){
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      setRecordShow(showCaseEditAnima.value);
      animationType.value = "slide-left-ja"
    } else if(animationType.value === "slide-left-ja"){
      caseBtnText.value = "編輯更多<i class='fas fa-angle-double-right'/>";
      animationType.value = "slide-right-ja"
      setRecordShow(showCaseEditAnima.value);
    }
  }else{
    setRecordShow(showCaseEditAnima.value);
  }
  
}
// 切換不同校正項目內容
function setRecordShow(isAnimate){
  if (nowCaseTypeId.value === 1 || nowCaseTypeId.value === 3) {
    showCaseEditR01Flag.value = true;
    showCaseEditR02Flag.value = false;
    if(!isAnimate){
      showCaseEditAnima.value = true;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
    }
  } else if (nowCaseTypeId.value === 2) {
    showCaseEditR01Flag.value = false;
    showCaseEditR02Flag.value = true;
    if (!isAnimate) {
      showCaseEditAnima.value = true;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
    }
  } else {
    showCaseEditR01Flag.value = false;
    showCaseEditR02Flag.value = false;
  }
}
// 案件詳細編輯資料==========end





</script>
<template>
  <MDBContainer fluid class="h-100 overflow-hidden">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <!-- <MDBContainer tag="main" fluid> -->
      <MDBAnimation style="height: calc(100% - 6.5em);" :animation="animationType" trigger="manually"
        v-model="showCaseEditAnima">
        <MDBRow style="margin-left:0;margin-right:0;" class="h-100 flex-nowrap">
          <!-- 左方列表 -->
          <MDBCol v-show="showCaseLeftDiv" md="8" class="h-100">
            <MDBRow class="h-100 align-content-between">
              <!-- 上方列表 -->
              <MDBCol md="12" style="height: calc(75% - 1.5rem) ;"
                class="mt-2 overflow-auto border border-5 rounded-8 shadow-4">
                <DataTable :data=" data1" :columns="columns1" :options="tboption1" ref="table1"
                  style="font-size: smaller" class="display w-100 compact" />
              </MDBCol>
              <!-- 下方篩選 -->
              <MDBCol md="12" class="h-25 mb-2 overflow-auto border border-5 rounded-8 shadow-4">
                <MDBRow>
                  <div class="my-2 d-flex">
                    <div class="flex-grow-1">條件篩選</div>
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
            </MDBRow>
          </MDBCol>
          <!-- 右方案件資料 -->
          <MDBCol md="4" v-show="!showCaseNew" class="h-100">
            <MDBRow style="margin-left: auto;height: calc(100% - 1rem);"
              class="my-2 bg-light overflow-auto border border-5 rounded-8 shadow-4">
              <div class="px-3">案件資料</div>
              <div class="d-flex p-3">
                <MDBPopconfirm class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                  message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="">
                  刪除案件
                </MDBPopconfirm>
                <MDBBtn size="sm" color="primary" @click="openAddCaseForm">新增</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="showCaseEdit" v-html="caseBtnText">
                </MDBBtn>
              </div>
              <hr>
              <MDBSelect filter size="sm" class="mb-3  col-6" label="校正人員" v-model:options="nowCaseOperatorMU"
                v-model:selected="nowCaseOperator" ref="nowCaseOperatorDOM" />
              <MDBSelect filter size="sm" class="mb-3  col-6" label="技術主管" v-model:options="nowCaseLeaderMU"
                v-model:selected="nowCaseLeader" ref="nowCaseLeaderDOM" />
              <MDBSelect size="sm" class="mb-3  col-6" label="案件狀態" v-model:options="nowCaseStatusMU"
                v-model:selected="nowCaseStatus" ref="nowCaseStatusDOM" />
              <div></div>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="案件編號" v-model="nowCaseID" disabled />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="申請日期" v-model="nowCaseAppDate" disabled />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="校正項目" v-model="nowCaseTypeName" disabled />
              </MDBCol>
              <div></div>
              <MDBCol col="12" class="mb-3">
                <MDBInput size="sm" type="text" label="顧客名稱" v-model="nowCaseCustOrgName" disabled />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="統一編號" v-model="nowCaseCustTaxID" disabled />
              </MDBCol>
              <div></div>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="聯絡人" v-model="nowCaseCustName" disabled />
              </MDBCol>
              <div></div>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowCaseCustTel" disabled />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="傳真" v-model="nowCaseCustFax" disabled />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput size="sm" type="text" label="聯絡地址" v-model="nowCaseCustAddress" disabled />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBBtn size="sm" color="primary" @click="copyTileAdd()">同上</MDBBtn>
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput size="sm" type="text" label="報告抬頭" v-model="nowCaseTitle" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput size="sm" type="text" label="報告地址" v-model="nowCaseAddress" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput size="sm" type="text" label="校正目的" v-model="nowCasePurpose" />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" style="text-align: right" type="text" label="費用" v-model="nowCaseCharge" />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBDatepicker size="sm" v-model="nowCasePayDate" format=" YYYY-MM-DD " label="繳費日"
                  ref="nowCasePayDateDOM" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBTextarea size="sm" label="協議事項" rows="2" v-model="nowCaseAgreement" />
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 新增案件表單 -->
          <MDBCol md="4" v-show="showCaseNew" class="h-100 py-2 bg-primary">
            <MDBAnimation class="h-100" animation="fade-in-right" trigger="manually" v-model="showCaseNew">
              <MDBRow style="margin-left:0;margin-right:0;"
                class="h-100 bg-light align-content-start overflow-auto border border-5 rounded-8 shadow-4">
                <MDBCol col="12" class="mb-3">新增案件</MDBCol>
                <div class="d-flex mb-3 justify-content-end">
                  <MDBBtn size="sm" color="warning" @click="AddCaseCancel">取消</MDBBtn>
                  <MDBBtn size="sm" color="primary" @click="AddCaseOK">確認</MDBBtn>
                </div>
                <MDBCol col="6" class="mb-4">
                  <MDBInput counter :maxlength="12" size="sm" type="text" label="案件編號" v-model="addCaseID" />
                </MDBCol>
                <div></div>
                <MDBCol style="font-size: 0.8rem" class="mx-3 mb-3 p-2 border">
                  案件編號編碼方式：
                  <br>"西元日期(8碼)"
                  <br> + "當日第幾案(2碼)"
                  <br> + "本案第幾件儀器(2碼)"
                  <br>例如："20220125" + "02" + "01"
                </MDBCol>
                <div></div>
                <MDBCol col="6" class="mb-3">
                  <MDBDatepicker size="sm" v-model="addCaseAppDate" format=" YYYY-MM-DD " label="申請日"
                    ref="addCaseAppDateDOM" />
                </MDBCol>
                <MDBCol col="6" class="mb-3">
                  <MDBBtn size="sm" color="primary" @click="getAppDateByCaseId">自動取得</MDBBtn>
                </MDBCol>
                <div></div>
                <MDBCol style="font-size: 0.8rem" class="mx-3 mb-3 p-2 border">
                  申請日期可由案件編號前8碼取得或自行設定
                </MDBCol>
                <div></div>
                <MDBSelect size="sm" class="mb-3  col-10" label="校正項目" v-model:options="addCaseTypeIdMU"
                  v-model:selected="addCaseTypeIdSEL" ref="addCaseTypeIdDOM" />
              </MDBRow>
            </MDBAnimation>
          </MDBCol>
          <MDBCol md="8" v-if="showCaseEditR01Flag" class="h-100 py-2">
            <MDBRow style="margin-left:0;margin-right:0;" class="h-100 bg-light border border-5 rounded-8 shadow-4">
              <!-- record01表單 -->
              <MDBStepper linear>
                <MDBStepperForm>
                  <MDBStepperStep active>
                    <MDBStepperHead icon="1">
                      送校
                    </MDBStepperHead>
                    <MDBStepperContent>
                      送校內容01
                    </MDBStepperContent>
                  </MDBStepperStep>
                  <MDBStepperStep>
                    <MDBStepperHead icon="2">
                      申請
                    </MDBStepperHead>
                    <MDBStepperContent>
                      申請內容01
                    </MDBStepperContent>
                  </MDBStepperStep>
                  <MDBStepperStep>
                    <MDBStepperHead icon="3">
                      校正
                    </MDBStepperHead>
                    <MDBStepperContent>
                      校正內容01
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
            </MDBRow>
          </MDBCol>
          <MDBCol md="8" v-else-if="showCaseEditR02Flag" class="h-100 py-2">
            <MDBRow style="margin-left:0;margin-right:0;" class="h-100 bg-light border border-5 rounded-8 shadow-4">
              <!-- record02表單 -->
              <MDBStepper linear>
                <MDBStepperForm>
                  <MDBStepperStep active>
                    <MDBStepperHead icon="1">
                      申請
                    </MDBStepperHead>
                    <MDBStepperContent>
                      申請內容02
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
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBAnimation>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    appendToBody autohide :delay="2000">
    {{ infomsg }}
  </MDBAlert>
</template>
<style>



















.colAlignRight{
  text-align: right;
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

tr>td>span.typeF {
  color: #6495ED;
}
tr.selected>td>span.typeF {
  color: white;
}
tr>td>span.typeI {
  color: #229954;
}

tr.selected>td>span.typeI {
  color: white;
}
tr>td>span.typeJ {
  color: #FF7F50;
}

tr.selected>td>span.typeJ {
  color: white;
}

.slide-left-ja{
  animation-name: slide-left-ja;
}

@keyframes slide-left-ja{
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-66.66666667%, 0, 0);
    /* visibility: hidden; */
  }
}
.slide-right-ja {
  animation-name: slide-right-ja;
}

@keyframes slide-right-ja {
  from {
    transform: translate3d(-66.66666667%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    /* visibility: hidden; */
  }
}
</style>
