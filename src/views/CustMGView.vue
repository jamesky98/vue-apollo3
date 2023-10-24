<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide,inject } from "vue";
import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBSelect,
  MDBPopconfirm,
  MDBAlert,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import CustGQL from "../graphql/Cust";
import ItemGQL from "../graphql/Item";
import { computed } from "@vue/reactivity";
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

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate, domTextSelect, updateSelMU } from '../methods/User';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

DataTable.use(DataTablesCore);
DataTable.use(Select);
DataTable.use(ButtonsHtml5);
DataTable.use(print);
DataTable.use(colvis);
DataTable.use(ButtonsBs5);

//#region 取得權限==========Start
// const myUserId = ref("");
const myUserName = ref("");
// const myUserName2 = ref("");
// const myUserEmail = ref("");
// const myUserActive = ref(false);
const myUserRole = ref("");

const { onResult: getNowUser, refetch: refgetNowUser} = useQuery(UsersGQL.GETNOWUSER);
getNowUser(result=>{
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
const rGroup =computed(()=>{
  return rGroupSetting(myUserRole.value,true)
});
//#endregion 取得權限==========End

//#region 參數==========Start
// infomation
const NavItem = ref("cust");
provide("NavItem",NavItem);
const infomsg = ref("");
const msgColor = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const store = useStore();

const joinCust = ref(true);
const joinCustIcon = ref("fas fa-link");
const joinCustTextColor = ref("");
const joinItem = ref(true);
const joinItemIcon = ref("fas fa-link");
const joinItemTextColor = ref("");

const nowCustOrgID = ref("");
const nowCustOrgName = ref("");
const nowCustOrgTaxId = ref("");

const nowCustId = ref("");
const nowCustName = ref("");
const nowCustTel = ref("");
const nowCustFax = ref("");
const nowCustAddress = ref("");

const nowCustSelOrgId = ref("");
const nowCustSelOrgIdMU = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.caseOrgList)));
const nowCustSelOrgIdDOM = ref();

const nowItemId = ref("");
const nowItemType = ref("");
const nowItemTypeMU = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.caseItemTypeList)));
const nowItemTypeDOM = ref();

const nowItemChop = ref("");
const nowItemChopMU = ref([]);
const nowItemChopDOM = ref();
function updateItemChop(){
  updateSelMU({
    newValue: nowItemChop,
    nowMU: nowItemChopMU,
    nowDOM: nowItemChopDOM,
    isUseID: false,
  })
}

const nowItemModel = ref("");
const nowItemModelMU = ref([]);
const nowItemModelDOM = ref();
function updateItemModel(){
  updateSelMU({
    newValue: nowItemModel,
    nowMU: nowItemModelMU,
    nowDOM: nowItemModelDOM,
    isUseID: false,
  })
}

const nowItemSN = ref("");
const selItemType = ref("");
const selItemTypeMU = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.caseItemTypeList)));
const selItemTypeDOM = ref();

//#endregion 參數==========End

function setJoinCust(){
  if(joinCust.value){
    // 關閉連結
    joinCust.value=false;
    joinCustIcon.value="fas fa-unlink";
    joinCustTextColor.value = "text-danger";
    // 重查聯絡人
    refgetAllCust({orgId: null});
  }else{
    // 開起連結
    joinCust.value=true;
    joinCustIcon.value="fas fa-link";
    joinCustTextColor.value = "";
    refgetAllCust({orgId: parseInt(nowCustOrgID.value)});
  }
}

