<script setup>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

// 判斷token狀況
import { useQuery, useMutation} from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { errorHandle, logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken } = useMutation(UsersGQL.CHECKTOKEN);

//#region 參數==========Start
const infomsg = ref("");
const alert1 = ref(false);
const NavItem = ref("main");
provide("NavItem", NavItem);

const chartShow = ref([true,true,true,true,true,true]); // 圖表顯示(縮放時隱藏用)
const chartShowCol = ref(["4","4","4","4","4","4"]); // 排版寬度
const chartClass = ref(["h-50","h-50","h-50","h-50","h-50","h-50"]); // 排版高度

const selYear = ref(""); // chart1_選擇年度
const selYearMU = ref([]); // chart1_選擇年度_列表
const selYearDOM = ref(); // chart1_選擇年度_元件

const selYear2 = ref(""); // chart2_選擇年度
const selYearMU2 = ref([]); // chart2_選擇年度_列表
const selYearDOM2 = ref(); // chart2_選擇年度_元件

const selYear3 = ref(""); // chart3_選擇年度
const selYearMU3 = ref([]); // chart3_選擇年度_列表
const selYearDOM3 = ref(); // chart3_選擇年度_元件

const selYear4 = ref(""); // chart4_選擇年度
const selYearMU4 = ref([]); // chart4_選擇年度_列表
const selYearDOM4 = ref(); // chart4_選擇年度_元件

const selYear5 = ref(""); // chart5_選擇年度
const selYearMU5 = ref([]); // chart5_選擇年度_列表
const selYearDOM5 = ref(); // chart5_選擇年度_元件

const selYear6 = ref(""); // chart6_選擇年度
const selYearMU6 = ref([]); // chart6_選擇年度_列表
const selYearDOM6 = ref(); // chart6_選擇年度_元件
const selMounth6 = ref(""); // chart6_選擇月份
const selMounthMU6 = ref([]); // chart6_選擇月份_列表
const selMounthDOM6 = ref(); // chart6_選擇月份_元件

const fl_total = ref("");
const fl_per = ref("");
const fl_now = ref("");
const fl_total_i = ref("");
const fl_per_i = ref("");
const fl_now_i = ref("");
// 航測像機(大)總數
const fl_total_str = computed(()=>{
  let temp = (fl_total_i.value)?'('+fl_total_i.value+')':''
  return fl_total.value + temp
});
// 航測像機(大)前次總數
const fl_per_str = computed(()=>{
  let temp = (fl_per_i.value)?'('+fl_per_i.value+')':''
  return fl_per.value + temp
});
// 航測像機(大)本月增加
const fl_now_str = computed(()=>{
  let temp = (fl_now_i.value)?'('+fl_now_i.value+')':''
  return fl_now.value + temp
});

const fm_total = ref(""); 
const fm_per = ref("");
const fm_now = ref("");
const fm_total_i = ref(""); 
const fm_per_i = ref("");
const fm_now_i = ref("");
// 航測像機(中)總數
const fm_total_str = computed(()=>{
  let temp = (fm_total_i.value)?'('+fm_total_i.value+')':''
  return fm_total.value + temp
});
// 航測像機(中)前次總數
const fm_per_str = computed(()=>{
  let temp = (fm_per_i.value)?'('+fm_per_i.value+')':''
  return fm_per.value + temp
});
// 航測像機(中)本月增加
const fm_now_str = computed(()=>{
  let temp = (fm_now_i.value)?'('+fm_now_i.value+')':''
  return fm_now.value + temp
});


const ic_total = ref(""); 
const ic_per = ref("");
const ic_now = ref("");
const ic_total_i = ref(""); 
const ic_per_i = ref("");
const ic_now_i = ref("");
// 空載光達總數
const ic_total_str = computed(()=>{
  let temp = (ic_total_i.value)?'('+ic_total_i.value+')':''
  return ic_total.value + temp
});
// 空載光達前次總數
const ic_per_str = computed(()=>{
  let temp = (ic_per_i.value)?'('+ic_per_i.value+')':''
  return ic_per.value + temp
});
// 空載光達本月增加
const ic_now_str = computed(()=>{
  let temp = (ic_now_i.value)?'('+ic_now_i.value+')':''
  return ic_now.value + temp
});

const jc_total = ref(""); 
const jc_per = ref("");
const jc_now = ref("");
const jc_total_i = ref(""); 
const jc_per_i = ref("");
const jc_now_i = ref("");
// 小像幅總數
const jc_total_str = computed(()=>{
  let temp = (jc_total_i.value)?'('+jc_total_i.value+')':''
  return jc_total.value + temp
});
// 小像幅前次總數
const jc_per_str = computed(()=>{
  let temp = (jc_per_i.value)?'('+jc_per_i.value+')':''
  return jc_per.value + temp
});
// 小像幅本月增加
const jc_now_str = computed(()=>{
  let temp = (jc_now_i.value)?'('+jc_now_i.value+')':''
  return jc_now.value + temp
});

