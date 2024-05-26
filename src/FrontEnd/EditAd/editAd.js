$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');
  console.log("Ad ID:", adId);

  function loadAdDetail() {
      fetch(`/adDetail?id=${adId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(ad => {
              $('#title').val(ad.title);
              $('#description').val(ad.description);
              $('#date').val(new Date(ad.date).toISOString().split('T')[0]);
              $('#location').val(ad.location);
              $('#status').val(ad.status.toString());
              $('#name').val(ad.name);
              $('#phone').val(ad.phone);
              $('#photoUrl').val(ad.photoUrl);
          })
          .catch(error => {
              console.error('Ошибка:', error);
              const container = document.getElementById('adEditContainer');
              container.innerHTML = '';
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  $('#editAdForm').submit(function(event) {
      event.preventDefault();

      const updatedAd = {
          id: adId,
          title: $('#title').val(),
          description: $('#description').val(),
          date: $('#date').val(),
          location: $('#location').val(),
          status: $('#status').val() === 'true',
          name: $('#name').val(),
          phone: $('#phone').val(),
          photoUrl: $('#photoUrl').val()
      };

      fetch('/updateAd', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAd)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Ошибка при обновлении объявления');
          }
          return response.json();
      })
      .then(data => {
          alert('Объявление успешно обновлено');
          window.location.href = `../AdDetail/adDetail.html?adId=${adId}`;
      })
      .catch(error => {
          console.error('Ошибка:', error);
          alert('Ошибка при обновлении объявления. Пожалуйста, попробуйте еще раз позже.');
      });
  });

  // Загрузка деталей объявления при загрузке страницы
  loadAdDetail();
});
