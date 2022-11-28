<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide, inject } from "vue";
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
  MDBPopconfirm,
  MDBSelect,
  MDBAlert
} from 'mdb-vue-ui-kit';
import ToolsGQL from "../graphql/Tools";
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

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
getchecktoken();

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
      if (parseInt(myUserName.value) === parseInt(nowEmpID.value)) {
        result = [false, false, false, false, true];
      } else {
        result = [false, false, false, false, false];
      }
      break;
    case 1:
      if ( parseInt(myUserName.value) === parseInt(nowEmpID.value)) {
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
const publicPath = inject('publicPath');
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
const nowEmpResUpload = ref("");
const nowEmpResUploadDL = computed(() => {
  if (nowEmpResUpload.value && nowEmpResUpload.value !== "") {
    return publicPath.value + "05_Person/" + nowEmpID.value + "/resignation/" + nowEmpResUpload.value;
  } else {
    return undefined;
  }
});

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
const nowTrainPersonID = ref("");
const nowTrainName = ref("");
const nowTrainNameMU = ref([]);
const nowTrainNameDOM = ref();

const nowTrainEndDate = ref("");
const nowTrainEndDateDOM = ref();

const nowTrainInstitution = ref("");
const nowTrainInstitutionMU = ref([]);
const nowTrainInstitutionDOM = ref();

const nowTrainCertiNo = ref("");
const nowTrainUpload = ref("");
const nowTrainUploadDL = computed(() => {
  if (nowTrainUpload.value && nowTrainUpload.value !== "") {
    return publicPath.value + "05_Person/" + nowEmpID.value + "/Train/" + nowTrainUpload.value;
  } else {
    return undefined;
  }
});
const nowTrainComment = ref("");
// 訓練詳細編輯資料==========End

// 授權詳細編輯資料==========start
const nowEmpowerID = ref("");
const nowEmpowerPersonID = ref("");
const nowEmpowerCalTypeID = ref("");
const nowEmpowerCalTypeIdMU = ref([]);
const nowEmpowerCalTypeIdDOM = ref();

const nowEmpowerRole = ref("");
const nowEmpowerRoleMU = ref([]);
const nowEmpowerRoleDOM = ref();

const nowEmpowerAssResult = ref("");
const nowEmpowerAssID = ref("");
const nowEmpowerAssMU = ref([]);
const nowEmpowerAssDOM = ref();

const nowEmpowerAssDate = ref("");
const nowEmpowerAssDateDOM = ref();

const nowEmpowerSupID = ref("");
const nowEmpowerSupMU = ref([]);
const nowEmpowerSupDOM = ref();

const nowEmpowerDate = ref("");
const nowEmpowerDateDOM = ref();

const nowEmpowerSusDate = ref("");
const nowEmpowerSusDateDOM = ref();

const nowEmpowerTabUpload = ref("");
const nowEmpowerTabUploadDL = computed(() => {
  if (nowEmpowerTabUpload.value && nowEmpowerTabUpload.value !== "") {
    return publicPath.value + "05_Person/" + nowEmpID.value + "/Empower/" + nowEmpowerTabUpload.value;
  } else {
    return undefined;
  }
});
const nowEmpowerAprvUpload = ref("");
const nowEmpowerAprvUploadDL = computed(() => {
  if (nowEmpowerAprvUpload.value && nowEmpowerAprvUpload.value !== "") {
    return publicPath.value + "05_Person/" + nowEmpID.value + "/Empower/" + nowEmpowerAprvUpload.value;
  } else {
    return undefined;
  }
});
const nowEmpowerComment = ref("");

// 授權詳細編輯資料==========End

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
    // console.log(getData);
    nowEmpLabID.value = getData.lab_ee_id;
    nowEmpModifyDate.value = (getData.modify_date)?getData.modify_date.split("T")[0]:"";
    nowEmpName.value = getData.name;
    nowEmpIDNumber.value = getData.id_number;
    nowEmpBirthday.value = (getData.birth_date)?getData.birth_date.split("T")[0]:" ";
    nowEmpJobTitle.value = getData.job_title;
    if(getData.Appointment_date){
      nowEmpAppDate.value = getData.Appointment_date.split("T")[0];
    }else{
      nowEmpAppDate.value = " ";
      // nowEmpAppDateDOM.value.inputValue="";
    }
    if(getData.resignation_date){
      nowEmpResDate.value = getData.resignation_date.split("T")[0];
    }else{
      nowEmpResDate.value = " ";
      // nowEmpResDateDOM.value.inputValue="";
    }
    nowEmpResUpload.value = getData.resign_upload;
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
  { title: "實驗室編號", data: "lab_ee_id", defaultContent: "-", width: "100px" },
  { title: "員工編號", data: "person_id", defaultContent: "-", width: "100px" },
  { title: "姓名", data: "name", defaultContent: "-", width: "100px" },
  {
    data: "resignation_date", title: "解職日", className: 'dt-right', defaultContent: "-", render: (data) => {
      return toTWDate(data);
    }
  },
  { title: "備註", data: "comment", defaultContent: "-" },
];
const tboption1 = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
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

// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    nowEmpID.value = dt.rows(indexes).data()[0].person_id;
    refgetEmpbyID();
    refgetTrain();
    refgetEmpower();
    refgetOptCase({ operatorsId: parseInt(nowEmpID.value) });
    refgetSignCase({ signPersonId: parseInt(nowEmpID.value) });
    newTrainBtn();
    newEmpowerBtn();
  });

  dt_train = table_train.value.dt();
  dt_train.on('select', function (e, dt, type, indexes) {
    nowTrainID.value = dt.rows(indexes).data()[0].train_id;
    getTrainById();
  });

  dt_empower = table_empower.value.dt();
  dt_empower.on('select', function (e, dt, type, indexes) {
    nowEmpowerID.value = dt.rows(indexes).data()[0].empower_id;
    getEmpowerById();
  });
});