const Mc_total = ref(""); 
const Mc_per = ref("");
const Mc_now = ref("");
const Mc_total_i = ref(""); 
const Mc_per_i = ref("");
const Mc_now_i = ref("");
// 車載光達總數
const Mc_total_str = computed(()=>{
  let temp = (Mc_total_i.value)?'('+Mc_total_i.value+')':''
  return Mc_total.value + temp
});
// 車載光達前次總數
const Mc_per_str = computed(()=>{
  let temp = (Mc_per_i.value)?'('+Mc_per_i.value+')':''
  return Mc_per.value + temp
});
// 車載光達本月增加
const Mc_now_str = computed(()=>{
  let temp = (Mc_now_i.value)?'('+Mc_now_i.value+')':''
  return Mc_now.value + temp
});

const money_total = ref(""); // 營運收入總數
const money_per = ref(""); // 營運收入前次總數
const money_now = ref(""); // 營運收入本月增加


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

const selDmethod3 = ref("");
const selDmethodMU3 = ref([
  { text: "-未選取-", value: -1 },
  { text: "申請日", value: "app_date" },
  { text: "收件日", value: "receive_date" },
  { text: "完成日", value: "complete_date" },
  { text: "繳費日", value: "pay_date" },
]);
const selDmethodDOM3 = ref();

const selDmethod4 = ref("");
const selDmethodMU4 = ref([
  { text: "-未選取-", value: -1 },
  { text: "申請日", value: "app_date" },
  { text: "收件日", value: "receive_date" },
  { text: "完成日", value: "complete_date" },
  { text: "繳費日", value: "pay_date" },
]);
const selDmethodDOM4 = ref();

//#endregion 參數==========End

//#region 統計資料查詢==========Start
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
    // chart3
    selYearMU3.value = getData.map(x => {
      return { text: x, value: x }
    });selYearMU3.value.unshift({ text: "-未選取-", value: -1 });
    // chart4
    selYearMU4.value = getData.map(x => {
      return { text: x, value: x }
    });selYearMU4.value.unshift({ text: "-未選取-", value: -1 });
    // chart5
    selYearMU5.value = getData.map(x => {
      return { text: x, value: x }
    });selYearMU5.value.unshift({ text: "-未選取-", value: -1 });
    // chart6
    let minYear = Math.min(...getData)+1911;
    let nowYear = new Date().getFullYear();
    let yearlist =[];
    for(let i=minYear-1911;i<nowYear-1911+1;i++){
      yearlist.push({ text: i, value: i });
    }
    yearlist.reverse();
    yearlist.unshift({ text: "-未選取-", value: -1 });
    selYearMU6.value=yearlist;
    let monlist =[];
    for(let m=1;m<13;m++){
      monlist.push({ text: m, value: m })  
    }
    monlist.unshift({ text: "-未選取-", value: -1 });
    selMounthMU6.value=monlist;
  })
