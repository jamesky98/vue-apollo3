<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBSelect,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import CustGQL from "../graphql/Cust";
import ItemGQL from "../graphql/Item";

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

const rGroup =computed(()=>{
  let result=[];
  // rGroup[0]最高權限
  // rGroup[1]技術主管專用
  // rGroup[2]技術人員專用(非己不可改)
  // rGroup[3]最低權限
  // rGroup[4]完全開放
  switch (myUserRole.value){
    case 0:
      if(parseInt(myUserName.value)=== parseInt(nowUserName.value)){
        result = [false,false,false,false,true];
      }else{
        result = [false,false,false,false,false];
      }
      break;
    case 1:
      if(parseInt(myUserName.value)===parseInt(nowUserName.value)){
        result = [false,false,true,true,true];
      }else{
        result = [false,false,false,false,false];
      }
      break;
    case 2:
      result = [false,true,false,true,true];
      break;
    case 3:
      result = [true,true,true,true,true];
    break;
  }
  return result;
});
// 取得權限==========End

// 參數==========Start
// infomation
const NavItem = ref("cust");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");


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
const nowCustSelOrgIdMU = ref([]);
const nowCustSelOrgIdDOM = ref();

const nowItemId = ref("");
const nowItemType = ref("");
const nowItemTypeMU = ref([]);
const nowItemTypeDOM = ref();

const nowItemChop = ref("");
const nowItemModel = ref("");
const nowItemSN = ref("");

const selItemType = ref("");
const selItemTypeMU = ref([]);
const selItemTypeDOM = ref();

const selItemChop = ref("");
const selItemModel = ref("");
const selItemSN = ref("");

// 參數==========End

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
// 公司表格==========Start
const { onResult: getAllOrg, refetch: refgetAllOrg } = useQuery(CustGQL.GETALLORG);
getAllOrg(result=>{
  if (!result.loading && result.data.getAllOrg) {
    data_org.value = result.data.getAllOrg;
    // 填入機關下拉式清單
    nowCustSelOrgIdMU.value = result.data.getAllOrg.map(x => {
      return { text: x.name, value: parseInt(x.id) }
    }); nowCustSelOrgIdMU.value.unshift({ text: "", value: "" });
  }
});
refgetAllOrg();

let dt_org;
const table_org = ref(); 
const data_org = ref([]);
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
      updateOrgId: parseInt(nowCustOrgID.value),
      name: nowCustOrgName.value,
      taxId: nowCustOrgTaxId.value,
    }
  })
);
saveOrgOnDone(result=>{
  infomsg.value = "機關 " + result.data.updateOrg.id + " 儲存完畢";
  refgetAllOrg();
});


// 刪除機關資料
const { mutate: delOrg, onDone: delOrgOnDone, onError: delOrgError } = useMutation(
  CustGQL.DELORG,
  () => ({
    variables: {
      updateOrgId: parseInt(nowCustOrgID.value),
    }
  })
);
delOrgOnDone(result=>{
  infomsg.value = "機關 " + result.data.delOrg.id + " 刪除完成";
  refgetAllOrg();
});


// 公司表格==========End

// 聯絡人表格==========Start
const { onResult: getAllCust, refetch: refgetAllCust } = useQuery(CustGQL.GETALLCUST);
getAllCust(result=>{
  if (!result.loading && result.data.getAllCust) {
    data_cust.value = result.data.getAllCust;
  }
});
refgetAllCust();

const { onResult: getselCust, refetch: refgetselCust } = useQuery(CustGQL.GETCUSTBYID);
getselCust(result=>{
  if(!result.loading && result.data.getCustById){
    let getData = result.data.getCustById;
    nowCustName.value = getData.name;
    nowCustTel.value = getData.tel;
    nowCustFax.value = getData.fax;
    nowCustAddress.value = getData.address;
    nowCustSelOrgId.value = getData.org_id;
  }
});

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
  scrollY: 'calc(40vh - 11rem)',
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
  nowCustName.value = "";
  nowCustTel.value = "";
  nowCustFax.value = "";
  nowCustAddress.value = "";
  if(joinCust.value){
    nowCustSelOrgId.value = nowCustOrgID.value;
    nowCustSelOrgIdDOM.value.setValue(parseInt(nowCustOrgID.value));
  }else{
    nowCustSelOrgId.value = "";
    nowCustSelOrgIdDOM.value.setValue("");
  }
}

