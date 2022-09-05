<script setup>
	// 作業紀錄表(適用航空測量攝影機)
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";

// 引入案件編號
const props = defineProps({
  caseID: String
});

const tableID = computed(()=>{return props.caseID.slice(0,-2)}); //申請單編號
const itemID = computed(()=>{return props.caseID.slice(-2)}); //校正件編號
const nowCaseAppDate = ref(""); // 申請日期
const appDateStr = computed(()=>{
	let dateArray = nowCaseAppDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[1] + "日"
})
const nowCaseOperatorName = ref("");// 校正人員名稱
const nowCaseCalTypeCode = ref(""); //校正項目代碼

const nowCaseCustOrgName = ref("");// 顧客名稱
const nowCaseCustTaxID = ref(""); //統一編號
const nowCaseCustName = ref(""); //聯絡人
const nowCaseCustTel = ref(""); //聯絡電話
const nowCaseCustFax = ref(""); //傳真
const nowCaseCustAddress = ref(""); //聯絡地址
const nowCaseTitle = ref(""); //報告抬頭
const nowCaseAddress = ref(""); //報告地址
const nowCasePurpose = ref(""); //校正目的
const nowCaseCamTypeID = ref(""); // 像機類型
// 校正件
const nowCaseItemChop = ref("");// 廠牌
const nowCaseItemModel = ref("");// 型號
const nowCaseItemSN = ref("");// 序號
const nowCaseFocal = ref("");// 序號
const nowCasePPAx = ref("");// 像主點坐標
const nowCasePPAy = ref("");// 像主點坐標
const nowCasePXh = ref("");// 感測器像元數量
const nowCasePXw = ref("");// 感測器像元數量
const nowCasePxSizeX = ref("");// 像元尺寸
const nowCasePxSizeY = ref("");// 像元尺寸
const nowCaseSizeX = ref("");// 感測器元件尺寸
const nowCaseSizeY = ref("");// 感測器元件尺寸
const nowCaseDistSoft = ref("");// DistSoft
const nowCaseDistVer = ref("");// DistVer
// 飛航規劃
const nowCasePlanY = ref("");// DistVer
const nowCasePlanM = ref("");// DistVer
const nowCaseGSD = ref("");// DistVer
const nowCaseStripsNS = ref("");// DistVer
const nowCaseStripsEW = ref("");// DistVer
const nowCaseEndLap = ref("");// DistVer
const nowCaseSideLap = ref("");// DistVer
const nowCaseEllH = ref("");// DistVer
const nowCaseAGL = ref("");// DistVer
// 檢附資料
const nowCaseCamReport = ref("");// DistVer
const nowCasePlanMap = ref("");// DistVer
// 收費
const nowCaseCharge = ref("");
const nowCaseChargeF = computed(()=>{
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(nowCaseCharge.value)
})

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
		let getData = result.data.getCasebyID;
		let getRecord01 = result.data.getCasebyID.case_record_01;
    let getCust = result.data.getCasebyID.cus;
    let getItem = result.data.getCasebyID.item_base;
		let getOpt = result.data.getCasebyID.employee_case_base_operators_idToemployee;
		
		nowCaseAppDate.value = (getData.app_date)?getData.app_date.split("T")[0]:""; // 申請日期
		nowCaseCalTypeCode.value = (result.data.getCasebyID.cal_type_cal_typeTocase_base)?result.data.getCasebyID.cal_type_cal_typeTocase_base.code:"";
		nowCaseOperatorName.value = (getOpt)?getOpt.name:"";
		// 顧客資料
		nowCaseCustOrgName.value = (getCust) ? getCust.cus_org.name : "";
		nowCaseCustTaxID.value = (getCust) ?getCust.cus_org.tax_id:""; //統一編號
		nowCaseCustName.value = (getCust) ?getCust.name:"";
		nowCaseCustTel.value = (getCust) ?getCust.tel:"";
		nowCaseCustFax.value = (getCust) ?getCust.fax:"";
		nowCaseCustAddress.value = (getCust) ?getCust.address:"";
		nowCaseTitle.value = getData.title;
		nowCaseAddress.value = getData.address;
		nowCasePurpose.value = getData.purpose;
		
		// 校正件資料
    nowCaseItemChop.value = (getItem)?getItem.chop:"";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";

		nowCaseCamTypeID.value = getRecord01.cam_type;
		nowCaseFocal.value = getRecord01.focal;
		nowCasePPAx.value = getRecord01.ppa_x.toFixed(4);
		nowCasePPAy.value = getRecord01.ppa_y.toFixed(4);
		nowCasePXh.value = getRecord01.px_h;
		nowCasePXw.value = getRecord01.px_w;
		nowCasePxSizeX.value = getRecord01.px_size_x.toFixed(2);
		nowCasePxSizeY.value = getRecord01.px_size_y.toFixed(2);
		nowCaseSizeX.value = getRecord01.size_x.toFixed(4);
		nowCaseSizeY.value = getRecord01.size_y.toFixed(4);
		nowCaseDistSoft.value = getRecord01.distor_corr_soft;
		nowCaseDistVer.value = getRecord01.distor_corr_ver;
		// 飛航規劃
		nowCasePlanY.value = getRecord01.plan_year;
		nowCasePlanM.value = getRecord01.plan_month;
		nowCaseGSD.value = getRecord01.gsd;
		nowCaseStripsNS.value = getRecord01.strips_ns;
		nowCaseStripsEW.value = getRecord01.strips_ew;
		nowCaseEndLap.value = getRecord01.end_lap;
		nowCaseSideLap.value = getRecord01.side_lap;
		nowCaseEllH.value = getRecord01.ell_height;
		nowCaseAGL.value = getRecord01.agl;
		// 檢附資料
		nowCaseCamReport.value = (getRecord01.cam_report)?getRecord01.cam_report:"";
		nowCasePlanMap.value = (getRecord01.plan_map)?getRecord01.plan_map:"";

		// 收費
		nowCaseCharge.value = getData.charge;
  }
});
refgetNowCaseF();
</script>

