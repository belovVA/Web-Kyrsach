$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');

  $('#backButton').click(function() {
    window.location.href = '../main/main.html';
});

  // Функция для загрузки деталей объявления с сервера
  function loadAdDetail() {
      $.get('/adDetail', { id: adId }, function(ad) {
          $('#adImage').attr('src', ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg');
          $('#adTitle').text(ad.title);
          $('#adDate').text(`Дата: ${new Date(ad.date).toLocaleDateString()}`);
          $('#adLocation').text(`Местоположение: ${ad.location}`);
          $('#adStatus').text(`Статус: ${ad.status ? 'Найден' : 'Не найден'}`);
          $('#adName').text(`Имя нашедшего/Потерявшего: ${ad.name}`);
          $('#adDescription').text(`Описание: ${ad.description}`);
      }).fail(function(error) {
          alert('Ошибка при загрузке деталей объявления');
          console.error('Error fetching ad details:', error);
      });
  }

  // Изначальная загрузка деталей объявления
  loadAdDetail();
});
