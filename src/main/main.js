$(document).ready(function() {
  // Функция для получения HTML кода объявления
  function getAdHTML(ad) {
      let adHTML = `<p><strong>Название:</strong> ${ad.title}</p>
                    <p><strong>Описание:</strong> ${ad.description}</p>
                    <p><strong>Дата:</strong> ${new Date(ad.date).toLocaleDateString()}</p>`;
      return `<div class="ad">${adHTML}</div>`;
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

  // Изначальная загрузка объявлений
  loadAds();
});
