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
      $('#loginRegisterLink').hide();
  } else {
      console.log('Пользователь не вошел в систему.');
  }

  // Функция для получения HTML кода объявления
  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id); // Устанавливаем data-id атрибут

      const title = document.createElement('h2');
      title.textContent = ad.title;

      const description = document.createElement('p');
      description.textContent = ad.description;

      const date = document.createElement('p');
      date.textContent = `Дата: ${new Date(ad.date).toLocaleDateString()}`;

      const location = document.createElement('p');
      location.textContent = `Местоположение: ${ad.location}`;

      const status = document.createElement('p');
      status.textContent = `Статус: ${ad.status ? 'Найден' : 'Не найден'}`;

      if (ad.photoUrl) {
          const image = document.createElement('img');
          image.src = ad.photoUrl;
          image.alt = ad.title;
          adContainer.appendChild(image);
      }

      adContainer.appendChild(title);
      adContainer.appendChild(description);
      adContainer.appendChild(date);
      adContainer.appendChild(location);
      adContainer.appendChild(status);
      console.log(ad._id); // Получаем ID из data-id атрибута

      adContainer.addEventListener('click', () => {
          const adId = adContainer.getAttribute('data-id');
          console.log(adId); // Получаем ID из data-id атрибута
          window.location.href = `../AdDetail/adDetail.html?adId=${adId}`; // Перенаправление на страницу с деталями объявления с передачей ID
      });

      return adContainer;
  }

  // Функция для загрузки объявлений с сервера
  function loadAds(sortByDate = false, filterStatus = null, daysRange = 365) {
      const container = document.getElementById('adContainer');
      container.innerHTML = ''; // Очищаем контейнер перед добавлением новых объявлений
      console.log("Попытка загрузить объявления");

      fetch(`/ads?sortByDate=${sortByDate}&filterStatus=${filterStatus}&daysRange=${daysRange}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(data => {
              console.log('Fetched ads:', data); // Вывод данных в консоль
              container.innerHTML = ''; // Очищаем контейнер перед добавлением новых объявлений
              data.forEach(ad => {
                  container.appendChild(getAdHTML(ad));
              });
          })
          .catch(error => {
              console.error('Ошибка:', error);
              container.innerHTML = ''; // Очищаем контейнер перед добавлением сообщения об ошибке
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  // Обработчики кнопок фильтрации и сортировки
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

  // Изначальная загрузка объявлений
  loadAds();
});
