$(document).ready(function () {
    // 變數控制步驟進度
    let currentStep = 0;
    let orderDate = "";
    const debounceTime = 300; // Debounce 時間 (毫秒)
    let debounceTimer;

    // 從 JWT 獲取用戶電子郵件
    const userEmail = "test123@gmail.com";
    // 自動加載購物車
    loadCart(userEmail);

    // 監聽前往結帳按鈕的點擊事件
    $('#proceed-to-checkout').on('click', function () {
        currentStep++;
        updateStep();
    });

    // 表單提交處理
    $('#checkout-form').on('submit', function (event) {
        event.preventDefault();
        $('#confirmationModal').modal('show');
    });

    // 處理訂單確認彈窗的確認按鈕點擊事件
    $('#finalize-order').on('click', function () {
        finalizeOrder();
    });

    // 處理訂單確認彈窗的取消按鈕點擊事件
    $('.modal-footer .btn-secondary, .modal-header .close').on('click', function () {
        $('#confirmationModal').modal('hide');
    });

    // 處理返回購物車按鈕的點擊事件
    $('#back-to-cart').on('click', function () {
        currentStep = 0; // 確保返回到第一個步驟
        updateStep(); // 更新步驟顯示
    });

    // 處理商品移除按鈕
    $(document).on('click', '#btn-remove', function () {
        const sku = $(this).closest('tr').data('sku');
        removeCartItem(sku, userEmail);
    });

    // 更新步驟顯示
    function updateStep() {
        $('.progressbar li').removeClass('active').eq(currentStep).addClass('active');
        $('#cart-step').toggleClass('d-none', currentStep !== 0);
        $('#checkout-step').toggleClass('d-none', currentStep !== 1);
        $('#finish-step').toggleClass('d-none', currentStep !== 2);

        // 在展示 "checkout-step" 的時候綁定表單 submit
        if (currentStep === 1) {
            $('#checkout-form').off('submit').on('submit', function (event) {
                event.preventDefault();
                $('#confirmationModal').modal('show');
            });
        }
    }

    // 顯示訂單明細並記錄訂單成立日期
    function updateOrderDetails(order) {
        const deliveryName = $('#full-name').val();
        const address = $('#address').val();
        const pincode = $('#postal-code').val();
        const deliveryTel = $('#tel').val();
        const paymentMethod = $('#payment-method').val();
        let paymentDetails = "";

        if (paymentMethod === "credit-card") {
            const cardNumber = $('#card-number').val();
            const last5Digits = cardNumber.slice(-5);
            paymentDetails = `信用卡末五碼: ${last5Digits}`;
        } else if (paymentMethod === "atm") {
            paymentDetails = `ATM 帳號: ${$('#atm-account').val()}`;
        } else {
            paymentDetails = "貨到付款";
        }

        orderDate = new Date().toLocaleString();

        const orderDetailsHtml = `
            <tr><td>訂單編號</td><td>${order.id}</td></tr>
            <tr><td>全名</td><td>${deliveryName}</td></tr>
            <tr><td>地址</td><td>${address}</td></tr>
            <tr><td>郵遞區號</td><td>${pincode}</td></tr>
            <tr><td>電話</td><td>${deliveryTel}</td></tr>
            <tr><td>付款資訊</td><td>${paymentDetails}</td></tr>
            <tr><td>總金額</td><td>${order.amount}</td></tr>
        `;
        $('#order-details').html(orderDetailsHtml);
        $('#order-date').text(orderDate);
    }

    // 更新付款資訊顯示
    $('#payment-method').on('change', function () {
        const method = $(this).val();
        $('.payment-info').addClass('d-none');
        if (method === 'credit-card') {
            $('#credit-card-info').removeClass('d-none');
        } else if (method === 'atm') {
            $('#atm-info').removeClass('d-none');
        }
    });

    // 處理數量按鈕
    $(document).on('click', '.btn-quantity', function () {
        const action = $(this).data('action');
        const $input = $(this).siblings('.quantity-input');
        let value = parseInt($input.val(), 10);
        const sku = $(this).closest('tr').data('sku');

        if (action === 'increase') {
            value++;
        } else if (action === 'decrease' && value > 1) {
            value--;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            checkAndUpdateCartItem(sku, value, $input);
        }, debounceTime);
    });

    // 處理數量變更的事件
    $(document).on('change', '.quantity-input', function () {
        const sku = $(this).closest('tr').data('sku');
        const value = $(this).val();

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            checkAndUpdateCartItem(sku, value, $(this));
        }, debounceTime);
    });

    // 更新總金額的函數
    function updateTotal() {
        $.get(`http://localhost:8080/api/public/user/${userEmail}/cart/price`, function (price) {
            $('#subtotal').text('$' + price);
            // 運費計算
            let shippingFee = 0;
            if (price < 1500) {
                shippingFee = 120;
            } else if (price < 2000) {
                shippingFee = 60;
            }

            const total = price + shippingFee;
            $('#shipping-fee').text('$' + shippingFee);
            $('#total-amount').text('$' + total);
        }).fail(function () {
            alert('加載總金額失敗');
        });
    }

    // 初始化標誌
    let reloadOnce = sessionStorage.getItem('reloadOnce') === 'true';

    // 加載購物車
    function loadCart(userEmail) {
        $.get(`http://localhost:8080/api/public/user/${userEmail}/cart/items`, function (items) {
            let cartItemsHtml = '';
            console.log(items); // 調試輸出
            if (items.length === 0) {
                // 購物車為空的情況
                cartItemsHtml = '<tr><td colspan="6" class="text-center">購物車為空</td></tr>';
            } else {
                items.forEach(item => {
                    cartItemsHtml += `
                    <tr data-sku="${item.sku}">
                        <td>${item.name}</td>
                        <td>${item.sku}</td>
                        <td><img class="cart-picture" src="${item.image}" alt="商品照片"></td>
                        <td>$${item.price}</td>
                        <td>
                            <div class="quantity-controls">
                                <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="decrease">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                                <button class="btn btn-outline-secondary btn-sm btn-quantity" data-action="increase">+</button>
                            </div>
                        </td>
                        <td><button class="btn btn-secondary btn-sm" id="btn-remove">移除</button></td>
                    </tr>
                `;
                });
            }
            $('#cart-items').html(cartItemsHtml);
            updateTotal();
        }).fail(function () {
            if (!reloadOnce) {
                alert('購物車已清空');
                sessionStorage.setItem('reloadOnce', 'true'); // 設置標誌避免重複刷新
                location.reload(); // 自動重新整理頁面
            }
        });
    }

    // 調用加載購物車函數
    loadCart(userEmail);

    // 重置標誌在頁面加載時
    $(document).ready(function () {
        sessionStorage.removeItem('reloadOnce');
    });




    // 檢查並更新購物車中的商品數量
    function checkAndUpdateCartItem(sku, quantity, $input) {
        console.log(`Checking stock for SKU: ${sku}`);
        $.get(`http://localhost:8080/api/public/product/variant/${sku}/inventory`, function (stock) {
            console.log(`Stock for SKU ${sku}: ${stock}`);
            if (quantity <= stock) {
                updateCartItem(sku, quantity);
            } else {
                alert('數量超過庫存');
                $input.val(stock); // 重設數量為庫存量
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('檢查庫存失敗:', textStatus, errorThrown);
            alert('檢查庫存失敗');
        });
    }

    // 更新購物車中的商品數量
    function updateCartItem(sku, quantity) {
        $.ajax({
            url: `http://localhost:8080/api/public/user/${userEmail}/cart/item/${sku}/quantity/${quantity}`,
            type: 'PUT',
            success: function () {
                loadCart(userEmail); // 更新成功後刷新購物車
                
            },
            error: function () {
                alert('更新商品數量失敗');
            }
        });
    }

    // 移除購物車中的商品
    function removeCartItem(sku) {
        $.ajax({
            url: `http://localhost:8080/api/public/user/${userEmail}/cart/item/${sku}`,
            type: 'DELETE',
            success: function () {
                loadCart(userEmail);
            },
            error: function () {
                alert('移除商品失敗');
            }
        });
    }

    // 完成訂單
    // 完成訂單
function finalizeOrder() {
    const payment = $('#payment-method').val();
    const deliveryName = $('#full-name').val();
    const address = $('#address').val();
    const pincode = $('#postal-code').val();
    const deliveryTel = $('#tel').val();

    const orderData = {
        paymentMethod: payment,
        deliveryName: deliveryName,
        address: address,
        pincode: pincode,
        deliveryTel: deliveryTel
    };

    $.ajax({
        url: `http://localhost:8080/api/public/user/${userEmail}/order/${payment}`,
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJleHAiOjE3MjA2ODQzMTMsImlhdCI6MTcyMDU5NzkxMywiZW1haWwiOiJ0ZXN0MTIzQGdtYWlsLmNvbSIsInN0YXR1cyI6IlVTRVIifQ.ICDmjZiwFMJOw9QR6JBhm2Q5gXPX5DaTV3yJPNFY3E4" + "",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(orderData),
        success: function (order) {
            currentStep++;
            updateOrderDetails(order);
            $('#confirmationModal').modal('hide');
            updateStep();
        },
        error: function () {
            alert('訂單提交失敗');
        }
    });
}

    // 初始更新付款方式的顯示
    $('#payment-method').trigger('change');
});
