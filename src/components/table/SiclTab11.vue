<script setup>
// 人員基本資料表
import { ref } from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery } from '@vue/apollo-composable';
import EmpGQL from "../../graphql/Employee";

// 引入案件編號
const props = defineProps({
  empID: String
});

const nowEmpLabID = ref(""); // 實驗室編號
const nowEmpModifyDate = ref(""); // 更新日期
const modifyDateStr = computed(() => {
  let dateArray = nowEmpModifyDate.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})
const nowEmpName = ref(""); // 姓名
const nowEmpIDNumber = ref(""); // 身分證字號
const nowEmpBirthday = ref(""); // 出生日期
const birthdayStr = computed(() => {
  let dateArray = nowEmpBirthday.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})
const nowEmpJobTitle = ref(""); // 職稱
const nowEmpID = ref(""); // 員工編號
const nowEmpAppDate = ref(""); // 到職日期
const appDateStr = computed(() => {
  let dateArray = nowEmpAppDate.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})
const nowEmpAddress = ref(""); // 住址
const nowEmpTel = ref(""); // 電話
const nowEmpMobile = ref(""); // 手機
const nowEmpEmail = ref(""); // email
const nowEmpEducation = ref(""); // 學歷
const nowEmpExperience = ref(""); // 經歷
const nowTrainStr = ref(""); // 訓練紀錄

// 查詢Emp資料
const { onResult: getEmp, refetch: refgetEmp } = useQuery(
  EmpGQL.GETEMPBYID,
  () => ({
    personId: parseInt(props.empID)
  })
);
getEmp(result => {
  if (!result.loading && result && result.data.getEmpById) {
    // 填入資料
    let getData = result.data.getEmpById;
    nowEmpLabID.value = getData.lab_ee_id;
    nowEmpModifyDate.value = (getData.modify_date)?getData.modify_date.split("T")[0]:"";
    nowEmpName.value = getData.name;
    nowEmpIDNumber.value = getData.id_number;
    nowEmpBirthday.value = (getData.birth_date)?getData.birth_date.split("T")[0]:"";
    nowEmpJobTitle.value = getData.job_title;
    nowEmpID.value = getData.person_id;
    nowEmpAppDate.value = (getData.Appointment_date)?getData.Appointment_date.split("T")[0]:"";
    nowEmpAddress.value = getData.address;
    nowEmpTel.value = getData.tel;
    nowEmpMobile.value = getData.mobile;
    nowEmpEmail.value = getData.Email;
    nowEmpEducation.value = getData.education;
    nowEmpExperience.value = getData.experience;
  }
});
refgetEmp();

// 查詢Train資料
const { onResult: getTrain, refetch: refgetTrain } = useQuery(
  EmpGQL.GETTRAIN,
  () => ({
    personId: parseInt(props.empID)
  })
);
getTrain(result=>{
  if (!result.loading && result && result.data.getTrainByPerson) {
    let getData = result.data.getTrainByPerson;
    let myTrainStr = "";
    for (let i=0; i < getData.length; i++){
      let trainDate = (getData[i].end_date)?getData[i].end_date.split("T")[0]:"";
      trainDate = trainDate.replaceAll("-","/");
      myTrainStr = myTrainStr + "<p>" + (i+1) + ". " + trainDate + " 【" + getData[i].train_name + "】<p>"
    }
    nowTrainStr.value = myTrainStr;
  }
});
refgetTrain();

</script>

