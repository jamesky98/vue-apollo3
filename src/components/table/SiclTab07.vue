<script setup>
	// 作業紀錄表(適用航空測量攝影機)
import {ref, inject} from 'vue';
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
const publicPath = inject('publicPath');

const nowCaseCalTypeCode = ref(""); //校正項目代碼
const tableID = computed(()=>{return props.caseID.slice(0,-2)}); //申請單編號
const itemID = computed(()=>{return props.caseID.slice(-2)}); //校正件編號
const nowCaseStartDate = ref(""); // 開始日期
const startDateStr = computed(()=>{
	let dateArray = nowCaseStartDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseFlyDate = ref(""); // 航拍日期
const flyDateStr = computed(()=>{
	let dateArray = nowCaseFlyDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseStrNSac = ref(""); // 南北航帶
const nowCaseStrEWac = ref(""); // 東西航帶
const nowCaseStrTotle = computed(()=>{
	return nowCaseStrNSac.value + nowCaseStrEWac.value
});

const nowCaseEndLapAc = ref(""); // 前後重疊
const nowCaseSideLapAc = ref(""); // 側向重疊
const nowCaseAGLac = ref(""); // AGL
const nowCaseGSDac = ref(""); // GSD

const nowCaseImgNo = ref(""); // 使用影像數
const nowCaseUndist = ref(false); // 是否已糾正影像
const idUndist = computed(()=>{
	return (nowCaseStrNSac.value)?"是":"否"
});

const nowCaseRefPrjCode = ref(""); // 量測作業編號編號
const nowCaseRefPrjPublishDate = ref(""); // 參考值發布日期
const refPubDateStr = computed(()=>{
	let dateArray = nowCaseRefPrjPublishDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseTotPt = ref(""); //總點數(自動計算)
const nowCaseMeaPt = ref(""); //量測點數(自動計算)
const nowCaseDelPt = ref(""); //刪除點數
const nowCaseDelCommt = ref(""); //刪除註記

const nowCaseConnectNo = ref(""); // 連結點數(自動計算)
const nowCaseObsNo = ref(""); // 觀測量(自動計算)
const nowCaseRedundancy = ref(""); // 多餘觀測量(自動計算)

const nowCaseFreeStd = ref(""); //自由網中誤差
const nowCaseFixStd = ref(""); // 強制網中誤差

const nowCaseCrtNo = ref(""); // 控制點數(自動計算)
const nowCaseChkNo = ref(""); // 檢核點數(自動計算)

const nowCaseNetGraph = ref(""); //網形圖(上傳)
const nowCaseNetGraphDL = computed(() => {
  if (nowCaseNetGraph.value && nowCaseNetGraph.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseNetGraph.value;
  } else {
    return undefined;
  }
});

const nowCaseGCPGraph = ref(""); //點位分布圖(上傳)
const nowCaseGCPGraphDL = computed(() => {
  if (nowCaseGCPGraph.value && nowCaseGCPGraph.value !== "") {
    return publicPath.value + "06_Case/" + props.caseID + "/" + nowCaseGCPGraph.value;
  } else {
    return undefined;
  }
});

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
    // 填入資料
		let getData = result.data.getCasebyID;
		let getRecord01 = result.data.getCasebyID.case_record_01;
    let getCust = result.data.getCasebyID.cus;
    let getItem = result.data.getCasebyID.item_base;
		let getOpt = result.data.getCasebyID.employee_case_base_operators_idToemployee;
		
		nowCaseCalTypeCode.value = (result.data.getCasebyID.cal_type_cal_typeTocase_base)?result.data.getCasebyID.cal_type_cal_typeTocase_base.code:"";

		nowCaseStartDate.value = (getRecord01.start_Date)?getRecord01.start_Date.split("T")[0]:"";
		nowCaseFlyDate.value = (getRecord01.fly_date)?getRecord01.fly_date.split("T")[0]:"";
		nowCaseStrNSac.value = getRecord01.strip_ns_ac;
    nowCaseStrEWac.value = getRecord01.strip_ew_ac;

		nowCaseEndLapAc.value = getRecord01.end_lap_ac;
    nowCaseSideLapAc.value = getRecord01.side_lap_ac;
		nowCaseAGLac.value = getRecord01.agl_ac;
		nowCaseGSDac.value = getRecord01.gsd_ac;

		nowCaseImgNo.value = getRecord01.img_no;
		nowCaseUndist.value = getRecord01.Undistortion;

		nowCaseRefPrjCode.value = (getRecord01.ref_project)?getRecord01.ref_project.project_code:"";
		nowCaseRefPrjPublishDate.value = (getRecord01.ref_project) ?getRecord01.ref_project.publish_date.split("T")[0]:"";

		nowCaseTotPt.value = getRecord01.total_pt;
    nowCaseMeaPt.value = getRecord01.meas_pt;
    nowCaseDelPt.value = getRecord01.del_pt;
		nowCaseDelCommt.value = getRecord01.del_comt;

		nowCaseConnectNo.value = getRecord01.connect_no;
    nowCaseObsNo.value = getRecord01.obs_no;
    nowCaseRedundancy.value = getRecord01.redundancy;

		nowCaseFreeStd.value = getRecord01.free_std;
    nowCaseFixStd.value = getRecord01.fix_std;

		nowCaseCrtNo.value = getRecord01.ctr_no;
    nowCaseChkNo.value = getRecord01.chk_no;

		nowCaseNetGraph.value = getRecord01.net_graph;
    nowCaseGCPGraph.value = getRecord01.gcp_graph;
  }
});
refgetNowCaseF();
</script>

<template>

	<div class="header fstyle02 w-100">
		<div>內政部國土測繪中心　測量儀器校正實驗室</div>
	</div>
	<div class="footer fstyle02 w-100">
		<table  width="100%" style="border: hidden;">
			<tr v-if="nowCaseCalTypeCode === 'J'">
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-68-0</td>
				<td width="33%" style="text-align: center;border: hidden;">/1</td>
				<td style="text-align: right;border: hidden;">版次：1.2</td>
			</tr>
			<tr v-else>
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-52-0</td>
				<td width="33%" style="text-align: center;border: hidden;">/1</td>
				<td style="text-align: right;border: hidden;">版次：2.2</td>
			</tr>
		</table>
	</div>

	<div class="page">
		<table width="100%">
			<!-- 表單名稱 -->
			<div class="fstyle01">
				<div v-if="nowCaseCalTypeCode === 'J'" class="fstyle01C" style="margin-bottom: 10px;">小像幅攝影機校正作業紀錄表</div>
				<div v-else class="fstyle01C" style="margin-bottom: 10px;">航空測量攝影機校正作業紀錄表</div>
			</div>
			<div class="fstyle02">編號：</div>
			<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
				<!-- 申請表資料 -->
				<tr style="border-bottom: 3px solid;">
					<td scope="col" width="38%" class="fstyle02 nowrap">
						申請單編號：{{tableID}}
					</td>
					<td scope="col" class="fstyle02 nowrap" style="border-right: 3px solid;">
						校正件編號：{{itemID}}
					</td>
					<td scope="col" width="38%" class="fstyle02 nowrap" style="border-top: hidden; border-right:hidden;">
						作業開始日期：{{startDateStr}}
					</td>
				</tr>
				<!-- 基本資料 -->
				<tr>
					<th colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
								<td width="6%" rowspan="5">
									<div class="fstyle02V">基本資料</div>
								</td>
								<td width="47%" scope="col" class="fstyle02 nowrap">
									（1）航拍日期：{{flyDateStr}}
								</td>
								<td scope="col" class="fstyle02 nowrap">
									（2）總航帶數：{{nowCaseStrTotle}} 條
								</td>
							</tr>
							<tr>
								<td width="46%" scope="col" class="fstyle02 nowrap">
									（3）影像重疊：前後 {{nowCaseEndLapAc}} %，側向 {{nowCaseSideLapAc}} %
								</td>
								<td scope="col" class="fstyle02 nowrap">
									（4）飛航離地高（AGL）：{{nowCaseAGLac}} m
								</td>
							</tr>
							<tr>
								<td width="46%" scope="col" class="fstyle02 nowrap">
									（5）地面像素解析度：{{nowCaseGSDac}} cm
								</td>
								<td scope="col" class="fstyle02 nowrap">
									（6）使用影像數：{{nowCaseImgNo}} 片
								</td>
							</tr>
							<tr v-if="nowCaseCalTypeCode === 'J'">
								<td colspan="2" scope="col" class="fstyle02 nowrap">
									（7）是否為畸變差已糾正影像(Undistortion)：{{idUndist}}
								</td>
							</tr>
						</table>
					</th>
				</tr>
				<!-- 作業紀錄 -->
				<tr style="border-top: 3px solid;">
					<th colspan="3">
						<table width="100%" style="border: hidden;">
							<tr>
								<td colspan="2" scope="col" class="fstyle02mid bggray">
									<strong>影像量測、空中三角平差粗差偵測及剔除</strong>
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（1）引用參考值之作業編號：{{nowCaseRefPrjCode}}，發布日期：{{refPubDateStr}}
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（2）校正標數量 {{nowCaseTotPt}} 個，實際量測 {{nowCaseMeaPt}} 個，剔除 {{nowCaseDelPt}} 個
								</td>
							</tr>
							<tr>
								<td height="60px" colspan="2" scope="col" class="fstyle02" style="vertical-align: top;">
									剔除點號及原因：{{nowCaseDelCommt}}
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（3）量測結果：連結點數目 {{nowCaseConnectNo}} ，觀測量 {{nowCaseObsNo}} ，多餘觀測量 {{nowCaseRedundancy}}
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（4）平差結果（驗後單位權中誤差），自由網： {{nowCaseFreeStd}} um，強制附合網： {{nowCaseFixStd}} um
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（5）作為 <strong>控制點</strong> 數量應為 10 個，實際使用 {{nowCaseCrtNo}} 個。
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（6）作為 <strong>檢核點</strong> 數量，實際使用 {{nowCaseChkNo}} 個。
								</td>
							</tr>
							<tr>
								<td width="50%" scope="col" class="fstyle02">
									<div>（7）6 重光束以上連結點之網形圖：</div>
									<img :src="nowCaseNetGraphDL" class="lightboxImg"/>
									<!-- <div class="lightboxImg">
										
									</div> -->
								</td>
								<td scope="col" class="fstyle02">
									<div>（8）控制點及檢核點分布圖：  </div>
									<img :src="nowCaseGCPGraphDL" class="lightboxImg"/>
								</td>
							</tr>
							<tr>
								<td scope="col" class="fstyle02">
									（9）檢附<strong class="bggray2">報表摘要資訊</strong>，如附件 1。
								</td>
								<td scope="col" class="fstyle02">
									（10）檢附<strong class="bggray2">不確定度計算表</strong>，如附件 2。
								</td>
							</tr>
							<tr>
								<td colspan="2" scope="col" class="fstyle02">
									（11）檢附符合性使用之<strong class="bggray2">規範標準及決定規則</strong>，如附件 3。(顧客有要求符合性聲明時檢附)
								</td>
							</tr>
						</table>
					</th>

				</tr>
				<!-- 簽章欄 -->
				<tr>
					<th colspan="3">
						<table width="100%" style="border: hidden;">
							<tr height="50px">
								<td width="25%" scope="col" class="fstyle02">校正人員簽章</td>
								<td scope="col">
									<div>
										<table width="60px" style="float: right; margin-right: 20px;">
											<tr class="fstyle03mid"><td style="color: #d9d9d9;border-left: hidden;border-right: hidden;border-top: hidden;border-color: black;">日期</td></tr>
											<tr class="fstyle03mid"><td style="color: #d9d9d9;border-left: hidden;border-right: hidden;border-bottom: hidden;border-color: black;">時間</td></tr>
										</table>
									</div>
								</td>
							</tr>
							<tr height="50px">
								<td scope="col" class="fstyle02">數據檢核人員簽章</td>
								<td scope="col">
									<div>
										<table width="60px" style="float: right; margin-right: 20px;">
											<tr class="fstyle03mid"><td style="color: #d9d9d9;border-left: hidden;border-right: hidden;border-top: hidden;border-color: black;">日期</td></tr>
											<tr class="fstyle03mid"><td style="color: #d9d9d9;border-left: hidden;border-right: hidden;border-bottom: hidden;border-color: black;">時間</td></tr>
										</table>
									</div>
								</td>
							</tr>
						</table>
					</th>
				</tr>
			</table>
			
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
		bottom: 1.8mm;
		font-size: 11pt;
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
	background-color: #b3b3b3;
}

.bggray2{
	background-color: #d9d9d9;
}

.sicltab01 {
  border: 3px solid;
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
	line-height: 2;
	letter-spacing: 0px;
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
	/* line-height: 1; */
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
	padding: 0;
  font-size: 8pt;
  font-weight:normal;
	line-height: 1;
}

.fstyle03{
	text-align: left;
}
.fstyle03mid{
	text-align: center;
}
.lightboxImg{
	display:block; 
	margin:auto;
  max-width: 100%;
  height: 150px;
}
</style>
