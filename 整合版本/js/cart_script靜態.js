$(document).ready(function () {
    // 變數控制步驟進度
    let currentStep = 0;
    let orderDate = "";

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
        currentStep++;
        updateOrderDetails();
        $('#confirmationModal').modal('hide');
        updateStep();
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
        $(this).closest('tr').remove();
        updateTotal(); // 移除商品後，更新總金額
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
    function updateOrderDetails() {
        const fullName = $('#full-name').val();
        const address = $('#address').val();
        const postalCode = $('#postal-code').val();
        const tel = $('#tel').val();
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
            <tr><td>訂單編號</td><td>000001</td></tr>
            <tr><td>全名</td><td>${fullName}</td></tr>
            <tr><td>地址</td><td>${address}</td></tr>
            <tr><td>郵遞區號</td><td>${postalCode}</td></tr>
            <tr><td>電話</td><td>${tel}</td></tr>
            <tr><td>付款資訊</td><td>${paymentDetails}</td></tr>
            <tr><td>總金額</td><td>1560</td></tr>
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

        if (action === 'increase') {
            value++;
        } else if (action === 'decrease' && value > 1) {
            value--;
        }

        $input.val(value);
        updateTotal();
    });

    // 處理數量變更的事件
    $(document).on('change', '.quantity-input', function () {
        updateTotal();
    });

    // 更新總金額的函數
    function updateTotal() {
        let subtotal = 0;
        $('#cart-items tr').each(function () {
            const price = parseFloat($(this).find('td:nth-child(4)').text().replace('$', ''));
            const quantity = parseInt($(this).find('.quantity-input').val(), 10);

            if (!isNaN(price) && !isNaN(quantity)) {
                subtotal += price * quantity;
            }
        });
        $('#subtotal').text('$' + subtotal);
        //運費計算
        let shippingFee = 0;
        if (subtotal < 1500) {
            shippingFee = 120;
        } else if (subtotal < 2000) {
            shippingFee = 60;
        }

        const total = subtotal + shippingFee;
        $('#shipping-fee').text('$' + shippingFee);
        $('#total-amount').text('$' + total);
    }

    // 初始更新付款方式的顯示
    $('#payment-method').trigger('change');
});