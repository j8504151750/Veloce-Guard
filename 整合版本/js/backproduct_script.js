$(document).ready(function () {
    

    fetchProducts(); // 初始化頁面時拉取產品資料

    // 新增產品表單(包含變體分支)提交
    $('#addProductForm').on('submit', function (e) {
        e.preventDefault();
        saveProductWithVariants();
    });

    // 編輯產品表單(只有主表)提交
    $('#editProductForm').on('submit', function (e) {
        e.preventDefault();
        const productId = $('#editProductId').val();
        const updatedProduct = {
            productName: $('#editProductName').val(),
            description: $('#editProductDescription').val(),
            productPrice: $('#editProductPrice').val()
        };

        $.ajax({
            url: `/api/admin/products/${productId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedProduct),
            success: function (response) {
                // 處理成功響應
                alert('產品更新成功！');
                $('#editProductModal').modal('hide');
                // 這裡可以添加代碼來更新前端顯示的產品資料
            },
            error: function (error) {
                // 處理錯誤響應
                alert('產品更新失敗，請重試。');
            }
        });
    });


    // 新增變體表單提交
    $('#editVariantForm').on('submit', function (e) {
        e.preventDefault();
        saveVariant();
    });
    // 綁定保存分支變更按鈕
    $('#variantsModalBody').on('click', '.btn-primary', function () {
        saveVariant();
    });
});


// 靜態數據
const staticProducts = [
    {
        productId: 1,
        productName: '產品A',
        category: '類別1',
        description: '這是產品A的描述',
        productPrice: 1000,
        productVariants: [
            { color: '紅色', size: 'M', inventory: 10, sku: 'A-M-RED', image: 'path/to/image1.jpg' },
            { color: '藍色', size: 'L', inventory: 5, sku: 'A-L-BLUE', image: 'path/to/image2.jpg' }
        ]
    },
    {
        productId: 2,
        productName: '產品B',
        category: '類別2',
        description: '這是產品B的描述',
        productPrice: 2000,
        productVariants: [
            { color: '綠色', size: 'S', inventory: 15, sku: 'B-S-GREEN', image: 'path/to/image3.jpg' },
            { color: '黃色', size: 'XL', inventory: 8, sku: 'B-XL-YELLOW', image: 'path/to/image4.jpg' }
        ]
    }
];

// 從API數據拉取產品資料
function fetchProducts(page = 1) {
    $.ajax({
        url: `http://localhost:8080/api/public/products?pageNumber=${page - 1}&pageSize=31&sortBy=productId&sortOrder=asc`, // 替換成你的API URL
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg4NjM2MjYsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.uCsSFQ8QY4Px8M0Af2yapG0TF1cNBvDDfQrOz9Suyx4" + ""
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
            <td>${product.category}</td>
            <td>${product.productPrice}</td>
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

// url: `http://10.0.103.168:8080/api/public/products/${variantId}/variants`, // 替換成你的API URL
// 顯示產品變體
function showVariants(productId) {
    $.ajax({
        url: `http://localhost:8080/api/public/${productId}/variants`, // 替換成你的API URL
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg4NjM2MjYsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.uCsSFQ8QY4Px8M0Af2yapG0TF1cNBvDDfQrOz9Suyx4" + ""
        },
        success: function (response) {
            // console.error('Error fetching variants:', response);
        },
        error: function (err) {
            renderVariants(err.responseJSON); // 假設你的API返回的變體資料在response中
        }
    });
}

// 渲染顯示產品變體
function renderVariants(variants, productId) {
    const modalBody = $('#variantsModalBody');
    modalBody.empty();
    if (Array.isArray(variants)) {
        variants.forEach((variant, index) => {
            const variantInfo = `<div class="variant-info">
                <p>顏色: ${variant.color}</p><br>
                <p>尺寸: ${variant.size}</p><br>
                <p>圖片: <img src="${variant.image}" alt="${variant.color}" style="width: 50px; height: 50px;"/></p><br>
                <p>sku: ${variant.sku}</p><br>
                <p>庫存: ${variant.inventory}</p><br>
                <button class="btn btn-sm btn-warning" onclick="editVariant(${productId}, ${index})">編輯</button>
                <button class="btn btn-sm btn-danger" onclick="deleteVariant(${productId}, ${index})">刪除</button>
            </div>`;
            modalBody.append(variantInfo);
        }); 
    } else {
        modalBody.append('<p>沒有找到任何變體。</p>');
    }
    modalBody.append(`
        <button type="button" class="btn btn-secondary" onclick="addVariantFieldInModal()">新增分支</button>
    `);

    $('#variantsModal').modal('show');
}

// 編輯產品變體
function editVariant(productId, variantIndex) {
    const product = staticProducts.find(p => p.productId === productId);
    const variant = product.productVariants[variantIndex];

    $('#editProductId').val(product.productId);
    $('#editVariantIndex').val(variantIndex);
    $('#editVariantColor').val(variant.color);
    $('#editVariantSize').val(variant.size);
    $('#editVariantInventory').val(variant.inventory);
    $('#editVariantSku').val(variant.sku);
    $('#editVariantImage').val('');

    $('#variantModal').modal('show');
}

// 新增分支區塊並存儲分支資訊
function addVariantField() {
    // 動態新增分支區塊
    const variantFieldHTML = `
        <div class="variant-field">
            <input type="text" class="form-control mb-2" placeholder="顏色" name="color[]">
            <input type="text" class="form-control mb-2" placeholder="尺寸" name="size[]">
            <input type="number" class="form-control mb-2" placeholder="庫存" name="inventory[]">
            <input type="text" class="form-control mb-2" placeholder="SKU" name="sku[]">
            <input type="file" class="form-control mb-2" name="image[]">
            <button type="button" class="btn btn-danger mb-2" onclick="removeVariantField(this)">移除分支</button>
        </div>
    `;
    $('#variantFieldsContainer').append(variantFieldHTML);
}

// 新增分支區塊到顯示分支的模態框中
function addVariantFieldInModal() {
    const variantFieldHTML = `
        <div class="variant-field">
            <input type="text" class="form-control mb-2" placeholder="顏色" name="modalColor[]">
            <input type="text" class="form-control mb-2" placeholder="尺寸" name="modalSize[]">
            <input type="number" class="form-control mb-2" placeholder="庫存" name="modalInventory[]">
            <input type="text" class="form-control mb-2" placeholder="SKU" name="modalSku[]">
            <input type="file" class="form-control mb-2" name="modalImage[]">
            <button type="button" class="btn btn-danger mb-2" onclick="removeVariantField(this)">移除分支</button>
            <button type="submit" class="btn btn-primary">保存分支變更</button>
        </div>`;
    $('#variantsModalBody').append(variantFieldHTML);

    // 綁定保存分支變更按鈕
    $('#variantsModalBody').find('.btn-primary').off('click').on('click', function () {
        saveVariant();
    });

}


// 移除分支區塊並更新分支資訊
function removeVariantField(button) {
    $(button).closest('.variant-field').remove();
}

// 保存變體
function saveVariant() {
    const productId = $('#editProductId').val();
    const variantIndex = $('#editVariantIndex').val();
    const color = $('#editVariantColor').val();
    const size = $('#editVariantSize').val();
    const inventory = $('#editVariantInventory').val();
    const sku = $('#editVariantSku').val();
    const image = $('#editVariantImage')[0].files[0] ? URL.createObjectURL($('#editVariantImage')[0].files[0]) : '';

    const product = staticProducts.find(p => p.productId === parseInt(productId));
    const variantData = { color, size, inventory, sku, image };

    if (variantIndex) {
        product.productVariants[variantIndex] = variantData;
    } else {
        product.productVariants.push(variantData);
    }

    $('#variantModal').modal('hide');
    showVariants(productId);

}

// 刪除變體
function deleteVariant(productId, variantIndex) {
    const product = staticProducts.find(p => p.productId === productId);
    product.productVariants.splice(variantIndex, 1);
    showVariants(productId);
}

// 保存新增商品及分支
function saveProductWithVariants() {
    const productName = $('#addProductName').val();
    const productCategory = $('#addProductCategory').val();
    const productDescription = $('#addProductDescription').val();
    const productPrice = $('#addProductPrice').val();

    const productVariants = [];
    $('#variantFieldsContainer .variant-field').each(function () {
        const color = $(this).find('input[name="color[]"]').val();
        const size = $(this).find('input[name="size[]"]').val();
        const inventory = $(this).find('input[name="inventory[]"]').val();
        const sku = $(this).find('input[name="sku[]"]').val();
        const imageInput = $(this).find('input[name="image[]"]')[0];
        const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';

        productVariants.push({ color, size, inventory, sku, image });
    });

    const productData = {
        productName,
        category: productCategory,
        description: productDescription,
        productPrice: parseInt(productPrice),
        productVariants
    };

    // 模擬保存產品及分支
    setTimeout(() => {
        staticProducts.push(productData);
        console.log('Product with variants saved:', productData);
        $('#addProductModal').modal('hide');
        $('.modal-backdrop').remove(); // 移除半透明背景
        fetchProducts(); // 重新拉取產品資料
    }, 500);

}

// 保存產品
function saveProduct(type) {
    const productId = type === 'edit' ? $('#editProductId').val() : null;
    const productName = type === 'edit' ? $('#editProductName').val() : $('#addProductName').val();
    const productCategory = type === 'edit' ? $('#editProductCategory').val() : $('#addProductCategory').val();
    const productDescription = type === 'edit' ? $('#editProductDescription').val() : $('#addProductDescription').val();
    const productPrice = type === 'edit' ? $('#editProductPrice').val() : $('#addProductPrice').val();

    const productData = {
        productId: productId ? parseInt(productId) : staticProducts.length + 1,
        productName,
        category: productCategory,
        description: productDescription,
        productPrice: parseInt(productPrice),
        productVariants: productId ? staticProducts.find(p => p.productId === parseInt(productId)).productVariants : []
    };

    if (productId) {
        // 更新現有的產品資料
        const productIndex = staticProducts.findIndex(p => p.productId === parseInt(productId));
        staticProducts[productIndex] = productData;
    } else {
        // 新建產品資料
        staticProducts.push(productData);
    }

    // 模擬保存產品
    setTimeout(() => {
        console.log('Product saved:', productData);
        if (type === 'edit') {
            $('#editProductModal').modal('hide');
        } else {
            $('#addProductModal').modal('hide');
            $('.modal-backdrop').remove(); // 移除半透明背景
        }
        fetchProducts(); // 重新拉取產品資料
    }, 500);
}

// 刪除產品
function deleteProduct(productId) {
    if (confirm('你確定要刪除這個產品嗎？')) {
        $.ajax({
            url: `http://localhost:8080/api/admin/products/${productId}`,
            method: 'DELETE',
            success: function (response) {
                console.error('Error deleting product:', response);
            },
            error: function (err) {
                fetchProducts(); // 重新拉取產品資料
            }
        });
    }
}




// 這裡假設你已經有一個 `products` 變量存儲所有產品資料
// 編輯產品
function editProduct(productId) {
    // 定義全域變數來儲存產品資料
    let beEditproduct = [];
    // 獲取所有產品資料
    $.ajax({
        url: `/api/admin/products/${productId}`,  // 您的API端點
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('無法獲取產品資料:', data);
        },
        error: function (error) {
            beEditproduct = error; // 將獲取到的產品資料儲存在全域變數中
        }
    });

    const product = beEditproduct.find(p => p.productId === productId);
    
    if (product) {
        $('#editProductId').val(product.productId);
        $('#editProductName').val(product.productName);
        $('#editProductDescription').val(product.description);
        $('#editProductPrice').val(product.productPrice);

        $('#editProductModal').modal('show');
    } else {
        alert('找不到產品資料');
    }
}
// 開啟新增商品的 Modal
function openAddProductModal() {
    $('#addProductForm')[0].reset();
    $('#variantFieldsContainer').empty(); // 清空分支欄位
    $('.modal-backdrop').remove(); // 移除半透明背景
}

