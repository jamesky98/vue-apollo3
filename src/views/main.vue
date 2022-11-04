<script setup>
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide, inject } from "vue";
import { computed } from "@vue/reactivity";
import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBIcon,
  MDBBtn,
  MDBSelect,
} from 'mdb-vue-ui-kit';
import { RouterLink } from 'vue-router';
import ToolsGQL from "../graphql/Tools";
// import CaseGQL from "../graphql/Cases";
// import CustGQL from "../graphql/Cust";
// import GcpGQL from "../graphql/Gcp";
// import PrjGQL from "../graphql/Prj";
// import EmpGQL from "../graphql/Employee";
// import ItemGQL from "../graphql/Item";


// 判斷token狀況
import { useQuery, useMutation} from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
getchecktoken();

//#region 參數==========Start
const NavItem = ref("main");
provide("NavItem", NavItem);

const chartShow = ref([true,true,true,true]);
const chartShowCol = ref(["6","6","6","6"]);
const chartClass = ref(["h-50","h-50","h-50","h-50"]);

const selYear = ref("");
const selYearMU = ref([]);
const selYearDOM = ref();

const selYear2 = ref("");
const selYearMU2 = ref([]);
const selYearDOM2 = ref();

// 日期模式清單
const selDmethod = ref("");
const selDmethodMU = ref([
  { text: "-未選取-", value: -1 },
  { text: "申請日", value: "app_date" },
  { text: "收件日", value: "receive_date" },
  { text: "完成日", value: "complete_date" },
  { text: "繳費日", value: "pay_date" },
]);
const selDmethodDOM = ref();

//#endregion 參數==========End

// 統計資料查詢==========Start

//#region Chart1==========Start
const ctx1 = ref();
const myChart1 = ref();
const chartData1 = ref([]);
// 查詢完成日期年份，並填入清單
const { mutate: getCaseYears, onDone: getCaseYearsOnDone } = useMutation(ToolsGQL.STATCASEMINMAXYEAR);
getCaseYearsOnDone(result=>{
  let getData = result.data.statCaseMinMaxYear;
  // chart1
  selYearMU.value = getData.map(x => {
    return { text: x, value: x }
  });selYearMU.value.unshift({ text: "-未選取-", value: -1 });
  // chart2
  selYearMU2.value = getData.map(x => {
    return { text: x, value: x }
  });selYearMU2.value.unshift({ text: "-未選取-", value: -1 });

})

// 查詢校正人員案件數 by Year
const { mutate: getCasebyOpr, onDone: getCasebyOprOnDone } = useMutation(ToolsGQL.STATCASEBYOPR);
getCasebyOprOnDone(result=>{
  // console.log('2-getCasebyOprOnDone')
  chartData1.value = result.data.statCaseByOpr;
  // console.log('3-OnDone res:',chartData1.value);
  if(myChart1.value) myChart1.value.destroy();

  // console.log('4-new Chart',myChart1.value);
  ctx1.value = document.getElementById('myChart1').getContext('2d');
  // console.log('5-ctx1',ctx1.value);
  myChart1.value = new Chart(ctx1.value, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: '航測相機',
          backgroundColor: '#A6C2F5',
          borderColor: '#1449AC',
          borderWidth: 1,
          borderSkipped: false,
          data: chartData1.value,
          parsing: {
              yAxisKey: 'data.c1'
          }
        },
        {
          label: '空載光達',
          backgroundColor: '#68DE99',
          borderColor: '#135830',
          borderWidth: 1,
          borderSkipped: false,
          data: chartData1.value,
          parsing: {
              yAxisKey: 'data.c2'
          }
        },
        {
          label: '小像幅',
          backgroundColor: '#FFB69C',
          borderColor: '#C03300',
          borderWidth: 1,
          borderSkipped: false,
          data: chartData1.value,
          parsing: {
              yAxisKey: 'data.c3'
          }
        },
        {
          type: 'line',
          label: '合計',
          backgroundColor: bgcolorList[3],
          borderColor: brcolorList[3],
          borderWidth: 1,
          data: chartData1.value,
          parsing: {
              yAxisKey: 'data.total'
          }
        },
      ]
    },
    options: {
      responsive: true,
      parsing: {
        xAxisKey: 'name',
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          title: {
            display: true,
            text: '案件數'
          },
          ticks: {
            // forces step size to be 50 units
            stepSize: 1
          },
          beginAtZero: true,
          stacked: false
        }
      },
      plugins: {
        title: {
          display: true,
          text: '各人員年度案件數',
        },
        legend: {
          position: 'right',
        },
      }
    }
  });
});