// 儲存顧客資料
const { mutate: saveCust, onDone: saveCustOnDone, onError: saveCustError } = useMutation(
  CustGQL.UPDATECUST,
  () => ({
    variables: {
      updateCustId: parseInt(nowCustId.value),
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

// 聯絡人表格==========End

// 校正件表格==========Start
const { onResult: getAllItem, refetch: refgetAllItem } = useQuery(ItemGQL.GETALLITEM);
getAllItem(result=>{
  if(!result.loading && result.data.getAllItem){
    data_Item.value = result.data.getAllItem;
  }
});
refgetAllItem();

const { onResult: getItemById, refetch: refgetItemById } = useQuery(ItemGQL.GETITEMBYID);
getItemById(result=>{
  if(!result.loading && result.data.getItemByID){
    let getData = result.data.getItemByID;
    nowItemId.value = getData.id;
    nowItemType.value = getData.type;
    nowItemTypeDOM.value.setValue(parseInt(nowItemType.value));
    nowItemChop.value = getData.chop;
    nowItemModel.value = getData.model;
    nowItemSN.value = getData.serial_number;
  }
});

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
        // 航測
        let mydate = Date.parse(row.case_base[i].case_record_01.complete_date);
        maxCalDate = (mydate > maxCalDate)?mydate:maxCalDate;
      }else if(row.case_base[i].case_record_02){
        // 光達
        let mydate = Date.parse(row.case_base[i].case_record_02.complete_date);
        maxCalDate = (mydate > maxCalDate)?mydate:maxCalDate;
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
        return "<span style='color: red;'>"+ maxCalDateStr + "</span>";
      }else{
        return "<span style='color: green;'>"+ maxCalDateStr + "</span>";
      }
    }
  }},
  {title:"廠牌", data:"chop"},
  {title:"型號", data:"model"},
  {title:"序號", data:"serial_number"},
];
const tboption_Item = {
  dom: 'fti',
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


function newItem(){

}
function saveItem(){

}
function delItem(){

}

// 校正件表格==========End









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
  });

  dt_cust = table_cust.value.dt();
  dt_cust.on('select', function (e, dt, type, indexes) {
    nowCustId.value = dt.rows(indexes).data()[0].id;
    refgetselCust({getCustByIdId: parseInt(nowCustId.value)});
  });

  dt_Item = table_Item.value.dt();
  dt_Item.on('select', function (e, dt, type, indexes) {
    nowItemId.value = dt.rows(indexes).data()[0].id;
    refgetItemById({getItemByIdId: parseInt(nowItemId.value)});
  });
});




</script>
<template>
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
                    <div style="position: absolute; top:0;left:0;">
                      顧客管理
                    </div>
                    <!-- 機關表格 -->
                    <MDBCol col="12" class="mt-2">
                      <DataTable :data="data_org" :columns="columns_org" :options="tboption_org" ref="table_org"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 機關操作表單 -->
                    <MDBCol col="12" class="border-top" style="height: 7rem;">
                      <MDBCol lg="12" class="mt-2">
                        <MDBBtn size="sm" color="primary" @click="newOrg">新增</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="saveOrg">儲存</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="delOrg">刪除</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="setJoinCust"><span :class="joinCustTextColor"><i :class="joinCustIcon"></i>聯絡人</span></MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="setJoinItem"><span :class="joinItemTextColor"><i :class="joinItemIcon"></i>校正件</span></MDBBtn>
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
                  <MDBRow class="h-100">
                    <!-- 左下左 -->
                    <MDBCol col="5" class="mt-2 overflow-auto" style="height: calc(100% - 0.5rem)">
                      <DataTable id="custTable" :data="data_cust" :columns="columns_cust" :options="tboption_cust" ref="table_cust"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 左下右 -->
                    <MDBCol col="7" class="h-100 border-start">
                      <MDBCol col="12" class="py-2 w-100 border-bottom overflow-auto" style="white-space: nowrap">
                        <MDBBtn size="sm" color="primary" @click="newCust">新增</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="saveCust">儲存</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="delCust">刪除</MDBBtn>
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
                          <MDBSelect filter size="sm" class="mt-3  col-12" label="機關名稱" v-model:options="nowCustSelOrgIdMU"
                            v-model:selected="nowCustSelOrgId" ref="nowCustSelOrgIdDOM" />
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
                          <MDBCol col="12">校正件管理</MDBCol>
                          <MDBCol col="12">
                            <DataTable :data="data_Item" :columns="columns_Item" :options="tboption_Item" ref="table_Item"
                              style="font-size: smaller;" class="display w-100 compact" />
                          </MDBCol>
                        </MDBCol>
                        <!-- 右資料 -->
                        <MDBCol lg="4" class="border-start">
                          <MDBRow class="h-100 d-flex align-content-start">
                            <!-- 右上篩選 -->
                            <MDBCol col="12" class="">
                              篩選設定
                            </MDBCol>
                            <MDBSelect size="sm" class="my-2 col-lg-8" label="儀器類型" v-model:options="selItemTypeMU"
                              v-model:selected="selItemType" ref="selItemTypeDOM" />

                            <MDBCol col="12" class="border-top">
                              資料編輯
                            </MDBCol>
                            <!-- 操作按鈕 -->
                            <MDBCol col="12" class="py-2 w-100 overflow-auto" style="white-space: nowrap">
                              <MDBBtn size="sm" color="primary" @click="newItem">新增</MDBBtn>
                              <MDBBtn size="sm" color="primary" @click="saveItem">儲存</MDBBtn>
                              <MDBBtn size="sm" color="primary" @click="delItem">刪除</MDBBtn>
                            </MDBCol>
                            <MDBCol col="12" class="" style="height: calc(100% - 10rem);">
                              <MDBRow class="h-100 d-flex align-content-start overflow-auto">
                                <MDBCol col="12" class="mt-2">
                                  <MDBInput readonly size="sm" type="text" label="索引" v-model="nowItemId" />
                                </MDBCol>
                                <MDBSelect size="sm" class="my-2 col-lg-12" label="儀器類型" v-model:options="nowItemTypeMU"
                                  v-model:selected="nowItemType" ref="nowItemTypeDOM" />
                                  <MDBCol col="12" class="mt-2">
                                  <MDBInput size="sm" type="text" label="廠牌" v-model="nowItemChop" />
                                </MDBCol>
                                <MDBCol col="12" class="mt-2">
                                  <MDBInput size="sm" type="text" label="型號" v-model="nowItemModel" />
                                </MDBCol>
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
                  <MDBRow class="h-100">
                    <MDBCol col="12">校正紀錄</MDBCol>

                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
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

#custTable div.dataTables_wrapper div.dataTables_filter input {
  width: 6rem;
}
</style>