$(document).ready(function () {
    function fetchProducts(page = 1) {
        $.ajax({
            url: '/api/products', // 更改為你的 API URL
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                renderTable(response);
                renderPagination(response.totalPages, page);
            },
            error: function (err) {
                console.error('Error fetching products:', err);
            }
        });
    }

    function renderTable(products) {
        const tbody = $('#product-table-body');
        tbody.empty();
        
        products.forEach(product => {
            const variantsHtml = product.variants.map(variant => `
                <div>
                    顏色: ${variant.color}, 尺寸: ${variant.size}, 庫存: ${variant.quantity}
                </div>
            `).join('');
            const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><img src="${product.image}" alt="product image" style="max-width: 50px;"></td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${variantsHtml}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openEditModal(${product.id})">編輯</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">刪除</button>
                    </td>
                </tr>`;
            tbody.append(row);
        });
    }

    function renderPagination(totalPages, currentPage) {
        const pagination = $('#pagination');
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            pagination.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        }

        $('.page-link').click(function (e) {
            e.preventDefault();
            const page = $(this).data('page');
            fetchProducts(page);
        });
    }

    fetchProducts();

    window.openAddProductModal = function () {
        $('#editProductId').val('');
        $('#editProductName').val('');
        $('#editProductDescription').val('');
        $('#editProductPrice').val('');
        $('#editProductImage').val('');
        $('#editProductVariants').html(`
            <div class="form-group">
                <label>顏色</label>
                <input type="text" class="form-control variant-color" value="">
                <label>尺寸</label>
                <input type="text" class="form-control variant-size" value="">
                
                <label>庫存</label>
                <input type="number" class="form-control variant-quantity" value="">
            </div>
        `);

        $('#editProductModalLabel').text('新增商品');
        $('#editProductModal').modal('show');
    }

    window.openEditModal = function (productId) {
        $.ajax({
            url: `/api/products/${productId}`,
            method: 'GET',
            dataType: 'json',
            success: function (product) {
                $('#editProductId').val(product.id);
                $('#editProductName').val(product.name);
                $('#editProductDescription').val(product.description);
                $('#editProductPrice').val(product.price);
                
                const variants = product.variants.map(variant => `
                    <div class="form-group">
                        <input type="hidden" class="variant-id" value="${variant.id}">
                        <label>顏色</label>
                        <input type="text" class="form-control variant-color" value="${variant.color}">
                        <label>尺寸</label>
                        <input type="text" class="form-control variant-size" value="${variant.size}">
                        <label>SKU</label>
                        <input type="text" class="form-control variant-sku" value="${variant.sku}">
                        <label>庫存</label>
                        <input type="number" class="form-control variant-quantity" value="${variant.quantity}">
                    </div>
                `).join('');
                $('#editProductVariants').html(variants);

                $('#editProductModalLabel').text('編輯商品');
                $('#editProductModal').modal('show');
            },
            error: function (err) {
                console.error('Error fetching product:', err);
            }
        });
    }

    $('#editProductForm').submit(function (e) {
        e.preventDefault();

        const productId = $('#editProductId').val();
        const formData = new FormData();
        formData.append('name', $('#editProductName').val());
        formData.append('description', $('#editProductDescription').val());
        formData.append('price', parseFloat($('#editProductPrice').val()));
        formData.append('image', $('#editProductImage')[0].files[0]);

        $('.variant-id').each(function (index) {
            formData.append(`variants[${index}].id`, $(this).val());
            formData.append(`variants[${index}].color`, $('.variant-color').eq(index).val());
            formData.append(`variants[${index}].size`, $('.variant-size').eq(index).val());
            formData.append(`variants[${index}].sku`, $('.variant-sku').eq(index).val());
            formData.append(`variants[${index}].quantity`, parseInt($('.variant-quantity').eq(index).val(), 10));
        });

        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `/api/products/${productId}` : '/api/products';

        $.ajax({
            url: url,
            method: method,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                $('#editProductModal').modal('hide');
                fetchProducts();
                alert(`商品${method === 'POST' ? '新增' : '更新'}成功`);
            },
            error: function (err) {
                console.error(`Error ${method === 'POST' ? 'adding' : 'updating'} product:`, err);
            }
        });
    });

    window.deleteProduct = function (productId) {
        if (confirm('確定要刪除這個商品嗎？')) {
            $.ajax({
                url: `/api/products/${productId}`,
                method: 'DELETE',
                success: function () {
                    fetchProducts();
                    alert('商品已刪除');
                },
                error: function (err) {
                    console.error('Error deleting product:', err);
                }
            });
        }
    }
});