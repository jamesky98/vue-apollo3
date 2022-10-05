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
  MDBLightbox,
  MDBLightboxItem,
} from 'mdb-vue-ui-kit';
import GcpGQL from "../graphql/Gcp";

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
const nowGcpSimageDL = computed(()=>{
  return "04_GCP/Pt/" + nowGcpSimage.value
});

const nowGcpComment = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  return "04_GCP/Pt/" + nowGcpDespImg.value
});

const nowGcpDespStr = ref("");

const nowGcpContactId = ref("");
const nowGcpContactMU = ref([]);
const nowGcpContactDOM = ref();

const nowGcpContactAds = ref("");
const nowGcpContactPrs = ref("");
const nowGcpContactTel = ref("");
const nowGcpContactCom = ref("");

const nowPRecordId = ref("");
const nowPRecordPtId = ref("");
const nowPRecordPrjId = ref("");
const nowPRecordPrjIdMU = ref([]);
const nowPRecordPrjIdDOM = ref();

const nowPRecordDate = ref("");
const nowPRecordDateDOM = ref();

const nowPRecordPerson = ref("");
const nowPRecordPersonMU = ref([]);
const nowPRecordPersonDOM = ref();

const nowPRecordPtStatus = ref("");
const nowPRecordPtStatusMU = ref([]);
const nowPRecordPtStatusDOM = ref();

const nowPRecordE = ref("");
const nowPRecordN = ref("");
const nowPRecordh = ref("");
const nowPRecordCoor = computed(()=>{
  if(nowPRecordE.value && nowPRecordN.value && nowPRecordh.value){
    return parseFloat(nowPRecordE.value).toFixed(3) + "," + parseFloat(nowPRecordN.value).toFixed(3) + "," + parseFloat(nowPRecordh.value).toFixed(3);
  }else{
    return ""
  }
});

const nowPRecordCom = ref("");

const nowPRecordImg0 = ref("");
const nowPRecordImg0DL = computed(()=>{
  return "04_GCP/" + nowPRecordPrjId.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  return "04_GCP/" + nowPRecordPrjId.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  return "04_GCP/" + nowPRecordPrjId.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  return "04_GCP/" + nowPRecordPrjId.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value
});


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

