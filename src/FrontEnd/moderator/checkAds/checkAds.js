$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');
  console.log("Ad ID:", adId);

  $('#backButton').click(function() {
    window.location.href = '../moderationAds/moderationAds.html?';
});

  // Функция для получения HTML кода для деталей объявления
  function getAdDetailHTML(ad) {
    const adContainer = document.createElement('div');
    adContainer.classList.add('ad-detail');
  
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
  
    const image = document.createElement('img');
    image.src = ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg';
    image.alt = ad.title;
    
    imageContainer.appendChild(image);
  
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details-container');
  
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
  
    detailsContainer.appendChild(title);
    detailsContainer.appendChild(description);
    detailsContainer.appendChild(date);
    detailsContainer.appendChild(location);
    detailsContainer.appendChild(status);
    detailsContainer.appendChild(name);
    detailsContainer.appendChild(phone);
  
    adContainer.appendChild(imageContainer);
    adContainer.appendChild(detailsContainer);
  
    // Добавляем кнопки "Подтвердить" и "Отклонить"
   


    return adContainer;
}

// Функция для обновления статуса модерации
function updateModerationStatus(adId, status) {
  fetch('/updateAdStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: adId, moderationStatus: status })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при обновлении статуса');
    }
    return response.json();
  })
  .then(data => {
    console.log('Status updated:', data);
    // loadAdDetail(); // Обновляем детали объявления после изменения статуса
    window.location.href = '../moderationAds/moderationAds.html';
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
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

          const buttonsContainer = document.getElementById('buttons-container');
      
          const acceptButton = document.createElement('button');
          acceptButton.textContent = 'Подтвердить';
          acceptButton.classList.add('accept-button');
          acceptButton.onclick = () => updateModerationStatus(adId, 'Accepted');
      
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Отклонить';
          cancelButton.classList.add('cancel-button');
          cancelButton.onclick = () => updateModerationStatus(adId, 'Canceled');
          
          buttonsContainer.append(acceptButton);
          buttonsContainer.append(cancelButton);

  }

  // Изначальная загрузка деталей объявления
  loadAdDetail();
});