<template>

	<div class="header fstyle02 w-100">
		<div>內政部國土測繪中心</div>
		<div>臺中市南屯區黎明路2段497號4樓 電話：(04)22522966轉206 傳真：(04)22592273</div>
	</div>
	<div class="footer fstyle02 w-100">
		<table  width="100%" style="border: hidden;">
			<tr>
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-15-1</td>
				<td width="33%" style="text-align: center;border: hidden;">/3</td>
				<td style="text-align: right;border: hidden;">版次：2.4</td>
			</tr>
		</table>
	</div>

	<div class="page">
		<table width="100%">
			<!-- 表單名稱 -->
			<div class="fstyle01">
				<div class="fstyle01C">校正申請表(適用航空測量攝影機)</div>
				<div>Calibration Application Form</div>
				<div style="margin-bottom: 20px;">(apply for aerial photogrammetric camera)</div>
			</div>
			<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
				<!-- 申請表資料 -->
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
						<div>申請日期：{{appDateStr}}</div>
						<div>Application Date</div>
					</td>
				</tr>
				<!-- 顧客資料 -->
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
									<div>統一編號：{{nowCaseCustTaxID}}</div>
									<div>tax ID Number</div>
								</td>
							</tr>
							<tr>
								<td width="28%" scope="col" class="fstyle02 nowrap">
									<div>聯絡人：{{nowCaseCustName}}</div>
									<div>Contact person</div>
								</td>
								<td width="28%" scope="col" class="fstyle02 nowrap">
									<div>聯絡電話：{{nowCaseCustTel}}</div>
									<div>Phone Number</div>
								</td>
								<td scope="col" class="fstyle02 nowrap">
									<div>傳真：{{nowCaseCustFax}}</div>
									<div>FAX</div>
								</td>
							</tr>
							<tr>
								<td colspan="3" scope="col" class="fstyle02 nowrap">
									<div>聯絡地址：{{nowCaseCustAddress}}</div>
									<div>Contact Address</div>
								</td>
							</tr>
							<tr>
								<td colspan="3" scope="col" class="fstyle02">
									<div>報告抬頭：{{nowCaseTitle}}</div>
									<div>Report Title</div>
								</td>
							</tr>
							<tr>
								<td colspan="3" scope="col" class="fstyle02">
									<div>報告地址：{{nowCaseAddress}}</div>
									<div>Report Address</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
				<!-- 校正目的 -->
				<tr>
					<th colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
								<td width="25%" scope="col" class="fstyle02mid">
									<div>校正目的</div>
									<div>Calibration purpose</div>
								</td>
								<td scope="col" class="fstyle02">
									<div>{{nowCasePurpose}}</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
				<!-- 像機類型 -->
				<tr>
					<td colspan="3" class="fstyle02" style="border-bottom: 2px dashed;">
						<div>申請像機類型(請擇一勾選)Camera type(Please choose one)</div>
					</td>
				</tr>
				<tr>
					<td colspan="3" class="fstyle02">
						<div><span v-if="nowCaseCamTypeID === 1" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> 大像幅：感測器元件尺寸大於60 mm × 90 mm (適用大校正場)</div>
						<div style="padding-left: 25px;">Large-format: Sensor size bigger than 60 mm × 90 mm (suitable for big calibration field)</div>
						<div><span v-if="nowCaseCamTypeID === 2" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> 中像幅：感測器元件尺寸介於24 mm × 36 mm to 60 mm × 90 mm (適用小校正場)</div>
						<div style="padding-left: 25px;">Medium-format: Sensor size between 60 mm × 90 mm and 60 mm × 90 mm<br/>(Suitable for small calibration field)</div>
					</td>
				</tr>
				<!-- 校正件基本資料 -->
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
									<div>攝影機焦距：{{nowCaseFocal}}mm</div>
									<div>Focal length</div>
								</td>
								<td width="46%" colspan="2" scope="col" class="fstyle02" style="border-left: hidden;">
									<div>像主點坐標：{{nowCasePPAx}} × {{nowCasePPAy}}</div>
									<div>Principal point offset</div>
								</td>
							</tr>
							<tr>
								<td width="46%" colspan="2" scope="col" class="fstyle02">
									<div>感測器像元數量：{{nowCasePXh}} × {{nowCasePXw}}</div>
									<div>Number of pixels</div>
								</td>
								<td width="46%" colspan="2" scope="col" class="fstyle02" style="border-left: hidden;">
									<div>像元尺寸：{{nowCasePxSizeX}} um × {{nowCasePxSizeY}} um</div>
									<div>Pixel size</div>
								</td>
							</tr>
							<tr>
								<td colspan="4" scope="col" class="fstyle02">
									<div>感測器元件尺寸：{{nowCaseSizeX}} mm × {{nowCaseSizeY}} mm</div>
									<div>Sensor size</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
				<!-- 飛航規劃 -->
				<tr>
					<th colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
								<td width="8%" rowspan="4">
									<div class="fstyle02V">飛航拍攝規劃<br/>Flight plan</div>
								</td>
								<td width="46%" scope="col" class="fstyle02">
									<div>預定航拍期間：{{nowCasePlanY}} 年{{nowCasePlanM}} 月</div>
									<div>Scheduled flight date</div>
								</td>
								<td scope="col" class="fstyle02">
									<div>影像地面像素解析度：{{nowCaseGSD}} cm</div>
									<div>GSD (Ground Sample Distance)</div>
								</td>
							</tr>
							<tr>
								<td width="46%" scope="col" class="fstyle02">
									<div>南北向航線：{{nowCaseStripsNS}} 條</div>
									<div>Number of North-south strips</div>
								</td>
								<td scope="col" class="fstyle02">
									<div>東西向航線：{{nowCaseStripsEW}} 條</div>
									<div>Number of East-west strips</div>
								</td>
							</tr>
							<tr>
								<td width="46%" scope="col" class="fstyle02">
									<div>前後重疊率：{{nowCaseEndLap}} %</div>
									<div>End Lap</div>
								</td>
								<td scope="col" class="fstyle02">
									<div>側向重疊率：{{nowCaseSideLap}} %</div>
									<div>Side Lap</div>
								</td>
							</tr>
							<tr>
								<td width="46%" scope="col" class="fstyle02">
									<div>飛航橢球高：{{nowCaseEllH}} m</div>
									<div>Ellipsoidal Height</div>
								</td>
								<td scope="col" class="fstyle02">
									<div>飛航離地高：{{nowCaseAGL}} m</div>
									<div>AGL (Above Ground Level)</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
			</table>
		</table>
	</div>
	<div class="page-gap"></div>
	<div class="page">
		<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
			<!-- 應檢附資料 -->
			<tr>
				<td colspan="3" class="fstyle02 bggray" style="border-bottom: 2px dashed;">
					<div>應檢附資料：</div>
					<div>Attach information</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02 bggray" style="border-bottom: 2px dashed;">
					<div><span v-if="nowCaseCamReport !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> 攝影機原廠規格書或率定報告，檔名：{{nowCaseCamReport}}</div>
					<div style="padding-left: 25px;">OEM specification or calibration report of camera, filename</div>
					<div style="padding-left: 25px;">※所附資料應含攝影機鏡頭畸變差糾正相關資訊，倘無法提供相關糾正資訊，則視為無鏡頭畸變差無影響，相關糾正參數均為零。</div>
					<div style="padding-left: 25px;">※The attached information should contain information on camera lens distortion correction. If the relevant correction information cannot be provided, it will be considered as no distortion of the lens distortion, and the relevant correction parameter is zero.</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02 bggray">
					<div><span v-if="nowCasePlanMap !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> 飛行航線規劃圖(dwg或shp檔)，檔名：{{nowCasePlanMap}}</div>
					<div style="padding-left: 25px;">Flight planning map (dwg or shp), filename</div>
				</td>
			</tr>
			<tr style="border-bottom: none; border-left: none">
				<td width="40%" style="border-bottom: none; border-left: none">
				</td>
				<td width="25%" class="fstyle02mid">
					<div>校正人員</div>
					<div>Calibration Person</div>
				</td>
				<td class="fstyle02mid">{{nowCaseOperatorName}}
				</td>
			</tr>
		</table>
	</div>
	<div class="page-gap"></div>
	<div class="page">
		<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
			<!-- 收費 -->
			<tr>
				<td width="8%" class="fstyle02mid">
					<div>收費</div>
					<div>Price</div>
				</td>
				<td colspan="3" class="fstyle03">
					<div>費用合計新臺幣{{nowCaseChargeF}}元整，領取校正報告前請先繳費。</div>
					<div>Total amount of payment （NT dollars）{{nowCaseChargeF}}，Please complete payment before receiving the calibration report.</div>
				</td>
			</tr>
			<!-- 注意事項 -->
			<tr>
				<td width="8%"  class="fstyle02Vleft">
					<p>注意事項<br/>Precautions</p>
				</td>
				<td colspan="3" class="fstyle03">
					<ol style="padding-left: 20px;">
						<li>
							<div>請參考本實驗室服務網（網址：https://sicl-nlsc.moi.gov.tw/）下載專區公告之校正航拍作業須知，辦理航線圖設計及飛航規劃，以利辦理校正作業。</div>
							<div>Please refer to the laboratory website (https://sicl-nlsc.moi.gov.tw/) to download the procedure for aerial photograph calibration. To facilitate the calibration operation, organize and design the aerial route and flight planning at first.</div>
						</li>
						<li>
							<div>請自行指定校正件操作人員，並辦理其能力評估及授權後，方可至辦理航空測量攝影機校正場航拍作業，作業結果並詳實記錄於校正航拍成果表（請至本實驗室服務網下載）。航拍成果交付當天將進行檢查，倘發現不符合校正作業要求時，將請顧客補件或退件。</div>
							<div>Specify the program operator and perform its capability assessment and authorization before going to calibration field for aerial photograph. The results should recorded in detail in calibrate aerial photograph results table. The aerial photograph results will be inspected on delivering day. If it is found to be inconsistent with the calibration requirements, the customer will be requested to replenish or return data.</div>		
						</li>
						<li>
							<div class="fbolder">顧客案件經申請審核通過後，應於三個月內完成航拍作業，並將航拍成果送至本實驗室辦理校正作業；超出期限時，本實驗室將通知顧客並予以退件。</div>
							<div>After the customer's case has been approved by the application, the aerial photography should be completed in three months, and the aerial photography results should be sent to the laboratory for calibration work; when the time limit is exceeded, the laboratory will notify the customer and return the case.</div>
						</li>
						<li>
							<div>校正航拍成果通過書面檢查，但仍可能於校正作業中發現異常現象而無法校正，則再另行通知。</div>
							<div>If an abnormality is found in the calibration work and cannot be corrected even through calibrated aerial photograph results pass documentary review, it will be notified separately.</div>
						</li>
						<li>
							<div>校正件校正完畢後，請先付費後領取校正報告。</div>
							<div>After calibrating, the applicant should complete payment  before receiving the calibration report.</div>
						</li>
						<li>
							<div>本實驗室經通知顧客校正完畢或退件後，最長代管顧客設備15個工作天，逾期不領回恕不負責。</div>
							<div>After calibrating and notifying the applicant, the longest time of instrument escrow is 15 working days. If it is overdue for retrieve, we do not take any responsibility for instrument.</div>
						</li>
						<li>
							<div>顧客倘對校正報告內容有疑問，請於15個工作天內向本實驗室反應，逾期恕不受理。</div>
							<div>If there is any questions about the report, please contact us within 15 working days, and it will not be accepted over the time limit.</div>
						</li>
						<li>
							<div>本表經顧客及收件人簽章後，即具「委託契約」效力，實驗室應影印1份供顧客留存。</div>
							<div>This form is valid after the signing of the applicant and the recipient, and we shall copy this form for the applicant to keep.</div>
						</li>
						<li>
							<div>顧客簽章後即同意所委託之校正作業依照本實驗室所訂之作業程序執行，並同意遵守本實驗室所有校正作業相關規定事宜。</div>
							<div>After signing, the customer agrees that the calibration operation entrusted will be performed in accordance with the operating procedures set by the laboratory, and agrees to abide by all relevant regulations of the laboratory.</div>
						</li>
					</ol>
				</td>
			</tr>
			<!-- 簽章欄 -->
			<tr>
				<td rowspan="4" colspan="3" width="60%" class="fstyle03mid">
					<div>本件為網路收件，已電子郵件請顧客確認，無需雙方簽章。</div>
				</td>
				<td class="fstyle03mid">
					<div>收費簽章</div>
					<div>signature after charge</div>
				</td>
			</tr>
			<tr>
				<td height="50px">
				</td>
			</tr>
			<tr>
				<td class="fstyle03mid">
					<div>收據編號</div>
					<div>Receipt number</div>
				</td>
			</tr>
			<tr>
				<td height="50px">
				</td>
			</tr>
		</table>
	</div>



</template>
<style>
@media screen {
	html, body{
		width: 210mm;
		height: 297mm;
		margin-left: auto;
		margin-right: auto;
	}
	.header{
		display: none;
	}
	.footer{
		display: none;
	}
	.page{
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
	.page-gap{
		height: 20px;
	}
	tr,td {
		border: 1px solid;
		page-break-inside: avoid;
		/* white-space:nowrap; */
		/* overflow: hidden; */
		/* height: 30px; */
	}

}
@page {
  size: A4 portrait; /* 混合使用 */
  margin: 1cm 2cm; /* 邊界與內容的距離 */
	orphans:0;
  widows:0;
}
@media print{
	html, body{
		height: 100%;
		margin: 0;
		counter-reset: page-number;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
		/* border: 1px solid red; */
	}
	.header{
		position: fixed;
	}
	.footer{
		position: fixed;
		bottom: 0;
	}
	.page{
		/* border: 1px solid blue; */
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 1.5cm;
		padding-bottom: 1.5cm;
		page-break-inside: avoid;
		page-break-before: always;
	}
	.page::after{
		counter-increment: page-number;
		content: counter(page-number);
		position: absolute;
		right: 88mm;
		bottom: 0;
		font-size: 12pt;
		font-family: "Times New Roman", 標楷體;
		font-weight:normal;
		text-align: right;
	}
	.page-gap{
		display: none;
	}
	.noprint{
		display: none;
	}
	tr,td {
		border: 1.5px solid;
		page-break-inside: avoid;
		/* white-space:nowrap; */
		/* overflow: hidden; */
		/* height: 30px; */
	}
	
}
.wingdings2{
		font-family: 'Wingdings 2';
		font-size: 16pt;
		vertical-align:middle;
	}
.nowrap{
	white-space:nowrap;
}

.bggray{
	background-color: #f3f3f3;
}

.sicltab01 {
  /* border: 1px solid; */
  border-collapse: collapse;
}

.fstyle01, .fstyle01C, .fstyle02, .fstyle02mid, .fstyle02V, .fstyle02Vleft, .fstyle03, .fstyle03mid{
	font-family: "Times New Roman", 標楷體;
}

.fbolder{
	font-weight:bolder;
}

.fstyle01, .fstyle01C{
	text-align: center;
  font-size: 24pt;
  font-weight:bold;
	line-height: 1;
}

.fstyle01C{
	letter-spacing: 5px;
}

.fstyle02, .fstyle02mid{
	padding: 3px 10px 3px 10px;
  font-size: 12pt;
	line-height: 1;
	font-weight:normal;
}

.fstyle02{
	text-align: left;
}
.fstyle02mid{
	text-align: center;
}

.fstyle02V, .fstyle02Vleft{
	margin-left: auto;
	margin-right: auto;
  font-size: 12pt;
	font-weight:normal;
	line-height: 1.2;
	writing-mode: vertical-lr;
  text-orientation: mixed;
	white-space:nowrap;
}

.fstyle02V{
	text-align: center;
}

.fstyle02Vleft{
	text-align: left;
  padding-top: 10px;
}

.fstyle03, .fstyle03mid{
	padding: 3px 10px 3px 10px;
  font-size: 10pt;
  font-weight:normal;
	line-height: 1.3;
}

.fstyle03{
	text-align: left;
}
.fstyle03mid{
	text-align: center;
}
</style>
