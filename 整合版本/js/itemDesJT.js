function updateCartItemCount(count) {
    if (count > 0) {
        $('#cartItemCount').text(count).show(); // Show badge with count
    } else {
        $('#cartItemCount').hide(); // Hide badge if count is 0
    }
}

$(document).ready(function() {
    $('#addToCartBtn').click(function() {
        var quantity = $('#quantity').val(); // Get the selected quantity
        var sku = $('#sku').val(); 

        $.ajax({
            url: 'http://localhost:8080/api/public/carts/1/products/1/quantity/' + quantity, // Make sure this URL is correct for your API.
            type: 'POST',
            contentType: 'application/json', 
            headers: {
                'Content-Type': 'application/json',
                'Accress-Control-Allow-Origin': '*' // Note: There's a typo here; it should be 'Access-Control-Allow-Origin'
            },
            data: JSON.stringify({
                quantity: quantity,
                sku: sku,
            }),
            success: function(response) {
                alert('Product added to cart successfully!');
                // Suppose the response contains the total count
                // Update the cart item count badge
                var totalItems = response.totalItems; 
                updateCartItemCount(totalItems); 
            },
            error: function(xhr, status, error) {
                console.error("Error adding product to cart:", error);
                alert('Failed to add product to cart.');
            }
        });
    });


});

// Further code to initially check cart count on page load
$(document).ready(function() {
    // 這邊要放ajax get 購物車內的資訊 才能拿來做上面的比較  顯示出購物車內有多少筆資料

    updateCartItemCount(0);
});


//看庫存 更改max value of 數量

$(document).ready(function() {
    // Example URL - replace this with your actual endpoint
    var Url = 'http://localhost:8080/api/product/variant/X-15-白-M/inventory';

    $.ajax({
        url: Url,
        type: 'GET',
        // dataType: 'json',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Accress-COntrol-Allow-Origin': '*'
        // },
        success: function(response) {
            // Assuming response contains a 'stock' key with the available stock
            var maxStock = response;

            // Update the 'max' attribute of the quantity input
            $('#quantity').attr('max', maxStock);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching stock:', textStatus, errorThrown);
            // Handle error
        }
    });
});
