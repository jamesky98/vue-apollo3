<script setup>
	// 校正申請表(適用車載光達)
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useMutation } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import { errorHandle, logIn, logOut, toTWDate } from '../../methods/User';

// 引入案件編號
const props = defineProps({
  caseID: String
});
const infomsg = ref('');
const alert1 =ref(false);

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

const nowCasePlanDate = ref(""); // 預定拍攝日期
const nowCasePtDensity = ref(""); // 單航帶點雲密度

const nowCaseLrReport = ref(""); // LiDAR規格
const nowCasePosReport = ref(""); // POS規格
const nowCasePlanMap = ref(""); // 航線規劃圖

// 收費
const nowCaseCharge = ref("");
const nowCaseChargeF = computed(()=>{
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(nowCaseCharge.value)
})

// 查詢Case_Record資料
const { 
	onDone: getNowCaseF, 
	mutate: refgetNowCaseF,
	onError: getNowCaseFonError
} = useMutation(
  CaseGQL.GETFULLCASEBYID,
  () => ({
		variables: {
			getCasebyIdId: props.caseID
		}
  })
);
getNowCaseFonError(e=>{errorHandle(e,infomsg,alert1)});
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // console.log(result.data.getCasebyID);
    // 填入資料
		let getData = result.data.getCasebyID;
		let getRecord03 = result.data.getCasebyID.case_record_03;
		let getGNSS = result.data.getCasebyID.case_record_03.item_base_case_record_03_gnss_idToitem_base;
		let getIMU = result.data.getCasebyID.case_record_03.item_base_case_record_03_imu_idToitem_base;
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
		nowCaseParaType.value = getRecord03.type;
		(getRecord03.type === 1) ? isFullPara.value = true : isFullPara.value = false;

		// LiDAR規格
    nowCaseLrDisPrs.value = getRecord03.dis_presision;
    nowCaseLrAngResol.value = getRecord03.ang_resolution;
    nowCaseLrBeam.value = getRecord03.beam;

		// GNSS規格
    nowCaseGnssChop.value = (getGNSS) ? getGNSS.chop:"";
    nowCaseGnssModel.value = (getGNSS) ? getGNSS.model : "";
    nowCaseGnssSN.value = (getGNSS) ? getGNSS.serial_number : "";
    nowCaseGnssPrcH.value = getRecord03.prec_h; // 等同整合型平面精度
    nowCaseGnssPrcV.value = getRecord03.prec_v; // 等同整合型高程精度
		
		// IMU規格
    nowCaseImuChop.value = (getIMU) ? getIMU.chop:"";
    nowCaseImuModel.value = (getIMU) ? getIMU.model : "";
    nowCaseImuSN.value = (getIMU) ? getIMU.serial_number : "";
    nowCaseImuOmg.value = getRecord03.omega;
    nowCaseImuPhi.value = getRecord03.phi;
    nowCaseImuKap.value = getRecord03.kappa;
    nowCaseImuPrcO.value = getRecord03.prec_ori;

    // 掃描規劃
		nowCasePlanDate.value = getRecord03.plan_date;
    nowCasePtDensity.value = getRecord03.cloud_density;

		// 檢附資料
		nowCaseLrReport.value = (getRecord03.lidar_report)?getRecord03.lidar_report:"";
    nowCasePosReport.value = (getRecord03.pos_report)?getRecord03.pos_report:"";
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
			<!-- 表單名稱 -->
			<div class="fstyle01">
				<div class="fstyle01C">校正申請表(適用空載光達)</div>
				<div>Calibration Application Form</div>
				<div style="margin-bottom: 10px;">(apply for airborne LiDAR)</div>
			</div>
			<div class="d-flex flex-wrap g-0 p-0">
				<!-- 申請單號 -->
				<div class="col-5 fstyle02 bl_t_5 bl_r_2 bl_b_5 bl_l_5">
					<div>申請單編號：{{tableID}}</div>
					<div>Application Number</div>
				</div>
				<div class="col-3 fstyle02 bl_t_5 bl_r_5 bl_b_5">
					<div>校正件編號：{{itemID}}</div>
					<div>Item Number</div>
				</div>
				<div class="col-4 fstyle02 bl_t_2 bl_r_2 bl_b_2">
					<div>申請日期：{{appDateStr}}</div>
					<div>Application Date</div>
				</div>
				<!-- 顧客資料 -->
				<div class="col-1 fstyle02 d-flex align-items-center bl_r_2 bl_l_2">
					<div class="fstyle02V">
						顧客資料<br/>Applicant information
					</div>
				</div>
				<div class="col-11 p-0">
					<div class="d-flex flex-wrap g-0 p-0">
						<div class="col-8 fstyle02 bl_r bl_b">
							<div>顧客名稱：{{nowCaseCustOrgName}}</div>
							<div>Name</div>
						</div>
						<div class="col-4 fstyle02 bl_r_2 bl_b">
							<div>統一編號：{{nowCaseCustTaxID}}</div>
							<div>tax ID Number</div>
						</div>

						<div class="col-3 fstyle02 bl_r bl_b">
							<div>聯絡人：{{nowCaseCustName}}</div>
							<div>Contact person</div>
						</div>
						<div class="col-5 fstyle02 bl_r bl_b">
							<div>聯絡電話：{{nowCaseCustTel}}</div>
							<div>Phone Number</div>
						</div>
						<div class="col-4 fstyle02 bl_r_2 bl_b">
							<div>傳真：{{nowCaseCustFax}}</div>
							<div>FAX</div>
						</div>
						<div class="col-12 fstyle02 bl_r_2 bl_b">
							<div>聯絡地址：{{nowCaseCustAddress}}</div>
							<div>Contact Address</div>
						</div>
						<div class="col-12 fstyle02 bl_r_2 bl_b">
							<div>報告抬頭：{{nowCaseTitle}}</div>
							<div>Report Title</div>
						</div>
						<div class="col-12 fstyle02 bl_r_2">
							<div>報告地址：{{nowCaseAddress}}</div>
							<div>Report Address</div>
						</div>
					</div>
				</div>
				<!-- 校正目的 -->
				<div class="col-3 fstyle02 bl_t_2 bl_r_2 bl_b_2 bl_l_2">
					<div>校正目的</div>
					<div>Calibration purpose</div>
				</div>
				<div class="col-9 fstyle02 d-flex align-items-center bl_t_2 bl_r_2 bl_b_2">
					<div>{{nowCasePurpose}}</div>
				</div>
				<div class="col-4 fstyle02 bl_r bl_l_2">
					<div>廠牌：{{nowCaseItemChop}}</div>
					<div>Manufacturer</div>
				</div>
				<div class="col-4 fstyle02 bl_r">
					<div>型號：{{nowCaseItemModel}}</div>
					<div>Model</div>
				</div>
				<div class="col-4 fstyle02 bl_r_2">
					<div>序號：{{nowCaseItemSN}}</div>
					<div>Serial Number</div>
				</div>
				<!-- 系統參數 -->
				<div class="col-12 fstyle02 bggray1 text-center bl_t_2 bl_r_2 bl_l_2 bl_b_2">
					<div class="fbolder">請擇一勾選填寫Please select one to fill in</div>
				</div>
				<div class="col-7 fstyle02 bggray1 text-center bl_r_2 bl_b bl_l_2">
					<div class="fbolder">
						<span v-if="isFullPara" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>
						具各項系統規格參數
					</div>
					<div class="fbolder">has various system specifications</div>
				</div>
				<div class="col-5 fstyle02 bggray1 text-center bl_r_2 bl_b">
					<div class="fbolder">
						<span v-if="!isFullPara" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span>
						具空載光達系統整合精度
					</div>
					<div class="fbolder">has LiDAR integration accuracy</div>
				</div>
				<!-- 各項系統規格參數 -->
				<div class="col-7 d-flex flex-wrap g-0 p-0 bl_r_2 bl_b_2 bl_l_2">
					<div class="col-12 fstyle02 bl_b_desh">
						雷射掃描儀規格Scanner specification
					</div>
					<div class="col-1 p-0 bl_r_desh">
						<!-- 空白間隔 -->
					</div>
					<div class="col-11 d-flex flex-wrap g-0 p-0">
						<div class="col-3 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div v-if="isFullPara">廠牌：{{nowCaseGnssChop}}</div>
							<div v-else>廠牌：</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div v-if="isFullPara">型號：{{nowCaseGnssModel}}</div>
							<div v-else>型號：</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-1 pb-0">
							<div v-if="isFullPara">序號：{{nowCaseGnssSN}}</div>
							<div v-else>序號：</div>
						</div>
						<div class="col-3 fstyle03 px-0 pt-0 pb-1 bl_r_desh bl_b_desh">
							<div>Manufacturer</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-0 pb-1 bl_r_desh bl_b_desh">
							<div>Model</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-0 pb-1 bl_b_desh">
							<div>Serial Number</div>
						</div>
						<div class="col-12 fstyle02 p-0 bl_b_desh">
							<div v-if="isFullPara">測距精度：{{nowCaseLrDisPrs}} mm</div>
							<div v-else>測距精度：</div>
							<div>Distance Precision</div>
						</div>	
						<div class="col-12 fstyle02 p-0 bl_b_desh">
							<div v-if="isFullPara">雷射掃描角解析度：{{nowCaseLrAngResol}} "</div>
							<div v-else>雷射掃描角解析度：</div>
							<div>Scanner Angular resolution</div>
						</div>
						<div class="col-12 fstyle02 p-0">
							<div v-if="isFullPara">雷射掃描儀發散角：{{nowCaseLrBeam}} "</div>
							<div v-else>雷射掃描儀發散角：</div>
							<div>Laser Beam divergence</div>
						</div>
					</div>
					<!-- GNSS -->
					<div class="col-12 fstyle02 bl_t bl_b_desh">
						GNSS規格GNSS specification
					</div>
					<div class="col-1 p-0 bl_r_desh">
						<!-- 空白間隔 -->
					</div>
					<div class="col-11 d-flex flex-wrap g-0 p-0">
						<div class="col-3 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div>廠牌：{{nowCaseGnssChop}}</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div>型號：{{nowCaseGnssModel}}</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-1 pb-0">
							<div>序號：{{nowCaseGnssSN}}</div>
						</div>
						<div class="col-3 fstyle03 px-0 pt-0 pb-1 bl_r_desh">
							<div>Manufacturer</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-0 pb-1 bl_r_desh">
							<div>Model</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-0 pb-1">
							<div>Serial Number</div>
						</div>
						<div class="col-12 fstyle02 px-0 py-1 bl_t_desh">
							<div v-if="isFullPara">平面定位精度：{{nowCaseGnssPrcH}} mm</div>
							<div v-else>平面定位精度：</div>
							<div>Horizontal Precision</div>
						</div>
						<div class="col-12 fstyle02 px-0 py-1 bl_t_desh">
							<div v-if="isFullPara">高程定位精度：{{nowCaseGnssPrcV}} mm</div>
							<div v-else>高程定位精度：</div>
							<div>Elevation Precision</div>
						</div>
					</div>
					<!-- IMU -->
					<div class="col-12 fstyle02 bl_t bl_b_desh">
						IMU規格IMU specification
					</div>
					<div class="col-1 p-0 bl_r_desh">
						<!-- 空白間隔 -->
					</div>
					<div class="col-11 d-flex flex-wrap g-0 p-0">
						<div class="col-3 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div>廠牌：{{nowCaseImuChop}}</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-1 pb-0 bl_r_desh">
							<div>型號：{{nowCaseImuModel}}</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-1 pb-0">
							<div>序號：{{nowCaseImuSN}}</div>
						</div>
						<div class="col-3 fstyle03 px-0 pt-0 pb-1 bl_r_desh bl_b_desh">
							<div>Manufacturer</div>
						</div>
						<div class="col-5 fstyle03 px-0 pt-0 pb-1 bl_r_desh bl_b_desh">
							<div>Model</div>
						</div>
						<div class="col-4 fstyle03 px-0 pt-0 pb-1 bl_b_desh">
							<div>Serial Number</div>
						</div>
						<div class="col-6 fstyle02 px-0 py-1 bl_r_desh bl_b_desh">
							<div v-if="isFullPara">ω測角精度：{{nowCaseImuOmg}} "</div>
							<div v-else>ω測角精度：</div>
							<div>Omega Precision</div>
						</div>
						<div class="col-6 fstyle02 px-0 py-1 bl_b_desh">
							<div v-if="isFullPara">φ測角精度：{{nowCaseImuPhi}} "</div>
							<div v-else>φ測角精度：</div>
							<div>Phi Precision</div>
						</div>
						<div class="col-6 fstyle02 px-0 py-1 bl_r_desh">
							<div v-if="isFullPara">κ測角精度：{{nowCaseImuKap}} "</div>
							<div v-else>κ測角精度：</div>
							<div>Kappa Precision</div>
						</div>
						<div class="col-6 fstyle02 px-0 py-1">
							<div v-if="isFullPara">姿態角解析度：{{nowCaseImuPrcO}} "</div>
							<div v-else>姿態角解析度：</div>
							<div>Orientation resolution</div>
						</div>
					</div>
				</div>
				<!-- 具空載光達系統整合精度 -->
				<div class="col-5 d-flex flex-wrap g-0 p-0 align-content-start bl_r_2 bl_b_2">
					<div class="col-12 fstyle02">
						雷射掃描儀規格Scanner specification
					</div>
					<div class="col-12 fstyle02 bl_t_desh bl_b_desh">
						<div v-if="!isFullPara" >廠牌：{{nowCaseGnssChop}}</div>
						<div v-else>廠牌：</div>
						<div>Manufacturer</div>
					</div>
					<div class="col-12 fstyle02 bl_b_desh">
						<div v-if="!isFullPara" >型號：{{nowCaseGnssModel}}</div>
						<div v-else>型號：</div>
						<div>Model</div>
					</div>
					<div class="col-12 fstyle02 bl_b_desh">
						<div v-if="!isFullPara" >序號：{{nowCaseGnssSN}}</div>
						<div v-else>序號：</div>
						<div>Serial Number</div>
					</div>
					<div class="col-12 fstyle02 bl_b_desh">
						<div v-if="!isFullPara" >平面精度：{{nowCaseGnssPrcH}} mm</div>
						<div v-else>平面精度：</div>
						<div>Horizontal Precision</div>
					</div>
					<div class="col-12 fstyle02 bl_b_desh">
						<div v-if="!isFullPara">高程精度：{{nowCaseGnssPrcV}} mm</div>
						<div v-else>高程精度：</div>
						<div>Elevation Precision</div>
					</div>
				</div>
			</div>
	</div>
	<div class="page-gap"></div>
	<div class="page">
		<div class="g-0 p-1 fstyle02 text-center bl_t_2 bl_r_2 bl_l_2 bl_b">
			<div>掃描資訊<br/>Scanning information</div>
		</div>
		<div class="d-flex flex-wrap">
			<div class="g-0 p-1 pt-2 col-6 fstyle02 bl_r bl_l_2">
				<div>預定掃描日期：
					<div style="width: 3em;" class="d-inline-block bl_b"></div>年
					<div style="width: 3em;" class="d-inline-block bl_b"></div>月
					<div style="width: 3em;" class="d-inline-block bl_b"></div>日</div>
				<div>Scheduled scanning</div>
				<div class="c_gray mb-4">（本實驗視收件人填寫並通知顧客）</div>
			</div>
			<div class="g-0 p-1 pt-2 col-6 fstyle02 bl_r_2">
				<div>預估平均點雲密度：{{nowCasePtDensity}} 點/m<sup>2</sup></div>
				<div>Estimated average point cloud density</div>
			</div>
		</div>
		<div class="g-0 p-1 fstyle02 bggray2 bl_t_2 bl_r_2 bl_l_2" style="border-bottom: 1px dashed;">
			<div>應檢附資料：</div>
			<div>Attach information</div>
		</div>
		<div class="g-0 p-1 fstyle02 bggray2 bl_r_2 bl_l_2" style="border-bottom: 1px dashed;">
			<div><span v-if="nowCaseLrReport !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> LiDAR原廠規格書或率定報告，檔名：{{nowCaseLrReport}}</div>
			<div style="padding-left: 25px;">Lidar OEM specification or calibration report, filename</div>
		</div>
		<div class="g-0 p-1 fstyle02 bggray2 bl_r_2 bl_l_2 bl_b_2">
			<div><span v-if="nowCasePosReport !== ''" class="wingdings2">&#82;</span><span v-else class="wingdings2">&#163;</span> POS原廠規格書或率定報告，檔名：{{nowCasePosReport}}</div>
			<div style="padding-left: 25px;">POS OEM specification or calibration report, filename</div>
		</div>
		<div class="d-flex flex-wrap g-0 p-0">
			<div class="col-5 fstyle02">
				<!-- 空白 -->
			</div>
			<div class="col-3 fstyle02mid bl_r bl_b_5 bl_l_5">
				<div>校正人員</div>
				<div>Calibration Person</div>
			</div>
			<div class="col-4 fstyle02mid bl_r_5 bl_b_5" style="display: flex;align-items:center;">
				<span class="c_gray">（由技術主管核定後填入）</span>
			</div>
		</div>
	</div>
	<div class="page-gap"></div>
	<div class="page">
		<div class="d-flex flex-wrap g-0 p-0">
			<!-- 收費 -->
			<div class="col-1 fstyle02mid bl_t_2 bl_r_2 bl_b bl_l_2">
				<div>收費</div>
				<div>Price</div>
			</div>
			<div class="col-11 fstyle03 bl_t_2 bl_r_2 bl_b">
				<div>費用合計新臺幣{{nowCaseChargeF}}元整，領取校正報告前請先繳費。</div>
				<div>Total amount of payment （NT dollars）{{nowCaseChargeF}}，Please complete payment before receiving the calibration report.</div>
			</div>
			<!-- 注意事項 -->
			<div class="col-1 fstyle02Vleft bl_r_2 bl_l_2">
				<p>注意事項<br/>Precautions</p>
			</div>
			<div class="col-11 fstyle03 bl_r_2">
				<ol style="padding-left: 20px;">
					<li>
						<div>請參考本實驗室服務網（網址：https://sicl-nlsc.moi.gov.tw/）下載專區公告之校正掃描作業須知，以利辦理校正作業。</div>
						<div>(Please refer to the laboratory website (https://sicl-nlsc.moi.gov.tw/) to download the procedure for mobile LiDAR calibration. To facilitate the calibration operation.)</div>
					</li>
					<li>
						<div>請自行指定校正件操作人員，並辦理其能力評估及授權後，方可依指定日期至本實驗室車載光達校正場(臺中市梧棲區中橫十路 2 號)辦理掃描作業，作業結果並詳實記錄於校正掃描成果表（請至本實驗室服務網下載）。掃描成果交付當天將進行檢查，倘發現不符合校正作業要求時，將請顧客補件或退件。</div>
						<div>(Specify the program operator and perform its capability assessment and authorization before going to calibration field for mobile LiDAR scan (NO. 2,Zhongheng 10th Rd. Wuqi Dist, Taichung City).The results should recorded in detail in calibrate mobile LiDAR scan results table. The mobile LiDAR scan results will be inspected on delivering day. If it is found to be inconsistent with the calibration requirements, the customer will be requested to replenish or return data.)</div>		
					</li>
					<li>
						<div class="fbolder">顧客案件經申請審核通過後，應於指定日期完成掃描作業，並將掃描成果送至本實驗室辦理校正作業；超出期限時，本實驗室將通知顧客並予以退件。</div>
						<div>(After the customer's case has been approved by the application, the mobile LiDAR scan should be completed on designated date, and the mobile LiDAR scan results should be sent to the laboratory for calibration work; when the time limit is exceeded, the laboratory will notify the customer and return the case.)</div>
					</li>
					<li>
						<div>校正掃描成果通過書面檢查，但仍可能於校正作業中發現異常現象而無法校正，則再另行通知。</div>
						<div>(If an abnormality is found in the calibration work and cannot be corrected even through calibrated LiDAR scan results pass documentary review, it will be notified separately.)</div>
					</li>
					<li>
						<div>校正件校正完畢後，請先付費後領取校正報告。</div>
						<div>(After calibrating, the applicant should complete payment before receiving the calibration report)</div>
					</li>
					<li>
						<div>本實驗室經通知顧客校正完畢或退件後，最長代管顧客設備 15 個工作天，逾期不領回恕不負責。</div>
						<div>(After calibrating and notifying the applicant, the longest time of instrument escrow is 15 working days. If it is overdue for retrieve, we do not take any responsibility for instrument.)</div>
					</li>
					<li>
						<div>顧客倘對校正報告內容有疑問，請於 15 個工作天內向本實驗室反應，逾期恕不受理。</div>
						<div>(If there is any questions about the report, please contact us within 15 working days, and it will not be accepted over the time limit.)</div>
					</li>
					<li>
						<div>本表經顧客及收件人簽章後，即具「委託契約」效力，實驗室應影印 1 份供顧客留存。</div>
						<div>(This form is valid after the signing of the applicant and the recipient, and we shall copy this form for the applicant to keep.)</div>
					</li>
					<li>
						<div>顧客簽章後即同意所委託之校正作業依照本實驗室所訂之作業程序執行，並同意遵守本實驗室所有校正作業相關規定事宜。</div>
						<div>(After signing, the customer agrees that the calibration operation entrusted will be performed in accordance with the operating procedures set by the laboratory, and agrees to abide by all relevant regulations of the laboratory.)</div>
					</li>
				</ol>
			</div>
		</div>
		<!-- 簽章欄 -->
		<div class="d-flex flex-wrap g-0 p-0">
			<div class="col-8 fstyle03mid bl_t_2 bl_b_2 bl_l_2 d-flex align-items-center justify-content-center">
				<div>本件為網路收件，已電子郵件請顧客確認，無需雙方簽章。</div>
			</div>
			<div class="col-4 d-flex flex-wrap bl_t_5 bl_r_5 bl_b_5 bl_l_5">
				<div class="col-12 fstyle03mid bl_b d-flex flex-wrap align-items-center" style="height: 2.5rem;">
					<div class="col-12">收費簽章</div>
					<div class="col-12">signature after charge</div>
				</div>
				<div class="col-12 bl_b" style="height: 2.5rem;">
				</div>
				<div class="col-12 fstyle03mid bl_b d-flex flex-wrap align-items-center" style="height: 2.5rem;">
					<div class="col-12">收費簽章</div>
					<div class="col-12">signature after charge</div>
				</div>
				<div class="col-12" style="height: 2.5rem;">
				</div>
			</div>
		</div>
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
		/* border: 1px solid; */
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
		padding-top: 1cm;
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
		/* border: 1.5px solid; */
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

.c_gray {
	color: #d9d9d9;
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
  font-size: 11pt;
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
  font-size: 11pt;
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

/* 框線 */
.bl_all{
  border: 1px solid;
}
.bl_t{
  border-top: 1px solid;
}
.bl_b{
  border-bottom: 1px solid;
}
.bl_l{
  border-left: 1px solid;
}
.bl_r{
  border-right: 1px solid;
}
.bl_t_2{
  border-top: 2px solid;
}
.bl_b_2{
  border-bottom: 2px solid;
}
.bl_l_2{
  border-left: 2px solid;
}
.bl_r_2{
  border-right: 2px solid;
}
.bl_t_5{
  border-top: 5px solid;
}
.bl_b_5{
  border-bottom: 5px solid;
}
.bl_l_5{
  border-left: 5px solid;
}
.bl_r_5{
  border-right: 5px solid;
}

.bl_t_doble{
  border-top: 5px double;
}
.bl_b_doble{
  border-bottom: 5px double;
}
.bl_l_doble{
  border-left: 5px double;
}
.bl_r_doble{
  border-right: 5px double;
}

.bl_t_desh{
  border-top: 1px dashed;
}
.bl_b_desh{
  border-bottom: 1px dashed;
}
.bl_l_desh{
  border-left: 1px dashed;
}
.bl_r_desh{
  border-right: 1px dashed;
}
</style>
