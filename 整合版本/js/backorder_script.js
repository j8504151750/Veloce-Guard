$(document).ready(function () {
    fetchOrders(); // 初始化頁面時拉取訂單資料

    // 編輯訂單表單提交
    $('#editOrderForm').on('submit', function (e) {
        e.preventDefault();
        saveOrder();
    });
});

// 從API拉取訂單資料
function fetchOrders(page = 1, pageSize = 10) {
    $.ajax({
        url: 'http://localhost:8080/api/orders',
        method: 'GET',
        success: function (response) {
            console.log('Fetched orders:', response); // 調試輸出
            renderTable(response, page, pageSize); // 傳遞當前頁數和每頁顯示的訂單數
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch orders:', {
                xhr: xhr,
                status: status,
                error: error
            });
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
    orders.forEach((order) => {
        const row = `<tr>
            <td>${order.id}</td>
            <td>${order.email}</td>
            <td>${order.date}</td>
            <td>${order.amount}</td>
            <td>${getOrderStatus(Number(order.status))}</td> <!-- 使用函數轉換數值為文字描述 -->
            <td>
                <button class="btn btn-info" onclick="showOrderDetails(${order.id})">查看詳細</button> <!-- 使用訂單 ID -->
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editOrder(${order.id})">編輯</button> <!-- 使用訂單 ID -->
            </td>
        </tr>`;
        tbody.append(row);
    });
}

// 顯示訂單詳細
function showOrderDetails(orderId) {
    $.ajax({
        url: `http://localhost:8080/api/order/${orderId}`,
        method: 'GET',
        success: function (order) {
            renderOrderDetails(order);
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch order details:', error, xhr.responseText);
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
                <th>電子郵件</th>
                <td>${order.email}</td>
            </tr>
            <tr>
                <th>訂單日期</th>
                <td>${order.date}</td>
            </tr>
            <tr>
                <th>總金額</th>
                <td>${order.amount}</td>
            </tr>
            <tr>
                <th>訂單狀態</th>
                <td>${getOrderStatus(Number(order.status))}</td> <!-- 使用函數轉換數值為文字描述 -->
            </tr>
        </table>
        <h5>產品列表</h5>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>顏色</th>
                    <th>尺寸</th>
                    <th>SKU</th>
                    <th>數量</th>
                    <th>圖片</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.color}</td>
                        <td>${item.size}</td>
                        <td>${item.sku}</td>
                        <td>${item.quantity}</td>
                        <td><img src="${item.image}" alt="${item.sku}" width="50"></td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `;

    modalBody.append(orderDetails);
    $('#orderDetailsModal').modal('show');
}

// 保存訂單
function saveOrder() {
    const orderId = $('#editOrderId').val();
    const status = $('#editOrderStatus').val();

    const orderData = {
        status: status
    };

    $.ajax({
        url: `http://localhost:8080/api/order/${orderId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function (response) {
            console.log('Order saved:', response);
            $('#editOrderModal').modal('hide');
            fetchOrders();
        },
        error: function (xhr, status, error) {
            console.error('Failed to save order:', error);
        }
    });
}

// 編輯訂單
function editOrder(orderId) {
    $.ajax({
        url: `http://localhost:8080/api/order/${orderId}`,
        method: 'GET',
        success: function (order) {
            $('#editOrderId').val(order.id); // 使用訂單 ID
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
