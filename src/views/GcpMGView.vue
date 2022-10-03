<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBSelect,
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
  MDBDatepicker,
  MDBTextarea,
  MDBBtnClose,
  MDBPopconfirm,
  MDBSwitch,
  MDBLightboxItem,
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
        result = [false,false,false,false,false];
      break;
    case 1:
        result = [false,false,false,false,false];
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
const NavItem = ref("gcps");
provide("NavItem",NavItem);
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");

const activeTabId1 = ref('filter');
const activeTabId2 = ref('ptRecord');

const selPrjCode = ref("");
const selPrjCodeMU = ref([]);
const selPrjCodeDOM = ref();

const selGcpId = ref("");

const selGcpEnable = ref("");
const selGcpEnableMU = ref([]);
const selGcpEnableDOM = ref();

const selGcpStatus = ref("");
const selGcpStatusMU = ref([]);
const selGcpStatusDOM = ref();

const selGcpContact = ref("");
const selGcpContactMU = ref([]);
const selGcpContactDOM = ref();

const nowGcpEnable = ref(true);
const nowGcpId = ref("");

const nowGcpTypeCode = ref("");
const nowGcpTypeCodeMU = ref([]);
const nowGcpTypeCodeDOM = ref();

const nowGcpOwnerShip = ref("");
const nowGcpOwnerShipMU = ref([]);
const nowGcpOwnerShipDOM = ref();

const nowGcpEstablishment = ref("");
const nowGcpEstDate = ref("");

const nowGcpPavement = ref("");
const nowGcpPavementMU = ref([]);
const nowGcpPavementDOM = ref();

const nowGcpStyle = ref("");
const nowGcpStyleMU = ref([]);
const nowGcpStyleDOM = ref();

const nowGcpSimage = ref("");
const nowGcpSimageDL = ref("");

const nowGcpComment = ref("");

// 參數==========End

// 點位基本列表==========Start
let dt_gcp;
const table_gcp = ref(); 
const data_gcp = ref([]);
const columns_gcp = [
  {title:"啟用", data:"gcp.enable"},
  {title:"點號", data:"gcp.id"},
  {title:"狀態", data:"gcp_record.status"},
  {title:"類別", data:"gcp.type_code"},
  {title:"作業編號", data:"gcp_record.ref_project.project_code"},
  {title:"作業方式", data:"gcp_record.ref_project.method"},
  {title:"清查日", data:"gcp_record.date"},
  {title:"清查人", data:"gcp_record.person"},
  {title:"需聯絡", data:"gcp.need_contact"},
];
const tboption_gcp = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  scrollY: 'calc(50vh - 12.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};



// 點位基本列表==========End

