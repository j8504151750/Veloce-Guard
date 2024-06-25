$(document).ready(function() {
    // Example API endpoint; replace with actual endpoint URL
    var apiEndpoint = 'http://localhost:8080/api/orders';

    $.ajax({
        url: 'URL',
        type: 'GET',
        dataType: 'json', 
        headers:{
            'Authorization': 'Bearer '

        },
        success: function(data) {
            $.each(data, function(index, order) {
                // Construct a row for each order
                var row = $('<tr>').append(
                    $('<td>').text(order.item),
                    $('<td>').text(order.quantity),
                    $('<td>').text('$' + order.price)
                );
                   console.log("error");
                $('#orders .table tbody').append(row);
            })
        },
        error: function(err) {
            // Assuming 'data' is an array of orders
            $.each(err, function(index, order) {
                // Construct a row for each order
                var row = $('<tr>').append(
                    $('<td>').text(product.productName),
                    $('<td>').text(product.quantity),
                    $('<td>').text('$' + product.productPrice)
                );

                // Append the row to the table body
                $('#orders .table tbody').append(row);
            });
        
        }
    });
});
