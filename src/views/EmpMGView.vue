<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path, { join } from "path-browserify";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBDatepicker,
  MDBTextarea,
  MDBTabs,
  MDBTabNav,
  MDBTabItem,
  MDBTabContent,
  MDBTabPane,
  MDBBtnClose,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import EmpGQL from "../graphql/Employee";

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
  // rGroup[3]最低權限
  // rGroup[4]完全開放
  switch (myUserRole.value) {
    case 0:
      if (myUserName.value === nowEmpID.value) {
        result = [false, false, false, false, true];
      } else {
        result = [false, false, false, false, false];
      }
      break;
    case 1:
      if (myUserName.value === nowEmpID.value) {
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
  return result;
});
// 取得權限==========End

// Information
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const NavItem = ref("employee");
provide("NavItem", NavItem);
const updateKey = ref(0);
const activeTabId1 = ref('train');

// 人員詳細編輯資料==========start
const nowEmpID = ref("");
const nowEmpLabID = ref("");
const nowEmpModifyDate = ref("");
const nowEmpName = ref("");
const nowEmpIDNumber = ref("");
const nowEmpBirthday = ref("");
const nowEmpBirthdayDOM = ref();

const nowEmpJobTitle = ref("");
const nowEmpAppDate = ref("");
const nowEmpAppDateDOM = ref();

const nowEmpResDate = ref("");
const nowEmpResDateDOM = ref();

const nowEmpAddress = ref("");
const nowEmpTel = ref("");
const nowEmpMobile = ref("");
const nowEmpEmail = ref("");
const nowEmpEducation = ref("");
const nowEmpExperience = ref("");
const nowEmpComment = ref("");
// 人員詳細編輯資料==========End
// 訓練詳細編輯資料==========start
const nowTrainID = ref("");
const nowTrainName = ref("");
const nowTrainEndDate = ref("");
const nowTrainInstitution = ref("");
const nowTrainCertiNo = ref("");
const nowTrainUpload = ref("");
const nowTrainUploadDL = computed(() => {
  if (nowTrainUpload.value && nowTrainUpload.value !== "") {
    return "05_Person/" + nowEmpID.value + "/" + nowTrainUpload.value;
  } else {
    return undefined;
  }
});
const nowTrainComment = ref("");
// 訓練詳細編輯資料==========End

// Table 人員列表==========Start
const { onResult: getAllEmp, refetch: refgetAllEmp } = useQuery(EmpGQL.GETALLEMP);
getAllEmp(result => {
  if (!result.loading && result.data.getAllEmp) {
    let getData = result.data.getAllEmp;
    data1.value = getData;
  }
});
refgetAllEmp();

const { onResult: getEmpbyID, refetch: refgetEmpbyID } = useQuery(
  EmpGQL.GETEMPBYID,
  () => ({
    personId: parseInt(nowEmpID.value),
  }));
getEmpbyID(result => {
  if (!result.loading && result.data.getEmpById) {
    let getData = result.data.getEmpById;
    // nowEmpID.value = getData.person_id;
    nowEmpLabID.value = getData.lab_ee_id;
    nowEmpModifyDate.value = getData.modify_date ? getData.modify_date.split("T")[0] : "";
    nowEmpName.value = getData.name;
    nowEmpIDNumber.value = getData.id_number;
    nowEmpBirthday.value = getData.birth_date ? getData.birth_date.split("T")[0] : "";
    nowEmpJobTitle.value = getData.job_title;
    nowEmpAppDate.value = getData.Appointment_date ? getData.Appointment_date.split("T")[0] : "";
    nowEmpResDate.value = getData.resignation_date ? getData.resignation_date.split("T")[0] : "";
    nowEmpAddress.value = getData.address;
    nowEmpTel.value = getData.tel;
    nowEmpMobile.value = getData.mobile;
    nowEmpEmail.value = getData.Email;
    nowEmpEducation.value = getData.education;
    nowEmpExperience.value = getData.experience;
    nowEmpComment.value = getData.comment;
  }
});

