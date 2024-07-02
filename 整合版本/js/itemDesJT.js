$(document).ready(function() {
    // Retrieve the Product ID from the URL
    var productId = getProductIdFromUrl();
    
    // Fetch and display the product details
    if (productId) {
        getProductDetails(productId);
    } else {
        console.error("Product ID not found in URL query parameters.");
    }

    // Placeholder for other functionalities
    initializeOtherFeatures();
});

// Function to extract `productId` from the current URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('productId');
}

// Function to fetch and display product details
function getProductDetails(productId) {
    $.ajax({
        url: `http://localhost:8080/api/product/${productId}`,
        type: 'GET',
        contentType: 'application/json',
        success: function(product) {
            // Assuming `product` is the object that contains all the info
            $('#productName').text(product.name);
            $('#productDescription').text(product.description);
            $('#productPrice').text(`${product.price}`);

            // Update images and SKU options here if needed
            // Assuming first variant image is used for main display if exists
            if (product.productVariants && product.productVariants.length > 0) {
                $('.image-sell img').first().attr('src', product.productVariants[0].image);



                // Clear existing SKU options
                $('#sku').empty();
                product.productVariants.forEach(function(variant) {
                    $('#sku').append(new Option(variant.sku));
                });
                $('#sku').change();
            }
            updateCartItemCount(0); // Example, adjust as needed
        },
        error: function(error) {
            console.error('Error fetching product details:', error);
        }
    });
}

// Listen for changes on the SKU select dropdown
$('#sku').change(function() {
    var selectedSku = $(this).val();
    fetchInventoryForSku(selectedSku);
});
// Function to fetch inventory count for an SKU and update the quantity input's max value
function fetchInventoryForSku(sku) {
    $.ajax({
        url: `http://localhost:8080/api/product/variant/${sku}/inventory`, // Adjust the URL as per your actual API endpoint
        type: 'GET',
        contentType: 'application/json',
        success: function(inventoryCount) {
            // Assuming the response directly gives the inventory count
            $('#quantity').attr('max', inventoryCount);
        },
        error: function(error) {
            console.error('Error fetching inventory:', error);
            // Handle errors (e.g., set a default max value or show an error message)
        }
    });
}

// Initialize other features or functionalities you might have on this page
function initializeOtherFeatures() {
    // Example: Any setup for image sliders, variant selection, etc.
    console.log("Other features initialized.");
}

// Example function to update cart item count
function updateCartItemCount(count) {
    if (count > 0) {
        $('#cartItemCount').text(count).show();
    } else {
        $('#cartItemCount').hide();
    }
}

// Function triggered by the "Add to Cart" button
function addToCart() {
    // Retrieve the selected product details and user email
    var selectedSku = $('#sku').val();
    var quantity = $('#quantity').val();
    // var userEmail = $('#userEmail').val();

    // if (!userEmail) {
    //   alert('請輸入您的電子郵件地址。');
    //   return; // Stop the function if no email provided
    // }

    // Data object to be sent to the server
    var cartData = {
        quantity: quantity,
        sku: selectedSku,
    };

    // Construct the API URL dynamically using template literals
    var apiUrl = `http://localhost:8080/api/cart/item/${selectedSku}/test123@gmail.com/quantity/${quantity}`;

    // AJAX call to your server endpoint to handle the cart addition
    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cartData), 
        headers: {
            // 'Access-Control-Allow-Origin': '*'
        },
        success: function(response) {
            // Handle success (e.g., showing a confirmation message)
            console.log('Product added to cart successfully:', response);
            alert('商品已成功加入購物車！');
        },
        error: function(error) {
            // Handle any errors
            console.error('Error adding product to cart:', error);
            alert('加入購物車時出錯。');
        }
    });
}

$('#addToCartBtn').click(function(e) {
    e.preventDefault(); // Prevent the default form submit action
    addToCart();
});