//#endregion 統計資料查詢==========End

  //#region Chart1==========Start
  const ctx1 = ref();
  const myChart1 = ref();
  const chartData1 = ref([]);
  // Chart1_查詢校正人員案件數 by Year
  const { mutate: getCasebyOpr, onDone: getCasebyOprOnDone, onError: getCasebyOpronError } = useMutation(ToolsGQL.STATCASEBYOPR);
  getCasebyOprOnDone(result=>{
    // console.log('2-getCasebyOprOnDone')
    chartData1.value = result.data.statCaseByOpr;
    // console.log(chartData1.value);
    // console.log('3-OnDone res:',chartData1.value);
    // 清除Chart1圖表
    if(myChart1.value) myChart1.value.destroy();

    // console.log('4-new Chart',myChart1.value);
    // 取得Chart1畫布空間
    ctx1.value = document.getElementById('myChart1').getContext('2d');
    // console.log('5-ctx1',ctx1.value);
    // 建立Chart1圖表
    myChart1.value = new Chart(ctx1.value, {
      type: 'bar',
      data: {
        // cal_type c1:航測相機 c2:空載光達 c3:小像幅 c9:車載
        // _o:外校 _i:內校
        datasets: [
          // {

          //   type: 'line',
          //   label: '總計',
          //   // backgroundColor: bgcolor_20[5],
          //   borderColor: '#ff6090',
          //   borderDash: [10, 6],
          //   borderWidth: 5,
          //   data: chartData1.value,
          //   parsing: {
          //       yAxisKey: 'data.total'
          //   },
          //   hidden: true,
          //   stacked: false,
          //   stepped: 'middle',
          //   radius: 0,
          // },
          {
            label: '航測相機',
            backgroundColor: bgcolor_60[0],
            // borderColor: bgcolor_100[0],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c1_o'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '航測相機(內)',
            backgroundColor: bgcolor_20[0],
            // borderColor: bgcolor_100[0],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c1_i'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '空載光達',
            backgroundColor: bgcolor_60[1],
            // borderColor: bgcolor_100[1],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c2_o'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '空載光達(內)',
            backgroundColor: bgcolor_20[1],
            // borderColor: bgcolor_100[1],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c2_i'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '小像幅',
            backgroundColor: bgcolor_60[2],
            // borderColor: bgcolor_100[2],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c3_o'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '小像幅(內)',
            backgroundColor: bgcolor_20[2],
            // borderColor: bgcolor_100[2],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c3_i'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '車載光達',
            backgroundColor: bgcolor_60[3],
            // borderColor: bgcolor_100[2],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c9_o'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          {
            label: '車載光達(內)',
            backgroundColor: bgcolor_20[3],
            // borderColor: bgcolor_100[2],
            // borderWidth: 1,
            data: chartData1.value,
            parsing: {
                yAxisKey: 'data.c9_i'
            },
            stacked: true,
            stack: 'Stack 1',
          },
          // {
          //   type: 'line',
          //   label: '外校合計',
          //   // backgroundColor: bgcolor_20[3],
          //   borderColor: bgcolor_100[3],
          //   borderDash: [2, 2],
          //   borderWidth: 3,
          //   data: chartData1.value,
          //   parsing: {
          //       yAxisKey: 'data.total_o'
          //   },
          //   stacked: false,
          //   hidden: true,
          //   stepped: 'middle',
          //   radius: 0,
          // },
          // {
          //   type: 'line',
          //   label: '內校合計',
          //   // backgroundColor: bgcolor_20[4],
          //   borderColor: bgcolor_100[4],
          //   borderDash: [2, 2],
          //   borderWidth: 3,
          //   data: chartData1.value,
          //   parsing: {
          //       yAxisKey: 'data.total_i'
          //   },
          //   stacked: false,
          //   hidden: true,
          //   stepped: 'middle',
          //   radius: 0,
          // },
          
        ]
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        parsing: {
          xAxisKey: 'name',
        },
        scales: {
          x: {
            stacked: true,
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
            suggestedMax: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: '各人員年度案件數',
          },
          legend: {
            display: false,
            position: 'right',
          },
          tooltip:{
            callbacks: {
              footer: function(context) {
                // console.log(context);
                let total = 0 ;
                for (let i=0;i<context.length;i++){
                  total = total + context[i].parsed.y;
                }
                return '合計:' + total;
              },
              label: function(context) {
                // console.log(context)
                return (context.parsed.y===0)?'':(context.dataset.label + ':' + context.parsed.y);
              },
            }
          },
        }
      }
    });
  });
  getCasebyOpronError(e=>{errorHandle(e,infomsg,alert1)});

  function changeChart1Year(e){
    getCasebyOpr({
      year: (parseInt(selYear.value) && parseInt(selYear.value)!==-1)?parseInt(selYear.value)+1911:new Date().getFullYear(),
      calNum: 3
    })
  }

  //#endregion Chart1==========End

