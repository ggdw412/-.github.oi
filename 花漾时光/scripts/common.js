// ===== common.js - 公共核心（含数据自动修复 + 后台密码验证） =====

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: 2000,
};

// ========== 后台管理密码（可在此修改） ==========
var ADMIN_PASSWORD = "admin123";

/**
 * 验证后台管理密码
 * 检查 sessionStorage 中是否已有验证标记，若无则弹出输入框
 * 验证成功则设置标记，失败则跳转回首页
 */
function verifyAdminPassword() {
  // 如果已经验证过，直接放行
  if (sessionStorage.getItem("admin_verified") === "true") {
    return true;
  }

  // 循环验证，直到密码正确或用户取消
  while (true) {
    var input = prompt("请输入后台管理密码：");
    // 用户点击取消或关闭对话框
    if (input === null) {
      location.href = "index.html";
      return false;
    }
    // 验证密码
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_verified", "true");
      toastr.success("密码验证通过");
      return true;
    } else {
      toastr.error("密码错误，请重新输入");
      // 继续循环，重新提示
    }
  }
}

// ---------- 硬编码的默认商品数据（完整24种） ----------
var DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "红玫瑰花束 11枝",
    desc: "经典卡罗拉红玫瑰，热烈告白首选",
    price: 129,
    stock: 86,
    category: "玫瑰系列",
    img: "p1.jpg",
    origin: "云南昆明",
    spec: "11枝/束",
    flowerLanguage: "热恋与真心，一心一意的深爱",
  },
  {
    id: 2,
    name: "白玫瑰纯情花束",
    desc: "纯洁白玫瑰，搭配满天星，清新雅致",
    price: 149,
    stock: 45,
    category: "玫瑰系列",
    img: "p2.jpg",
    origin: "云南昆明",
    spec: "9枝/束",
    flowerLanguage: "纯洁天真，我足以与你相配",
  },
  {
    id: 3,
    name: "香槟玫瑰轻奢花束",
    desc: "高级香槟色，韩式包装，轻奢浪漫",
    price: 169,
    stock: 32,
    category: "玫瑰系列",
    img: "p3.jpg",
    origin: "云南昆明",
    spec: "12枝/束",
    flowerLanguage: "爱上你是我今生最大的幸福",
  },
  {
    id: 4,
    name: "蓝色玫瑰梦幻花束",
    desc: "进口染色蓝玫瑰，神秘迷人，永不褪色",
    price: 199,
    stock: 28,
    category: "玫瑰系列",
    img: "p4.jpg",
    origin: "荷兰进口",
    spec: "10枝/束",
    flowerLanguage: "奇迹与不可能实现的事，永恒的爱",
  },
  {
    id: 5,
    name: "香水百合鲜切花",
    desc: "双头白百合，浓香四溢，花期持久",
    price: 49,
    stock: 73,
    category: "百合系列",
    img: "p5.jpg",
    origin: "云南昆明",
    spec: "5枝/10朵",
    flowerLanguage: "纯洁高贵，百年好合，事事顺心",
  },
  {
    id: 6,
    name: "粉百合温柔花束",
    desc: "粉嫩百合，少女感十足，温馨浪漫",
    price: 59,
    stock: 40,
    category: "百合系列",
    img: "p6.jpg",
    origin: "云南昆明",
    spec: "3枝/束",
    flowerLanguage: "清纯高雅，梦幻中的甜蜜",
  },
  {
    id: 7,
    name: "黄百合活力花束",
    desc: "明黄百合，象征财富与感激，太阳般温暖",
    price: 55,
    stock: 35,
    category: "百合系列",
    img: "p7.jpg",
    origin: "云南昆明",
    spec: "4枝/束",
    flowerLanguage: "感激与快乐，愿你前程似锦",
  },
  {
    id: 8,
    name: "粉色康乃馨花束",
    desc: "母亲节首选，19枝感恩花礼",
    price: 119,
    stock: 67,
    category: "康乃馨系列",
    img: "p8.jpg",
    origin: "云南昆明",
    spec: "19枝/束",
    flowerLanguage: "感恩母爱与温柔付出，祝永远年轻",
  },
  {
    id: 9,
    name: "红色康乃馨花束",
    desc: "热情红康乃馨，祝福健康长寿",
    price: 99,
    stock: 50,
    category: "康乃馨系列",
    img: "p9.jpg",
    origin: "云南昆明",
    spec: "11枝/束",
    flowerLanguage: "热烈的爱，真挚的祝福与敬佩",
  },
  {
    id: 10,
    name: "混色康乃馨彩虹束",
    desc: "五颜六色康乃馨，缤纷灿烂，幸福满满",
    price: 139,
    stock: 30,
    category: "康乃馨系列",
    img: "p10.jpg",
    origin: "云南昆明",
    spec: "15枝/束",
    flowerLanguage: "多彩人生，快乐永驻，感恩与爱",
  },
  {
    id: 11,
    name: "向日葵治愈花束",
    desc: "阳光向日葵，送朋友生日祝福，能量满满",
    price: 99,
    stock: 52,
    category: "混合花束",
    img: "p11.jpg",
    origin: "云南昆明",
    spec: "6枝/束",
    flowerLanguage: "沉默的爱慕与忠诚，永远向阳而生",
  },
  {
    id: 12,
    name: "洋甘菊鲜切花",
    desc: "小清新洋甘菊，疗愈系花材，瓶插雅致",
    price: 39,
    stock: 120,
    category: "混合花束",
    img: "p12.jpg",
    origin: "浙江嘉兴",
    spec: "一扎/约10枝",
    flowerLanguage: "逆境中的温柔力量，疗愈人心",
  },
  {
    id: 13,
    name: "粉色郁金香花束",
    desc: "荷兰进口粉郁金香，高级感花礼，气质出众",
    price: 159,
    stock: 38,
    category: "混合花束",
    img: "p13.jpg",
    origin: "荷兰进口",
    spec: "10枝/束",
    flowerLanguage: "浪漫告白，永恒的祝福与喜悦",
  },
  {
    id: 14,
    name: "蓝色绣球花礼盒",
    desc: "重瓣蓝绣球，高端礼盒装，惊艳送礼",
    price: 188,
    stock: 25,
    category: "混合花束",
    img: "p14.jpg",
    origin: "云南昆明",
    spec: "1朵/礼盒",
    flowerLanguage: "梦幻忠贞的爱，团圆美满，包容浪漫",
  },
  {
    id: 15,
    name: "白色满天星花束",
    desc: "超大束满天星，可做干花，百搭装饰",
    price: 79,
    stock: 95,
    category: "混合花束",
    img: "p15.jpg",
    origin: "云南昆明",
    spec: "大束/约500g",
    flowerLanguage: "纯粹无声的喜欢，藏在细节里的永恒",
  },
  {
    id: 16,
    name: "高端混合花艺礼盒",
    desc: "玫瑰+绣球+洋桔梗，轻奢礼盒，节日高端送礼",
    price: 299,
    stock: 18,
    category: "混合花束",
    img: "p16.jpg",
    origin: "上海花艺师制作",
    spec: "礼盒装",
    flowerLanguage: "多重美好汇聚，爱意与祝福兼具",
  },
  {
    id: 17,
    name: "白色小雏菊花束",
    desc: "清新白雏菊，文艺范十足，家装点缀",
    price: 45,
    stock: 80,
    category: "小雏菊系列",
    img: "p17.jpg",
    origin: "云南昆明",
    spec: "一扎/约15枝",
    flowerLanguage: "纯洁美好，深藏心底的爱，永远的快乐",
  },
  {
    id: 18,
    name: "粉色小雏菊花束",
    desc: "软萌粉雏菊，少女心爆棚，可爱温馨",
    price: 49,
    stock: 65,
    category: "小雏菊系列",
    img: "p18.jpg",
    origin: "云南昆明",
    spec: "一扎/约12枝",
    flowerLanguage: "天真烂漫，希望与和平，勇敢的爱",
  },
  {
    id: 19,
    name: "混色小雏菊彩虹束",
    desc: "五彩小雏菊，活力满满，送给可爱的她",
    price: 55,
    stock: 45,
    category: "小雏菊系列",
    img: "p19.jpg",
    origin: "云南昆明",
    spec: "一扎/约18枝",
    flowerLanguage: "多彩的快乐，无忧无虑的青春",
  },
  {
    id: 20,
    name: "多肉植物组合盆栽",
    desc: "萌系多肉拼盘，懒人植物，办公桌必备",
    price: 68,
    stock: 100,
    category: "绿植盆栽",
    img: "p20.jpg",
    origin: "山东潍坊",
    spec: "3-4颗/盆",
    flowerLanguage: "顽强坚韧，招财纳福，可爱的陪伴",
  },
  {
    id: 21,
    name: "绿萝水培盆栽",
    desc: "水培绿萝，净化空气，易养活，生机盎然",
    price: 35,
    stock: 150,
    category: "绿植盆栽",
    img: "p21.jpg",
    origin: "广东广州",
    spec: "玻璃瓶+水培",
    flowerLanguage: "守望幸福，坚韧善良，给生活添绿",
  },
  {
    id: 22,
    name: "发财树小盆栽",
    desc: "迷你发财树，招财进宝，乔迁新居礼物",
    price: 88,
    stock: 40,
    category: "绿植盆栽",
    img: "p22.jpg",
    origin: "福建漳州",
    spec: "陶瓷盆/高度30cm",
    flowerLanguage: "财源广进，事业顺利，兴旺发达",
  },
  {
    id: 23,
    name: "永生玫瑰花玻璃罩",
    desc: "厄瓜多尔进口永生花，永不凋零，纪念日首选",
    price: 369,
    stock: 12,
    category: "节日礼盒",
    img: "p23.jpg",
    origin: "厄瓜多尔进口",
    spec: "直径12cm",
    flowerLanguage: "永不凋零的爱，跨越时光的守护",
  },
  {
    id: 24,
    name: "轻奢鲜花礼盒",
    desc: "玫瑰+郁金香+洋桔梗，轻奢礼盒装，仪式感拉满",
    price: 399,
    stock: 15,
    category: "节日礼盒",
    img: "p24.jpg",
    origin: "上海花艺师制作",
    spec: "精美礼盒装",
    flowerLanguage: "至臻心意，浪漫永恒，给你最好的爱",
  },
];

