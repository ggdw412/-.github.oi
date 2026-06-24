// ===== list.js - 商品列表页JS（无分类筛选、无排序） =====

var currentGoods = [];
var currentPage = 1;
var pageSize = 8;
var currentCate = "all";

// 获取URL参数
function getQueryParam(name) {
  var url = window.location.search;
  var regex = new RegExp("[?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results ? decodeURIComponent(results[1]) : null;
}

// 根据分类筛选商品
function filterByCate() {
  var list = getProducts();
  if (currentCate !== "all") {
    list = list.filter(function (item) {
      return item.category === currentCate;
    });
  }
  // 按ID排序（默认顺序）
  list.sort(function (a, b) {
    return a.id - b.id;
  });
  return list;
}

// 渲染商品卡片
function renderGoods() {
  currentGoods = filterByCate();
  var total = currentGoods.length;
  var totalPages = Math.ceil(total / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * pageSize;
  var end = start + pageSize;
  var pageList = currentGoods.slice(start, end);

  // 更新标题
  var cateNames = {
    all: "全部花束",
    玫瑰系列: "🌹 玫瑰系列",
    百合系列: "🌷 百合系列",
    康乃馨系列: "🌺 康乃馨系列",
    混合花束: "🌸 混合花束",
    小雏菊系列: "🌼 小雏菊系列",
    绿植盆栽: "🌿 绿植盆栽",
    节日礼盒: "🎁 节日礼盒",
  };
  $("#pageTitle").text(cateNames[currentCate] || "全部花束");

  if (pageList.length === 0) {
    $("#goodsList").html(
      '<div class="no-data"><span class="big-icon">🌿</span>暂无相关花束</div>',
    );
    refreshPageStatus(totalPages);
    return;
  }

  var html = "";
  pageList.forEach(function (item) {
    var soldOut = item.stock <= 0;
    var btnClass = soldOut ? "buy-btn disabled" : "buy-btn";
    var btnText = soldOut ? "已售罄" : "加入购物车";
    var stockHtml = soldOut
      ? ""
      : '<div class="goods-stock-info">库存：' + item.stock + " 件</div>";
    var soldTag = soldOut ? '<span class="sold-out-tag">售罄</span>' : "";

    html +=
      '<div class="goods-card" data-id="' +
      item.id +
      '">' +
      '<div class="goods-img">' +
      '<img src="pimg/' +
      item.img +
      '" alt="' +
      item.name +
      '">' +
      '<div class="flower-lang">' +
      (item.flowerLanguage || "花语待补充") +
      "</div>" +
      soldTag +
      "</div>" +
      '<div class="goods-info">' +
      '<div class="goods-name">' +
      item.name +
      "</div>" +
      '<div class="goods-price">¥' +
      item.price +
      "</div>" +
      stockHtml +
      '<button class="' +
      btnClass +
      '" data-id="' +
      item.id +
      '">' +
      btnText +
      "</button>" +
      "</div></div>";
  });

  $("#goodsList").html(html);
  refreshPageStatus(totalPages);

  // 点击卡片 → 详情
  $(".goods-card").click(function (e) {
    if ($(e.target).hasClass("buy-btn")) return;
    location.href = "detail.html?id=" + $(this).data("id");
  });

  // 加入购物车
  $(".buy-btn:not(.disabled)").click(function (e) {
    e.stopPropagation();
    var id = $(this).data("id");
    var goods = getProducts().find(function (i) {
      return i.id == id;
    });
    if (!goods) return;

    var cart = getCart();
    var exist = cart.find(function (i) {
      return i.id == id;
    });
    if (exist) {
      if (exist.num + 1 > goods.stock) {
        toastr.error("已达库存上限");
        return;
      }
      exist.num++;
    } else {
      cart.push({
        id: goods.id,
        name: goods.name,
        price: goods.price,
        img: goods.img,
        num: 1,
        checked: true,
      });
    }
    saveCart(cart);
    toastr.success(goods.name + " 已加入购物车");
  });
}

// 分页状态
function refreshPageStatus(totalPages) {
  var total = totalPages || Math.ceil(currentGoods.length / pageSize) || 1;
  $("#prevPage").toggleClass("disabled", currentPage <= 1);
  $("#nextPage").toggleClass("disabled", currentPage >= total);

  var html = "";
  for (var i = 1; i <= total; i++) {
    var active = i === currentPage ? "active" : "";
    html +=
      '<span class="page-num ' +
      active +
      '" data-page="' +
      i +
      '">' +
      i +
      "</span>";
  }

  var prevHtml = $("#prevPage")[0].outerHTML;
  var nextHtml = $("#nextPage")[0].outerHTML;
  $("#pageBox").html(prevHtml + html + nextHtml);

  // 页码点击
  $(".page-num").click(function () {
    currentPage = parseInt($(this).data("page"));
    renderGoods();
    $("html,body").animate(
      { scrollTop: $("#goodsList").offset().top - 80 },
      300,
    );
  });

  $("#prevPage").click(function () {
    if (currentPage > 1) {
      currentPage--;
      renderGoods();
      $("html,body").animate(
        { scrollTop: $("#goodsList").offset().top - 80 },
        300,
      );
    }
  });

  $("#nextPage").click(function () {
    var totalPages2 = Math.ceil(currentGoods.length / pageSize) || 1;
    if (currentPage < totalPages2) {
      currentPage++;
      renderGoods();
      $("html,body").animate(
        { scrollTop: $("#goodsList").offset().top - 80 },
        300,
      );
    }
  });
}

// 初始化
$(function () {
  // 从URL读取分类参数
  var cateParam = getQueryParam("cate");
  if (cateParam) {
    currentCate = cateParam;
    // 高亮导航中对应的分类（通过URL匹配，由页面刷新后自动高亮）
  }

  renderGoods();
});