// 新增
function newEmpBtn(){
  nowEmpID.value = "";
  nowEmpLabID.value = "";
  nowEmpModifyDate.value = "";
  nowEmpName.value = "";
  nowEmpIDNumber.value = "";
  nowEmpBirthday.value = " ";
  nowEmpBirthdayDOM.value.inputValue = "";
  nowEmpJobTitle.value = "";
  nowEmpAppDate.value = " ";
  // nowEmpAppDateDOM.value.inputValue = "";
  nowEmpResDate.value = " ";
  // nowEmpResDateDOM.value.inputValue = "";
  nowEmpResUpload.value = "";
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
    birthDate: (nowEmpBirthday.value.trim()==="")?null:nowEmpBirthday.value.trim() + "T00:00:00.000Z",
    jobTitle: nowEmpJobTitle.value,
    appointmentDate: (nowEmpAppDate.value.trim()==="")?null:nowEmpAppDate.value.trim() + "T00:00:00.000Z",
    resignationDate: (nowEmpResDate.value.trim()==="")?null:nowEmpResDate.value.trim() + "T00:00:00.000Z",
    resignUpload: nowEmpResUpload.value,
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
  alert1.value = true;
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
  console.log(result);
  // infomsg.value = result.data.delEmp.person_id + "刪除完畢";
  // newEmpBtn();
  // refgetAllEmp();
});
delEmpError(e=>{
  if(e.message.indexOf('Foreign key constraint failed')!==-1){
    infomsg.value = '本資料不可變更，因含有其他連結資料，請刪除連結資料後再試';
    alert1.value = true;
  }
})
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
  nowTrainPersonID.value = getData.person_id
  nowTrainName.value = getData.train_name;
  nowTrainNameDOM.value.setValue(nowTrainName.value);

  // nowTrainEndDate.value = (getData.end_date)?getData.end_date.split("T")[0]:" ";
  if(getData.end_date){
    nowTrainEndDate.value = getData.end_date.split("T")[0];
  }else{
    nowTrainEndDate.value = " ";
    // nowTrainEndDateDOM.value.inputValue="";
  }
  nowTrainInstitution.value = getData.train_institution
  nowTrainInstitutionDOM.value.setValue(nowTrainInstitution.value);

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
  { title: "開課單位", data: "train_institution", defaultContent: "-"},
  { title: "證書編號", data: "Certificate_no", defaultContent: "-"},
  { title: "備註", data: "comment", defaultContent: "-" },
];
const tboption_train = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'desc']],
  scrollY: 'calc(50vh - 16.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};
// 訓練新增
function newTrainBtn(){
  nowTrainID.value = "";
  nowTrainPersonID.value = nowEmpID.value;
  nowTrainName.value = "";
  nowTrainNameDOM.value.setValue("");

  nowTrainEndDate.value = " ";
  // nowTrainEndDateDOM.value.inputValue = "";
  nowTrainInstitution.value = "";
  nowTrainInstitutionDOM.value.setValue("");

  nowTrainCertiNo.value = "";
  nowTrainUpload.value = "";
  nowTrainComment.value = "";
}
// 訓練儲存
const {
  mutate: newTrain,
  onDone: newTrainOnDone,
  onError: newTrainError,
} = useMutation(EmpGQL.CREATETRAIN, () => ({
  variables: {
    personId: parseInt(nowTrainPersonID.value),
    trainName: nowTrainName.value,
    endDate: (nowTrainEndDate.value.trim() === "")? null:nowTrainEndDate.value.trim() + "T00:00:00.000Z",
    trainInstitution: nowTrainInstitution.value,
    certificateNo: nowTrainCertiNo.value,
    upload: nowTrainUpload.value,
    comment: nowTrainComment.value,
  },
}));
newTrainOnDone(result=>{
  nowTrainID.value = result.data.createTrain.train_id;
  infomsg.value = "序號：" + nowTrainID.value + " 儲存完成"
  refgetTrain();
});

const {
  mutate: saveTrain,
  onDone: saveTrainOnDone,
  onError: saveTrainError,
} = useMutation(EmpGQL.UPDATETRAIN, () => ({
  variables: {
    trainId: parseInt(nowTrainID.value),
    personId: parseInt(nowTrainPersonID.value),
    trainName: nowTrainName.value,
    endDate: (nowTrainEndDate.value.trim() === "")? null:nowTrainEndDate.value.trim() + "T00:00:00.000Z",
    trainInstitution: nowTrainInstitution.value,
    certificateNo: nowTrainCertiNo.value,
    upload: nowTrainUpload.value,
    comment: nowTrainComment.value,
  },
}));
saveTrainOnDone(result=>{
  infomsg.value = "序號：" + result.data.updateTrain.train_id + " 儲存完成";
  refgetTrain();
});

function saveTrainBtn(){
  if(!nowTrainID.value || nowTrainID.value===''){
    // 無序號為新增
    newTrain();
  }else{
    // 有序號為儲存
    saveTrain();
  }
}

// 刪除訓練
const {
  mutate: delTrain,
  onDone: delTrainOnDone,
  onError: delTrainError,
} = useMutation(EmpGQL.DELTRAIN, () => ({
  variables: {
    trainId: parseInt(nowTrainID.value),
  },
}));
delTrainOnDone(result=>{
  infomsg.value = "序號：" + result.data.delTrain.train_id + " 已刪除";
  refgetTrain();
});

