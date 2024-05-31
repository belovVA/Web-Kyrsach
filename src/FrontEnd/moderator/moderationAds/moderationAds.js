$(document).ready(function() {
  const userId = localStorage.getItem('userId');
// Передача статуса модерации при загрузке объявлений
function loadAds(moderationStatus) {
  console.log(moderationStatus);
  $.get('/adsModeration', { moderationStatus: moderationStatus }, function(ads) {
      $('#adsContainer').empty();
      ads.forEach(ad => {
          const adContainer = getAdHTML(ad);
          $('#adsContainer').append(adContainer);
      });
  }).fail(function(error) {
      alert('Ошибка при загрузке объявлений');
      console.error('Error fetching ads:', error);
  });
}

$('#backButton').click(function() {
  window.location.href = '../../main/main.html?userId=' + userId;
});


// Обработка клика на кнопках фильтрации по статусу модерации
$('#pendingButton').click(function() {
  loadAds('Watching');
});

$('#acceptedButton').click(function() {
  loadAds('Accepted');
});

$('#rejectedButton').click(function() {
  loadAds('Canceled');
});

  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id);

      const image = document.createElement('img');
      image.src = ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg';
      image.alt = ad.title;
      image.classList.add('menu-item-image');
      adContainer.appendChild(image);

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('ad-info');

      const title = document.createElement('h2');
      title.textContent = ad.title;
      infoContainer.appendChild(title);

      const date = document.createElement('p');
      date.textContent = `Дата: ${new Date(ad.date).toLocaleDateString()}`;
      infoContainer.appendChild(date);

      const location = document.createElement('p');
      location.textContent = `Местоположение: ${ad.location}`;
      infoContainer.appendChild(location);

      const status = document.createElement('p');
      status.textContent = `Статус: ${ad.moderationStatus}`;
      infoContainer.appendChild(status);

      adContainer.appendChild(infoContainer);

      adContainer.addEventListener('click', () => {
          const adId = adContainer.getAttribute('data-id');
          window.location.href = `../checkAds/checkAds.html?adId=${adId}`;
      });

      return adContainer;
  }


  // Изначальная загрузка объявлений с первоначальным фильтром
  loadAds('Watching');
});