// ---------- 商品数据读写（含自动修复） ----------
function getProducts() {
  var stored = localStorage.getItem("flower_products");
  if (stored) {
    try {
      var data = JSON.parse(stored);
      if (
        data &&
        data.length >= 24 &&
        !data.some(function (item) {
          return item.name.indexOf("商品") !== -1;
        })
      ) {
        return data;
      }
    } catch (e) {}
  }
  localStorage.setItem("flower_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS.slice();
}

function saveProducts(products) {
  localStorage.setItem("flower_products", JSON.stringify(products));
}

// ---------- 从 JSON 文件加载初始商品数据（仅在 localStorage 为空或数据无效时） ----------
function loadProductsFromJSON(callback) {
  var stored = localStorage.getItem("flower_products");
  if (stored) {
    try {
      var data = JSON.parse(stored);
      if (
        data &&
        data.length >= 24 &&
        !data.some(function (item) {
          return item.name.indexOf("商品") !== -1;
        })
      ) {
        if (callback) callback();
        return;
      }
    } catch (e) {}
  }
  $.getJSON("products.json", function (data) {
    localStorage.setItem("flower_products", JSON.stringify(data));
    if (callback) callback();
  }).fail(function () {
    localStorage.setItem("flower_products", JSON.stringify(DEFAULT_PRODUCTS));
    if (callback) callback();
  });
}

// ---------- 从 user.json 加载初始用户 ----------
function loadUsersFromJSON(callback) {
  if (localStorage.getItem("reg_users")) {
    if (callback) callback();
    return;
  }
  $.getJSON("user.json", function (data) {
    localStorage.setItem("reg_users", JSON.stringify(data));
    if (callback) callback();
  }).fail(function () {
    var fallback = [
      { username: "test", password: "123456", phone: "13800138000" },
      { username: "花漾主人", password: "2022@usx", phone: "13800138001" },
    ];
    localStorage.setItem("reg_users", JSON.stringify(fallback));
    if (callback) callback();
  });
}

// ---------- 用户相关 ----------
function getUser() {
  var u = localStorage.getItem("flower_user");
  return u ? JSON.parse(u) : null;
}
function setUser(user) {
  localStorage.setItem("flower_user", JSON.stringify(user));
}
function logout() {
  localStorage.removeItem("flower_user");
  toastr.success("已退出登录");
  renderUserArea();
}
function renderUserArea() {
  var user = getUser();
  if (user) {
    $("#userArea").html(
      "你好，" + user.username + ' <a onclick="logout()">退出</a>',
    );
  } else {
    $("#userArea").html(
      '<a href="login.html">登录</a> <a href="register.html">注册</a>',
    );
  }
}

// ---------- 购物车 ----------
function getCart() {
  var c = localStorage.getItem("flower_cart");
  return c ? JSON.parse(c) : [];
}
function saveCart(cart) {
  localStorage.setItem("flower_cart", JSON.stringify(cart));
  refreshCartNum();
}
function refreshCartNum() {
  var total = 0;
  getCart().forEach(function (i) {
    total += i.num;
  });
  $(".cart-num").text(total);
}

// ---------- 地址 ----------
var DEFAULT_ADDRESSES = [
  {
    id: 1,
    name: "张小花",
    phone: "13800138000",
    detail: "浙江省绍兴市越城区环城西路508号",
  },
  {
    id: 2,
    name: "李花艺",
    phone: "13800138001",
    detail: "浙江省杭州市西湖区文三路鲜花公寓3栋",
  },
];
var addressIdCounter = 100;
function getAddresses() {
  var a = localStorage.getItem("flower_addresses");
  return a ? JSON.parse(a) : [...DEFAULT_ADDRESSES];
}
function saveAddresses(addrs) {
  localStorage.setItem("flower_addresses", JSON.stringify(addrs));
}
function getSelectedAddrId() {
  var id = localStorage.getItem("flower_selected_addr");
  return id ? parseInt(id) : null;
}
function setSelectedAddrId(id) {
  localStorage.setItem("flower_selected_addr", id);
}

// ---------- 订单 ----------
function getOrders() {
  var o = localStorage.getItem("flower_orders");
  return o ? JSON.parse(o) : [];
}
function saveOrders(orders) {
  localStorage.setItem("flower_orders", JSON.stringify(orders));
}
function addOrder(order) {
  var orders = getOrders();
  order.id = Date.now();
  order.createdAt = new Date().toLocaleString();
  orders.push(order);
  saveOrders(orders);
}

// ---------- 页面初始化 ----------
$(function () {
  if (!localStorage.getItem("flower_addresses")) {
    saveAddresses([...DEFAULT_ADDRESSES]);
    setSelectedAddrId(DEFAULT_ADDRESSES[0].id);
    addressIdCounter = 100;
  } else {
    var addrs = getAddresses();
    if (addrs.length > 0) {
      var maxId = Math.max.apply(
        null,
        addrs.map(function (a) {
          return a.id;
        }),
        100,
      );
      addressIdCounter = maxId;
    }
  }
  if (!getSelectedAddrId()) {
    var addrs = getAddresses();
    if (addrs.length > 0) setSelectedAddrId(addrs[0].id);
  }

  loadProductsFromJSON(function () {
    loadUsersFromJSON(function () {
      renderUserArea();
      refreshCartNum();
    });
  });

  $("#searchBtn").click(function () {
    var key = $("#searchInput").val().trim();
    if (key) {
      location.href = "search.html?q=" + encodeURIComponent(key);
    } else {
      location.href = "search.html";
    }
  });
  $("#searchInput").keydown(function (e) {
    if (e.keyCode === 13) $("#searchBtn").click();
  });
});
