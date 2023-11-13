import router from "../router";

async function errorHandle(e,infomsg,alert1,msgColor){
  console.log('errorHandle',e);
  const res_3 = await new Promise((res, rej) => {

    if(e.message.indexOf('No such user found')!==-1){
      infomsg.value = "查無此帳號";
      alert1.value = true;
    }else if(e.message.indexOf('Invalid password')!==-1){
      infomsg.value = "密碼錯誤";
      alert1.value = true;
    }else if(e.message.indexOf('Not active')!==-1){
      infomsg.value = "帳號尚未啟用";
      alert1.value = true;
    }else if(e.message.indexOf('No token found')!==-1){
      infomsg.value = "未登入";
      // alert1.value = true;
      logOut();
    }else if(e.message.indexOf('Foreign key constraint failed')!==-1){
      infomsg.value = "本資料不可變更，因含有其他連結資料，請刪除連結資料後再試";
      msgColor.value = 'red'
      // alert1.value = true;
    }else if(e.message.indexOf('Token expired')!==-1){
      infomsg.value = "授權過期";
      logOut();
    }
    res(infomsg.value);
  })
  return res_3;
  
}

function logOut() {
  console.log("logOut")
  localStorage.removeItem("AUTH_TOKEN");
  localStorage.removeItem("USER_ID");
  localStorage.removeItem("USER_NAME");
  localStorage.removeItem("USER_NAME2");
  localStorage.removeItem("USER_ROLE");
  localStorage.removeItem("USER_AC");
  router.push("/login");
}

function logIn(result) {
  let getData = result.data.login;
  if (getData.user.active === 1) {
    localStorage.setItem("AUTH_TOKEN", result.data.login.token);
    localStorage.setItem("USER_ID", result.data.login.user.user_id);
    localStorage.setItem("USER_NAME", result.data.login.user.user_name);
    localStorage.setItem("USER_NAME2", result.data.login.user.user_name2);
    localStorage.setItem("USER_ROLE", result.data.login.user.role);
    localStorage.setItem("USER_AC", result.data.login.user.active);
    // console.log("localStorage In")
    router.push("/main");
  } else {
    logOut();
  }
}

function toTWDate(data) {
  let ttdate = "-";
  if (data) {
    ttdate = data.split("T")[0];
    let dateObj = new Date(ttdate);
    let year = dateObj.getFullYear() - 1911;
    let month =
      dateObj.getMonth() + 1 < 10
        ? "0" + (dateObj.getMonth() + 1)
        : dateObj.getMonth() + 1;
    let date =
      dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    // console.log(dateObj.getMonth());
    ttdate = year + "/" + month + "/" + date;
  }
  return ttdate;
}

function domTextSelect(e){
  e.target.select()
}

function updateSelMU(paras){
  // paras:{
    // newValue, 新項目的值
    // nowMU, 目前清單列表
    // nowDOM, 目前清單的物件
    // isUseID, 是否使用索引
  // }
  // 檢查項目名稱是否重複
  // console.log('paras',paras);
  let nowValue = (paras.newValue.value && paras.newValue.value!==-1)?paras.newValue.value.trim():'';
  let isRpt = paras.nowMU.value.some(x=> ((x.text)?x.text.trim():'')===nowValue);
  paras.isUseID = (paras.isUseID)?true:false;

  // console.log('isRpt',isRpt);
  if(!isRpt){
    // 清單中增加新項目
    // 將新名稱加入清單，值為-1?
    new Promise((res,rej)=>{
      let temp = JSON.parse(JSON.stringify(paras.nowMU.value));
      if(paras.isUseID){
        temp = temp.filter(x=>x.value!==-1); 
      }
      temp.push({
        text: nowValue,
        value: (paras.isUseID)?-1:nowValue,
      });
      res(paras.nowMU.value = temp);
    }).then(res_1=>{
      // console.log('res_1',res_1)
      if(paras.isUseID){
        paras.nowDOM.value.setValue(-1);
      }else{
        paras.nowDOM.value.setValue(nowValue);
      }
    })
  }
}

