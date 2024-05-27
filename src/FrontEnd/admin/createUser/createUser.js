$(document).ready(function() {
  $('#createUserForm').submit(function(event) {
      event.preventDefault();

      if ($('#password').val() !== $('#confirmPassword').val()) {
          alert('Пароли не совпадают!');
          return;
      }

      const newUser = {
          lastName: $('#surname').val(),
          firstName: $('#name').val(),
          middleName: $('#middlename').val(),
          phone: $('#phone').val(),
          role: $('#role').val(),
          password: $('#password').val()
      };

      $.ajax({
          url: '/usersNew',
          method: 'POST',
          data: JSON.stringify(newUser),
          contentType: 'application/json',
          success: function(response) {
              alert('Пользователь успешно создан!');
              window.location.href = '../manageAccounts/manageAccounts.html';
          },
          error: function(error) {
              alert('Ошибка при создании пользователя!');
          }
      });
  });

  $('#backButton').click(function() {
      window.location.href = '../manageAccounts/manageAccounts.html';
  });
});
