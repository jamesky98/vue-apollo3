<script setup>
// 不確定度模組列印計算表
import {ref} from 'vue';
// import { computed } from "@vue/reactivity";
import { useMutation } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";

// 引入案件編號
const props = defineProps({
  moduleName: String
});

const viewDig = 2;
const viewDigsub = 3;
const nowUcVer = ref("");
const nowUcPrjCode = ref("");
const nowUcfreeH = ref("");
const nowUcfreeV = ref("");
const nowUctinvH = ref("");
const nowUctinvV = ref("");
const nowUcH = ref("");
const nowUcV = ref("");
const nowUcminUcH = ref("");
const nowUcminUcV = ref("");
const nowUcCombUxH = ref("");
const nowUcCombUxV = ref("");
const nowUcConfLevel = ref("");
const nowUcData = ref([]);

// 查詢GetUcResultformJsom
const { mutate: testUc, onDone: testUcOnDone, onError: testUcError } = useMutation(
  CaseGQL.GETUCRESULTFORMJSON,
  () => ({
    variables: {
      filename: props.moduleName,
    }
  })
);
testUcOnDone(result => {
  if (!result.loading && result && result.data.getUcResultformJson) {
    // 填入資料
		let nowUcResult = result.data.getUcResultformJson;
		console.log(nowUcResult);
		nowUcVer.value = nowUcResult.ver;
		nowUcPrjCode.value = nowUcResult.prjcode;
		nowUcfreeH.value = nowUcResult.freeH.toFixed(viewDig);
		nowUcfreeV.value = nowUcResult.freeV.toFixed(viewDig);
		nowUctinvH.value = nowUcResult.tinvH.toFixed(viewDigsub);
		nowUctinvV.value = nowUcResult.tinvV.toFixed(viewDigsub);
		nowUcH.value = nowUcResult.ucH_o.toFixed(viewDig);
		nowUcV.value = nowUcResult.ucV_o.toFixed(viewDig);
		nowUcminUcH.value = nowUcResult.minUcH.toFixed(viewDig);
		nowUcminUcV.value = nowUcResult.minUcV.toFixed(viewDig);
		nowUcCombUxH.value = nowUcResult.ucH_s.toFixed(viewDigsub);
		nowUcCombUxV.value = nowUcResult.ucV_s.toFixed(viewDigsub);
		nowUcConfLevel.value = nowUcResult.confLevel.toFixed(viewDig);
		nowUcData.value = nowUcResult.data;
  }
});
testUc();
</script>