function renderCalType(data, type, row){
  let markicon = "";
  let classn = "";
  let shortName = "";
  switch (data) {
    case "航空測量攝影機": //航測像機
      shortName = "航測像機"
      markicon = '<i class="fas fa-plane-departure"></i>';
      classn = "typeF"
      break;
    case "空載光達": //空載光達
      shortName = "空載光達"
      markicon = '<i class="fas fa-wifi rotation180"></i>';
      classn = "typeI"
      break;
    case "小像幅攝影機": //小像幅
      shortName = "小像幅"
      markicon = '<i class="fas fa-camera"></i>';
      classn = "typeJ"
      break;
    case "車載光達": //車載光達
      shortName = "車載光達"
      markicon = '<i class="fas fa-taxi"></i>';
      classn = "typeM"
      break;
    case "電子測距儀": //電子測距儀
      shortName = "測距儀"
      markicon = '<i class="fas fa-tools"></i>';
      classn = "typeA"
      break;
    case "經緯儀": //經緯儀
      shortName = "經緯儀"
      markicon = '<i class="fas fa-tools"></i>';
      classn = "typeC"
      break;
    case "衛星定位系統": //衛星定位系統
      shortName = "衛星定位儀"
      markicon = '<i class="fas fa-tools"></i>';
      classn = "typeD"
      break;
    case "e-GNSS即時動態定位衛星定位儀": //e-GNSS即時動態定位衛星定位儀
      shortName = "e-GNSS"
      markicon = '<i class="fas fa-tools"></i>';
      classn = "typeK"
      break;
    case "地面三維雷射掃描儀": //地面三維雷射掃描儀
      shortName = "地面光達"
      markicon = '<i class="fas fa-tools"></i>';
      classn = "typeL"
      break;
    default:
      shortName = "品質"
      markicon = '<i class="fas fa-sitemap"></i>';
      classn = "typeX"
      break;
  }
  return "<span class='" + classn + "'>" + markicon + shortName + "</span>"
}

function renderRole(data, type, row){
  let classn = "";
  switch (data) {
    case "實驗室主管": //實驗室主管
      classn = "typeRole1"
      break;
    case "品質主管": //品質主管
      classn = "typeRole2"
      break;
    case "技術主管": //技術主管
      classn = "typeRole3"
      break;
    case "報告簽署人": //報告簽署人
      classn = "typeRole4"
      break;
    case "校正人員": //校正人員
      classn = "typeRole5"
      break;
    case "設備操作人員": //設備操作人員
      classn = "typeRole6"
      break;
  }
  return "<span class='" + classn + "'>" + data + "</span>"
}

function renderStatus(data, type, row){
  let markicon="";
  let classn="";
  switch (data) {
    case 9: //退件
      markicon = '<i class="fas fa-reply-all"></i>';
      classn = "status89";
      break;
    case 8: //補件
      markicon = '<i class="fas fa-history"></i>';
      classn = "status89";
      break;
    case 7: //結案
      markicon = '<i class="fas fa-check"></i>';
      classn = "status7";
      break;
    case 6: //待繳費
      markicon = '<i class="fas fa-donate"></i>';
      classn = "status6";
      break;
    case 5: //陳核
      markicon = '<i class="fas fa-paste"></i>';
      classn = "status45";
      break;
    case 4: //校正中
      markicon = '<i class="fas fa-play"></i>';
      classn = "status45";
      break;
    case 3: //待送件
      markicon = '<i class="fas fa-hourglass-start"></i>';
      classn = "status23";
      break;
    case 2: //審核中
      markicon = '<i class="fas fa-glasses"></i>';
      classn = "status23";
      break;
    case 1: //(空)
      markicon = '<i class="fas fa-exclamation-circle"></i>';
      classn = "status1";
  }
  return "<span class='" + classn +"'>" + markicon + row.case_status.status + "</span>"
}

function renderPtStatus(data,type,row){
  let markicon="";
  let classn="";
  switch (data) {
    case "遺失":
      markicon = '<i class="fas fa-lg fa-times"></i>';
      classn = "status89";
      break;
    case "損毀":
      markicon = '<i class="fas fa-skull-crossbones"></i>';
      classn = "status89";
      break;
    case "正常":
      markicon = '<i class="fas fa-check"></i>';
      classn = "status7";
      break;
    case "不適用":
      markicon = '<i class="fas fa-ban"></i>';
      classn = "status23";
      break;
    case "停用":
      markicon = '<i class="fas fa-ban"></i>';
      classn = "status23";
      break;
    default:
      markicon = '<i class="fas fa-exclamation-circle"></i>';
      classn = "status1";
  }
  return "<span class='" + classn +"'>" + markicon + data + "</span>"
}

function renderMoney(data, type, row){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TWD', currencyDisplay: "narrowSymbol", minimumFractionDigits: 0 }).format(data)
}

export { 
  errorHandle, 
  logIn, 
  logOut, 
  toTWDate, 
  domTextSelect, 
  updateSelMU,
  renderCalType,
  renderRole,
  renderStatus,
  renderPtStatus,
  renderMoney,
};
