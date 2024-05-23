$(document).ready(function() {
  // Получение данных профиля пользователя
  function loadProfile() {
      $.get('/profile', function(data) {
          $('#surname').val(data.surname);
          $('#name').val(data.name);
          $('#middlename').val(data.middlename);
          $('#phone').val(data.phone);
      });
  }

  // Сохранение изменений профиля пользователя
  $('#profileForm').submit(function(event) {
      event.preventDefault();
      const surname = $('#surname').val();
      const name = $('#name').val();
      const middlename = $('#middlename').val();
      const phone = $('#phone').val();
      const newPassword = $('#newPassword').val();
      const confirmPassword = $('#confirmPassword').val();

      if (newPassword !== confirmPassword) {
          alert('Пароли не совпадают!');
          return;
      }

      const profileData = {
          surname: surname,
          name: name,
          middlename: middlename,
          phone: phone,
          newPassword: newPassword
      };

      $.ajax({
          url: '/profile',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(profileData),
          success: function(response) {
              alert('Профиль успешно обновлен');
              loadProfile();
          },
          error: function(error) {
              alert('Ошибка при обновлении профиля');
          }
      });
  });

  // Загрузка профиля при открытии страницы
  loadProfile();
});
