const logregBox = document.querySelector('.logreg-box');

const loginLink = document.querySelector('.login-link');

const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', () =>{
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () =>{
    logregBox.classList.remove('active');
});


// 確認使用者創建密碼時 密碼是否一致
var password = document.getElementById("password_signup")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;



// "註冊"資料到後端
document.getElementById('registerform').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const firstname = document.getElementById('firstname_signup').value;
  const lastname = document.getElementById('lastname_signup').value;
  
  const city = document.getElementById('city_signup').value;
  const street = document.getElementById('street_signup').value;
  const pincode = document.getElementById('pincode_signup').value;
  const mobileNumber = document.getElementById('mobileNumber_signup').value;
  const email = document.getElementById('email_signup').value;
  const password = document.getElementById('password_signup').value;

  // Create an object with the data
  const data = {
      
      firstName: firstname,
      lastName: lastname,
      mobileNumber: mobileNumber,
      email: email,
      password: password,

      address:{

        street: street,
        buildingName: "aaaaa",
        city: city,
        state: "aa",
        country: "taiwan",
        pincode: pincode
      }
  };

  

   // Use fetch to send the data to the server
   fetch('http://localhost:8080/api/register', {  
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), 
  })
  .then(response => {
    if (!response.ok) {
      // 如果服务器响应的 HTTP 状态码表示失败
      return response.json().then(errorData => {
        console.log(errorData);
        
        let errorMessage = '輸入錯誤請檢查: ';
        if (errorData.firstName) {
          errorMessage += `${errorData.firstName}\n`;
        }
        if (errorData.lastName) {
          errorMessage += `${errorData.lastName}\n`;
        }
        if (errorData.pincode) {
          errorMessage += `${errorData.pincode}\n`;
        }
        if (errorData.mobileNumber) {
          errorMessage += `${errorData.mobileNumber}\n`;
        }
        if (errorData.street) {
          errorMessage += `${errorData.street}\n`;
        }
        if (errorData.email) {
          errorMessage += `${errorData.email}\n`;
        }
        if (errorData.message) {
          errorMessage += `${errorData.message}\n`;
        }
        if (errorData.city) {
          errorMessage += `${errorData.city}\n`;
        }
        // 可以根據需要添加更多的錯誤處理
        alert(errorMessage);
    
        throw new Error(errorMessage);
      });
    }
    // 如果响应状态码为成功
    return response.json();
  })
  .then(data => {
    console.log('Success response data:', data); // 輸出成功回應的資料
      if(data['jwt-token']) {
        console.log('Registration successful, redirecting...'); // 確認 success 為 true
        localStorage.setItem('jwt-token', data['jwt-token']);
        window.location.href = 'index.html';
      } else {
          // 这里处理逻辑上的成功，但实际操作失败的情况
        console.log('Registration logic success but operation failed:', data);

          if(data.message) {
            alert(data.message);
          }
        
      }
  })
  .catch((error) => {
      // 这里捕获所有的错误，包括网络错误、JSON解析错误和上面抛出的错误
      console.error('Error:', error);
      
  });
});




//"登入"資訊傳到後端
// Handle the login form submission
document.getElementById('userform').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submit action

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Prepare the data to be sent to the server
  const loginData = {
      email: email,
      password: password
  };

  // Use the fetch API to send the login data to your server endpoint
  fetch('http://localhost:8080/api/login', {  
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
})
.then(response => response.json())
  .then(data => {
    if (data['jwt-token']) {
      console.log('Login successful, redirecting...'); // 確認成功
      localStorage.setItem('jwt-token', data['jwt-token']); // 將 jwt-token 存入 Local Storage
      console.log('Current JWT Token:', data);
      window.location.href = 'index.html';
    } else {
      throw new Error('Login failed');
    }
  })
  .catch((error) => {
    console.error('Login Error:', error);
  });
});


