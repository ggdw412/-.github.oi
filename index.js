// ===== index.js - 首页JS（删除分类筛选栏相关） =====

var currentGoods = [];
var currentPage = 1;
var pageSize = 8;
var slideIndex = 0;
var slideTimer = null;

function getQueryParam(name) {
  var url = window.location.search;
  var regex = new RegExp("[?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results ? decodeURIComponent(results[1]) : null;
}

// 轮播图
function initBanner() {
  startSlide();
  $(".next").click(function () {
    nextSlide();
    resetSlide();
  });
  $(".prev").click(function () {
    var total = $(".slide").length;
    slideIndex = (slideIndex - 1 + total) % total;
    switchSlide();
    resetSlide();
  });
  $(".dot").click(function () {
    slideIndex = $(this).index();
    switchSlide();
    resetSlide();
  });
  $(".banner-box").hover(
    function () {
      clearInterval(slideTimer);
    },
    function () {
      startSlide();
    },
  );
}
function startSlide() {
  slideTimer = setInterval(nextSlide, 4000);
}
function resetSlide() {
  clearInterval(slideTimer);
  startSlide();
}
function nextSlide() {
  var total = $(".slide").length;
  slideIndex = (slideIndex + 1) % total;
  switchSlide();
}
function switchSlide() {
  $(".slide").removeClass("active").eq(slideIndex).addClass("active");
  $(".dot").removeClass("active").eq(slideIndex).addClass("active");
}

// 渲染商品（包含售罄状态）
function renderGoods() {
  var start = (currentPage - 1) * pageSize,
    end = start + pageSize,
    list = currentGoods.slice(start, end);
  if (list.length === 0) {
    $("#goodsList").html(
      '<div class="no-data">暂无相关花束，换个关键词试试~</div>',
    );
    refreshPageStatus();
    return;
  }
  var html = "";
  list.forEach(function (item) {
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
      '<div class="goods-img"><img src="pimg/' +
      item.img +
      '" alt="' +
      item.name +
      '">' +
      '<div class="flower-lang">' +
      item.flowerLanguage +
      "</div>" +
      soldTag +
      "</div>" +
      '<div class="goods-info"><div class="goods-name">' +
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
      "</button></div></div>";
  });
  $("#goodsList").html(html);
  refreshPageStatus();

  $(".goods-card").click(function (e) {
    if ($(e.target).hasClass("buy-btn")) return;
    location.href = "detail.html?id=" + $(this).data("id");
  });
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

function refreshPageStatus() {
  var total = Math.ceil(currentGoods.length / pageSize);
  $(".page-num").removeClass("active");
  $(".page-num[data-page=" + currentPage + "]").addClass("active");
  $("#prevPage").toggleClass("disabled", currentPage <= 1);
  $("#nextPage").toggleClass("disabled", currentPage >= total);
}

// 分页事件
function bindPageEvent() {
  $(".page-num").click(function () {
    currentPage = parseInt($(this).data("page"));
    renderGoods();
  });
  $("#prevPage").click(function () {
    if (currentPage > 1) {
      currentPage--;
      renderGoods();
    }
  });
  $("#nextPage").click(function () {
    var total = Math.ceil(currentGoods.length / pageSize);
    if (currentPage < total) {
      currentPage++;
      renderGoods();
    }
  });
}

// 首页搜索（原地过滤）
function doSearchWithKey(key) {
  if (!key) {
    currentGoods = getProducts();
    $("#goodsTitle").text("全部鲜花");
  } else {
    currentGoods = getProducts().filter(function (i) {
      return (
        i.name.indexOf(key) !== -1 ||
        i.desc.indexOf(key) !== -1 ||
        i.flowerLanguage.indexOf(key) !== -1
      );
    });
    $("#goodsTitle").text("搜索结果：" + key);
    toastr.info("找到 " + currentGoods.length + " 款相关花束");
    $("#searchInput").val(key);
  }
  currentPage = 1;
  renderGoods();
}

// 导航重置（点击Logo回到全部商品）
$(function () {
  // 如果URL带搜索参数，执行搜索
  var searchKey = getQueryParam("search");
  if (searchKey) {
    $("#searchInput").val(searchKey);
    doSearchWithKey(searchKey);
  } else {
    currentGoods = getProducts();
    renderGoods();
  }

  bindPageEvent();
  initBanner();

  // Logo点击重置
  $(".nav-logo").click(function () {
    currentGoods = getProducts();
    currentPage = 1;
    $("#goodsTitle").text("全部鲜花");
    renderGoods();
    if (window.history && window.history.replaceState)
      window.history.replaceState({}, document.title, window.location.pathname);
    $("#searchInput").val("");
  });

  // 如果URL有#goodsSection，滚动到商品区
  if (location.hash === "#goodsSection") {
    setTimeout(function () {
      $("html,body").animate(
        { scrollTop: $("#goodsSection").offset().top - 80 },
        100,
      );
    }, 300);
  }
});