// 查詢訓練課程及開課單位清單
const { onResult: getAllTrain, refetch: refgetAllTrain } = useQuery(EmpGQL.GETALLTRAIN);
getAllTrain(result=>{
  if(!result.loading && result.data.getAllTrain){
    let trainList = [];
    let trainInstList = [];

    trainList = result.data.getAllTrain.map(x => { return x.train_name });//從物件陣列中取出成陣列
    trainList = [...new Set(trainList)]; //ES6排除重複值語法
    nowTrainNameMU.value = trainList.sort().map(x => {
      return { text: x, value: x }
    }); nowTrainNameMU.value.unshift({ text: "-未選擇-", value: "" });

    trainInstList = result.data.getAllTrain.map(x => { return x.train_institution });//從物件陣列中取出成陣列
    trainInstList = [...new Set(trainInstList)]; //ES6排除重複值語法
    nowTrainInstitutionMU.value = trainInstList.sort().map(x => {
      return { text: x, value: x }
    }); nowTrainInstitutionMU.value.unshift({ text: "-未選擇-", value: "" });

  }
});

function updateTrainName(){
  let newoption = nowTrainName.value;
  let findid = nowTrainNameMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowTrainNameMU.value.push({text: newoption, value: newoption})
    nowTrainNameDOM.value.setValue(newoption);
  }
}

function updateTrainInstitution(){
  let newoption = nowTrainInstitution.value;
  let findid = nowTrainInstitutionMU.value.findIndex(x => x.value===newoption);
  if(findid===-1){
    nowTrainInstitutionMU.value.push({text: newoption, value: newoption})
    nowTrainInstitutionDOM.value.setValue(newoption);
  }
}

// Table 訓練列表==========End

// Table 授權列表==========Start
const { onResult: getEmpower, refetch: refgetEmpower } = useQuery(
  EmpGQL.GETEMPOWER,
  () => ({
    personId: parseInt(nowEmpID.value),
  }));
getEmpower(result=>{
  if(!result.loading && result.data.getEmpowerByPerson){
    data_empower.value = result.data.getEmpowerByPerson;
  }
});

const {
  mutate: getEmpowerById,
  onDone: getEmpowerByIdOnDone,
  onError: getEmpowerByIdError,
} = useMutation(EmpGQL.GETEMPOWERBYID, () => ({
  variables: {
    empowerId: parseInt(nowEmpowerID.value),
  },
}));
getEmpowerByIdOnDone(result=>{
  let getData = result.data.getEmpowerByID;
  nowEmpowerPersonID.value = getData.person_id;
  nowEmpowerCalTypeID.value = getData.cal_type;
  nowEmpowerCalTypeIdDOM.value.setValue(nowEmpowerCalTypeID.value);

  nowEmpowerRole.value = getData.role_type;
  nowEmpowerRoleDOM.value.setValue(nowEmpowerRole.value);

  nowEmpowerAssResult.value = getData.assessment_result;
  nowEmpowerAssID.value = getData.assessor;
  nowEmpowerAssDOM.value.setValue(nowEmpowerAssID.value);

  if(getData.assessment_date){
    nowEmpowerAssDate.value = getData.assessment_date.split("T")[0];
  }else{
    nowEmpowerAssDate.value = " ";
    // nowEmpowerAssDateDOM.value.inputValue="";
  }
  nowEmpowerSupID.value = getData.lab_supervisor;
  nowEmpowerSupDOM.value.setValue(nowEmpowerSupID.value);

  if(getData.empower_date){
    nowEmpowerDate.value = getData.empower_date.split("T")[0];
  }else{
    nowEmpowerDate.value = " ";
    // nowEmpowerDateDOM.value.inputValue="";
  }
  if(getData.suspension_date){
    nowEmpowerSusDate.value = getData.suspension_date.split("T")[0];
  }else{
    nowEmpowerSusDate.value = " ";
    // nowEmpowerSusDateDOM.value.inputValue="";
  }
  nowEmpowerTabUpload.value = getData.table_upload;
  nowEmpowerAprvUpload.value = getData.approval_doc;
  nowEmpowerComment.value = getData.comment;
});

let dt_empower;
const table_empower = ref();
const data_empower = ref([]);
const columns_empower = [
  { title: "索引", data: "empower_id", defaultContent: "-"},
  { title: "校正項目", data: "cal_type_cal_typeToemployee_empower.name", defaultContent: "-"},
  { title: "職務", data: "role_type", defaultContent: "-"},
  { title: "授權日", data: "empower_date", defaultContent: "-", render: (data) => {
    return toTWDate(data);} 
  },
  { title: "停權日", data: "suspension_date", defaultContent: "-", render: (data) => {
    return toTWDate(data);} 
  },
  { title: "備註", data: "comment", defaultContent: "-" },
];
const tboption_empower = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'desc']],
  scrollY: 'calc(50vh - 16.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// 授權新增
function newEmpowerBtn(){
  nowEmpowerID.value = "";
  nowEmpowerPersonID.value = nowEmpID.value;
  nowEmpowerCalTypeID.value = "";
  nowEmpowerCalTypeIdDOM.value.setValue("");
  nowEmpowerRole.value = "";
  nowEmpowerRoleDOM.value.setValue("");
  nowEmpowerAssResult.value = "";
  nowEmpowerAssID.value = "";
  nowEmpowerAssDate.value = " ";
  // nowEmpowerAssDateDOM.value.inputValue = "";
  nowEmpowerSupID.value = "";
  nowEmpowerDate.value = " ";
  // nowEmpowerDateDOM.value.inputValue = "";
  nowEmpowerSusDate.value = " ";
  // nowEmpowerSusDateDOM.value.inputValue = "";
  nowEmpowerTabUpload.value = "";
  nowEmpowerAprvUpload.value = "";
  nowEmpowerComment.value = "";
}

