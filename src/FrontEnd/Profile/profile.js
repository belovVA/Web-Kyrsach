$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
      window.location.href = '../LoginOrRegistration/logreg.html';
  }

  loadUserProfile(userId);

  $('#editButton').click(function() {
      $('#passwordFields').show();
      $('#editButton').hide();
      $('#saveButton').show();
      $('#profileForm input').removeAttr('readonly');
  });

  $('#profileForm').submit(function(event) {
      event.preventDefault();

      if ($('#newPassword').val() !== $('#confirmPassword').val()) {
          alert('Пароли не совпадают!');
          return;
      }

      const updatedProfile = {
          lastName: $('#surname').val(),
          firstName: $('#name').val(),
          middleName: $('#middlename').val(),
          phone: $('#phone').val(),
          password: $('#newPassword').val() ? $('#newPassword').val() : undefined // Если пароль не указан, то это поле будет undefined
      };

      $.ajax({
          url: '/profile/' + userId,
          method: 'PUT',
          data: JSON.stringify(updatedProfile),
          contentType: 'application/json',
          success: function(response) {
              alert('Профиль успешно обновлен!');
              $('#passwordFields').hide();
              $('#saveButton').hide();
              $('#editButton').show();
              $('#profileForm input').attr('readonly', 'readonly');
          },
          error: function(error) {
              alert('Ошибка при обновлении профиля!');
          }
      });
  });

  $('#backButton').click(function() {
    window.location.href = '../main/main.html?userId=' + userId;
});
  function loadUserProfile(userId) {
      $.get('/profile/' + userId, function(user) {
          $('#surname').val(user.lastName);
          $('#name').val(user.firstName);
          $('#middlename').val(user.middleName);
          $('#phone').val(user.phone);
      });
  }
});
