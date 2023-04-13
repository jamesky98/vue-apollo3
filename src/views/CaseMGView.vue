<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import Record01 from "../components/Record01.vue";
import Record02 from "../components/Record02.vue";
import Record03 from "../components/Record03.vue";
import { 
  ref, reactive, onMounted, 
  provide, inject, watch,
  isProxy, toRaw } from "vue";
import path from "path-browserify";
import {
  MDBInput,  MDBTextarea,
  MDBCol,  MDBRow,  MDBContainer,
  MDBSelect,  MDBDatepicker,  MDBBtn,  MDBPopconfirm,
  MDBSpinner,  MDBAnimation,  MDBAlert,
  MDBModal,  MDBModalHeader,  MDBModalTitle,  MDBModalBody,  MDBModalFooter,
  MDBSwitch,
} from 'mdb-vue-ui-kit';
import gql from "graphql-tag";
import CaseGQL from "../graphql/Cases";
import CustGQL from "../graphql/Cust";
import EmpGQL from "../graphql/Employee";
import ItemGQL from "../graphql/Item";
import router from "../router";
import { computed } from "@vue/reactivity";
import { 
    monthsFull, 
    monthsShort, 
    weekdaysFull, 
    weekdaysShort,
    weekdaysNarrow
  } from "../methods/datePickerParams.js"

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate } from '../methods/User';
import { resolve } from "chart.js/helpers";
import { useStore } from 'vuex'

// dataTable
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import Select from 'datatables.net-select';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import print from 'datatables.net-buttons/js/buttons.print'
import colvis from 'datatables.net-buttons/js/buttons.colVis'
import 'datatables.net-responsive';
import ButtonsBs5 from 'datatables.net-buttons-bs5';
// import 'datatables.net-select';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

DataTable.use(DataTablesCore);
DataTable.use(Select);
DataTable.use(ButtonsHtml5);
DataTable.use(print);
DataTable.use(colvis);
DataTable.use(ButtonsBs5);

//#region 取得權限==========Start
  // const myUserId = ref("");
  const myUserName = inject("myUserName");
  // const myUserName2 = ref("");
  // const myUserEmail = ref("");
  // const myUserActive = ref(false);
  const myUserRole = inject("myUserRole");

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

const rGroupSetting = inject("rGroupSetting");
const rGroup = computed(() => {
  let opt1=false;
  if (parseInt(myUserName.value) === parseInt(nowCaseOperator.value)){
    opt1=true;
  }
  return rGroupSetting(myUserRole.value,opt1)
});
provide("rGroup", rGroup);
//#endregion 取得權限==========End