//#region Chart2==========Start
const ctx2 = ref();
const myChart2 = ref();
const chartData2 = ref([]);
// 查詢案件數 by Mounth Year
const { mutate: getCasebyMounth, onDone: getCasebyMounthOnDone, onError: getCasebyMounthonError } = useMutation(ToolsGQL.STATCASEBYMOUNTH);
getCasebyMounthOnDone(result=>{
  chartData2.value = result.data.statCaseByMounth;
  // console.log(chartData2.value);
  if(myChart2.value) myChart2.value.destroy();
  ctx2.value = document.getElementById('myChart2').getContext('2d');
  myChart2.value = new Chart(ctx2.value, {
    type: 'bar',
    data: {
      datasets: [
        {
          type: 'line',
          label: '累計',
          backgroundColor: bgcolor_20[5],
          borderColor: bgcolor_100[5],
          borderWidth: 1,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'Stotalo'
          },
          stacked: false,
          tension: 0.4
        },
        {
          type: 'line',
          label: '當月',
          backgroundColor: bgcolor_20[4],
          borderColor: bgcolor_100[4],
          borderDash: [6, 2],
          borderWidth: 2,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'total'
          },
          stacked: false,
          stepped: 'middle',
          radius: 0,
        },
        {
          label: '航測像機',
          backgroundColor: bgcolor_100[0],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c1o'
          },
          stacked: true,
          stack: 'Stack 1',
        },
        {
          label: '空載光達',
          backgroundColor: bgcolor_100[1],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c2o'
          },
          stacked: true,
          stack: 'Stack 1',
        },
        {
          label: '小像幅',
          backgroundColor: bgcolor_100[2],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c3o'
          },
          stacked: true,
          stack: 'Stack 1',
        },
        {
          label: '車載光達',
          backgroundColor: bgcolor_100[3],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c9o'
          },
          stacked: true,
          stack: 'Stack 1',
        },
        {
          label: '航測像機(未完成)',
          backgroundColor: bgcolor_20[0],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c1x'
          },
          stacked: true,
          stack: 'Stack 2',
        },
        {
          label: '空載光達(未完成)',
          backgroundColor: bgcolor_20[1],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c2x'
          },
          stacked: true,
          stack: 'Stack 2',
        },
        {
          label: '小像幅(未完成)',
          backgroundColor: bgcolor_20[2],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c3x'
          },
          stacked: true,
          stack: 'Stack 2',
        },
        {
          label: '車載光達(未完成)',
          backgroundColor: bgcolor_20[3],
          borderSkipped: false,
          data: chartData2.value,
          parsing: {
              yAxisKey: 'c9x'
          },
          stacked: true,
          stack: 'Stack 2',
        },
        // {
        //   label: 'F(內校)',
        //   backgroundColor: bgcolor_60[0],
        //   borderSkipped: false,
        //   data: chartData2.value,
        //   parsing: {
        //       yAxisKey: 'c1i'
        //   },
        //   stacked: true,
        //   stack: 'Stack 1',
        // },
        // {
        //   label: 'I(內校)',
        //   backgroundColor: bgcolor_60[1],
        //   borderSkipped: false,
        //   data: chartData2.value,
        //   parsing: {
        //       yAxisKey: 'c2i'
        //   },
        //   stacked: true,
        //   stack: 'Stack 2',
        // },
        // {
        //   label: 'J(內校)',
        //   backgroundColor: bgcolor_60[2],
        //   borderSkipped: false,
        //   data: chartData2.value,
        //   parsing: {
        //       yAxisKey: 'c3i'
        //   },
        //   stacked: true,
        //   stack: 'Stack 3',
        // },
        
        // {
        //   type: 'line',
        //   label: '累計(內校)',
        //   backgroundColor: bgcolor_20[4],
        //   borderColor: bgcolor_100[4],
        //   borderWidth: 1,
        //   data: chartData2.value,
        //   parsing: {
        //       yAxisKey: 'Stotali'
        //   },
        //   stacked: false,
        //   tension: 0.4
        // },
      ]
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
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
          
        },
      },
      plugins: {
        title: {
          display: true,
          text: '年度每月案件數',
        },
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyleWidth: 8,
            font:{
              size: 10,
              lineHeight: 1
            },
          }
        },
        tooltip:{
          callbacks: {
            title: function(context) {
              // console.log(context);
              return context[0].label + '月'
            },
            label: function(context) {
              // console.log(context)
              let labelstr = '';
              if(context.dataset.label==='累計' || context.dataset.label==='當月'){
                labelstr = (context.parsed.y && context.parsed.y!==0)?(context.dataset.label + ':' + context.parsed.y):(context.dataset.label + ':0');
              }else{
                labelstr = (context.parsed.y && context.parsed.y!==0)?(context.dataset.label + ':' + context.parsed.y):'';
              }
              return labelstr;
            },
          }
        },
      }
    }
  })
  
})
getCasebyMounthonError(e=>{errorHandle(e,infomsg,alert1)});

function changeChart2Year(e){
  // console.log('changeChart2Year');
  // console.log('year',selYear2.value);
  // console.log('selDmethod',selDmethod.value);
  if(selYear2.value!==-1){
    getCasebyMounth({
      year:((selYear2.value) && parseInt(selYear2.value)!==-1)?parseInt(selYear2.value)+1911:new Date().getFullYear(),
      method:(selDmethod.value && selDmethod.value!==-1)?selDmethod.value:'receive_date',
    })
  }
}

//#endregion Chart2==========End

//#region Chart3==========Start
const ctx3 = ref();
const myChart3 = ref();
const chartData3 = ref([]);
// 查詢校正人員案件數 by Year
const { mutate: getCaseTypebyYear, onDone: getCaseTypebyYearOnDone, onError: getCaseTypebyYearonError } = useMutation(ToolsGQL.STATCASETYPEBYYEAR);
getCaseTypebyYearOnDone(result=>{
  // console.log('2-getCasebyOprOnDone')
  chartData3.value = result.data.statCaseTypeByYear;
  // console.log('chartData3',chartData3.value);
  let calName = ['航測像機','空載光達','小像幅','車載光達']
  const data = {
    labels: calName,
    datasets: [
      {
        label: '外校',
        data: chartData3.value.map(x=>{return x.count_o}),
        backgroundColor: bgcolor_100.slice(0,4),
        hoverOffset: 4,
        tooltip: {
          callbacks: {
            label: function(e){
              return e.label + '(外校): ' + e.formattedValue
            }
          }
        },
        datalabels: {
          color: 'rgb(50,50,50)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: function(context) {
            let dataset = context.dataset;
            let value = dataset.data[context.dataIndex];
            return value > 0;
          },
          font: {
            size: 12
          },
          formatter: function(value, context) {
            return (value>0)?context.chart.data.labels[context.dataIndex]+': '+value:'';
          }
        }
      },
      {
        label: '內校',
        data: chartData3.value.map(x=>{return x.count_i}),
        backgroundColor: bgcolor_20.slice(0,4),
        hoverOffset: 4,
        tooltip: {
          callbacks: {
            label: function(e){
              return e.label + '(內校): ' + e.formattedValue
            }
          }
        },
        datalabels: {
          color: 'rgb(125,125,125)',
          font: {
            size: 12
          },
          formatter: function(value, context) {
            return (value>0)?context.chart.data.labels[context.dataIndex]+'(內): '+value:'';
            // return '';
          }
        }
      },
    ]
  };

  // console.log('3-OnDone res:',chartData3.value);
  if(myChart3.value) myChart3.value.destroy();

  // console.log('4-new Chart',myChart3.value);
  ctx3.value = document.getElementById('myChart3').getContext('2d');
  // console.log('5-ctx1',ctx3.value);
  myChart3.value = new Chart(ctx3.value, {
    type: 'doughnut',
    data: data,
    plugins: [ChartDataLabels],
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
      },
      plugins: {
        title: {
          display: true,
          text: '各項目年度案件數',
        },
        legend: {
          position: 'right',
        },
        
      }
    }
  });
});
getCaseTypebyYearonError(e=>{errorHandle(e,infomsg,alert1)});

