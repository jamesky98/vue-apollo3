<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide,inject } from "vue";
import { computed } from "@vue/reactivity";
import path, { join } from "path-browserify";
import {
  MDBInput,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBBtn,
  MDBAlert,
} from 'mdb-vue-ui-kit';
import { useStore } from 'vuex'
import CaseGQL from "../graphql/Cases";
import jStat from "jstat";

import vueDataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';

import jQuery from "jquery";

import DataTables from "datatables.net";

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);
// ==註冊元件===
Object.assign(window, { $: jQuery, jQuery });
DataTables(window,$);
Select(window,$);
// ==註冊元件===

vueDataTable.use(DataTableBs5);
vueDataTable.use(Select);

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
  return rGroupSetting(myUserRole.value,false)
});
//#endregion 取得權限==========End

//#region 參數==========start
// Information
const NavItem = ref("ucedit");
provide("NavItem",NavItem);
const infomsg = ref("");
const msgColor = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const updateKey = ref(0);
const store = useStore();

const nowUcModuleName = ref(""); // 模組名稱
const selectUcModuleName = ref(""); // 模組列表
const nowUcModuleNameMU = ref([]);
const nowUcModuleNameDOM = ref();

const selectUcCalType = ref(""); // 校正項目列表
const nowUcCalTypeMU = computed(() => store.state.selectlist.caseCalTypeList3);
const nowUcCalTypeDOM = ref();

const selectUcParmType = ref(""); // 規格型態
const nowUcParmTypeMU = computed(()=>{
  let list = [
    {text: "-未選擇-", value: -1},
    {text: "A", secondaryText: '具完整規格', value: "A"},
    {text: "B", secondaryText: '整合精度', value: "B"},
  ];
  return list
});
const nowUcParmTypeDOM = ref();

const nowUcModule = reactive({uc:{}}); // 不確定度模組物件
const nowUcSection = ref(0); // 目前Section
const nowUcItem = ref(0); // 目前Item
const nowUcItemX = ref(0); // 目前Item
const nowUcItemFr = ref(0); // 目前Item
const nowUcItemFa = ref(0); // 目前Item

const selectUcSecType = ref(""); // 校正項目列表
const nowUcSecTypeMU = ref([
  {text: "-未選擇-", value: -1},
  {text: "平面", value: "平面"},
  {text: "高程", value: "高程"},
]);
const nowUcSecTypeDOM = ref();

const selectFrequency = ref(""); //變動時機
const nowFrequencyMU = ref([
  {text: "-未選擇-", value: -1},
  {text: "系統評估", value: "系統評估"},
  {text: "每年量測", value: "每年量測"},
  {text: "每次校正", value: "每次校正"},
]);
const nowFrequencyDOM = ref();
const ucModuleTemp = {
  "calType": "",
  "parmtype": "",
  "prjcode": "",
  "ver": "",
  "minUcH": "",
  "minUcV": "",
  "confLevel": "",
  "uom": "",
  "data": [
    {
      "section": "",
      "type": "",
      "comment": "",
      "data": [
        {
          "name": "",
          "frequency": "",
          "x": [],
          "x_title": [],
          "fr": [],
          "fr_title": [],
          "fa": [],
          "fa_title": [],
          "ux": "",
          "freedom": "",
          "factor": ""
        },]
    },]
};

const nowUcModuleDL = computed(() => {
  if (nowUcModuleName.value && nowUcModuleName.value !== "" && nowUcModuleName.value !== ".json") {
    return "08_Template/uncertainty/" + nowUcModuleName.value;
  } else {
    return undefined;
  }
});

const combUx = ref("");
const combFr = ref("");

