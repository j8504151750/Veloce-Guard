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
        url: `http://localhost:8080/api/public/product/${productId}`,
        type: 'GET',
        contentType: 'application/json',
        success: function(product) {
            // Assuming `product` is the object that contains all the info
            $('#productName').text(product.name);
            $('#productDescription').text(product.description);
            $('#productPrice').text(`${product.price}`);
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
            
                // Assuming userEmail stores the current user's email
                var userEmail = 'test123@gmail.com'; // This should be dynamically determined based on the user's session or authentication details
            
                // Fetch and update the cart item count initially
                fetchAndUpdateCartCount(userEmail);
            });
            
            // Function to extract `productId` from the current URL
            function getProductIdFromUrl() {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('productId');
            }
            
            // Function to fetch and display product details
            function getProductDetails(productId) {
                $.ajax({
                    url: `http://localhost:8080/api/public/product/${productId}`,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(product) {
                        // Assuming `product` is the object that contains all the info
                        $('#productName').text(product.name);
                        $('#productDescription').text(product.description);
                        $('#productPrice').text(`${product.price}`);
            
                         // Fetch product variant images
                         getProductVariantImages(productId);
                        
                            // Clear existing SKU options
                            $('#sku').empty();
                            product.productVariants.forEach(function(variant) {
                                $('#sku').append(new Option(variant.sku));
                            });
                            $('#sku').change();
                        
                        // updateCartItemCount(0); // Example, adjust as needed
                    },
                    error: function(error) {
                        console.error('Error fetching product details:', error);
                    }
                });
            }function getProductVariantImages(productId) {
                $.ajax({
                    url: `http://localhost:8080/api/public/product/${productId}/variant/images`,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(images) {
                        console.log('Variant images:', images);
                        // Assuming images is an array of URLs for variant images
                        if (images && images.length > 0) {
                            $('.image-sell img').each(function(index) {
                                if (index < images.length) {
                                    $(this).attr('src', images[index]);
                                } else {
                                    $(this).first().remove(); // Clear remaining images if fewer images are returned
                                }
                            });
                        } else {
                            // Clear all image sources if no images are returned
                            $('.image-sell img').first().remove();
                        }
                    },
                    error: function(error) {
                        console.error('Error fetching variant images:', error);
                        // Handle error (e.g., show default image or clear existing images)
                        $('.image-sell img').attr('src', ''); // Clear images on error
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
                    url: `http://localhost:8080/api/public/product/variant/${sku}/inventory`, // Adjust the URL as per your actual API endpoint
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
            function fetchAndUpdateCartCount(userEmail) {
                $.ajax({
                    url: 'http://localhost:8080/api/public/user/test123@gmail.com/cart/items',
                    type: 'GET',
                    success: function(response) {
                        // Assuming `response` is an array of items, each with a `quantity`
                        let totalQuantity = response.reduce((sum, item) => sum + item.quantity, 0);
            
                        // Update the cart item count text
                        $('#cartItemCount').text(totalQuantity);
            
                        // If totalQuantity is 0, hide the counter, otherwise show it
                        if (totalQuantity === 0) {
                            $('#cartItemCount').hide();
                        } else {
                            $('#cartItemCount').show();
                        }
                    },
                    error: function(error) {
                        console.error('Error fetching cart item count:', error);
                        $('#cartItemCount').hide(); // Hide the counter on error too
                    }
                });
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
                var apiUrl = `http://localhost:8080/api/public/user/test123@gmail.com/cart/item/${selectedSku}/quantity/${quantity}`;
                
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
                        console.log('Product added to cart successfully:', response);
                        alert('商品已成功加入購物車！');
                        fetchAndUpdateCartCount('test123@gmail.com'); // Update this based on your user email retrieval method
                    },
                    error: function(error) {
                        // Handle any errors
                        console.error('Error adding product to cart:', error);
                        // alert('加入購物車時出錯。');
                    }
                });
            }
            
            $('#addToCartBtn').off('click').on('click', function(e) {
                // e.preventDefault(); // Prevent the default form submit action
                addToCart();
            });
            
            
            // function getProductimage(productId) {
            //     console.log("Fetching images for product ID:", productId);
            //     $.ajax({
            //         url: `http://localhost:8080/api/product/${productId}/variant/images`,
            //         type: 'GET',
            //         contentType: 'application/json',
            //         success: function(images) {
            //             console.log("Images received:", images);
            //             if (images && images.length > 0) {
            //                 $('.image-sell img').each(function(index) {
            //                     if (images[index]) {
            //                         $(this).attr('src', images[index]);
            //                         console.log(`Setting image ${index} src to`, images[index]);
            //                     } else {
            //                         $(this).attr('src', '');
            //                         console.log(`Clearing image ${index} src`);
            //                     }
            //                 });
            //             } else {
            //                 $('.image-sell img').attr('src', '');
            //                 console.log("No images received, clearing all image src attributes.");
            //             }
            //         },
            //         error: function(error) {
            //             console.error('Error fetching product images:', error);
            //         }
            //     });
            // }
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
        url: `http://localhost:8080/api/public/product/variant/${sku}/inventory`, // Adjust the URL as per your actual API endpoint
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