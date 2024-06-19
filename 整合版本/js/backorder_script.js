$(document).ready(function () {
    fetchOrders(); // 初始化頁面時拉取訂單資料

    // 編輯訂單表單提交
    $('#editOrderForm').on('submit', function (e) {
        e.preventDefault();
        saveOrder();
    });
});

// 從靜態數據或API拉取訂單資料
function fetchOrders(page = 1) {
    // 靜態數據
    const staticOrders = {
        content: [
            {
                orderId: 1,
                userId: 101,
                orderDate: '2024-06-01',
                totalAmount: 1500,
                status: 1,
                products: [
                    { productName: '產品A', quantity: 2, price: 500 },
                    { productName: '產品B', quantity: 1, price: 500 }
                ],
                paymentMethod: '信用卡'
            },
            {
                orderId: 2,
                userId: 102,
                orderDate: '2024-06-02',
                totalAmount: 2000,
                status: 2,
                products: [
                    { productName: '產品C', quantity: 1, price: 2000 }
                ],
                paymentMethod: 'PayPal'
            }
        ],
        totalPages: 1
    };

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
    // 靜態數據
    const staticOrders = [
        {
            orderId: 1,
            userId: 101,
            orderDate: '2024-06-01',
            totalAmount: 1500,
            status: 1,
            products: [
                { productName: '產品A', quantity: 2, price: 500 },
                { productName: '產品B', quantity: 1, price: 500 }
            ],
            paymentMethod: '信用卡'
        },
        {
            orderId: 2,
            userId: 102,
            orderDate: '2024-06-02',
            totalAmount: 2000,
            status: 2,
            products: [
                { productName: '產品C', quantity: 1, price: 2000 }
            ],
            paymentMethod: 'PayPal'
        }
    ];

    const order = staticOrders.find(o => o.orderId === orderId);
    renderOrderDetails(order);
}

// 渲染訂單詳細
function renderOrderDetails(order) {
    const modalBody = $('#orderDetailsModalBody');
    modalBody.empty();

    const orderDetails = `
        <p>訂單編號: ${order.orderId}</p>
        <p>用戶ID: ${order.userId}</p>
        <p>訂單日期: ${order.orderDate}</p>
        <p>訂單總金額: ${order.totalAmount}</p>
        <p>訂單狀態: ${getOrderStatus(order.status)}</p>
        <h5>產品列表</h5>
        <ul>
            ${order.products.map(product => `
                <li>
                    產品名稱: ${product.productName}, 數量: ${product.quantity}, 單價: ${product.price}
                </li>`).join('')}
        </ul>
        <p>總金額: ${order.totalAmount}</p>
        <p>付款方式: ${order.paymentMethod}</p>
    `;

    modalBody.append(orderDetails);
    $('#orderDetailsModal').modal('show');
}

// 保存訂單
function saveOrder() {
    const orderId = $('#editOrderId').val();
    const orderStatus = $('#editOrderStatus').val();

    const orderData = {
        orderId,
        status: parseInt(orderStatus)
    };

    // 模擬保存訂單
    setTimeout(() => {
        console.log('Order saved:', orderData);
        $('#editOrderModal').modal('hide');
        fetchOrders(); // 重新拉取訂單資料
    }, 500);
}

// 編輯訂單
function editOrder(orderId) {
    // 靜態數據
    const staticOrders = [
        {
            orderId: 1,
            userId: 101,
            orderDate: '2024-06-01',
            totalAmount: 1500,
            status: 1,
            products: [
                { productName: '產品A', quantity: 2, price: 500 },
                { productName: '產品B', quantity: 1, price: 500 }
            ],
            paymentMethod: '信用卡'
        },
        {
            orderId: 2,
            userId: 102,
            orderDate: '2024-06-02',
            totalAmount: 2000,
            status: 2,
            products: [
                { productName: '產品C', quantity: 1, price: 2000 }
            ],
            paymentMethod: 'PayPal'
        }
    ];

    const order = staticOrders.find(o => o.orderId === orderId);

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