// Section表格
let dt1;
const table1 = ref(); 
const columns1 = [
  { // 收闔框
    "className": 'details-control',
    "orderable": false,
    "data": null,
    "defaultContent": '',
    "render": function () {
      return '<i class="subtool fa fa-plus-square" aria-hidden="true"></i>';
    },
    width:"0.5rem"
  },
  {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
  {title:"Section", data:"section"},
  {title:"Type", data:"type"},
];
const tboption1 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// Item表格
let dt2;
const table2 = ref(); 
const data2 = ref([]);
const columns2 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
  {title:"Item", data:"name", defaultContent: "-"},
  {title:"變動時機", data:"frequency", defaultContent: "-"},
  {title:"標準不確定度",data:"ux", defaultContent: "-", render: (data, type, row) => {
    return (isNaN(data) || !data)?data:parseFloat(data).toFixed(4)
  }},
  {title:"靈敏係數",data:"factor", defaultContent: "-", render: (data, type, row) => {
    return (isNaN(data) || !data)?data:parseFloat(data).toFixed(4)
  }},
  {title:"不確定度分量", defaultContent: "-", render: (data, type, row) => {
    let ux = row.ux;
    let factor = row.factor;
    if(isNaN(ux) || !ux || isNaN(factor) || !factor){
      return '';
    }else{
      return (ux*factor).toFixed(4)
    }
  }},
  {title:"自由度",data:"freedom", defaultContent: "-", render: (data, type, row) => {
    return (isNaN(data) || !data)?data:parseFloat(data).toFixed(4)
  }},
];
const tboption2 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// ux表格
let dt3;
const table3 = ref(); 
const data3 = ref([]);
const columns3 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"x_title"},
  {title:"值", data:"x"},
];
const tboption3 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  scrollY: '4.5rem',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// freedom表格
let dt4;
const table4 = ref(); 
const data4 = ref([]);
const columns4 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"fr_title"},
  {title:"值", data:"fr"},
];
const tboption4 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  scrollY: '4.5rem',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};

// factor表格
let dt5;
const table5 = ref(); 
const data5 = ref([]);
const columns5 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row},width: "30px"},  
  {title:"代號",render: function (data, type, row, meta ) {return "parms[" + meta.row + "]";},width: "30px"},
  {title:"名稱", data:"fa_title"},
  {title:"值", data:"fa"},
];
const tboption5 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  scrollY: '4.5rem',
  scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};
//#endregion 參數==========End

// 查詢校正項目列表
// const { 
//   onDone: getCaseCalTypeonDone, 
//   mutate: refgetCaseCalType, 
//   onError: getCaseCalTypeonError } = useMutation(CaseGQL.GETCASECALTYPE);
// getCaseCalTypeonDone(result => {
//   // 加入校正項目選單資料
//   if (!result.loading) {
//     // 篩選區
//     nowUcCalTypeMU.value = result.data.getCaseCalType.map(x => {
//       return { text: x.code,secondaryText: x.name, value: x.code }
//     }); nowUcCalTypeMU.value.unshift({ text: "", value: "" });
//   }
// });
// getCaseCalTypeonError(e=>{errorHandle(e,infomsg,alert1)});

// 取得不確定度列表
const {
  mutate: getUcList,
  onDone: getUcListOnDone,
  onError: getUcListError,
} = useMutation(CaseGQL.GETUCLIST);
getUcListOnDone((result) => {
  // 填入uclist選單
  let myArray=[];
  if (!result.loading && result.data.getUclist) {
    myArray = result.data.getUclist.map((x) => {
      return { text: x, value: x };
    });
    myArray.sort((a,b)=>{
      return (a.text > b.text)?1:-1
    }).reverse();
  }
  myArray.unshift({ text: "-未選取-", value: -1 });
  nowUcModuleNameMU.value = myArray;
  nowUcModuleNameDOM.value.setValue(-1);
});
getUcListError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function readUcModule(){
  // console.log('readUcModule')
  // selectUcModuleName.value = nowUcModuleNameDOM.value.inputValue;
  if(selectUcModuleName.value && selectUcModuleName.value!==-1){
    getUcModule({filename: selectUcModuleName.value});
  }else{
    createNewUc();
  }
}

// 執行取得不確定度模組getUcModule
const { 
  mutate: getUcModule, 
  onDone: getUcModuleOnDone, 
  onError: getUcModuleonError
} = useMutation(
  CaseGQL.GETUCMODULE
);
getUcModuleOnDone(result=>{
  // 填入基本資料
  nowUcModule.uc = JSON.parse(result.data.getUcModule);
  nowUcModuleName.value = selectUcModuleName.value;
  nowUcCalTypeDOM.value.setValue(nowUcModule.uc.calType);
  // selectUcParmType.value = result.data.getUcModule
  // console.log('parmtype',nowUcModule.uc.parmtype)
  nowUcParmTypeDOM.value.setValue(nowUcModule.uc.parmtype);
  nowUcSection.value=0;
  nowUcItem.value=0;
  nowUcItemX.value=0;
  nowUcItemFr.value=0;
  nowUcItemFa.value=0;
  data2.value=nowUcModule.uc.data[nowUcSection.value].data;
  combUx.value="";
  combFr.value="";
  getItemData();
  // console.log('nowUcModule',nowUcModule);
  // console.log(nowUcCalTypeDOM.value);

});
getUcModuleonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

