$(document).ready(function() {
    $.ajax({
        url: 'http://localhost:8080/api/products',
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            response.forEach(function(product) {
                var firstVariantImage = product.productVariants.length > 0 ? product.productVariants[0].image : 'defaultImagePath.jpg';
                $('#productContainer').append(
                    `<div class="product col-4 float-left" style="cursor: pointer;">
                        <a href="itemDesJT.html?productId=${product.productId}">
                            <div class="image-container">
                                <img src="${firstVariantImage}" alt="${product.name}" />
                                <div>${product.name}</div>
                            </div>
                        </a>
                    </div>`
                );
            });
        },
        error: function(error) {
            console.log("Failed to load products:", error);
        }
    });
});