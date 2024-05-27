$(document).ready(function() {
  function loadAds(status) {
      $.get('/ads', { status }, function(ads) {
          $('#adsContainer').empty();
          ads.forEach(ad => {
              $('#adsContainer').append(`
                  <div class="ad">
                      <div id="adTitle">${ad.title}</div>
                      <div id="adDescription">${ad.description}</div>
                      <div id="adPrice">${ad.price} руб.</div>
                      <a href="#">Подробнее</a>
                  </div>
              `);
          });
      }).fail(function(error) {
          alert('Ошибка при загрузке объявлений');
          console.error('Error fetching ads:', error);
      });
  }

  $('.filter-button').click(function() {
      const status = $(this).data('status');
      loadAds(status);
  });

  $('#backButton').click(function() {
      window.location.href = '../main/main.html';
  });

  // Загрузка объявлений на рассмотрении при загрузке страницы
  loadAds('На рассмотрении');
});
