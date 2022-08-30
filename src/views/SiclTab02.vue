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
		<!-- 以上頁首 -->
		<div v-if="isSMCam" class="fstyle01">
			<div class="fstyle01C">校正申請表(適用小像幅航拍攝影機)</div>
			<div>Calibration Application Form</div>
			<div style="margin-bottom: 20px;">(apply for small-format airborne camera)</div>
		</div>
		<div v-else class="fstyle01">
			<div class="fstyle01C">校正申請表(適用航空測量攝影機)</div>
			<div>Calibration Application Form</div>
			<div style="margin-bottom: 20px;">(apply for aerial photogrammetric camera)</div>
		</div>
		
		<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
			<tr>
				<td scope="col" width="38%" class="fstyle02">
					<div>申請單編號：{{tableID}}</div>
					<div>Application Number</div>
				</td>
				<td scope="col" class="fstyle02">
					<div>校正件編號：{{itemID}}</div>
					<div>Item Number</div>
				</td>
				<td scope="col" width="38%" class="fstyle02">
					<div>申請日期：年月日</div>
					<div>Application Date</div>
				</td>
			</tr>

			<tr>
				<th colspan="3">
					<table width="100%" style="border: hidden;">
						<tr>
							<td width="8%" rowspan="5">
								<div class="fstyle02V">顧客資料<br/>Applicant information</div>
							</td>
							<td colspan="2" scope="col" class="fstyle02">
								<div>顧客名稱：{{nowCaseCustOrgName}}</div>
								<div>Name</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>統一編號：</div>
								<div>tax ID Number</div>
							</td>
						</tr>
						<tr>
							<td width="30%" scope="col" class="fstyle02">
								<div>聯絡人：</div>
								<div>Contact person</div>
							</td>
							<td width="30%" scope="col" class="fstyle02">
								<div>聯絡電話：</div>
								<div>Phone Number</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>傳真：</div>
								<div>FAX</div>
							</td>
						</tr>
						<tr>
							<td colspan="3" scope="col" class="fstyle02">
								<div>聯絡地址：</div>
								<div>Contact Address</div>
							</td>
						</tr>
						<tr>
							<td colspan="3" scope="col" class="fstyle02">
								<div>報告抬頭：</div>
								<div>Report Title</div>
							</td>
						</tr>
						<tr>
							<td colspan="3" scope="col" class="fstyle02">
								<div>報告地址：</div>
								<div>Report Address</div>
							</td>
						</tr>
					</table>
				</th>
			</tr>
			<tr>
				<th colspan="3">
					<table width="100%" style="border: hidden;">
						<tr>
							<td width="20%" scope="col" class="fstyle02middle">
								<div>校正目的</div>
								<div>Calibration purpose</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>校正目的</div>
							</td>
						</tr>
					</table>
				</th>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02" style="border-bottom: 2px dashed;">
					<div>申請像機類型(請擇一勾選)Camera type(Please choose one)</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02">
					<div><span style="font-family:標楷體;">□</span> 大像幅：感測器元件尺寸大於60 mm × 90 mm (適用大校正場)</div>
					<div style="padding-left: 25px;">Large-format: Sensor size bigger than 60 mm × 90 mm (suitable for big calibration field)</div>
					<div><span style="font-family:標楷體;">□</span> 中像幅：感測器元件尺寸介於24 mm × 36 mm to 60 mm × 90 mm (適用小校正場)</div>
					<div style="padding-left: 25px;">Medium-format: Sensor size between 60 mm × 90 mm and 60 mm × 90 mm<br/>(Suitable for small calibration field)</div>
				</td>
			</tr>
			<tr>
				<th colspan="3">
					<table width="100%" style="border: hidden;">
						<tr>
							<td width="8%" rowspan="4">
								<div class="fstyle02V">校正件基本資料<br/>Calibration Instrument Info</div>
							</td>
							<td width="30%" scope="col" class="fstyle02">
								<div>廠牌：{{nowCaseItemChop}}</div>
								<div>Manufacturer</div>
							</td>
							<td colspan="2" scope="col" class="fstyle02" style="border-left: hidden;">
								<div>型號：{{nowCaseItemModel}}</div>
								<div>Model</div>
							</td>
							<td width="30%" scope="col" class="fstyle02" style="border-left: hidden;">
								<div>序號：{{nowCaseItemSN}}</div>
								<div>Serial Number</div>
							</td>
						</tr>
						<tr>
							<td width="46%" colspan="2" scope="col" class="fstyle02">
								<div>攝影機焦距：</div>
								<div>Focal length</div>
							</td>
							<td width="46%" colspan="2" scope="col" class="fstyle02" style="border-left: hidden;">
								<div>像主點坐標：</div>
								<div>Principal point offset</div>
							</td>
						</tr>
						<tr>
							<td width="46%" colspan="2" scope="col" class="fstyle02">
								<div>感測器像元數量：</div>
								<div>Number of pixels</div>
							</td>
							<td width="46%" colspan="2" scope="col" class="fstyle02" style="border-left: hidden;">
								<div>像元尺寸：</div>
								<div>Pixel size</div>
							</td>
						</tr>
						<tr>
							<td colspan="4" scope="col" class="fstyle02">
								<div>感測器元件尺寸：</div>
								<div>Sensor size</div>
							</td>
						</tr>
					</table>
				</th>
			</tr>
			<tr>
				<th colspan="3">
					<table width="100%" style="border: hidden;">
						<tr>
							<td width="8%" rowspan="4">
								<div class="fstyle02V">飛航拍攝規劃<br/>Flight plan</div>
							</td>
							<td width="46%" scope="col" class="fstyle02">
								<div>預定航拍期間：</div>
								<div>Scheduled flight date</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>影像地面像素解析度：</div>
								<div>GSD (Ground Sample Distance)</div>
							</td>
						</tr>
						<tr>
							<td width="46%" scope="col" class="fstyle02">
								<div>南北向航線：</div>
								<div>Number of North-south strips</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>東西向航線：</div>
								<div>Number of East-west strips</div>
							</td>
						</tr>
						<tr>
							<td width="46%" scope="col" class="fstyle02">
								<div>前後重疊率：</div>
								<div>End Lap</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>側向重疊率：</div>
								<div>Side Lap</div>
							</td>
						</tr>
						<tr>
							<td width="46%" scope="col" class="fstyle02">
								<div>飛航橢球高：</div>
								<div>Ellipsoidal Height</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>飛航離地高：</div>
								<div>AGL (Above Ground Level)</div>
							</td>
						</tr>
					</table>
				</th>
			</tr>
		</table>
		<!-- 以下頁尾 -->
		<div class="fstyle03 tpageFooter">
			<table width="100%">
				<tr>
					<td width="33%" style="border: hidden;">文件編號：SICL-4-15-1</td>
					<td width="33%" style="border: hidden;text-align: center;">1/3</td>
					<td style="border: hidden;text-align: right;">版次：2.4</td>
				</tr>
			</table>
		</div>
  </div>
	<div class="noprint pageline"></div>
	<p style='page-break-after:always'> </p>
	<div class="tpage">
		<div class="fstyle03">
			<div>內政部國土測繪中心</div>
			<div>臺中市南屯區黎明路2段497號4樓 電話：(04)22522966轉206 傳真：(04)22592273</div>
		</div>
		<!-- 以上頁首 -->


		<!-- 以下頁尾 -->
		<div class="fstyle03 tpageFooter">
			<table width="100%">
				<tr>
					<td width="33%" style="border: hidden;">文件編號：SICL-4-15-1</td>
					<td width="33%" style="border: hidden;text-align: center;">2/3</td>
					<td style="border: hidden;text-align: right;">版次：2.4</td>
				</tr>
			</table>
		</div>
	</div>
	<div class="noprint pageline"></div>
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
		position: relative;
    height: 297mm;
    width: 210mm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
    border: solid 1px;
    padding: 8mm 20mm 8mm 20mm;
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
	.noprint{
		display: none;
	}
	.tpage {
		position: relative;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact; 
    height: 297mm;
    width: 210mm;
    /* to centre page on screen*/
    margin-left: auto;
    margin-right: auto;
    border: none;
    padding: 8mm 20mm 8mm 20mm;
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

.pageline{
	height: 20px;
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
  /* height: 30px; */
}

.tpageFooter {
	position: absolute;
	top: 277mm;
	width: 170mm;
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
	padding: 3px 10px 3px 10px;
  font-size: 14px;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	line-height: 18px;
}
.fstyle02middle{
	padding: 3px 0px 3px 0px;
  font-size: 14px;
  font-family: "Times New Roman", 標楷體;
	text-align: center;
  font-weight:normal;
	line-height: 18px;
}
.fstyle02V{
	margin-left: auto;
	margin-right: auto;
  font-size: 14px;
  font-family: "Times New Roman", 標楷體;
	text-align: center;
  font-weight:normal;
	line-height: 16px;
	writing-mode: vertical-lr;
  text-orientation: mixed;
}

.fstyle03{
  font-size: 14px;
  font-family: "Times New Roman", 標楷體;
	text-align: left;
  font-weight:normal;
	margin-bottom: 10px;
}


</style>