// 歷年量測列表==========Start
let dt_hist;
const table_hist = ref(); 
const data_hist = ref([]);
const columns_hist = [
  {title:"點號", data:"gcp.id"},
  {title:"狀態", data:"gcp_record.status"},
  {title:"作業編號", data:"gcp_record.ref_project.project_code"},
  {title:"作業方式", data:"gcp_record.ref_project.method"},
  {title:"辦理單位", data:"gcp_record.ref_project.organizer"},
  {title:"清查日", data:"gcp_record.date"},
  {title:"清查人", data:"gcp_record.person"},
  {title:"E坐標", data:"gcp_record.coor_E", className:"dt-body-right"},
  {title:"N坐標", data:"gcp_record.coor_N", className:"dt-body-right"},
  {title:"h坐標", data:"gcp_record.coor_h", className:"dt-body-right"},
];
const tboption_hist = {
  dom: 'fti',
  select: {style: 'single',info: false},
  order: [[1, 'asc']],
  scrollY: 'calc(50vh - 12.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};



// 歷年量測列表==========End




</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1/>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 6.5em);margin-left:0;margin-right:0;overflow-x:hidden;overflow-y:auto;" class="w-100">
        <!-- 左方列表 -->
        <MDBCol lg="9" class="h-100">
          <MDBRow class="h-100">
            <!-- 左上列表 -->
            <MDBCol col="12" style="height: 50%;">
              <MDBRow class="h-100">
                <MDBCol col="12" style="height: calc(100% - 1rem);" class="border border-5 rounded-8 shadow-4 my-2">
                  <MDBRow class="h-100 overflow-auto" style="position:relative ;">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto pt-2">
                      <DataTable :data="data_gcp" :columns="columns_gcp" :options="tboption_gcp" ref="table_gcp"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 分割右 -->
                    <MDBCol lg="5" class="h-100 border-start">
                      <MDBTabs v-model="activeTabId1">
                        <!-- Tabs navs -->
                        <MDBTabNav tabsClasses="">
                          <MDBTabItem tabId="filter" href="filter">篩選</MDBTabItem>
                          <MDBTabItem tabId="baseData" href="baseData">基本資料</MDBTabItem>
                          <MDBTabItem tabId="description" href="description">點之記</MDBTabItem>
                          <MDBTabItem tabId="contact" href="contact">聯絡資訊</MDBTabItem>
                        </MDBTabNav>
                        <MDBTabContent style="height: calc(100% - 3rem);">
                          <!-- 篩選 -->
                          <MDBTabPane tabId="filter" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">清除</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">篩選</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <MDBSelect size="sm" class="mt-2 col-md-6" label="作業編號" v-model:options="selPrjCodeMU"
                                v-model:selected="selPrjCode" ref="selPrjCodeDOM" />
                              <div></div>
                              <MDBCol md="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="點號" v-model="selGcpId" />
                              </MDBCol>
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-md-6" label="啟用狀態" v-model:options="selGcpEnableMU"
                                v-model:selected="selGcpEnable" ref="selGcpEnableDOM" />
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-md-6" label="點位狀態" v-model:options="selGcpStatusMU"
                                v-model:selected="selGcpStatus" ref="selGcpStatusDOM" />
                                <div></div>
                              <MDBSelect size="sm" class="mt-2 col-md-6" label="聯絡機關" v-model:options="selGcpContactMU"
                                v-model:selected="selGcpContact" ref="selGcpContactDOM" />
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 基本資料 -->
                          <MDBTabPane tabId="baseData" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <!-- 左方資料 -->
                              <MDBCol col="6">
                                <MDBRow>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBSwitch label="啟用" v-model="nowGcpEnable" />
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="點號" v-model="nowGcpId" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="類別" v-model:options="nowGcpTypeCodeMU"
                                    v-model:selected="nowGcpTypeCode" ref="nowGcpTypeCodeDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-12" label="土地產權" v-model:options="nowGcpOwnerShipMU"
                                    v-model:selected="nowGcpOwnerShip" ref="nowGcpOwnerShipDOM" />
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設機關" v-model="nowGcpEstablishment" />
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設年月" v-model="nowGcpEstDate" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="周圍舖面" v-model:options="nowGcpPavementMU"
                                    v-model:selected="nowGcpPavement" ref="nowGcpPavementDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-12" label="標心樣式" v-model:options="nowGcpStyleMU"
                                    v-model:selected="nowGcpStyle" ref="nowGcpStyleDOM" />
                                </MDBRow>
                              </MDBCol>
                              <!-- 右方略圖 -->
                              <MDBCol col="6">
                                <MDBRow>
                                  <MDBCol class="text-center mx-2 mt-2">
                                    <MDBLightboxItem :src="
                                      '04_GCP/' + nowGcpSimage
                                    " :fullScreenSrc="
                                      '04_GCP/' + nowGcpSimage
                                      " alt="航拍略圖" class="img-thumbnail lightboxImg" />
                                  </MDBCol>
                                  <div></div>
                                  <!-- 航拍略圖 -->
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                      label="航拍略圖" v-model="nowGcpSimage">
                                      <MDBBtnClose @click.prevent="nowGcpSimage = ''"
                                        class="btn-upload-close" />
                                    </MDBInput>
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBBtn size="sm" color="primary" @click="uploadBtn('Simage')">
                                      上傳</MDBBtn>
                                    <MDBBtn tag="a" :href="nowGcpSimageDL" download size="sm" color="secondary">下載</MDBBtn>
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                              <!-- 下方備註 -->
                              <MDBCol col="12" class="my-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowGcpComment" />
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <MDBTabPane tabId="description">

                          </MDBTabPane>
                          <MDBTabPane tabId="contact">

                          </MDBTabPane>
                        </MDBTabContent>



                      </MDBTabs>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 左下歷年列表 -->
            <MDBCol col="12" style="height: 50%;">
              <MDBRow class="h-100">
                <MDBCol col="12" class="border border-5 rounded-8 shadow-4 mb-2" style="height: calc(100% - 0.5rem)">
                  <MDBRow class="h-100" style="position:relative ;">
                    <!-- 分割左 -->
                    <MDBCol lg="7" class="h-100 overflow-auto pt-2">
                      <DataTable :data="data_hist" :columns="columns_hist" :options="tboption_hist" ref="table_hist"
                        style="font-size: smaller;" class="display w-100 compact" />
                    </MDBCol>
                    <!-- 分割右 -->
                    <MDBCol lg="5" class="h-100 border-start">
                      <MDBTabs v-model="activeTabId2">
                        <!-- Tabs navs -->
                        <MDBTabNav tabsClasses="">
                          <MDBTabItem tabId="ptRecord" href="ptRecord">清查資料</MDBTabItem>
                          <MDBTabItem tabId="images" href="images">照片</MDBTabItem>
                        </MDBTabNav>
                        <MDBTabContent>
                          <MDBTabPane tabId="ptRecord">

                          </MDBTabPane>
                          <MDBTabPane tabId="images">

                          </MDBTabPane>
                        </MDBTabContent>
                      </MDBTabs>

                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 右方列表 -->
        <MDBCol lg="3" class="h-100">
          <MDBRow style="margin-left: auto;height: calc(100% - 1rem);" class="my-2 bg-light border border-5 rounded-8 shadow-4">
            <MDBCol col="12" class="h-100">
              地圖

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

.nav-tabs .nav-link{
  padding: 0.75rem 1rem;
}
.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 200px;
}
</style>