

$(document).ready(function () {
  // 變數控制步驟進度
  let currentStep = 0;
  let orderDate = "";

  // 監聽前往結帳按鈕的點擊事件
  $("#proceed-to-checkout").on("click", function () {
    currentStep++;
    updateStep();
  });

  // 表單提交處理
  $("#checkout-form").on("submit", function (event) {
    event.preventDefault();
    $("#confirmationModal").modal("show");
  });

  // 處理訂單確認彈窗的確認按鈕點擊事件
  $("#finalize-order").on("click", function () {
    currentStep++;
    updateOrderDetails();
    $("#confirmationModal").modal("hide");
    updateStep();
  });

  // 處理訂單確認彈窗的取消按鈕點擊事件
  $(".modal-footer .btn-secondary, .modal-header .close").on(
    "click",
    function () {
      $("#confirmationModal").modal("hide");
    }
  );

  // 處理返回購物車按鈕的點擊事件
  $("#back-to-cart").on("click", function () {
    currentStep = 0; // 確保返回到第一個步驟
    updateStep(); // 更新步驟顯示
  });

  // 處理商品移除按鈕
  $(document).on("click", "#btn-remove", function () {
    $(this).closest("tr").remove();
    updateTotal(); // 移除商品後，更新總金額
  });

  // 更新步驟顯示
  function updateStep() {
    $(".progressbar li")
      .removeClass("active")
      .eq(currentStep)
      .addClass("active");
    $("#cart-step").toggleClass("d-none", currentStep !== 0);
    $("#checkout-step").toggleClass("d-none", currentStep !== 1);
    $("#finish-step").toggleClass("d-none", currentStep !== 2);

    // 在展示 "checkout-step" 的時候綁定表單 submit
    if (currentStep === 1) {
      $("#checkout-form")
        .off("submit")
        .on("submit", function (event) {
          event.preventDefault();
          $("#confirmationModal").modal("show");
        });
    }
  }

  // 顯示訂單明細並記錄訂單成立日期
  function updateOrderDetails() {
    const fullName = $("#full-name").val();
    const address = $("#address").val();
    const city = $("#city").val();
    const postalCode = $("#postal-code").val();
    const country = $("#country").val();
    const paymentMethod = $("#payment-method").val();
    let paymentDetails = "";

    if (paymentMethod === "credit-card") {
      const cardNumber = $("#card-number").val();
      const last5Digits = cardNumber.slice(-5);
      paymentDetails = `信用卡末五碼: ${last5Digits}`;
    } else if (paymentMethod === "atm") {
      paymentDetails = `ATM 帳號: ${$("#atm-account").val()}`;
    } else {
      paymentDetails = "貨到付款";
    }

    orderDate = new Date().toLocaleString();

    const orderDetailsHtml = `
            <tr><td>全名</td><td>${fullName}</td></tr>
            <tr><td>地址</td><td>${address}</td></tr>
            <tr><td>城市</td><td>${city}</td></tr>
            <tr><td>郵遞區號</td><td>${postalCode}</td></tr>
            <tr><td>國家</td><td>${country}</td></tr>
            <tr><td>付款資訊</td><td>${paymentDetails}</td></tr>
        `;
    $("#order-details").html(orderDetailsHtml);
    $("#order-date").text(orderDate);
  }

  // 更新付款資訊顯示
  $("#payment-method").on("change", function () {
    const method = $(this).val();
    $(".payment-info").addClass("d-none");
    if (method === "credit-card") {
      $("#credit-card-info").removeClass("d-none");
    } else if (method === "atm") {
      $("#atm-info").removeClass("d-none");
    }
  });

  // 處理數量按鈕
  $(document).on("click", ".btn-quantity", function () {
    const action = $(this).data("action");
    const $input = $(this).siblings(".quantity-input");
    let value = parseInt($input.val());

    if (action === "increase") {
      value++;
    } else if (action === "decrease" && value > 1) {
      value--;
    }

    $input.val(value);
    updateTotal();
  });

  // 處理數量變更的事件
  $(document).on("change", ".quantity-input", function () {
    updateTotal();
  });

  // 更新總金額的函數
  function updateTotal() {
    let subtotal = 0;
    $("#cart-items tr").each(function () {
      const price = parseFloat(
        $(this).find("td:nth-child(3)").text().replace("$", "")
      );
      const quantity = $(this).find(".quantity-input").val();
      subtotal += price * quantity;
    });
    $("#subtotal").text("$" + subtotal);
    //運費計算
    let shippingFee = 0;
    if (subtotal < 1500) {
      shippingFee = 120;
    } else if (subtotal < 2000) {
      shippingFee = 60;
    }

    const total = subtotal + shippingFee;
    $("#shipping-fee").text("$" + shippingFee);
    $("#total-amount").text("$" + total);
  }

  // 初始更新付款方式的顯示
  $("#payment-method").trigger("change");
});








