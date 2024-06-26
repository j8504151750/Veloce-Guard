$(document).ready(function() {
    // Replace with the actual endpoint URL that returns product details in JSON format
    var apiEndpoint = 'http://yourdomain.com/api/product/details';

    // Making an AJAX request to the API endpoint
    $.ajax({
        url: apiEndpoint,
        type: 'GET',
        dataType: 'json', // Expecting JSON data in response
        success: function(data) {
            // Assuming the API returns data in the format:
            // {
            //   "name": "Nylon Fleece Hooded Sweater",
            //   "description": "A new style inspired by...",
            //   "price": "6980",
            //   "imageSrc": "./images/MENS TOPS/top1.jpg"
            // }

            // Dynamically update the HTML with data from the API
            $('.image-sell').html('<img src="' + data.imageSrc + '" alt="' + data.name + '">');
            $('.product-introduction h2').text(data.name);
            $('.product-introduction p:first').text(data.description);
            $('.product-introduction p:last').text('價格: $ ' + data.price);
        },
        error: function(err) {
            // Handle any errors
            console.log("Error fetching data: ", err);
            // Optionally, update the HTML to show an error message
            $('.image-sell').html('<p>Error loading image.</p>');
            $('.product-introduction').html('<p>Error loading product details.</p>');
        }
    });
});