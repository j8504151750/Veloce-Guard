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
            name: $('#editProductName').val(),
            subcategory: $('#editProductCategory').val(),
            description: $('#editProductDescription').val(),
            price: $('#editProductPrice').val()
        };

        $.ajax({
            url: `http://localhost:8080/api/product/${productId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedProduct),
            success: function (response) {
                alert('產品更新成功！');
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (error) {
                alert('產品更新失敗，請重試。');
            }
        });
    });

    // 新增產品變體表單提交
    $('#editVariantForm').on('submit', function (e) {
        e.preventDefault();
        saveVariant();
    });

    

    // 綁定保存分支變更按鈕
    $('#variantsModalBody').on('click', '.btn-primary', function () {
        saveVariant();
    });
});

// 從API數據拉取產品資料
function fetchProducts() {
    $.ajax({
        url: `http://localhost:8080/api/防摔衣/products`,
        method: 'GET',
        dataType: 'json',
        success: function (products) {
            console.log('API response:', products); // 添加這行來檢查API返回的資料
            if (products) {
                renderTable(products); // 假設API返回的產品資料在 'products' 屬性下
                // renderPagination(response.totalPages, page); // 假設API返回的總頁數
            } else {
                console.error('API response does not contain products');
            }
        },
        error: function (err) {
            console.error('Error fetching products:', err);
        }
    });
}

// 渲染產品列表
function renderTable(products) {
    const tbody = $('#product-table-body');
    tbody.empty();
    $.each(products, function(index, product) {
        const row = `<tr>
            <td>${product.productId}</td>
            <td>${product.name}</td>
            <td>${product.subcategory}</td>
            <td>${product.price}</td>
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
function showVariants(productId) {
    $.ajax({
        url: `http://localhost:8080/api/product/${productId}/variants`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            renderVariants(response, productId); // 假設API返回的變體資料在response中
        },
        error: function (err) {
            console.error('Error fetching variants:', err);
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
                <button class="btn btn-sm btn-danger" onclick="deleteVariant(${productId}, '${variant.sku}')">刪除</button>
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
function editVariant(productId, sku) {
    $.ajax({
        url: `http://localhost:8080/api/product/${productId}/variants`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            const variant = response[sku];
            $('#editProductId').val(productId);
            $('#editVariantSku').val(variant.sku); // 使用變體的 SKU 作為唯一標識符
            $('#editVariantColor').val(variant.color);
            $('#editVariantSize').val(variant.size);
            $('#editVariantInventory').val(variant.inventory);
            $('#editVariantImage').val('');

            $('#variantModal').modal('show');
        },
        error: function (err) {
            console.error('Error fetching variant:', err);
        }
    });
}

// 新增分支區塊並存儲分支資訊
function addVariantField() {
    const variantFieldsContainer = $('#variantFieldsContainer');
    const variantIndex = variantFieldsContainer.children().length;
    const variantField = `
        <div class="form-group variant-field">
            <label for="variantColor${variantIndex}">顏色</label>
            <input type="text" class="form-control" id="variantColor${variantIndex}" name="variants[${variantIndex}][color]" required>
            <label for="variantSize${variantIndex}">尺寸</label>
            <input type="text" class="form-control" id="variantSize${variantIndex}" name="variants[${variantIndex}][size]" required>
            <label for="variantInventory${variantIndex}">庫存</label>
            <input type="number" class="form-control" id="variantInventory${variantIndex}" name="variants[${variantIndex}][inventory]" required>
            <label for="variantSku${variantIndex}">SKU</label>
            <input type="text" class="form-control" id="variantSku${variantIndex}" name="variants[${variantIndex}][sku]" required>
            <label for="variantImage${variantIndex}">產品照片</label>
            <input type="file" class="form-control" id="variantImage${variantIndex}" name="variants[${variantIndex}][image]">
            <button type="button" class="btn btn-danger mb-2" onclick="removeVariantField(this)">移除分支</button>
        </div>
    `;
    variantFieldsContainer.append(variantField);
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
    const sku = $('#editVariantSku').val();
    const formData = new FormData();
    formData.append('variant', new Blob([JSON.stringify({
        color: $('#editVariantColor').val(),
        size: $('#editVariantSize').val(),
        inventory: $('#editVariantInventory').val(),
        sku: sku
    })], { type: 'application/json' }));

    // 處理圖片文件上傳
    const imageFile = $('#editVariantImage')[0].files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    $.ajax({
        url: `http://localhost:8080/api/product/variant/${sku}`,
        type: 'PUT',
        data: formData,
        processData: false, // 不要處理數據
        contentType: false, // 不設置內容類型
        success: function (response) {
            alert('變體更新成功！');
            $('#variantModal').modal('hide');
            fetchProducts(); // 重新拉取產品資料
        },
        error: function (error) {
            console.error('Error updating variant:', error);
            alert('變體更新失敗，請重試。');
        }
    });
}





// 綁定保存分支變更按鈕
$('#variantsModalBody').on('click', '.btn-primary', function () {
    saveVariant();
});

// 刪除變體
function deleteVariant(productId, sku) {
    if (confirm('你確定要刪除這個變體嗎？')) {
        $.ajax({
            
            url: `http://localhost:8080/api/product/variant/${sku}`,
            type: 'DELETE',
            success: function (response) {
                alert('變體刪除成功！');
                showVariants(productId);
            },
            error: function (error) {
                alert('變體刪除失敗，請重試。');
            }
        });
    }
}

// 保存新增商品及分支
function saveProductWithVariants() {
    const name = $('#addProductName').val();
    const subcategory = $('#addProductCategory').val();
    const description = $('#addProductDescription').val();
    const price = $('#addProductPrice').val();
    const categoryName = encodeURIComponent(subcategory);// 使用encodeURIComponent對categoryName進行URL編碼

    const productVariants = [];

    $('.variant-field').each(function () {
        const color = $(this).find('input[name="variants[' + $(this).index() + '][color]"]').val();
        const size = $(this).find('input[name="variants[' + $(this).index() + '][size]"]').val();
        const inventory = $(this).find('input[name="variants[' + $(this).index() + '][inventory]"]').val();
        const sku = $(this).find('input[name="variants[' + $(this).index() + '][sku]"]').val();
        const imageInput = $(this).find('input[name="variants[' + $(this).index() + '][image]"]')[0];
        const image = imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;
        productVariants.push({ color, size, inventory, sku, image });
    });

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify({
        name: name,
        subcategory: subcategory,
        description: description,
        price: parseInt(price),
        productVariants: productVariants.map(variant => ({
            color: variant.color,
            size: variant.size,
            inventory: variant.inventory,
            sku: variant.sku
        }))
    })], { type: 'application/json' }));

    productVariants.forEach((variant, index) => {
        if (variant.image) {
            formData.append('image', variant.image);
        }
    });

    $.ajax({
        url: `http://localhost:8080/api/${categoryName}/product`,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            alert('產品新增成功！');
            $('#addProductModal').modal('hide');
            $('.modal-backdrop').remove();
            fetchProducts();
        },
        error: function (error) {
            alert('產品新增失敗，請重試。');
        }
    });
}


