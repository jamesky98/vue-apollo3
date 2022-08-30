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
	<!-- 頁首 -->
	<!-- <div class="divHeader">頁首</div> -->
	<!-- 頁尾 -->
	<!-- <div class="divFooter">頁尾</div> -->
  <div class="tpage">
		<div class="fstyle03">
			<div>內政部國土測繪中心</div>
			<div>臺中市南屯區黎明路2段497號4樓 電話：(04)22522966轉206 傳真：(04)22592273</div>
		</div>

		<div v-if="isSMCam" class="fstyle01">
			<div class="fstyle01C">校正申請表(適用小像幅航拍攝影機)</div>
			<div>Calibration Application Form</div>
			<div>(apply for small-format airborne camera)</div>
		</div>
		<div v-else class="fstyle01">
			<div class="fstyle01C">校正申請表(適用航空測量攝影機)</div>
			<div>Calibration Application Form</div>
			<div>(apply for aerial photogrammetric camera)</div>
		</div>
		
		<table width="100%">
			<tr>
				<td>
					<table width="100%" class="sicltab00">
						<tr class="sicltab01">
							<td scope="col" width="33%" class="fstyle02">
								<div>申請單編號：{{tableID}}</div>
								<div>Application Number</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>校正件編號：{{itemID}}</div>
								<div>Item Number</div>
							</td>
							<td scope="col" width="33%" class="fstyle02">
								<div>申請日期：年月日</div>
								<div>Application Date</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td>
					<table width="100%">
						<tr class="sicltab01">
							<td colspan="2" scope="col" class="fstyle02">
								<div>顧客名稱：{{nowCaseCustOrgName}}</div>
								<div>Name</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>統一編號：</div>
								<div>tax ID Number</div>
							</td>
						</tr>
						<tr class="sicltab01"></tr>
						<tr class="sicltab01"></tr>
						<tr class="sicltab01"></tr>
						<tr class="sicltab01"></tr>
					</table>
				</td>
			</tr>



				
		</table>
  </div>
</template>
<style>
/* body {
  counter-reset: page-number; 
} */

@page {
  size: portrait; /* 直向 */
  size: A4 portrait; /* 混合使用 */
  margin: 0; /* 邊界與內容的距離 */
}
@media screen {
	div.divHeader {
		display: none;
  }
	div.divFooter {
    display: none;
  }
	.tpage {
    height: 297mm;
    width: 210mm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
    border: solid 1px;
    padding: 6mm 20mm 6mm 20mm;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6);
	}
}
@media print{
	div.divHeader {
    position: fixed;
    top: 0;
  }
	div.divFooter {
    position: fixed;
    bottom: 0;
  }
	.tpage {
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact; 
    /* height: 297mm; */
    width: 210mm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
    border: none;
    padding: 6mm 20mm 6mm 20mm;
    box-shadow: none;
	}
	/*.tpage::after {
		content: counter(page-number); 
		counter-increment: page-number 1; 
		position: absolute;
		right: 0;
		bottom: 5mm;
		left: 0;
		font-size: 12px;
		text-align: center;
	}*/
}

.bgyellow {
	background-color: #ffff99;
}
.sicltab00 {
	border-collapse: collapse;
}

.sicltab01 > tr, td {
  border: 1px solid;
	padding: 0;
}

.fstyle01{
  text-align: center;
  font-size: 26px;
  font-family: "Times New Roman", 標楷體;
  font-weight:bold;
	line-height: 30px;
}
.fstyle01C{
  text-align: center;
  font-size: 26px;
  font-family: "Times New Roman", 標楷體;
  font-weight:bold;
	line-height: 30px;
	letter-spacing: 5px;
}
.fstyle02{
	padding-left: 5px;
  font-size: 12px;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	line-height: 16px;
}
.fstyle03{
  font-size: 14px;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	margin-bottom: 10px;
}


</style>
