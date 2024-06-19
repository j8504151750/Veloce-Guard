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
  const country = document.getElementById('country_signup').value;
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
        country: country,
        pincode: pincode
      }
  };

   // Use fetch to send the data to the server
   fetch('http://10.0.103.168:8080/api/register', {  
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accress-COntrol-Allow-Origin': '*'
    },
    body: JSON.stringify(data), 
})
.then(response => response.json()) 
.then(data => {
    console.log('Success:', data); 
})
.catch((error) => {
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
  fetch('http://10.0.103.168:8080/api/login', {  // Adjust '/login' with your actual login route on the server
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Login Success:', data);
    //   window.location.href = '/'
    //   if (data.success) {
    //       // Redirect user or handle login success scenario
    //       window.location.href = '/home'; // Example: redirect to home page after successful login
    //   }
    //   else {
    //       // Handle login failure scenario
    //       alert('Login failed. Please check your credentials.');
    //   }
  })
  .catch((error) => {
      console.error('Login Error:', error);
  });
});