//#region 參數==========Start
  //#region Information
    const NavItem = ref("cases");
    provide("NavItem", NavItem);
    const infomsg = ref("");
    const alert1 = ref(false);
    const alertColor = ref("primary");
    const updateKey = ref(0);
    const store = useStore();
    const publicPath = computed(() => store.state.selectlist.publicPath);

    const varAllCust = ref({});
    const listOpened = ref(false);
    // 篩選條件
    const filterVariables = computed(()=>{
      return {
        statusCode: (caseStatusSEL.value)?parseInt(caseStatusSEL.value):null,
        getAllCaseId: (caseIDSEL.value)?caseIDSEL.value:null,
        calType: (caseTypeSEL.value)?parseInt(caseTypeSEL.value):null,
        operatorsId: (caseOptSEL.value)?parseInt(caseOptSEL.value):null,
        orgId: (caseCustSEL.value)?parseInt(caseCustSEL.value):null,
        itemChop: (caseChopSEL.value)?caseChopSEL.value:null,
        itemModel: (caseModelSEL.value)?caseModelSEL.value:null,
        itemSn: (caseSelnumSEL.value)?caseSelnumSEL.value:null,
        appdateStart: (caseAppDateStartSEL.value.trim())?(caseAppDateStartSEL.value.trim() + "T00:00:00.000Z"):null,
        appdateEnd: (caseAppDateEndtSEL.value.trim())?(caseAppDateEndtSEL.value.trim() + "T00:00:00.000Z"):null,
        paydateStart: (casePayDateStartSEL.value.trim())?(casePayDateStartSEL.value.trim() + "T00:00:00.000Z"):null,
        paydateEnd: (casePayDateEndtSEL.value.trim())?(casePayDateEndtSEL.value.trim() + "T00:00:00.000Z"):null,
        notstatus: (showRejectCase.value)?null:9,
      }
    });
    // 新增案件指標
    const showCaseNew = ref(false);
  //#endregion Information

  //#region 查詢顧客之參數
    const selCustTaxId = ref("");
    const selCustTel = ref("");
    const selCustFax = ref("");
    const selCustAddress = ref("");
  //#endregion 查詢顧客之參數

  //#region 案件資訊
    //#region 案件狀態
      // 資料區
      const caseStatusList = computed(() => store.state.selectlist.caseStatusList);
      const nowCaseStatus = ref("");
      const nowCaseStatusMU = ref([]);
      const nowCaseStatusDOM = ref();
      // 篩選區
      const caseStatusMU = ref([]);
      const caseStatusSEL = ref("");
      const caseStatusDOM = ref();

      // 偵測清單是否更新
      watch(caseStatusList,(newList)=>{
        writeCaseStatusList(newList);
      })
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeCaseStatusList(newList){
        // console.log('listOpened',listOpened.value);
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值 更新清單
        let tempNowCaseStatusValue = nowCaseStatus.value
        nowCaseStatusMU.value = JSON.parse(JSON.stringify(tempList));
        let tempCaseStatusSELValue = caseStatusSEL.value
        caseStatusMU.value = JSON.parse(JSON.stringify(tempList));
        
        let chData = {
          operators_id:nowCaseOperator.value,
          leader_id:nowCaseLeader.value,
          cus_id:nowCaseCustId.value,
          item_id:nowCaseItemID.value,
          receive_date:nowCaseRecDate.value,
          start_Date:nowCaseStartDate.value,
          complete_date:nowCaseCompleteDate.value,
          report_edit:nowCaseReportEdit.value,
          chk_person_id:nowCaseChkPersonID.value,
          sign_person_id:nowCaseSignPersonID.value,
          report_scan:nowCaseReportScan.value,
          pay_date:nowCasePayDate.value,
          charge:nowCaseCharge.value,
          agreement:nowCaseAgreement.value,
        }
        ckCaseStatusList(chData).then(res=>{
          // 資料區
          nowCaseStatus.value = tempNowCaseStatusValue;
          nowCaseStatusDOM.value.setValue(tempNowCaseStatusValue);
          // 篩選區
          caseStatusSEL.value = tempCaseStatusSELValue;
          caseStatusDOM.value.setValue(tempCaseStatusSELValue);
        });
      }

      // 案件狀態之樣式
      const statusIcon =computed(() => {
        let classn;
        // console.log(nowCaseStatus.value)
        switch (nowCaseStatus.value) {
            case 9: //退件
              classn = "status9";
              break;
            case 8: //補件
              classn = "status8";
              break;
            case 7: //結案
              classn = "status7";
              break;
            case 6: //待繳費
              classn = "status6";
              break;
            case 5: //陳核
              classn = "status5";
              break;
            case 4: //校正中
              classn = "status4";
              break;
            case 3: //待送件
              classn = "status3";
              break;
            case 2: //審核中
              classn = "status2";
              break;
            default:
              // case 1: //(空)
              classn = "status1";
          }
        return classn
      })
    //#endregion 案件狀態
    
    const caseCalType = ref(); // 校正項目
    
    // 案件編號
    const nowCaseID = ref("");
    
    // 申請日期
    const nowCaseAppDate = ref("");
    //#region 校正項目
      const caseCalTypeList = computed(() => store.state.selectlist.caseCalTypeList);
      // 資料區
      const nowCaseTypeName = ref("");
      const nowCaseTypeId = ref("");
      const addCaseTypeIdMU = ref([]);
      const addCaseTypeIdSEL = ref("");
      const addCaseTypeIdDOM = ref("");
      // 篩選區
      const caseTypeMU = ref([]);
      const caseTypeSEL = ref("");
      const caseTypeFilter = ref();
      // API連線區
      const apiCalTypeIDMU = ref([]);
      const apiCalTypeIdDOM = ref();

      // 偵測清單是否更新
      watch(caseCalTypeList,(newList)=>{
        writeCaseCalTypeList(newList);
      })
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeCaseCalTypeList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值
        let tempAddCaseTypeIdSEL = addCaseTypeIdSEL.value;
        let tempCaseTypeSEL = caseTypeSEL.value;
        let tempApiCalTypeID = apiCalTypeID.value;
        new Promise((res,rej)=>{
          addCaseTypeIdMU.value = JSON.parse(JSON.stringify(tempList));
          res(addCaseTypeIdMU.value)
        }).then(res=>{
          caseTypeMU.value = JSON.parse(JSON.stringify(tempList));
          return caseTypeMU.value
        }).then(res=>{
          apiCalTypeIDMU.value = JSON.parse(JSON.stringify(tempList));
          return apiCalTypeIDMU.value
        }).then(res=>{
          // 寫回保留值
          addCaseTypeIdSEL.value = tempAddCaseTypeIdSEL;
          addCaseTypeIdDOM.value.setValue(tempAddCaseTypeIdSEL);
          caseTypeSEL.value = tempCaseTypeSEL;
          caseTypeFilter.value.setValue(tempCaseTypeSEL);
          if(apiCalTypeIdDOM.value){
            apiCalTypeID.value = tempApiCalTypeID;
            apiCalTypeIdDOM.value.setValue(tempApiCalTypeID);
          }
        })
      }

    //#endregion 校正項目
    
    // 校正件
    const nowCaseItemID = ref("");
    provide('nowCaseItemID', nowCaseItemID);

    //#region 顧客
      const caseOrgList = computed(() => store.state.selectlist.caseOrgList);
      const nowCaseCustId = ref("");
      const nowCaseCustOrgName = ref("");
      // 統一編號
      const nowCaseCustTaxID = ref("");
      // 聯絡人
      const nowCaseCustName = ref("");
      // 顧客電話
      const nowCaseCustTel = ref("");
      // 顧客傳真
      const nowCaseCustFax = ref("");
      // 聯絡地址
      const nowCaseCustAddress = ref("");
      // 報告抬頭
      const nowCaseTitle = ref("");
      provide("nowCaseTitle", nowCaseTitle);
      // 報告地址
      const nowCaseAddress = ref("");
      provide("nowCaseAddress", nowCaseAddress);

      // 顧客公司
      const caseCustMU = ref([]);
      const caseCustSEL = ref("");
      const caseCustFilter = ref();

      // 顧客列表
      const showCustFrom = ref(false);
      const seletCustId = ref("");
      const selCustName = ref("");
      const selCustOrgName = ref("");
      const selCustOrgNameMU = ref([]);
      const selCustOrgNameDOM = ref();

      // 偵測清單是否更新
      watch(caseOrgList,(newList)=>{
        writeOrgList(newList);
      })
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeOrgList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值
        let tempCaseCustSEL = caseCustSEL.value;
        let tempSelCustOrgName = selCustOrgName.value;
        new Promise((res,rej)=>{
          caseCustMU.value = JSON.parse(JSON.stringify(tempList));
          res(caseCustMU.value);
        }).then(res=>{
          selCustOrgNameMU.value = JSON.parse(JSON.stringify(tempList));
          return selCustOrgNameMU.value
        }).then(res=>{
          // 寫回保留值
          caseCustSEL.value = tempCaseCustSEL;
          caseCustFilter.value.setValue(tempCaseCustSEL);
          if(selCustOrgNameDOM.value){
            selCustOrgName.value = tempSelCustOrgName;
            selCustOrgNameDOM.value.setValue(tempSelCustOrgName);
          }
        })
      }
    //#endregion 顧客

    //#region 廠牌型號
      const caseChopList = computed(() => store.state.selectlist.caseChopList);
      const caseModelList = computed(() => store.state.selectlist.caseModelList);
      // 廠牌
      const caseChopMU = ref([]);
      const caseChopSEL = ref("");
      const caseChopFilter = ref();
      // 型號
      const caseModelMU = ref([]);
      const caseModelSEL = ref("");
      const caseModelFilter = ref();
      // 偵測清單是否更新
      watch(caseChopList,(newList)=>{
        writeChopList(newList);
      });
      watch(caseModelList,(newList)=>{
        writeModelList(newList);
      });

      // 將上層案件狀態資料寫入本組件之選單物件
      function writeChopList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值
        let tempCaseChopSEL = caseChopSEL.value;
        // 更新清單，使用promise確保更新後暫存值確實填入
        new Promise((res,rej)=>{
          caseChopMU.value = JSON.parse(JSON.stringify(tempList));
          res(caseChopMU.value);
        }).then(res=>{
          // 寫回保留值
          caseChopSEL.value = tempCaseChopSEL;
          caseChopFilter.value.setValue(tempCaseChopSEL);
        })
      }
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeModelList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值 
        let tempCaseModelSEL = caseModelSEL.value;
        // 更新清單，使用promise確保更新後暫存值確實填入
        new Promise((res,rej)=>{
          caseModelMU.value = JSON.parse(JSON.stringify(tempList));
          res(caseModelMU.value);
        }).then(res=>{
          // 寫回保留值
          caseModelSEL.value = tempCaseModelSEL;
          caseModelFilter.value.setValue(tempCaseModelSEL);
        })
      }
    //#endregion 廠牌型號

    //#region 校正人員及技術主管
      // 校正人員
      const nowCaseOperator = ref("");
      const nowCaseOperatorMU = ref([]);
      provide("caseOperatorList", nowCaseOperatorMU);
      const nowCaseOperatorDOM = ref();
      // 校正人員篩選
      const caseOptMU = ref([]);
      const caseOptSEL = ref("");
      const caseOptFilter = ref();
      // 查詢校正人員列表
      const { 
        mutate: refgetCaseOperator, 
        onDone: getCaseOperatoronDone, 
        onError: getCaseOperatoronError 
      } = useMutation(
        EmpGQL.GETEMPOWERBYROLE,
        ()=>({
          variables: {
            roleType:'校正人員',
            calType: parseInt(nowCaseTypeId.value),
          }
        })
      );
      getCaseOperatoronDone(result => {
        // 加入評估人員選單資料
        if (!result.loading && result.data.getEmpowerbyRole) {
          let mylist = [];
          mylist = result.data.getEmpowerbyRole.map(
            x => { return {person_id:x.person_id,name: x.employee.name} 
          });//從物件陣列中取出成陣列
          mylist = filterArrayforObj(mylist,"person_id");// 去除重複

          let tempMU = mylist.map(x => {
            return { text: x.name, value: x.person_id }
          });
          tempMU.unshift({ text: "-未選取-", value: "-1" });
          writeOperatorList(tempMU);
        }
      });
      getCaseOperatoronError(e=>{errorHandle(e,infomsg,alert1)});
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeOperatorList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值 
        let tempNowCaseOperator = nowCaseOperator.value;
        let tempCaseOptSEL = caseOptSEL.value;
        // 更新清單，使用promise確保更新後暫存值確實填入
        new Promise((res,rej)=>{
          nowCaseOperatorMU.value = JSON.parse(JSON.stringify(tempList));
          res(nowCaseOperatorMU.value);
        }).then(res=>{
          caseOptMU.value = JSON.parse(JSON.stringify(tempList));
          return caseOptMU.value
        }).then(res=>{
          // 寫回保留值
          nowCaseOperator.value = tempNowCaseOperator;
          if(nowCaseOperatorDOM.value){
            nowCaseOperatorDOM.value.setValue(tempNowCaseOperator);
          }
          caseOptSEL.value = tempCaseOptSEL;
          caseOptFilter.value.setValue(tempCaseOptSEL);
        })
      }

      // 技術主管
      const nowCaseLeader = ref("");
      const nowCaseLeaderMU =ref([]);
      const nowCaseLeaderDOM = ref();
      // 查詢技術主管列表
      const { 
        mutate: refgetCaseLeader, 
        onDone: getCaseLeaderonDone, 
        onError: getCaseLeaderonError 
      } = useMutation(
        EmpGQL.GETEMPOWERBYROLE,
        ()=>({
          variables: {
            roleType:'技術主管',
            calType: parseInt(nowCaseTypeId.value),
          }
        })
      );
      getCaseLeaderonDone(result => {
        // 加入技術主管選單資料
        if (!result.loading && result.data.getEmpowerbyRole) {
          let mylist = [];
          mylist = result.data.getEmpowerbyRole.map(x => { return {person_id:x.person_id,name: x.employee.name} });//從物件陣列中取出成陣列
          mylist = filterArrayforObj(mylist,"person_id");// 去除重複

          let tempMU = mylist.map(x => {
            return { text: x.name, value: x.person_id }
          });
          tempMU.unshift({ text: "-未選取-", value: "-1" });
          writeLeaderList(tempMU);
        }
      });
      getCaseLeaderonError(e=>{errorHandle(e,infomsg,alert1)});
      // 將上層案件狀態資料寫入本組件之選單物件
      function writeLeaderList(newList){
        if(listOpened.value){return}
        let tempList = (isProxy(newList))?toRaw(newList):newList;
        // 保留暫存值 
        let tempNowCaseLeader = nowCaseLeader.value;
        // 更新清單，使用promise確保更新後暫存值確實填入
        new Promise((res,rej)=>{
          nowCaseLeaderMU.value = JSON.parse(JSON.stringify(tempList));
          res(nowCaseLeaderMU.value);
        }).then(res=>{
          // 寫回保留值
          nowCaseLeader.value = tempNowCaseLeader;
          nowCaseLeaderDOM.value.setValue(tempNowCaseLeader);
        })
      }
    //#endregion 校正人員及技術主管
    
    const nowCasePurpose = ref(""); // 校正目的
    const nowCaseAgreement = ref(""); // 協商事項
    const nowCaseCharge = ref(""); // 費用
    const nowCasePayDate = ref(""); // 繳費日
    const nowCasePayDateDOM = ref();
    const nowCaseRecDate = ref(""); // 送校日期
    provide("nowCaseRecDate", nowCaseRecDate);
    const nowCaseStartDate = ref(""); //開始校正日
    provide("nowCaseStartDate", nowCaseStartDate);
    const nowCaseCompleteDate = ref(""); //報告(列印)日期
    provide("nowCaseCompleteDate", nowCaseCompleteDate);
    const nowCaseReportEdit = ref(""); //校正報告編輯檔
    provide("nowCaseReportEdit", nowCaseReportEdit);

    const nowCaseChkPersonID = ref(""); //數據檢核人
    provide("nowCaseChkPersonID_0", nowCaseChkPersonID);
    const nowCaseSignPersonID = ref(""); // 報告簽署人
    provide("nowCaseSignPersonID_0", nowCaseSignPersonID);
    const nowCaseReportScan = ref(""); //校正報告掃描檔
    provide("nowCaseReportScan", nowCaseReportScan);

  //#endregion 案件資訊

  // 全案件資料響應物件
  const nowCase = reactive({ data:{} });
  provide("nowCase", nowCase);

  //#region 新增案件之參數
    const addCaseID = ref("");
    const addCaseAppDate = ref("");
    const addCaseAppDateDOM = ref();
    const addCasePurpose = ref("");
  //#endregion 新增案件之參數

  //#region 篩選參數==========
    // 顯示退件
    const showRejectCase = ref(false);

    // 案件編號
    const caseIDSEL = ref("");
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
  //#endregion 篩選參數==========