function changeChart1Year(e){
  getCasebyOpr({
    year: (parseInt(selYear.value) && parseInt(selYear.value)!==-1)?parseInt(selYear.value)+1911:null,
    calNum: 3
  })
}

//#endregion Chart1==========End


//#region Chart2==========Start
const ctx2 = ref();
const myChart2 = ref();
const chartData2 = ref([]);
// 查詢案件數 by Mounth Year
const { mutate: getCasebyMounth, onDone: getCasebyMounthOnDone } = useMutation(ToolsGQL.STATCASEBYMOUNTH);
getCasebyMounthOnDone(result=>{
  chartData2.value = result.data.statCaseByMounth;
  console.log(chartData2.value);
  if(myChart2.value) myChart2.value.destroy();

  ctx2.value = document.getElementById('myChart2').getContext('2d');
  myChart2.value = new Chart(ctx2.value, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'F(外校)',
          backgroundColor: '#A6C2F5',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c1o'
          },
          stack: 'Stack 1',
        },
        {
          label: 'F(內校)',
          backgroundColor: '#6495ED',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c1i'
          },
          stack: 'Stack 1',
        },
        {
          label: 'F(未完成)',
          backgroundColor: '#8B87C6',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c1x'
          },
          stack: 'Stack 1',
        },
        {
          label: 'I(外校)',
          backgroundColor: '#68DE99',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c2o'
          },
          stack: 'Stack 2',
        },
        {
          label: 'I(內校)',
          backgroundColor: '#229954',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c2i'
          },
          stack: 'Stack 2',
        },
        {
          label: 'I(未完成)',
          backgroundColor: '#447746',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c2x'
          },
          stack: 'Stack 2',
        },
        {
          label: 'J(外校)',
          backgroundColor: '#FFB69C',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c3o'
          },
          stack: 'Stack 3',
        },
        {
          label: 'J(內校)',
          backgroundColor: '#FF7F50',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c3i'
          },
          stack: 'Stack 3',
        },
        {
          label: 'J(未完成)',
          backgroundColor: '#CC7182',
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c3x'
          },
          stack: 'Stack 3',
        },
        {
          type: 'line',
          label: '累計(外校)',
          backgroundColor: bgcolorList[1],
          borderColor: brcolorList[1],
          borderWidth: 1,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'Stotalo'
          },
          tension: 0.4
        },
        {
          type: 'line',
          label: '累計(內校)',
          backgroundColor: bgcolorList[2],
          borderColor: brcolorList[2],
          borderWidth: 1,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'Stotali'
          },
          tension: 0.4
        },
      ]
    },
    options: {
      responsive: true,
      parsing: {
        xAxisKey: 'id',
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '月份'
          },
          stacked: true,
        },
        y: {
          title: {
            display: true,
            text: '案件數'
          },
          ticks: {
            stepSize: 1
          },
          beginAtZero: true,
          stacked: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: '年度每月案件數',
        },
        legend: {
          position: 'right',
        },
      }
    }
  })
  
})


function changeChart2Year(e){
  getCasebyMounth({
    year:(parseInt(selYear2.value) && parseInt(selYear2.value)!==-1)?parseInt(selYear2.value)+1911:new Date().getFullYear,
    calNum: 3,
    method:(selDmethod.value && selDmethod.value!==-1)?selDmethod.value:'app_date',
  })
}

//#endregion Chart2==========End

// 統計資料查詢==========End

//#region 圖表設定==========Start
const bgcolorList = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'];
const brcolorList = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'];

onMounted(()=>{ 
  
  // console.log('0-onMounted');
  getCaseYears().then(res=>{
    // console.log('1-getCaseYears');
    let latestYear = res.data.statCaseMinMaxYear[0];
    // 圖表1
    selYearDOM.value.setValue(latestYear);
    // 圖表2
    selDmethod.value = "app_date";
    selYearDOM2.value.setValue(latestYear);
    // selDmethodDOM.value.setValue(selDmethod.value);
    

  })
  
});

//#endregion 圖表設定==========End

