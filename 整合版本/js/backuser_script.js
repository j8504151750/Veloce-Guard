// $(document).ready(function () {
//     // Fetch initial data
//     fetchUsers();

//     // 點擊編輯按鈕時，打開模態視窗並填充用戶數據
//     $(document).on('click', '.gd-pencil', function () {
//         const userId = $(this).closest('tr').data('user-id');
//         const user = users.find(u => u.id === userId);

//         $('#editUserId').val(user.id);
//         $('#editUserName').val(user.firstName);
//         $('#editUserEmail').val(user.email);
//         $('#editUserStatus').val(user.status);

//         $('#editUserModal').modal('show');
//     });

//     提交編輯表單
//     $('#editUserForm').submit(function (e) {
//         e.preventDefault();

//         const userId = $('#editUserId').val();
//         const updatedUser = {
//             firstName: $('#editUserName').val(),
//             email: $('#editUserEmail').val(),
//             status: $('#editUserStatus').val(),
//         };

//         $.ajax({
//             url: `http://localhost:8080/api/admin/users/${userId}`, // 更改為你的 API URL
//             method: 'PUT',
//             contentType: 'application/json',
//             data: JSON.stringify(updatedUser),
//             success: function (response) {
//                 $('#editUserModal').modal('hide');
//                 fetchUsers(); // 重新獲取用戶數據並刷新表格
//             },
//             error: function (err) {
//                 console.error('Error updating user:', err);
//             }
//         });
//     });
// });