let dt1;
const table1 = ref();
const data1 = ref([]);
const columns1 = [
  { title: "員工編號", data: "person_id", defaultContent: "-", width: "100px" },
  { title: "姓名", data: "name", defaultContent: "-", width: "100px" },
  { title: "備註", data: "comment", defaultContent: "-" },
];
const tboption1 = {
  dom: 'tif',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'asc']],
  scrollY: 'calc(50vh - 10.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    nowEmpID.value = dt.rows(indexes).data()[0].person_id;
    refgetEmpbyID();
    refgetTrain();
  });

  dt_train = table_train.value.dt();
  dt_train.on('select', function (e, dt, type, indexes) {
    nowTrainID.value = dt.rows(indexes).data()[0].train_id;
    getTrainById();
  });
});

// 新增
function newEmpBtn(){
  nowEmpID.value = "";
  nowEmpLabID.value = "";
  nowEmpModifyDate.value = "";
  nowEmpName.value = "";
  nowEmpIDNumber.value = "";
  nowEmpBirthday.value = "";
  nowEmpBirthdayDOM.value.inputValue = "";
  nowEmpJobTitle.value = "";
  nowEmpAppDate.value = "";
  nowEmpAppDateDOM.value.inputValue = "";
  nowEmpResDateDOM.value.inputValue = "";
  nowEmpAddress.value = "";
  nowEmpTel.value = "";
  nowEmpMobile.value = "";
  nowEmpEmail.value = "";
  nowEmpEducation.value = "";
  nowEmpExperience.value = "";
  nowEmpComment.value = "";
}
// 更新
const {
  mutate: saveEmp,
  onDone: saveEmpOnDone,
  onError: saveEmpError,
} = useMutation(EmpGQL.UPDATEEMP, () => ({
  variables: {
    personId: parseInt(nowEmpID.value),
    labEeId: nowEmpLabID.value,
    name: nowEmpName.value,
    idNumber: nowEmpIDNumber.value,
    birthDate: (nowEmpBirthday.value==="")?null:nowEmpBirthday.value.trim() + "T00:00:00.000Z",
    jobTitle: nowEmpJobTitle.value,
    appointmentDate: (nowEmpAppDate.value==="")?null:nowEmpAppDate.value.trim() + "T00:00:00.000Z",
    resignationDate: (nowEmpResDate.value==="")?null:nowEmpResDate.value.trim() + "T00:00:00.000Z",
    address: nowEmpAddress.value,
    tel: nowEmpTel.value,
    mobile: nowEmpMobile.value,
    email: nowEmpEmail.value,
    education: nowEmpEducation.value,
    experience: nowEmpExperience.value,
    comment: nowEmpComment.value,
  },
}));
saveEmpOnDone(result=>{
  infomsg.value = result.data.updateEmp.person_id + " 儲存完畢";
  refgetAllEmp();
});
// 刪除
const {
  mutate: delEmp,
  onDone: delEmpOnDone,
  onError: delEmpError,
} = useMutation(EmpGQL.DELEMP, () => ({
  variables: {
    personId: parseInt(nowEmpID.value),
  },
}));
delEmpOnDone(result=>{
  infomsg.value = result.data.delEmp.person_id + "刪除完畢";
  newEmpBtn();
  refgetAllEmp();
});
// Table 人員列表==========End

// Table 訓練列表==========Start
const { onResult: getTrain, refetch: refgetTrain } = useQuery(
  EmpGQL.GETTRAIN,
  () => ({
    personId: parseInt(nowEmpID.value),
  }));
getTrain(result=>{
  if(!result.loading && result.data.getTrainByPerson){
    data_train.value = result.data.getTrainByPerson;
  }
});

const {
  mutate: getTrainById,
  onDone: getTrainByIdOnDone,
  onError: getTrainByIdError,
} = useMutation(EmpGQL.GETTRAINBYID, () => ({
  variables: {
    trainId: parseInt(nowTrainID.value),
  },
}));
getTrainByIdOnDone(result=>{
  let getData = result.data.getTrainByID;
  nowTrainName.value = getData.train_name;
  nowTrainEndDate.value = (getData.end_date)?getData.end_date.split("T")[0]:"";
  nowTrainInstitution.value = getData.train_institution
  nowTrainCertiNo.value = getData.Certificate_no
  nowTrainUpload.value = getData.upload
  nowTrainComment.value = getData.comment
});