// 圖表縮放
const chartMax = ref(false);
function zoomCart(Index){
  if(chartMax.value){
    // 還原
    // console.log('還原')
    chartShow.value.forEach((x,i,a)=>{a[i]=true});
    chartShowCol.value.forEach((x,i,a)=>{a[i]="6"});
    chartClass.value.forEach((x,i,a)=>{a[i]="h-50"});
    chartMax.value=false
  }else{
    // 放大
    // console.log('放大')
    chartShow.value.forEach((x,i,a)=>{
      if(i===Index){
        a[i]=true;
      }else{
        a[i]=false;
      }
    });
    chartShowCol.value.forEach((x,i,a)=>{
      if(i===Index){
        a[i]="12"
      }else{
        a[i]="6"
      }
    });
    chartClass.value.forEach((x,i,a)=>{
      if(i===Index){
        a[i]="h-100"
      }else{
        a[i]="h-50"
      }
    });
    chartMax.value=true
  }
}

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 頁首 -->
      <header>
        <Navbar1 />
        <!-- Navbar -->
        <!-- Background image -->
        <div class="p-5 text-center bg-image" style="background-image: url('ZZZZZ2598.png');height: 150px;">
          <div class="mask" style="background-color: rgba(255, 255, 255, 0.2);">
          </div>
        </div>
        <!-- Background image -->
      </header>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 16rem);margin-left:0;margin-right:0;" class="w-100 overflow-auto">
        <MDBCol col="12" class="py-2">
          <MDBRow class="h-100 border border-5 rounded-8 shadow-4">
            <!-- 左方導航列 -->
            <MDBCol md="3">
              <MDBRow class="d-flex flex-column">
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'docs'}">
                    <MDBIcon icon="file-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />文件查詢
                  </RouterLink>
                </MDBCol>
                <MDBCol class=" px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'cases'}">
                    <MDBIcon icon="balance-scale" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />校正案件
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'employee'}">
                    <MDBIcon icon="user-edit" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />人員管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'gcps'}">
                    <MDBIcon icon="map-marked-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />點位管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'prjs'}">
                    <MDBIcon icon="drafting-compass" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    參考值量測作業
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'items'}">
                    <MDBIcon icon="wrench" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />標準件管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'cust' }">
                    <MDBIcon far icon="handshake" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />顧客管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'ucedit'}">
                    <MDBIcon icon="project-diagram" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    不確定度管理
                  </RouterLink>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 右方統計圖 -->
            <MDBCol md="9" class="border h-100">
              <!-- 加入統計圖 -->
              <MDBRow class="h-100">
                <!-- 圖表1 -->
                <MDBCol v-show="chartShow[0]" :col="chartShowCol[0]" class="border" :class="chartClass[0]">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU"
                        v-model:selected="selYear" 
                        ref="selYearDOM" 
                        @change="changeChart1Year($event)"/>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(0)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart1" class="border" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                  
                  
                </MDBCol>
                <!-- 圖表2 -->
                <MDBCol v-show="chartShow[1]" :col="chartShowCol[1]" class="border" :class="chartClass[1]">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU2"
                        v-model:selected="selYear2" 
                        ref="selYearDOM2" 
                        @change="changeChart2Year($event)"/>
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="日期模式" 
                        v-model:options="selDmethodMU"
                        v-model:selected="selDmethod" 
                        ref="selDmethodDOM" 
                        @change="changeChart2Year($event)"/>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(1)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart2" class="border" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <!-- 圖表3 -->
                <MDBCol v-show="chartShow[2]" :col="chartShowCol[2]" class="border" :class="chartClass[2]">
                  <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                    <canvas id="myChart3" class="border" style="max-height: 100%; max-width: 100%"></canvas>
                  </MDBCol>
                </MDBCol>
                <!-- 圖表4 -->
                <MDBCol v-show="chartShow[3]" :col="chartShowCol[3]" class="border" :class="chartClass[3]">
                  <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                    <canvas id="myChart4" class="border" style="max-height: 100%; max-width: 100%"></canvas>
                  </MDBCol>
                </MDBCol>
                <!-- 圖表5 -->
                <!-- <MDBCol col="4" class="h-50 border d-flex align-items-center justify-content-center"> -->
                  <!-- <canvas id="myChart5" class="border"></canvas> -->
                <!-- </MDBCol> -->
                <!-- 圖表6 -->
                <!-- <MDBCol col="4" class="h-50 border d-flex align-items-center justify-content-center"> -->
                  <!-- <canvas id="myChart6" class="border"></canvas> -->
                <!-- </MDBCol> -->

              </MDBRow>
              
              
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- Footer -->
      <footer>
        <!-- Copyright -->
        <div class="text-center" style="background-color: rgba(0, 0, 0, 0.05); height: 2.5em;">
          © 2022 Copyright:
          <a class="text-reset fw-bold" href="">jamesky98</a>
        </div>
        <!-- Copyright -->
      </footer>
      <!-- Footer -->
    </MDBRow>
  </MDBContainer>
</template>
