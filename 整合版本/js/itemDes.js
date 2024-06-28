$(document).ready(function() {

    $.ajax({
        url: 'http://localhost:8080/api/public/1/variants?pageNumber=0&pageSize=2&sortBy=productId&sortOrder=asc',
        type: 'GET',
        dataType: 'json', 
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTkzNzAxMDksImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.ZtDAkSxwjs0knMxF-1GOEutn_4KmB_176TmFks8rrWo'
        },
        success: function(data) {
            $('.image-sell').html('<img src="' + data.imageSrc + '" alt="' + data.name + '">');
            $('.product-introduction h2').text(data.name);
            $('.product-introduction p:first').text(data.description);
            $('.product-introduction p:last').text('價格: $ ' + data.price);
        },
        error: function(err) {
 

            console.log(err);
            // $('.image-sell').html('<img src="' + err.productVariants.image +'">');
            // $('.product-introduction h2').text(product.name);
            // $('.product-introduction p:first').text(product.description);
            // $('.product-introduction p:last').text('價格: $ ' + product.price);
        }
    });
});