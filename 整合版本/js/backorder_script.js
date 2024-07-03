$(document).ready(function () {
    fetchOrders(); // 初始化頁面時拉取訂單資料

    // 編輯訂單表單提交
    $('#editOrderForm').on('submit', function (e) {
        e.preventDefault();
        saveOrder();
    });
});

// 從API拉取訂單資料
function fetchOrders() {
    $.ajax({
        url: 'http://localhost:8080/api/orders',
        method: 'GET',
        success: function (response) {
            console.log('Fetched orders:', response); // 調試輸出
            renderTable(response); // 直接使用 response，不再依賴 content 和 totalPages
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
    orders.forEach(order => {
        const row = `<tr>
            <td>${order.email}</td>
            <td>${order.date}</td>
            <td>${order.amount}</td>
            <td>${order.status}</td> <!-- 確保這裡的鍵名與返回數據匹配 -->
            <td>
                <button class="btn btn-info" onclick="showOrderDetails('${order.email}')">查看詳細</button>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editOrder('${order.email}')">編輯</button>
            </td>
        </tr>`;
        tbody.append(row);
    });
}

// 顯示訂單詳細
function showOrderDetails(email) {
    $.ajax({
        url: `http://localhost:8080/api/orders/${email}`,
        method: 'GET',
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                renderOrderDetails(response[0]); // 假設每個 email 只有一個訂單
            } else {
                console.error('No order details found for email:', email);
            }
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
                <td>${order.status}</td>
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
    const email = $('#editOrderEmail').val();
    const status = $('#editOrderStatus').val();

    const orderData = {
        email: email,
        status: status
    };

    // 更新訂單
    $.ajax({
        url: `http://localhost:8080/api/orders/${email}`,
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
function editOrder(email) {
    $.ajax({
        url: `http://localhost:8080/api/orders/${email}`,
        method: 'GET',
        success: function (order) {
            $('#editOrderEmail').val(order.email);
            $('#editOrderStatus').val(order.status);
            $('#editOrderModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch order:', error);
        }
    });
}
