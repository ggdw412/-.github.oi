$(function () {
  $("#regBtn").click(function () {
    let username = $("#regUser").val().trim();
    let phone = $("#regPhone").val().trim();
    let pwd = $("#regPwd").val().trim();
    let pwd2 = $("#regPwd2").val().trim();
    let $tip = $("#regTip");

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

    let regUsers = JSON.parse(localStorage.getItem("reg_users") || "[]");
    let exist = regUsers.some((u) => u.username === username);
    if (exist) {
      $tip.text("该用户名已被注册");
      toastr.warning("该用户名已被注册");
      return;
    }

    regUsers.push({
      username: username,
      password: pwd,
      phone: phone,
    });
    localStorage.setItem("reg_users", JSON.stringify(regUsers));

    toastr.success("注册成功，请登录");
    setTimeout(() => (location.href = "login.html"), 1200);
  });
});
