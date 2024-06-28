$(document).ready(function () {
    fetchOrders(); // 初始化頁面時拉取訂單資料

    // 編輯訂單表單提交
    $('#editOrderForm').on('submit', function (e) {
        e.preventDefault();
        saveOrder();
    });
});

// 從API拉取訂單資料
function fetchOrders(page = 1) {
    $.ajax({
        url: `http://localhost:8080/api/admin/orders?page=${page}`,
        method: 'GET',
        success: function (response) {
            console.error('Failed to fetch orders:', response);
        },
        error: function (error) {
            renderTable(error.content);
            renderPagination(error.totalPages, page);
        }
    });
}

// 渲染訂單列表
function renderTable(orders) {
    if (!Array.isArray(orders)) {
        orders = [];
    }

    const tbody = $('#order-table-body');
    tbody.empty();
    orders.forEach(order => {
        const row = `<tr>
            <td>${order.orderId}</td>
            <td>${order.userId}</td>
            <td>${order.orderDate}</td>
            <td>${order.totalAmount}</td>
            <td>${getOrderStatus(order.status)}</td>
            <td>
                <button class="btn btn-info" onclick="showOrderDetails(${order.orderId})">查看詳細</button>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editOrder(${order.orderId})">編輯</button>
            </td>
        </tr>`;
        tbody.append(row);
    });
}

// 渲染分頁控制
function renderPagination(totalPages, currentPage) {
    const pagination = $('#pagination');
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="fetchOrders(${i})">${i}</a>
        </li>`;
        pagination.append(pageItem);
    }
}

// 顯示訂單詳細
function showOrderDetails(orderId) {
    $.ajax({
        url: `/api/orders/${orderId}`,
        method: 'GET',
        success: function (order) {
            renderOrderDetails(order);
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch order details:', error);
        }
    });
}

// 渲染訂單詳細
function renderOrderDetails(order) {
    const modalBody = $('#orderDetailsModalBody');
    modalBody.empty();

    const orderDetails = `
        <table class="table table-bordered">
            <tr>
                <th>訂單編號</th>
                <td>${order.orderId}</td>
            </tr>
            <tr>
                <th>用戶ID</th>
                <td>${order.userId}</td>
            </tr>
            <tr>
                <th>收件人姓名</th>
                <td>${order.recipientName}</td>
            </tr>
            <tr>
                <th>收件人郵遞區號</th>
                <td>${order.recipientZip}</td>
            </tr>
            <tr>
                <th>收件人地址</th>
                <td>${order.recipientAddress}</td>
            </tr>
            <tr>
                <th>收件人電話</th>
                <td>${order.recipientPhone}</td>
            </tr>
            <tr>
                <th>付款方式</th>
                <td>${order.paymentMethod}</td>
            </tr>
            <tr>
                <th>訂單成立日期</th>
                <td>${order.orderDate}</td>
            </tr>
            <tr>
                <th>訂單總金額</th>
                <td>${order.totalAmount}</td>
            </tr>
            <tr>
                <th>訂單狀態</th>
                <td>${getOrderStatus(order.status)}</td>
            </tr>
        </table>
        <h5>產品列表</h5>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>商品名稱</th>
                    <th>產品類別</th>
                    <th>顏色</th>
                    <th>尺寸</th>
                    <th>數量</th>
                    <th>單價</th>
                    <th>小計</th>
                    <th>圖片</th>
                </tr>
            </thead>
            <tbody>
                ${order.products.map(product => `
                    <tr>
                        <td>${product.productName}</td>
                        <td>${product.productCategory}</td>
                        <td>${product.color}</td>
                        <td>${product.size}</td>
                        <td>${product.quantity}</td>
                        <td>${product.unitPrice}</td>
                        <td>${product.subtotal}</td>
                        <td><img src="${product.image}" alt="${product.productName}" width="50"></td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `;

    modalBody.append(orderDetails);
    $('#orderDetailsModal').modal('show');
}

// 保存訂單
function saveOrder() {
    const orderId = parseInt($('#editOrderId').val());
    const orderStatus = parseInt($('#editOrderStatus').val());

    const orderData = {
        orderId: orderId,
        status: orderStatus
    };

    // 更新訂單
    $.ajax({
        url: `/api/orders/${orderId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function (response) {
            console.log('Order saved:', response);
            $('#editOrderModal').modal('hide');
            fetchOrders(); // 重新拉取訂單資料
        },
        error: function (xhr, status, error) {
            console.error('Failed to save order:', error);
        }
    });
}

// 編輯訂單
function editOrder(orderId) {
    $.ajax({
        url: `/api/orders/${orderId}`,
        method: 'GET',
        success: function (order) {
            $('#editOrderId').val(order.orderId);
            $('#editOrderStatus').val(order.status);
            $('#editOrderModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch order:', error);
        }
    });
}

// 獲取訂單狀態的文字描述
function getOrderStatus(status) {
    switch (status) {
        case 1: return '待付款';
        case 2: return '已付款';
        case 3: return '待出貨';
        case 4: return '已出貨';
        case 5: return '已送達';
        case 6: return '已完成';
        case 7: return '已取消';
        case 8: return '退貨/換貨';
        default: return '未知狀態';
    }
}