<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import Record01 from "../components/Record01.vue";
import Record02 from "../components/Record02.vue";
import { ref, reactive, onMounted, provide } from "vue";
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
  MDBSpinner,
  MDBAnimation,
  MDBAlert,
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
import gql from "graphql-tag";
import CaseGQL from "../graphql/Cases";
import CustGQL from "../graphql/Cust";

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

DataTable.use(DataTableBs5);
DataTable.use(Select);
// 取得權限==========Start
// const myUserId = ref("");
const myUserName = ref("");
// const myUserName2 = ref("");
// const myUserEmail = ref("");
// const myUserActive = ref(false);
const myUserRole = ref("");

const { onResult: getNowUser, refetch: refgetNowUser } = useQuery(UsersGQL.GETNOWUSER);
getNowUser(result => {
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
const rGroup = computed(() => {
  let result = [];
  // rGroup[0]最高權限
  // rGroup[1]技術主管專用
  // rGroup[2]技術人員專用(非己不可改)
  // rGroup[3]最低權限(訪客不可)
  // rGroup[4]完全開放
  switch (myUserRole.value) {
    case 0:
      result = [false, false, false, false, false];
      break;
    case 1:
      if (parseInt(myUserName.value) === parseInt(nowCaseOperator.value)) {
        result = [false, false, true, true, true];
      } else {
        result = [false, false, false, false, false];
      }
      break;
    case 2:
      result = [false, true, false, true, true];
      break;
    case 3:
      result = [true, true, true, true, true];
      break;
  }
  // console.log("myUserName",myUserName.value);
  // console.log("myUserRole",myUserRole.value);
  // console.log("nowCaseOperator",nowCaseOperator.value);
  // console.log("rGroup",rGroup.value);
  return result;
});
provide("rGroup", rGroup);
// 取得權限==========End
// Information
const NavItem = ref("cases");
provide("NavItem", NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const updateKey = ref(0);
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
    data: "status_code", title: "狀態", defaultContent: "-", className: "colnowarp", render: (data, type, row) => {
      let markicon = "";
      let classn = "";
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
      return "<span class='" + classn + "'>" + markicon + row.case_status.status + "</span>"
    }
  },
  { data: "id", title: "案件編號", defaultContent: "-" },
  { data: "cal_type", title: "校正項目編號", defaultContent: "-", visible: false },
  { data: "cal_type_cal_typeTocase_base.name", title: "校正項目名稱", defaultContent: "-", visible: false },
  {
    data: "cal_type_cal_typeTocase_base.code", title: "校正項目", defaultContent: "-", render: (data, type, row) => {
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
      return "<span class='" + classn + "'>" + markicon + row.cal_type_cal_typeTocase_base.name + "</span>"
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
      } else if (row.case_record_02) {
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
  dom: 'tif',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: '52vh',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

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

// 顧客列表=========start
let dtCust;
const tableCust = ref();
const dataCust = ref([]);
const showCustFrom = ref(false);
const custTabId = ref("editor");

const seletCustId = ref("");
const selCustName = ref("");
const selCustOrgName = ref("");
const selCustOrgNameMU = ref([]);
const selCustOrgNameDOM = ref();
const selCustOrgList = ref([]);

const selCustTaxId = computed(() => {
  let getData = selCustOrgList.value.filter((x) => {
    return parseInt(x.id) === selCustOrgName.value;
  })[0];
  return (getData) ? getData.tax_id : "";
});

const selCustTel = ref("");
const selCustFax = ref("");
const selCustAddress = ref("");

const filterCustName = ref("");
const filterCustOrgName = ref("");
const filterCustTaxId = ref("");

// 設定表格tableCust
const columnsCust = [
  { data: "id", title: "編號", defaultContent: "-" },
  { data: "cus_org.name", title: "公司名稱", defaultContent: "-" },
  { data: "name", title: "聯絡人", defaultContent: "-" },
  { data: "tel", title: "電話", defaultContent: "-" },
  { data: "fax", title: "傳真", defaultContent: "-" },
  { data: "cus_org.tax_id", title: "統一編號", defaultContent: "-" },
  { data: "address", title: "地址", defaultContent: "-" },
];
const tboptionCust = {
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

// 查詢顧客資料
const { result: allCust, loading: lodingAllCust, variables: varAllCust, onResult: getAllCust, refetch: refgetAllCust } = useQuery(
  CustGQL.GETALLCUST,
);
getAllCust(result => {
  // 加入顧客資料
  if (!result.loading && result.data) {
    dataCust.value = result.data.getAllCust;
  }
});

// 查詢選取顧客資料
const { result: selCustData, loading: loadselCust, onResult: getselCust, refetch: refgetselCust } = useQuery(
  CustGQL.GETCUSTBYID,
  () => ({
    getCustByIdId: parseInt(seletCustId.value)
  })
);
getselCust(result => {
  if (!result.loading && result && result.data.getCustById) {
    let getData = result.data.getCustById
    selCustName.value = getData.name;
    selCustOrgNameDOM.value.setValue(parseInt(getData.org_id));
    // selCustTaxId.value = getData.cus_org.tax_id;
    selCustTel.value = getData.tel;
    selCustFax.value = getData.fax;
    selCustAddress.value = getData.address;
  }
});

function shownCustModal() {
  dtCust = tableCust.value.dt();
  dtCust.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    seletCustId.value = getData.id;
  });
  refgetAllCust();
  if (nowCaseCustId) {
    seletCustId.value = nowCaseCustId.value;
  }
}

// 儲存顧客資料
const { mutate: saveCust, onDone: saveCustOnDone, onError: saveCustError } = useMutation(
  CustGQL.UPDATECUST,
  () => ({
    variables: {
      updateCustId: parseInt(seletCustId.value),
      name: selCustName.value,
      address: selCustAddress.value,
      tel: selCustTel.value,
      fax: selCustFax.value,
      orgId: parseInt(selCustOrgName.value),
    }
  })
);

saveCustError((error) => {
  console.log(error);
});
saveCustOnDone(() => {
  refgetAllCust();
  refgetselCust();
  refgetCaseAllOrg();
  infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  alert1.value = true;
});
// 更多編輯=>引導至顧客管理
function gotoCustMG() {
  router.push('/cust');
}

// 清除顧客篩選條件
function clearCustFilter() {
  filterCustName.value = "";
  filterCustOrgName.value = "";
  filterCustTaxId.value = "";
}

// 執行顧客篩選
function doCustFilter() {
  let where = {};
  if (filterCustOrgName.value !== "") where.orgName = filterCustOrgName.value;
  if (filterCustName.value !== "") where.name = filterCustName.value;
  if (filterCustTaxId.value !== "") where.orgTaxid = filterCustTaxId.value;

  varAllCust.value = where;
}

// 案加入後回填顧客id
function setCustBtn() {
  nowCaseCustId.value = seletCustId.value;

  let getData = selCustOrgList.value.filter((x) => {
    return parseInt(x.id) === selCustOrgName.value;
  })[0];
  nowCaseCustOrgName.value = (getData) ? getData.name : "";

  nowCaseCustTaxID.value = selCustTaxId.value;
  nowCaseCustName.value = selCustName.value;
  nowCaseCustTel.value = selCustTel.value;
  nowCaseCustFax.value = selCustFax.value;
  nowCaseCustAddress.value = selCustAddress.value;
  showCustFrom.value = false;
}
// 顧客列表=========end

// 篩選=========start
// 案件狀態
const caseStatusMU = ref([]);
const caseStatusSEL = ref("");
const caseStatusFilter = ref();
// 案件編號
const caseIDSEL = ref("");
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
function caseDoFilter() {
  let where = {};
  if (caseStatusSEL.value !== "") where.statusCode = parseInt(caseStatusSEL.value);
  if (caseIDSEL.value !== "") where.getAllCaseId = caseIDSEL.value;
  if (caseTypeSEL.value !== "") where.calType = parseInt(caseTypeSEL.value);
  if (caseOptSEL.value !== "") where.operatorsId = parseInt(caseOptSEL.value);
  if (caseCustSEL.value !== "") where.orgId = parseInt(caseCustSEL.value);
  if (caseChopSEL.value !== "") where.itemChop = caseChopSEL.value;
  if (caseModelSEL.value !== "") where.itemModel = caseModelSEL.value;
  if (caseSelnumSEL.value !== "") where.itemSn = caseSelnumSEL.value;
  if (caseAppDateStartSEL.value !== "") where.appdateStart = caseAppDateStartSEL.value.trim() + "T00:00:00.000Z";
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
    // API連線區
    apiCalTypeIDMU.value = result.data.getCaseCalType.map(x => {
      return { text: x.name, value: x.code }
    }); apiCalTypeIDMU.value.unshift({ text: "", value: "" });
  }
});
refgetCaseCalType();

// 查詢校正人員列表
const { result: caseOperator, onResult: getCaseOperator, refetch: refgetCaseOperator } = useQuery(CaseGQL.GETOPERATOR,
  { roleType: "校正人員" }
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

    selCustOrgNameMU.value = result.data.getAllOrg.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    }); selCustOrgNameMU.value.unshift({ text: "", value: "" });

    selCustOrgList.value = result.data.getAllOrg;
  }
});
refgetCaseAllOrg();

