
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/public/products?pageNumber=0&pageSize=30&sortBy=productId&sortOrder=asc',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJFdmVudCBTY2hlZHVsZXIiLCJpYXQiOjE3MTg3OTE3NTQsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.Fmr94KQD5GFs7oJn6eFyehXkrF5Jx2278uoECEylX5g'
        },
        success: function (response) {
            // Loop through each product and append it to the product container
            $.each(response, function (index, product) {
                
                var firstVariantImage = product.productVariants.length > 0 ? product.productVariants[0].image : '';
                
                var productHTML = `
                <div class="product col-4 float-left">
                  <div class="image-container">
                    <a href="${product.productName}">
                      <img src="${firstVariantImage}" alt="">
                    </a>
                  </div>
                </div>`;

                $('#productContainer').append(productHTML);
            });
        },
        error: function (err) {
            console.log(err);

            var products = err.responseJSON.content;
            
            // console.log(products);
            // Loop through each product and append it to the product container
            $.each(products, function (index, product) {
                if (index >= 0 && index < 10) {
                // console.log(product.productName);
                var firstVariantImage = product.productVariants.length > 0 ? product.productVariants[0].image : '默认图片URL';

                console.log(firstVariantImage);
                var n = product.productName;
                var productHTML = `
                <div class="product col-4 float-left">
                    <div class="image-container">
                        <img src="${firstVariantImage}" alt="${product.productName}">
                        <div>${n}</div>
                        
                        </div><br>
                        <input class="btn btn-secondary" type="button" value="加入購物車" style="width:100%; height:50px; margin-bottom:50px;">
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
                }
            });
        
        }

    });
});
const token = localStorage.getItem('jwt-token');
console.log('Current JWT Token:', token);