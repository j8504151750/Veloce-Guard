
$(document).ready(function () {
    $.ajax({
      url: "http://localhost:8080/api/public/categories/防摔衣/products",
      type: "GET",
      contentType: "application/json",
  
      
      success: async function (response) {
        console.log(response);
          const productPromises = response
            .filter(product => product.productId > 12 && product.productId < 20)
            .map(async function (product) {
              const firstVariantImage = await return_image(product.productId);
              return {
                product: product,
                image: firstVariantImage
              };
            });
    
          const productsWithImages = await Promise.all(productPromises);
    
          productsWithImages.forEach(({ product, image }) => {
            $("#productContainer").append(
              `<div class="product col-4 float-left">
                  <div class="image-container">
                      <img src="${image}" alt="${product.name}" />
                  </div>
    
                  <div style="font-size: 20px;" class="product-name">${product.name}</div><br>
                  <a href="itemDesJT.html?productId=${product.productId}" class="btn btn-secondary" style="width:100%; height:50px; margin-bottom:50px;">點我看詳細</a>
                  
              </div>`
            );
          });
        },
  
      error: function (error) {
        console.log("Failed to load products:", error);
      },
    });
  });
  
  // 定義 return_image 函數
  var return_image = (productId) => {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: `http://localhost:8080/api/public/product/${productId}/variant/images`,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
          var str = response[0]; // 假設這裡 response 是一個字串陣列，取第一個元素
          resolve(str); // 將圖片字串傳遞給 Promise 的 resolve 函數
        },
        error: function (error) {
          reject(error); // 如果請求失敗，則呼叫 reject 函數
        },
      });
    });
  };
  