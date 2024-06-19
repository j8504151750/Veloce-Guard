$(document).ready(function () {
    fetchProducts(); // 初始化頁面時拉取產品資料

    // 新增產品表單提交
    $('#editProductForm').on('submit', function (e) {
        e.preventDefault();
        saveProduct();
    });

    // 新增分支按鈕
    $('#editProductModal').fi
    nd('.modal-body').append(`
        <button type="button" class="btn btn-secondary" onclick="addVariantFields()">新增分支</button>
    `);
});

// 從API拉取產品資料
function fetchProducts(page = 1) {
    $.ajax({
        url: `http://10.0.103.168:8080/api/public/products?pageNumber=${page - 1}&pageSize=31&sortBy=productId&sortOrder=asc`, // 替換成你的API URL
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTgzNDUwODcsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.fkz6asokV2pQ1tC8HbrI6SZkJviAGxT6mtZXoj_FE2Q" + ""
        },
        success: function (response) {
            console.error('Error fetching products:', response);
        },
        error: function (err) {
            renderTable(err.responseJSON.content); // 假設你的API返回的產品資料在 'products' 屬性下
            renderPagination(err.responseJSON.totalPages, page); // 假設API返回的總頁數
        }
    });
}

// 渲染產品列表
function renderTable(products) {
    const tbody = $('#product-table-body');
    tbody.empty();
    products.forEach(product => {
        const row = `<tr>
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td><button class="btn btn-info" onclick="showDescription('${product.description}')">顯示描述</button></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showVariants(${product.productId})">顯示分支</button>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.productId})">編輯</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.productId})">刪除</button>
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
            <a class="page-link" href="#" onclick="fetchProducts(${i})">${i}</a>
        </li>`;
        pagination.append(pageItem);
    }
}

// 顯示產品描述
function showDescription(description) {
    $('#descriptionModalBody').html(description.replace(/\n/g, '<br>'));
    $('#descriptionModal').modal('show');
}

// 顯示產品變體
function showVariants(variantId) {
    $.ajax({
        url: `http://10.0.103.168:8080/api/public/products/${variantId}/variants`, // 替換成你的API URL
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTgzNDUwODcsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.fkz6asokV2pQ1tC8HbrI6SZkJviAGxT6mtZXoj_FE2Q" + ""
        },
        success: function (response) {
            // console.error('Error fetching variants:', response);
        },
        error: function (err) {
            renderVariants(err); // 假設你的API返回的變體資料在response中
        }
    });
}

// 渲染產品變體
function renderVariants(variantId) {
    const modalBody = $('#variantsModalBody');
    modalBody.empty();
    variantId.forEach(variant => {
        const variantInfo = `<div class="variant-info">
            <p>顏色: ${variant.color}</p>
            <p>尺寸: ${variant.size}</p>
            <p>圖片: ${variant.image}</p>
            <p>sku: ${variant.sku}</p>
            <p>庫存: ${variant.inventory}</p>
        </div>`;
        modalBody.append(variantInfo);
    });
    $('#variantsModal').modal('show');
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
            <label>產品照片</label>
            <input type="file" class="form-control variant-image" name="image" required>
            <button type="button" class="btn btn-danger" onclick="$(this).parent().remove()">移除</button>
        </div>
    `);
}

// 保存產品
function saveProduct() {
    const productId = $('#editProductId').val();
    const productName = $('#editProductName').val();
    const productDescription = $('#editProductDescription').val();
    const productPrice = $('#editproductPrice').val();

    const variants = $('#editproductVariants .variant').map(function () {
        const formData = new FormData();
        formData.append('color', $(this).find('.variant-color').val());
        formData.append('size', $(this).find('.variant-size').val());
        formData.append('inventory', parseInt($(this).find('.variant-inventory').val()));
        formData.append('image', $(this).find('.variant-image')[0].files[0]);
        return formData;
    }).get();

    const productData = {
        productId,
        productName,
        description: productDescription,
        productPrice: parseInt(productPrice),
        productVariants: variants
    };

    if (productId) {
        // 更新現有的產品資料
        $.ajax({
            url: `http://10.0.103.168:8080/api/admin/products/{productId}`,
            method: 'PUT',
            contentType: false,
            processData: false,
            data: productData,
            success: function (response) {
                console.error('Error saving product:', response);
            },
            error: function (err) {
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            }
        });
    } else {
        // 新建產品資料
        $.ajax({
            url: '/api/admin/categories/{categoryId}/product',
            method: 'POST',
            contentType: false,
            processData: false,
            data: productData,
            success: function (response) {
                console.error('Error saving product:', response);
            },
            error: function (err) {
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            }
        });
    }
}

// 刪除產品
function deleteProduct(productId) {
    if (confirm('你確定要刪除這個產品嗎？')) {
        $.ajax({
            url: `/api/admin/products/{productId}`,
            method: 'DELETE',
            success: function (response) {
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (err) {
                console.error('Error deleting product:', err);
            }
        });
    }
}

// 編輯產品
function editProduct(productId) {
    // 這裡假設你已經有一個 `products` 變量存儲所有產品資料
    const product = products.find(p => p.productId === productId);

    $('#editProductId').val(product.productId);
    $('#editProductName').val(product.productName);
    $('#editProductDescription').val(product.description);
    $('#editproductPrice').val(product.productPrice);

    $('#editproductVariants').html('');
    product.productVariants.forEach(variant => {
        $('#editproductVariants').append(`
            <div class="variant form-group">
                <label>顏色</label>
                <input type="text" class="form-control variant-color" value="${variant.color}" required>
                <label>尺寸</label>
                <input type="text" class="form-control variant-size" value="${variant.size}" required>
                <label>庫存</label>
                <input type="number" class="form-control variant-inventory" value="${variant.inventory}" required>
                <label>產品照片</label>
                <input type="file" class="form-control variant-image" name="image" required>
                <button type="button" class="btn btn-danger" onclick="$(this).parent().remove()">移除</button>
            </div>
        `);
    });

    $('#editProductModal').modal('show');
}