// 授權儲存
const {
  mutate: newEmpower,
  onDone: newEmpowerOnDone,
  onError: newEmpowerError,
} = useMutation(EmpGQL.CREATEEMPOWER, () => ({
  variables: {
    personId: parseInt(nowEmpowerPersonID.value),
    calType: parseInt(nowEmpowerCalTypeID.value),
    roleType: nowEmpowerRole.value,
    assessmentResult: nowEmpowerAssResult.value,
    assessor: parseInt(nowEmpowerAssID.value),
    assessmentDate: (nowEmpowerAssDate.value.trim() === "")? null:nowEmpowerAssDate.value.trim() + "T00:00:00.000Z",
    labSupervisor: parseInt(nowEmpowerSupID.value),
    empowerDate: (nowEmpowerDate.value.trim() === "")? null:nowEmpowerDate.value.trim() + "T00:00:00.000Z",
    suspensionDate: (nowEmpowerSusDate.value.trim() === "")? null:nowEmpowerSusDate.value.trim() + "T00:00:00.000Z",
    tableUpload: nowEmpowerTabUpload.value,
    approvalDoc: nowEmpowerAprvUpload.value,
    comment: nowEmpowerComment.value,
  },
}));
newEmpowerOnDone(result=>{
  nowEmpowerID.value = result.data.createEmpower.empower_id;
  infomsg.value = "序號：" + nowEmpowerID.value + " 儲存完成"
  refgetEmpower();
});

const {
  mutate: saveEmpower,
  onDone: saveEmpowerOnDone,
  onError: saveEmpowerError,
} = useMutation(EmpGQL.UPDATEEMPOWER, () => ({
  variables: {
    empowerId: parseInt(nowEmpowerID.value),
    personId: parseInt(nowEmpowerPersonID.value),
    calType: parseInt(nowEmpowerCalTypeID.value),
    roleType: nowEmpowerRole.value,
    assessmentResult: nowEmpowerAssResult.value,
    assessor: parseInt(nowEmpowerAssID.value),
    assessmentDate: (nowEmpowerAssDate.value.trim() === "")? null:nowEmpowerAssDate.value.trim() + "T00:00:00.000Z",
    labSupervisor: parseInt(nowEmpowerSupID.value),
    empowerDate: (nowEmpowerDate.value.trim() === "")? null:nowEmpowerDate.value.trim() + "T00:00:00.000Z",
    suspensionDate: (nowEmpowerSusDate.value.trim() === "")? null:nowEmpowerSusDate.value.trim() + "T00:00:00.000Z",
    tableUpload: nowEmpowerTabUpload.value,
    approvalDoc: nowEmpowerAprvUpload.value,
    comment: nowEmpowerComment.value,
  },
}));
saveEmpowerOnDone(result=>{
  nowEmpowerID.value = result.data.updateEmpower.empower_id;
  infomsg.value = "序號：" + nowEmpowerID.value + " 儲存完成"
  refgetEmpower();
});
function saveEmpowerBtn(){
  if(!nowEmpowerID.value || nowEmpowerID.value===''){
    // 無序號為新增
    newEmpower();
  }else{
    // 有序號為儲存
    saveEmpower();
  }
}

// 刪除授權
const {
  mutate: delEmpower,
  onDone: delEmpowerOnDone,
  onError: delEmpowerError,
} = useMutation(EmpGQL.DELEMPOWER, () => ({
  variables: {
    empowerId: parseInt(nowEmpowerID.value),
  },
}));
delEmpowerOnDone(result=>{
  infomsg.value = "序號：" + result.data.delEmpower.empower_id + " 已刪除";
  refgetEmpower();
});
// Table 授權列表==========End


// Table 校正案件==========Start
const { onResult: getOptCase, refetch: refgetOptCase } = useQuery(
  CaseGQL.GETALLCASE,()=>({
    operatorsId: -1,
  })
);
getOptCase(result => {
  // 加入table1資料
  if (!result.loading) {
    data_optcase.value = result.data.getAllCase;
  }
});

