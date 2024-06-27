$(document).ready(function () {
    fetchOrders(); // 初始化頁面時拉取訂單資料

    // 編輯訂單表單提交
    $('#editOrderForm').on('submit', function (e) {
        e.preventDefault();
        saveOrder();
    });
});

// 全局靜態數據
const staticOrders = {
    content: [
        {
            orderId: 1,
            userId: 101,
            orderDate: '2024-06-01',
            totalAmount: 1500,
            status: 1,
            products: [
                {
                    productName: 'X-Fifteen X-15 素色 全罩式安全帽 頂級款 X15',
                    productCategory: '全罩式',
                    color: '白',
                    size: 'M',
                    quantity: 2,
                    unitPrice: 21000,
                    subtotal: 42000,
                    image: 'https://shoplineimg.com/5be4227a02dd95000178fa71/645dd9f4cf1c520017ddb4d5/800x.webp?source_format=jpg'
                },
                {
                    productName: 'X-Fifteen X-15 素色 全罩式安全帽 頂級款 X15',
                    productCategory: '全罩式',
                    color: '白',
                    size: 'M',
                    quantity: 2,
                    unitPrice: 21000,
                    subtotal: 42000,
                    image: 'https://shoplineimg.com/5be4227a02dd95000178fa71/645dd9f4cf1c520017ddb4d5/800x.webp?source_format=jpg'
                }

            ],
            recipientName: '張三',
            recipientZip: '100',
            recipientAddress: '台北市中正區中山南路21號',
            recipientPhone: '0912345678',
            paymentMethod: '貨到付款'
        },
        {
            orderId: 2,
            userId: 102,
            orderDate: '2024-06-02',
            totalAmount: 2000,
            status: 2,
            products: [
                {
                    productName: '產品C',
                    productCategory: '其他',
                    color: '黑',
                    size: 'L',
                    quantity: 1,
                    unitPrice: 2000,
                    subtotal: 2000,
                    sku: 'C-黑-L',
                    image: 'https://via.placeholder.com/150'
                }
            ],
            recipientName: '李四',
            recipientZip: '200',
            recipientAddress: '新北市板橋區中山路一段1號',
            recipientPhone: '0987654321',
            paymentMethod: '信用卡'
        }
    ],
    totalPages: 1
};

// 從靜態數據或API拉取訂單資料
function fetchOrders(page = 1) {
    // 模擬API延遲
    setTimeout(() => {
        renderTable(staticOrders.content);
        renderPagination(staticOrders.totalPages, page);
    }, 500);
}

// 渲染訂單列表
function renderTable(orders) {
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
    const order = staticOrders.content.find(o => o.orderId === orderId);
    renderOrderDetails(order);
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

    // 更新靜態數據中的訂單狀態
    const order = staticOrders.content.find(o => o.orderId === orderData.orderId);
    if (order) {
        order.status = orderData.status;
    }

    // 模擬保存訂單
    setTimeout(() => {
        console.log('Order saved:', orderData);
        $('#editOrderModal').modal('hide');
        fetchOrders(); // 重新拉取訂單資料
    }, 500);
}

// 編輯訂單
function editOrder(orderId) {
    const order = staticOrders.content.find(o => o.orderId === orderId);

    $('#editOrderId').val(order.orderId);
    $('#editOrderStatus').val(order.status);
    $('#editOrderModal').modal('show');
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