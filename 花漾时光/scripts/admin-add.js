// ===== admin-add.js - 添加/编辑商品 =====

var editingId = null;
var IMAGE_FILES = [
  "p1.jpg",
  "p2.jpg",
  "p3.jpg",
  "p4.jpg",
  "p5.jpg",
  "p6.jpg",
  "p7.jpg",
  "p8.jpg",
  "p9.jpg",
  "p10.jpg",
  "p11.jpg",
  "p12.jpg",
  "p13.jpg",
  "p14.jpg",
  "p15.jpg",
  "p16.jpg",
  "p17.jpg",
  "p18.jpg",
  "p19.jpg",
  "p20.jpg",
  "p21.jpg",
  "p22.jpg",
  "p23.jpg",
  "p24.jpg",
];

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

  // 3. 初始化页面
  renderImageGrid("p1.jpg");
  var idParam = getQueryParam("id");
  if (idParam) {
    var id = parseInt(idParam);
    if (!isNaN(id)) loadEditData(id);
  }
  bindEvents();
  bindUploadEvent();
});

function getQueryParam(name) {
  var url = window.location.search;
  var regex = new RegExp("[?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results ? decodeURIComponent(results[1]) : null;
}

function renderImageGrid(selectedImg) {
  var $grid = $("#imgGrid");
  var html = "";
  IMAGE_FILES.forEach(function (file) {
    var active = file === selectedImg ? "active" : "";
    html +=
      '<div class="img-opt ' +
      active +
      '" data-img="' +
      file +
      '"><img src="pimg/' +
      file +
      '" alt="' +
      file +
      '" /></div>';
  });
  $grid.html(html);
  $(".img-opt").click(function () {
    var img = $(this).data("img");
    selectImage(img);
  });
}

function selectImage(img) {
  $(".img-opt").removeClass("active");
  $('.img-opt[data-img="' + img + '"]').addClass("active");
  $("#fImg").val(img);
  $("#previewImg").attr("src", "pimg/" + img);
  $("#fImgCustom").val(img);
  clearUploadStatus();
}

function loadEditData(id) {
  var products = getProducts();
  var item = products.find(function (p) {
    return p.id == id;
  });
  if (!item) {
    toastr.warning("商品不存在，将创建新商品");
    return;
  }
  editingId = id;
  $("#formTitle").text("✏️ 编辑商品");
  $("#fName").val(item.name);
  $("#fCategory").val(item.category || "");
  $("#fPrice").val(item.price);
  $("#fStock").val(item.stock);
  $("#fOrigin").val(item.origin || "");
  $("#fSpec").val(item.spec || "");
  $("#fDesc").val(item.desc || "");
  $("#fLang").val(item.flowerLanguage || "");
  var img = item.img || "p1.jpg";
  selectImage(img);
}

function validateForm() {
  var name = $("#fName").val().trim();
  var category = $("#fCategory").val();
  var price = parseFloat($("#fPrice").val());
  var stock = parseInt($("#fStock").val());
  var desc = $("#fDesc").val().trim();
  var img = $("#fImg").val();
  if (!name) {
    showTip("请输入商品名称");
    return false;
  }
  if (!category) {
    showTip("请选择分类");
    return false;
  }
  if (isNaN(price) || price <= 0) {
    showTip("请输入有效的价格");
    return false;
  }
  if (isNaN(stock) || stock < 0) {
    showTip("请输入有效的库存数量");
    return false;
  }
  if (!desc) {
    showTip("请输入商品简介");
    return false;
  }
  if (!img) {
    showTip("请选择商品图片");
    return false;
  }
  return true;
}

function showTip(msg) {
  $("#formTip").text(msg);
  clearTimeout(window._tipTimer);
  window._tipTimer = setTimeout(function () {
    $("#formTip").text("");
  }, 3000);
}

function submitForm() {
  if (!validateForm()) return;
  var name = $("#fName").val().trim();
  var category = $("#fCategory").val();
  var price = parseFloat($("#fPrice").val());
  var stock = parseInt($("#fStock").val());
  var origin = $("#fOrigin").val().trim();
  var spec = $("#fSpec").val().trim();
  var desc = $("#fDesc").val().trim();
  var lang = $("#fLang").val().trim();
  var img = $("#fImg").val();

  var products = getProducts();
  var exist = products.find(function (p) {
    return p.name === name && (editingId === null || p.id !== editingId);
  });
  if (exist) {
    showTip("商品名称已存在，请修改");
    toastr.warning("商品名称已存在");
    return;
  }

  var newProduct = {
    name: name,
    category: category,
    price: price,
    stock: stock,
    origin: origin || "未知",
    spec: spec || "-",
    desc: desc,
    flowerLanguage: lang || "花语待补充",
    img: img,
  };

  if (editingId) {
    newProduct.id = editingId;
    var index = products.findIndex(function (p) {
      return p.id === editingId;
    });
    if (index !== -1) {
      products[index] = newProduct;
      saveProducts(products);
      toastr.success("商品「" + name + "」已更新");
    } else {
      toastr.error("商品不存在");
      return;
    }
  } else {
    var maxId =
      products.length > 0
        ? Math.max.apply(
            null,
            products.map(function (p) {
              return p.id;
            }),
          )
        : 0;
    newProduct.id = maxId + 1;
    products.push(newProduct);
    saveProducts(products);
    toastr.success("商品「" + name + "」已添加，ID为 " + newProduct.id);
  }
  setTimeout(function () {
    location.href = "admin.html";
  }, 1200);
}

function bindEvents() {
  $("#goodsForm").submit(function (e) {
    e.preventDefault();
    submitForm();
  });
  $("#resetBtn").click(function () {
    if (editingId && !confirm("重置将丢失当前修改，确定吗？")) return;
    if (editingId) loadEditData(editingId);
    else {
      $("#goodsForm")[0].reset();
      $("#fImg").val("p1.jpg");
      $("#previewImg").attr("src", "pimg/p1.jpg");
      $(".img-opt").removeClass("active");
      $('.img-opt[data-img="p1.jpg"]').addClass("active");
      $("#fImgCustom").val("p1.jpg");
      $("#formTip").text("");
      clearUploadStatus();
    }
  });
  $("#applyImgBtn").click(function () {
    var val = $("#fImgCustom").val().trim();
    if (!val) {
      toastr.warning("请输入图片文件名");
      return;
    }
    if (IMAGE_FILES.indexOf(val) !== -1) {
      selectImage(val);
      toastr.success("已切换图片");
    } else {
      $("#fImg").val(val);
      $("#previewImg").attr("src", "pimg/" + val);
      $(".img-opt").removeClass("active");
      $("#fImgCustom").val(val);
      var img = new Image();
      img.onload = function () {
        toastr.success("已应用自定义图片");
      };
      img.onerror = function () {
        toastr.warning("图片可能不存在，请确认文件名正确");
      };
      img.src = "pimg/" + val;
    }
  });
  $("#fImgCustom").keydown(function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      $("#applyImgBtn").click();
    }
  });
}