let dt_optcase;
const table_optcase = ref();
const data_optcase = ref([]);
const columns_optcase = [
  { 
    data: "status_code", title: "狀態", defaultContent: "-", render: (data,type,row) => {
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
  { data: "cal_type_cal_typeTocase_base.code", title: "校正項目", defaultContent: "-", render: (data, type, row) => {
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
    return "<span class='"+ classn +"'>" + markicon + row.cal_type_cal_typeTocase_base.name + "</span>"
    }
  },
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
  { data: "agreement", title: "協議事項", defaultContent: "-" },
];
const tboption_optcase = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: 'calc(50vh - 16.5rem)',
  scrollX: true,
  // lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  },
};

// Table 校正案件==========End


// Table 簽署案件==========Start
const { onResult: getSignCase, refetch: refgetSignCase } = useQuery(
  CaseGQL.GETALLCASE,()=>({
    signPersonId: -1,
  })
);
getSignCase(result => {
  // 加入table1資料
  if (!result.loading) {
    data_signcase.value = result.data.getAllCase;
  }
});
let dt_signcase;
const table_signcase = ref();
const data_signcase = ref([]);
const columns_signcase = [
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
  { data: "cal_type_cal_typeTocase_base.code", title: "校正項目", defaultContent: "-", render: (data, type, row) => {
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
    data: "case_record_01.sign_person_id", title: "簽署人", defaultContent: "-", render: (data, type, row) => {
      if (data) {
        return data;
      } else if (row.case_record_02){
        return row.case_record_02.sign_person_id;
      }
    }
  },
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
const tboption_signcase = {
  dom: 'fti',
  select: {
    style: 'single',
    info: false
  },
  order: [[1, 'desc']],
  scrollY: 'calc(50vh - 16.5rem)',
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料',
  }
};

// Table 簽署案件==========End

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
    case "empowerUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
    case "empowerAprvUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
    case "resUpload":
      inputDOM.setAttribute("accept",".pdf");
      break;
  }
  inputDOM.click();
}
// 檔案選擇器選擇事件
const upFile = ref();
async function uploadChenge(e) {
  upFile.value = e.target.files[0];
  let subpath = "";
  let newName = "";
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "trainUpload":
      subpath = "05_Person/" + nowEmpID.value + "/Train";
      newName = nowTrainCertiNo.value + path.extname(e.target.value);
      break;
    case "empowerUpload":
      subpath = "05_Person/" + nowEmpID.value + "/Empower";
      newName = nowEmpID.value + "-" + nowEmpowerCalTypeID.value + "-" + nowEmpowerRole.value + "_評估表" + path.extname(e.target.value);
      break;
    case "empowerAprvUpload":
      subpath = "05_Person/" + nowEmpID.value + "/Empower";
      newName = nowEmpID.value + "-" + nowEmpowerCalTypeID.value + "-" + nowEmpowerRole.value + "_核准公文" + path.extname(e.target.value);
      break;
    case "resUpload":
      subpath = "05_Person/" + nowEmpID.value + "/resignation";
      newName = nowEmpID.value + "-解職證明_核准公文" + path.extname(e.target.value);
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
  ToolsGQL.UPLOADFILE
);
uploadFileOnDone((result) => {
  // 儲存(更新)上傳紀錄資料
  if (!uploadType.value) {
    return;
  }
  switch (uploadType.value) {
    case "trainUpload":
      nowTrainUpload.value = result.data.uploadFile.filename;
      saveTrain();
      break;
    case "empowerUpload":
      nowEmpowerTabUpload.value = result.data.uploadFile.filename;
      saveEmpower();
      break;
    case "empowerAprvUpload":
      nowEmpowerAprvUpload.value = result.data.uploadFile.filename;
      saveEmpower();
      break;
    case "resUpload":
      nowEmpResUpload.value = result.data.uploadFile.filename;
      saveEmp();
  }
  let inputDOM;
  inputDOM = document.getElementById("AllUpload");
  inputDOM.value = "";
});

// 檔案上傳==========End

// 查詢校正項目列表
const { onResult: getCaseCalType, refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);
getCaseCalType(result => {
  // 加入校正項目選單資料
  if (!result.loading && result.data.getCaseCalType) {
    nowEmpowerCalTypeIdMU.value = result.data.getCaseCalType.map(x => {
      return { text: x.name,secondaryText: x.code ,value: parseInt(x.id) }
    }); nowEmpowerCalTypeIdMU.value.unshift({ text: "", value: "" });
  }
});
refgetCaseCalType();

// 查詢職務列表
const { onResult: getEmpRole, refetch: refgetEmpRole } = useQuery(EmpGQL.GETEMPROLE);
getEmpRole(result => {
  // 加入校正項目選單資料
  if (!result.loading && result.data.getEmpRoleList) {
    nowEmpowerRoleMU.value = result.data.getEmpRoleList.map(x => {
      return { text: x.role_type, value: x.role_type }
    }); nowEmpowerRoleMU.value.unshift({ text: "", value: "" });
  }
});
refgetEmpRole();

// 頁籤切換更新表格標題寬度
function tabShown(e){
  let nowTab = e.target.getAttribute("aria-controls");
  switch (nowTab){
    case "train":
      dt_train = table_train.value.dt();
      dt_train.columns.adjust();
      break;
    case "empower":
      dt_empower = table_empower.value.dt();
      dt_empower.columns.adjust();
      break;
    case "optcase":
      dt_optcase = table_empower.value.dt();
      dt_optcase.columns.adjust();
      break;
    case "signcase":
      dt_signcase = table_empower.value.dt();
      dt_signcase.columns.adjust();
      break;
  }
}

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

// 查詢評估人員列表
const { onResult: getAssList, refetch: refgetAssList } = useQuery(
  EmpGQL.GETEMPOWERBYROLE,
  ()=>({roleType: '主管'})
);
getAssList(result => {
  // 加入評估人員選單資料
  if (!result.loading && result.data.getEmpowerbyRole) {
    let mylist = [];
    mylist = result.data.getEmpowerbyRole.map(x => { return {person_id:x.person_id,name: x.employee.name} });//從物件陣列中取出成陣列
    mylist = filterArrayforObj(mylist,"person_id");// 去除重複
    nowEmpowerAssMU.value = mylist.map(x => {
      return { text: x.name, value: x.person_id }
    }); nowEmpowerAssMU.value.unshift({ text: "", value: "" });
  }
});
refgetAssList();
// 查詢授權人員列表
const { onResult: getSupList, refetch: refgetSupList } = useQuery(
  EmpGQL.GETEMPOWERBYROLE,
  ()=>({roleType:'實驗室主管'})
);
getSupList(result => {
  // 加入評估人員選單資料
  if (!result.loading && result.data.getEmpowerbyRole) {
    let mylist = [];
    mylist = result.data.getEmpowerbyRole.map(x => { return {person_id:x.person_id,name: x.employee.name} });//從物件陣列中取出成陣列
    mylist = filterArrayforObj(mylist,"person_id");// 去除重複
    nowEmpowerSupMU.value = mylist.map(x => {
      return { text: x.name, value: x.person_id }
    }); nowEmpowerSupMU.value.unshift({ text: "", value: "" });
  }
});
refgetSupList();

