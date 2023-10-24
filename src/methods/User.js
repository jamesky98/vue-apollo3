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
  let ttdate = "";
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


export { errorHandle, logIn, logOut, toTWDate, domTextSelect, updateSelMU};
