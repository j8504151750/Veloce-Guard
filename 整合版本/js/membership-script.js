$(document).ready(function() {
    // Example API endpoint; replace with actual endpoint URL
   

    // order-info
    $.ajax({
        url: 'http://localhost:8080/api/public/users/'+emailId+'orders',
        type: 'GET',
        dataType: 'json', 
        headers:{
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTkzNzAxMDksImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.ZtDAkSxwjs0knMxF-1GOEutn_4KmB_176TmFks8rrWo'

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
                    $('<td>').text(order.productName),
                    $('<td>').text(order.quantity),
                    $('<td>').text('$' + order.productPrice)
                );

                // Append the row to the table body
                $('#orders .table tbody').append(row);
            });
        
        }
    });
});

 // Member-info
 $.ajax({

    url: 'http://localhost:8080/api/admin/users/1',
    type: 'GET',
    dataType: 'json',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTkzNzAxMDksImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.ZtDAkSxwjs0knMxF-1GOEutn_4KmB_176TmFks8rrWo'
    },
    success: function (data) {
        var memberInfo = $('#member-info');
        memberInfo.empty(); // Clear any existing content

        // Append new rows with fetched data
        memberInfo.append(
            $('<tr>').append(
                $('<th>').text('Name'),
                $('<td>').text(user.firstName+user.lastName)
            ),
            $('<tr>').append(
                $('<th>').text('Phone Number'),
                $('<td>').text(user.mobileNumber)
            ),
            $('<tr>').append(
                $('<th>').text('Address'),
                $('<td>').text(user.address.pincode+user.address.country+user.address.city+user.address.street)
            ),
            $('<tr>').append(
                $('<th>').text('Email'),
                $('<td>').text(user.email)
            )
        );
    },
    error: function (user) {
        var memberInfo = $('#member-info');
        memberInfo.empty(); // Clear any existing content

        // Append new rows with fetched data
        memberInfo.append(
            $('<tr>').append(
                $('<th>').text('Name'),
                $('<td>').text(user.firstName+user.lastName)
            ),
            $('<tr>').append(
                $('<th>').text('Phone Number'),
                $('<td>').text(user.mobileNumber)
            ),
            $('<tr>').append(
                $('<th>').text('Address'),
                $('<td>').text(user.address.pincode+user.address.country+user.address.city+user.address.street)
            ),
            $('<tr>').append(
                $('<th>').text('Email'),
                $('<td>').text(user.email)
            )
        );
    }
});