//#endregion 參數==========End

//#region 案件列表=========start
let dt1;
const table1 = ref();
const data1 = ref([]);
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
          markicon = '<i class="fas fa-wifi rotation180"></i>';
          classn = "typeI"
          break;
        case "J": //小像幅
          markicon = '<i class="fas fa-camera"></i>';
          classn = "typeJ"
          break;
        case "M": //車載光達
          markicon = '<i class="fas fa-taxi"></i>';
          classn = "typeM"
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
  { data: "agreement", title: "註明事項", defaultContent: "-", visible: true },
];
const tboption1 = {
  dom: 'Bfti',
  buttons: [
    {
      text: '重新整理',
      action: function ( e, dt, node, config ) {
        updateAllCaseList();
      }
    },
    {
      extend: 'copy',
      text: '複製',
      exportOptions: {
        modifier: {
          selected: null
        }
      }
    },
    {
      extend: 'colvis',
      text: '顯示欄位',
    }
  ],
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: 'calc(75vh - 15rem)',
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
const { mutate: refgetAllCase, onDone: getAllCaseonDone, onError: getAllCaseonError } = useMutation(CaseGQL.GETALLCASE);
getAllCaseonDone(result => {
  // 加入table1資料
  if (!result.loading) {
    data1.value = result.data.getAllCase;
    notProssing2.value = true;
  }
});
getAllCaseonError(e=>{errorHandle(e,infomsg,alert1)});

//#endregion 案件列表=========End

//#region 顧客列表=========start
let dtCust;
const tableCust = ref();
const dataCust = ref([]);
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

// 查詢顧客資料
const { mutate: refgetAllCust , onDone: getAllCustonDone, onError: getAllCustonError } = useMutation(
  CustGQL.GETALLCUST,
  ()=>({
    variables: varAllCust.value
  })
);
getAllCustonDone(result => {
  // 加入顧客資料
  if (!result.loading && result.data) {
    dataCust.value = result.data.getAllCust;
  }
});
getAllCustonError(e=>{errorHandle(e,infomsg,alert1)});

// 查詢選取顧客資料
const {  mutate: refgetselCust, onDone: getselCustonDone, onError: getselCustonError } = useMutation(
  CustGQL.GETCUSTBYID,
  () => ({
    getCustByIdId: (parseInt(seletCustId.value))?parseInt(seletCustId.value):-1
  })
);
getselCustonDone(result => {
  if (!result.loading && result && result.data.getCustById) {
    // console.log('selCustID',seletCustId.value);
    let getData = result.data.getCustById
    // console.log('getData',getData);
    selCustName.value = getData.name;
    selCustOrgName.value = getData.org_id;
    selCustOrgNameDOM.value.setValue(parseInt(selCustOrgName.value));
    selCustTaxId.value = getData.cus_org.tax_id;
    selCustTel.value = getData.tel;
    selCustFax.value = getData.fax;
    selCustAddress.value = getData.address;
  }
});
getselCustonError(e=>{errorHandle(e,infomsg,alert1)});

// 開啟顧客視窗
function shownCustModal() {
  dtCust = tableCust.value.dt();
  dtCust.on('select', function (e, dt, type, indexes) {
    let getData = dt.rows(indexes).data()[0];
    // console.log('getID',getData.id);
    seletCustId.value = (parseInt(getData.id))?parseInt(getData.id):-1;
    refgetselCust({getCustByIdId: seletCustId.value});
  });
  refgetAllCust();
  if (nowCaseCustId.value) {
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
saveCustOnDone(() => {
  refgetAllCust();
  refgetselCust({getCustByIdId: seletCustId.value});
  store.dispatch('selectlist/fetchOrgList');
  infomsg.value = "ID:" + seletCustId.value + " " + selCustName.value + "完成修改";
  alert1.value = true;
});
saveCustError(e=>{errorHandle(e,infomsg,alert1)});

// 更多編輯=>引導至顧客管理
function gotoCustMG() {
  router.push('/cust');
}

// 按加入後回填顧客id
function setCustBtn() {
  nowCaseCustId.value = seletCustId.value;
  let getData = caseOrgList.value.filter((x) => {
    return parseInt(x.value) === selCustOrgName.value;
  })[0];
  nowCaseCustOrgName.value = (getData) ? getData.text : "";
  nowCaseCustTaxID.value = selCustTaxId.value;
  nowCaseCustName.value = selCustName.value;
  nowCaseCustTel.value = selCustTel.value;
  nowCaseCustFax.value = selCustFax.value;
  nowCaseCustAddress.value = selCustAddress.value;
  showCustFrom.value = false;
}
//#endregion 顧客列表=========end

//#region 篩選=========start
// 清除條件
function caseClearFilter() {
  caseStatusDOM.value.setValue("");
  caseIDSEL.value = "";
  caseTypeFilter.value.setValue("");
  caseOptFilter.value.setValue("");
  caseCustFilter.value.setValue("");
  caseChopFilter.value.setValue("");
  caseModelFilter.value.setValue("");
  caseSelnumSEL.value = "";

  caseAppDateStartSEL.value = " ";
  // caseAppDateStartFilter.value.inputValue = ""
  caseAppDateEndtSEL.value = " ";
  // caseAppDateEndFilter.value.inputValue = ""

  casePayDateStartSEL.value = " ";
  // casePayDateStartFilter.value.inputValue = ""
  casePayDateEndtSEL.value = " ";
  // casePayDateEndFilter.value.inputValue = ""
  // filterVariables={notstatus: (showRejectCase.value)?null:9}
}
//#endregion 篩選=========end

//#region 填入下拉式選單==========Start
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

//#endregion 填入下拉式選單==========end

//#region 案件基本資料==========start
// 查詢顯示選擇案件之簡單資料
const { mutate: refgetNowCaseS, onDone: getNowCaseSonDone, onError: getNowCaseSonError } = useMutation(
  CaseGQL.GETFULLCASEBYID);
getNowCaseSonDone(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入簡單資料
    // nowCase.data = result.data.getCasebyID;
    let getData = result.data.getCasebyID;
    // console.log('getData',getData);
    // console.log('nowCase',nowCase);
    nowCaseStatus.value = getData.status_code
    nowCaseStatusDOM.value.setValue(parseInt(nowCaseStatus.value));
    nowCaseItemID.value = (getData.item_id)?getData.item_id:"";
    nowCaseAppDate.value = (getData.app_date) ? getData.app_date.split("T")[0] : " ";
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
      nowCasePayDate.value = " ";
      // nowCasePayDateDOM.value.inputValue = "";
    }

    nowCaseOperator.value = (parseInt(getData.operators_id))?parseInt(getData.operators_id):-1;
    nowCaseLeader.value = (parseInt(getData.leader_id))?parseInt(getData.leader_id):-1;
    refgetCaseOperator();
    refgetCaseLeader();
    // 為判斷案件狀態增加獲取參數
    if (getData.case_record_01){
      // 屬航測相機
      nowCaseRecDate.value = (getData.case_record_01.receive_date)?getData.case_record_01.receive_date.split("T")[0]:" ";
      nowCaseStartDate.value = (getData.case_record_01.start_Date)?getData.case_record_01.start_Date.split("T")[0]:" ";
      nowCaseCompleteDate.value = (getData.case_record_01.complete_date)?getData.case_record_01.complete_date.split("T")[0]:" ";
      nowCaseReportEdit.value = getData.case_record_01.report_edit;
      nowCaseChkPersonID.value = getData.case_record_01.chk_person_id;
      nowCaseSignPersonID.value = getData.case_record_01.sign_person_id;
      nowCaseReportScan.value = getData.case_record_01.report_scan;
    }else if (getData.case_record_02){
      // 屬空載光達
      nowCaseRecDate.value = (getData.case_record_02.receive_date)?getData.case_record_02.receive_date.split("T")[0]:" ";
      nowCaseStartDate.value = (getData.case_record_02.start_Date)?getData.case_record_02.start_Date.split("T")[0]:" ";
      nowCaseCompleteDate.value = (getData.case_record_02.complete_date)?getData.case_record_02.complete_date.split("T")[0]:" ";
      nowCaseReportEdit.value = getData.case_record_02.report_edit;
      nowCaseChkPersonID.value = getData.case_record_02.chk_person_id;
      nowCaseSignPersonID.value = getData.case_record_02.sign_person_id;
      nowCaseReportScan.value = getData.case_record_02.report_scan;
    }else if (getData.case_record_03){
      // 屬車載光達
      nowCaseRecDate.value = (getData.case_record_03.receive_date)?getData.case_record_03.receive_date.split("T")[0]:" ";
      nowCaseStartDate.value = (getData.case_record_03.start_Date)?getData.case_record_03.start_Date.split("T")[0]:" ";
      nowCaseCompleteDate.value = (getData.case_record_03.complete_date)?getData.case_record_03.complete_date.split("T")[0]:" ";
      nowCaseReportEdit.value = getData.case_record_03.report_edit;
      nowCaseChkPersonID.value = getData.case_record_03.chk_person_id;
      nowCaseSignPersonID.value = getData.case_record_03.sign_person_id;
      nowCaseReportScan.value = getData.case_record_03.report_scan;
    }
  }
});
getNowCaseSonError(e=>{errorHandle(e,infomsg,alert1)});

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
  updateAllCaseList();
});
delCaseError(e=>{errorHandle(e,infomsg,alert1)});

