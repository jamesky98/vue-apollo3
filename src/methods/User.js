import router from "../router";

function logIn(result) {
  localStorage.setItem("AUTH_TOKEN", result.data.login.token);
  localStorage.setItem("USER_ID", result.data.login.user.user_id);
  localStorage.setItem("USER_NAME", result.data.login.user.user_name);
  router.push("/main");
}

function logOut() { 
  localStorage.removeItem("AUTH_TOKEN");
  localStorage.removeItem("USER_ID");
  localStorage.removeItem("USER_NAME");
  router.push("/login");
}

export { logIn, logOut };
