$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  
  if (!userId) {
      window.location.href = '../LoginOrRegistration/logreg.html';
  }

  // Загрузка профиля пользователя для автозаполнения
  loadUserProfile(userId);

  // Отправка формы объявления
  $('#adForm').submit(function(event) {
      event.preventDefault();

      // Получение данных из формы
      const adData = {
          title: $('#title').val(),
          description: $('#description').val(),
          date: $('#date').val(),
          location: $('#location').val(),
          contactName: $('#contactName').val(),
          contactPhone: $('#contactPhone').val()
      };

      // Отправка данных на сервер для создания объявления
      $.ajax({
          url: '/createAd',
          method: 'POST',
          data: JSON.stringify(adData),
          contentType: 'application/json',
          success: function(response) {
              alert('Объявление успешно добавлено!');
              // Перенаправление на другую страницу или выполнение других действий
          },
          error: function(error) {
              alert('Ошибка при добавлении объявления!');
          }
      });
  });

  // Функция для получения ID пользователя из URL
  function getUserIdFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('userId');
  }

  // Функция для загрузки профиля пользователя для автозаполнения
  function loadUserProfile(userId) {
      $.get('/profile/' + userId, function(user) {
          $('#contactName').val(user.firstName); // Предполагаем, что имя пользователя хранится в поле firstName
          $('#contactPhone').val(user.phone); // Предполагаем, что номер телефона пользователя хранится в поле phone
      });
  }
});