// 新增案件==開啟表單
function openAddCaseForm() {
  showCaseNew.value = true;
}

const caseBtnText = ref("編輯更多<i class='fas fa-angle-double-right'/>");
const isAniLeft = ref(true);
const showCaseLeftDiv = ref(true);
const animationType = ref("slide-left-ja");
const showCaseEditAnima = ref(false);
const showCaseEditR01Flag = ref(false);
const showCaseEditR02Flag = ref(false);
const showCaseEditR03Flag = ref(false);
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
    payDate: (nowCasePayDate.value.trim() === "") ? null : (nowCasePayDate.value.trim() + "T00:00:00.000Z"),
    agreement: nowCaseAgreement.value,
    leaderId: (parseInt(nowCaseLeader.value)===-1)?null:parseInt(nowCaseLeader.value),
    operatorsId: (parseInt(nowCaseOperator.value)===-1)?null:parseInt(nowCaseOperator.value),
  }
})
const { mutate: saveCaseS, onDone: saveCaseSOnDone, onError: saveCaseSError } = useMutation(
  CaseGQL.SAVECASESIMPLE);
saveCaseSOnDone(result => {
  if (!addBtnDisabled.value) {
    updateAllCaseList();
    infomsg.value = "ID:" + nowCaseID.value + "完成儲存";
    // alert1.value = true;
  }
});
saveCaseSError(e=>{errorHandle(e,infomsg,alert1)});

// mutation record01
const subFormRecord01 = ref();
// mutation record02
const subFormRecord02 = ref();
// mutation record03
const subFormRecord03 = ref();

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
      case 9:
        // 車載光達
        saveCaseS(saveCaseSVar.value);
        subFormRecord03.value.saveRecord03();
        break;
    }
  } else {
    // 簡易畫面saveSimple
    // mutation case_base
    saveCaseS(saveCaseSVar.value);
  }
}

// 顯示編輯更多畫面

function isAinmaDispaly(){
  // console.log('4-動畫停止');
  if (!isAniLeft.value) {
    isAniLeft.value = true;
    // console.log('5-關閉播放');
    showCaseEditAnima.value=false;
    // console.log('6-變更動畫名稱');
    // console.log('7-隱藏進階表單');
    showCaseEditR01Flag.value = false;
    showCaseEditR02Flag.value = false;
    showCaseEditR03Flag.value = false;
  }else{    
    isAniLeft.value =false;
    // console.log('5-關閉播放');
    showCaseEditAnima.value=false;
    // console.log('6-變更動畫名稱');
    // console.log('7-隱藏基本表單');
    showCaseLeftDiv.value = false;
  }
}
function showCaseEdit() {
  // console.log('0-show按鈕事件');
  if (!isAniLeft.value) {
    // console.log('1-向右移==隱藏進階');
    // 向右移==隱藏進階編輯
    // 顯示左方表單
    // console.log('2-顯示基本表單');
    showCaseLeftDiv.value = true;
    caseBtnText.value = "編輯更多<i class='fas fa-angle-double-right'/>";
    addBtnDisabled.value = false;
    //播放
    // console.log('3-變更標籤，播放動畫');
    animationType.value = "slide-right-ja"
    showCaseEditAnima.value=true;
    updateAllCaseList();
  }else if (isAniLeft.value) {
    // console.log('1-向左移==出現進階');
    // 向左移==出現進階編輯
    // 顯示進階表單
    if (nowCaseTypeId.value === 1 || nowCaseTypeId.value === 3) {
      // 航測像機
      // console.log('2-航測像機表單');
      showCaseEditR01Flag.value = true;
      showCaseEditR02Flag.value = false;
      showCaseEditR03Flag.value = false;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
      //播放
      // console.log('3-變更標籤，播放動畫');
      animationType.value = "slide-left-ja"
      showCaseEditAnima.value=true;
    }else if (nowCaseTypeId.value === 2) {
      // 空載光達
      // console.log('2-空載光達表單');
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = true;
      showCaseEditR03Flag.value = false;
      // updateKey.value=updateKey.value+1;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
      //播放
      // console.log('3-變更標籤，播放動畫');
      animationType.value = "slide-left-ja"
      showCaseEditAnima.value=true;
    }else if (nowCaseTypeId.value === 9) {
      // 車載光達
      // console.log('2-車載光達表單');
      showCaseEditR01Flag.value = false;
      showCaseEditR02Flag.value = false;
      showCaseEditR03Flag.value = true;
      // updateKey.value=updateKey.value+1;
      caseBtnText.value = "結束編輯<i class='fas fa-angle-double-left'/>";
      addBtnDisabled.value = true;
      //播放
      // console.log('3-變更標籤，播放動畫');
      animationType.value = "slide-left-ja"
      showCaseEditAnima.value=true;
    }else{
      // 未選案件不動作
    }
  }
}
//#endregion 案件基本資料==========end