function changeChart3Year(e){
  if(selYear3.value!==-1){
    getCaseTypebyYear({
      year: (parseInt(selYear3.value) && parseInt(selYear3.value)!==-1)?parseInt(selYear3.value)+1911:new Date().getFullYear(),
      method:(selDmethod3.value && selDmethod3.value!==-1)?selDmethod3.value:'app_date',
    })
  }
}
//#endregion Chart3==========End

//#region Chart4==========Start
const ctx4 = ref();
const myChart4 = ref();
const chartData4 = ref([]);
// 查詢校正人員案件數 by Year
const { mutate: getCaseStatusbyYear, onDone: getCaseStatusbyYearOnDone, onError: getCaseStatusbyYearonError } = useMutation(ToolsGQL.STATCASESTATUSBYYEAR);
getCaseStatusbyYearOnDone(result=>{
  // console.log('2-getCasebyOprOnDone')
  chartData4.value = result.data.statCaseStatusByYear;
  // console.log(chartData3.value);
  let calName = ['(無)','審核中','待送件','校正中','報告陳核','待繳費(出具報告)','結案','補件','退件']
  const data = {
    labels: calName,
    datasets: [
      {
        label: '外校',
        data: chartData4.value,
        backgroundColor: [
          'rgba(128,128,128,1)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 99, 132, 1)',
        ],
        hoverOffset: 4,
      },
    ]
  };

  // console.log('3-OnDone res:',chartData1.value);
  if(myChart4.value) myChart4.value.destroy();

  // console.log('4-new Chart',myChart1.value);
  ctx4.value = document.getElementById('myChart4').getContext('2d');
  // console.log('5-ctx1',ctx1.value);
  myChart4.value = new Chart(ctx4.value, {
    type: 'doughnut',
    data: data,
    plugins: [ChartDataLabels],
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
      },
      plugins: {
        title: {
          display: true,
          text: '年度案件進度統計',
        },
        legend: {
          position: 'right',
        },
        datalabels: {
          color: 'white',
          font: {
            size: 12
          },
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: function(context) {
            let dataset = context.dataset;
            let value = dataset.data[context.dataIndex];
            return value > 0;
          },
          formatter: function(value, context) {
            return (value>0)?context.chart.data.labels[context.dataIndex]+': '+value:'';
          }
        }
      }
    }
  });
});
getCaseStatusbyYearonError(e=>{errorHandle(e,infomsg,alert1)});

function changeChart4Year(e){
  if(selYear4.value!==-1){
    getCaseStatusbyYear({
      year: (parseInt(selYear4.value) && parseInt(selYear4.value)!==-1)?parseInt(selYear4.value)+1911:new Date().getFullYear(),
      method:(selDmethod4.value && selDmethod4.value!==-1)?selDmethod4.value:'app_date',
    })
  }
}
//#endregion Chart4==========End

