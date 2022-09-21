<script setup>
// 人員評估表
import { ref } from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery,useMutation } from '@vue/apollo-composable';
import EmpGQL from "../../graphql/Employee";

// 引入案件編號
const props = defineProps({
  empowerID: String
});

const nowEmpName = ref(""); // 姓名
const nowEmpowerPersonID = ref(""); // 員工編號
const nowEmpowerRole = ref("");
// 設備操作人員==>操作設備
// 校正人員==>操作校正項目
// 報告簽署人==>擔任職務
// 技術主管==>擔任職務

// 擔任職務
const isJob = computed(()=>{
  return (nowEmpowerRole.value==='報告簽署人' || nowEmpowerRole.value==='技術主管')?true:false;
});
// 操作校正項目
const isCal = computed(()=>{
  return (nowEmpowerRole.value==='校正人員')?true:false;
});
// 操作設備
const isItem = computed(()=>{
  return (nowEmpowerRole.value==='設備操作人員')?true:false;
});

const nowEmpowerCalTypeID = ref(""); // 項目ID
const nowEmpowerCalName = ref(""); // 校正項目名稱

// 授權項目名稱
const nowEmpowerCalTypeName = computed(()=>{
  switch(nowEmpowerRole.value){
    case "設備操作人員":
      if(nowEmpowerCalTypeID.value===1){
        return "航空測量攝影機校正場<br/>航測影像工作站系統"
      }else if(nowEmpowerCalTypeID.value===2){
        return "空載光達校正場<br/>點雲分類及資料處理軟體"
      }else if(nowEmpowerCalTypeID.value===3){
        return "小像幅航拍攝影機校正場<br/>航測影像工作站系統"
      }else{return "XX"}
    case "校正人員":
    case "報告簽署人":
    case "技術主管":
      return nowEmpowerCalName.value + nowEmpowerRole.value;
  }
}); 
// 職務要求
const jobRequest = computed(()=>{
  switch(nowEmpowerRole.value){
    case "設備操作人員":
      return "1.熟悉所授予操作之設備、儀器之操作方法。\n2.熟悉所授予執行校正項目之作業程序。"
    case "校正人員":
      return "1.熟悉所授予操作之設備、儀器之操作方法。\n2.熟悉所授予執行校正項目之作業程序。"
    case "報告簽署人":
      return "1.報告簽署人應對技術事務負全責。\n2.報告簽署人應瞭解校正方法與程序，瞭解校正目的、評估校正能量。\n3.熟悉校正作業程序、技術原理與運算、量測不確定度評估。\n4.經 TAF 評鑑認可者，始得簽署含 TAF 認證標誌之校正報告。\n5.校正報告的表達意見及解釋。"
    case "技術主管":
      return "1.具備測繪領域專業能力，對測量知識、儀器原理有相當程度的瞭解。\n2.具業務協調之能力。\n3.校正報告的表達意見及解釋。"
  }
}); 
// 能力認定條件
const ability = computed(()=>{
  switch(nowEmpowerRole.value){
    case "設備操作人員":
      return "1.具備相關知識學經歷。\n2.參加擔任本項職務所需之實驗室相關訓練，並取得證書。\n3.確實具備所擔任設備操作及執行校正項目之能力。"
    case "校正人員":
      return "1.具備相關知識學經歷。\n2.參加擔任本項職務所需之實驗室相關訓練，並取得證書。\n3.確實具備所擔任設備操作及執行校正項目之能力。"
    case "報告簽署人":
      return "1.具備相關知識學經歷。\n2.參加擔任本項職務所需之實驗室相關訓練，並取得證書。"
    case "技術主管":
      return "1.具備 1 項以上校正項目報告簽署人資格。\n2.參加擔任本項職務所需之實驗室相關訓練，並取得證書。"
  }
}); 
const nowEmpowerAssResult = ref(""); // 評估方式與結果