// ===== 上传图片功能 =====
function bindUploadEvent() {
  var $uploadArea = $("#uploadArea");
  var $fileInput = $("#fileUpload");
  var $previewImg = $("#previewImg");
  var $fImg = $("#fImg");
  var $fImgCustom = $("#fImgCustom");

  $uploadArea.click(function (e) {
    if (e.target.tagName !== "INPUT") {
      $fileInput.click();
    }
  });

  $fileInput.on("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file);
    this.value = "";
  });

  $uploadArea.on("dragover", function (e) {
    e.preventDefault();
    $(this).addClass("dragover");
  });
  $uploadArea.on("dragleave", function (e) {
    e.preventDefault();
    $(this).removeClass("dragover");
  });
  $uploadArea.on("drop", function (e) {
    e.preventDefault();
    $(this).removeClass("dragover");
    var files = e.originalEvent.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  $("#imgPreview").click(function (e) {
    if (!$(e.target).closest(".preview-overlay").length) {
      $fileInput.click();
    }
  });

  function handleFileUpload(file) {
    if (!file.type.match(/^image\/(jpeg|png|gif|webp|bmp|svg\+xml)$/)) {
      toastr.warning("请上传图片文件（JPG / PNG / GIF / WEBP）");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toastr.warning("图片文件不能超过5MB");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var dataUrl = e.target.result;
      $previewImg.attr("src", dataUrl);
      var fileName = file.name;
      $fImgCustom.val(fileName);
      $fImg.val(fileName);
      $(".img-opt").removeClass("active");
      showUploadStatus(fileName);
      toastr.success("✅ 图片上传成功：" + fileName);
    };
    reader.onerror = function () {
      toastr.error("图片读取失败，请重试");
    };
    reader.readAsDataURL(file);
  }

  function showUploadStatus(fileName) {
    var $area = $("#uploadArea");
    $area.find(".file-name").remove();
    $area.append('<span class="file-name">📎 ' + fileName + "</span>");
    $area.css("border-color", "#27ae60");
    $area.css("background", "#f0faf5");
  }

  function clearUploadStatus() {
    var $area = $("#uploadArea");
    $area.find(".file-name").remove();
    $area.css("border-color", "#c9e0f2");
    $area.css("background", "#fafcfe");
    $area.removeClass("dragover");
  }
}