//#region 新增案件表單==========start
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
    // addCaseAppDateDOM.value.inputValue = checkstr;
  }
}
// 新增案件==確認
const { mutate: addCase, onDone: addCaseOnDone, onError: addCaseError } = useMutation(
  CaseGQL.ADDCASE,
  () => ({
    variables: {
      creatCaseId: addCaseID.value,
      calType: parseInt(addCaseTypeIdSEL.value),
      appDate: (addCaseAppDate.value.trim() === "") ? null : (addCaseAppDate.value.trim() + "T00:00:00.000Z"),
      purpose: addCasePurpose.value,
      operatorsId: parseInt(myUserName.value),
    }
  })
);
addCaseOnDone((result) => {
  let getResultData = result.data.creatCase;
  // 填入基本資料
  nowCaseID.value = getResultData.id;
});
addCaseError(e=>{errorHandle(e,infomsg,alert1)});

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
      updateAllCaseList();
      refgetNowCaseS({getCasebyIdId: nowCaseID.value});
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
//#endregion 新增案件表單==========end

//#region 連線取得案件==========Start
let dtAPI;
const tableAPI = ref();
const dataAPI = ref([]);
const notProssing = ref(true);
const notProssing2 = ref(false);
const hasNowAllCase = ref([]);

const showAPIFrom = ref(false);
const apiCaseID = ref(""); // 申請單編號
const apiCalTypeID = ref(""); // 校正項目ID

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
const { mutate: refgetAPIAllCase, onDone: getAPIAllCaseonDone, onError: getAPIAllCaseonError} = useMutation(
  gql`mutation GetAllCase {
    getAllCase {
      id
    }
  }`,
);
getAPIAllCaseonDone(result => {
  hasNowAllCase.value = result.data.getAllCase;
});
getAPIAllCaseonError(e=>{errorHandle(e,infomsg,alert1)});

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
  if (apiCalTypeID.value || apiCalTypeID.value !== '') { 
    let a=caseCalTypeList.value;
    body.code = a[a.findIndex(x=>parseInt(x.value)===parseInt(apiCalTypeID.value))].code
  }
  if (apiStartDate.value || apiStartDate.value.trim() !== '') {
    body.startDate = (apiStartDate.value).replaceAll("-", "/");
  }
  if (apiEndDate.value || apiEndDate.value.trim() !== '') {
    body.endDate = (apiEndDate.value).replaceAll("-", "/");
  }
  // console.log(body);
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
      // console.log(json)
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
      // console.log(myArray);
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