// 查詢Empower資料
const {
  mutate: getEmpowerById,
  onDone: getEmpowerByIdOnDone,
  onError: getEmpowerByIdError,
} = useMutation(EmpGQL.GETEMPOWERBYID, () => ({
  variables: {
    empowerId: parseInt(props.empowerID),
  },
}));
getEmpowerByIdOnDone(result=>{
  let getData = result.data.getEmpowerByID;
  let getCalType = result.data.getEmpowerByID.cal_type_cal_typeToemployee_empower;
  nowEmpowerPersonID.value = getData.person_id;
  nowEmpowerCalTypeID.value = getData.cal_type;
  nowEmpowerCalName.value = (getCalType)?getCalType.name:"";
  nowEmpowerRole.value = getData.role_type;
  nowEmpowerAssResult.value = getData.assessment_result;
  nowEmpName.value = (getData.employee)?getData.employee.name:"";
});
getEmpowerById();

</script>

<template>
  <div class="header fstyle04 w-100">
		<div>內政部國土測繪中心　測量儀器校正實驗室</div>
	</div>
	<div class="footer fstyle04 w-100">
		<table  width="100%" style="border: hidden;">
			<tr>
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-11-0</td>
				<td style="text-align: right;border: hidden;">版次：1.4</td>
			</tr>
		</table>
	</div>

  <div class="page">
    
      <!-- 表單名稱 -->
      <div class="fstyle01">
        <div class="fstyle01C" style="margin-bottom: 10px;">人員能力評估紀錄表</div>
      </div>
      <table width="100%" cellspacing=0 cellpadding=0  class="fstyle02">
        <tr class="fixwidth">
          <td width="15%"></td>
          <td width="30%"></td>
          <td width="20%"></td>
          <td width="30%"></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">姓名</td>
          <td scope="col" class="tdborder-t tdborder-l">{{nowEmpName}}</td>
          <td scope="col" class="tdborder-t tdborder-l">員工編號</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-r">{{nowEmpowerPersonID}}</td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">評估項目</td>
          <td colspan="3" scope="col" class="tdborder-t tdborder-l tdborder-r">
            <table width="100%">
              <tr>
                <td><span v-if="isJob" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>擔任職務</td>
                <td><span v-if="isCal" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>操作校正項目</td>
                <td><span v-if="isItem" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>操作設備</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">項目名稱</td>
          <td colspan="3" scope="col" class="tdborder-t tdborder-l tdborder-r" v-html="nowEmpowerCalTypeName"></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">職務要求</td>
          <td scope="col" class="tdborder-t tdborder-l fstyle03left" style="white-space: pre-line">
            {{jobRequest}}
          </td>
          <td scope="col" class="tdborder-t tdborder-l">能力認定條件</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-r fstyle03left" style="white-space: pre-line;">
            {{ability}}
          </td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">評估方式<br/>與結果</td>
          <td colspan="3" scope="col" class="tdborder-t tdborder-l tdborder-r fstyle03left" style="white-space: pre-line;">
            {{nowEmpowerAssResult}}
          </td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">確認日期</td>
          <td scope="col" class="tdborder-t tdborder-l"></td>
          <td scope="col" class="tdborder-t tdborder-l">評估者簽名</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-r"></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l">備註</td>
          <td colspan="3" scope="col" class="tdborder-t tdborder-l tdborder-r"></td>
        </tr>
        <tr>
          <td scope="col" class="tdborder-t tdborder-l tdborder-b">授權日</td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-b"></td>
          <td scope="col" class="tdborder-t tdborder-l tdborder-b">實驗室主管簽名<br/><span style="font-size: 10pt;">(註：實驗室主管由中心主任核定)</span></td>
          <td scope="col" class="tdborder"></td>
        </tr>
      </table>
      
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
    padding-top: 1.5cm;
    padding-bottom: 1.5cm;
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
.fstyle02Vleft, 
.fstyle04,
.fstyle04mid {
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
  font-size: 14pt;
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
  font-size: 12pt;
  font-weight: normal;
  line-height: 1.2;
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

.fstyle04,
.fstyle04mid {
  padding: 3px 10px 3px 10px;
  font-size: 12pt;
  letter-spacing: 0px;
  font-weight: normal;
}

.fstyle04 {
  text-align: left;
  line-height: 2;
}

.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 150px;
}
</style>
