$(document).ready(function() {
  // const urlParams = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('userId');

  if (userId) {
    $('#profileLink').attr('href', `../profile/profile.html?userId=${userId}`).show();
      console.log('Пользователь с ID ' + userId + ' вошел в систему.');
      // Получаем информацию о пользователе с сервера
      fetch(`/profile/${userId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке профиля пользователя');
              }
              return response.json();
          })
          .then(user => {
              console.log('Получен профиль пользователя:', user);
              // Проверяем роль пользователя
              if (user.role === 'admin') {
                  $('#profileLink').show();
                  $('#myAdsLink').show();
                  $('#settingsLink').show();
                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
                  // Показываем элементы для администратора
                  $('#adminControls').show();
              } else if (user.role === 'moderator') {
                  $('#profileLink').show();
                  $('#myAdsLink').show();
                  $('#settingsLink').show();
                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
                  // Показываем элементы для модератора
                  $('#moderatorControls').show();
              } else {
                  $('#profileLink').show();
                  $('#myAdsLink').show();
                  $('#settingsLink').show();
                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
              }
          })
          .catch(error => {
              console.error('Ошибка:', error);
              $('#loginRegisterLink').show();
          });
  } else {
      console.log('Пользователь не вошел в систему.');
  }

  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id);

      
      const image = document.createElement('img');
    image.src = ad.photoUrl ? `../uploads/${ad.photoUrl}` : '../uploads/default-image.jpg'; // Загрузка изображения по пути из объявления
    image.alt = ad.title;
    adContainer.appendChild(image);


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
          window.location.href = `../AdDetail/adDetail.html?adId=${adId}`;
      });

      return adContainer;
  }

  function loadAds(sortByDate = false, filterStatus = null, daysRange = 365) {
      const container = document.getElementById('adContainer');
      container.innerHTML = '';
      console.log("Попытка загрузить объявления");

      fetch(`/ads?sortByDate=${sortByDate}&filterStatus=${filterStatus}&daysRange=${daysRange}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(data => {
              console.log('Fetched ads:', data);
              container.innerHTML = '';
              data.forEach(ad => {
                  container.appendChild(getAdHTML(ad));
              });
          })
          .catch(error => {
              console.error('Ошибка:', error);
              container.innerHTML = '';
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  $('#resetButton').click(function() {
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
      loadAds(false, null, 7);
  });

  $('#lastMonthButton').click(function() {
      loadAds(false, null, 31);
  });

  $('#logoutLink').click(function(event) {
      event.preventDefault();
      localStorage.removeItem('userId');
      window.location.href = '../LoginOrRegistration/logreg.html';
  });

  loadAds();
});