function getItemData(){
  // console.log('nowUcModule',nowUcModule.uc);
  // console.log('Section',nowUcSection.value);
  // console.log('Item',nowUcItem.value);
  let x_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x;
  let x_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title;
  let fr_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr;
  let fr_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title;
  let fa_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa;
  let fa_title_Array=nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title;
  data3.value=[];
  for(let i=0; i<x_Array.length;i++){
    data3.value.push({x_title:x_title_Array[i],x:x_Array[i]});
  }
  data4.value=[];
  for(let i=0; i<fr_Array.length;i++){
    data4.value.push({fr_title:fr_title_Array[i],fr:fr_Array[i]});
  }
  data5.value=[];
  for(let i=0; i<fa_Array.length;i++){
    data5.value.push({fa_title:fa_title_Array[i],fa:fa_Array[i]});
  }

  selectUcSecType.value = nowUcModule.uc.data[nowUcSection.value].type;
  if(nowUcSecTypeDOM.value){nowUcSecTypeDOM.value.setValue(nowUcModule.uc.data[nowUcSection.value].type);}
  selectFrequency.value = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency;
  if(nowFrequencyDOM.value){nowFrequencyDOM.value.setValue(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency);}
  
}

// 新增模組
function createNewUc(){
  nowUcModuleName.value = ".json";
  nowUcModule.uc = JSON.parse(JSON.stringify(ucModuleTemp));
  nowUcCalTypeDOM.value.setValue(nowUcModule.uc.calType);
  nowUcSection.value = 0;
  nowUcItem.value = 0;
  nowUcItemX.value = 0;
  nowUcItemFr.value = 0;
  nowUcItemFa.value = 0;
  data2.value=nowUcModule.uc.data[nowUcSection.value].data;
  combUx.value="";
  combFr.value="";
  getItemData();
}

// 儲存模組
function saveUcModuleBtn(){
  saveUcModule().then(res_1=>{
    // console.log(res_1);
    // console.log(res_1.data.saveUcModule);
    // 更新狀態訊息
    infomsg.value = "模組 "+ nowUcModuleName.value + "儲存完畢";
    msgColor.value = "blue";
    // alertColor.value = "primary";
    // alert1.value = true;
    let temp = res_1.data.saveUcModule;
    getUcList().then(res=>{
      nowUcModuleNameDOM.value.setValue(temp);
    });
  })
}
const { mutate: saveUcModule, onError: saveUcModuleError } = useMutation(
  CaseGQL.SAVEUCMODULE,
  () => ({
    variables: {
      filename: nowUcModuleName.value,
      ucModuleStr: JSON.stringify(nowUcModule.uc),
    }
  })
);
saveUcModuleError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

// 增加Section
function addSection(){
  nowUcModule.uc.data.push(JSON.parse(JSON.stringify(ucModuleTemp.data[0])));
}
// 刪除Section
function delSection(){
  if(nowUcModule.uc.data.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data.splice(nowUcSection.value,1);
    // 更新table
    nowUcSection.value=0;
    nowUcItem.value=0;
    nowUcItemX.value=0;
    nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    combUx.value="";
    combFr.value="";
    getItemData();
  }
}

// 增加Item
function addItem(){
  nowUcModule.uc.data[nowUcSection.value].data.push(JSON.parse(JSON.stringify(ucModuleTemp.data[0].data[0])));
}
// 刪除Item
function delItem(){
  if(nowUcModule.uc.data[nowUcSection.value].data.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data.splice(nowUcItem.value,1);
    // 更新table
    // nowUcSection.value=0;
    nowUcItem.value=0;
    nowUcItemX.value=0;
    nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    combUx.value="";
    combFr.value="";
    getItemData();
  }
}

// 增加Ux
function addUx(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title.push("");
  getItemData();
}
// 刪除Ux
function delUx(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x.splice(nowUcItemX.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].x_title.splice(nowUcItemX.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    nowUcItemX.value=0;
    // nowUcItemFr.value=0;
    // nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    combUx.value="";
    combFr.value="";
    getItemData();
  }
}

// 增加fr
function addFr(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title.push("");
  getItemData();
}
// 刪除fr
function delFr(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr.splice(nowUcItemFr.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fr_title.splice(nowUcItemFr.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    // nowUcItemX.value=0;
    nowUcItemFr.value=0;
    // nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    combUx.value="";
    combFr.value="";
    getItemData();
  }
}

// 增加fa
function addFa(){
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.push(0);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title.push("");
  getItemData();
}
// 刪除fa
function delFa(){
  if(nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.length>0){
    // 陣列中刪除元素
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa.splice(nowUcItemFa.value,1);
    nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].fa_title.splice(nowUcItemFa.value,1);
    // 更新table
    // nowUcSection.value=0;
    // nowUcItem.value=0;
    // nowUcItemX.value=0;
    // nowUcItemFr.value=0;
    nowUcItemFa.value=0;
    // data2.value=nowUcModule.uc.data[nowUcSection.value].data;
    combUx.value="";
    combFr.value="";
    getItemData();
  }
}

