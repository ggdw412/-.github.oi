// ===== login.js - 登录/注册 =====

function bindLoginEvent() {
  $("#loginBtn").click(function () {
    var username = $("#loginUser").val().trim();
    var password = $("#loginPwd").val().trim();
    var $tip = $("#loginTip");
    if (!username) {
      $tip.text("用户名不能为空");
      return;
    }
    if (!password) {
      $tip.text("密码不能为空");
      return;
    }
    var regUsers = JSON.parse(localStorage.getItem("reg_users") || "[]");
    var match = regUsers.find(function (u) {
      return u.username === username && u.password === password;
    });
    if (match) {
      $tip.text("");
      setUser(match);
      toastr.success("登录成功");
      setTimeout(function () {
        location.href = "index.html";
      }, 1000);
    } else {
      $tip.text("用户名或者密码不正确");
      toastr.warning("用户名或密码错误");
    }
  });
  $("#loginPwd, #loginUser").keydown(function (e) {
    if (e.keyCode === 13) $("#loginBtn").click();
  });
}

function bindRegisterEvent() {
  $("#regBtn").click(function () {
    var username = $("#regUser").val().trim();
    var phone = $("#regPhone").val().trim();
    var pwd = $("#regPwd").val().trim();
    var pwd2 = $("#regPwd2").val().trim();
    var $tip = $("#regTip");
    if (!username) {
      $tip.text("请输入用户名");
      return;
    }
    if (!phone) {
      $tip.text("请输入手机号");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      $tip.text("手机号格式不正确");
      return;
    }
    if (!pwd) {
      $tip.text("请设置密码");
      return;
    }
    if (pwd.length < 6) {
      $tip.text("密码至少6位");
      return;
    }
    if (pwd !== pwd2) {
      $tip.text("两次密码不一致");
      return;
    }
    var regUsers = JSON.parse(localStorage.getItem("reg_users") || "[]");
    var exist = regUsers.some(function (u) {
      return u.username === username;
    });
    if (exist) {
      $tip.text("该用户名已被注册");
      toastr.warning("该用户名已被注册");
      return;
    }
    regUsers.push({ username: username, password: pwd, phone: phone });
    localStorage.setItem("reg_users", JSON.stringify(regUsers));
    toastr.success("注册成功，请登录");
    setTimeout(function () {
      location.href = "login.html";
    }, 1200);
  });
  $("#regPwd2, #regPwd, #regPhone, #regUser").keydown(function (e) {
    if (e.keyCode === 13) $("#regBtn").click();
  });
}

$(function () {
  if (getUser()) {
    var page = window.location.pathname;
    if (
      page.indexOf("login.html") !== -1 ||
      page.indexOf("register.html") !== -1
    )
      location.href = "index.html";
  }
  bindLoginEvent();
  bindRegisterEvent();
});
