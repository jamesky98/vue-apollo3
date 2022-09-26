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
} from 'mdb-vue-ui-kit';

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


// 公司表格
let dt_org;
const table_org = ref(); 
const data_org = ref([]);
const columns_org = [
  {title:"序號", data:"user_id",width:"2rem"},
  {title:"機關名稱", data:"user_name"},
  {title:"統一編號", data:"user_name2"},
];
const tboption_org = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  scrollY: 'calc(50vh - 15rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
};

const NavItem = ref("cust");
provide("NavItem",NavItem);

</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1/>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <!-- 左方列表 -->
        <MDBCol md="6" lg="4" class="h-100">
          <MDBRow class="h-100">
            <!-- 左上列表 -->
            <MDBCol col="12" style="height: 60%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100 overflow-auto">
                    <!-- 機關表格 -->
                    <MDBCol col="12" class="mt-2">
                      <DataTable :data="data_org" :columns="columns_org" :options="tboption_org" ref="table_org"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 機關操作表單 -->
                    <MDBCol col="12" class="border-top" style="height: 7rem;">
                      <MDBCol lg="12" class="mt-2">
                        <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                        <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                      </MDBCol>
                      <MDBCol lg="8" class="mt-2">
                        <MDBInput size="sm" type="text" label="機關名稱"/>
                      </MDBCol>
                      <div></div>
                      <MDBCol lg="8" class="mt-2">
                        <MDBInput size="sm" type="text" label="統一編號"/>
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
                
                
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 中間列表 -->
        <MDBCol md="6" lg="3" class="h-100">
          <MDBRow class="h-100" style="margin-left:0;margin-right:0">
            <MDBCol class="border border-5 rounded-8 shadow-4 my-2" style="height: calc(100% - 1rem)"></MDBCol>
            
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol md="12" lg="5" class="h-100">
          <MDBRow class="h-100">
            <MDBCol class="border border-5 rounded-8 shadow-4 my-2" style="height: calc(100% - 1rem)">

            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- 頁腳 -->
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