// 查詢待校件列表
const { result: caseAllItem, onResult: getCaseAllItem, refetch: refgetCaseAllItem } = useQuery(CaseGQL.GETALLITEM);
getCaseAllItem(result => {
  // 加入待校件選單資料
  if (!result.loading) {
    let choplist = [];
    let modellist = [];

    choplist = result.data.getAllItem.map(x => { return x.chop });//從物件陣列中取出成陣列
    choplist = [...new Set(choplist)]; //ES6排除重複值語法
    caseChopMU.value = choplist.sort().map(x => {
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

// 校正件
const nowCaseItemID = ref("");
provide('nowCaseItemID', nowCaseItemID);

// 顧客
const nowCaseCustId = ref("");
const nowCaseCustOrgName = ref("");
const nowCaseCustTaxID = ref("");
const nowCaseCustName = ref("");
const nowCaseCustTel = ref("");
const nowCaseCustFax = ref("");
const nowCaseCustAddress = ref("");
const nowCaseTitle = ref("");
provide("nowCaseTitle", nowCaseTitle);
const nowCaseAddress = ref("");
provide("nowCaseAddress", nowCaseAddress);
// 校正目的
const nowCasePurpose = ref("");
const addCasePurpose = ref("");
// 協商事項
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
  () => ({
    getCasebyIdId: nowCaseID.value
  })
);
getNowCaseS(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入簡單資料
    let getData = result.data.getCasebyID;
    nowCaseStatusDOM.value.setValue(parseInt(getData.status_code));
    nowCaseAppDate.value = (getData.app_date) ? getData.app_date.split("T")[0] : "";
    nowCaseTypeName.value = getData.cal_type_cal_typeTocase_base.name;
    nowCaseTypeId.value = getData.cal_type
    nowCaseCustId.value = getData.cus_id
    nowCaseCustOrgName.value = (getData.cus) ? getData.cus.cus_org.name : "";
    nowCaseCustTaxID.value = (getData.cus) ? getData.cus.cus_org.tax_id : "";
    nowCaseCustName.value = (getData.cus) ? getData.cus.name : "";
    nowCaseCustTel.value = (getData.cus) ? getData.cus.tel : "";
    nowCaseCustFax.value = (getData.cus) ? getData.cus.fax : "";
    nowCaseCustAddress.value = (getData.cus) ? getData.cus.address : "";
    nowCaseTitle.value = getData.title;
    nowCaseAddress.value = getData.address;
    nowCasePurpose.value = getData.purpose;
    nowCaseAgreement.value = getData.agreement;
    nowCaseCharge.value = getData.charge;
    if (getData.pay_date) {
      nowCasePayDate.value = getData.pay_date.split("T")[0];
    } else {
      nowCasePayDate.value = "";
      nowCasePayDateDOM.value.inputValue = "";
    }
    nowCaseOperatorDOM.value.setValue(parseInt(getData.operators_id));
    nowCaseLeaderDOM.value.setValue(parseInt(getData.leader_id));
  }
});

// 報告抬頭地址同上
function copyTileAdd() {
  nowCaseTitle.value = nowCaseCustOrgName.value;
  nowCaseAddress.value = nowCaseCustAddress.value;
}
// 刪除案件
// 查詢刪除
const { mutate: delCase, onDone: delCaseOnDone, onError: delCaseError } = useMutation(
  CaseGQL.DELCASE,
  () => ({
    variables: {
      delCaseId: nowCaseID.value,
    }
  })
);
delCaseOnDone(() => {
  nowCaseID.value = "";
  // 更新列表==重新查詢案件
  refgetAllCase();
});

// 新增案件==開啟表單
function openAddCaseForm() {
  showCaseNew.value = true;
}

const caseBtnText = ref("編輯更多<i class='fas fa-angle-double-right'/>");
const showCaseLeftDiv = ref(true);
const animationType = ref("slide-left-ja");
const showCaseEditAnima = ref(false);
const showCaseEditR01Flag = ref(false);
const showCaseEditR02Flag = ref(false);
const addBtnDisabled = ref(false); //是否為完整編輯畫面

// 儲存案件
// mutation case_base
const saveCaseSVar = computed(()=>{
  return {
    updateCaseId: nowCaseID.value,
    statusCode: parseInt(nowCaseStatus.value),
    cusId: parseInt(nowCaseCustId.value),
    title: nowCaseTitle.value,
    address: nowCaseAddress.value,
    purpose: nowCasePurpose.value,
    itemId: (nowCaseItemID.value === "") ? null : parseInt(nowCaseItemID.value),
    charge: parseInt(nowCaseCharge.value),
    payDate: (nowCasePayDate.value === "") ? null : (nowCasePayDate.value.trim() + "T00:00:00.000Z"),
    agreement: nowCaseAgreement.value,
    leaderId: parseInt(nowCaseLeader.value),
    operatorsId: parseInt(nowCaseOperator.value),
  }
})
const { mutate: saveCaseS, onDone: saveCaseSOnDone, onError: saveCaseSError } = useMutation(
  CaseGQL.SAVECASESIMPLE);
saveCaseSOnDone(result => {
  if (!addBtnDisabled.value) {
    //簡單模式
    refgetAllCase();
    infomsg.value = "ID:" + nowCaseID.value + "完成儲存";
    // alert1.value = true;
  }
});

// mutation record01
const subFormRecord01 = ref();
// mutation record02
const subFormRecord02 = ref();

function saveNowCaseData() {
  if (addBtnDisabled.value) {
    // 完整畫面saveSimple + Record01 or Record02
    switch (nowCaseTypeId.value) {
      case 1:
      // 航測相機
      case 3:
        // 小像幅
        // mutation case_base+record01
        saveCaseS(saveCaseSVar.value);
        subFormRecord01.value.saveRecord01();
        break;
      case 2:
        // 空載光達
        // mutation case_base+record02
        saveCaseS(saveCaseSVar.value);
        subFormRecord02.value.saveRecord02();
        break;
    }
  } else {
    // 簡易畫面saveSimple
    // mutation case_base
    saveCaseS(saveCaseSVar.value);
  }
}

// 顯示編輯更多畫面
function showCaseEdit() {
  if (showCaseEditAnima.value) {
    if (animationType.value === "slide-right-ja") {
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
      setRecordShow(showCaseEditAnima.value);
      animationType.value = "slide-left-ja"
    } else if (animationType.value === "slide-left-ja") {
      caseBtnText.value = "編輯更多<i class='fas fa-angle-double-right'/>";
      animationType.value = "slide-right-ja"
      addBtnDisabled.value = false;
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = false;
      // setRecordShow(showCaseEditAnima.value);
    }
  } else {
    setRecordShow(showCaseEditAnima.value);
  }
}
// 切換不同校正項目內容
function setRecordShow(isAnimate) {
  updateKey.value += 1;
  if (isAnimate) {
    // 有啟用動畫
    if (nowCaseTypeId.value === 1 || nowCaseTypeId.value === 3) {
      showCaseEditR01Flag.value = true;
      showCaseEditR02Flag.value = false;
    } else if (nowCaseTypeId.value === 2) {
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = true;
    } else {
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = false;
    }
  } else {
    // 沒啟用動畫
    if (nowCaseTypeId.value === 1 || nowCaseTypeId.value === 3) {
      showCaseEditR01Flag.value = true;
      showCaseEditR02Flag.value = false;
      showCaseEditAnima.value = true;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
    } else if (nowCaseTypeId.value === 2) {
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = true;
      showCaseEditAnima.value = true;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
    } else {
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = false;
    }
  }
}
// 案件基本資料==========end

// 新增案件表單==========start
// 新增案件==自動取得申請日
function getAppDateByCaseId() {
  // 驗證addCaseID存在正確日期?
  let checkstr = addCaseID.value.substr(0, 4) + "-" + addCaseID.value.substr(4, 2) + "-" + addCaseID.value.substr(6, 2);
  let isValidDate = Date.parse(checkstr);
  if (isNaN(isValidDate)) {
    // 非正確日期
    infomsg.value = "非正確日期";
    alertColor.value = "danger";
    alert1.value = true;
  } else {
    // 填入日期
    addCaseAppDate.value = checkstr;
    addCaseAppDateDOM.value.inputValue = checkstr;
  }
}
// 新增案件==確認
const { mutate: addCase, onDone: addCaseOnDone, onError: addCaseError } = useMutation(
  CaseGQL.ADDCASE,
  () => ({
    variables: {
      creatCaseId: addCaseID.value,
      calType: parseInt(addCaseTypeIdSEL.value),
      appDate: (addCaseAppDate.value === "") ? null : (addCaseAppDate.value.trim() + "T00:00:00.000Z"),
      purpose: addCasePurpose.value,
    }
  })
);
addCaseOnDone((result) => {
  let getResultData = result.data.creatCase;
  // 填入基本資料
  nowCaseID.value = getResultData.id;
})

function AddCaseOK() {
  // 檢查必填資料
  // 新增Case_base
  // 依據校正項目同步新增record_01或record_02※解析器已經同步新增
  if (addCaseTypeIdSEL.value !== "") {
    addCase().then(result => {
      // let getResultData = result.data.creatCase;
      // // 填入基本資料
      // nowCaseID.value = getResultData.id;
      // 更新列表==重新查詢案件
      refgetAllCase();
      showCaseNew.value = false;
      // 更新狀態訊息
      infomsg.value = "ID:" + nowCaseID.value + "完成新增";
      // alertColor.value = "primary";
      // alert1.value = true;
    });
  }
}

// 新增案件==取消
function AddCaseCancel() {
  showCaseNew.value = false;
}
// 新增案件表單==========end

// 連線取得案件==========Start
let dtAPI;
const tableAPI = ref();
const dataAPI = ref([]);
const notProssing = ref(true);
const hasNowAllCase = ref([]);

const showAPIFrom = ref(false);
const apiCaseID = ref(""); // 申請單編號
const apiCalTypeID = ref(""); // 校正項目ID
const apiCalTypeIDMU = ref([]);
const apiCalTypeIdDOM = ref([]);
const apiStartDate = ref(""); // 起始日
const apiStartDateDOM = ref();
const apiEndDate = ref(""); // 結束日
const apiEndDateDOM = ref();

// 設定表格tableCust
const columnsAPI = [
  {
    data: "selected", title: "選取", defaultContent: false, className: 'dt-center', render: (data, type, row, meta) => {
      if (data) {
        return '<i class="inputSel far fa-lg fa-check-square"></i>'
      } else {
        return '<i class="inputSel far fa-lg fa-square"></i>'
      }
    }
  },
  { title: "序號", render: (data, type, row, meta) => { return meta.row; }, width: "2rem" },
  {
    data: "hasMatchCase", title: "已匯入", width: "4rem", className: 'dt-center', render: (data, type, row) => {
      if (data) {
        return '<i class="fas fa-lg fa-check-circle text-success"></i><span class="text-success">已匯入</span>'
      } else {
        return '<i class="fas fa-lg fa-times-circle text-danger"></i><span class="text-danger">未匯入</span>'
      }
    }
  },
  { data: "caseid", title: "案件編號", defaultContent: "-" },
  { data: "Code", title: "項目", defaultContent: "-" },
  { data: "TITLE", title: "顧客名稱", defaultContent: "-" },
  { data: "OWNER_ID", title: "聯絡人", defaultContent: "-" },
  { data: "chop", title: "廠牌", defaultContent: "-" },
  { data: "model", title: "型號", defaultContent: "-" },
  { data: "sn", title: "序號", defaultContent: "-" },

];
const tboptionAPI = {
  dom: 'fti',
  select: false,
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

function shownAPIModal() {
  refgetAPIAllCase();
  dataAPI.value = [];
  dtAPI = tableAPI.value.dt();
  // 設定表格動作
  dtAPI.on('click', '.inputSel', function (e) {
    let upPtIndex = parseInt(e.currentTarget.parentElement.nextSibling.innerText);
    if (dataAPI.value[upPtIndex].selected) {
      dataAPI.value[upPtIndex].selected = false;
    } else {
      dataAPI.value[upPtIndex].selected = true;
    }
  });


}

// 查詢全部案件資料
const { onResult: getAPIAllCase, refetch: refgetAPIAllCase } = useQuery(
  gql`query GetAllCase {
    getAllCase {
      id
    }
  }`,
);
getAPIAllCase(result => {
  hasNowAllCase.value = result.data.getAllCase;
});

function getCaseByAPI() {
  const url = import.meta.env.VITE_SICLAPI_URL;
  notProssing.value = false;
  let headers = {
    "Content-Type": "application/json",
    // "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "*/*",
  }

  let body = {};
  if (apiCaseID.value || apiCaseID.value !== '') { body.id = apiCaseID.value }
  if (apiCalTypeID.value || apiCalTypeID.value !== '') { body.code = apiCalTypeID.value }
  if (apiStartDate.value || apiStartDate.value !== '') {
    body.startDate = (apiStartDate.value).replaceAll("-", "/");
  }
  if (apiEndDate.value || apiEndDate.value !== '') {
    body.endDate = (apiEndDate.value).replaceAll("-", "/");
  }

  console.log(body);

  fetch(url, {
    method: "POST",
    mode: 'cors',
    headers: headers,
    //別忘了把主體参數轉成字串，否則資料會變成[object Object]，它無法被成功儲存在後台
    body: JSON.stringify(body),
  })
    .then(response => {
      // console.log(response);
      return response.json();
    })
    .then(json => {
      // 將回傳json轉成可用矩陣
      let myArray = [];
      console.log(json)
      for (let i = 0; i < json.length; i++) {
        for (let j = 0; j < json[i].CalibrationDetails.length; j++) {
          for (let k = 0; k < json[i].CalibrationDetails[j].CalibrationItems.length; k++) {
            let temp = {
              ...json[i],
              CalibrationDetails: null,
              ...json[i].CalibrationDetails[j],
              CalibrationItems: null,
              ...json[i].CalibrationDetails[j].CalibrationItems[k]
            };
            switch (temp.Code) {
              case "A":
              case "B":
              case "C":
                temp.caseid = temp.ARTICLE_ID + "" + temp.COL01;
                temp.chop = temp.COL02;
                temp.model = temp.COL03;
                temp.sn = temp.COL04;
                break;
              case "D":
              case "K":
                temp.caseid = temp.ARTICLE_ID + "" + temp.COL01;
                temp.chop = temp.COL04;
                temp.model = temp.COL05;
                temp.sn = temp.COL06;
                break;
              case "I":
              case "M":
                temp.caseid = temp.ARTICLE_ID + "" + temp.COL01;
                temp.chop = temp.COL02;
                temp.model = temp.COL03;
                temp.sn = temp.COL04;
                break;
              case "J":
                temp.caseid = temp.ARTICLE_ID + "" + temp.COL01;
                temp.chop = temp.COL02;
                temp.model = temp.COL03;
                temp.sn = temp.COL04;
                break;
              case "L":
                temp.caseid = temp.ARTICLE_ID + "" + temp.COL01;
                temp.chop = temp.COL02;
                temp.model = temp.COL03;
                temp.sn = temp.COL04;
                break;
              case "F":
                temp.caseid = temp.ARTICLE_ID + "01";
                temp.chop = temp.COL02;
                temp.model = temp.COL03;
                temp.sn = temp.COL04;
                break;
            }

            temp.hasMatchCase = hasCaseID(temp.caseid);
            myArray.push(JSON.parse(JSON.stringify(temp)));
          }
        }
      }
      console.log(myArray);
      dataAPI.value = myArray;
      notProssing.value = true;
    })
    .catch(err => console.log(err));
}

function hasCaseID(findID) {
  let result = hasNowAllCase.value.find(x => parseInt(x.id) === parseInt(findID));
  return (result) ? true : false
}

function inputSelAll() {
  dataAPI.value.forEach((x) => {
    x.hasMatchCase ? x.selected = false : x.selected = true;
  })
}
function inputSelClear() {
  dataAPI.value.forEach((x) => {
    x.selected = false;
  })
}

function inputAPICase() {
  for (let i = 0; i < dataAPI.value.length; i++) {
    let nowData = dataAPI.value[i];
    // 是否被選取
    if (nowData.selected) {
      // 是否已匯入
      if (!nowData.hasMatchCase) {
        // 未匯入者新建
        // 判斷校正項目是否為系統內項目
        if (nowData.Code === 'F' || nowData.Code === 'I' || nowData.Code === 'J') {
          // 新增案件
          let calTypeID = (caseCalType.value.getCaseCalType.find(x => x.code === nowData.Code)).id;
          addCase({
            creatCaseId: nowData.caseid,
            calType: parseInt(calTypeID),
            appDate: ((nowData.ARCHIVE_DATE).replaceAll("/", "-")).trim() + "T00:00:00.000Z",
            purpose: nowData.META_DESCRIPTION,
          })
            .then(result => {
              saveAPIRecord(nowData);
            });
        }
      } else {
        // 已匯入者重匯
        saveAPIRecord(nowData);
      }
    }
  }
  showCaseNew.value = false;
  showAPIFrom.value = false;
}

function saveAPIRecord(nowData) {
  saveCaseS({
    updateCaseId: nowData.caseid,
    statusCode: parseInt(2),
    // cusId: null,
    title: nowData.EXTRA_4,
    address: nowData.EXTRA_6,
    purpose: nowData.META_DESCRIPTION,
    // itemId: null,
    // charge: null,
    // payDate: null,
    agreement: nowData.EXTRA_10 + "\n" + nowData.EXTRA_9,
    // leaderId: null,
    // operatorsId: null,
  }).then(result => {
    // 填入其他資料
    switch (nowData.Code) {
      case "F":
        saveRecord01API({
          updateRecord01Id: nowData.caseid,
          camType: parseInt(nowData.COL01),
          focal: parseFloat(nowData.COL05),
          ppaX: parseFloat(nowData.COL06),
          ppaY: parseFloat(nowData.COL07),
          pxW: parseInt(nowData.COL09),
          pxH: parseInt(nowData.COL08),
          pxSizeX: parseFloat(nowData.COL10),
          pxSizeY: parseFloat(nowData.COL11),
          sizeX: parseFloat(((parseFloat(nowData.COL09) * parseFloat(nowData.COL10)) / 1000).toFixed(4)),
          sizeY: parseFloat(((parseFloat(nowData.COL08) * parseFloat(nowData.COL11)) / 1000).toFixed(4)),
          planYear: parseInt(nowData.COL14),
          planMonth: parseInt(nowData.COL15),
          gsd: parseFloat(nowData.COL16),
          stripsNs: parseInt(nowData.COL17),
          stripsEw: parseInt(nowData.COL18),
          endLap: parseFloat(nowData.COL19),
          sideLap: parseFloat(nowData.COL20),
          ellHeight: parseFloat(nowData.COL21),
          agl: parseFloat(nowData.COL22),
          // camReport: null,
          // planMap: null,
        });
        break;
      case "J":
        saveRecord01API({
          updateRecord01Id: nowData.caseid,
          camType: 3,
          focal: parseFloat(nowData.COL05),
          ppaX: parseFloat(nowData.COL06),
          ppaY: parseFloat(nowData.COL07),
          pxW: parseInt(nowData.COL09),
          pxH: parseInt(nowData.COL08),
          pxSizeX: parseFloat(nowData.COL10),
          pxSizeY: parseFloat(nowData.COL11),
          sizeX: parseFloat(((parseFloat(nowData.COL09) * parseFloat(nowData.COL10)) / 1000).toFixed(4)),
          sizeY: parseFloat(((parseFloat(nowData.COL08) * parseFloat(nowData.COL11)) / 1000).toFixed(4)),
          distorCorrSoft: nowData.COL14.split(";")[0],
          distorCorrVer: nowData.COL14.split(";")[1],
          planYear: parseInt(nowData.COL15),
          planMonth: parseInt(nowData.COL16),
          gsd: parseFloat(nowData.COL17),
          stripsNs: parseInt(nowData.COL18),
          stripsEw: parseInt(nowData.COL19),
          endLap: parseFloat(nowData.COL20),
          sideLap: parseFloat(nowData.COL21),
          ellHeight: parseFloat(nowData.COL22),
          agl: parseFloat(nowData.COL23),
          camReport: null,
          planMap: null,
        });
        break;
      case "I":
        saveRecord02API({
          updateRecord02Id: nowData.caseid,
          type: parseInt(nowData.COL05),
          // gnssId: null,
          // imuId: null,
          disPresision: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL06):null,
          angResolution: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL07):null,
          beam: parseFloat(nowData.COL08),
          precH: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL12):parseFloat(nowData.COL06),
          precV: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL13):parseFloat(nowData.COL07),
          omega: parseFloat(nowData.COL17),
          phi: parseFloat(nowData.COL18),
          kappa: parseFloat(nowData.COL19),
          precOri: parseFloat(nowData.COL20),
          planYear: parseInt(nowData.COL21),
          planMonth: parseInt(nowData.COL22),
          stripsNo: parseInt(nowData.COL23),
          ellHeight: parseFloat(nowData.COL24),
          agl: parseFloat(nowData.COL25),
          cloudDensity: parseFloat(nowData.COL26),
          fov: parseFloat(nowData.COL27),
          // lidarReport: null,
          // posReport: null,
          // planMap: null,
        });
        break;
    }
  });
}