// 匯入選取之案件
function inputAPICase() {
  for (let i = 0; i < dataAPI.value.length; i++) {
    let nowData = dataAPI.value[i];
    // 是否被選取
    if (nowData.selected) {
      // 是否已匯入
      if (!nowData.hasMatchCase) {
        // 未匯入者新建
        // 判斷校正項目是否為系統內項目
        if (nowData.Code === 'F' || nowData.Code === 'I' || nowData.Code === 'J' || nowData.Code === 'M') {
          // 新增案件
          let calTypeID = (caseCalType.value.getCaseCalType.find(x => x.code === nowData.Code)).id;
          addCase({
            creatCaseId: nowData.caseid,
            calType: parseInt(calTypeID),
            appDate: ((nowData.ARCHIVE_DATE).replaceAll("/", "-")).trim() + "T00:00:00.000Z",
            purpose: nowData.META_DESCRIPTION,
          }).then(result => {
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

const { mutate: dlFromAPI, onDone: dlFromAPIOnDone, onError: dlFromAPIError } = useMutation(CaseGQL.DOWNLOADFROMAPI);
const { mutate: getCustByName, onDone: getCustByNameOnDone, onError: getCustByNameError } = useMutation(CustGQL.GETCUSTBYNAME);
const { mutate: getItemBySN, onDone: getItemBySNOnDone, onError: getItemBySNError } = useMutation(ItemGQL.GETITEMBYSN);

dlFromAPIError(e=>{errorHandle(e,infomsg,alert1)});
getCustByNameError(e=>{errorHandle(e,infomsg,alert1)});
getItemBySNError(e=>{errorHandle(e,infomsg,alert1)});

function saveAPIRecord(nowData) {
  // 查詢顧客
  getCustByName({
    name: nowData.OWNER_ID,
  }).then(res => {
    let result={};
    if(res.data.getCustByName.length === 1) {
      result.cust_id = res.data.getCustByName[0].id;
    }
    // console.log("cust-result",result);
    return result;
  }).then(res1 => {
    let result;
    // 查詢儀器
    switch (nowData.Code) {
      case "F":
      case "J":
        result = getItemBySN({
          sn: nowData.COL04,
        }).then(res =>{
          let preresult = res1;
          if(res.data.getItemBySN.length === 1){
            preresult.item_id = res.data.getItemBySN[0].id;
          }
          return preresult;
        })
        return result;
      case "I":
      case "M":
        result = getItemBySN({
          sn: nowData.COL04,
        }).then(res =>{
          // console.log("res1",res1);
          // console.log("item_id",res);
          let preresult = res1;
          if(res.data.getItemBySN.length === 1){
            preresult.item_id = res.data.getItemBySN[0].id;
          }
          return preresult;
        }).then(res2 => {

          result = getItemBySN({
            sn: nowData.COL11,
          }).then(res=>{
            // console.log("res2",res2);
            let preresult = res2;
            if(res.data.getItemBySN.length === 1){
              preresult.gnss_id = res.data.getItemBySN[0].id;
            }
            // console.log("gnss_id",preresult);
            return preresult;
          })
          return result;
        }).then(res3 => {
          // console.log("res3",res3);
          result = getItemBySN({
            sn: nowData.COL16,
          }).then(res=>{
            let preresult = res3;
            if(res.data.getItemBySN.length === 1){
              preresult.imu_id = res.data.getItemBySN[0].id;
            }
            return preresult;
          })
          return result;
        })
        break;
    }
    return result;
  }).then(res => {
    let result = saveCaseS({
      updateCaseId: nowData.caseid,
      statusCode: parseInt(1),
      cusId: (res.cust_id)?parseInt(res.cust_id):null,
      title: nowData.EXTRA_4,
      address: nowData.EXTRA_6,
      purpose: nowData.META_DESCRIPTION,
      itemId: (res.item_id)?parseInt(res.item_id):null,
      // charge: null,
      // payDate: null,
      agreement: (!nowData.EXTRA_10 && !nowData.EXTRA_9)?'':(nowData.EXTRA_10 + "\n" + nowData.EXTRA_9),
      // leaderId: null,
      operatorsId: parseInt(nowData.Corrector),
      
    })
    return res;
  }).then(res => {
    // console.log("saveCaseS_result",res);
    let result;
    let preresult;
      // 下載附件
      switch (nowData.Code) {
        case "F":
        case "J":
          // 下載camReport
          result = dlFromAPI({
            fromUrl: nowData.COL24,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "01_CamReport" + path.extname(nowData.COL24),
          }).then(res=>{ 
            // 下載planMap
            return dlFromAPI({
            fromUrl: nowData.COL25,
            // toSubPath: publicPath.value + "06_Case/" + nowData.caseid,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "02_PlanDwg" + path.extname(nowData.COL25),
            })
          }).then(res=>{ 
            return ["01_CamReport" + path.extname(nowData.COL24) , "02_PlanDwg" + path.extname(nowData.COL25) ];
          })
          break;
        case "I":
          // 下載camReport
          preresult = res;
          result = dlFromAPI({
            fromUrl: nowData.COL28,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "01_LrReport" + path.extname(nowData.COL28),
          }).then(res=>{  
            // 下載planMap
            return dlFromAPI({
            fromUrl: nowData.COL29,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "02_POSReport" + path.extname(nowData.COL29),
            })
          }).then(res=>{  
            // 下載planMap
            dlFromAPI({
            fromUrl: nowData.COL30,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "03_LrPlan" + path.extname(nowData.COL30),
            })
          }).then(res=>{
            return [
              "01_LrReport" + path.extname(nowData.COL28) , 
              "02_POSReport" + path.extname(nowData.COL29), 
              "03_LrPlan" + path.extname(nowData.COL30),
              (preresult.gnss_id)?preresult.gnss_id:null,
              (preresult.imu_id)?preresult.imu_id:null];
          })
          break;
        case "M":
          // 下載camReport
          preresult = res;
          result = dlFromAPI({
            fromUrl: nowData.COL28,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "01_LrReport" + path.extname(nowData.COL28),
          }).then(res=>{  
            // 下載planMap
            dlFromAPI({
            fromUrl: nowData.COL29,
            toSubPath: "06_Case/" + nowData.caseid,
            toFileName: "02_POSReport" + path.extname(nowData.COL29),
            })
          }).then(res=>{
            return [
              "01_LrReport" + path.extname(nowData.COL28) , 
              "02_POSReport" + path.extname(nowData.COL29), 
              (preresult.gnss_id)?preresult.gnss_id:null,
              (preresult.imu_id)?preresult.imu_id:null];
          })
          break;
      }
      // console.log("download_result",result);
      return result;
    }).then(res => {
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
            camReport: res[0],
            planMap: res[1],
            signPersonId: parseInt(nowData.Signatory),
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
            camReport: res[0],
            planMap: res[1],
            signPersonId: parseInt(nowData.Signatory),
          });
          break;
        case "I":
          saveRecord02API({
            updateRecord02Id: nowData.caseid,
            type: parseInt(nowData.COL05),
            gnssId: (res[3])?parseInt(res[3]):null,
            imuId: (res[4])?parseInt(res[4]):null,
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
            lidarReport: res[0],
            posReport: res[1],
            planMap: res[2],
            signPersonId: parseInt(nowData.Signatory),
          });
          break;
        case "M":
          saveRecord03API({
            updateRecord02Id: nowData.caseid,
            type: parseInt(nowData.COL05),
            gnssId: (res[3])?parseInt(res[2]):null,
            imuId: (res[4])?parseInt(res[3]):null,
            disPresision: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL06):null,
            angResolution: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL07):null,
            beam: parseFloat(nowData.COL08),
            precH: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL12):parseFloat(nowData.COL06),
            precV: (parseInt(nowData.COL05)===1)?parseFloat(nowData.COL13):parseFloat(nowData.COL07),
            omega: parseFloat(nowData.COL17),
            phi: parseFloat(nowData.COL18),
            kappa: parseFloat(nowData.COL19),
            precOri: parseFloat(nowData.COL20),
            // planYear: parseInt(nowData.COL21),
            // planMonth: parseInt(nowData.COL22),
            stripsNo: parseInt(nowData.COL23),
            cloudDensity: parseFloat(nowData.COL26),
            lidarReport: res[0],
            posReport: res[1],
            signPersonId: parseInt(nowData.Signatory),
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
saveRecord01APIError(e=>{errorHandle(e,infomsg,alert1)});

// 儲存Record02API
const {
  mutate: saveRecord02API,
  onDone: saveRecord02APIOnDone,
  onError: saveRecord02APIError,
} = useMutation(CaseGQL.SAVECASERECORD02);
saveRecord02APIError(e=>{errorHandle(e,infomsg,alert1)});

// 儲存Record03API
const {
  mutate: saveRecord03API,
  onDone: saveRecord03APIOnDone,
  onError: saveRecord03APIError,
} = useMutation(CaseGQL.SAVECASERECORD03);
saveRecord03APIError(e=>{errorHandle(e,infomsg,alert1)});
//#endregion 連線取得案件==========End

//#region 檢驗案件狀態==========Start
watch(
  [
    nowCaseOperator,
    nowCaseLeader,
    nowCaseCustId,
    nowCaseItemID,
    nowCaseRecDate,
    nowCaseStartDate,
    nowCaseCompleteDate,
    nowCaseReportEdit,
    nowCaseChkPersonID,
    nowCaseSignPersonID,
    nowCaseReportScan,
    nowCasePayDate,
    nowCaseCharge,
    nowCaseAgreement,
  ],
  ([
    operators_id,
    leader_id,
    cus_id,
    item_id,
    receive_date,
    start_Date,
    complete_date,
    report_edit,
    chk_person_id,
    sign_person_id,
    report_scan,
    pay_date,
    charge,
    agreement,
  ])=>{
  const chData = {
    operators_id:operators_id,
    leader_id:leader_id,
    cus_id:cus_id,
    item_id:item_id,
    receive_date:receive_date,
    start_Date:start_Date,
    complete_date:complete_date,
    report_edit:report_edit,
    chk_person_id:chk_person_id,
    sign_person_id:sign_person_id,
    report_scan:report_scan,
    pay_date:pay_date,
    charge:charge,
    agreement:agreement,
  }
  ckCaseStatusList(chData)
});

function ckCaseStatusList(chData){
  return new Promise((res,rej)=>{
    // console.log(nowCaseStatusMU.value)
    // 選單初始設定全部停用
    nowCaseStatusMU.value[0].disabled = false; // (無)
    for(let i=1; i<nowCaseStatusMU.value.length ; i++){
      nowCaseStatusMU.value[i].disabled = true;
    }

    //  審核中
    if ((chData.leader_id && chData.leader_id!==-1) && (chData.operators_id && chData.operators_id!==-1)) {
      nowCaseStatusMU.value[1].disabled = false;
    }else{
      nowCaseStatusMU.value[1].disabled = true;
    }

    // 待送件
    if ((chData.cus_id && chData.cus_id!==-1) && (chData.item_id && chData.item_id!==-1) && 
      !nowCaseStatusMU.value[1].disabled) {
      nowCaseStatusMU.value[2].disabled = false;
    }else{
      nowCaseStatusMU.value[2].disabled = true;
    }

    // 校正中
    if (chData.receive_date.trim() && chData.start_Date.trim() && 
      !nowCaseStatusMU.value[2].disabled) {
      nowCaseStatusMU.value[3].disabled = false;
    }else{
      nowCaseStatusMU.value[3].disabled = true;
    }

    // 報告陳核
    if (chData.complete_date.trim() && chData.report_edit && 
      !nowCaseStatusMU.value[3].disabled) {
      nowCaseStatusMU.value[4].disabled = false;
    }else{
      nowCaseStatusMU.value[4].disabled = true;
    }

    // 待繳費(出具報告)
    if ((chData.chk_person_id && 
      chData.chk_person_id!==-1) && 
      (chData.sign_person_id && chData.sign_person_id!==-1) && 
      chData.report_scan && chData.report_scan.trim()!=='' &&
      !nowCaseStatusMU.value[4].disabled) {
      nowCaseStatusMU.value[5].disabled = false;
    }else{
      nowCaseStatusMU.value[5].disabled = true;
    }

    // 結案
    if ((chData.pay_date.trim() || parseInt(chData.charge)===0) && !nowCaseStatusMU.value[5].disabled) {
      nowCaseStatusMU.value[6].disabled = false;
    }else{
      nowCaseStatusMU.value[6].disabled = true;
    }

    // 補件 退件
    if (chData.agreement) {
      nowCaseStatusMU.value[7].disabled = false;
      nowCaseStatusMU.value[8].disabled = false;
    }else{
      nowCaseStatusMU.value[7].disabled = true;
      nowCaseStatusMU.value[8].disabled = true;
    }
    res(nowCaseStatusMU.value);
  })
  
}

//#endregion  檢驗案件狀態==========End

getchecktoken().then(res=>{
    // refgetAllCase({notstatus:9});
    updateAllCaseList();
    refgetCaseOperator();
    refgetCaseLeader();
  }).catch(e=>{
    errorHandle(e,infomsg,alert1);
  });

function updateAllCaseList(){
  // console.log('5s update')
  if(listOpened.value){return}
  notProssing2.value = false;
  // console.log('filterVariables',filterVariables.value)
  refgetAllCase(filterVariables.value).then(res=>{
    if (showCaseLeftDiv.value){
      dt1.rows(function(idx,data,node){
        return data.id === nowCaseID.value? true:false
      }).select();
    }
  });
}
// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('user-select', function ( e, dt, type, cell, originalEvent ) {
    let dtNowRowIndex = cell.index(this).row;
    nowCaseID.value = dt.rows(dtNowRowIndex).data()[0].id
    refgetNowCaseS({getCasebyIdId: nowCaseID.value});
  });

  // 取得清單內容應在登入後取得
  console.log('do dispatch')
  store.dispatch('selectlist/fetchStatusList');
  store.dispatch('selectlist/fetchCalTypeList');
  store.dispatch('selectlist/fetchOrgList');
  store.dispatch('selectlist/fetchChopList');
  store.dispatch('selectlist/fetchModelList');
});

</script>
<template>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    autohide :delay="2000.0">
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
          <!-- 編輯 -->
          <MDBCol col="12" class="border border-1">
            <!-- 功能列 -->
            <div class="mt-2">
              <MDBBtn size="sm" color="primary" @click="saveCust()">儲存</MDBBtn>
              <MDBBtn size="sm" color="primary" @click="gotoCustMG()">顧客管理</MDBBtn>
            </div>
            <MDBRow>
              <MDBSelect 
                filter size="sm" class="my-3 col-12" 
                label="公司名稱" 
                :preselect="false"
                v-model:options="selCustOrgNameMU"
                v-model:selected="selCustOrgName" 
                ref="selCustOrgNameDOM" 
                @open="listOpened=true"
                @close="listOpened=false"/>
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
          <MDBCol col="12" class="border border-1 h-50 mt-2">
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
                  <MDBSelect 
                    size="sm" class="mb-2 md-12" 
                    label="校正項目" 
                    :preselect="false"
                    v-model:options="apiCalTypeIDMU"
                    v-model:selected="apiCalTypeID" 
                    ref="apiCalTypeIdDOM" 
                    @open="listOpened=true"
                    @close="listOpened=false"/>
                  <div></div>
                  <MDBCol md="6" class="mb-2">
                    <MDBDatepicker 
                      size="sm" 
                      v-model="apiStartDate" 
                      format="YYYY-MM-DD" label="申請日(起)"
                      :monthsFull = "monthsFull"
                      :monthsShort = "monthsShort"
                      :weekdaysFull = "weekdaysFull"
                      :weekdaysShort = "weekdaysShort"
                      :weekdaysNarrow = "weekdaysNarrow"
                      confirmDateOnSelect
                      removeCancelBtn removeOkBtn
                      ref="apiStartDateDOM" />
                  </MDBCol>
                  <MDBCol md="6" class="mb-2">
                    <MDBDatepicker 
                      size="sm" 
                      v-model="apiEndDate" 
                      format="YYYY-MM-DD" label="申請日(迄)"
                      :monthsFull = "monthsFull"
                      :monthsShort = "monthsShort"
                      :weekdaysFull = "weekdaysFull"
                      :weekdaysShort = "weekdaysShort"
                      :weekdaysNarrow = "weekdaysNarrow"
                      confirmDateOnSelect
                      removeCancelBtn removeOkBtn
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
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <MDBCol col="12" style="position: relative;">
          <MDBAnimation style="position:absolute; left:0;top:0;" class="h-100 w-100"
            :animation="animationType"
            trigger="manually" 
            v-model="showCaseEditAnima"
            @animationend.self="isAinmaDispaly">
            <MDBRow style="margin-left:0;margin-right:0;" class="h-100 flex-md-nowrap">
              <!-- 左方列表 -->
              <MDBCol v-show="showCaseLeftDiv" md="8" class="h-100">
                  <MDBRow class="h-100 align-content-between">
                    <!-- 上方列表 -->
                    <MDBCol md="12" style="height: calc(75% - 1.5rem); position: relative;"
                      class="mt-2 overflow-auto border border-5 rounded-8 shadow-4">
                      <div :class="{ 'hiddenSpinner': notProssing2}" style="position: absolute; left: 50%; top: 10rem;">
                        <MDBSpinner size="md" color="primary" />Loading...
                      </div>
                      <DataTable :data=" data1" :columns="columns1" :options="tboption1" ref="table1"
                        style="font-size: smaller; padding-top: 1rem;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 下方篩選 -->
                    <MDBCol md="12" class="h-25 mb-2 border border-5 rounded-8 shadow-4">
                      <MDBRow class="h-100">
                        <MDBCol col="12" class="py-2 d-flex border-1 border-bottom">
                          <div class="">條件篩選</div>
                          <div class="ms-2 flex-grow-1">
                            <MDBSwitch label="顯示退件" v-model="showRejectCase" @change="updateAllCaseList" />
                          </div>
                          <div>
                            <MDBBtn size="sm" color="primary" @click="caseClearFilter()">清除</MDBBtn>
                            <MDBBtn size="sm" color="primary" @click="updateAllCaseList()">篩選</MDBBtn>
                          </div>
                        </MDBCol>
                        <MDBCol col="12" style="height: calc(100% - 3rem);" class="overflow-auto">
                          <MDBRow>
                            <MDBSelect 
                              size="sm" class="mt-2 col-md-3" label="案件狀態" 
                              :preselect="false"
                              v-model:options="caseStatusMU"
                              v-model:selected="caseStatusSEL" 
                              ref="caseStatusDOM" 
                              @open="listOpened=true"
                              @close="listOpened=false"/>
                            <MDBCol md="3" class="mt-2">
                              <MDBInput size="sm" type="text" label="案件編號" v-model="caseIDSEL" />
                            </MDBCol>
                            <MDBSelect 
                              size="sm" class="mt-2 col-md-3" 
                              label="校正項目" 
                              :preselect="false"
                              v-model:options="caseTypeMU"
                              v-model:selected="caseTypeSEL" 
                              ref="caseTypeFilter" 
                              @open="listOpened=true"
                              @close="listOpened=false"/>
                            <MDBSelect 
                              filter size="sm" class="mt-2 col-md-3" 
                              label="校正人員"
                              :preselect="false" 
                              v-model:options="caseOptMU"
                              v-model:selected="caseOptSEL" 
                              ref="caseOptFilter" />
                            <MDBSelect 
                              filter size="sm" 
                              class="mt-2 col-md-3" 
                              label="顧客" 
                              :preselect="false"
                              v-model:options="caseCustMU"
                              v-model:selected="caseCustSEL" 
                              ref="caseCustFilter" 
                              @open="listOpened=true"
                              @close="listOpened=false"/>
                            <MDBSelect 
                              filter size="sm" class="mt-2 col-md-3" 
                              label="廠牌" 
                              :preselect="false"
                              v-model:options="caseChopMU"
                              v-model:selected="caseChopSEL" 
                              ref="caseChopFilter" 
                              @open="listOpened=true"
                              @close="listOpened=false"/>
                            <MDBSelect 
                              filter size="sm" class="mt-2 col-md-3" 
                              label="型號" 
                              :preselect="false"
                              v-model:options="caseModelMU"
                              v-model:selected="caseModelSEL" 
                              ref="caseModelFilter" 
                              @open="listOpened=true"
                              @close="listOpened=false"/>
                            <MDBCol md="3" class="mt-2">
                              <MDBInput size="sm" type="text" label="序號" v-model="caseSelnumSEL" />
                            </MDBCol>
                            <MDBCol md="3" class="mt-2">
                              <MDBDatepicker 
                                size="sm" 
                                v-model="caseAppDateStartSEL" 
                                format="YYYY-MM-DD" label="申請日(起)"
                                :monthsFull = "monthsFull"
                                :monthsShort = "monthsShort"
                                :weekdaysFull = "weekdaysFull"
                                :weekdaysShort = "weekdaysShort"
                                :weekdaysNarrow = "weekdaysNarrow"
                                confirmDateOnSelect
                                removeCancelBtn removeOkBtn
                                ref="caseAppDateStartFilter" />
                            </MDBCol>
                            <MDBCol md="3" class="mt-2">
                              <MDBDatepicker 
                                size="sm" 
                                v-model="caseAppDateEndtSEL" 
                                format="YYYY-MM-DD" label="申請日(迄)"
                                :monthsFull = "monthsFull"
                                :monthsShort = "monthsShort"
                                :weekdaysFull = "weekdaysFull"
                                :weekdaysShort = "weekdaysShort"
                                :weekdaysNarrow = "weekdaysNarrow"
                                confirmDateOnSelect
                                removeCancelBtn removeOkBtn
                                ref="caseAppDateEndFilter" />
                            </MDBCol>
                            <MDBCol md="3" class="mt-2">
                              <MDBDatepicker 
                                size="sm" 
                                v-model="casePayDateStartSEL" 
                                format="YYYY-MM-DD" label="繳費日(起)"
                                :monthsFull = "monthsFull"
                                :monthsShort = "monthsShort"
                                :weekdaysFull = "weekdaysFull"
                                :weekdaysShort = "weekdaysShort"
                                :weekdaysNarrow = "weekdaysNarrow"
                                confirmDateOnSelect
                                removeCancelBtn removeOkBtn
                                ref="casePayDateStartFilter" />
                            </MDBCol>
                            <MDBCol md="3" class="mt-2">
                              <MDBDatepicker 
                                size="sm" 
                                v-model="casePayDateEndtSEL" 
                                format="YYYY-MM-DD" label="繳費日(迄)"
                                :monthsFull = "monthsFull"
                                :monthsShort = "monthsShort"
                                :weekdaysFull = "weekdaysFull"
                                :weekdaysShort = "weekdaysShort"
                                :weekdaysNarrow = "weekdaysNarrow"
                                confirmDateOnSelect
                                removeCancelBtn removeOkBtn
                                ref="casePayDateEndFilter" />
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                        
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

              </MDBCol>
              <!-- 右方案件資料 -->
              <MDBCol md="4" v-show="!showCaseNew" class="h-100">
                <MDBRow style="margin-left: auto;height: calc(100% - 1rem);"
                  class="my-2 bg-light border border-5 rounded-8 shadow-4">
                  <MDBCol col="12" class="py-2 border-1 border-bottom">
                    <div>案件資料</div>
                    <div class="d-flex mt-2">
                      <MDBPopconfirm :disabled="!rGroup[2]" class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                        message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delCase">
                        刪除案件
                      </MDBPopconfirm>
                      <MDBBtn size="sm" :disabled="addBtnDisabled || !rGroup[4]" color="primary" @click="openAddCaseForm()">新增
                      </MDBBtn>
                      <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveNowCaseData()">儲存</MDBBtn>
                      <MDBBtn size="sm" color="primary" @click.prevent="showCaseEdit()" v-html="caseBtnText">
                      </MDBBtn>
                    </div>
                  </MDBCol>
                  <MDBCol col="12" style="height: calc(100% - 5rem);" class="overflow-auto">
                    <MDBRow>
                      <MDBSelect 
                        :disabled="!rGroup[1]" filter 
                        size="sm" class="mt-2 col-6" 
                        label="校正人員"
                        :preselect="false"
                        v-model:options="nowCaseOperatorMU" 
                        v-model:selected="nowCaseOperator" 
                        ref="nowCaseOperatorDOM" 
                        @open="listOpened=true"
                        @close="listOpened=false"/>
                      <MDBSelect 
                        :disabled="!rGroup[2]" filter 
                        size="sm" class="mt-2 col-6" 
                        label="技術主管"
                        :preselect="false" 
                        v-model:options="nowCaseLeaderMU" 
                        v-model:selected="nowCaseLeader" 
                        ref="nowCaseLeaderDOM" 
                        @open="listOpened=true"
                        @close="listOpened=false"/>
                      <MDBSelect 
                        :disabled="!rGroup[2]" size="sm" 
                        :class="[statusIcon,'mt-3 col-6']" label="案件狀態"
                        :preselect="false"
                        v-model:options="nowCaseStatusMU" 
                        v-model:selected="nowCaseStatus" 
                        ref="nowCaseStatusDOM" 
                        @open="listOpened=true"
                        @close="listOpened=false"/>
                      <div></div>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="案件編號" v-model="nowCaseID" disabled />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="申請日期" v-model="nowCaseAppDate" disabled />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="校正項目" v-model="nowCaseTypeName" disabled />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="12" class="mt-3">
                        <MDBInput size="sm" type="text" label="顧客名稱" v-model="nowCaseCustOrgName" disabled />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="統一編號" v-model="nowCaseCustTaxID" disabled />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3 ps-0">
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="showCustFrom=true">查詢顧客</MDBBtn>
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="聯絡人" v-model="nowCaseCustName" disabled />
                      </MDBCol>
                      <div></div>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowCaseCustTel" disabled />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput size="sm" type="text" label="傳真" v-model="nowCaseCustFax" disabled />
                      </MDBCol>
                      <MDBCol col="12" class="mt-3">
                        <MDBInput size="sm" type="text" label="聯絡地址" v-model="nowCaseCustAddress" disabled />
                      </MDBCol>
                      <MDBCol col="12" class="mt-2">
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="copyTileAdd()">同上</MDBBtn>
                      </MDBCol>
                      <MDBCol col="12" class="mt-2">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="報告抬頭" v-model="nowCaseTitle" />
                      </MDBCol>
                      <MDBCol col="12" class="mt-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="報告地址" v-model="nowCaseAddress" />
                      </MDBCol>
                      <MDBCol col="12" class="mt-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" type="text" label="校正目的" v-model="nowCasePurpose" />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBInput :disabled="!rGroup[2]" size="sm" style="text-align: right" type="text" label="費用"
                          v-model="nowCaseCharge" />
                      </MDBCol>
                      <MDBCol col="6" class="mt-3">
                        <MDBDatepicker 
                          size="sm" 
                          v-model="nowCasePayDate" 
                          format="YYYY-MM-DD" label="繳費日"
                          :monthsFull = "monthsFull"
                          :monthsShort = "monthsShort"
                          :weekdaysFull = "weekdaysFull"
                          :weekdaysShort = "weekdaysShort"
                          :weekdaysNarrow = "weekdaysNarrow"
                          confirmDateOnSelect
                          removeCancelBtn removeOkBtn
                          ref="nowCasePayDateDOM" />
                      </MDBCol>
                      <MDBCol col="12" class="mt-3">
                        <MDBTextarea :disabled="!rGroup[2]" size="sm" label="註明事項" rows="2" v-model="nowCaseAgreement" />
                      </MDBCol>
                    </MDBRow>
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
                    <MDBCol style="font-size: 0.8rem" class="mx-3 mb-3 p-2 border border-1">
                      案件編號編碼方式：
                      <br>"西元日期(8碼)"
                      <br> + "當日第幾案(2碼)"
                      <br> + "本案第幾件儀器(2碼)"
                      <br>例如："20220125" + "02" + "01"
                    </MDBCol>
                    <div></div>
                    <MDBCol col="6" class="mb-3">
                      <MDBDatepicker 
                        required size="sm" 
                        v-model="addCaseAppDate" 
                        format="YYYY-MM-DD" label="申請日"
                        :monthsFull = "monthsFull"
                        :monthsShort = "monthsShort"
                        :weekdaysFull = "weekdaysFull"
                        :weekdaysShort = "weekdaysShort"
                        :weekdaysNarrow = "weekdaysNarrow"
                        confirmDateOnSelect
                        removeCancelBtn removeOkBtn
                        ref="addCaseAppDateDOM" />
                    </MDBCol>
                    <MDBCol col="6" class="mb-3">
                      <MDBBtn size="sm" color="primary" @click="getAppDateByCaseId()">自動取得</MDBBtn>
                    </MDBCol>
                    <div></div>
                    <MDBCol style="font-size: 0.8rem" class="mx-3 mb-3 p-2 border border-1">
                      申請日期可由案件編號前8碼取得或自行設定
                    </MDBCol>
                    <div></div>
                    <MDBSelect 
                      required data-mdb-validation="true" 
                      data-mdb-valid-feedback="This value is valid"
                      data-mdb-invalid-feedback="This value is invalid" 
                      size="sm" class="mb-3 col-10" 
                      label="校正項目"
                      :preselect="false"
                      v-model:options="addCaseTypeIdMU" 
                      v-model:selected="addCaseTypeIdSEL" 
                      ref="addCaseTypeIdDOM" 
                      @open="listOpened=true"
                      @close="listOpened=false"/>
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
              <MDBCol md="8" v-else-if="showCaseEditR03Flag" class="h-100 py-2">
                <MDBRow style="margin-left:0;margin-right:0;" class="h-100 bg-light border border-5 rounded-8 shadow-4">
                  <!-- record03表單 -->
                  <Record03 :caseID="nowCaseID" :key="updateKey" ref="subFormRecord03" />
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBAnimation>
        </MDBCol>
      </MDBRow>
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

/* div.dataTables_filter {
  padding-top: 0.85em;
} */

.colAlignRight {
  text-align: right;
}

span.status89 {
  color: #DE3163;
}

tr.selected>td>span.status89 {
  color: white;
}

span.status7 {
  color: green;
}

tr.selected>td>span.status7 {
  color: white;
}

span.status6 {
  color: #F39C12;
}

tr.selected>td>span.status6 {
  color: white;
}

span.status45 {
  color: #6495ED;
}

tr.selected>td>span.status45 {
  color: white;
}

span.status23 {
  color: #FF7F50;
}

tr.selected>td>span.status23 {
  color: white;
}

span.status1 {
  color: Gray;
}

tr.selected>td>span.status1 {
  color: white;
}

.slide-left-ja {
  animation-name: slide-left-ja;
}

div.status9 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f122";
  color: #DE3163;
}

div.status8 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f1da";
  color: #DE3163;
}

div.status7 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f00c";
  color: green;
}

div.status6 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f4b9";
  color: #F39C12;
}

div.status5 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f0ea";
  color: #6495ED;
}

div.status4 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f04b";
  color: #6495ED;
}

div.status3 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f251";
  color: #FF7F50;
}

div.status2 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f530";
  color: #FF7F50;
}

div.status1 span::before {
  font-family: "Font Awesome 6 Free"; 
  font-weight: 900;
  font-size: 1rem;
  content: "\f06a";
  color: Gray;
}

@keyframes slide-left-ja {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-66.66667%, 0, 0);
  }
}

.slide-right-ja {
  animation-name: slide-right-ja;
}

@keyframes slide-right-ja {
  from {
    transform: translate3d(-66.66667%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.hiddenSpinner {
  display: none;
}
</style>