//#region Chart5==========Start
const ctx5 = ref();
const myChart5 = ref();
const chartData5 = ref([]);
// 查詢案件數 by Mounth Year
const { mutate: getMoneybyMounth, onDone: getMoneybyMounthOnDone, onError: getMoneybyMounthonError } = useMutation(ToolsGQL.STATCASEBYMOUNTH);
getMoneybyMounthOnDone(result=>{
  // console.log('2-getCasebyOprOnDone')
  chartData5.value = result.data.statCaseByMounth;
  // console.log(chartData5.value);
  const data = {
    datasets: [
      {
        type: 'line',
        label: '累計收費',
        backgroundColor: bgcolor_20[4],
        borderColor: bgcolor_100[4],
        borderWidth: 2,
        data: chartData5.value,
        parsing: {
            yAxisKey: 'Smoney'
        },
        stacked: false,
        tension: 0.4
      },
      {
        label: '航測相機',
        backgroundColor: bgcolor_20[0],
        borderColor: bgcolor_100[0],
        borderWidth: 1,
        data: chartData5.value,
        parsing: {
            yAxisKey: 'm1'
        },
        stacked: true,
        stack: 'Stack 0',
      },
      {
        label: '空載光達',
        backgroundColor: bgcolor_20[1],
        borderColor: bgcolor_100[1],
        borderWidth: 1,
        data: chartData5.value,
        parsing: {
            yAxisKey: 'm2'
        },
        stacked: true,
        stack: 'Stack 0',
      },
      {
        label: '小像幅',
        backgroundColor: bgcolor_20[2],
        borderColor: bgcolor_100[2],
        borderWidth: 1,
        data: chartData5.value,
        parsing: {
            yAxisKey: 'm3'
        },
        stacked: true,
        stack: 'Stack 0',
      },
      {
        label: '空載光達',
        backgroundColor: bgcolor_20[3],
        borderColor: bgcolor_100[3],
        borderWidth: 1,
        data: chartData5.value,
        parsing: {
            yAxisKey: 'm9'
        },
        stacked: true,
        stack: 'Stack 0',
      },
    ]
  };

  // console.log('3-OnDone res:',chartData1.value);
  if(myChart5.value) myChart5.value.destroy();

  // console.log('4-new Chart',myChart1.value);
  ctx5.value = document.getElementById('myChart5').getContext('2d');
  // console.log('5-ctx1',ctx1.value);
  myChart5.value = new Chart(ctx5.value, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      parsing: {
        xAxisKey: 'id',
      },
      scales:{
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
            text: '新臺幣(元)'
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: '年度每月收費統計',
        },
        legend: {
          display: false,
          position: 'right',
        },
        tooltip:{
          callbacks: {
            title: function(context) {
              // console.log(context);
              return context[0].label + '月'
            },
            label: function(context) {
              // console.log(context)
              let labelstr = '';
              if(context.dataset.label==='累計收費'){
                labelstr = (context.parsed.y && context.parsed.y!==0)?(context.dataset.label + ':' + context.formattedValue + '元'):(context.dataset.label + ':0元');
              }else{
                labelstr = (context.parsed.y && context.parsed.y!==0)?(context.dataset.label + ':' + context.formattedValue + '元'):'';
              }
              return labelstr;
            },
          }
        },
      }
    }
  });
});
getMoneybyMounthonError(e=>{errorHandle(e,infomsg,alert1)});

function changeChart5Year(e){
  getMoneybyMounth({
    year:(parseInt(selYear5.value) && parseInt(selYear5.value)!==-1)?parseInt(selYear5.value)+1911:new Date().getFullYear(),
    method:'pay_date',
  })
}
//#endregion Chart5==========End

//#region Chart6==========Start
// 查詢案件數 by Mounth Year
const { mutate: getTablebyMounth, onDone: getTablebyMounthOnDone, onError: getTablebyMounthonError } = useMutation(ToolsGQL.STATCASETABLEBYMOUNTH);
getTablebyMounthOnDone(result=>{
  let getData = result.data.statCaseTableByMounth;
  // console.log(getData);
  fl_total.value = getData.Fl[0]; 
  fl_per.value = getData.Fl[1]; 
  fl_now.value = getData.Fl[2]; 
  fl_total_i.value = getData.Fl[3]; 
  fl_per_i.value = getData.Fl[4]; 
  fl_now_i.value = getData.Fl[5]; 

  fm_total.value = getData.Fm[0]; 
  fm_per.value = getData.Fm[1]; 
  fm_now.value = getData.Fm[2]; 
  fm_total_i.value = getData.Fm[3]; 
  fm_per_i.value = getData.Fm[4]; 
  fm_now_i.value = getData.Fm[5]; 

  ic_total.value = getData.Ic[0]; 
  ic_per.value = getData.Ic[1]; 
  ic_now.value = getData.Ic[2]; 
  ic_total_i.value = getData.Ic[3]; 
  ic_per_i.value = getData.Ic[4]; 
  ic_now_i.value = getData.Ic[5]; 

  jc_total.value = getData.Jc[0]; 
  jc_per.value = getData.Jc[1];
  jc_now.value = getData.Jc[2];
  jc_total_i.value = getData.Jc[3];
  jc_per_i.value = getData.Jc[4];
  jc_now_i.value = getData.Jc[5];

  Mc_total.value = getData.Mc[0]; 
  Mc_per.value = getData.Mc[1];
  Mc_now.value = getData.Mc[2];
  Mc_total_i.value = getData.Mc[3];
  Mc_per_i.value = getData.Mc[4];
  Mc_now_i.value = getData.Mc[5];

  money_total.value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(getData.money[0]);
  money_per.value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(getData.money[1]);
  money_now.value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(getData.money[2]);

});
getTablebyMounthonError(e=>{errorHandle(e,infomsg,alert1)});

function changeChart6Year(e){
  if(parseInt(selYear6.value) && parseInt(selYear6.value)!==-1 && parseInt(selMounth6.value) && parseInt(selMounth6.value)!==-1){
    getTablebyMounth({
      year:(parseInt(selYear6.value) && parseInt(selYear6.value)!==-1)?parseInt(selYear5.value)+1911:new Date().getFullYear(),
      mounth:(parseInt(selMounth6.value) && parseInt(selMounth6.value)!==-1)?parseInt(selMounth6.value):new Date().getMonth()+1,
    })
  }
}
//#endregion Chart6==========End

// 統計資料查詢==========End