// 儲存Record01API
const {
  mutate: saveRecord01API,
  onDone: saveRecord01APIOnDone,
  onError: saveRecord01APIError,
} = useMutation(CaseGQL.SAVECASERECORD01);
// 儲存Record02API
const {
  mutate: saveRecord02API,
  onDone: saveRecord02APIOnDone,
  onError: saveRecord02APIError,
} = useMutation(CaseGQL.SAVECASERECORD02);


// 連線取得案件==========End


</script>
<template>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    appendToBody autohide :delay="2000">
    {{ infomsg }}
  </MDBAlert>
  <!-- 選擇顧客 -->
  <MDBModal @shown="shownCustModal()" v-model="showCustFrom" staticBackdrop scrollable>
    <MDBModalHeader>
      <MDBModalTitle>請選擇顧客</MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <MDBContainer fluid>
        <MDBRow>
          <!-- 顧客列表 -->
          <MDBCol col="12">
            <DataTable :data=" dataCust" :columns="columnsCust" :options="tboptionCust" ref="tableCust"
              style="font-size: smaller" class="display w-100 compact" />
          </MDBCol>
          <!-- 篩選 或 編輯 -->
          <MDBCol col="12" class="border">
            <MDBTabs v-model="custTabId">
              <MDBTabNav tabsClasses="">
                <MDBTabItem tabId="editor" href="editor">資料編輯</MDBTabItem>
                <MDBTabItem tabId="filter" href="filter">條件篩選</MDBTabItem>
              </MDBTabNav>
              <MDBTabContent>
                <!-- 編輯表單 -->
                <MDBTabPane class="h-100" tabId="editor">
                  <!-- 功能列 -->
                  <div class="mt-2">
                    <MDBBtn size="sm" color="primary" @click="saveCust()">儲存</MDBBtn>
                    <MDBBtn size="sm" color="primary" @click="gotoCustMG()">顧客管理</MDBBtn>
                  </div>
                  <MDBRow>
                    <MDBSelect filter size="sm" class="my-3  col-12" label="公司名稱" v-model:options="selCustOrgNameMU"
                      v-model:selected="selCustOrgName" ref="selCustOrgNameDOM" />
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="聯絡人" v-model="selCustName" />
                    </MDBCol>
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="統一編號" v-model="selCustTaxId" disabled />
                    </MDBCol>
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="聯絡電話" v-model="selCustTel" />
                    </MDBCol>
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="傳真" v-model="selCustFax" />
                    </MDBCol>
                    <MDBCol col="12" class="mb-2">
                      <MDBInput size="sm" type="text" label="地址" v-model="selCustAddress" />
                    </MDBCol>
                  </MDBRow>
                </MDBTabPane>
                <!-- 篩選表單 -->
                <MDBTabPane tabId="filter">
                  <!-- 功能列 -->
                  <div class="mt-2">
                    <MDBBtn size="sm" color="primary" @click="doCustFilter()">篩選</MDBBtn>
                    <MDBBtn size="sm" color="primary" @click="clearCustFilter()">清除</MDBBtn>
                  </div>
                  <!-- 條件欄位 -->
                  <MDBRow>
                    <MDBCol col="12" class="my-2">
                      <MDBInput size="sm" type="text" label="公司名稱" v-model="filterCustOrgName" />
                    </MDBCol>
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="聯絡人" v-model="filterCustName" />
                    </MDBCol>
                    <MDBCol col="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="統一編號" v-model="filterCustTaxId" />
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
      <MDBCol>目前選取：{{ selCustName }}</MDBCol>
      <MDBBtn color="primary" @click="setCustBtn()">加入</MDBBtn>
    </MDBModalFooter>
  </MDBModal>
  <!-- API匯入 -->
  <MDBModal @shown="shownAPIModal()" v-model="showAPIFrom" size="lg" staticBackdrop scrollable>
    <MDBModalHeader>
      <MDBModalTitle>校正案件匯入</MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <MDBContainer fluid>
        <MDBRow>
          <!-- 上方 取得案件列表 -->
          <MDBCol col="12" class="h-50">
            <div :class="{ 'hiddenSpinner': notProssing}" style="position: absolute; left: 50%; top: 10rem;">
              <MDBSpinner size="md" color="primary" />Loading...
            </div>
            <DataTable :data=" dataAPI" :columns="columnsAPI" :options="tboptionAPI" ref="tableAPI"
              style="font-size: smaller" class="display w-100 compact" />
          </MDBCol>
          <!-- 下方 操作面板 -->
          <MDBCol col="12" class="border h-50 mt-2">
            查詢API條件
            <MDBRow class="h-100">
              <!-- 左側 -->
              <MDBCol col="8">
                <!-- 條件欄位 -->
                <MDBRow>
                  <MDBCol md="12" class="my-2">
                    <MDBInput size="sm" type="text" label="申請表編號" v-model="apiCaseID" />
                  </MDBCol>
                  <div></div>
                  <MDBSelect size="sm" class="mb-2  md-12" label="校正項目" v-model:options="apiCalTypeIDMU"
                    v-model:selected="apiCalTypeID" ref="apiCalTypeIdDOM" />
                  <div></div>
                  <MDBCol md="6" class="mb-2">
                    <MDBDatepicker size="sm" v-model="apiStartDate" format="YYYY-MM-DD" label="申請日(起)"
                      ref="apiStartDateDOM" />
                  </MDBCol>
                  <MDBCol md="6" class="mb-2">
                    <MDBDatepicker size="sm" v-model="apiEndDate" format="YYYY-MM-DD" label="申請日(迄)"
                      ref="apiEndDateDOM" />
                  </MDBCol>
                  <MDBCol col="12" class="mb-2 d-flex justify-content-end">
                    <MDBBtn size="sm" color="primary" @click="getCaseByAPI">連線取得資料</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <!-- 右側 -->
              <MDBCol col="4">
                <!-- 操作按鈕 -->
                <MDBRow>
                  <MDBCol col="6" class="mb-2">
                    <MDBBtn class="w-100" size="sm" color="primary" @click="inputSelAll">全選</MDBBtn>
                  </MDBCol>
                  <MDBCol col="6" class="mb-2">
                    <MDBBtn class="w-100" size="sm" color="primary" @click="inputSelClear">清除</MDBBtn>
                  </MDBCol>
                  <MDBCol col="12" class="mt-4">
                    <MDBBtn class="w-100" size="sm" color="secondary" @click="inputAPICase">匯入新增案件</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBModalBody>
  </MDBModal>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <!-- <MDBContainer tag="main" fluid> -->
      <MDBAnimation style="height: calc(100% - 6.5em);" :animation="animationType" trigger="manually"
        v-model="showCaseEditAnima">
        <MDBRow style="margin-left:0;margin-right:0;" class="h-100 flex-md-nowrap overflow-visible">
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
                      <MDBBtn size="sm" color="primary" @click="caseClearFilter()">清除</MDBBtn>
                      <MDBBtn size="sm" color="primary" @click="caseDoFilter()">篩選</MDBBtn>
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
                    <MDBDatepicker size="sm" v-model="caseAppDateStartSEL" format="YYYY-MM-DD" label="申請日(起)"
                      ref="caseAppDateStartFilter" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBDatepicker size="sm" v-model="caseAppDateEndtSEL" format="YYYY-MM-DD" label="申請日(迄)"
                      ref="caseAppDateEndFilter" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBDatepicker size="sm" v-model="casePayDateStartSEL" format="YYYY-MM-DD" label="繳費日(起)"
                      ref="casePayDateStartFilter" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBDatepicker size="sm" v-model="casePayDateEndtSEL" format="YYYY-MM-DD" label="繳費日(迄)"
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
                <MDBPopconfirm :disabled="!rGroup[2]" class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                  message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delCase">
                  刪除案件
                </MDBPopconfirm>
                <MDBBtn size="sm" :disabled="addBtnDisabled || !rGroup[3]" color="primary" @click="openAddCaseForm()">新增
                </MDBBtn>
                <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveNowCaseData()">儲存</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="showCaseEdit()" v-html="caseBtnText">
                </MDBBtn>
              </div>
              <hr>
              <MDBSelect :disabled="!rGroup[1]" filter size="sm" class="mb-3  col-6" label="校正人員"
                v-model:options="nowCaseOperatorMU" v-model:selected="nowCaseOperator" ref="nowCaseOperatorDOM" />
              <MDBSelect :disabled="!rGroup[1]" filter size="sm" class="mb-3  col-6" label="技術主管"
                v-model:options="nowCaseLeaderMU" v-model:selected="nowCaseLeader" ref="nowCaseLeaderDOM" />
              <MDBSelect :disabled="!rGroup[2]" size="sm" class="mb-3  col-6" label="案件狀態"
                v-model:options="nowCaseStatusMU" v-model:selected="nowCaseStatus" ref="nowCaseStatusDOM" />
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
              <MDBCol col="6" class="mb-3 ps-0">
                <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="showCustFrom=true">查詢顧客</MDBBtn>
              </MDBCol>
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
                <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="copyTileAdd()">同上</MDBBtn>
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="報告抬頭" v-model="nowCaseTitle" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="報告地址" v-model="nowCaseAddress" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="校正目的" v-model="nowCasePurpose" />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput :disabled="!rGroup[2]" size="sm" style="text-align: right" type="text" label="費用"
                  v-model="nowCaseCharge" />
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBDatepicker size="sm" v-model="nowCasePayDate" format="YYYY-MM-DD" label="繳費日"
                  ref="nowCasePayDateDOM" />
              </MDBCol>
              <MDBCol col="12" class="mb-3">
                <MDBTextarea :disabled="!rGroup[2]" size="sm" label="協議事項" rows="2" v-model="nowCaseAgreement" />
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 新增案件表單 -->
          <MDBCol md="4" v-show="showCaseNew" class="h-100 py-2 bg-primary">
            <MDBAnimation class="h-100" animation="fade-in-right" trigger="manually" v-model="showCaseNew">
              <MDBRow tag="form" @submit.prevent="AddCaseOK()" style="margin-left:0;margin-right:0;"
                class="h-100 bg-light align-content-start overflow-auto border border-5 rounded-8 shadow-4">
                <MDBCol col="12" class="mb-3">新增案件</MDBCol>
                <div class="d-flex mb-3 justify-content-end">
                  <MDBBtn size="sm" color="warning" @click="AddCaseCancel()">取消</MDBBtn>
                  <MDBBtn size="sm" color="primary" type="submit">確認</MDBBtn>
                  <MDBBtn size="sm" color="warning" @click="showAPIFrom=true">連線取得</MDBBtn>
                </div>
                <MDBCol col="6" class="mb-4">
                  <MDBInput required counter :maxlength="12" size="sm" type="number" label="案件編號" v-model="addCaseID" />
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
                  <MDBDatepicker required size="sm" v-model="addCaseAppDate" format="YYYY-MM-DD" label="申請日"
                    ref="addCaseAppDateDOM" />
                </MDBCol>
                <MDBCol col="6" class="mb-3">
                  <MDBBtn size="sm" color="primary" @click="getAppDateByCaseId()">自動取得</MDBBtn>
                </MDBCol>
                <div></div>
                <MDBCol style="font-size: 0.8rem" class="mx-3 mb-3 p-2 border">
                  申請日期可由案件編號前8碼取得或自行設定
                </MDBCol>
                <div></div>
                <MDBSelect required data-mdb-validation="true" data-mdb-valid-feedback="This value is valid"
                  data-mdb-invalid-feedback="This value is invalid" size="sm" class="mb-3  col-10" label="校正項目"
                  v-model:options="addCaseTypeIdMU" v-model:selected="addCaseTypeIdSEL" ref="addCaseTypeIdDOM" />
                <div></div>
                <MDBCol col="12" class="mb-4">
                  <MDBInput required size="sm" type="text" label="校正目的" v-model="addCasePurpose" />
                </MDBCol>
              </MDBRow>
            </MDBAnimation>
          </MDBCol>
          <MDBCol md="8" v-if="showCaseEditR01Flag" class="h-100 py-2">
            <MDBRow style="margin-left:0;margin-right:0;" class="h-100 bg-light border border-5 rounded-8 shadow-4">
              <!-- record01表單 -->
              <Record01 :caseID="nowCaseID" :key="updateKey" ref="subFormRecord01" />
            </MDBRow>
          </MDBCol>
          <MDBCol md="8" v-else-if="showCaseEditR02Flag" class="h-100 py-2">
            <MDBRow style="margin-left:0;margin-right:0;" class="h-100 bg-light border border-5 rounded-8 shadow-4">
              <!-- record02表單 -->
              <Record02 :caseID="nowCaseID" :key="updateKey" ref="subFormRecord02" />
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBAnimation>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.datatable tbody tr:last-child {
  border-bottom: rgba(0, 0, 0, 0);
  height: auto;
}

div.dataTables_filter {
  padding-top: 0.85em;
}

.colAlignRight {
  text-align: right;
}

tr>td>span.status89 {
  color: #DE3163;
}

tr.selected>td>span.status89 {
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

.slide-left-ja {
  animation-name: slide-left-ja;
}

@keyframes slide-left-ja {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-66.16666667%, 0, 0);
    /* visibility: hidden; */
  }
}

.slide-right-ja {
  animation-name: slide-right-ja;
}

@keyframes slide-right-ja {
  from {
    transform: translate3d(-66.16666667%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    /* visibility: hidden; */
  }
}

.hiddenSpinner {
  display: none;
}
</style>
