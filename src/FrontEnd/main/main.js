$(document).ready(function() {

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  // Проверка, осуществлен ли вход
  if (userId) {
      console.log('Пользователь с ID ' + userId + ' вошел в систему.');
      $('#profileLink').show();
        $('#myAdsLink').show();
        $('#settingsLink').show();
        $('#logoutLink').show();
        // Скрыть ссылки на "Вход" и "Регистрацию"
        $('#loginRegisterLink').hide();
      // Здесь вы можете выполнить дополнительные действия, связанные с входом пользователя
  } else {
      console.log('Пользователь не вошел в систему.');
  }
  // Функция для получения HTML кода объявления
  function getAdHTML(ad) {
    let adHTML = `<p><strong>Название:</strong> ${ad.title}</p>
                  <p><strong>Описание:</strong> ${ad.description}</p>
                  <p><strong>Дата:</strong> ${new Date(ad.date).toLocaleDateString()}</p>`;
    return `<div class="ad">${adHTML}</div>`;
}

function loadAds(sortByDate = false) {
    $.get('/ads', { sortByDate: sortByDate }, function(data) {
        $('#adContainer').empty();
        data.forEach(function(ad) {
            $('#adContainer').append(getAdHTML(ad));
        });
    });
}

  // Функция для загрузки объявлений с сервера
  function loadAds(sortByDate = false) {
      $.get('/ads', { sortByDate: sortByDate }, function(data) {
          $('#adContainer').empty();
          data.forEach(function(ad) {
              $('#adContainer').append(getAdHTML(ad));
          });
      });
  }

  // Обработчик кнопки сортировки
  $('#sortButton').click(function() {
      loadAds(true);
  });

  // Обработчик кнопки сброса
  $('#resetButton').click(function() {
      loadAds();
  });

  $('#logoutLink').click(function(event) {
    event.preventDefault();
    // Очистка локального хранилища и перенаправление на страницу входа
    localStorage.removeItem('userId');
    window.location.href = '../LoginOrRegistration/logreg.html';
});

  // Изначальная загрузка объявлений
  loadAds();
});