// 下拉式選單資料回填
function updateCalType(){
  // console.log("selectUcCalType:",selectUcCalType.value);
  nowUcModule.uc.calType = selectUcCalType.value;
}
function updateParmType(){
  // console.log("selectUcCalType:",selectUcCalType.value);
  nowUcModule.uc.parmtype = selectUcParmType.value;
}
function updataSecType(){
  // console.log("selectUcSecType:",selectUcSecType.value);
  nowUcModule.uc.data[nowUcSection.value].type = selectUcSecType.value;
}
function updataFr(){
  // console.log("selectFrequency:",selectFrequency.value);
  nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].frequency = selectFrequency.value;
}

function addParam(tid){
  switch(tid){
    case 3:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].ux = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].ux + "parms["+ nowUcItemX.value +"]";    
      break;
    case 4:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].freedom = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].freedom + "parms["+ nowUcItemFr.value +"]";    
      break;
    case 5:
      nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].factor = nowUcModule.uc.data[nowUcSection.value].data[nowUcItem.value].factor + "parms["+ nowUcItemFa.value +"]";    
      break;
  }
  
}

//#region  試算Uc===========start
function testUcBtn(){
  saveUcModule({
    filename: 'temp.json',
    ucModuleStr: JSON.stringify(nowUcModule.uc),
  }).then(res=>{
    // console.log('has save temp!!');
    testUc({
      filename: 'temp.json',
    }).then(res=>{
      let secID = nowUcSection.value;
      let secData = res.data.getUcResultformJson.data[secID];
      // console.log(secData);
      combUx.value = (secData.combUx).toFixed(4);
      combFr.value = (secData.combFr).toFixed(4);
    })
  });
}

const { mutate: testUc, onDone: testUcOnDone, onError: testUcError } = useMutation(
  CaseGQL.GETUCRESULTFORMJSON,
  () => ({
    variables: {
      filename: nowUcModuleName.value,
    }
  })
);
testUcOnDone(result=>{
  // 更新狀態訊息
  let secID = nowUcSection.value;
  data2.value = result.data.getUcResultformJson.data[secID].data;
  infomsg.value = "試算結果 ucH: "+ result.data.getUcResultformJson.ucH_o + " ucV: " + result.data.getUcResultformJson.ucV_o;
  msgColor.value = "blue";
  // alertColor.value = "primary";
  // alert1.value = true;
});
testUcError(e=>{errorHandle(e,infomsg,alert1,msgColor)});
//#endregion  試算Uc===========end

// 確認登入狀況
getchecktoken().then(res=>{
  // refgetCaseCalType();
  store.dispatch('selectlist/fetchCalTypeList');
  return 
}).catch(e=>{
  errorHandle(e,infomsg,alert1,msgColor);
});

// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    nowUcSection.value = dt.rows(indexes)[0][0];
    $('.subgrid').DataTable().rows().deselect();
    changeSectionUpdatItem(nowUcSection.value,0);
  });
  

  // 收闔事件
  dt1.off('click', '.subtool');
  dt1.on('click', '.subtool', function (e) {
    // console.log('e',e);
    let tdi = e.target; // 被click的物件=>收合圖示
    // console.log('tdi',tdi);
    let dtRow = e.target.parentElement.parentElement; // 取得該行的tr DOM物件
    // console.log('dtRow',dtRow);
    let row = dt1.row(dtRow); // 取得該行DOM轉TAB物件
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      dtRow.classList.remove('shown');
      tdi.classList.remove('fa-minus-square');
      tdi.classList.add('fa-plus-square');
    }
    else {
      // Open this row
      let idx = e.target.parentElement.nextElementSibling.innerText;
      // console.log('idx',idx);
      row.child(subtable(idx)).show();
      dtRow.classList.add('shown');
      tdi.classList.remove('fa-plus-square');
      tdi.classList.add('fa-minus-square');
      new Promise((res)=>{
        // console.log('in promise');
        res(row.child(subtable(idx)).show());
      }).then(res=>{
        createSubTable(row.data(),idx);
      });
    }
    e.stopPropagation()
  });

  function subtable(id){
    return '<div class="d-flex justify-content-start flex-nowrap">' + 
      '<div style="width:2rem;height:2rem;position: relative;" class="">'+
        '<div style="position: absolute;right:0;top:0;width:1rem;height:1.25rem;border-left: 1px dotted;border-bottom: 1px dotted"></div>'+
      '</div>'+
      '<div class="">'+
        '<table id="subgrid_' + id + '" class="subgrid border border-1" style=""></table>'+
      '</div></div>';
  }

  function createSubTable(data, id){
    // console.log('data',data);
    let subData = data.data;
    let subgrid = $('#subgrid_'+id).DataTable(
      {
        "columns": [
          {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
          {title:"Item", data:"name"},
          {title:"變動時機", data:"frequency"},
        ],
        "data": subData,
        dom: 't',
        select: {style: 'single',info: false},
        scrollX: true,
        lengthChange: false,
        searching: false,
        paging: false,
        responsive: true,
      }
    );
    subgrid.on('select', function (e, dt, type, indexes) {
      // console.log('subgrid');
      let idx =  dt.table().node().id;
      let secID = nowUcSection.value = parseInt(idx.split('_')[1]);
      let itemID = nowUcItem.value = dt.rows(indexes)[0][0];
      dt1.rows().deselect();
      $('.subgrid:not(#subgrid_' + secID + ')').DataTable().rows().deselect();
      changeSectionUpdatItem(secID,itemID);
      e.stopPropagation();
    });
  }

  dt2 = table2.value.dt();
  dt2.on('select', function (e, dt, type, indexes) {
    let secID = nowUcSection.value;
    let itemID = nowUcItem.value = dt.rows(indexes)[0][0];
    // 判斷子表格是否開啟
    let ifOpenSubTable = dt1.row(secID).node().firstChild.firstChild.classList.contains('fa-minus-square');
    // console.log('ifOpenSubTable',ifOpenSubTable);
    if(ifOpenSubTable){
      // 如果開啟則選擇該項目
      $('#subgrid_' + secID).DataTable().rows().deselect();
      $('#subgrid_' + secID).DataTable().row(itemID).node().classList.add('selected');
    }
    
    getItemData();
  });

  dt3 = table3.value.dt();
  dt3.on('select', function (e, dt, type, indexes) {
    nowUcItemX.value = dt.rows(indexes)[0][0];
  });

  dt4 = table4.value.dt();
  dt4.on('select', function (e, dt, type, indexes) {
    nowUcItemFr.value = dt.rows(indexes)[0][0];
  });

  dt5 = table5.value.dt();
  dt5.on('select', function (e, dt, type, indexes) {
    nowUcItemFa.value = dt.rows(indexes)[0][0];
  });

  // 將選單設定為初始
  getUcList();
  createNewUc();

  // 初始化樹狀選單
  let toggler = document.getElementsByClassName("caret");
  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
});

