<script setup>
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

// 引入案件編號
const props = defineProps({
  caseID: String
});


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
    <div class="fstyle02">
      內政部國土測繪中心　測量儀器校正服務網
    </div>
		<div class="fstyle01">校正作業管理表</div>
    <div class="fstyle02">
      編號: {{tableID}}&nbsp;{{itemID}}
    </div>
		
		<table class="sicltab01" cellspacing=0 cellpadding=0 width="100%">
			<tr>
				<td scope="col" width="33%" class="fstyle03">申請單編號：{{tableID}}</td>
				<td scope="col" class="fstyle03">校正件編號：{{itemID}}</td>
				<td scope="col" width="33%" class="fstyle03">儀器櫃編號：{{nowCaseCalTypeCode}}</td>
			</tr>
			<tr>
				<td class="fstyle03">廠牌：{{nowCaseItemChop}}</td>
				<td class="fstyle03">型號：{{nowCaseItemModel}}</td>
				<td class="fstyle03">序號：{{nowCaseItemSN}}</td>
			</tr>
			<tr>
				<th colspan="3">
					<table width="100%" style="border: hidden;">
						<tr>
							<td colspan="3" scope="col" class="fstyle04 bgyellow">流程項目</td>
							<td colspan="3" scope="col" class="fstyle04 bgyellow">校正作業</td>
							<td scope="col" class="fstyle04 bgyellow">經手人</td>
						</tr>
						<tr>
							<td rowspan="3" class="fstyle04">
								<p>
									校<br/>正
								</p>
							</td>
							<td class="fstyle04 bgyellow">項目</td>
							<td class="fstyle04 bgyellow">最近查核日期</td>
							<td width="15%" class="fstyle04 bgyellow">日期</td>
							<td class="fstyle04 bgyellow">開始時間</td>
							<td class="fstyle04 bgyellow">完成時間</td>
							<td class="fstyle04 bgyellow">校正人員</td>
						</tr>
						<tr class="fstyle04">
							<td>{{nowCaseCalTypeCode}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td>{{nowCaseOperatorName}}</td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td rowspan="3" class="fstyle04">
                校<br/>正<br/>報<br/>告</td>
							<td colspan="2" class="fstyle04 bgyellow">項目</td>
							<td class="fstyle04 bgyellow">日期</td>
							<td class="fstyle04 bgyellow">時間</td>
							<td class="fstyle04 bgyellow">製作人員</td>
							<td class="fstyle04 bgyellow">數據檢核</td>
						</tr>
						<tr>
							<td colspan="2"></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
            <tr>
							<td colspan="2"></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td rowspan="6" class="fstyle04">
                審<br/>查
              </td>
							<td colspan="2" class="fstyle04 bgyellow">審查人員</td>
							<td colspan="3" class="fstyle04 bgyellow">審查情形（結果）</td>
							<td class="fstyle04 bgyellow">簽章</td>
						</tr>
						<tr>
							<td colspan="2" rowspan="2" class="fstyle03">報告簽署人</td>
							<td colspan="3" style="height: 54px" class="fstyle03">項目：</td>
							<td></td>
						</tr>
						<tr>
							<td colspan="3" style="height: 54px" class="fstyle03">項目：</td>
							<td></td>
						</tr>
						<tr>
							<td colspan="2" class="fstyle03">技術主管</td>
							<td colspan="3" style="height: 54px"></td>
							<td></td>
						</tr>
						<tr>
							<td colspan="2" class="fstyle03">品質主管</td>
							<td colspan="3" style="height: 54px"></td>
							<td></td>
						</tr>
						<tr>
							<td colspan="2" class="fstyle03">實驗室主管</td>
							<td colspan="3" style="height: 54px"></td>
							<td></td>
						</tr>
					</table>
				</th>
			</tr>
		</table>
    <br/>
		<table class="sicltab01" width="100%">
			<tr>
				<td width="20%" scope="col" class="fstyle04 bgyellow">項目</td>
				<td scope="col" class="fstyle04 bgyellow">經手人</td>
				<td scope="col" class="fstyle04 bgyellow">顧客簽章</td>
			</tr>
			<tr>
				<td class="fstyle03">儀器領回</td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td class="fstyle03">校正報告領回</td>
				<td></td>
				<td></td>
			</tr>
		</table>
    <div class="fstyle05">
      SICL-4-17-0
    </div>
		<div class="delete_line">
			<span class="fstyle06">裁切線</span>
		</div>
		<table class="sicltab01" width="100%">
			<tr>
				<td scope="col" class="fstyle04 bgyellow">隨 件 標 籤</td>
			</tr>
			<tr>
				<td>
					<table width="100%">
						<tr>
							<th width="33%" scope="col" class="fstyle03">申請單編號：{{tableID}}</th>
							<th width="33%" scope="col" class="fstyle03">校正件編號：{{itemID}}</th>
							<th width="33%" scope="col" class="fstyle03">儀器櫃編號：{{nowCaseCalTypeCode}}</th>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td class="fstyle03">顧客名稱：{{nowCaseCustOrgName}}</td>
			</tr>
			<tr>
				<td>
					<table width="100%">
						<tr>
							<th width="67%" scope="col" class="fstyle03">廠牌/型號/序號：{{nowCaseItemChop}}/{{nowCaseItemModel}}/{{nowCaseItemSN}}</th>
							<th scope="col" class="fstyle03">校正項目：{{nowCaseCalTypeCode}}</th>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table width="100%">
						<tr>
							<th width="50%" scope="col" class="fstyle03">
								□校畢簽名：
							</th>
							<th scope="col" class="fstyle03">
								□退件：
							</th>
						</tr>
					</table>
				</td>
			</tr>
		</table>
    <div class="fstyle03">附註：本標籤自顧客取回校正件後自動失效。</div>
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
    /* height: 297mm; */
    width: 210mm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
    border: solid 1px;
    padding: 5mm 15mm 5mm 15mm;
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
    padding: 5mm 15mm 5mm 15mm;
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



.sicltab01 {
  border: 1px solid;
  border-collapse: collapse;
}
.sicltab01 > tr, td {
  border: 1px solid;
  height: 30px;
}

.fstyle01{
  text-align: center;
  font-size: 25px;
  font-family: 標楷體;
  font-weight:bold;
}
.fstyle02{
  font-size: 16px;
  font-family: 標楷體;
  font-weight:normal;
}
.fstyle03{
  font-size: 16px;
  font-family: 標楷體;
  font-weight:normal;
  padding: 2px 8px;
	white-space:nowrap;
	overflow:hidden;
}
.fstyle04{
  font-size: 16px;
  font-family: 標楷體;
  font-weight:normal;
  padding: 2px;
  text-align: center;
}
.fstyle05{
  font-size: 16px;
  font-family: 標楷體;
  font-weight:normal;
  text-align: right;
}
.fstyle06{
  font-size: 16px;
  font-family: 標楷體;
  font-weight:normal;
}
.delete_line {
  height: 16px;
  width: 100%;
  border-bottom-width: 2px;
  border-bottom-style: dashed;
  border-bottom-color: #000000;
  margin-bottom: 10px;
  text-align: center;
}


</style>