//#region 圖表設定==========Start
const bgcolor_20 = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'];
const bgcolor_60 = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)'];
const bgcolor_100 = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'];
const bgcolorList2 = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

onMounted(()=>{ 
  // console.log('0-onMounted');
  // 確認登入狀況
  getchecktoken().then(res=>{
    return getCaseYears().then(res=>{
      // console.log('1-getCaseYears');
      let latestYear = res.data.statCaseMinMaxYear[0];
      // 圖表1
      selYearDOM.value.setValue(latestYear);
      // 圖表2
      selDmethod.value = "receive_date";
      selYearDOM2.value.setValue(latestYear);
      selDmethodDOM.value.setValue("receive_date");
      // 圖表3
      selYearDOM3.value.setValue(latestYear);
      selDmethod3.value = "app_date";
      selDmethodDOM3.value.setValue("app_date");
      // 圖表4
      selYearDOM4.value.setValue(latestYear);
      selDmethod4.value = "app_date";
      selDmethodDOM4.value.setValue("app_date");
      // 圖表5
      selYearDOM5.value.setValue(latestYear);
      // 圖表6
      selYearDOM6.value.setValue(new Date().getFullYear()-1911);
      selMounthDOM6.value.setValue(new Date().getMonth()+1);
    })
  }).catch(e=>{
    errorHandle(e,infomsg,alert1);
  });
});

//#endregion 圖表設定==========End