function setJoinItem(){
  if(joinItem.value){
    // 關閉連結
    joinItem.value=false;
    joinItemIcon.value="fas fa-unlink";
    joinItemTextColor.value = "text-danger";
    // 重查聯絡人
    refgetAllItem({orgId: null});
  }else{
    // 開起連結
    joinItem.value=true;
    joinItemIcon.value="fas fa-link";
    joinItemTextColor.value = "";
    refgetAllItem({orgId: parseInt(nowCustOrgID.value)});
  }
}
//#region 公司表格==========Start
let dt_org;
const table_org = ref(); 
const data_org = computed(() => JSON.parse(JSON.stringify(store.state.selectlist.caseOrgDate)));
const columns_org = [
  {title:"索引", data:"id",width:"2rem"},
  {title:"機關名稱", data:"name"},
  {title:"統一編號", data:"tax_id"},
];
const tboption_org = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  scrollY: 'calc(60vh - 22rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 新增機關資料
function newOrg(){
  nowCustOrgID.value = "";
  nowCustOrgName.value = "";
  nowCustOrgTaxId.value = "";
}

// 儲存機關資料
const { mutate: saveOrg, onDone: saveOrgOnDone, onError: saveOrgError } = useMutation(
  CustGQL.UPDATEORG,
  () => ({
    variables: {
      updateOrgId: (parseInt(nowCustOrgID.value))?parseInt(nowCustOrgID.value):-1,
      name: nowCustOrgName.value,
      taxId: nowCustOrgTaxId.value,
    }
  })
);
saveOrgOnDone(result=>{
  store.dispatch('selectlist/fetchOrgList');
  infomsg.value = "機關 " + result.data.updateOrg.id + " 儲存完畢";
  msgColor.value = "blue";
});
saveOrgError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 刪除機關資料
const { mutate: delOrg, onDone: delOrgOnDone, onError: delOrgError } = useMutation(
  CustGQL.DELORG,
  () => ({
    variables: {
      delOrgId: parseInt(nowCustOrgID.value),
    }
  })
);
delOrgOnDone(result=>{
  store.dispatch('selectlist/fetchOrgList');
  infomsg.value = "機關 " + result.data.delOrg.id + " 刪除完成";
  msgColor.value = "blue";
});
delOrgError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

//#endregion 公司表格==========End

//#region 聯絡人表格==========Start
const { onDone: getAllCustonDone, mutate: refgetAllCust, onError: getAllCustonError } = useMutation(CustGQL.GETALLCUST);
getAllCustonDone(result=>{
  if (!result.loading && result.data.getAllCust) {
    data_cust.value = result.data.getAllCust;
  }
});
getAllCustonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

const { onDone: getselCustonDone, mutate: refgetselCust, onError: getselCustonError } = useMutation(
  CustGQL.GETCUSTBYID,()=>({
    getCustByIdId: -1
  })
);
getselCustonDone(result=>{
  if(!result.loading && result.data.getCustById){
    let getData = result.data.getCustById;
    nowCustName.value = getData.name;
    nowCustTel.value = getData.tel;
    nowCustFax.value = getData.fax;
    nowCustAddress.value = getData.address;
    nowCustSelOrgId.value = getData.org_id;
  }
});
getselCustonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

let dt_cust;
const table_cust = ref(); 
const data_cust = ref([]);
const columns_cust = [
  {title:"索引", data:"id",width:"2rem"},
  {title:"姓名", data:"name"},
];
const tboption_cust = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[0, 'desc']],
  scrollY: 'calc(40vh - 12rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 新增顧客
function newCust(){
  nowCustId.value = "";
  nowCustName.value = "";
  nowCustTel.value = "";
  nowCustFax.value = "";
  nowCustAddress.value = "";
  if(joinCust.value){
    nowCustSelOrgId.value = nowCustOrgID.value;
    nowCustSelOrgIdDOM.value.setValue(parseInt(nowCustOrgID.value));
  }else{
    nowCustSelOrgId.value = -1;
    nowCustSelOrgIdDOM.value.setValue(-1);
  }
}

