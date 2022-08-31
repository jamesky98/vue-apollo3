<script setup>
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

// 引入案件編號
const props = defineProps({
  caseID: String
});

const isSMCam = ref(false); //是否為小像幅
const tableID = computed(()=>{return props.caseID.slice(0,-2)}); //申請單編號
const itemID = computed(()=>{return props.caseID.slice(-2)}); //校正件編號
const nowCaseCalTypeCode = ref(""); //校正項目代碼
const nowCaseItemChop = ref("");// 廠牌
const nowCaseItemModel = ref("");// 型號
const nowCaseItemSN = ref("");// 序號
const nowCaseCustOrgName = ref("");// 顧客名稱
const nowCaseOperatorName = ref("");// 校正人員名稱
// 查詢Case_Record資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入資料
    let getCust = result.data.getCasebyID.cus;
    let getItem = result.data.getCasebyID.item_base;
		let getOpt = result.data.getCasebyID.employee_case_base_operators_idToemployee;
		(result.data.getCasebyID.cal_type === 3) ? isSMCam.value = true : isSMCam.value = false;
    // 校正件資料
    nowCaseCalTypeCode.value = (result.data.getCasebyID.cal_type_cal_typeTocase_base)?result.data.getCasebyID.cal_type_cal_typeTocase_base.code:"";
    nowCaseItemChop.value = (getItem)?getItem.chop:"";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
		nowCaseCustOrgName.value = (getCust) ? getCust.cus_org.name : "";
		nowCaseOperatorName.value = (getOpt)?getOpt.name:"";
  }
});
refgetNowCaseF();
</script>

<template>
	<div class="bgdata">
		<div class="header">
			<div class="pageheader">
				<div>內政部國土測繪中心</div>
				<div>臺中市南屯區黎明路2段497號4樓 電話：(04)22522966轉206 傳真：(04)22592273</div>
			</div>
		</div>
		<div class="footer">
			<table  width="100%" style="border: hidden;">
				<tr class="fstyle02">
					<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-15-1</td>
					<td width="33%" style="text-align: center;border: hidden;">/3</td>
					<td style="text-align: right;border: hidden;">版次：2.4</td>
				</tr>
			</table>
		</div>
	</div>
	<div class="printcontent"></div>



</template>
<style>


@media screen {
	html, body{
		height: 297mm;
		margin: 0;
	}
	.header{
		display: none;
	}
	.footer{
		display: none;
	}
	.print-content{
		/* height: 297mm; */
    width: 17cm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
		border: 1px solid red;
	}
	tr,td {
		border: 1px solid;
		page-break-inside: avoid
		/* height: 30px; */
	}
}
@page {
  size: portrait; /* 直向 */
  size: A4 portrait; /* 混合使用 */
  margin: 1cm 2cm; /* 邊界與內容的距離 */
	orphans:2;
  widows:0;
}
@media print{
	html, body{
		height: 100%;
		margin: 0;
		counter-reset: page-number;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
		float: none;
		/* border: 1px solid red; */
	}
	.noprint{
		display: none;
	}
	tr,td {
		border: 1.5px solid;
		page-break-inside: avoid
		/* height: 30px; */
	}
	.bgdata{
		position: fixed;
		/* padding-top: 1cm; */
		width: 100%;
		height: 100%;
		border: 1px solid red;
	}
	.header{
		width: 100%;
		position: absolute;
		top: 0;
	}
	.footer{
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	.printcontent{
		width: 100%;
		height: 100%;
		border: 1px solid blue;
		margin-top: 1cm;
	}

	.page {
		position: relative;
		margin-top: 1cm;
		page-break-inside: avoid;
		height: 100%;
	}
}

.sicltab01 {
  /* border: 1px solid; */
  border-collapse: collapse;
}

.print-pageFooter {
	position: absolute;
	top: 277mm;
	width: 170mm;
}
.fstyle01{
	font-family: "Times New Roman", 標楷體;
  text-align: center;
  font-size: 24pt;
  font-weight:bold;
	line-height: 1.2;
}
.fstyle01C{
	font-family: "Times New Roman", 標楷體;
  text-align: center;
  font-size: 24pt;
  font-weight:bold;
	line-height: 1.2;
	letter-spacing: 5px;
}
.fstyle02{
	padding: 3px 10px 3px 10px;
  font-size: 12pt;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	line-height: 1.2;
}
.fstyle02mid{
	padding: 3px 0px 3px 0px;
  font-size: 12pt;
  font-family: "Times New Roman", 標楷體;
	text-align: center;
  font-weight:normal;
	line-height: 1.2;
}
.fstyle02V{
	margin-left: auto;
	margin-right: auto;
	margin: auto;
  font-size: 12pt;
  font-family: "Times New Roman", 標楷體;
	text-align: center;
  font-weight:normal;
	line-height: 1.2;
	writing-mode: vertical-lr;
  text-orientation: mixed;
	white-space:nowrap;
}
.fstyle02Vleft{
  font-size: 12pt;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  padding-top: 10px;
  font-weight:normal;
	line-height: 1.2;
	writing-mode: vertical-lr;
  text-orientation: mixed;
	white-space:nowrap;
}
.fstyle03{
	padding: 3px 10px 3px 10px;
  font-size: 10pt;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	line-height: 1.3;
}
.fstyle03mid{
	padding: 3px 10px 3px 10px;
  font-size: 10pt;
  font-family: "Times New Roman", 標楷體;
	text-align: center;
  font-weight:normal;
	line-height: 1.3;
}
.pageheader{
	line-height: 1.2;
	font-size: 12pt;
	font-family: "Times New Roman", 標楷體;
	font-weight:normal;
	text-align: left;
	margin-bottom: 10px;
}


</style>
