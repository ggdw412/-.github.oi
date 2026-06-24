// ================================================================
// cart.js - 购物车页面脚本
// 功能：渲染购物车列表、数量修改、删除商品、全选/取消全选、结算跳转
// ================================================================

/**
 * 渲染购物车列表
 * 从 localStorage 读取购物车数据，生成商品列表，更新总数量和总金额
 */
function renderCart() {
  var cart = getCart();

  // 购物车为空：显示空状态，隐藏列表和底部
  if (cart.length === 0) {
    $("#cartList").hide();
    $("#emptyCart").show();
    $("#cartFoot").hide();
    return;
  }

  var html = "",
    totalNum = 0,
    totalPrice = 0;

  // 遍历购物车数据，生成每个商品的 HTML
  cart.forEach(function (item) {
    var checked = item.checked !== false; // 是否选中（默认true）
    var subtotal = item.price * item.num; // 小计 = 单价 × 数量

    if (checked) {
      totalNum += item.num; // 累计选中商品数量
      totalPrice += subtotal; // 累计选中商品总金额
    }

    html +=
      '<div class="cart-item" data-id="' +
      item.id +
      '">' +
      '<div class="col-check"><input type="checkbox" class="item-check" ' +
      (checked ? "checked" : "") +
      "></div>" +
      '<div><img src="pimg/' +
      item.img +
      '" alt="' +
      item.name +
      '"></div>' +
      '<div class="name">' +
      item.name +
      "</div>" +
      '<div class="price">¥' +
      item.price +
      "</div>" +
      '<div><div class="num-control">' +
      '<button class="c-minus">-</button>' +
      '<input type="text" value="' +
      item.num +
      '" readonly>' +
      '<button class="c-plus">+</button>' +
      "</div></div>" +
      '<div class="subtotal">¥' +
      subtotal.toFixed(2) +
      "</div>" +
      '<div><span class="del-btn">删除</span></div>' +
      "</div>";
  });

  // 将生成的 HTML 插入页面
  $("#cartList").html(html).show();
  $("#emptyCart").hide();
  $("#cartFoot").show();

  // 更新总数量和总金额
  $("#totalNum").text(totalNum);
  $("#totalPrice").text("¥" + totalPrice.toFixed(2));

  // 全选复选框状态：所有商品都选中时才勾选
  $("#checkAll").prop(
    "checked",
    cart.every(function (i) {
      return i.checked !== false;
    }),
  );

  // 绑定交互事件
  bindCartEvent();
}

/**
 * 绑定购物车的所有交互事件
 * 包括：全选、单项选择、数量加减、删除、结算
 */
function bindCartEvent() {
  // ===== 全选/取消全选 =====
  $("#checkAll").change(function () {
    var checked = $(this).prop("checked");
    var cart = getCart();
    cart.forEach(function (i) {
      i.checked = checked;
    });
    saveCart(cart);
    renderCart(); // 重新渲染
  });

  // ===== 单项选择 =====
  $(".item-check").change(function () {
    var id = $(this).parents(".cart-item").data("id");
    var checked = $(this).prop("checked");
    var cart = getCart();
    var item = cart.find(function (i) {
      return i.id == id;
    });
    if (item) item.checked = checked;
    saveCart(cart);
    renderCart();
  });

  // ===== 减少数量按钮 =====
  $(".c-minus").click(function () {
    var id = $(this).parents(".cart-item").data("id");
    var cart = getCart();
    var item = cart.find(function (i) {
      return i.id == id;
    });
    if (item && item.num > 1) {
      item.num--;
      saveCart(cart);
      renderCart();
    }
  });

  // ===== 增加数量按钮（不能超过库存） =====
  $(".c-plus").click(function () {
    var id = $(this).parents(".cart-item").data("id");
    var cart = getCart();
    var item = cart.find(function (i) {
      return i.id == id;
    });
    var goods = getProducts().find(function (i) {
      return i.id == id;
    });
    if (item && goods && item.num < goods.stock) {
      item.num++;
      saveCart(cart);
      renderCart();
    } else {
      toastr.warning("已达库存上限");
    }
  });

  // ===== 删除商品（带淡出动画） =====
  $(".del-btn").click(function () {
    var $item = $(this).parents(".cart-item");
    var id = $item.data("id");
    var cart = getCart().filter(function (i) {
      return i.id != id;
    });
    saveCart(cart);
    // 淡出动画后重新渲染
    $item.fadeOut(400, function () {
      renderCart();
    });
    toastr.success("已删除商品");
  });

  // ===== 去结算按钮 =====
  $("#checkoutBtn").click(function () {
    // 检查是否已登录
    if (!getUser()) {
      toastr.warning("请先登录再结算");
      setTimeout(function () {
        location.href = "login.html";
      }, 1200);
      return;
    }

    var cart = getCart();
    var checked = cart.filter(function (i) {
      return i.checked !== false;
    });

    // 检查是否有选中商品
    if (checked.length === 0) {
      toastr.warning("请选择要结算的商品");
      return;
    }

    // ===== 结算前检查库存是否充足 =====
    var products = getProducts();
    var hasError = false;
    checked.forEach(function (item) {
      var product = products.find(function (p) {
        return p.id == item.id;
      });
      if (!product) {
        toastr.error("商品「" + item.name + "」不存在");
        hasError = true;
        return;
      }
      if (product.stock < item.num) {
        toastr.error(
          "「" +
            item.name +
            "」库存不足，当前库存：" +
            product.stock +
            " 件，请调整数量",
        );
        hasError = true;
      }
    });

    if (hasError) return;
    // 库存检查通过，跳转到订单确认页
    location.href = "order.html";
  });
}

// ===== 页面加载完成后自动渲染购物车 =====
$(function () {
  renderCart();
});