let dt_train;
const table_train = ref();
const data_train = ref([]);
const columns_train = [
  { title: "索引", data: "train_id", defaultContent: "-"},
  { title: "訓練名稱", data: "train_name", defaultContent: "-"},
  { title: "結訓日期", data: "end_date", defaultContent: "-", render: (data) => {
    return toTWDate(data);} 
  },
  { title: "證書編號", data: "train_institution", defaultContent: "-"},
  { title: "開課單位", data: "Certificate_no", defaultContent: "-"},
  { title: "備註", data: "comment", defaultContent: "-" },
];
const tboption_train = {
  dom: 'tif',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'desc']],
  scrollY: 'calc(50vh - 14.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// Table 訓練列表==========End




// 檔案上傳==========Start
const uploadType = ref("");
function uploadBtn(inputId) {
  // 由按鈕啟動檔案選擇器
  uploadType.value = inputId;
  const inputDOM = document.getElementById("AllUpload");
  inputDOM.setAttribute("accept","");
  switch (inputId) {
    case "trainUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
  }
  inputDOM.click();
}
// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e) {
  upFile.value = e.target.files[0];
  let subpath = "05_Person/" + nowEmpID.value;
  let newName = "";
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "trainUpload":
      newName = nowTrainCertiNo.value + path.extname(e.target.value);
      break;
  }
  await uploadFile({
    file: upFile.value,
    subpath: subpath,
    newfilename: newName,
  });
}
// 上傳檔案
const { mutate: uploadFile, onDone: uploadFileOnDone } = useMutation(
  CaseGQL.UPLOADFILE
);
uploadFileOnDone((result) => {
  // 儲存(更新)上傳紀錄資料
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "trainUpload":
      nowTrainUpload.value = result.data.uploadFile.filename;
      // saveTrain();
      break;
  }
  let inputDOM;
  inputDOM = document.getElementById("AllUpload");
  inputDOM.value = "";
});

// 檔案上傳==========End