// 儲存顧客資料
const { mutate: saveCust, onDone: saveCustOnDone, onError: saveCustError } = useMutation(
  CustGQL.UPDATECUST,
  () => ({
    variables: {
      updateCustId: (parseInt(nowCustId.value))?parseInt(nowCustId.value):-1,
      name: nowCustName.value,
      address: nowCustAddress.value,
      tel: nowCustTel.value,
      fax: nowCustFax.value,
      orgId: parseInt(nowCustSelOrgId.value),
    }
  })
);
saveCustOnDone(result=>{
  infomsg.value = "聯絡人 " + result.data.updateCust.id + " 儲存完畢";
  msgColor.value = "blue";
  if(joinCust.value){
    if(nowCustOrgID.value && nowCustOrgID.value!==""){
      // console.log("nowCustOrgID",nowCustOrgID.value);
      refgetAllCust({orgId: parseInt(nowCustOrgID.value)});
    }else{
      refgetAllCust({orgId: null});  
    }
  }else{
    refgetAllCust({orgId: null});
  }
});
saveCustError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 刪除顧客資料
const { mutate: delCust, onDone: delCustOnDone, onError: delCustError } = useMutation(
  CustGQL.DELCUST,
  () => ({
    variables: {
      delCustId: parseInt(nowCustId.value),
    }
  })
);
delCustOnDone(result=>{
  infomsg.value = "聯絡人 " + result.data.delCust.id + " 刪除完成";
  msgColor.value = "blue";
  if(joinCust.value){
    if(nowCustOrgID.value && nowCustOrgID.value!==""){
      // console.log("nowCustOrgID",nowCustOrgID.value);
      refgetAllCust({orgId: parseInt(nowCustOrgID.value)});
    }else{
      refgetAllCust({orgId: null});  
    }
  }else{
    refgetAllCust({orgId: null});
  }
});
delCustError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 聯絡人表格==========End

// 校正件表格==========Start
const { onDone: getAllItemonDone, mutate: refgetAllItem, onError: getAllItemonError } = useMutation(ItemGQL.GETALLITEM);
getAllItemonDone(result=>{
  if(!result.loading && result.data.getAllItem){
    data_Item.value = result.data.getAllItem;
  }
});
getAllItemonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

const { onDone: getItemByIdonDone, mutate: refgetItemById, onError: getItemByIdonError } = useMutation(ItemGQL.GETITEMBYID);
getItemByIdonDone(result=>{
  if(!result.loading && result.data.getItemByID){
    let getData = result.data.getItemByID;
    nowItemId.value = getData.id;
    nowItemType.value = (getData.type && getData.type!=='')?getData.type:-1;
    nowItemTypeDOM.value.setValue(parseInt(nowItemType.value));
    nowItemChop.value = (getData.chop)?getData.chop:'';
    nowItemChopDOM.value.setValue(nowItemChop.value);
    nowItemModel.value = (getData.model)?getData.model:'';
    nowItemModelDOM.value.setValue(nowItemModel.value);
    nowItemSN.value = getData.serial_number;
  }
});
getItemByIdonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

