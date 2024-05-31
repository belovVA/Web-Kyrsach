$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');
  let originalAdData = {};

  // Функция для загрузки деталей объявления с сервера
  function loadAdDetail() {

    $('#backButton').click(function() {
      window.location.href = '../myAds/myAds.html';
  });

      $.get('/adDetail', { id: adId }, function(ad) {
          $('#adImage').attr('src', ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg');
          $('#adTitle').text(ad.title);
          $('#adDate').text(ad.date.split('T')[0]); // Отображаем только дату без времени
          $('#adLocation').text(ad.location);
          $('#adStatus').text(ad.status ? 'Найден' : 'Не найден');
          $('#adName').text(ad.name);
          $('#adPhone').text(ad.phone);
          $('#adDescription').text(ad.description);

          // Сохраняем оригинальные данные
          originalAdData = {
              photoUrl: ad.photoUrl,
              title: ad.title,
              date: ad.date.split('T')[0], // Сохраняем дату без времени
              location: ad.location,
              status: ad.status,
              name: ad.name,
              phone: ad.phone,
              description: ad.description
          };
      }).fail(function(error) {
          alert('Ошибка при загрузке деталей объявления');
          console.error('Error fetching ad details:', error);
      });
  }

  // Функция для включения режима редактирования
  function enableEditing() {
      $('.editable').each(function() {
          const span = $(this);
          const id = span.attr('id');
          let input;
          if (id === 'adDate') {
              input = $('<input type="date">').val(span.text()).insertAfter(span);
          } else if (id === 'adDescription') {
              input = $('<textarea>').val(span.text()).insertAfter(span);
          } else {
              input = $('<input>').val(span.text()).insertAfter(span);
          }
          span.hide();
          input.show();
      });

      $('#editButton').hide();
      $('#saveButton, #cancelButton').show();
  }

  // Функция для сохранения изменений
  function saveChanges() {
      const updatedAd = {
          id: adId,
          title: $('#adTitle').next().val(),
          date: $('#adDate').next().val(), // Оставляем дату в строковом формате YYYY-MM-DD
          location: $('#adLocation').next().val(),
          status: $('#adStatus').next().val() === 'Найден',
          name: $('#adName').next().val(),
          phone: $('#adPhone').next().val(),
          description: $('#adDescription').next().val(),
          moderationStatus: 'Watching'
      };

      $.ajax({
          url: '/updateAd',
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedAd),
          success: function(response) {
              alert('Изменения сохранены');
              $('.editable').each(function() {
                  const span = $(this);
                  const input = span.next();
                  span.text(input.val()).show();
                  input.remove();
              });

              $('#editButton').show();
              $('#saveButton, #cancelButton').hide();
          },
          error: function(error) {
              alert('Ошибка при сохранении изменений');
              console.error('Error saving changes:', error);
          }
      });
  }

  // Функция для отмены изменений
  function cancelChanges() {
      $('.editable').each(function() {
          const span = $(this);
          const input = span.next();
          span.text(originalAdData[span.attr('id').replace('ad', '').toLowerCase()]).show();
          input.remove();
      });

      $('#adImage').attr('src', originalAdData.photoUrl ? `../../uploads/${originalAdData.photoUrl}` : '../../uploads/no-image-thumb.jpg');

      $('#editButton').show();
      $('#saveButton, #cancelButton').hide();
  }

  $('#editButton').click(enableEditing);
  $('#saveButton').click(saveChanges);
  $('#cancelButton').click(cancelChanges);

  // Изначальная загрузка деталей объявления
  loadAdDetail();
});