<template>
	<div class="page">
		<div class="fstyle03 my-2">
			不確定度計算表
			<span class="fstyle02">
				版本 V.{{nowUcVer}}_{{nowUcPrjCode}}
			</span>
		</div>
		<div class="fstyle01">案件編號：{{props.caseID}}</div>
		
		<table cellspacing=0 cellpadding=0>
			<tr class="fstyle02mid">
				<td colspan="2" class="bglightGreen">平面</td>
				<td colspan="2" class="bglightBlue">高程</td>
			</tr>
			<tr class="fstyle02">
				<td class="bglightGreen">組合不確定度</td>
				<td class="fstyle02right bglightGreen">{{nowUcCombUxH}}</td>
				<td class="bglightBlue">組合不確定度</td>
				<td class="fstyle02right bglightBlue">{{nowUcCombUxV}}</td>
			</tr>
			<tr class="fstyle02">
				<td class="bglightGreen">有效自由度</td>
				<td class="fstyle02right bglightGreen">{{nowUcfreeH}}</td>
				<td class="bglightBlue">有效自由度</td>
				<td class="fstyle02right bglightBlue">{{nowUcfreeV}}</td>
			</tr>
			<tr class="fstyle02">
				<td class="bglightGreen">信賴水準</td>
				<td class="fstyle02right bglightGreen">{{nowUcConfLevel*100}} %</td>
				<td class="bglightBlue">信賴水準</td>
				<td class="fstyle02right bglightBlue">{{nowUcConfLevel*100}} %</td>
			</tr>
			<tr class="fstyle02">
				<td class="bglightGreen">涵蓋因子</td>
				<td class="fstyle02right bglightGreen">{{nowUctinvH}}</td>
				<td class="bglightBlue">涵蓋因子</td>
				<td class="fstyle02right bglightBlue">{{nowUctinvV}}</td>
			</tr>
			<tr class="fstyle02">
				<td class="bglightGreen">擴充不確定度</td>
				<td class="fstyle02right bgGreen1">{{nowUcH}}</td>
				<td class="bglightBlue">擴充不確定度</td>
				<td class="fstyle02right bgBlue1">{{nowUcV}}</td>
			</tr>
			<tr class="fstyle02">
				<td class="bgGreen2 fontYellow">最小不確定度</td>
				<td class="fstyle02right bgGreen2 fontYellow">{{nowUcminUcH}}</td>
				<td class="bgBlue2 fontYellow">最小不確定度</td>
				<td class="fstyle02right bgBlue2 fontYellow">{{nowUcminUcV}}</td>
			</tr>
		</table>
		<div v-for="(UcItem, index) in nowUcData" :key="index" style="width: 100%;">
			<table cellspacing=0 cellpadding=0 width="100%">
				<thead>
					<tr class="fstyle01"><td colspan="99">{{UcItem.section}}</td></tr>
				</thead>
				<tfoot>
					<tr class="fstyle02"><td colspan="99">{{UcItem.comment}}</td></tr>
				</tfoot>
				<tbody width="100%">
					<tr class="bggray1 fstyle02">
						<th width="6%">項次</th>
						<th width="10%">因子</th>
						<th width="8%">ux(mm)</th>
						<th width="8%">自由度</th>
						<th width="6%">靈敏係數</th>
						<th width="10%">uc<sup>2</sup></th>
						<th width="10%">v_eff</th>
						<th width="10%">變動時機</th>
						<th>參數項</th>
					</tr>
					<tr class="fstyle02right" v-for="(subItem, subindex) in UcItem.data" :key="subindex" :type="UcItem.type">
						<td class="fstyle02">{{subindex+1}}</td>
						<td class="fstyle02">{{subItem.name}}</td>
						<td>{{subItem.ux.toFixed(viewDigsub)}}</td>
						<td>{{subItem.freedom.toFixed(viewDig)}}</td>
						<td>{{subItem.factor.toFixed(viewDig)}}</td>
						<td>{{((subItem.ux * subItem.factor)**2).toFixed(viewDigsub)}}</td>
						<td>{{(((subItem.ux**4)*subItem.factor)/subItem.freedom).toFixed(viewDigsub)}}</td>
						<td class="fstyle02 nowrap" :frequency="subItem.frequency">{{subItem.frequency}}</td>
						<td class="fstyle02 bgWrite">
							<span v-for="(x, xindex) in subItem.x" style="margin-right: 10px;">
								{{subItem.x_title[xindex]}}:{{x.toFixed(viewDig)}}</span>
							<span v-for="(fr, frindex) in subItem.fr" style="margin-right: 10px;">
								{{subItem.fr_title[frindex]}}:{{fr.toFixed(viewDig)}}</span>
							<span v-for="(fa, faindex) in subItem.fa" style="margin-right: 10px;">
								<span v-if="subItem.fa_title[faindex] !== ''">{{subItem.fa_title[faindex]}}:{{fa.toFixed(viewDig)}}</span></span>
						</td>
					</tr>
					<tr class="fstyle02right">
						<td colspan="2">組合</td>
						<td>{{UcItem.combUx.toFixed(viewDigsub)}}</td>
						<td>{{UcItem.combFr.toFixed(viewDigsub)}}</td>
					</tr>
				</tbody>
			</table>
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
		/* border: 2px solid red; */
		/* box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6); */
		position: relative;
		width: 210mm;
		height: 297mm;
		padding-top: 1.5cm;
		padding-bottom: 1.5cm;
		padding-left: 2cm;
		padding-right: 2cm;
		/* z-index: 1; */
	}
	.page-gap{
		height: 20px;
	}
	.fstyle01, .fstyle01C{
		text-align: left;
		font-size: 12pt;
		font-weight:bold;
		line-height: 1;
	}

}
@page {
  size: A4 portrait; /* 混合使用 */
  margin: 1cm 2cm; /* 邊界與內容的距離 */
	orphans:2;
  widows:2;
}
@media print{
	html, body{
		width: 100%;
		height: 100%;
		/* margin: 0; */
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
		/* border: 2px solid red; */
		position: relative;
		width: 100%;
		/* z-index: 10; */
	}
	.page-gap{
		display: none;
	}
	.noprint{
		display: none;
	}
	
	.tbheader{
		display: table-header-group;
	}
	.fstyle01, .fstyle01C{
		text-align: left;
		font-size: 10pt;
		font-weight:bold;
		line-height: 1;
	}

}

tr, td, th {
	border: 1px solid;
	padding: 3px 3px 3px 10px;
	page-break-inside: avoid;
}
th{
	border-top: none;
}

tfoot tr{
	border-left: hidden;
	border-right: hidden;
	border-bottom: hidden;
}

table{
	margin-top: 10px;
	page-break-inside: avoid;
}

.titlediv{
	width: 6cm;
	border-style: double;
	line-height: 2cm;
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

.bglightGreen,tr[type="平面"]{
	background-color: #ccffcc;
}

.bgGreen1{
	background-color: #99cc00;
}

.bgGreen2{
	background-color: #339966;
}

.fontYellow{
	color: #ffff00;
	border-color: black;
}

td[frequency="每年量測"]{
	background-color: #cc99ff;
}
td[frequency="每次校正"]{
	background-color: #ffcc99;
}

.bgWrite, td[frequency="系統評估"]{
	background-color: #ffffff;
}

.bglightBlue,tr[type="高程"]{
	background-color: #99ccff;
}

.bgBlue1{
	background-color: #00ccff;
}

.bgBlue2{
	background-color: #3366ff;
}

.sicltab01 {
  /* border: 1px solid; */
  border-collapse: collapse;
}

.fstyle01, .fstyle02, .fstyle02mid, .fstyle02right, .fstyle02V, .fstyle02Vleft, .fstyle03, .fstyle03mid{
	font-family: "Times New Roman";
}

.fbolder{
	font-weight:bolder;
}

.fstyle01C{
	font-family: "Times New Roman", 標楷體;
	text-align: center;
	letter-spacing: 5px;
}
.fstyle02, .fstyle02mid, .fstyle02right{
	padding: 2px 5px 2px 5px;
	font-size: 8pt;
	line-height: 1;
	/* font-weight:normal; */
}
.fstyle02{
	text-align: left;
}
.fstyle02mid{
	text-align: center;
}
.fstyle02right{
	text-align: right;
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
	/* padding: 3px 10px 3px 10px; */
  font-size: 24pt;
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
