$(document).ready(function() {
    // Example API endpoint; replace with actual endpoint URL
    var apiEndpoint = 'http://localhost:8080/api/orders';

    // order-info
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

 // Member-info
 $.ajax({
    url: memberInfoApiEndpoint,
    type: 'GET',
    dataType: 'json',
    headers: {
        'Authorization': 'Bearer '
    },
    success: function (data) {
        var memberInfo = $('#member-info');
        memberInfo.empty(); // Clear any existing content

        // Append new rows with fetched data
        memberInfo.append(
            $('<tr>').append(
                $('<th>').text('Name'),
                $('<td>').text(data.name)
            ),
            $('<tr>').append(
                $('<th>').text('Phone Number'),
                $('<td>').text(data.phoneNumber)
            ),
            $('<tr>').append(
                $('<th>').text('Address'),
                $('<td>').text(data.address)
            ),
            $('<tr>').append(
                $('<th>').text('Email'),
                $('<td>').text(data.email)
            )
        );
    },
    error: function (err) {
        var memberInfo = $('#member-info');
        memberInfo.empty(); // Clear any existing content

        // Append new rows with fetched data
        memberInfo.append(
            $('<tr>').append(
                $('<th>').text('Name'),
                $('<td>').text(user.name)
            ),
            $('<tr>').append(
                $('<th>').text('Phone Number'),
                $('<td>').text(user.phoneNumber)
            ),
            $('<tr>').append(
                $('<th>').text('Address'),
                $('<td>').text(user.address)
            ),
            $('<tr>').append(
                $('<th>').text('Email'),
                $('<td>').text(user.email)
            )
        );
    }
});