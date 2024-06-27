
$(document).ready(function() {
    $('#addToCartBtn').click(function() {
        // Reading product information
        var productId = 1;
        var productName = $(this).data('product-name');
        var productPrice = $(this).data('product-price');
        var sku = $('#sku').val(); 

        // Send the data using AJAX
        $.ajax({
            url: 'http://localhost:8080/api/public/carts/1/products/1/quantity/1',
            type: 'POST',
            contentType: 'application/json', 
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg3OTE3NTQsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.Fmr94KQD5GFs7oJn6eFyehXkrF5Jx2278uoECEylX5g'
            },
            data: JSON.stringify({
                productId: productId,
                productName: productName,
                productPrice: productPrice,
                sku: sku,
            }),
            success: function(response) {
                alert('Product added to cart successfully!');
            },
            error: function(xhr, status, error) {
                console.error("Error adding product to cart:", error);
                alert('Failed to add product to cart.');
            }
        });
    });
});
