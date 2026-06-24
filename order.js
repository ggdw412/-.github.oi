// ===== order.js - 订单页 =====

var selectedPayMethod = "wechat";

function renderOrder() {
  var cart = getCart();
  var checked = cart.filter(function (i) {
    return i.checked !== false;
  });
  if (checked.length === 0) {
    toastr.warning("请先选择商品");
    location.href = "cart.html";
    return;
  }

  // 检查库存
  var products = getProducts();
  var hasError = false;
  checked.forEach(function (item) {
    var product = products.find(function (p) {
      return p.id == item.id;
    });
    if (!product || product.stock < item.num) {
      toastr.error(
        "「" +
          item.name +
          "」库存不足，当前库存：" +
          (product ? product.stock : 0) +
          " 件",
      );
      hasError = true;
    }
  });
  if (hasError) {
    setTimeout(function () {
      location.href = "cart.html";
    }, 2000);
    return;
  }

  var html = "",
    totalNum = 0,
    totalPrice = 0;
  checked.forEach(function (item) {
    var subtotal = item.price * item.num;
    totalNum += item.num;
    totalPrice += subtotal;
    html +=
      '<div class="goods-row"><img src="pimg/' +
      item.img +
      '" alt="' +
      item.name +
      '"><div class="name">' +
      item.name +
      '</div><div class="num">x ' +
      item.num +
      '</div><div class="price">¥' +
      subtotal.toFixed(2) +
      "</div></div>";
  });
  $("#orderGoods").html(html);
  $("#orderNum").text(totalNum);
  $("#orderTotal").text("¥" + totalPrice.toFixed(2));
  renderAddressList();
  $("#addrFormWrap").removeClass("show");
  $(".pay-item").removeClass("active");
  $('.pay-item[data-pay="' + selectedPayMethod + '"]').addClass("active");
}

function renderAddressList() {
  var addrs = getAddresses();
  var selectedId = getSelectedAddrId();
  if (
    !selectedId ||
    !addrs.find(function (a) {
      return a.id === selectedId;
    })
  ) {
    if (addrs.length > 0) {
      selectedId = addrs[0].id;
      setSelectedAddrId(selectedId);
    } else {
      selectedId = null;
    }
  }
  var html = "";
  addrs.forEach(function (addr) {
    var activeClass = addr.id === selectedId ? "active" : "";
    html +=
      '<div class="addr-item ' +
      activeClass +
      '" data-id="' +
      addr.id +
      '"><p class="addr-name">' +
      addr.name +
      " <span>" +
      addr.phone +
      '</span></p><p class="addr-detail">' +
      addr.detail +
      '</p><span class="addr-del" data-id="' +
      addr.id +
      '">✕</span></div>';
  });
  $("#addrList").html(html);
  $(".addr-item").click(function (e) {
    if ($(e.target).hasClass("addr-del")) return;
    var id = $(this).data("id");
    setSelectedAddrId(id);
    renderAddressList();
  });
  $(".addr-del").click(function (e) {
    e.stopPropagation();
    var id = $(this).data("id");
    var addrs = getAddresses();
    if (addrs.length <= 1) {
      toastr.warning("至少保留一个地址");
      return;
    }
    addrs = addrs.filter(function (a) {
      return a.id !== id;
    });
    saveAddresses(addrs);
    var selectedId = getSelectedAddrId();
    if (selectedId === id) setSelectedAddrId(addrs[0].id);
    renderAddressList();
    toastr.success("地址已删除");
  });
}

function bindOrderEvent() {
  $("#btnToggleAddrForm").click(function () {
    $("#addrFormWrap").toggleClass("show");
    if ($("#addrFormWrap").hasClass("show")) {
      $("#newAddrName").val("");
      $("#newAddrPhone").val("");
      $("#newAddrDetail").val("");
    }
  });
  $("#btnCancelAddr").click(function () {
    $("#addrFormWrap").removeClass("show");
  });
  $("#btnSaveAddr").click(function () {
    var name = $("#newAddrName").val().trim();
    var phone = $("#newAddrPhone").val().trim();
    var detail = $("#newAddrDetail").val().trim();
    if (!name) {
      toastr.warning("请输入收货人姓名");
      return;
    }
    if (!phone) {
      toastr.warning("请输入手机号码");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toastr.warning("手机号格式不正确");
      return;
    }
    if (!detail) {
      toastr.warning("请输入详细地址");
      return;
    }
    var addrs = getAddresses();
    addressIdCounter++;
    addrs.push({
      id: addressIdCounter,
      name: name,
      phone: phone,
      detail: detail,
    });
    saveAddresses(addrs);
    setSelectedAddrId(addressIdCounter);
    renderAddressList();
    $("#addrFormWrap").removeClass("show");
    toastr.success("地址添加成功");
  });
  $(".pay-item").click(function () {
    $(".pay-item").removeClass("active");
    $(this).addClass("active");
    selectedPayMethod = $(this).data("pay");
  });

  $("#payBtn").click(function () {
    if (!getUser()) {
      toastr.warning("请先登录");
      location.href = "login.html";
      return;
    }

    var addrs = getAddresses();
    var selectedId = getSelectedAddrId();
    var selectedAddr = addrs.find(function (a) {
      return a.id === selectedId;
    });
    if (!selectedAddr) {
      toastr.warning("请选择收货地址");
      return;
    }

    var payLabels = {
      wechat: "微信支付",
      alipay: "支付宝",
      card: "银行卡",
      cod: "货到付款",
    };
    var payLabel = payLabels[selectedPayMethod] || "微信支付";

    var cart = getCart();
    var checked = cart.filter(function (i) {
      return i.checked !== false;
    });
    if (checked.length === 0) {
      toastr.warning("购物车为空");
      return;
    }

    // 再次检查库存并扣减
    var products = getProducts();
    var canBuy = true;
    var errorMsg = "";
    checked.forEach(function (item) {
      var product = products.find(function (p) {
        return p.id == item.id;
      });
      if (!product) {
        errorMsg = "商品「" + item.name + "」不存在";
        canBuy = false;
        return;
      }
      if (product.stock < item.num) {
        errorMsg =
          "「" + item.name + "」库存不足，当前库存：" + product.stock + " 件";
        canBuy = false;
        return;
      }
    });
    if (!canBuy) {
      toastr.error(errorMsg);
      return;
    }

    var total = 0;
    checked.forEach(function (i) {
      total += i.price * i.num;
    });

    // ===== 扣减库存 =====
    checked.forEach(function (item) {
      var product = products.find(function (p) {
        return p.id == item.id;
      });
      if (product) {
        product.stock -= item.num;
      }
    });
    saveProducts(products);

    // 保存订单
    var orderData = {
      items: checked.map(function (i) {
        return {
          id: i.id,
          name: i.name,
          price: i.price,
          num: i.num,
          img: i.img,
        };
      }),
      total: total,
      payMethod: payLabel,
      address: selectedAddr,
      user: getUser() ? getUser().username : "未登录",
    };
    addOrder(orderData);

    var newCart = cart.filter(function (i) {
      return i.checked === false;
    });
    saveCart(newCart);

    toastr.success(
      "✅ 订单提交成功！\n支付方式：" +
        payLabel +
        "\n收货人：" +
        selectedAddr.name +
        "\n地址：" +
        selectedAddr.detail +
        "\n总金额：¥" +
        total.toFixed(2) +
        "\n库存已更新",
    );
    setTimeout(function () {
      location.href = "index.html";
    }, 2500);
  });
}

$(function () {
  renderOrder();
  bindOrderEvent();
});
