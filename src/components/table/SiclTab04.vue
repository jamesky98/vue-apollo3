<script setup>
	// 校正申請表(適用空載光達)
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
const isFullPara = ref(true);
const nowCaseItemChop = ref("");// 廠牌
const nowCaseItemModel = ref("");// 型號
const nowCaseItemSN = ref("");// 序號

const nowCaseParaType = ref("");  // 規格參數類型1:各項均有 2:整合精度

const nowCaseLrDisPrs = ref("");  // LIDAR設備測距精度
const nowCaseLrAngResol = ref("");  // LIDAR設備掃描角解析度
const nowCaseLrBeam = ref("");  // LIDAR設備發散角

const nowCaseGnssID = ref("");  // GNSS設備索引
const nowCaseGnssChop = ref("");  // GNSS設備廠牌
const nowCaseGnssModel = ref("");  // GNSS設備型號
const nowCaseGnssSN = ref("");  // GNSS設備序號
const nowCaseGnssPrcH = ref("");  // GNSS設備水平精度 或 整合型平面精度
const nowCaseGnssPrcV = ref("");  // GNSS設備高程精度 或 整合型高程精度

const nowCaseImuID = ref("");  // IMU設備索引
const nowCaseImuChop = ref("");  // IMU設備廠牌
const nowCaseImuModel = ref("");  // IMU設備型號
const nowCaseImuSN = ref("");  // IMU設備序號
const nowCaseImuOmg = ref("");  // IMU設備Omega精度
const nowCaseImuPhi = ref("");  // IMU設備Phi精度
const nowCaseImuKap = ref("");  // IMU設備Kappa精度
const nowCaseImuPrcO = ref("");  // IMU設備姿態角解析度

const nowCasePlanY = ref(""); // 預定拍攝年
const nowCasePlanM = ref(""); // 預定拍攝月
const nowCaseStrips = ref(""); // 航帶總數
const nowCaseEllH = ref(""); // 飛航橢球高
const nowCaseAGL = ref(""); // 飛航離地高

const nowCasePtDensity = ref(""); // 單航帶點雲密度
const nowCaseFOV = ref(""); // 最大掃描角FOV

