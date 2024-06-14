$(document).ready(function () {
    fetchProducts(); // 初始化頁面時拉取產品資料

    // 新增產品表單提交
    $('#editProductForm').on('submit', function (e) {
        e.preventDefault();
        saveProduct();
    });

    // 新增分支按鈕
    $('#editProductModal').find('.modal-body').append(`
        <button type="button" class="btn btn-secondary" onclick="addVariantFields()">新增分支</button>
    `);
});

// 從API拉取產品資料
function fetchProducts(page = 1) {
    $.ajax({
        url: `http://10.0.103.168:8080/api/public/products?pageNumber=${page - 1}&pageSize=30&sortBy=productId&sortOrder=asc`, // 替換成你的API URL
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTgzNDUwODcsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.fkz6asokV2pQ1tC8HbrI6SZkJviAGxT6mtZXoj_FE2Q" + ""
        },
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            // console.log(err);
            renderTable(err.responseJSON.content); // 假設你的API返回的產品資料在 'products' 屬性下
            renderPagination(err.responseJSON.totalPages, page); // 假設API返回的總頁數
        }
    });
}

// 渲染產品列表
//先繞產品 再繞變體
function renderTable(products) {
    const tbody = $('#product-table-body');
    tbody.empty();
    products.forEach(product => {
        // console.log(product);        
        product.productVariants.forEach(variant => {
            // console.log(variant.image);
            const row = `<tr>
                <td>${product.productId}</td>
                <td>${product.productName}</td>
                <td><img src="${variant.image}" alt="${product.productName}" width="50"></td>
                <td><button class="btn btn-info" onclick="showDescription('${product.description}')">顯示描述</button></td>
                <td>${product.productPrice}</td>
                <td>${variant.color}</td>
                <td>${variant.size}</td>
                <td>${variant.inventory}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${product.productId}, ${variant.variantId})">編輯</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.productId}, ${variant.variantId})">刪除</button>
                </td>
            </tr>`;
            tbody.append(row);
        });
    });
}
// 渲染分頁控制
function renderPagination(totalPages, currentPage) {
    const pagination = $('#pagination');
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="fetchProducts(${i})">${i}</a>
        </li>`;
        pagination.append(pageItem);
    }
}

// 打開編輯/新增產品的彈出視窗
function openAddProductModal() {
    $('#editProductForm')[0].reset();
    $('#editProductId').val('');
    $('#editproductVariants').html(`
        <div class="variant form-group">
            <label>顏色</label>
            <input type="text" class="form-control variant-color" required>
            <label>尺寸</label>
            <input type="text" class="form-control variant-size" required>
            <label>庫存</label>
            <input type="number" class="form-control variant-inventory" required>
        </div>
    `);

    $('#editProductModal').modal('show');
}

// 編輯產品
function editProduct(productId, variantId) {
    const product = products.find(p => p.productId === productId);
    const variant = product.productVariants.find(v => v.variantId === variantId);

    $('#editProductId').val(product.productId);
    $('#editProductName').val(product.productName);
    $('#editProductDescription').val(product.description);
    $('#editproductPrice').val(product.productPrice);

    $('#editproductVariants').html(`
        <div class="form-group">
            <label>顏色</label>
            <input type="text" class="form-control" value="${variant.color}" disabled>
        </div>
        <div class="form-group">
            <label>尺寸</label>
            <input type="text" class="form-control" value="${variant.size}" disabled>
        </div>
        <div class="form-group">
            <label>庫存</label>
            <input type="number" class="form-control" value="${variant.inventory}" required>
        </div>
    `);

    $('#editProductModal').modal('show');
}

// 保存產品
function saveProduct() {
    const productId = $('#editProductId').val();
    const productName = $('#editProductName').val();
    const productDescription = $('#editProductDescription').val();
    const productPrice = $('#editproductPrice').val();
    const inventory = $('#editproductVariants input[type="number"]').val();

    const productData = {
        productId,
        productName,
        description: productDescription,
        productPrice: parseInt(productPrice),
        productVariants: $('#editproductVariants>div.variant').map(function () {
            return {
                color: $(this).find('.variant-color').val(),
                size: $(this).find('.variant-size').val(),
                inventory: parseInt($(this).find('.variant-inventory').val())
            };
        }).get()
    };

    if (productId) {
        // 更新現有的產品資料
        $.ajax({
            url: `http://10.0.103.168:8080/api/admin/products/{productId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (err) {
                console.error('Error saving product:', err);
            }
        });
    } else {
        // 新建產品資料
        $.ajax({
            url: 'http://10.0.103.168:8080/api/admin/categories/${categoryId}/product',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                // console.error('Error saving product:', err);                
            },
            error: function (err) {
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            }
        });
    }
}

// 刪除產品
function deleteProduct(productId, variantId) {
    if (confirm('你確定要刪除這個產品嗎？')) {
        $.ajax({
            url: `/api/products/${productId}/variants/${variantId}`,
            method: 'DELETE',
            success: function (response) {
                // console.error('Error deleting product:', err);

            },
            error: function (err) {
                fetchProducts(); // 重新拉取產品資料

            }
        });
    }
}

// 新增產品分支（顏色、尺寸、庫存）輸入區域
function addVariantFields() {
    $('#editproductVariants').append(`
        <div class="variant form-group">
            <label>顏色</label>
            <input type="text" class="form-control variant-color" required>
            <label>尺寸</label>
            <input type="text" class="form-control variant-size" required>
            <label>庫存</label>
            <input type="number" class="form-control variant-inventory" required>
            <button type="button" class="btn btn-danger" onclick="$(this).parent().remove()">移除</button>
        </div>
    `);
}
// 顯示產品描述
function showDescription(description) {
    $('#descriptionModalBody').html(description.replace(/\n/g, '<br>'));
    $('#descriptionModal').modal('show');
}