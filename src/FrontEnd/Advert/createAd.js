$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
      window.location.href = '../LoginOrRegistration/logreg.html';
  }

  // Загрузка профиля пользователя для автозаполнения
  loadUserProfile(userId);

  $('#backButton').click(function() {
      window.location.href = '../main/main.html?userId=' + userId;
  });

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
          contactPhone: $('#contactPhone').val(),
          userId: userId
      };

      // Получение файла изображения и компрессия перед отправкой на сервер
      const fileInput = $('#photo')[0];
      if (fileInput.files && fileInput.files[0]) {
          new Compressor(fileInput.files[0], {
              quality: 0.6,
              success(result) {
                  const formData = new FormData();
                  formData.append('photo', result);

                  $.ajax({
                      url: '/uploadPhoto',
                      method: 'POST',
                      data: formData,
                      contentType: false,
                      processData: false,
                      success: function(response) {
                          adData.photoUrl = response.photoUrl;
                          sendAdData(adData);
                      },
                      error: function(error) {
                          alert('Ошибка при загрузке фотографии!');
                      }
                  });
              },
              error(err) {
                  console.error(err.message);
              },
          });
      } else {
          sendAdData(adData);
      }
  });

  // Функция для отправки данных на сервер
  function sendAdData(adData) {
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
  }

  // Функция для загрузки профиля пользователя для автозаполнения
  function loadUserProfile(userId) {
      $.get('/profile/' + userId, function(user) {
          $('#contactName').val(user.firstName); // Предполагаем, что имя пользователя хранится в поле firstName
          $('#contactPhone').val(user.phone); // Предполагаем, что номер телефона пользователя хранится в поле phone
      });
  }
});
