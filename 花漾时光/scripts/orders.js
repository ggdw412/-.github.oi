// ===== orders.js - 订单管理JS =====

function renderOrders() {
  var orders = getOrders();
  var $list = $("#ordersList");
  var $no = $("#noOrders");

  if (orders.length === 0) {
    $list.empty();
    $no.show();
    return;
  }
  $no.hide();

  var html = '<div class="orders-list">';
  orders
    .slice()
    .reverse()
    .forEach(function (order) {
      var itemsHtml = "";
      order.items.forEach(function (item) {
        itemsHtml +=
          '<div class="order-item">' +
          '<img src="pimg/' +
          item.img +
          '" alt="' +
          item.name +
          '">' +
          '<span class="item-name">' +
          item.name +
          "</span>" +
          '<span class="item-num">x ' +
          item.num +
          "</span>" +
          '<span class="item-price">¥' +
          (item.price * item.num).toFixed(2) +
          "</span>" +
          "</div>";
      });
      html +=
        '<div class="order-card" data-id="' +
        order.id +
        '">' +
        '<div class="order-header">' +
        '<span class="order-id">📋 订单 #' +
        order.id +
        "</span>" +
        '<span class="order-time">🕒 ' +
        order.createdAt +
        "</span>" +
        '<span class="order-user">👤 <strong>' +
        (order.user || "未登录") +
        "</strong></span>" +
        "</div>" +
        '<div class="order-summary">' +
        "<span>💳 " +
        order.payMethod +
        "</span>" +
        "<span>📍 " +
        order.address.name +
        " " +
        order.address.phone +
        "</span>" +
        "<span>🏠 " +
        order.address.detail +
        "</span>" +
        "</div>" +
        '<div class="order-items">' +
        itemsHtml +
        "</div>" +
        '<div class="order-total">应付总额：<strong>¥' +
        order.total.toFixed(2) +
        "</strong></div>" +
        '<div class="order-actions">' +
        '<button class="btn-plain del" data-id="' +
        order.id +
        '">🗑 删除</button>' +
        "</div>" +
        "</div>";
    });
  html += "</div>";
  $list.html(html);

  $(".order-actions .del").click(function () {
    var id = parseInt($(this).data("id"));
    if (!confirm("确定要删除此订单吗？")) return;
    var orders = getOrders();
    orders = orders.filter(function (o) {
      return o.id !== id;
    });
    saveOrders(orders);
    renderOrders();
    toastr.success("订单已删除");
  });
}

$(function () {
  // 1. 验证用户是否登录
  if (!getUser()) {
    toastr.warning("请先登录再访问订单管理");
    setTimeout(function () {
      location.href = "login.html";
    }, 1500);
    return;
  }

  // 2. 验证后台管理密码（新增）
  if (!verifyAdminPassword()) {
    return;
  }

  // 3. 初始化页面
  renderOrders();

  $("#refreshOrdersBtn").click(function () {
    renderOrders();
    toastr.success("已刷新");
  });

  $("#clearOrdersBtn").click(function () {
    if (!confirm("确定要清空所有订单吗？此操作不可恢复！")) return;
    saveOrders([]);
    renderOrders();
    toastr.success("所有订单已清空");
  });
});
