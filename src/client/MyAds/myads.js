$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  $('#backButton').click(function() {
      window.location.href = '../main/main.html?userId=' + userId;
  });

  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id);

      const image = document.createElement('img');
      image.src = ad.photoUrl ? '../uploads/' + ad.photoUrl : '../uploads/no-image-thumb.jpg';
      image.alt = ad.title;
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
      status.textContent = `Статус: ${ad.status ? 'Найден' : 'Не найден'}`;
      infoContainer.appendChild(status);

      adContainer.appendChild(infoContainer);

      adContainer.addEventListener('click', () => {
          const adId = adContainer.getAttribute('data-id');
          window.location.href = `../EditAd/editAd.html?adId=${adId}`;
      });

      return adContainer;
  }

  function loadAds(sortByDate = false, filterStatus = null, searchQuery = '', daysRange = 365) {
      const container = document.getElementById('adContainer');
      container.innerHTML = '';

      fetch(`/user-ads?userId=${userId}&sortByDate=${sortByDate}&filterStatus=${filterStatus}&daysRange=${daysRange}&searchQuery=${searchQuery}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(data => {
              container.innerHTML = '';

              for (const status in data) {
                  const statusContainer = document.createElement('div');
                  statusContainer.classList.add('status-group');
                  
                  const statusHeader = document.createElement('h3');
                  statusHeader.textContent = `Статус модерации: ${status}`;
                  statusContainer.appendChild(statusHeader);

                  data[status].forEach(ad => {
                      statusContainer.appendChild(getAdHTML(ad));
                  });

                  container.appendChild(statusContainer);
              }
          })
          .catch(error => {
              console.error('Ошибка:', error);
              container.innerHTML = '';
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  $('#searchButton').click(function() {
      const searchQuery = $('#searchInput').val();
      loadAds(false, null, searchQuery);
  });

  $('#resetButton').click(function() {
      $('#searchInput').val('');
      loadAds();
  });

  $('#allAdsButton').click(function() {
      loadAds(false, null);
  });

  $('#ownerNotFoundButton').click(function() {
      loadAds(false, false);
  });

  $('#ownerFoundButton').click(function() {
      loadAds(false, true);
  });

  $('#last7DaysButton').click(function() {
      loadAds(false, null, '', 7);
  });

  $('#lastMonthButton').click(function() {
      loadAds(false, null, '', 31);
  });

  $('#logoutLink').click(function(event) {
      event.preventDefault();
      localStorage.removeItem('userId');
      window.location.href = '../LoginOrRegistration/logreg.html';
  });

  loadAds();
});