// 保存產品
function saveProduct(type) {
    const productId = type === 'edit' ? $('#editProductId').val() : null;
    const name = type === 'edit' ? $('#editProductName').val() : $('#addProductName').val();
    const subcategory = type === 'edit' ? $('#editProductCategory').val() : $('#addProductCategory').val();
    const description = type === 'edit' ? $('#editProductDescription').val() : $('#addProductDescription').val();
    const price = type === 'edit' ? $('#editProductPrice').val() : $('#addProductPrice').val();

    const productData = {
        productId: productId ? parseInt(productId) : undefined,
        name,
        subcategory,
        description,
        price: parseInt(price),
        productVariants: productId ? [] : []
    };

    if (productId) {
        // 更新現有的產品資料
        $.ajax({
            url: `http://localhost:8080/api/product/${productId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                alert('產品更新成功！');
                $('#editProductModal').modal('hide');
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (error) {
                alert('產品更新失敗，請重試。');
            }
        });
    } else {
        // 新建產品資料
        $.ajax({
            url: 'http://localhost:8080/api/product',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                alert('產品新增成功！');
                $('#addProductModal').modal('hide');
                $('.modal-backdrop').remove(); // 移除半透明背景
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (error) {
                alert('產品新增失敗，請重試。');
            }
        });
    }
}

// 刪除產品
function deleteProduct(productId) {
    if (confirm('你確定要刪除這個產品嗎？')) {
        $.ajax({
            url: `http://localhost:8080/api/product/${productId}`,
            type: 'DELETE',
            success: function (response) {
                alert('產品刪除成功！');
                fetchProducts(); // 重新拉取產品資料
            },
            error: function (error) {
                alert('產品刪除失敗，請重試。');
            }
        });
    }
}

// 編輯產品
function editProduct(productId) {
    $.ajax({
        url: `http://localhost:8080/api/product/${productId}`,
        type: 'GET',
        dataType: 'json',
        success: function (product) {
            $('#editProductId').val(product.productId);
            $('#editProductName').val(product.name);
            $('#editProductCategory').val(product.subcategory);
            $('#editProductDescription').val(product.description);
            $('#editProductPrice').val(product.price);

            $('#editProductModal').modal('show');
        },
        error: function (error) {
            alert('無法獲取產品資料');
        }
    });
}

// 開啟新增商品的 Modal
function openAddProductModal() {
    $('#addProductForm')[0].reset();
    $('#variantFieldsContainer').empty(); // 清空分支欄位
    $('.modal-backdrop').remove(); // 移除半透明背景
}