// 圖表縮放
const chartMax = ref(false);
function zoomCart(Index){
  if(chartMax.value){
    // 還原
    // console.log('還原')
    chartShow.value.forEach((x,i,a)=>{a[i]=true});
    chartShowCol.value.forEach((x,i,a)=>{a[i]="4"});
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
        a[i]="4"
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
        <MDBCol col="12" class="py-2 h-100">
          <MDBRow class="h-100 border border-5 rounded-8 shadow-4">
            <!-- 左方導航列 -->
            <MDBCol md="2" class="border-1 border-top border-bottom">
              <MDBRow class="d-flex flex-column">
                <MDBCol class="px-2 p-3 border-bottom w-100">
                  <RouterLink :to="{ name: 'docs'}">
                    <MDBIcon icon="file-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />文件查詢
                  </RouterLink>
                </MDBCol>
                <MDBCol class=" px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'cases'}">
                    <MDBIcon icon="balance-scale" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />校正案件
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'employee'}">
                    <MDBIcon icon="user-edit" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />人員管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'gcps'}">
                    <MDBIcon icon="map-marked-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />點位管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'prjs'}">
                    <MDBIcon icon="drafting-compass" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    參考值量測作業
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'items'}">
                    <MDBIcon icon="wrench" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />標準件管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'cust' }">
                    <MDBIcon far icon="handshake" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />顧客管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border-1 border-bottom w-100">
                  <RouterLink :to="{ name: 'ucedit'}">
                    <MDBIcon icon="project-diagram" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    不確定度管理
                  </RouterLink>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 右方統計圖 -->
            <MDBCol md="10" class="h-100">
              <!-- 加入統計圖 -->
              <MDBRow class="h-100 overflow-auto">
                <!-- 圖表1 各人員年度案件數 -->
                <MDBCol v-show="chartShow[0]" :lg="chartShowCol[0]" class="border border-1" :class="chartClass[0]" style="max-height: 30rem;">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU"
                        v-model:selected="selYear" 
                        ref="selYearDOM" 
                        @change="changeChart1Year($event)"/>
                      <span>※以收件日且結案為準</span>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(0)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart1" class="" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                  
                  
                </MDBCol>
                <!-- 圖表2 年度每月案件數 -->
                <MDBCol v-show="chartShow[1]" :lg="chartShowCol[1]" class="border border-1" :class="chartClass[1]" style="max-height: 30rem;">
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
                      <canvas id="myChart2" class="" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <!-- 圖表5 年度每月收費統計 -->
                <MDBCol v-show="chartShow[4]" :lg="chartShowCol[4]" class="border border-1" :class="chartClass[4]" style="max-height: 30rem;">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU5"
                        v-model:selected="selYear5" 
                        ref="selYearDOM5" 
                        @change="changeChart5Year($event)"/>
                      <span>※以繳費日為準</span>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(4)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart5" class="" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <!-- 圖表3 各項目年度案件數 -->
                <MDBCol v-show="chartShow[2]" :lg="chartShowCol[2]" class="border border-1" :class="chartClass[2]" style="max-height: 30rem;">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU3"
                        v-model:selected="selYear3" 
                        ref="selYearDOM3" 
                        @change="changeChart3Year($event)"/>
                      <!-- <span>※以申請日為準</span> -->
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="日期模式" 
                        v-model:options="selDmethodMU3"
                        v-model:selected="selDmethod3" 
                        ref="selDmethodDOM3" 
                        @change="changeChart3Year($event)"/>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(2)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart3" class="" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <!-- 圖表4 年度案件進度統計 -->
                <MDBCol v-show="chartShow[3]" :lg="chartShowCol[3]" class="border border-1" :class="chartClass[3]" style="max-height: 30rem;">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="年度" 
                        v-model:options="selYearMU4"
                        v-model:selected="selYear4" 
                        ref="selYearDOM4" 
                        @change="changeChart4Year($event)"/>
                      <!-- <span>※以申請日為準</span> -->
                      <MDBSelect size="sm"
                        style="display:inline-block; width:10rem"
                        label="日期模式" 
                        v-model:options="selDmethodMU4"
                        v-model:selected="selDmethod4" 
                        ref="selDmethodDOM4" 
                        @change="changeChart4Year($event)"/>
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(3)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="d-flex align-items-center justify-content-center">
                      <canvas id="myChart4" class="" style="max-height: 100%; max-width: 100%"></canvas>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                
                <!-- 圖表6 月報統計表 -->
                <MDBCol v-show="chartShow[5]" :lg="chartShowCol[5]" class="border border-1" :class="chartClass[5]" style="max-height: 30rem;">
                  <MDBRow class="h-100">
                    <MDBCol col="12" style="position:relative ;" class="mt-2">
                      <MDBSelect size="sm"
                        style="display:inline-block; width:8rem"
                        label="年度" 
                        v-model:options="selYearMU6"
                        v-model:selected="selYear6" 
                        ref="selYearDOM6" 
                        @change="changeChart6Year($event)"/>
                      <MDBSelect size="sm"
                        style="display:inline-block; width:8rem"
                        label="月份" 
                        v-model:options="selMounthMU6"
                        v-model:selected="selMounth6" 
                        ref="selMounthDOM6" 
                        @change="changeChart6Year($event)"/>
                        <!-- @change="changeChart6Year($event)" -->
                      <MDBBtn size="sm" style="position:absolute;right:1rem" color="secondary" class="px-2 py-1" @click="zoomCart(5)"><i class="fas fa-expand-arrows-alt"></i></MDBBtn>
                    </MDBCol>
                    <MDBCol col="12" style="height: calc(100% - 3em);" class="overflow-auto">
                      <table cellspacing=0 cellpadding=0 style="width: 100%;max-width:30rem">
                        <tr class="f_01">
                          <td class="ps-2 bl_all">項目</td>
                          <td class="ps-2 bl_t bl_r bl_b">1-{{selMounth6}}月累計</td>
                          <td class="ps-2 bl_t bl_r bl_b">1-{{selMounth6-1}}月累計</td>
                          <td class="ps-2 bl_t bl_r bl_b">{{selMounth6}}月增加</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">航空測量攝影機(大)</td>
                          <td class="px-2 bl_r bl_b f_right">{{fl_total_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{fl_per_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{fl_now_str}}</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">航空測量攝影機(中)</td>
                          <td class="px-2 bl_r bl_b f_right">{{fm_total_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{fm_per_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{fm_now_str}}</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">空載光達</td>
                          <td class="px-2 bl_r bl_b f_right">{{ic_total_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{ic_per_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{ic_now_str}}</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">小像幅航拍攝影機</td>
                          <td class="px-2 bl_r bl_b f_right">{{jc_total_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{jc_per_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{jc_now_str}}</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">車載光達</td>
                          <td class="px-2 bl_r bl_b f_right">{{Mc_total_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{Mc_per_str}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{Mc_now_str}}</td>
                        </tr>
                        <tr class="f_01">
                          <td class="ps-2 bl_l bl_r bl_b">營運收入</td>
                          <td class="px-2 bl_r bl_b f_right">{{money_total}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{money_per}}</td>
                          <td class="px-2 bl_r bl_b f_right">{{money_now}}</td>
                        </tr>
                      </table>
                      <ol class="f_01">
                        <li>以上括弧內為內校數量</li>
                        <li>若有退件情形,數量會有調整(但應為少數)</li>
                        <li>以實際完成收件為計算基準(只有申請掛號者不算)</li>
                      </ol>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>

              </MDBRow>
              
              
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- Footer -->
      <footer style="position: relative;">
        <!-- Copyright -->
        <div class="text-center" style="background-color: rgba(0, 0, 0, 0.05); height: 2.5em;">
          © 2022 Copyright:
          <a class="text-reset fw-bold" href="mailto:jamesky98@gmail.com">jamesky98</a>
        </div>
        <!-- Copyright -->
        <div style="position: absolute; right: 12px; top:0">
          <a href="https://sicl-nlsc.moi.gov.tw/" target="_blank">
            <img src="/sicl-fn.png" style="height:2.5em;" alt="服務網前台連結">
          </a>
          <a href="https://siclm-nlsc.moi.gov.tw/USER/LogOn" target="_blank">
            <img src="/sicl-bk.png" style="height:2.5em;" alt="服務網後台連結">
          </a>
        </div>

      </footer>
      <!-- Footer -->
    </MDBRow>
  </MDBContainer>
</template>
<style>
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
.f_01{
  font-family: "Times New Roman", 標楷體;
  font-size: 12pt;
	line-height: 1.5;
}
/* 靠右 */
.f_right{
	text-align: right;
}
</style>