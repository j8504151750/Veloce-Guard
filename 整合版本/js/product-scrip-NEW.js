$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/api/products',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            response.forEach(function (product) {
                if (product.productId > 0 && product.productId < 10) { 
                    var firstVariantImage = product.productVariants.length > 0 ? product.productVariants[0].image : 'defaultImagePath.jpg';
                    $('#productContainer').append(
                        `<div class="product col-4 float-left">
                            <div class="image-container">
                                <img src="${firstVariantImage}" alt="${product.name}" />
                            </div>
                            
                            <div style="font-size: 20px;" class="product-name">${product.name}</div><br>
                            <a href="itemDesJT.html?productId=${product.productId}" class="btn btn-secondary" style="width:100%; height:50px; margin-bottom:50px;">點我看詳細</a>
                        
                        </div>`
                    );
                }
            });
        },


        error: function (error) {
            console.log("Failed to load products:", error);
        }
    });
});

