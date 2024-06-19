
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'http://10.0.103.168:8080/api/public/products?pageNumber=0&pageSize=30&sortBy=productId&sortOrder=asc',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg1OTUzNzcsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.g6EvA2T04b2HNn127rHrOPz-Syr51RNPFOQm6eQCL6M'
        },
        success: function (products) {
            // Loop through each product and append it to the product container
            $.each(products, function (index, product) {
                var productHTML = `
                <div class="product col-4 float-left">
                  <div class="image-container">
                    <a href="${product.productName}">
                      <img src="${product.image}" alt="">
                    </a>
                  </div>
                </div>`;

                $('#productContainer').append(productHTML);
            });
        },
        error: function (err) {
            console.log(err);
            var products = err.responseJSON.content;
            console.log(products);
            // Loop through each product and append it to the product container
            $.each(products, function (index, product) {
                console.log(product.productName);
                var n = product.productName;
                var productHTML = `
                <div class="product col-4 float-left">
                    <div class="image-container">
                        <img src="" alt="">
                        <a href="${product.productName}">
                        <span>${n}</span>
                        </a><br>
                        <input type="button" value="加入購物車" style="width:100%; height:50px; margin-bottom:50px;">
                        <br>
                    </div>
                </div>`;
                $('#productContainer').append(productHTML);

                //     $('#productContainer').append(productHTML);
                // $.each(product.productVariants, function (index, productVariant) {

                //     var productHTML = `
                //     <div class="product col-4 float-left">
                //       <div class="image-container">
                //         <a href="${product.productName}">
                //           <span>${n}</span>
                //           <img src="${productVariant.image}" alt="">
                //         </a>
                //       </div>
                //     </div>`;

                //     $('#productContainer').append(productHTML);
                // })
            });
        }

    });
});