// ===== admin.js - 后台管理 =====

var adminProducts = [];
var currentPage = 1;
var pageSize = 6;

$(function () {
  // 1. 验证用户是否登录
  if (!getUser()) {
    toastr.warning("请先登录再访问后台管理");
    setTimeout(function () {
      location.href = "login.html";
    }, 1500);
    return;
  }

  // 2. 验证后台管理密码（新增）
  if (!verifyAdminPassword()) {
    return;
  }

  // 3. 加载数据
  loadAdminData();
  bindEvents();
});

function loadAdminData() {
  adminProducts = getProducts();
  renderStats();
  renderTable();
}

function renderStats() {
  var products = adminProducts;
  var total = products.length;
  var stock = products.reduce(function (sum, p) {
    return sum + (p.stock || 0);
  }, 0);
  var cates = new Set(
    products.map(function (p) {
      return p.category;
    }),
  );
  var avgPrice =
    total > 0
      ? products.reduce(function (sum, p) {
          return sum + p.price;
        }, 0) / total
      : 0;
  var totalValue = products.reduce(function (sum, p) {
    return sum + p.price * (p.stock || 0);
  }, 0);

  $("#statTotal").text(total);
  $("#statStock").text(stock);
  $("#statCate").text(cates.size);
  $("#statAvgPrice").text("¥" + avgPrice.toFixed(0));
  $("#statTotalValue").text("¥" + totalValue.toFixed(0));
}

function renderTable() {
  var total = adminProducts.length;
  var totalPages = Math.ceil(total / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  var start = (currentPage - 1) * pageSize;
  var end = start + pageSize;
  var pageData = adminProducts.slice(start, end);

  var $tbody = $("#adminTbody");
  var $empty = $("#tableEmpty");
  if (pageData.length === 0) {
    $tbody.empty();
    $empty.show();
  } else {
    $empty.hide();
    var html = "";
    pageData.forEach(function (item) {
      var stockClass = "";
      if (item.stock <= 0) stockClass = "out";
      else if (item.stock < 10) stockClass = "low";
      html +=
        '<tr data-id="' +
        item.id +
        '">' +
        "<td>" +
        item.id +
        "</td>" +
        '<td><img src="pimg/' +
        item.img +
        '" class="td-img" alt="' +
        item.name +
        '"></td>' +
        '<td class="td-name" title="' +
        item.name +
        '">' +
        item.name +
        "</td>" +
        "<td>" +
        (item.category || "-") +
        "</td>" +
        '<td class="td-price">¥' +
        item.price +
        "</td>" +
        '<td class="td-stock ' +
        stockClass +
        '">' +
        item.stock +
        "</td>" +
        "<td>" +
        (item.origin || "-") +
        "</td>" +
        '<td><button class="action-btn view" data-id="' +
        item.id +
        '">查看</button> ' +
        '<button class="action-btn edit" data-id="' +
        item.id +
        '">编辑</button> ' +
        '<button class="action-btn del" data-id="' +
        item.id +
        '">删除</button></td></tr>';
    });
    $tbody.html(html);
  }
  refreshPageStatus(totalPages);
  bindTableEvents();
}

function refreshPageStatus(totalPages) {
  var total = totalPages || Math.ceil(adminProducts.length / pageSize) || 1;
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
  $(".page-num").click(function () {
    currentPage = parseInt($(this).data("page"));
    renderTable();
  });
  $("#prevPage").click(function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });
  $("#nextPage").click(function () {
    var totalPages2 = Math.ceil(adminProducts.length / pageSize) || 1;
    if (currentPage < totalPages2) {
      currentPage++;
      renderTable();
    }
  });
}

function bindTableEvents() {
  $(".action-btn.view").click(function () {
    var id = $(this).data("id");
    location.href = "detail.html?id=" + id;
  });
  $(".action-btn.edit").click(function () {
    var id = $(this).data("id");
    location.href = "admin-add.html?id=" + id;
  });

  // ===== 删除按钮 =====
  $(".action-btn.del").click(function () {
    var id = $(this).data("id");
    var item = adminProducts.find(function (p) {
      return p.id == id;
    });
    if (!item) return;
    if (
      !confirm("确定要删除商品「" + item.name + "」吗？\n删除后ID将重新排序。")
    )
      return;

    var newProducts = adminProducts.filter(function (p) {
      return p.id != id;
    });

    newProducts.forEach(function (p, index) {
      p.id = index + 1;
    });

    saveProducts(newProducts);
    adminProducts = newProducts;

    var cart = getCart();
    var newCart = cart.filter(function (item) {
      return item.id != id;
    });
    if (newCart.length !== cart.length) {
      saveCart(newCart);
      toastr.info("已从购物车中移除该商品");
    }

    renderStats();
    renderTable();
    toastr.success("已删除「" + item.name + "」，ID已重新排序");
  });
}

function doSearch(keyword) {
  keyword = (keyword || "").trim().toLowerCase();
  if (!keyword) adminProducts = getProducts();
  else {
    var all = getProducts();
    adminProducts = all.filter(function (p) {
      return (
        p.name.toLowerCase().indexOf(keyword) !== -1 ||
        p.desc.toLowerCase().indexOf(keyword) !== -1 ||
        (p.flowerLanguage &&
          p.flowerLanguage.toLowerCase().indexOf(keyword) !== -1) ||
        (p.category && p.category.toLowerCase().indexOf(keyword) !== -1)
      );
    });
  }
  currentPage = 1;
  renderStats();
  renderTable();
  if (keyword) toastr.info("找到 " + adminProducts.length + " 个匹配商品");
}

function bindEvents() {
  $("#searchBtn").click(function () {
    doSearch($("#searchInput").val());
  });
  $("#searchInput").keydown(function (e) {
    if (e.keyCode === 13) $("#searchBtn").click();
  });
  $("#refreshBtn").click(function () {
    adminProducts = getProducts();
    currentPage = 1;
    renderStats();
    renderTable();
    toastr.success("已刷新");
  });
}