const { onResult: getRcordByPId, refetch: refgetRcordByPId } = useQuery(
  GcpGQL.GETRECORDBYPID,
  ()=>({gcpId:""})
);
getRcordByPId(result=>{
  if(!result.loading){
    console.log(result.data.getGcpRecordsByGCPId);
  }
});


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
        <MDBCol md="6" xl="9" class="h-100">
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
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="作業編號" v-model:options="selPrjCodeMU"
                                v-model:selected="selPrjCode" ref="selPrjCodeDOM" />
                              <div></div>
                              <MDBCol xl="6" class="mt-2">
                                <MDBInput size="sm" type="text" label="點號" v-model="selGcpId" />
                              </MDBCol>
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="啟用狀態" v-model:options="selGcpEnableMU"
                                v-model:selected="selGcpEnable" ref="selGcpEnableDOM" />
                              <div></div>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="點位狀態" v-model:options="selGcpStatusMU"
                                v-model:selected="selGcpStatus" ref="selGcpStatusDOM" />
                                <div></div>
                              <MDBSelect size="sm" class="mt-2 col-xl-6" label="聯絡機關" v-model:options="selGcpContactMU"
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
                              <MDBCol xl="6">
                                <MDBRow>
                                  <MDBCol xl="6" class="mt-2">
                                    <MDBSwitch label="啟用" labelClass="fs-6" v-model="nowGcpEnable" />
                                  </MDBCol>
                                  <MDBCol xl="6" class="mt-2">
                                    <MDBInput size="sm" type="text" label="點號" v-model="nowGcpId" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="類別" v-model:options="nowGcpTypeCodeMU"
                                    v-model:selected="nowGcpTypeCode" ref="nowGcpTypeCodeDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-12" label="周圍舖面" v-model:options="nowGcpPavementMU"
                                    v-model:selected="nowGcpPavement" ref="nowGcpPavementDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-xl-6" label="土地產權" v-model:options="nowGcpOwnerShipMU"
                                    v-model:selected="nowGcpOwnerShip" ref="nowGcpOwnerShipDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-xl-6" label="標心樣式" v-model:options="nowGcpStyleMU"
                                    v-model:selected="nowGcpStyle" ref="nowGcpStyleDOM" />
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設機關" v-model="nowGcpEstablishment" />
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="測設年月" v-model="nowGcpEstDate" />
                                  </MDBCol>
                                  
                                </MDBRow>
                              </MDBCol>
                              <!-- 右方略圖 -->
                              <MDBCol xl="6">
                                <MDBRow>
                                  <MDBCol class="text-center mx-2 mt-2">
                                    <MDBLightbox zoomLevel="0.25">
                                      <MDBLightboxItem 
                                        :src="'04_GCP/Pt/' + nowGcpSimage" 
                                        :fullScreenSrc="'04_GCP/Pt/' + nowGcpSimage" 
                                        alt="航拍略圖" 
                                        class="img-thumbnail lightboxImg" />
                                    </MDBLightbox>
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
                                    <MDBBtn size="sm" color="primary" @click="uploadBtn('GcpSimage')">上傳</MDBBtn>
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
                          <!-- 點之記 -->
                          <MDBTabPane tabId="description" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <!-- 左圖 -->
                              <MDBCol xl="6" class="h-100">
                                <MDBRow class="h-100 align-content-start">
                                  <MDBCol class="text-center mx-2 mt-2 p-0" style="height: calc(100% - 6rem);">
                                    <MDBLightbox zoomLevel="0.25" class="h-100">
                                      <MDBLightboxItem 
                                        :src="'04_GCP/Pt/' + nowGcpDespImg" 
                                        :fullScreenSrc="'04_GCP/Pt/' + nowGcpDespImg" 
                                        alt="點之記略圖" 
                                        class="img-thumbnail lightboxImg" />
                                    </MDBLightbox>
                                  </MDBCol>
                                  <div></div>
                                  <!-- 點之記略圖 -->
                                  <MDBCol col="12" class="mt-2">
                                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                      label="點之記略圖" v-model="nowGcpDespImg">
                                      <MDBBtnClose @click.prevent="nowGcpDespImg = ''"
                                        class="btn-upload-close" />
                                    </MDBInput>
                                  </MDBCol>
                                  <MDBCol col="12" class="mt-2">
                                    <MDBBtn size="sm" color="primary" @click="uploadBtn('GcpDespImg')">上傳</MDBBtn>
                                    <MDBBtn tag="a" :href="nowGcpDespImgDL" download size="sm" color="secondary">下載</MDBBtn>
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                              <!-- 右文 -->
                              <MDBCol xl="6" class="h-100">
                                <MDBRow class="h-100">
                                  <MDBCol col="12" class="h-100">
                                    <MDBTextarea size="sm" class="my-2" label="點之記說明" rows="13" v-model="nowGcpDespStr" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 聯絡資訊 -->
                          <MDBTabPane tabId="contact" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <MDBSelect size="sm" class="mt-2 col-12" label="機關名稱" v-model:options="nowGcpContactMU"
                                v-model:selected="nowGcpContactId" ref="nowGcpContactDOM" />
                              <MDBCol xl="12" class="mt-2">
                                <MDBInput size="sm" type="text" label="地址" v-model="nowGcpContactAds" />
                              </MDBCol>
                              <MDBCol xl="8" class="mt-2">
                                <MDBInput size="sm" type="text" label="聯絡對象" v-model="nowGcpContactPrs" />
                              </MDBCol>
                              <MDBCol xl="8" class="mt-2">
                                <MDBInput size="sm" type="text" label="聯絡電話" v-model="nowGcpContactTel" />
                              </MDBCol>
                              <MDBCol col="12" class="mt-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowGcpContactCom" />
                              </MDBCol>
                            </MDBRow>
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
                        <MDBTabContent style="height: calc(100% - 3rem);">
                          <!-- 清查資料 -->
                          <MDBTabPane tabId="ptRecord" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBRow class="overflow-auto align-content-start" style="height: calc(100% - 3rem);">
                              <MDBCol xl="6">
                                <MDBRow>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="索引" v-model="nowPRecordId" />
                                  </MDBCol>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="點號" v-model="nowPRecordPtId" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="作業編號" v-model:options="nowPRecordPrjIdMU"
                                    v-model:selected="nowPRecordPrjId" ref="nowPRecordPrjIdDOM" />
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBDatepicker size="sm" v-model="nowPRecordDate" format=" YYYY-MM-DD " label="紀錄日期"
                                      ref="nowPRecordDateDOM" />
                                  </MDBCol>
                                  <MDBSelect size="sm" class="mt-2 col-12" label="作業人員" v-model:options="nowPRecordPersonMU"
                                    v-model:selected="nowPRecordPerson" ref="nowPRecordPersonDOM" />
                                  <MDBSelect size="sm" class="mt-2 col-12" label="點位狀況" v-model:options="nowPRecordPtStatusMU"
                                    v-model:selected="nowPRecordPtStatus" ref="nowPRecordPtStatusDOM" />
                                </MDBRow>
                              </MDBCol>
                              <MDBCol xl="6">
                                <MDBRow>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="E坐標" v-model="nowPRecordE" />
                                  </MDBCol>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="N坐標" v-model="nowPRecordN" />
                                  </MDBCol>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" label="h坐標" v-model="nowPRecordh" />
                                  </MDBCol>
                                  <MDBCol xl="12" class="mt-2">
                                    <MDBInput size="sm" type="text" v-model="nowPRecordCoor" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                              <MDBCol col="12" class="mt-2">
                                <MDBTextarea size="sm" label="備註" rows="2" v-model="nowPRecordCom" />
                              </MDBCol>
                            </MDBRow>
                          </MDBTabPane>
                          <!-- 照片資料 -->
                          <MDBTabPane tabId="images" class="h-100">
                            <MDBRow>
                              <MDBCol col="12" class="py-2 border-bottom">
                                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
                                <MDBBtn size="sm" color="primary" @click="">刪除</MDBBtn>
                              </MDBCol>
                            </MDBRow>
                            <MDBLightbox zoomLevel="0.25" style="height: calc(100% - 3rem);">
                              <MDBRow class="overflow-auto align-content-start h-100">
                                
                                  <!-- 近照 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0" style="height: 10rem;">
                                          <MDBLightboxItem 
                                            :src="'04_GCP/' + nowPRecordPrjId + '/pic/' + nowPRecordPtId + '/' + nowPRecordImg0" 
                                            alt="近照" 
                                            class="img-thumbnail lightboxImg" />
                                      </MDBCol>
                                      <div></div>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                          label="近照" v-model="nowPRecordImg0">
                                          <MDBBtnClose @click.prevent="nowPRecordImg0 = ''"
                                            class="btn-upload-close" />
                                        </MDBInput>
                                      </MDBCol>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBBtn size="sm" color="primary" @click="uploadBtn('PRecordImg0')">上傳</MDBBtn>
                                        <MDBBtn tag="a" :href="nowPRecordImg0DL" download size="sm" color="secondary">下載</MDBBtn>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                                  <!-- 遠照1 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0" style="height: 10rem;">
                                          <MDBLightboxItem 
                                            :src="'04_GCP/' + nowPRecordPrjId + '/pic/' + nowPRecordPtId + '/' + nowPRecordImg1" 
                                            alt="遠照1" 
                                            class="img-thumbnail lightboxImg" />
                                      </MDBCol>
                                      <div></div>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                          label="遠照1" v-model="nowPRecordImg1">
                                          <MDBBtnClose @click.prevent="nowPRecordImg1 = ''"
                                            class="btn-upload-close" />
                                        </MDBInput>
                                      </MDBCol>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBBtn size="sm" color="primary" @click="uploadBtn('PRecordImg1')">上傳</MDBBtn>
                                        <MDBBtn tag="a" :href="nowPRecordImg1DL" download size="sm" color="secondary">下載</MDBBtn>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                                  <!-- 遠照2 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0" style="height: 10rem;">
                                          <MDBLightboxItem 
                                            :src="'04_GCP/' + nowPRecordPrjId + '/pic/' + nowPRecordPtId + '/' + nowPRecordImg2" 
                                            alt="遠照2" 
                                            class="img-thumbnail lightboxImg" />
                                      </MDBCol>
                                      <div></div>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                          label="遠照2" v-model="nowPRecordImg2">
                                          <MDBBtnClose @click.prevent="nowPRecordImg2 = ''"
                                            class="btn-upload-close" />
                                        </MDBInput>
                                      </MDBCol>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBBtn size="sm" color="primary" @click="uploadBtn('PRecordImg3')">上傳</MDBBtn>
                                        <MDBBtn tag="a" :href="nowPRecordImg2DL" download size="sm" color="secondary">下載</MDBBtn>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                                  <!-- 遠照3 -->
                                  <MDBCol xl="6">
                                    <MDBRow>
                                      <MDBCol class="text-center mx-2 mt-2 p-0" style="height: 10rem;">
                                          <MDBLightboxItem 
                                            :src="'04_GCP/' + nowPRecordPrjId + '/pic/' + nowPRecordPtId + '/' + nowPRecordImg3" 
                                            alt="遠照3" 
                                            class="img-thumbnail lightboxImg" />
                                      </MDBCol>
                                      <div></div>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                          label="遠照3" v-model="nowPRecordImg3">
                                          <MDBBtnClose @click.prevent="nowPRecordImg3 = ''"
                                            class="btn-upload-close" />
                                        </MDBInput>
                                      </MDBCol>
                                      <MDBCol col="12" class="mt-2">
                                        <MDBBtn size="sm" color="primary" @click="uploadBtn('PRecordImg3')">上傳</MDBBtn>
                                        <MDBBtn tag="a" :href="nowPRecordImg3DL" download size="sm" color="secondary">下載</MDBBtn>
                                      </MDBCol>
                                    </MDBRow>
                                  </MDBCol>

                              </MDBRow>
                            </MDBLightbox>
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
        <MDBCol md="6" xl="3" class="h-100">
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
  height: 100%;
}
</style>