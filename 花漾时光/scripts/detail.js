// ===== detail.js - 详情页 =====

var currentDetail = null;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) return pair[1];
  }
  return false;
}

function loadDetail() {
  var id = parseInt(getQueryVariable("id"));
  if (!id) {
    toastr.error("商品不存在");
    setTimeout(function () {
      location.href = "list.html";
    }, 1500);
    return;
  }
  currentDetail = getProducts().find(function (i) {
    return i.id === id;
  });
  if (!currentDetail) {
    toastr.error("商品不存在");
    setTimeout(function () {
      location.href = "list.html";
    }, 1500);
    return;
  }
  $("#goodsImg").attr("src", "pimg/" + currentDetail.img);
  $("#goodsName").text(currentDetail.name);
  $("#goodsDesc").text(currentDetail.desc);
  $("#goodsLang").text(currentDetail.flowerLanguage);
  $("#goodsPrice").text("¥" + currentDetail.price);
  $("#goodsStock").text(currentDetail.stock);
  $("#goodsOrigin").text(currentDetail.origin);
  $("#goodsSpec").text(currentDetail.spec);
  $("#goodsId").text("#" + currentDetail.id);
  $("#crumbName").text(currentDetail.name);
  $("#buyNum").val(1);

  if (currentDetail.stock <= 0) {
    $("#stockWarning").text("⚠️ 库存不足").css("color", "#e74c3c");
    $("#addCartBtn, #buyNowBtn").prop("disabled", true).addClass("disabled");
  } else {
    $("#stockWarning").text("✅ 库存充足").css("color", "#27ae60");
  }
}

function bindDetailEvent() {
  $("#minusBtn").click(function () {
    var n = parseInt($("#buyNum").val());
    if (n > 1) {
      $("#buyNum").val(n - 1);
      updateStockWarning();
    }
  });
  $("#plusBtn").click(function () {
    var n = parseInt($("#buyNum").val());
    if (n >= currentDetail.stock) {
      toastr.warning("已达最大库存");
      return;
    }
    $("#buyNum").val(n + 1);
    updateStockWarning();
  });

  function updateStockWarning() {
    var n = parseInt($("#buyNum").val());
    if (n > currentDetail.stock) {
      $("#stockWarning").text("⚠️ 超过库存").css("color", "#e74c3c");
    } else {
      $("#stockWarning").text("✅ 库存充足").css("color", "#27ae60");
    }
  }

  $("#addCartBtn").click(function () {
    if (currentDetail.stock <= 0) {
      toastr.error("库存不足，无法加入购物车");
      return;
    }
    var num = parseInt($("#buyNum").val());
    if (num > currentDetail.stock) {
      toastr.error("购买数量超过库存");
      return;
    }

    var cart = getCart();
    var exist = cart.find(function (i) {
      return i.id == currentDetail.id;
    });
    if (exist) {
      if (exist.num + num > currentDetail.stock) {
        toastr.error("购物车中该商品已达库存上限");
        return;
      }
      exist.num += num;
    } else {
      cart.push({
        id: currentDetail.id,
        name: currentDetail.name,
        price: currentDetail.price,
        img: currentDetail.img,
        num: num,
        checked: true,
      });
    }
    saveCart(cart);
    toastr.success("已加入购物车");
  });

  $("#buyNowBtn").click(function () {
    if (currentDetail.stock <= 0) {
      toastr.error("库存不足，无法购买");
      return;
    }
    var num = parseInt($("#buyNum").val());
    if (num > currentDetail.stock) {
      toastr.error("购买数量超过库存");
      return;
    }

    var cart = getCart();
    var exist = cart.find(function (i) {
      return i.id == currentDetail.id;
    });
    if (exist) {
      exist.num = num;
      exist.checked = true;
    } else {
      cart.push({
        id: currentDetail.id,
        name: currentDetail.name,
        price: currentDetail.price,
        img: currentDetail.img,
        num: num,
        checked: true,
      });
    }
    cart.forEach(function (i) {
      i.checked = i.id == currentDetail.id;
    });
    saveCart(cart);
    location.href = "cart.html";
  });
}

$(function () {
  loadDetail();
  bindDetailEvent();
});
