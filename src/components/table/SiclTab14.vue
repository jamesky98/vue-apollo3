<script setup>
	// 作業紀錄表(適用航空測量攝影機)
import {ref, onMounted} from 'vue';
import { computed } from "@vue/reactivity";
import { useMutation } from '@vue/apollo-composable';
import GcpGQL from "../../graphql/Gcp";
import { errorHandle, logIn, logOut, toTWDate } from '../../methods/User';

// 引入點號
const props = defineProps({
	recordID: String
});
const infomsg = ref('');
const alert1 =ref(false);

const nowPRecordPtId = ref("");
const nowPRecordPrjId = ref("");
const nowPRecordPrjCode = ref("");
const nowPRecordDate = ref("");
const nowPRecordDateStr = computed(()=>{
	let dateArray = nowPRecordDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowPRecordPerson = ref("");
const nowGcpTypeCode = ref("");
const nowGcpTypeCodeName = ref("");
const nowGcpEstablishment = ref("");
const nowGcpEstDate = ref("");
const nowGcpPavement = ref("");
const nowGcpStyle = ref("");

const nowGcpContactId = ref("");
const nowGcpContactName = ref("");
const nowGcpContactPrs = ref("");
const nowGcpContactTel = ref("");
const nowGcpContactAds = ref("");
const nowGcpContactCom = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  if(nowGcpDespImg.value){
    return "04_GCP/Pt/" + nowGcpDespImg.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowGcpDespStr = ref("");
const nowPRecordImg0 = ref("");
const nowPRecordImg0DL = computed(()=>{
  if(nowPRecordImg0.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  if(nowPRecordImg1.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  if(nowPRecordImg2.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  if(nowPRecordImg3.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

// 查詢gcp_Record資料
const { 
  mutate: getRecordById, 
  onDone: getRecordByIdOnDone, 
  onError: getRecordByIdError 
} = useMutation(GcpGQL.GETRECORDBYID);
getRecordByIdError(e=>{errorHandle(e,infomsg,alert1)});
getRecordByIdOnDone(result => {
  if (!result.loading && result.data.getGcpRecordById) {
    // 填入資料
		let getData = result.data.getGcpRecordById;
    // console.log(getData);
		nowPRecordPtId.value = getData.gcp_id;
    nowPRecordPrjId.value = getData.project_id;
    nowPRecordPrjCode.value = getData.ref_project.project_code;
    nowPRecordDate.value = (getData.date)?(getData.date.split("T")[0]):"";
    nowPRecordPerson.value = getData.person;
    nowGcpTypeCode.value = getData.gcp.type_code;
    nowGcpTypeCodeName.value = getData.gcp.gcp_type.type_name;
    nowGcpEstablishment.value = getData.gcp.establishment;
    nowGcpEstDate.value = getData.gcp.Est_date;
    nowGcpPavement.value = getData.gcp.pavement;
    nowGcpStyle.value = getData.gcp.style;

    if(getData.gcp.gcp_contact){
      nowGcpContactId.value = getData.gcp.contact_id;
      nowGcpContactName.value = getData.gcp.gcp_contact.name;
      nowGcpContactPrs.value = getData.gcp.gcp_contact.person;
      nowGcpContactTel.value = getData.gcp.gcp_contact.tel;
      nowGcpContactAds.value = getData.gcp.gcp_contact.address;
      nowGcpContactCom.value = getData.gcp.gcp_contact.comment;
    }
    
    nowGcpDespImg.value = getData.gcp.pt_map;
    nowGcpDespStr.value = getData.gcp.pt_desc;

    nowPRecordImg0.value = getData.close_photo;
    nowPRecordImg1.value = getData.far_photo1;
    nowPRecordImg2.value = getData.far_photo2;
    nowPRecordImg3.value = getData.far_photo3;
  }
});
getRecordById({getGcpRecordByIdId: parseInt(props.recordID)});

// 繪製透空圖

function drawObsView(){
  let canvas = document.getElementById("obsCanvas");
  //指定繪圖方式
  let ctx = canvas.getContext("2d");
  
  const gapWidth = 10.5;
  const sortLine = 6/2;
  let center = [120,120];
  ctx.lineWidth = 0.5;
  for(let i=1;i<9;i++){
    ctx.beginPath();
    // ctx.moveTo(100,100)
    ctx.arc(center[0],center[1],gapWidth * i,0,Math.PI*2,true);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.arc(center[0],center[1],9*gapWidth,0,Math.PI*2,true);
  ctx.stroke();
  
  ctx.font = '9px Times New Roman';
  for(let i=1;i<10;i += 2){
    ctx.fillStyle = 'White';
    ctx.fillRect(center[0] + 2, center[1] - (gapWidth*i) - 5, 15, 8);
    ctx.fillStyle = 'Black';
    ctx.fillText((90-10*i)+'°', center[0] + 3, center[1] - (gapWidth*i) + 3);  
    
  }
  ctx.fillStyle = 'White';
  ctx.fillRect(center[0], center[1], 18, 9);
  ctx.fillStyle = 'Black';
  ctx.fillText('天頂', center[0], center[1]+8);

  
  let rad = (gapWidth*10)+2;
  let offset = [-6,4];
  let coor = circleXY(center, 270 ,rad);
  ctx.fillText(' N', coor[0]+offset[0], coor[1]+offset[1]);
  coor = circleXY(center, 90 ,rad);
  ctx.fillText(' S', coor[0]+offset[0], coor[1]+offset[1]);
  coor = circleXY(center, 0 ,rad);
  ctx.fillText(' E', coor[0]+offset[0], coor[1]+offset[1]);
  coor = circleXY(center, 180 ,rad);
  ctx.fillText(' W', coor[0]+offset[0], coor[1]+offset[1]);
  ctx.lineWidth = 0.5;
  for(let i=0;i<12;i++){
    let ang = (270 + i*30) % 360;
    let angTxt = (i*30) +'°';
    if((ang%90)!==0){
      coor = circleXY(center, ang ,rad);
      ctx.fillText(angTxt, coor[0]+offset[0], coor[1]+offset[1]);
    }
    let txtRad = gapWidth*10;
    let startPt = circleXY(center,ang,txtRad-gapWidth-sortLine);
    let endPt = circleXY(center,ang,txtRad-gapWidth+sortLine);
    ctx.beginPath();
    ctx.moveTo(startPt[0],startPt[1]);
    ctx.lineTo(endPt[0],endPt[1]);
    ctx.stroke();
  }

}

function circleXY(center,ang,radius){
  // ang:360度制
  let x = center[0] + radius * Math.cos(ang / 180 * Math.PI);
  let y = center[1] + radius * Math.sin(ang / 180 * Math.PI);
  return [x,y];
}

onMounted(()=>{
  drawObsView();
});

</script>

<template>
  <!-- 頁首頁尾 -->
	<div class="header f_02 w-100">
		<div>內政部國土測繪中心　測量儀器校正實驗室</div>
	</div>
	<div class="footer f_02 w-100">
		<table  width="100%" style="border: hidden;">
			<tr>
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-47-0</td>
				<!-- <td width="33%" style="text-align: center;border: hidden;">/1</td> -->
				<td style="text-align: right;border: hidden;">版次：1.2</td>
			</tr>
		</table>
	</div>

  <div class="page-gap"></div>
  <div class="page">
    <div class="page_content">
      <table width="100%">
        <!-- 表單名稱 -->
        <div class="f_01 f_C f_bolder" style="margin-bottom: 10px;">校正標點位調查表</div>

        <div class="f_03 mb-2">編號：</div>
        <table width="100%" cellspacing=0 cellpadding=0>
          <tr>
            <td scope="col" width="13%" class="f_03 bl_t_doble bl_l_doble bl_b bl_r">作業編號</td>
            <td scope="col" width="26%" class="bl_t_doble bl_b bl_r"></td>
            <td scope="col" width="13%" colspan="2" class="f_03 bl_t_doble bl_b bl_r">作業人員</td>
            <td scope="col" colspan="2" class="bl_t_doble bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">點號</td>
            <td scope="col" class="f_03 bl_b bl_r">{{nowPRecordPtId}}</td>
            <td scope="col" colspan="2" class="f_03 bl_b bl_r">作業日期</td>
            <td scope="col" colspan="2" class="bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">現況</td>
            <td scope="col" class="f_03  bl_b bl_r"><span class="wingdings2">&#163;</span>正常 <span class="wingdings2">&#163;</span>遺失損毀</td>
            <td scope="col" colspan="2" class="f_03 bl_b bl_r">作業類型</td>
            <td scope="col" colspan="2" class="f_03 bl_b bl_r_doble"><span class="wingdings2">&#163;</span>巡查 <span class="wingdings2">&#163;</span>參考值量測</td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">已拍攝</td>
            <td scope="col" colspan="5" class="f_03 bl_b bl_r_doble">
              <span class="wingdings2">&#163;</span>近照	
              <span class="wingdings2">&#163;</span>遠照1	
              <span class="wingdings2">&#163;</span>遠照2	
              <span class="wingdings2">&#163;</span>遠照3</td>
          </tr>
          <tr>
            <td scope="col" colspan="6" class="f_03 f_B bggray2 bl_l_doble bl_b bl_r_doble">
              基本資料 &emsp; &emsp;
              <span class="wingdings2">&#163;</span>
              是否需修改 (需修改則填寫下面資訊)
            </td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">測設機關</td>
            <td scope="col" colspan="3" class="bl_b bl_r"></td>
            <td scope="col" width="15%" class="f_03 bl_b bl_r">測設日期</td>
            <td scope="col" colspan="2" width="20%" class="bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">類別</td>
            <td scope="col" colspan="5" class="f_03 px-0 py-2 bl_b bl_r_doble">
              <table width="100%">
                <tr>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>大校正場用標</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>小校正場用標</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>大小共用標</td>
                </tr>
                <tr>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>光達標</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>光達校正物</td>
                </tr>
                <tr>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>網形控制點</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>備用點位</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">標心規格</td>
            <td scope="col" class="f_03 bl_b bl_r">
              <span class="wingdings2">&#163;</span>鋼釘<br/>
              <span class="wingdings2">&#163;</span>鋼片
            </td>
            <td scope="col" colspan="2" class="f_03 bl_b bl_r">舖面</td>
            <td scope="col" colspan="2" class="f_03 px-0 py-2 bl_b bl_r_doble">
              <table>
                <tr>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>道路面</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>空地地面</td>
                </tr>
                <tr>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>人行道</td>
                  <td style="height: 1em;"><span class="wingdings2">&#163;</span>建物頂樓</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">土地產權</td>
            <td scope="col" colspan="5" class="f_03 bl_b bl_r_doble">
              <span class="wingdings2">&#163;</span>公有地	<span class="wingdings2">&#163;</span>私有地
            </td>
          </tr>
          <tr>
            <td scope="col" colspan="6" class="f_03 bl_l_doble bl_b bl_r_doble">聯絡資訊</td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">聯絡機關</td>
            <td scope="col" colspan="5" class="bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">聯絡人</td>
            <td scope="col" colspan="5" class="bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">電話</td>
            <td scope="col" colspan="5" class="bl_b bl_r_doble"></td>
          </tr>
          <tr>
            <td scope="col" class="f_03 bl_l_doble bl_b bl_r">地址</td>
            <td scope="col" colspan="5" class="bl_b bl_r_doble"></td>
          </tr>
          <tr style="height: 18em;vertical-align: top;">
            <td scope="col" colspan="3" class="f_03 py-2 bl_l_doble bl_b_doble bl_r">點之記說明補充：</td>
            <td scope="col" colspan="3" width="30%" class="f_03 p-2 bl_b_doble bl_r_doble">
              透空圖：
              <div class="f_mid" style="height: calc(100% - 1.5rem);">
                <canvas id="obsCanvas" width="230" height="230" class="mt-2"></canvas>
              </div>
              
            </td>
          </tr>
        </table>
      </table>
    
    </div>
  </div>
  <div class="page-gap"></div>
  <div class="page">
    <div class="page_content">
      <div class="f_01 f_C f_bolder" style="margin-bottom: 10px;">校正標點位紀錄</div>
        <table width="100%" cellspacing=0 cellpadding=0>
          <tr>
            <!-- 點之記 -->
            <td scope="col" width="70%" rowspan="12" colspan="2"
              class="p-2 bl_t_doble bl_l_doble bl_b bl_r"
              style="height: 25em;">
              <img :src="nowGcpDespImgDL" onerror="this.src=''" class="img-allfluid" />
            </td>
            <td scope="col" class="f_04 f_mid p-0 bl_t_doble bl_r_doble bl_b">{{nowPRecordPtId}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">前次作業：{{nowPRecordPrjCode}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">前次日期：{{nowPRecordDateStr}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">前次人員：{{nowPRecordPerson}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">類別：{{nowGcpTypeCodeName}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">測設機關：{{nowGcpEstablishment}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">測設年月：{{nowGcpEstDate}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">舖面：{{nowGcpPavement}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">標心規格：{{nowGcpStyle}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">聯絡機關：{{nowGcpContactName}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">聯絡人：{{nowGcpContactPrs}}</td>
          </tr>
          <tr>
            <td scope="col" class="f_05 bl_r_doble bl_b">電話：{{nowGcpContactTel}}</td>
          </tr>
          <tr style="height: 6em;vertical-align: top;">
            <!-- 點之記說明 -->
            <td 
              scope="col" colspan="2" 
              class="f_05 py-2 bl_l_doble bl_b bl_r">
              {{nowGcpDespStr}}<span v-if="nowGcpContactCom" style="color: red;">[{{nowGcpContactCom}}]</span>
            </td>
            <td scope="col" class="f_05 py-2 bl_r_doble bl_b">地址：{{nowGcpContactAds}}</td>
          </tr>
          <tr>
            <td scope="col" width="50%" 
              class="photo_h bl_l_doble bl_b bl_r">
              <!-- 遠1 -->
              <img :src="nowPRecordImg1DL" onerror="this.src=''" class="img-allfluid" />
            </td>
            <td scope="col" colspan="2" class="photo_h bl_r_doble bl_b">
              <!-- 近照 -->
              <img :src="nowPRecordImg0DL" onerror="this.src=''" class="img-allfluid" />
            </td>
          </tr>
          <tr>
            <td scope="col" 
              class="photo_h bl_l_doble bl_b_doble bl_r">
              <!-- 遠2 -->
              <img :src="nowPRecordImg2DL" onerror="this.src=''" class="img-allfluid" />
            </td>
            <td scope="col" colspan="2" class="photo_h bl_r_doble bl_b_doble">
              <!-- 遠3 -->
              <img :src="nowPRecordImg3DL" onerror="this.src=''" class="img-allfluid" />
            </td>
          </tr>
        </table>
    </div>
  </div>
  <div class="page-gap"></div>
</template>
<style>
@media screen {
	html, body{
		width: 210mm;
		/* height: 297mm; */
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
    margin-left: auto;
		margin-right: auto;
		padding-top: 1.5cm;
		padding-bottom: 1.5cm;
		padding-left: 2cm;
		padding-right: 2cm;
	}
	.page-gap{
		height: 20px;
	}
}
@page {
  size: A4 portrait; /* 混合使用 */
  margin: 0.5cm 2cm; /* 頁緣扣頁首頁尾 */
	orphans:0;
  widows:0;
}
@media print{
	html, body{
    width: 100%;
		height: 100%;
		margin: 0;
		counter-reset: page-number;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
		/* border: 1px solid green; */
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
		padding-bottom: 1cm;
		padding-left: 0cm;
		padding-right: 0cm;
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

/* 頁面 */
.page_content{
  width: auto;
  height: auto;
  /* border: 1px solid rebeccapurple; */
}

/* 表格 */
td{
  height: 2em;
  padding-left: 0.3em;
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
  border-top: 1.5px solid;
}
.bl_b_2{
  border-bottom: 5px solid;
}
.bl_l_2{
  border-left: 5px solid;
}
.bl_r_2{
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

/* 字型 */
/* 粗體 */
.f_bolder{
	font-weight:bolder;
}
.f_bold{
  font-weight:bold;
}
/* 靠左 */
.f_left{
	text-align: left;
}
/* 靠右 */
.f_right{
	text-align: right;
}
/* 置中 */
.f_mid{
	text-align: center;
}
/* 中文加寬 */
.f_C{
  letter-spacing: 5px;
}

/* 標題字 */
.f_01{
  font-family: "Times New Roman", 標楷體;
  text-align: center;
  font-size: 20pt;
	line-height: 1;
}
/* 頁首頁尾註記 */
.f_02{
  font-family: "Times New Roman", 標楷體;
  /* padding: 3px 10px 3px 10px; */
  font-size: 12pt;
	line-height: 2;
	letter-spacing: 0px;
  /* font-weight:bold; */
}

/* 內文 */
.f_03{
  /* 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif; */
  font-family: sans-serif, 標楷體;
  font-size: 14pt;
  line-height: 1;
  font-weight:bold;
}

/* 點號 */
.f_04{
  font-family: sans-serif, 標楷體;
  font-size: 18pt;
  line-height: 1;
  font-weight:bold;
}

/* 紀錄 */
.f_05{
  font-family: sans-serif, 標楷體;
  font-size: 11pt;
  line-height:1;
  /* font-weight:bold; */
}

/* 照片 */
.photo_h{
  height: 14rem;
}
.img-allfluid{
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
