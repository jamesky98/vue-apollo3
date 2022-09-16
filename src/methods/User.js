import router from "../router";

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

function rolePass(level){
  
}

export { logIn, logOut, toTWDate };
