$(document).ready(function() {
  // Получение данных профиля пользователя
  $(document).ready(function() {
    // Извлечение ID пользователя из локального хранилища
    const userId = localStorage.getItem('userId');

    // Если пользователь не вошел в систему, перенаправить на страницу входа
    if (!userId) {
        window.location.href = '../LoginOrRegistration/logreg.html';
    }

    // Загрузка профиля пользователя
    loadUserProfile(userId);

    // Обработчик нажатия на кнопку "Редактировать"
    $('#editButton').click(function() {
        $('#passwordFields').show(); // Показать поля с паролем
        $('#editButton').hide(); // Скрыть кнопку "Редактировать"
        $('#saveButton').show(); // Показать кнопку "Сохранить"
        $('#profileForm input').removeAttr('readonly'); // Разрешить редактирование полей
    });

    // Обработчик отправки формы
    $('#profileForm').submit(function(event) {
        event.preventDefault();
        // Ваша логика сохранения профиля
        // После сохранения профиля скрываем поля с паролем и кнопку "Сохранить"
        $('#passwordFields').hide();
        $('#saveButton').hide();
        $('#editButton').show();
        $('#profileForm input').attr('readonly', 'readonly'); // Запретить редактирование полей
    });

    // Функция загрузки профиля пользователя
    function loadUserProfile(userId) {
      $.get('/profile', function(data) {
        $('#surname').val(data.surname);
        $('#name').val(data.name);
        $('#middlename').val(data.middlename);
        $('#phone').val(data.phone);
    });
        // Ваш код загрузки профиля пользователя по userId
        // Например, вы можете использовать AJAX запрос для загрузки данных с сервера и заполнить поля формы
    }
});


  // Сохранение изменений профиля пользователя
  $('#profileForm').submit(function(event) {
    event.preventDefault();
    const surname = $('#surname').val();
    const name = $('#name').val();
    const middlename = $('#middlename').val();
    const phone = $('#phone').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    if (newPassword !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    const profileData = {
        surname: surname,
        name: name,
        middlename: middlename,
        phone: phone,
        newPassword: newPassword
    };

    $.ajax({
        url: '/profile',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(profileData),
        success: function(response) {
            alert('Профиль успешно обновлен');
            loadProfile();
        },
        error: function(error) {
            alert('Ошибка при обновлении профиля');
        }
    });
});

  // // Загрузка профиля при открытии страницы
  // loadProfile();
});