function changeSectionUpdatItem(sectoin, item){
  new Promise((resolve,reject)=>{
    data2.value=nowUcModule.uc.data[sectoin].data;
    combUx.value="";
    combFr.value="";
    resolve(data2.value);
  }).then(res=>{
    dt2.rows(nowUcItem.value).select();
  })
  nowUcItem.value = (item)?item:0;
  nowUcItemX.value = 0;
  nowUcItemFr.value = 0;
  nowUcItemFa.value = 0;
  // getItemData();
}
</script>
<template>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    autohide :delay="2000.0">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100 overflow-hidden">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <div style="height: calc(100% - 6.5em);">
        <MDBRow style="margin-left:0;margin-right:0;" class="h-100 justify-content-between flex-md-nowrap overflow-auto">
          <!-- 左 -->
          <MDBCol md="4" class="h-100 ps-0 pe-1">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              
                <!-- Base內容 -->
                <MDBSelect size="sm" class="my-3 col-12" label="選擇不確定度模組" v-model:options="nowUcModuleNameMU"
                  v-model:selected="selectUcModuleName" ref="nowUcModuleNameDOM" @change="readUcModule"/>
                <!-- 基本資訊 -->
                <MDBCol style="height: 2.25rem;" col="12" class="py-1 rounded-top-5 bg-info text-white d-flex justify-content-between overflow-hidden">
                  <div>基本資訊</div>
                  <!-- 模組存取工具列 -->
                  <div>
                    <MDBBtn :disabled="!rGroup[1]" v-if="nowUcModuleName===selectUcModuleName" size="sm" color="primary" style="background-color: rgb(172, 43, 172);" @click="saveUcModuleBtn">
                      <i class="far fa-save">儲存</i>
                    </MDBBtn>
                    <MDBBtn :disabled="!rGroup[1]" v-else size="sm" color="primary" style="background-color: rgb(172, 43, 172);" @click="saveUcModuleBtn">
                      <i class="far fa-save">另存新檔</i>
                    </MDBBtn>
                    
                    <MDBBtn :disabled="selectUcModuleName===''" size="sm" color="primary" style="background-color: rgb(172, 43, 172);">
                      <RouterLink target="_blank" :to="{ path: '/sicltab08', query: { moduleName: nowUcModuleName },}">
                        <span style="background-color: rgb(172, 43, 172); color: white;"><i class="fas fa-th-list">列印計算表</i></span>
                      </RouterLink>
                    </MDBBtn>
                    <MDBBtn tag="a" :href="nowUcModuleDL" download size="sm" color="secondary">
                      <i class="fas fa-cloud-download-alt">下載</i>
                    </MDBBtn>
                  </div>
                </MDBCol>
                <MDBCol style="height: 10rem;" col="12" class="mb-3 border border-1 rounded-bottom-5 overflow-auto">
                  <MDBRow class="pt-2">
                    <MDBCol md="6" class="mb-2">
                      <MDBInput size="sm" type="text" label="模組名稱" v-model="nowUcModuleName"/>
                    </MDBCol>
                    <MDBSelect size="sm" class="mb-2 col-md-6" label="校正項目" v-model:options="nowUcCalTypeMU"
                      v-model:selected="selectUcCalType" ref="nowUcCalTypeDOM" @change="updateCalType"/>
                    
                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="量測作業編號" v-model="nowUcModule.uc.prjcode"/>
                    </MDBCol>
                    
                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="系統評估版本" v-model="nowUcModule.uc.ver"/>
                    </MDBCol>
                    <MDBSelect :disabled="selectUcCalType!=='I' && selectUcCalType!=='M'" size="sm" class="mb-2 col-md-4" label="規格型態" v-model:options="nowUcParmTypeMU"
                      v-model:selected="selectUcParmType" ref="nowUcParmTypeDOM" @change="updateParmType"/>

                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="最小不確定度H" v-model="nowUcModule.uc.minUcH"/>
                    </MDBCol>
                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="最小不確定度V" v-model="nowUcModule.uc.minUcV"/>
                    </MDBCol>
                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="長度單位" v-model="nowUcModule.uc.uom"/>
                    </MDBCol>
                    <MDBCol md="4" class="mb-2">
                      <MDBInput size="sm" type="text" label="最小不確定度S" v-model="nowUcModule.uc.minUcS"/>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <!-- Section列表 -->
              
                <MDBCol style="height: 2.25rem;" col="12" class="py-1 rounded-top-5 bg-info text-white d-flex justify-content-between overflow-hidden">
                  <div>Section列表</div>
                  <div>
                    <MDBBtn size="sm" color="primary" style="background-color: rgb(172, 43, 172);" floating @click="addSection"><i class="fas fa-plus"></i></MDBBtn>
                    <MDBBtn size="sm" color="primary" style="background-color: rgb(172, 43, 172);" floating @click="delSection"><i class="fas fa-minus"></i></MDBBtn>
                  </div>
                </MDBCol>
              
                <MDBCol style="height: calc(100% - 20rem);" col="12" class="border border-1 rounded-bottom-5 overflow-auto">
                  <MDBRow>
                    <MDBCol md="12" class="mb-3 overflow-auto">
                      <vueDataTable :data="nowUcModule.uc.data" :columns="columns1" :options="tboption1" ref="table1"
                        style="font-size: smaller" class="border border-1 border-info display w-100 compact" />
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              
            </MDBRow>
          </MDBCol>
          <!-- 新右 -->
          <MDBCol md="8" class="h-100">
            <MDBRow class="h-100">
              <MDBCol md="12" style="height: calc(100% - 1em);" class="mt-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
                <!-- 右上 -->
                <MDBRow style="height: 11em;" class="overflow-auto">
                  <MDBCol md="6" class="h-100 border-1 border-end">
                    <!-- Section內容 -->
                    <MDBCol col="12" class="mt-2">
                      目前Section：{{nowUcSection}}
                    </MDBCol>
                    <MDBCol col="12" class="">
                      <MDBRow>
                        <MDBCol col="8" class="my-2">
                          <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="Section" v-model="nowUcModule.uc.data[nowUcSection].section"/>
                        </MDBCol>
                        <MDBSelect v-if="nowUcModule.uc.data" size="sm" class="mb-2 col-8" label="type" v-model:options="nowUcSecTypeMU"
                          v-model:selected="selectUcSecType" ref="nowUcSecTypeDOM" @change="updataSecType"/>
                        <MDBCol col="12" class="mb-2">
                          <MDBTextarea v-if="nowUcModule.uc.data" size="sm" label="comment" rows="2" v-model="nowUcModule.uc.data[nowUcSection].comment"/>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBCol>
                  <MDBCol md="6" class="h-100">
                    <!-- Item內容 -->
                    <MDBCol col="12" class="mt-2">
                      目前Item：{{nowUcItem}}
                    </MDBCol>
                    <MDBCol col="12" class="mb-2">
                      <MDBRow>
                        <MDBCol col="8" class="my-2">
                          <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="name" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].name"/>
                        </MDBCol>
                        <MDBSelect v-if="nowUcModule.uc.data" size="sm" class="mb-2 col-8" label="變動時機" v-model:options="nowFrequencyMU"
                          v-model:selected="selectFrequency" ref="nowFrequencyDOM" @change="updataFr"/>
                      </MDBRow>
                    </MDBCol>
                  </MDBCol>
                </MDBRow>
                <!-- 右下 -->
                <MDBRow style="height: calc(100% - 11em);" class="">
                  <MDBCol md="12" style="height: calc(50%);" class="border-1 border-top overflow-auto">
                    <MDBCol col="12" class="mt-2 px-2 py-1 rounded-5 d-flex justify-content-between" style="background-color: rgb(224, 224, 224);">
                      <div>
                        Item列表
                        <MDBBtn :disabled="selectUcModuleName===''" size="sm" color="primary" @click="testUcBtn">
                          <i class="fas fa-calculator">試算</i>
                        </MDBBtn>
                      </div>
                      <div>
                        <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="addItem"><i class="fas fa-plus"></i></MDBBtn>
                        <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="delItem"><i class="fas fa-minus"></i></MDBBtn>
                      </div>
                    </MDBCol>
                    <MDBCol col="12" class="">
                      <MDBRow>
                        <MDBCol md="12" class="mb-2">
                          <vueDataTable :data="data2" :columns="columns2" :options="tboption2" ref="table2"
                            style="font-size: smaller" class="border border-1 border-secondary display w-100 compact" />
                        </MDBCol>
                        <MDBCol md="12" class="mb-2">
                          組合不確定度：{{combUx}}  組合自由度：{{combFr}}
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBCol>
                  <MDBCol md="12" style="height: calc(50%);" class="border-1 border-top overflow-auto">
                    <MDBRow class="h-100 overflow-auto">
                      <!-- 不確定度 -->
                      <MDBCol col="4">
                        <MDBRow class="p-2">
                          <MDBCol col="12" class="py-1 border border-2 rounded-top-5 border-success d-flex justify-content-between">
                            <div>ux不確定度</div>
                            <div>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="addUx"><i class="fas fa-plus"></i></MDBBtn>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="delUx"><i class="fas fa-minus"></i></MDBBtn>
                            </div>
                          </MDBCol>
                          <MDBCol col="12" class="border-start border-end border-bottom border-2 rounded-bottom-5 border-success">
                            <MDBRow>
                              <MDBCol md="12" class="mb-3">
                                <vueDataTable :data="data3" :columns="columns3" :options="tboption3" ref="table3"
                                  style="font-size: smaller;" class="border border-1 display w-100 compact"/>
                              </MDBCol>
                              <MDBCol col="12" class="mb-2">
                                <div class="d-flex justify-content-between">
                                  <div>
                                    <MDBBtn style="margin: 0;padding: 0.375rem;" :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(3)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                                  </div>
                                  <div class="mx-1">
                                    <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].x_title[nowUcItemX]" @keyup="getItemData"/>
                                  </div>
                                  <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].x[nowUcItemX]" @keyup="getItemData"/>
                                </div>
                              </MDBCol>
                              <div class="px-2 mb-2">
                                <div class="bl_t bl_b bl_c_grey" style="height: 0.25rem;"></div>
                              </div>
                              <MDBCol col="12" class="mb-3">
                                <MDBTextarea v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="ux計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].ux"/>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <!-- 靈敏係數 -->
                      <MDBCol col="4">
                        <MDBRow class="p-2">
                          <MDBCol col="12" class="py-1 border border-2 rounded-top-5 border-success d-flex justify-content-between">
                            <div>靈敏係數</div>
                            <div>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="addFa"><i class="fas fa-plus"></i></MDBBtn>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="delFa"><i class="fas fa-minus"></i></MDBBtn>
                            </div>
                          </MDBCol>
                          <MDBCol col="12" class="border-start border-end border-bottom border-2 rounded-bottom-5 border-success">
                            <MDBRow>
                              <MDBCol md="12" class="mb-3">
                                <vueDataTable :data="data5" :columns="columns5" :options="tboption5" ref="table5"
                                  style="font-size: smaller" class="border border-1 display w-100 compact" />
                              </MDBCol>
                              <MDBCol col="12" class="mb-2">
                                <div class="d-flex justify-content-between">
                                  <div>
                                    <MDBBtn style="margin: 0;padding: 0.375rem;" :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(5)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                                  </div>
                                  <div class="mx-1">
                                    <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fa_title[nowUcItemFa]" @keyup="getItemData"/>
                                  </div>
                                  <div>
                                    <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fa[nowUcItemFa]" @keyup="getItemData"/>
                                  </div>
                                </div>
                              </MDBCol>
                              <div class="px-2 mb-2">
                                <div class="bl_t bl_b bl_c_grey" style="height: 0.25rem;"></div>
                              </div>
                              <MDBCol col="12" class="mb-3">
                                <MDBTextarea v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="factor計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].factor"/>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <!-- 自由度 -->
                      <MDBCol col="4">
                        <MDBRow class="p-2">
                          <MDBCol col="12" class="py-1 border border-2 rounded-top-5 border-success d-flex justify-content-between">
                            <div>自由度</div>
                            <div>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="addFr"><i class="fas fa-plus"></i></MDBBtn>
                              <MDBBtn size="sm" color="primary" floating style="background-color: rgb(172, 43, 172);" @click="delFr"><i class="fas fa-minus"></i></MDBBtn>
                            </div>
                          </MDBCol>
                          <MDBCol col="12" class="border-start border-end border-bottom border-2 rounded-bottom-5 border-success">
                            <MDBRow>
                              <MDBCol md="12" class="mb-3">
                                <vueDataTable :data="data4" :columns="columns4" :options="tboption4" ref="table4"
                                  style="font-size: smaller" class="border border-1 display w-100 compact" />
                              </MDBCol>
                              <MDBCol col="12" class="mb-2">
                                <div class="d-flex justify-content-between">
                                  <div>
                                    <MDBBtn style="margin: 0;padding: 0.375rem;" :disabled="!rGroup[1]" size="sm" color="primary" class="addParamBtn" @click="addParam(4)"><i class="fas fa-angle-double-down"></i></MDBBtn>
                                  </div>
                                  <div class="mx-1">
                                    <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="名稱" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fr_title[nowUcItemFr]" @keyup="getItemData"/>
                                  </div>
                                  <div col="6" class="mb-0">
                                    <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="值" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].fr[nowUcItemFr]" @keyup="getItemData"/>
                                  </div>
                                </div>
                              </MDBCol>
                              <div class="px-2 mb-2">
                                <div class="bl_t bl_b bl_c_grey" style="height: 0.25rem;"></div>
                              </div>
                              <MDBCol col="12" class="mb-3">
                                <MDBTextarea v-if="nowUcModule.uc.data" size="sm" class="text-primary" label="freedom計算公式" rows="2" v-model="nowUcModule.uc.data[nowUcSection].data[nowUcItem].freedom"/>
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
        </MDBRow>
      </div>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" :activeColor="msgColor" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.addParamBtn{
  width: 100%;
  line-height: 0.5;
}
td.details-control {
  text-align:center;
  color:forestgreen;
  cursor: pointer;
}
tr.shown td.details-control {
  text-align:center; 
  color:red;
}
/* 框線 */
.bl_all{
  border: 1px solid;
}
.bl_t{
  border-top: 1px solid;
}
.bl_b{
  border-bottom: 1px solid;
}
.bl_l{
  border-left: 1px solid;
}
.bl_r{
  border-right: 1px solid;
}
.bl_t_2{
  border-top: 1.5px solid;
}
.bl_b_2{
  border-bottom: 5px solid;
}
.bl_l_2{
  border-left: 5px solid;
}
.bl_r_2{
  border-right: 5px solid;
}
.bl_t_doble{
  border-top: 5px double;
}
.bl_b_doble{
  border-bottom: 5px double;
}
.bl_l_doble{
  border-left: 5px double;
}
.bl_r_doble{
  border-right: 5px double;
}
.bl_c_grey{
  border-color: rgb(209, 209, 209);
}
</style>