//                   渲染購物車進入頁面
$(document).ready(function () {
  $.ajax({
    url: `http://10.0.103.168:8080/api/public/users/john.doe%40example.com/carts/1`, // 后端提供的获取购物车数据的API
    type: 'GET',
    dataType: 'json',
    headers: {
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg2MDkxOTcsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.sv9lu3PEvCTRaKO8fRENXOwWAWW9N7kj9XaRSJ4al_Y`
    },

    success: function (data) {

      var itemsHtml = "";
      $.each(data, function (index, item) {
        console.log(data);
        itemsHtml += `<tr>
                    <td>${item.name}</td>
                    <td><img class="cart-picture" src="${item.image_url}" alt="商品照片"></td>
                    <td>$${item.price}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="decrease">-</button>
                            <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1">
                            <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="increase">+</button>
                        </div>
                    </td>
                    <td><button class="btn btn-secondary btn-sm" id="btn-remove">移除</button></td>
                </tr>`;
      });
      $("#cart-items").html(itemsHtml);
      updateTotal(); // 更新总计
    },
    error: function (err) {
      console.log(err);

      var itemsHtml = "";
      $.each(err.responseJSON.products, function (index, item) {
        itemsHtml += `<tr>
                    <td>${item.productName}</td>
                    <td><img class="cart-picture" src="${item.image}" alt="商品照片"></td>
                    <td>$${item.productPrice}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="decrease">-</button>
                            <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1">
                            <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="increase">+</button>
                        </div>
                    </td>
                    <td><button class="btn btn-secondary btn-sm" id="btn-remove">移除</button></td>
                </tr>`;
      });
      $("#cart-items").html(itemsHtml);
      updateTotal(); // 更新总计
    },
  });
})

// 創建訂單寫入資料庫
$("#finalize-order").on("click", function () {
  // 收集订单信息
  var orderData = {
    fullName: $("#full-name").val(),
    address: $("#address").val(),
    city: $("#city").val(),
    postalCode: $("#postal-code").val(),
    country: $("#country").val(),
    paymentMethod: $("#payment-method").val(),
    items: [], // 假设您已经有一个函数来收集购物车中的商品信息
    orderDate: orderDate, // 假设您之前已经设置了 orderDate 变量
  };

  // 收集购物车中的商品信息
  $("#cart-items tr").each(function () {
    var item = {
      productId: $(this).data("product-id"), // 确保您的每个商品行都有 data-product-id 属性
      quantity: $(this).find(".quantity-input").val(),
    };
    orderData.items.push(item);
  });

  // 发送POST请求到服务器以创建订单
  $.ajax({
    url: "/createOrder", // 您的后端API端点
    type: "POST",
    contentType: "application/json", // 发送JSON数据
    data: JSON.stringify(orderData), // 将订单数据转换为JSON字符串
    success: function (response) {
      // 订单创建成功的处理
      alert("訂單提交成功！");
      // 可能还需要跳转到订单成功页面或其他操作
    },
    error: function () {
      // 订单创建失败的处理
      alert("訂單提交失敗，請重試。");
    },
  });
});