</script>
<template>
  <MDBContainer fluid class="h-100">
    <input type="file" id="AllUpload" @change="uploadChenge($event)" style="display: none" />
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 6.5em);" class="align-content-between">
        <MDBCol col="12" class="my-2 bg-light border border-5 rounded-8 shadow-4" style="height: calc(50% - 1em)">
          <MDBRow class="h-100">
            <MDBCol col="5" class="h-100 overflow-auto">
              <!-- 人員列表 -->
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBCol>
            <MDBCol col="7" class="h-100 border-start">
              <MDBRow class="h-100">
                <!-- 人員基本資料 -->
                <MDBCol col="12" class="mt-3 border-bottom">
                  <MDBBtn v-if="rGroup[0]" size="sm" color="primary" @click="newEmpBtn">
                    新增
                  </MDBBtn>
                  <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveEmp">
                    儲存
                  </MDBBtn>
                  <MDBBtn v-if="rGroup[0]" size="sm" color="primary" @click="delEmp">
                    刪除
                  </MDBBtn>
                </MDBCol>
                <MDBCol col="12" class="overflow-auto" style="height: calc(100% - 4rem);">
                  <MDBRow>
                    <MDBCol md="4" class="my-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="員工編號" v-model="nowEmpID" />
                    </MDBCol>
                    <MDBCol md="4" class="my-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="實驗室編號" v-model="nowEmpLabID" />
                    </MDBCol>
                    <MDBCol md="4" class="my-3">
                      <MDBInput disabled size="sm" type="text" label="更新日期" v-model="nowEmpModifyDate" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="姓名" v-model="nowEmpName" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="身分證字號"
                        v-model="nowEmpIDNumber" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBDatepicker required size="sm" v-model="nowEmpBirthday" format="YYYY-MM-DD" label="出生日"
                        ref="nowEmpBirthdayDOM" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="職稱" v-model="nowEmpJobTitle" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBDatepicker required size="sm" v-model="nowEmpAppDate" format="YYYY-MM-DD" label="到職日"
                        ref="nowEmpAppDateDOM" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBDatepicker required size="sm" v-model="nowEmpResDate" format="YYYY-MM-DD" label="解職日"
                        ref="nowEmpResDateDOM" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="電話" v-model="nowEmpTel" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="手機" v-model="nowEmpMobile" />
                    </MDBCol>
                    <MDBCol md="4" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="e-Mail"
                        v-model="nowEmpEmail" />
                    </MDBCol>
                    <MDBCol md="12" class="mb-3">
                      <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="住址" v-model="nowEmpAddress" />
                    </MDBCol>
                    <MDBCol md="12" class="mb-3">
                      <MDBTextarea :disabled="!rGroup[2]" size="sm" label="學歷" rows="2" v-model="nowEmpEducation" />
                    </MDBCol>
                    <MDBCol md="12" class="mb-3">
                      <MDBTextarea :disabled="!rGroup[2]" size="sm" label="經歷" rows="2" v-model="nowEmpExperience" />
                    </MDBCol>
                    <MDBCol md="12" class="mb-3">
                      <MDBTextarea :disabled="!rGroup[2]" size="sm" label="備註" rows="2" v-model="nowEmpComment" />
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol col="12" class="my-2 bg-light border border-5 rounded-8 shadow-4"
          style="height: calc(50% - 1em)">
          <MDBRow class="h-100">
            <MDBCol col="12" class="h-100">
              <MDBTabs v-model="activeTabId1">
                <MDBTabNav tabsClasses="">
                  <MDBTabItem tabId="train" href="train">訓練資料</MDBTabItem>
                  <MDBTabItem tabId="empower" href="train">授權資料</MDBTabItem>
                  <MDBTabItem tabId="optcase" href="train">校正案件</MDBTabItem>
                  <MDBTabItem tabId="signcase" href="train">簽署案件</MDBTabItem>
                </MDBTabNav>
                <MDBTabContent style="height: calc(100% - 4rem);">
                  <MDBTabPane tabId="train" class="h-100">
                    <MDBRow class="h-100">
                      <MDBCol md="6" class="h-100 border-top border-bottom overflow-auto">
                        <DataTable :data="data_train" :columns="columns_train" :options="tboption_train" ref="table_train" style="font-size: smaller"
                          class="display w-100 compact" />
                      </MDBCol>
                      <MDBCol md="6" class="h-100 border-top border-bottom border-start overflow-auto">
                        <MDBRow class="h-100 align-content-start">
                          <MDBCol md="4" class="my-3">
                            <MDBInput disabled required size="sm" type="text" label="索引" v-model="nowTrainID" />
                          </MDBCol>
                          <div></div>
                          <MDBCol md="12" class="mb-3">
                            <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="訓練名稱" v-model="nowTrainName" />
                          </MDBCol>
                          <MDBCol md="12" class="mb-3">
                            <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="開課單位" v-model="nowTrainInstitution" />
                          </MDBCol>
                          <MDBCol md="4" class="mb-3">
                            <MDBDatepicker required size="sm" v-model="nowTrainEndDate" format="YYYY-MM-DD" label="結訓日期"
                              ref="nowTrainEndDateDOM" />
                          </MDBCol>
                          <MDBCol md="12" class="mb-3">
                            <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="證書編號" v-model="nowTrainCertiNo" />
                          </MDBCol>
                          <!-- 證書上傳 -->
                          <MDBCol col="9" class="mb-3">
                            <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                              label="證書上傳" v-model="nowTrainUpload">
                              <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowTrainUpload = ''"
                                class="btn-upload-close" />
                            </MDBInput>
                          </MDBCol>
                          <MDBCol col="3" class="px-0 mb-3">
                            <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="uploadBtn('trainUpload')">
                              上傳</MDBBtn>
                            <MDBBtn tag="a" :href="nowTrainUploadDL" download size="sm" color="secondary">下載
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="12" class="mb-3">
                            <MDBTextarea :disabled="!rGroup[2]" size="sm" label="備註" rows="2" v-model="nowTrainComment" />
                          </MDBCol>
                        </MDBRow>
                          

                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
                  <MDBTabPane tabId="empower" class="h-100">授權</MDBTabPane>
                  <MDBTabPane tabId="optcase" class="h-100">校正</MDBTabPane>
                  <MDBTabPane tabId="signcase" class="h-100">簽署</MDBTabPane>
                </MDBTabContent>
              </MDBTabs>
            </MDBCol>
            <!-- <MDBCol col="6" class="h-100"></MDBCol>
            <MDBCol col="6" class="h-100 border-start"></MDBCol> -->
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

div.dataTables_filter {
  padding-top: 0.85em;
}

.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
</style>