let dt_Item;
const table_Item = ref(); 
const data_Item = ref([]);
const columns_Item = [
  {title:"索引", data:"id",width:"2rem"},
  {title:"類型", data:"item_type.type"},
  {title:"最近校正日", render: (data, type, row) => {
    let maxCalDate = 0;
    for(let i=0 ; i < row.case_base.length ; i++){
      if(row.case_base[i].case_record_01){
        if(row.case_base[i].cus){
          // 航測
          if(parseInt(row.case_base[i].cus.org_id)!==5){
            let mydate = Date.parse(row.case_base[i].case_record_01.complete_date);
            maxCalDate = (mydate > maxCalDate)?mydate:maxCalDate;
          }
        }
      }else if(row.case_base[i].case_record_02){
        if(row.case_base[i].cus){
          // 光達
          if(parseInt(row.case_base[i].cus.org_id)!==5){
            let mydate = Date.parse(row.case_base[i].case_record_02.complete_date);
            maxCalDate = (mydate > maxCalDate)?mydate:maxCalDate;
          }
        }
      }
    }
    if(maxCalDate===0){
      return "-"
    }else{
      let dateObj = new Date(maxCalDate);
      let monthStr = dateObj.getMonth()+1;
      let dateStr = dateObj.getDate();
      let maxCalDateStr = (dateObj.getFullYear()-1911) + "-" + ((monthStr.toString().length<2)?"0"+monthStr:monthStr) + "-" + ((dateStr.toString().length<2)?"0"+dateStr:dateStr);
      let toDay = new Date();
      if((toDay - dateObj)>(3 * 365.4 * 24 * 60 * 60 * 1000)){
        return "<span class='status89'>"+ maxCalDateStr + "</span>";
      }else{
        return "<span class='status7'>"+ maxCalDateStr + "</span>";
      }
    }
  }},
  {title:"廠牌", data:"chop"},
  {title:"型號", data:"model"},
  {title:"序號", data:"serial_number"},
];
const tboption_Item = {
  dom: 'Bfti',
  buttons: [
    {
      text: '重新整理',
      className: 'btn-sm',
      action: function ( e, dt, node, config ) {
        selItemTypeChange();
      }
    },
    {
      extend: 'copy',
      text: '複製',
      className: 'btn-sm',
      exportOptions: {
        modifier: {
          selected: null
        }
      }
    },
    {
      extend: 'colvis',
      className: 'btn-sm',
      text: '顯示欄位',
    }
  ],
  select: {style: 'single',info: false},
  order: [[2, 'desc']],
  scrollY: 'calc(60vh - 15rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

function selItemTypeChange(e){
  if(joinItem.value){
    // 有連結
    refgetAllItem({
      orgId: parseInt(nowCustOrgID.value),
      type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
    })
  }else{
    // 無連結
    refgetAllItem({
      orgId: null,
      type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
    })
  }
}
// 新增校正件
function newItem(){
  nowItemId.value = "";
  nowItemType.value = -1
  nowItemTypeDOM.value.setValue(-1);

  nowItemChop.value = -1;
  nowItemChopDOM.value.setValue(-1);
  nowItemModel.value = -1;
  nowItemModelDOM.value.setValue(-1);
  nowItemSN.value = "";
}
// 儲存校正件
function saveItemBtn(){
  saveItem({
    updateItemId: (parseInt(nowItemId.value))?parseInt(nowItemId.value):-1,
    chop: nowItemChop.value,
    model: nowItemModel.value,
    serialNumber: nowItemSN.value,
    type: parseInt(nowItemType.value),
  }).then(res=>{
    let itemId = parseInt(res.data.updateItem.id);
    refgetItemById({getItemByIdId: parseInt(itemId)});
  })
}
const { mutate: saveItem, onDone: saveItemOnDone, onError: saveItemError } = useMutation(ItemGQL.SAVEITEM);
saveItemOnDone(result=>{
  infomsg.value = "校正件 " + result.data.updateItem.id + " 儲存完畢";
  msgColor.value = "blue";
  store.dispatch('selectlist/fetchChopList').then(res=>{
    nowItemChopMU.value = JSON.parse(JSON.stringify(store.state.selectlist.caseChopList));
  });
  store.dispatch('selectlist/fetchModelList').then(res=>{
    nowItemModelMU.value = JSON.parse(JSON.stringify(store.state.selectlist.caseModelList));
  });
  if(joinItem.value){
    if(nowCustOrgID.value && nowCustOrgID.value!==""){
      // console.log("nowCustOrgID",nowCustOrgID.value);
      refgetAllItem({
        orgId: parseInt(nowCustOrgID.value),
        type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
      })
    }else{
      refgetAllItem({
        orgId: null,
        type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
      })
    }
  }else{
    refgetAllItem({
      orgId: null,
      type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
    })
  }
});
saveItemError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

const { mutate: delItem, onDone: delItemOnDone, onError: delItemError } = useMutation(
  ItemGQL.DELITEM, () => ({
  variables: {
    delItemId: parseInt(nowItemId.value),
  }})
);
delItemOnDone(result=>{
  infomsg.value = "校正件 " + result.data.delItem.id + " 刪除完成";
  msgColor.value = "blue";
  if(joinItem.value){
    if(nowCustOrgID.value && nowCustOrgID.value!==""){
      // console.log("nowCustOrgID",nowCustOrgID.value);
      refgetAllItem({
        orgId: parseInt(nowCustOrgID.value),
        type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
      })
    }else{
      refgetAllItem({
        orgId: null,
        type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
      })
    }
  }else{
    refgetAllItem({
      orgId: null,
      type: (parseInt(selItemType.value)===-1)?null:parseInt(selItemType.value),
    })
  }
});
delItemError(e=>{
  errorHandle(e,infomsg,alert1,msgColor);
});

//#endregion 校正件表格==========End

//#region 案件連結表格==========Start
// 查詢案件資料
const { onDone: getItemCaseonDone, mutate: refgetItemCase, onError: getItemCaseonError } = useMutation(
  CaseGQL.GETALLCASE,
  ()=>({
    variables: {
      itemId: -1
    }
  })
);
getItemCaseonDone(result=>{
  if(!result.loading){
    data_Case.value = result.data.getAllCase;
  }
});
getItemCaseonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

let dt_Case;
const table_Case = ref(); 
const data_Case = ref([]);
const columns_Case = [
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
  {title:"案件編號", data:"id",width:"2rem"},
  {title:"機關名稱", data:"cus.cus_org.name", defaultContent: "-"},
  {title:"聯絡人", data:"cus.name", defaultContent: "-"},
  {title:"校正人員", data:"employee_case_base_operators_idToemployee.name", defaultContent: "-"},
  {title:"校正日期", data:"case_record_01.complete_date", className: "dt-center", defaultContent: "-", render: (data, type, row) => {
      if (data) {
        return toTWDate(data);
      } else if (row.case_record_02) {
        return toTWDate(row.case_record_02.complete_date);
      }
    }
  },
  {title:"費用", data:"charge", className: "dt-right", defaultContent: "-",
    render: function (data, type) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(data)
    }
  },
  {title:"繳費日期", data:"pay_date", className: "dt-center", defaultContent: "-", render: (data) => {
      return toTWDate(data);
    }
  },
];
const tboption_Case = {
  dom: 'Bfti',
  buttons: [
    {
      text: '重新整理',
      className: 'btn-sm',
      action: function ( e, dt, node, config ) {
        let itemId = (nowItemId.value)?nowItemId.value:-1
        if(joinItem.value){
          refgetItemCase({
            itemId: parseInt(itemId),
            orgId: parseInt(nowCustOrgID.value)
          });
        }else{ 
          refgetItemCase({itemId: parseInt(itemId)});
        }
      }
    },
    {
      extend: 'copy',
      text: '複製',
      className: 'btn-sm',
      exportOptions: {
        modifier: {
          selected: null
        }
      }
    },
    {
      extend: 'colvis',
      className: 'btn-sm',
      text: '顯示欄位',
    }
  ],
  select: {style: 'single',info: false},
  order: [[1, 'desc']],
  scrollY: 'calc(40vh - 13rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};
// 案件連結表格==========End

// 確認登入狀況
getchecktoken().then(res=>{
  store.dispatch('selectlist/fetchOrgList');
  store.dispatch('selectlist/fetchItemTypeList');
  store.dispatch('selectlist/fetchChopList').then(res=>{
    nowItemChopMU.value = JSON.parse(JSON.stringify(store.state.selectlist.caseChopList));
  });
  store.dispatch('selectlist/fetchModelList').then(res=>{
    nowItemModelMU.value = JSON.parse(JSON.stringify(store.state.selectlist.caseModelList));
  });
  refgetAllCust();
  refgetAllItem();
  // refgetItemList();

  return
}).catch(e=>{
  errorHandle(e,infomsg,alert1,msgColor);
});


// 加載表格選取事件
onMounted(function () {
  dt_org = table_org.value.dt();
  dt_org.on('select', function (e, dt, type, indexes) {
    nowCustOrgID.value = dt.rows(indexes).data()[0].id;
    nowCustOrgName.value = dt.rows(indexes).data()[0].name;
    nowCustOrgTaxId.value = dt.rows(indexes).data()[0].tax_id;
    // 連結聯絡人資料
    if(joinCust.value){
      if(nowCustOrgID.value && nowCustOrgID.value!==""){
        // console.log("nowCustOrgID",nowCustOrgID.value);
        refgetAllCust({orgId: parseInt(nowCustOrgID.value)});
      }else{
        refgetAllCust({orgId: null});  
      }
    }else{
      refgetAllCust({orgId: null});
    }
    newCust();
    // 連結校正件資料
    if(joinItem.value){
      if(nowCustOrgID.value && nowCustOrgID.value!==""){
        // console.log("nowCustOrgID",nowCustOrgID.value);
        refgetAllItem({orgId: parseInt(nowCustOrgID.value)});
      }else{
        refgetAllItem({orgId: null});  
      }
    }else{
      refgetAllItem({orgId: null});
    }
    // newItem();

    refgetItemCase({itemId: -1});
  });

  dt_cust = table_cust.value.dt();
  dt_cust.on('select', function (e, dt, type, indexes) {
    nowCustId.value = dt.rows(indexes).data()[0].id;
    refgetselCust({getCustByIdId: (parseInt(nowCustId.value))?parseInt(nowCustId.value):-1});
  });

  dt_Item = table_Item.value.dt();
  dt_Item.on('select', function (e, dt, type, indexes) {
    nowItemId.value = dt.rows(indexes).data()[0].id;
    refgetItemById({getItemByIdId: parseInt(nowItemId.value)});
    if(joinItem.value){
      refgetItemCase({
        itemId: parseInt(nowItemId.value),
        orgId: parseInt(nowCustOrgID.value)
      });
    }else{ 
      refgetItemCase({itemId: parseInt(nowItemId.value)});
    }
  });
});

</script>
<template>
  <MDBAlert v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    autohide :delay="2000.0">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1/>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <!-- 左方列表 -->
        <MDBCol lg="5" class="h-100">
          <MDBRow class="h-100">
            <!-- 左上列表 -->
            <MDBCol col="12" style="height: 60%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100 overflow-auto" style="position:relative ;">
                    <div style="position: absolute; top:0;left:0; width: 8rem;">
                      顧客管理
                    </div>
                    <!-- 機關表格 -->
                    <MDBCol col="12" class="mt-2">
                      <DataTable :data="data_org" :columns="columns_org" :options="tboption_org" ref="table_org"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 機關操作表單 -->
                    <MDBCol col="12" class="border-1 border-top" style="height: 7rem;">
                      <MDBCol lg="12" class="mt-2">
                        <MDBBtn :disabled="!rGroup[2] || nowCustOrgID===''" size="sm" color="primary" @click="newOrg">新增</MDBBtn>
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveOrg">儲存</MDBBtn>
                        <!-- <MDBBtn size="sm" color="primary" @click="delOrg">刪除</MDBBtn> -->
                        <MDBPopconfirm v-if="rGroup[0]" :disabled="!rGroup[0] || nowCustOrgID===''" color="danger" class="btn-sm btn-light btn-outline-danger me-auto"
                          message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delOrg">
                          刪除
                        </MDBPopconfirm>
                        <MDBBtn size="sm" color="primary" @click="setJoinCust"><span :class="joinCustTextColor"><i :class="joinCustIcon"></i>聯絡人</span></MDBBtn>
                        
                      </MDBCol>
                      <MDBCol lg="8" class="mt-3">
                        <MDBInput size="sm" type="text" label="機關名稱" v-model="nowCustOrgName"/>
                      </MDBCol>
                      <div></div>
                      <MDBCol lg="8" class="mt-2">
                        <MDBInput size="sm" type="text" label="統一編號" v-model="nowCustOrgTaxId"/>
                      </MDBCol>
                    </MDBCol>
                  </MDBRow>
                  
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 左下列表 -->
            <MDBCol col="12" style="height: 40%;">
              <MDBRow class="h-100">
                <MDBCol col="12" class="border border-5 rounded-8 shadow-4 mb-2" style="height: calc(100% - 0.5rem)">
                  <MDBRow class="h-100" style="position:relative ;">
                    <div style="position: absolute; top:0;left:0; width: 8rem;">
                      聯絡人
                    </div>
                    <!-- 左下左 -->
                    <MDBCol col="5" class="mt-2 overflow-auto" style="height: calc(100% - 0.5rem)">
                      <DataTable id="custTable" :data="data_cust" :columns="columns_cust" :options="tboption_cust" ref="table_cust"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 左下右 -->
                    <MDBCol col="7" class="h-100 border-1 border-start">
                      <MDBCol col="12" class="py-2 w-100 border-1 border-bottom overflow-auto" style="white-space: nowrap">
                        <MDBBtn :disabled="!rGroup[2] || nowCustId===''" size="sm" color="primary" @click="newCust">新增</MDBBtn>
                        <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveCust">儲存</MDBBtn>
                        <!-- <MDBBtn size="sm" color="primary" @click="delCust">刪除</MDBBtn> -->
                        <MDBPopconfirm v-if="rGroup[0]" :disabled="!rGroup[0] || nowCustId===''" class="btn-sm btn-light btn-outline-danger me-auto"
                          message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delCust">
                          刪除
                        </MDBPopconfirm>
                      </MDBCol>
                      <MDBCol class="mt-2" style="height: calc(100% - 4.5rem);">
                        <MDBRow class="h-100 d-flex align-content-start overflow-auto">
                          <MDBCol lg="8" class="mt-2">
                            <MDBInput size="sm" type="text" label="姓名" v-model="nowCustName"/>
                          </MDBCol>
                          <MDBCol lg="8" class="mt-3">
                            <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowCustTel"/>
                          </MDBCol>
                          <MDBCol lg="8" class="mt-3">
                            <MDBInput size="sm" type="text" label="傳真" v-model="nowCustFax"/>
                          </MDBCol>
                          <MDBCol lg="12" class="mt-3">
                            <MDBInput size="sm" type="text" label="地址" v-model="nowCustAddress"/>
                          </MDBCol>
                          <MDBSelect 
                            filter size="sm" class="mt-3 col-12" 
                            label="機關名稱" 
                            v-model:options="nowCustSelOrgIdMU"
                            v-model:selected="nowCustSelOrgId" 
                            ref="nowCustSelOrgIdDOM" />
                        </MDBRow>
                      </MDBCol>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol lg="7" class="h-100">
          <MDBRow class="h-100" style="margin-left:0;">
            <!-- 右上 -->
            <MDBCol col="12" style="height: 60%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100">
                    <MDBCol col="12" class="h-100">
                      <MDBRow class="h-100 overflow-auto">
                        <!-- 左表格 -->
                        <MDBCol lg="8" class="pt-2">
                          <MDBCol col="12">
                            校正件管理
                            <MDBBtn size="sm" color="primary" @click="setJoinItem"><span :class="joinItemTextColor"><i :class="joinItemIcon"></i>連結顧客</span></MDBBtn>
                          </MDBCol>
                          <MDBCol col="12">
                            <DataTable 
                              :data="data_Item" 
                              :columns="columns_Item" 
                              :options="tboption_Item" 
                              ref="table_Item"
                              style="font-size: smaller; padding-top: 1rem;" 
                              class="display w-100 compact" />
                          </MDBCol>
                        </MDBCol>
                        <!-- 右資料 -->
                        <MDBCol lg="4" class="border-1 border-start">
                          <MDBRow class="h-100 d-flex align-content-start">
                            <!-- 右上篩選 -->
                            <MDBCol col="12" class="">
                              篩選設定
                            </MDBCol>
                            <MDBSelect size="sm" class="my-2 col-lg-8" label="儀器類型" v-model:options="selItemTypeMU"
                              v-model:selected="selItemType" ref="selItemTypeDOM" @change="selItemTypeChange"/>

                            <MDBCol col="12" class="border-1 border-top">
                              資料編輯
                            </MDBCol>
                            <!-- 操作按鈕 -->
                            <MDBCol col="12" class="py-2 w-100 overflow-auto" style="white-space: nowrap">
                              <MDBBtn :disabled="!rGroup[2] || nowItemId===''" size="sm" color="primary" @click="newItem">新增</MDBBtn>
                              <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveItemBtn">儲存</MDBBtn>
                              <!-- <MDBBtn size="sm" color="primary" @click="delItem">刪除</MDBBtn> -->
                              <MDBPopconfirm v-if="rGroup[0]" :disabled="!rGroup[0] || nowItemId===''" class="btn-sm btn-light btn-outline-danger me-auto"
                                message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delItem">
                                刪除
                              </MDBPopconfirm>
                            </MDBCol>
                            <MDBCol col="12" class="" style="height: calc(100% - 10rem);">
                              <MDBRow class="h-100 d-flex align-content-start overflow-auto">
                                <MDBCol col="12" class="mt-2">
                                  <MDBInput readonly size="sm" type="text" label="索引" v-model="nowItemId" />
                                </MDBCol>
                                <MDBSelect 
                                  size="sm" class="mt-2 col-lg-12" 
                                  label="儀器類型" 
                                  v-model:options="nowItemTypeMU"
                                  v-model:selected="nowItemType" 
                                  ref="nowItemTypeDOM" />
                                
                                <MDBSelect size="sm" class="mt-2 col-12" 
                                  filter
                                  label="廠牌" 
                                  v-model:options="nowItemChopMU"
                                  v-model:selected="nowItemChop" 
                                  ref="nowItemChopDOM"
                                  @close="updateItemChop()">
                                  <MDBInput 
                                    size="sm" 
                                    type="text" 
                                    label="自訂新選項" 
                                    v-model="nowItemChop" 
                                    @click="domTextSelect($event)" />
                                </MDBSelect>

                                <MDBSelect size="sm" class="mt-2 col-12" 
                                  filter
                                  label="型號" 
                                  v-model:options="nowItemModelMU"
                                  v-model:selected="nowItemModel" 
                                  ref="nowItemModelDOM"
                                  @close="updateItemModel()">
                                  <MDBInput 
                                    size="sm" 
                                    type="text" 
                                    label="自訂新選項" 
                                    v-model="nowItemModel"
                                    @click="domTextSelect($event)" />
                                </MDBSelect>

                                <MDBCol col="12" class="mt-2">
                                  <MDBInput size="sm" type="text" label="序號" v-model="nowItemSN" />
                                </MDBCol>
                              </MDBRow>
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 右下 -->
            <MDBCol col="12" style="height: 40%;">
              <MDBRow class="h-100">
                <MDBCol col="12" class="border border-5 rounded-8 shadow-4 mb-2" style="height: calc(100% - 0.5rem)">
                  <MDBRow class="h-100 d-flex align-content-start overflow-auto">
                    <MDBCol col="12">
                      校正紀錄
                    </MDBCol>
                    <MDBCol col="12">
                      <DataTable 
                        :data="data_Case" 
                        :columns="columns_Case" 
                        :options="tboption_Case" 
                        ref="table_Case"
                        style="font-size: smaller;" 
                        class="display w-100 compact" />
                    </MDBCol>
                    
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" :activeColor="msgColor" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.datatable tbody tr:last-child {
  border-bottom: rgba(0, 0, 0, 0);
  height: auto;
}

#custTable div.dataTables_wrapper div.dataTables_filter input {
  width: 6rem;
}

tr.selected>td>span {
  color: white;
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
div.notext input,div.notext input.select-input.focused{
  color:rgba(0, 0, 0, 0)
}

input.noborder~div.form-notch div.form-notch-leading,input.noborder~div.form-notch div.form-notch-middle,input.noborder~div.form-notch div.form-notch-trailing{
  border: none;
}
</style>