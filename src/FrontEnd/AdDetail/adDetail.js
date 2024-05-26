$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');
  console.log("Ad ID:", adId);

  $('#backButton').click(function() {
    window.location.href = '../main/main.html?userId=' + userId;
});

  // Функция для получения HTML кода для деталей объявления
  function getAdDetailHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad-detail');

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

      const name = document.createElement('p');
      name.textContent = `Имя нашедшего: ${ad.name}`;

      const phone = document.createElement('p');
      phone.textContent = `Телефон: ${ad.phone}`;

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
      adContainer.appendChild(name);
      adContainer.appendChild(phone);

      return adContainer;
  }

  // Функция для загрузки деталей объявления с сервера
  function loadAdDetail() {
      const container = document.getElementById('adDetailContainer');
      container.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных
      console.log("Попытка загрузить детали объявления");

      fetch(`/adDetail?id=${adId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(data => {
              console.log('Fetched ad detail:', data); // Вывод данных в консоль
              container.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных
              container.appendChild(getAdDetailHTML(data));
          })
          .catch(error => {
              console.error('Ошибка:', error);
              container.innerHTML = ''; // Очищаем контейнер перед добавлением сообщения об ошибке
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  // Изначальная загрузка деталей объявления
  loadAdDetail();
});