</script>
<template>
  <MDBAlert v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    autohide :delay="2000.0">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100">
    <input type="file" id="AllUpload" @change="uploadChenge($event)" style="display: none" />
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 6.5em);" class="align-content-between">
        <!-- 上方 -->
        <MDBCol col="12" class="my-2 bg-light border border-5 rounded-8 shadow-4" style="height: calc(50% - 1em)">
          <MDBRow class="h-100 overflow-auto">
            <MDBCol md="5" class="h-100 overflow-auto">
              <!-- 人員列表 -->
              <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                class="display w-100 compact" />
            </MDBCol>
            <!-- 分割 -->
            <MDBCol md="7" class="h-100 border-start">
              <MDBRow class="h-100">
                <!-- 人員基本資料 -->
                <MDBCol col="12" class="mt-3 border-bottom">
                  <MDBBtn :disabled="nowEmpID===''" v-if="rGroup[0]" size="sm" color="primary" @click="newEmpBtn">
                    新增
                  </MDBBtn>
                  <MDBBtn :disabled="!rGroup[2]" size="sm" color="primary" @click="saveEmp">
                    儲存
                  </MDBBtn>
                  <MDBPopconfirm :disabled="!rGroup[2] || nowEmpID===''" class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                    message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delEmp">
                    刪除
                  </MDBPopconfirm>
                </MDBCol>
                <MDBCol col="12" class="overflow-auto" style="height: calc(100% - 4rem);">
                  <MDBRow>
                    <MDBCol xl="6">
                      <MDBRow>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="員工編號" v-model="nowEmpID" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="實驗室編號" v-model="nowEmpLabID" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput disabled size="sm" type="text" label="更新日期" v-model="nowEmpModifyDate" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="姓名" v-model="nowEmpName" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="身分證字號"
                            v-model="nowEmpIDNumber" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBDatepicker required size="sm" v-model="nowEmpBirthday" format="YYYY-MM-DD" label="出生日"
                            ref="nowEmpBirthdayDOM" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="職稱" v-model="nowEmpJobTitle" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBDatepicker required size="sm" v-model="nowEmpAppDate" format="YYYY-MM-DD" label="到職日"
                            ref="nowEmpAppDateDOM" />
                        </MDBCol>
                        <div></div>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="電話" v-model="nowEmpTel" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="手機" v-model="nowEmpMobile" />
                        </MDBCol>
                        <MDBCol md="4" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="e-Mail"
                            v-model="nowEmpEmail" />
                        </MDBCol>
                        <MDBCol md="12" class="mt-3">
                          <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="住址" v-model="nowEmpAddress" />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol lg="6">
                      <MDBRow>
                        <MDBCol md="12" class="mt-3">
                          <MDBTextarea :disabled="!rGroup[2]" size="sm" label="學歷" rows="4" v-model="nowEmpEducation" />
                        </MDBCol>
                        <MDBCol md="12" class="mt-3">
                          <MDBTextarea :disabled="!rGroup[2]" size="sm" label="經歷" rows="5" v-model="nowEmpExperience" />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol lg="6">
                      <MDBRow>
                        <MDBCol md="6" class="mt-3">
                          <MDBDatepicker required size="sm" v-model="nowEmpResDate" format="YYYY-MM-DD" label="解職日"
                            ref="nowEmpResDateDOM" />
                        </MDBCol>
                        <div></div>
                        <!-- 解職證明上傳 -->
                        <MDBCol col="8" class="mt-3">
                          <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                            label="解職證明" v-model="nowEmpResUpload">
                            <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowEmpResUpload = ''"
                              class="btn-upload-close" />
                          </MDBInput>
                        </MDBCol>
                        <MDBCol col="4" class="px-0 mt-3">
                          <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="uploadBtn('resUpload')">
                            上傳</MDBBtn>
                          <MDBBtn tag="a" target=_blank :href="nowEmpResUploadDL" download size="sm" color="secondary">下載
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol lg="6">
                      <MDBRow>
                        <MDBCol md="12" class="mt-3 mb-2">
                          <MDBTextarea :disabled="!rGroup[2]" size="sm" label="備註" rows="3" v-model="nowEmpComment" />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <!-- 下方 -->
        <MDBCol col="12" class="my-2 bg-light border border-5 rounded-8 shadow-4"
          style="height: calc(50% - 1em)">
          <MDBRow class="h-100">
            <MDBCol col="12" class="h-100">
              <MDBTabs v-model="activeTabId1" @shown="tabShown($event)">
                <MDBTabNav tabsClasses="">
                  <MDBTabItem tabId="train" href="train">訓練資料</MDBTabItem>
                  <MDBTabItem tabId="empower" href="empower">授權資料</MDBTabItem>
                  <MDBTabItem tabId="optcase" href="optcase">校正案件</MDBTabItem>
                  <MDBTabItem tabId="signcase" href="signcase">簽署案件</MDBTabItem>
                </MDBTabNav>
                <MDBTabContent style="height: calc(100% - 4rem);">
                  <!-- 訓練資料 -->
                  <MDBTabPane tabId="train" class="h-100">
                    <MDBRow class="h-100 overflow-auto">
                      <MDBCol md="6" class="h-100 border-top border-bottom overflow-auto">
                        <DataTable :data="data_train" :columns="columns_train" :options="tboption_train" ref="table_train" style="font-size: smaller"
                          class="display w-100 compact" />
                      </MDBCol>
                      <!-- 分割 -->
                      <MDBCol md="6" class="h-100 border-top border-bottom border-start">
                        <MDBRow class="h-100 align-content-start">
                          <MDBCol md="12" class="my-2">
                            <MDBBtn :disabled="!rGroup[2] || nowEmpID===''" size="sm" color="primary">
                              <RouterLink target="_blank" :to="{ path: '/sicltab11', query: { empID: nowEmpID }, }">
                                <span class="btn-primary">列印基本資料表</span>
                              </RouterLink>
                            </MDBBtn>
                            <MDBBtn :disabled="!rGroup[2] || nowTrainID===''" size="sm" color="primary" @click="newTrainBtn">
                              新增
                            </MDBBtn>
                            <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="saveTrainBtn">
                              儲存
                            </MDBBtn>
                            <MDBPopconfirm :disabled="!rGroup[2] || nowEmpID ===''" class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                              message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delTrain">
                              刪除
                            </MDBPopconfirm>
                          </MDBCol>
                          <MDBCol col="12" class="overflow-auto border-top" style="height: calc(100% - 4rem);">
                            <MDBRow>
                              <MDBCol lg="6">
                                <MDBRow>
                                  <MDBCol md="6" class="mt-3">
                                    <MDBInput disabled required size="sm" type="text" label="索引" v-model="nowTrainID" />
                                  </MDBCol>
                                  <div></div>

                                  <MDBSelect filter :disabled="!rGroup[2]" size="sm" class="mt-3 col-xl-12" 
                                    label="課程名稱" 
                                    v-model:options="nowTrainNameMU"
                                    v-model:selected="nowTrainName" 
                                    ref="nowTrainNameDOM"
                                    @close="updateTrainName()">
                                    <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowTrainName" />
                                  </MDBSelect>

                                  <MDBSelect filter :disabled="!rGroup[2]" size="sm" class="mt-3 col-xl-12" 
                                    label="開課單位" 
                                    v-model:options="nowTrainInstitutionMU"
                                    v-model:selected="nowTrainInstitution" 
                                    ref="nowTrainInstitutionDOM"
                                    @close="updateTrainInstitution()">
                                    <MDBInput size="sm" type="text" label="自訂新選項" v-model="nowTrainInstitution" />
                                  </MDBSelect>

                                  <MDBCol md="6" class="mt-3">
                                    <MDBDatepicker required size="sm" v-model="nowTrainEndDate" format="YYYY-MM-DD" label="結訓日期"
                                      ref="nowTrainEndDateDOM" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                              <MDBCol lg="6">
                                <MDBRow>
                                  <MDBCol md="12" class="mt-3">
                                    <MDBInput :disabled="!rGroup[2]" required size="sm" type="text" label="證書編號" v-model="nowTrainCertiNo" />
                                  </MDBCol>
                                  <!-- 證書上傳 -->
                                  <MDBCol col="8" class="mt-3">
                                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                      label="證書上傳" v-model="nowTrainUpload">
                                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowTrainUpload = ''"
                                        class="btn-upload-close" />
                                    </MDBInput>
                                  </MDBCol>
                                  <MDBCol col="4" class="px-0 mt-3">
                                    <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="uploadBtn('trainUpload')">
                                      上傳</MDBBtn>
                                    <MDBBtn tag="a" target=_blank :href="nowTrainUploadDL" download size="sm" color="secondary">下載
                                    </MDBBtn>
                                  </MDBCol>
                                  <MDBCol md="12" class="my-3">
                                    <MDBTextarea :disabled="!rGroup[2]" size="sm" label="備註" rows="2" v-model="nowTrainComment" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
                  <!-- 授權資料 -->
                  <MDBTabPane tabId="empower" class="h-100">
                    <MDBRow class="h-100 overflow-auto">
                      <MDBCol md="6" class="h-100 border-top border-bottom overflow-auto">
                        <DataTable :data="data_empower" :columns="columns_empower" :options="tboption_empower" ref="table_empower" style="font-size: smaller"
                          class="display w-100 compact" />
                      </MDBCol>
                      <!-- 分割 -->
                      <MDBCol md="6" class="h-100 border-top border-bottom border-start overflow-auto">
                        <MDBRow class="h-100 align-content-start">
                          <MDBCol md="12" class="my-2">
                            <MDBBtn :disabled="!rGroup[2] || nowEmpowerID===''" size="sm" color="primary">
                              <RouterLink target="_blank" :to="{ path: '/sicltab12', query: { empowerID: nowEmpowerID }, }">
                                <span class="btn-primary">列印評估表</span>
                              </RouterLink>
                            </MDBBtn>
                            <MDBBtn :disabled="!rGroup[2] || nowEmpowerID===''" size="sm" color="primary" @click="newEmpowerBtn">
                              新增
                            </MDBBtn>
                            <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="saveEmpowerBtn">
                              儲存
                            </MDBBtn>
                            <MDBPopconfirm :disabled="!rGroup[2] || nowEmpID ===''" class="btn-sm btn-light btn-outline-danger me-auto" position="top"
                              message="刪除後無法恢復，確定刪除嗎？" cancelText="取消" confirmText="確定" @confirm="delEmpower">
                              刪除
                            </MDBPopconfirm>
                          </MDBCol>
                          <MDBCol col="12" class="overflow-auto border-top" style="height: calc(100% - 4rem);">
                            <MDBRow>
                              <MDBCol lg="6">
                                <MDBRow>
                                  <MDBCol md="6" class="mt-3">
                                    <MDBInput disabled required size="sm" type="text" label="索引" v-model="nowEmpowerID" />
                                  </MDBCol>
                                  <div></div>
                                  <MDBSelect size="sm" class="mt-3  col-6" label="校正項目" v-model:options="nowEmpowerCalTypeIdMU"
                                    v-model:selected="nowEmpowerCalTypeID" ref="nowEmpowerCalTypeIdDOM" />
                                  <MDBSelect size="sm" class="mt-3  col-6" label="職務" v-model:options="nowEmpowerRoleMU"
                                    v-model:selected="nowEmpowerRole" ref="nowEmpowerRoleDOM" />
                                  <div></div>
                                  <MDBCol md="12" class="mt-3">
                                    <MDBTextarea :disabled="!rGroup[2]" size="sm" label="評估結果" rows="7" v-model="nowEmpowerAssResult" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>
                              <MDBCol lg="6">
                                <MDBRow>
                                  <MDBCol md="6" class="mt-3">
                                    <MDBDatepicker required size="sm" v-model="nowEmpowerAssDate" format="YYYY-MM-DD" label="評估日"
                                      ref="nowEmpowerAssDateDOM" />
                                  </MDBCol>
                                  <MDBSelect :disabled="!rGroup[2]" size="sm" class="mt-3 col-md-6" label="評估人員" v-model:options="nowEmpowerAssMU"
                                    v-model:selected="nowEmpowerAssID" ref="nowEmpowerAssDOM" />
                                  <div></div>
                                  <MDBCol md="6" class="mt-3">
                                    <MDBDatepicker required size="sm" v-model="nowEmpowerDate" format="YYYY-MM-DD" label="授權日"
                                      ref="nowEmpowerDateDOM" />
                                  </MDBCol>
                                  <MDBSelect :disabled="!rGroup[2]" size="sm" class="mt-3 col-md-6" label="授權人員" v-model:options="nowEmpowerSupMU"
                                    v-model:selected="nowEmpowerSupID" ref="nowEmpowerSupDOM" />

                                  <MDBCol md="6" class="mt-3">
                                    <MDBDatepicker required size="sm" v-model="nowEmpowerSusDate" format="YYYY-MM-DD" label="停權日"
                                      ref="nowEmpowerSusDateDOM" />
                                  </MDBCol>
                                  <div></div>
                                  <!-- 評估表上傳 -->
                                  <MDBCol col="8" class="mt-3">
                                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                      label="評估表上傳" v-model="nowEmpowerTabUpload">
                                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowEmpowerTabUpload = ''"
                                        class="btn-upload-close" />
                                    </MDBInput>
                                  </MDBCol>
                                  <MDBCol col="4" class="px-0 mt-3">
                                    <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="uploadBtn('empowerUpload')">
                                      上傳</MDBBtn>
                                    <MDBBtn tag="a" target=_blank :href="nowEmpowerTabUploadDL" download size="sm" color="secondary">下載
                                    </MDBBtn>
                                  </MDBCol>
                                  <!-- 核准公文上傳 -->
                                  <MDBCol col="8" class="mt-3">
                                    <MDBInput tooltipFeedback required readonly style="padding-right: 2.2em" size="sm" type="text"
                                      label="核准公文上傳" v-model="nowEmpowerAprvUpload">
                                      <MDBBtnClose :disabled="!rGroup[2]" @click.prevent="nowEmpowerAprvUpload = ''"
                                        class="btn-upload-close" />
                                    </MDBInput>
                                  </MDBCol>
                                  <MDBCol col="4" class="px-0 mt-3">
                                    <MDBBtn :disabled="!rGroup[2] || nowEmpID ===''" size="sm" color="primary" @click="uploadBtn('empowerAprvUpload')">
                                      上傳</MDBBtn>
                                    <MDBBtn tag="a" :href="nowEmpowerAprvUploadDL" download size="sm" color="secondary">下載
                                    </MDBBtn>
                                  </MDBCol>
                                  <MDBCol md="12" class="my-3">
                                    <MDBTextarea :disabled="!rGroup[2]" size="sm" label="備註" rows="2" v-model="nowEmpowerComment" />
                                  </MDBCol>
                                </MDBRow>
                              </MDBCol>


                              
                              
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
                  <!-- 校正案件 -->
                  <MDBTabPane tabId="optcase" class="h-100">
                    <MDBRow class="h-100 overflow-auto">
                      <MDBCol md="12" class="h-100">
                        <DataTable :data="data_optcase" :columns="columns_optcase" :options="tboption_optcase" ref="table_optcase" style="font-size: smaller"
                          class="display w-100 compact" />
                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
                  <!-- 簽署案件 -->
                  <MDBTabPane tabId="signcase" class="h-100">
                    <MDBRow class="h-100 overflow-auto">
                      <MDBCol md="12" class="h-100">
                        <DataTable :data="data_signcase" :columns="columns_signcase" :options="tboption_signcase" ref="table_signcase" style="font-size: smaller"
                          class="display w-100 compact" />
                      </MDBCol>
                    </MDBRow>
                  </MDBTabPane>
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

/* div.dataTables_filter {
  padding-top: 0.85em;
} */

.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}
tr > td > span.status89{
  color: #DE3163;
}
tr.selected > td >span.status89 {
  color: white;
}

tr>td>span.status7 {
  color: rgb(20, 164, 77);
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

</style>
