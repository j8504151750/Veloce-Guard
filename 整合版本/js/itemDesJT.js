function updateCartItemCount(count) {
    if (count > 0) {
        $('#cartItemCount').text(count).show(); // Show badge with count
    } else {
        $('#cartItemCount').hide(); // Hide badge if count is 0
    }
}

$(document).ready(function() {
    // Fetch SKU options on page load
    var skuUrl = 'http://localhost:8080/api/product/1/variants'; 
    $.ajax({
        url: skuUrl,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        success: function(response) {
            $('#sku').empty();
            response.forEach(function(skuObj) {
                $('#sku').append(new Option(skuObj.sku)); // Assuming each object has `sku` and `display` properties
            });
            $('#sku').change();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching SKUs:', textStatus, errorThrown);
        }
    });

    $('#sku').change(function() {
        var selectedSku = $(this).val();
        var stockUrl = 'http://localhost:8080/api/product/variant/' + selectedSku + '/inventory';
        $.ajax({
            url: stockUrl,
            type: 'GET',
            success: function(response) {
                $('#quantity').attr('max', response).val(1); // Also resets the quantity input to 1
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching stock:', textStatus, errorThrown);
            }
        });
    });

    $('#addToCartBtn').click(function() {
        var quantity = $('#quantity').val(); // Get the selected quantity
        var sku = $('#sku').val();
        $.ajax({
            url: 'http://localhost:8080/api/public/carts/1/products/1/quantity/' + quantity,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            data: JSON.stringify({quantity: quantity, sku: sku}),
            success: function(response) {
                alert('Product added to cart successfully!');
                var totalItems = response.totalItems; // Assuming this is part of your response
                updateCartItemCount(totalItems); 
            },
            error: function(xhr, status, error) {
                console.error("Error adding product to cart:", error);
                alert('Failed to add product to cart.');
            }
        });
    });
});

// Initial update for the cart item count on page load, if needed
$(document).ready(function() {
    updateCartItemCount(0); // You might want to dynamically check this from your backend instead
    // Include an AJAX call to fetch and display the current cart count, if required
});

$(document).ready(function() {
    // Existing code to populate SKUs, change event for the select element, addToCart functionality...

    // Fetch Product Details on page load
    var productUrl = 'http://localhost:8080/api/product/1';
    $.ajax({
        url: productUrl,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        success: function(response) {
            console.log(response);
            // Update HTML content with fetched product details
            $('#productName').text(response.name);
            $('#productDescription').text(response.description);
            $('#productPrice').text(response.price);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching product details:', textStatus, errorThrown);
            // Handle error
            // Optionally, you might want to display a default error message or content in case of failure
        }
    });
    
    // The logic for SKU list population, SKU selection change, and addToCart button click remains unchanged.
});