const nowCaseLrReport = ref(""); // LiDAR規格
const nowCasePosReport = ref(""); // POS規格
const nowCasePlanMap = ref(""); // 航線規劃圖

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
		let getRecord02 = result.data.getCasebyID.case_record_02;
		let getGNSS = result.data.getCasebyID.case_record_02.item_base_case_record_02_gnss_idToitem_base;
		let getIMU = result.data.getCasebyID.case_record_02.item_base_case_record_02_imu_idToitem_base;
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
		// 參數型態
		nowCaseParaType.value = getRecord02.type;
		(getRecord02.type === 1) ? isFullPara.value = true : isFullPara.value = false;

		// LiDAR規格
    nowCaseLrDisPrs.value = getRecord02.dis_presision;
    nowCaseLrAngResol.value = getRecord02.ang_resolution;
    nowCaseLrBeam.value = getRecord02.beam;

		// GNSS規格
    nowCaseGnssChop.value = (getGNSS) ? getGNSS.chop:"";
    nowCaseGnssModel.value = (getGNSS) ? getGNSS.model : "";
    nowCaseGnssSN.value = (getGNSS) ? getGNSS.serial_number : "";
    nowCaseGnssPrcH.value = getRecord02.prec_h; // 等同整合型平面精度
    nowCaseGnssPrcV.value = getRecord02.prec_v; // 等同整合型高程精度
		
		// IMU規格
    nowCaseImuChop.value = (getIMU) ? getIMU.chop:"";
    nowCaseImuModel.value = (getIMU) ? getIMU.model : "";
    nowCaseImuSN.value = (getIMU) ? getIMU.serial_number : "";
    nowCaseImuOmg.value = getRecord02.omega;
    nowCaseImuPhi.value = getRecord02.phi;
    nowCaseImuKap.value = getRecord02.kappa;
    nowCaseImuPrcO.value = getRecord02.prec_ori;

    // 飛航規劃
		nowCasePlanY.value = getRecord02.plan_year;
    nowCasePlanM.value = getRecord02.plan_month;
    nowCaseStrips.value = getRecord02.strips_no
    nowCaseEllH.value = getRecord02.ell_height;
    nowCaseAGL.value = getRecord02.agl;
    nowCasePtDensity.value = getRecord02.cloud_density;
    nowCaseFOV.value = getRecord02.fov;

		// 檢附資料
		nowCaseLrReport.value = (getRecord02.lidar_report)?getRecord02.lidar_report:"";
    nowCasePosReport.value = (getRecord02.pos_report)?getRecord02.pos_report:"";
    nowCasePlanMap.value = (getRecord02.plan_map)?getRecord02.plan_map:"";
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
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-15-2</td>
				<td width="33%" style="text-align: center;border: hidden;">/3</td>
				<td style="text-align: right;border: hidden;">版次：2.4</td>
			</tr>
		</table>
	</div>

	<div class="page">
		<table width="100%">
			<!-- 表單名稱 -->
			<div class="fstyle01">
				<div class="fstyle01C">校正申請表(適用空載光達)</div>
				<div>Calibration Application Form</div>
				<div style="margin-bottom: 20px;">(apply for airborne LiDAR)</div>
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
								<td width="25%" scope="col" class="fstyle03mid">
									<div>校正目的</div>
									<div>Calibration purpose</div>
								</td>
								<td scope="col" class="fstyle03">
									<div>{{nowCasePurpose}}</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
				<!-- 校正件基本資料 -->
				<tr>
					<td colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
							<td width="33%" scope="col" class="fstyle03 nowrap">
								<div>廠牌：{{nowCaseItemChop}}</div>
								<div>Manufacturer</div>
							</td>
							<td width="33%" scope="col" class="fstyle03 nowrap">
								<div>型號：{{nowCaseItemModel}}</div>
								<div>Model</div>
							</td>
							<td scope="col" class="fstyle03 nowrap">
								<div>序號：{{nowCaseItemSN}}</div>
								<div>Serial Number</div>
							</td>
						</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td colspan="3" class="fstyle03mid bggray1">
						<div class="fbolder">請擇一勾選填寫Please select one to fill in</div>
					</td>
				</tr>
				<tr>
					<td colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
								<td width="55%" colspan="5" scope="col" class="fstyle03mid bggray1">
									<div class="fbolder">
										<span v-if="isFullPara" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>
										具各項系統規格參數
									</div>
									<div class="fbolder">has various system specifications</div>
								</td>
								<td scope="col" class="fstyle03mid bggray1">
									<div class="fbolder">
										<span v-if="!isFullPara" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>
										具空載光達系統整合精度
									</div>
									<div class="fbolder">has LiDAR integration accuracy</div>
								</td>
							</tr>
							<tr>
								<td colspan="5" scope="col" class="fstyle03">
									<div>雷射掃描儀規格Scanner specification</div>
								</td>
								<td scope="col" style="border-bottom: hidden;"></td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td colspan="4" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">測距精度：{{nowCaseLrDisPrs}} mm</div>
									<div v-else>測距精度：</div>
									<div>Distance Precision</div>
								</td>
								<td scope="col" class="fstyle03">
									<div v-if="!isFullPara" >平面精度：{{nowCaseGnssPrcH}} mm</div>
									<div v-else>平面精度：</div>
									<div>Horizontal Precision</div>
								</td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td colspan="4" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">雷射掃描角解析度：{{nowCaseLrAngResol}} "</div>
									<div v-else>雷射掃描角解析度：</div>
									<div>Scanner Angular resolution</div>
								</td>
								<td scope="col" class="fstyle03">
									<div v-if="!isFullPara">高程精度：{{nowCaseGnssPrcV}} mm</div>
									<div v-else>高程精度：</div>
									<div>Elevation Precision</div>
								</td>
							</tr>
							<tr>
								<td width="3%" scope="col"></td>
								<td colspan="4" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">雷射掃描儀發散角：{{nowCaseLrBeam}} "</div>
									<div v-else>雷射掃描儀發散角：</div>
									<div>Laser Beam divergence</div>
								</td>
								<td rowspan="9" scope="col"></td>
							</tr>
							<tr>
								<td colspan="5" scope="col" class="fstyle03">
									<div>GNSS規格GNSS specification</div>
								</td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>廠牌：{{nowCaseGnssChop}}</div>
									<div>Manufacturer</div>
								</td>
								<td colspan="2" scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>型號：{{nowCaseGnssModel}}</div>
									<div>Model</div>
								</td>
								<td scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>序號：{{nowCaseGnssSN}}</div>
									<div>Serial Number</div>
								</td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td colspan="4" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">平面定位精度：{{nowCaseGnssPrcH}} mm</div>
									<div v-else>平面定位精度：</div>
									<div>Horizontal Precision</div>
								</td>
							</tr>
							<tr>
								<td width="3%" scope="col"></td>
								<td colspan="4" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">高程定位精度：{{nowCaseGnssPrcV}} mm</div>
									<div v-else>高程定位精度：</div>
									<div>Elevation Precision</div>
								</td>
							</tr>
							<tr>
								<td colspan="5" scope="col" class="fstyle03">
									<div>IMU規格IMU specification</div>
								</td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>廠牌：{{nowCaseImuChop}}</div>
									<div>Manufacturer</div>
								</td>
								<td colspan="2" scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>型號：{{nowCaseImuModel}}</div>
									<div>Model</div>
								</td>
								<td scope="col" class="fstyle03 nowrap" style="border-left: hidden;">
									<div>序號：{{nowCaseImuSN}}</div>
									<div>Serial Number</div>
								</td>
							</tr>
							<tr style="border-bottom: hidden;">
								<td width="3%" scope="col"></td>
								<td colspan="2" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">ω測角精度：{{nowCaseImuOmg}} "</div>
									<div v-else>ω測角精度：</div>
									<div>Omega Precision</div>
								</td>
								<td colspan="2" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">φ測角精度：{{nowCaseImuPhi}} "</div>
									<div v-else>φ測角精度：</div>
									<div>Phi Precision</div>
								</td>
							</tr>
							<tr>
								<td width="3%" scope="col"></td>
								<td colspan="2" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">κ測角精度：{{nowCaseImuKap}} "</div>
									<div v-else>κ測角精度：</div>
									<div>Kappa Precision</div>
								</td>
								<td colspan="2" scope="col" class="fstyle03" style="border-left: hidden;">
									<div v-if="isFullPara">姿態角解析度：{{nowCaseImuPrcO}} "</div>
									<div v-else>姿態角解析度：</div>
									<div>Orientation resolution</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</table>
	</div>
	<div class="page-gap"></div>
	<div class="page">
		<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
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
								<div>航帶總數：{{nowCaseStrips}}</div>
								<div>strip number</div>
							</td>
						</tr>
						<tr>
							<td scope="col" class="fstyle02">
								<div>飛航橢球高：{{nowCaseEllH}} m</div>
								<div>Ellipsoidal Height</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>飛航離地高：{{nowCaseAGL}} m</div>
								<div>AGL (Above Ground Level)</div>
							</td>
						</tr>
						<tr>
							<td scope="col" class="fstyle02">
								<div>單航線平均點雲密度：{{nowCasePtDensity}} 點/m<sup>2</sup></div>
								<div>average point density</div>
							</td>
							<td scope="col" class="fstyle02">
								<div>最大掃描角：{{nowCaseFOV}} °</div>
								<div>FOV（Filed of View）</div>
							</td>
						</tr>
					</table>
				</th>
			</tr>
			<!-- 應檢附資料 -->
			<tr>
				<td colspan="3" class="fstyle02 bggray2" style="border-bottom: 2px dashed;">
					<div>應檢附資料：</div>
					<div>Attach information</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02 bggray2" style="border-bottom: 2px dashed;">
					<div><span v-if="nowCaseLrReport !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> LiDAR原廠規格書或率定報告，檔名：{{nowCaseLrReport}}</div>
					<div style="padding-left: 25px;">Lidar OEM specification or calibration report, filename</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02 bggray2" style="border-bottom: 2px dashed;">
					<div><span v-if="nowCasePosReport !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> POS原廠規格書或率定報告，檔名：{{nowCasePosReport}}</div>
					<div style="padding-left: 25px;">POS OEM specification or calibration report, filename</div>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="fstyle02 bggray2">
					<div><span v-if="nowCasePlanMap !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> 飛行航線規劃圖(dwg或shp檔)，檔名：{{nowCasePlanMap}}</div>
					<div style="padding-left: 25px;">Flight planning map (*.dwg / *.shp), filename</div>
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
				<td colspan="3" class="fstyle03" style="line-height: 1.1;">
					<ol style="padding-left: 20px;">
						<li>
							<div>請參考本實驗室服務網（網址：https://sicl-nlsc.moi.gov.tw/）下載專區公告之校正掃描作業須知，辦理航線圖設計及飛航規劃，以利辦理校正作業。</div>
							<div>Please refer to the laboratory website (https://sicl-nlsc.moi.gov.tw/) to download the procedure for aerial photograph calibration. To facilitate the calibration operation, organize and design the aerial route and flight planning at first.</div>
						</li>
						<li>
							<div>請自行指定校正件操作人員，並辦理其能力評估及授權後，方可至本實驗室空載光達校正場辦理掃描作業，作業結果並詳實記錄於校正掃描成果表（請至本實驗室服務網下載）。掃描成果交付當天將進行檢查，倘發現不符合校正作業要求時，將請顧客補件或退件。</div>
							<div>Specify the program operator and perform its capability assessment and authorization before going to calibration field for LiDAR scan. The results should recorded in detail in calibrate LiDAR scan results table. The LiDAR scan results will be inspected on delivering day. If it is found to be inconsistent with the calibration requirements, the customer will be requested to replenish or return data.</div>		
						</li>
						<li>
							<div class="fbolder">顧客案件經申請審核通過後，應於三個月內完成掃描作業，並將掃描成果送至本實驗室辦理校正作業；超出期限時，本實驗室將通知顧客並予以退件。</div>
							<div>After the customer's case has been approved by the application, the LiDAR scan should be completed in three months, and the LiDAR scan results should be sent to the laboratory for calibration work; when the time limit is exceeded, the laboratory will notify the customer and return the case.</div>
						</li>
						<li>
							<div>校正掃描成果通過書面檢查，但仍可能於校正作業中發現異常現象而無法校正，則再另行通知。</div>
							<div>If an abnormality is found in the calibration work and cannot be corrected even through calibrated LiDAR scan results pass documentary review, it will be notified separately.</div>
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
.bggray1{
	background-color: #d9d9d9;
}

.bggray2{
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
	line-height: 1;
}

.fstyle03{
	text-align: left;
}
.fstyle03mid{
	text-align: center;
}

</style>