<template>
  <div class="page">
    <div class="fstyle02 w-100">
      <div>內政部國土測繪中心　測量儀器校正實驗室</div>
    </div>
      <!-- 表單名稱 -->
      <div class="fstyle01">
        <div class="fstyle01C" style="margin-bottom: 10px;">人員基本資料表</div>
      </div>
      <div class="fstyle02" style="float: left;">編號：{{nowEmpLabID}}</div>
      <div class="fstyle02" style="float: right;">更新日期：{{modifyDateStr}}</div>
      <table width="100%" cellspacing=0 cellpadding=0  class="fstyle02">
        <tr class="fixwidth">
          <td width="10%"></td>
          <td width="20%"></td>
          <td width="14%"></td>
          <td width="10%"></td>
          <td width="18%"></td>
          <td width="8%"></td>
          <td width="12%"></td>
          <td width="18%"></td>
          <td></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">姓名</td>
          <td scope="col" class="tdborder-t tdborder-l">{{nowEmpName}}</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">身分證字號</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">{{nowEmpIDNumber}}</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">出生年月日</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-r">{{birthdayStr}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">職稱</td>
          <td scope="col" class="tdborder-t tdborder-l">{{nowEmpJobTitle}}</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">員工編號</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">{{nowEmpID}}</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">到職日期</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-r">{{appDateStr}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">住址</td>
          <td colspan="8" scope="col" class="tdborder-t tdborder-l tdborder-r">{{nowEmpAddress}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">電話</td>
          <td scope="col" class="tdborder-t tdborder-l">{{nowEmpTel}}</td>
          <td scope="col" class="tdborder-t tdborder-l">手機</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">{{nowEmpMobile}}</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l">E-mail</td>
          <td colspan="2" scope="col" class="tdborder-t tdborder-l tdborder-r">{{nowEmpEmail}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">學歷</td>
          <td colspan="8" scope="col" class="tdborder-t tdborder-l tdborder-r">{{nowEmpEducation}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">經歷</td>
          <td colspan="8" scope="col" class="tdborder-t tdborder-l tdborder-r">{{nowEmpExperience}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">訓練<br/>紀錄</td>
          <td colspan="8" scope="col" class="tdborder-t tdborder-l tdborder-r" v-html="nowTrainStr"></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l tdborder-b">其他</td>
          <td colspan="8" scope="col" class="tdborder"></td>
        </tr>
      </table>
      <div class="fstyle02 w-100">
        <table width="100%" style="border: hidden;">
          <tr>
            <td width="33%" style="text-align: left;border: hidden; padding:0;">文件編號：SICL-4-10-0</td>
            <!-- <td width="33%" style="text-align: center;border: hidden;">/1</td> -->
            <td style="text-align: right;border: hidden;">版次：1.3</td>
          </tr>
        </table>
      </div>
  </div>
</template>
<style>
@media screen {

  html,
  body {
    width: 210mm;
    height: 297mm;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    display: none;
  }

  .footer {
    display: none;
  }

  .page {
    border: 1px solid;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6);
    position: relative;
    width: 210mm;
    height: 297mm;
    padding-top: 1.5cm;
    padding-bottom: 1.5cm;
    padding-left: 2cm;
    padding-right: 2cm;
  }

  .page-gap {
    height: 20px;
  }



}

@page {
  size: A4 portrait;
  /* 混合使用 */
  margin: 1cm 2cm;
  /* 邊界與內容的距離 */
  orphans: 0;
  widows: 0;
}

@media print {

  html,
  body {
    height: 100%;
    margin: 0;
    counter-reset: page-number;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    /* border: 1px solid red; */
  }

  .header {
    position: fixed;
  }

  .footer {
    position: fixed;
    bottom: 0;
  }

  .page {
    /* border: 1px solid blue; */
    position: relative;
    width: 100%;
    height: 100%;
    /* padding-top: 1.5cm; */
    /* padding-bottom: 1.5cm; */
    /* page-break-inside: avoid; */
    /* page-break-before: always; */
  }

  /* .page::after {
    counter-increment: page-number;
    content: counter(page-number);
    position: absolute;
    right: 88mm;
    bottom: 1.8mm;
    font-size: 11pt;
    font-family: "Times New Roman", 標楷體;
    font-weight: normal;
    text-align: right;
  } */

  .page-gap {
    display: none;
  }

  .noprint {
    display: none;
  }

}

table, tr{
  border: none;
}

tr.fixwidth td{
  height: 0;
  /* border-left: 1px solid; */
}

td {
  /* border: 2px solid; */
  height: 3rem;
  padding-left: 0.5rem;
  line-height: 1.5;
  /* page-break-inside: avoid; */
  /* white-space:nowrap; */
  /* overflow: hidden; */
  /* height: 30px; */
}

p{
  margin: 0;
}

.fs-gray{
  color: #d9d9d9;
}

.tdbordercolor{
  border-color: #000;
}
.tdborder{
  border: 1px solid;
}

.tdborder-t{
  border-top: 1px solid;
}

.tdborder-b{
  border-bottom: 1px solid;
}

.tdborder-l{
  border-left: 1px solid;
}

.tdborder-r{
  border-right: 1px solid;
}

.tdborder-t2{
  border-top: 3px solid;
}

.tdborder-b2{
  border-bottom: 3px solid;
}

.tdborder-l2{
  border-left: 3px solid;
}

.tdborder-r2{
  border-right: 3px solid;
}

.wingdings2 {
  font-family: 'Wingdings 2';
  font-size: 16pt;
  vertical-align: middle;
}

.nowrap {
  white-space: nowrap;
}

.bggray {
  background-color: #b3b3b3;
}

.bggray2 {
  background-color: #d9d9d9;
}

.fstyle01,
.fstyle01C,
.fstyle02,
.fstyle02mid,
.fstyle02V,
.fstyle02Vleft, .fstyle04mid {
  font-family: "Times New Roman", 標楷體;
}

.fbolder {
  font-weight: bolder;
}

.fstyle01,
.fstyle01C {
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
  line-height: 1;
}

.fstyle01C {
  letter-spacing: 5px;
}

.fstyle02,
.fstyle02mid {
  padding: 3px 10px 3px 10px;
  font-size: 12pt;
  letter-spacing: 0px;
  font-weight: normal;
}

.fstyle02 {
  text-align: left;
  line-height: 2;
}

.fstyle02mid {
  text-align: center;
  line-height: 1.2;
}

.fstyle02V,
.fstyle02Vleft {
  margin-left: auto;
  margin-right: auto;
  font-size: 12pt;
  font-weight: normal;
  /* line-height: 1; */
  writing-mode: vertical-lr;
  text-orientation: mixed;
  white-space: nowrap;
}

.fstyle02V {
  text-align: center;
}

.fstyle02Vleft {
  text-align: left;
  padding-top: 10px;
}

.fstyle03left,
.fstyle03mid,
.fstyle03right  {
  padding: 0.3rem 0.5rem;
  font-size: 10pt;
  font-weight: normal;
  line-height: 1;
}

.fstyle03left {
  text-align: left;
}

.fstyle03mid {
  text-align: center;
}
.fstyle03right {
  text-align: right;
}

.fstyle04mid{
  padding: 0;
  font-size: 8pt;
  font-weight: normal;
  line-height: 1;
  text-align: center;
}

.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 150px;
}
</style>
