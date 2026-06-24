// ===== search.js - 搜索页JS =====

var searchResults = [];
var searchKeyword = "";

function getQueryParam(name) {
  var url = window.location.search;
  var regex = new RegExp("[?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results ? decodeURIComponent(results[1]) : null;
}

function doSearch(keyword) {
  keyword = (keyword || "").trim();
  searchKeyword = keyword;
  if (!keyword) {
    searchResults = [];
    renderResults();
    return;
  }
  var products = getProducts();
  var lower = keyword.toLowerCase();
  searchResults = products.filter(function (item) {
    return (
      item.name.indexOf(keyword) !== -1 ||
      item.desc.indexOf(keyword) !== -1 ||
      (item.flowerLanguage && item.flowerLanguage.indexOf(keyword) !== -1) ||
      item.category.indexOf(keyword) !== -1 ||
      item.name.toLowerCase().indexOf(lower) !== -1 ||
      item.desc.toLowerCase().indexOf(lower) !== -1 ||
      (item.flowerLanguage &&
        item.flowerLanguage.toLowerCase().indexOf(lower) !== -1)
    );
  });
  renderResults();
  if (searchResults.length === 0)
    toastr.info("没有找到相关花束，试试其他关键词");
  else toastr.success("找到 " + searchResults.length + " 款相关花束");
}

function renderResults() {
  var $list = $("#goodsList");
  var $noResult = $("#noResult");
  var $count = $("#resultCount");
  var $keyword = $("#resultKeyword");

  if (!searchKeyword) {
    $count.text("请输入关键词搜索");
    $keyword.html("");
    $list.empty();
    $noResult.hide();
    return;
  }
  $count.html("共 <strong>" + searchResults.length + "</strong> 件商品");
  $keyword.html("搜索关键词：<em>“" + searchKeyword + "”</em>");

  if (searchResults.length === 0) {
    $list.empty();
    $noResult.show();
    return;
  }
  $noResult.hide();

  var html = "";
  searchResults.forEach(function (item) {
    var name = item.name;
    if (searchKeyword) {
      var regex = new RegExp(searchKeyword, "gi");
      name = name.replace(regex, function (match) {
        return "<mark>" + match + "</mark>";
      });
    }
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
      name +
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
  $list.html(html);

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

function bindEvents() {
  $("#searchBtn").click(function () {
    var key = $("#searchInput").val().trim();
    doSearch(key);
    if (key && window.history && window.history.replaceState)
      window.history.replaceState(
        {},
        document.title,
        "?q=" + encodeURIComponent(key),
      );
  });
  $("#searchInput").keydown(function (e) {
    if (e.keyCode === 13) $("#searchBtn").click();
  });
  $(".hot-tag").click(function () {
    var tag = $(this).text().trim();
    $("#searchInput").val(tag);
    $("#searchBtn").click();
  });
}

$(function () {
  var q = getQueryParam("q");
  if (q) {
    $("#searchInput").val(q);
    doSearch(q);
  }
  bindEvents();
  if (!q) $("#searchInput").focus();
});
